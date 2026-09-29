import { ENDPOINTS, getEndpoint } from "../endpoints/Endpoints";
import { _axios } from "../../RestApiClient";
import { getUser } from "../../../redux/utils/LocalStorage";
import { logDebug } from "../../../utils/logger";

const required = (value, name) => {
  if (value == null || String(value).trim() === "")
    throw new Error(`${name} is unavailable`);
  return String(value).trim();
};
const number = (value) => {
  if (
    !["string", "number"].includes(typeof value) ||
    String(value).trim() === "" ||
    !Number.isFinite(Number(value)) ||
    Number(value) < 0
  ) {
    throw new Error("Invalid speed test measurement");
  }
  // Validate without coercing or rounding the original measurement.
  return value;
};
const optionalNumber = (value) => (value == null ? null : number(value));
const session = async (needsUser = false) => {
  const user = await getUser();
  return {
    account: required(user?.userInfo?.accountNumber, "Account number"),
    userId:
      needsUser === "eero"
        ? required(
            user?.userInfo?.userId ?? user?.userInfo?.accountNumber,
            "User ID",
          )
        : needsUser
        ? required(user?.userInfo?.userName, "User name")
        : undefined,
    config: {
      headers: {
        Authorization: `Bearer ${required(user?.token, "Session token")}`,
      },
      // Never replay reboot, test-start or history requests after a timeout.
      skipRetry: true,
    },
  };
};
const check = (data, codes) => {
  if (!data || data.error || !codes.includes(Number(data.statusCode))) {
    const error = new Error("Service request failed");
    error.serviceStatus = data?.statusCode;
    throw error;
  }
  return data;
};
const atStage = async (stage, execute) => {
  try {
    return await execute();
  } catch (error) {
    error.speedTestStage = stage;
    throw error;
  }
};
const identity = (account, idType, networkId) => {
  if (!["account", "network"].includes(idType))
    throw new Error("Invalid ID type");
  return {
    idType,
    id: idType === "network" ? required(networkId, "Network ID") : account,
    accountNumber: account,
  };
};
const details = async (context, idType, networkId) => {
  const response = await _axios.get(ENDPOINTS.EERO_SPEED_DETAILS, {
    ...context.config,
    params: identity(context.account, idType, networkId),
  });
  if (response.status === 204 || response.data == null) return null;
  const detail = check(response.data, [200]).detail;
  return detail == null
    ? null
    : {
        download: number(detail.download_Result),
        upload: number(detail.upload_Result),
        updated: detail.tstamp,
        id: detail.id,
      };
};
const results = async (context, idType, networkId) => {
  const response = await _axios.get(ENDPOINTS.EERO_SPEED_RESULTS, {
    ...context.config,
    timeout: 0,
    params: identity(context.account, idType, networkId),
  });
  if (response.status === 204 || response.data == null) return null;
  const payload = response.data;
  if (
    payload.error ||
    (payload.statusCode != null && Number(payload.statusCode) !== 200)
  )
    throw new Error("Unable to retrieve Eero results");
  const rows = payload.data;
  if (rows == null || (Array.isArray(rows) && !rows.length)) return null;
  if (!Array.isArray(rows)) throw new Error("Invalid speed test results");
  const latest = rows.reduce((newest, row) => {
    if (!Number.isFinite(Date.parse(row.date)))
      throw new Error("Invalid speed test date");
    return !newest || Date.parse(row.date) > Date.parse(newest.date)
      ? row
      : newest;
  }, null);
  return {
    download: number(latest.down_Mbps),
    upload: number(latest.up_Mbps),
    updated: latest.date,
    id: latest.id,
  };
};
const insert = async (context, result) => {
  const response = await _axios.post(
    ENDPOINTS.EERO_SPEED_HISTORY,
    {
      accountId: context.account,
      userId: context.userId,
      download_MBs: number(result.download),
      upload_MBs: number(result.upload),
      ping_Ms: optionalNumber(result.ping) ?? 0,
      jitter_Ms: optionalNumber(result.jitter) ?? 0,
      host: result.host ?? "",
    },
    context.config,
  );
  const saved = response.data?.historyResults;
  if (
    response.data !== true &&
    !(
      Number(saved?.statusCode) === 200 &&
      (saved?.result === true || saved?.result === "true")
    )
  )
    throw new Error("Unable to save speed test history");
  return true;
};
const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
const speedTestApi = {
  rebootModem: async (ip) => {
    const context = await session();
    const response = await _axios.post(
      ENDPOINTS.MODEM_REBOOT,
      {
        ip: ip == null || String(ip).trim() === "" ? null : String(ip).trim(),
        AccountNumber: context.account,
      },
      context.config,
    );
    if (check(response.data, [200, 202]).result !== true)
      throw new Error("Unable to reboot modem");
    return true;
  },
  getEeroDetails: async (idType = "account", networkId) =>
    details(await session(), idType, networkId),
  getEeroHistory: async () => {
    const context = await session();
    const response = await _axios.get(
      getEndpoint(ENDPOINTS.EERO_SPEED_HISTORY_GET, {
        accountId: encodeURIComponent(context.account),
      }),
      context.config,
    );
    if (response.status === 204 || response.data == null) return null;
    return {
      download: number(response.data.download_MBs),
      upload: number(response.data.upload_MBs),
      updated: response.data.createdOn,
    };
  },
  getLatestEeroResult: async () => {
    try {
      const saved = await speedTestApi.getEeroHistory();
      if (saved) return saved;
    } catch (error) {
      // Expired sessions must still be handled by authentication, not a fallback.
      if ([401, 403].includes(error?.response?.status)) throw error;
    }
    return speedTestApi.getEeroResults();
  },
  getEeroResults: async (idType = "account", networkId) =>
    results(await session(), idType, networkId),
  insertEeroHistory: async (result) => insert(await session("eero"), result),
  runEeroSpeedTest: async ({
    idType = "account",
    networkId,
    history = {},
    isCancelled = () => false,
  } = {}) => {
    const context = await atStage("session", () => session("eero"));
    // Record the previous timestamp so a 202 cannot cause old results to be saved.
    const previous = await atStage("previous-result", () =>
      results(context, idType, networkId),
    );
    if (isCancelled()) throw new Error("Speed test cancelled");
    await atStage("start", async () => {
      const response = await _axios.post(
        ENDPOINTS.EERO_SPEED_TEST,
        {
          idType,
          id: identity(context.account, idType, networkId).id,
          accountNumber: context.account,
        },
        context.config,
      );
      check(response.data, [200, 202]);
    });
    for (let attempt = 0; attempt < 24; attempt += 1) {
      if (attempt) await delay(5000);
      if (isCancelled()) throw new Error("Speed test cancelled");
      const result = await atStage("result", () =>
        results(context, idType, networkId),
      );
      if (isCancelled()) throw new Error("Speed test cancelled");
      if (
        !result?.updated ||
        (previous && Date.parse(result.updated) <= Date.parse(previous.updated))
      )
        continue;
      try {
        await insert(context, { ...history, ...result });
        return { ...result, historySaved: true };
      } catch (error) {
        logDebug("Eero history save failed", {
          status: error?.response?.status,
          code: error?.code,
          reason: error?.response ? "HTTP failure" : error?.message,
        });
        return { ...result, historySaved: false };
      }
    }
    const error = new Error("No new speed test result is available yet");
    error.speedTestStage = "waiting-result";
    throw error;
  },
  saveOoklaResult: async (result) => {
    const context = await session(true);
    const response = await _axios.post(
      ENDPOINTS.OOKLA_SPEED_SAVE,
      {
        accountId: context.account,
        userId: context.userId,
        download_MBs: number(result.download),
        upload_MBs: number(result.upload),
        ping_ms: optionalNumber(result.ping),
        jitter_ms: optionalNumber(result.jitter),
        host: result.host ?? null,
      },
      context.config,
    );
    // The wrapper returns historyResults; older deployments return a boolean.
    // Its error field contains "Success" on successful saves, so use status/result.
    const saved = response.data?.historyResults;
    if (
      response.data !== true &&
      !(
        Number(saved?.statusCode) === 200 &&
        (saved?.result === true || saved?.result === "true")
      )
    ) {
      const error = new Error("Unable to save speed test history");
      error.serviceStatus = saved?.statusCode;
      throw error;
    }
    return true;
  },
  getOoklaResult: async () => {
    const context = await session(true);
    const response = await _axios.get(
      getEndpoint(ENDPOINTS.OOKLA_SPEED_DETAILS, {
        accountId: encodeURIComponent(context.account),
        userId: encodeURIComponent(context.userId),
      }),
      context.config,
    );
    if (response.status === 204 || response.data == null) return null;
    return {
      download: number(response.data.testResults?.download_MBs),
      upload: number(response.data.testResults?.upload_MBs),
      updated: response.data.testResults?.createdOn,
    };
  },
};
// Include pre-request validation failures without logging session credentials.
export default Object.fromEntries(
  Object.entries(speedTestApi).map(([operation, execute]) => [
    operation,
    async (...args) => {
      logDebug("Speed test operation started", { operation });
      try {
        return await execute(...args);
      } catch (error) {
        logDebug("Speed test operation failed", {
          operation,
          stage: error?.speedTestStage,
          status: error?.response?.status ?? error?.serviceStatus,
          code: error?.code,
          reason: error?.response ? "HTTP failure" : error?.message,
        });
        throw error;
      }
    },
  ]),
);
