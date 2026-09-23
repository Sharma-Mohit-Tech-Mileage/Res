import { ENDPOINTS, getEndpoint } from "../endpoints/Endpoints";
import { _axios } from "../../RestApiClient";
import { getUser } from "../../../redux/utils/LocalStorage";

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
  return Number(value);
};
const optionalNumber = (value) => (value == null ? null : number(value));
const session = async (needsUser = false) => {
  const user = await getUser();
  return {
    account: required(user?.userInfo?.accountNumber, "Account number"),
    userId: needsUser
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
  if (!data || data.error || !codes.includes(Number(data.statusCode)))
    throw new Error("Service request failed");
  return data;
};
const identity = (account, idType) => {
  if (!["account", "network"].includes(idType))
    throw new Error("Invalid ID type");
  // Network mode also requires the account number, per the API contract.
  return { idType, id: account, accountNumber: account };
};
const details = async (context, idType) => {
  const response = await _axios.get(ENDPOINTS.EERO_SPEED_DETAILS, {
    ...context.config,
    params: identity(context.account, idType),
  });
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
const insert = async (context, result) => {
  const response = await _axios.post(
    ENDPOINTS.EERO_SPEED_HISTORY,
    {
      AccountId: context.account,
      UserId: context.userId,
      Download_MBs: number(result.download),
      Upload_MBs: number(result.upload),
      Ping_Ms: optionalNumber(result.ping),
      Jitter_Ms: optionalNumber(result.jitter),
      Host: result.host ?? null,
    },
    context.config,
  );
  if (response.data !== true)
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
  getEeroDetails: async (idType = "account") =>
    details(await session(), idType),
  insertEeroHistory: async (result) => insert(await session(true), result),
  runEeroSpeedTest: async ({
    idType = "account",
    history = {},
    isCancelled = () => false,
  } = {}) => {
    const context = await session(true);
    // Record the previous timestamp so a 202 cannot cause old results to be saved.
    const previous = await details(context, idType);
    if (isCancelled()) throw new Error("Speed test cancelled");
    const response = await _axios.post(
      ENDPOINTS.EERO_SPEED_TEST,
      {
        idType,
        id: context.account,
        AccountNumber: context.account,
      },
      context.config,
    );
    check(response.data, [200, 202]);
    for (let attempt = 0; attempt < 24; attempt += 1) {
      if (attempt) await delay(5000);
      if (isCancelled()) throw new Error("Speed test cancelled");
      const result = await details(context, idType);
      if (isCancelled()) throw new Error("Speed test cancelled");
      if (!result?.updated || (previous && result.updated === previous.updated))
        continue;
      try {
        await insert(context, { ...history, ...result });
        return { ...result, historySaved: true };
      } catch {
        return { ...result, historySaved: false };
      }
    }
    throw new Error("No new speed test result is available yet");
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
    if (response.data !== true)
      throw new Error("Unable to save speed test history");
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
      download: number(response.data.download_MBs),
      upload: number(response.data.upload_MBs),
      updated: response.data.createdOn,
    };
  },
};
export default speedTestApi;
