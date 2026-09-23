import { logDebug } from "../utils/logger";
import { ENDPOINTS } from "./apis/endpoints/Endpoints";

const sensitive =
  /token|password|secret|authorization|cookie|answer|jwt|pin(?!g)|email|phone|address|card|routing|ssn|cvv|firstname|lastname|birth|clientkey|\bip\b/i;
const installed = new WeakSet();
let sequence = 0;

// Log copies only; never modify request or response data.
export const sanitizeApiData = (value, depth = 0) => {
  if (depth > 8) return "[Omitted: depth limit]";
  if (value == null) return value;
  if (typeof value === "string") {
    if (depth > 0) return value;
    try {
      return sanitizeApiData(JSON.parse(value), depth + 1);
    } catch {
      return "[Text omitted]";
    }
  }
  if (typeof value !== "object") return value;
  if (Array.isArray(value))
    return value.map((item) => sanitizeApiData(item, depth + 1));
  if (typeof value.append === "function") return "[Multipart payload omitted]";
  return Object.fromEntries(
    Object.entries(value).map(([key, item]) => [
      key,
      sensitive.test(key.replace(/[_-]/g, ""))
        ? "[REDACTED]"
        : sanitizeApiData(item, depth + 1),
    ]),
  );
};

const endpointTemplates = Object.values(ENDPOINTS).map((endpoint) => {
  const path = endpoint.split("?")[0];
  const pattern = path
    .split(/(:\w+)/)
    .map((part) =>
      part.startsWith(":")
        ? "[^/]+"
        : part.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"),
    )
    .join("");
  return { path, regex: new RegExp(`${pattern}$`, "i") };
});
const safeUrl = (value) => {
  let path = String(value || "")
    .split(/[?#]/)[0]
    .replace(/\/\/[^/@]+:[^/@]+@/, "//[REDACTED]@");
  for (const template of endpointTemplates) {
    if (template.regex.test(path))
      return path.replace(template.regex, template.path);
  }
  return path
    .replace(/\d{6,}/g, "[REDACTED]")
    .replace(/[^/]+@[^/]+/g, "[REDACTED]");
};
const requestUrl = (config) => {
  const url = String(config?.url || "");
  if (/^(?:[a-z][a-z\d+.-]*:)?\/\//i.test(url)) return safeUrl(url);
  const base = String(config?.baseURL || "").replace(/\/+$/, "");
  return safeUrl(base ? `${base}/${url.replace(/^\/+/, "")}` : url);
};
const queryParams = (url) => {
  const query = String(url || "")
    .split("?")[1]
    ?.split("#")[0];
  if (!query) return undefined;
  try {
    return Object.fromEntries(
      query.split("&").map((part) => {
        const [key, ...value] = part.split("=");
        return [
          decodeURIComponent(key),
          decodeURIComponent(value.join("=").replace(/\+/g, " ")),
        ];
      }),
    );
  } catch {
    return "[Query omitted]";
  }
};
const start = (config) => {
  const trace = { requestId: ++sequence, startedAt: Date.now() };
  logDebug("API REQUEST", {
    requestId: trace.requestId,
    method: (config.method || "GET").toUpperCase(),
    endpoint: safeUrl(config.url),
    url: requestUrl(config),
    query: sanitizeApiData(queryParams(config.url)),
    params: sanitizeApiData(config.params),
    payload: sanitizeApiData(config.data),
  });
  return trace;
};
const finish = (config, status, data, failed = false) => {
  const trace = config?._apiLog;
  logDebug(failed ? "API ERROR" : "API RESPONSE", {
    requestId: trace?.requestId,
    method: (config?.method || "GET").toUpperCase(),
    endpoint: safeUrl(config?.url),
    url: requestUrl(config),
    statusCode: status ?? null,
    durationMs: trace ? Date.now() - trace.startedAt : null,
    response: sanitizeApiData(data),
  });
};

export const installApiLogging = (client) => {
  if (!__DEV__ || installed.has(client)) return;
  installed.add(client);
  client.interceptors.request.use((config) => {
    config._apiLog = start(config);
    return config;
  });
  client.interceptors.response.use(
    (response) => {
      finish(response.config, response.status, response.data);
      return response;
    },
    (error) => {
      finish(error.config, error.response?.status, error.response?.data, true);
      return Promise.reject(error);
    },
  );
};

// Cover the app's fetch calls as well without patching global fetch or consuming its response.
export const loggedFetch = async (url, options = {}) => {
  if (!__DEV__) return fetch(url, options);
  const config = { url, method: options.method, data: options.body };
  config._apiLog = start(config);
  let response;
  try {
    response = await fetch(url, options);
  } catch (error) {
    finish(config, null, null, true);
    throw error;
  }
  try {
    const body = await response.clone().text();
    finish(config, response.status, body, !response.ok);
  } catch {
    finish(
      config,
      response.status,
      "[Response body unavailable]",
      !response.ok,
    );
  }
  return response;
};
