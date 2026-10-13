import { logDebug } from "../utils/logger";
const installed = new WeakSet();
let sequence = 0;

// Parse serialized JSON for readable logs without masking or modifying payloads.
export const sanitizeApiData = (value) => {
  if (typeof value === "string") {
    try {
      return JSON.parse(value);
    } catch {
      return value;
    }
  }
  return value;
};

const logUrl = (value) => String(value || "");
const requestUrl = (config) => {
  const url = String(config?.url || "");
  if (/^(?:[a-z][a-z\d+.-]*:)?\/\//i.test(url)) return logUrl(url);
  const base = String(config?.baseURL || "").replace(/\/+$/, "");
  return logUrl(base ? `${base}/${url.replace(/^\/+/, "")}` : url);
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
    return query;
  }
};
const start = (config) => {
  const trace = { requestId: ++sequence, startedAt: Date.now() };
  logDebug("API REQUEST", {
    requestId: trace.requestId,
    method: (config.method || "GET").toUpperCase(),
    endpoint: logUrl(config.url),
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
    endpoint: logUrl(config?.url),
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
