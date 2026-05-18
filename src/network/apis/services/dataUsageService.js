import { _axios } from "../../RestApiClient";
import { getSsoToken, getUser } from "../../../redux/utils/LocalStorage";
import { getEndpoint, ENDPOINTS } from "../endpoints/Endpoints";
import Config from "react-native-config";
import axios from "axios";

const PROD_TEST_USERNAME = "Norfolktest";
const UAT_USAGE_ACCOUNT = "8160110010005227";
const UAT_BASE_URL = "https://customer.uat.cableone.net/apiWrapper/";

const HARD_CODED_UAT_ID_TOKEN =
  "eyJhbGciOiJSUzI1NiIsInR5cCIgOiAiSldUIiwia2lkIiA6ICJsSXhCZjlubUdLd1dZZ0lGN081SGFBQ0l3eTBkd0ZfX0I3RFhZLU9xNXcwIn0.eyJleHAiOjE3Nzg0NTA5NzMsImlhdCI6MTc3ODQ1MDY3MywiYXV0aF90aW1lIjoxNzc4NDUwNjczLCJqdGkiOiJmYjA5ZDBkZC1iZjE3LTQ3YjYtYWYyMy02MTQ3NTE2ODgwNDgiLCJpc3MiOiJodHRwczovL2xvZ2luLnVhdC5jYWJsZW9uZS5uZXQvYXV0aC9yZWFsbXMvZXh0ZXJuYWwtc3NvLXJlYWxtIiwiYXVkIjoic3BhcmtsaWdodC1jdXN0b21lci1tb2JpbGUtYXBwIiwic3ViIjoiZjozM2VmNTU4MC0yM2MxLTQwYWYtYjFjNC00ZGMwMTRmNjVkYjA6ODE2MDExMDAxMDAwNTIyNyIsInR5cCI6IklEIiwiYXpwIjoic3BhcmtsaWdodC1jdXN0b21lci1tb2JpbGUtYXBwIiwibm9uY2UiOiI0X21hSTduZnBZRnQ1TnFBcjVVX2FRUDFHTzlNS2pQQ01Td09INE1vbU1JIiwic2Vzc2lvbl9zdGF0ZSI6IjA3YzQ2Mjg1LWQ2MDItNGNjMC04YzJjLTQ0NzcyOTIzY2E3OSIsImF0X2hhc2giOiJwZ0s5ejBmSGFMRVAzc29pQnNBc2lRIiwiYWNyIjoiMSIsInNpZCI6IjA3YzQ2Mjg1LWQ2MDItNGNjMC04YzJjLTQ0NzcyOTIzY2E3OSIsImFkZHJlc3MiOnt9LCJlbWFpbF92ZXJpZmllZCI6ZmFsc2UsIm5hbWUiOiJQSUcgS1VTTUlFUloiLCJwcmVmZXJyZWRfdXNlcm5hbWUiOiI4MTYwMTEwMDEwMDA1MjI3IiwiZ2l2ZW5fbmFtZSI6IlBJRyIsImZhbWlseV9uYW1lIjoiS1VTTUlFUloiLCJlbWFpbCI6IiJ9.jwOyf53Y-lqkfHL9kK2Eb6ewp7dWkwBvgeP_mP7oWQdeQYT2xojHz7ivXi-hLTVImN1wW5oe_zprdjoBvUEIb-_E3MCFa2ZwLWg6NiZ_YFCJzcmUDuygqkKDm-D2gnLjwMz-oyZ4smXDa5HsfRlpZcI0GXJVfBPZfPLjkNSVdR6rrurvuPqhnJn5IJlrEAEsO_MW4zWal_axyD8SG97Y_sfEALtDBR2hsMQwGaYeuWEevmsZ5L8ptNvl92MMqAIp41-z5v6zLDdfXlw5J2rLK95179hJpHhzbE71T8YreITgS6AF3kyv1nmydv2BEnrAmQuaOUSptXOfj0Htsh2VJg";

const UAT_AUTH_BASEURL = UAT_BASE_URL;

let cachedUatJwtToken = null;

const isProdBaseUrl = (baseUrl) => {
  const normalized = (baseUrl || "").toLowerCase();
  return normalized.includes("publicservices.sparklight.com");
};

const isDesignatedProdTestUser = (user) => {
  const userName = user?.userInfo?.userName || user?.userName || "";
  return userName.trim().toLowerCase() === PROD_TEST_USERNAME.toLowerCase();
};

const extractJwtFromResponse = (payload) => {
  if (!payload) return null;
  if (typeof payload === "string" && payload.trim()) return payload.trim();

  return (
    payload.jwtToken ||
    payload.jwt ||
    payload.token ||
    payload?.data?.jwtToken ||
    payload?.data?.jwt ||
    payload?.data?.token ||
    payload?.result?.jwtToken ||
    payload?.result?.jwt ||
    payload?.result?.token ||
    null
  );
};

const extractJwtFromHeaders = (headers) => {
  if (!headers) return null;
  const authHeader = headers.authorization || headers.Authorization;
  if (typeof authHeader === "string" && authHeader.toLowerCase().startsWith("bearer ")) {
    return authHeader.substring(7).trim();
  }
  return headers.jwtToken || headers.jwttoken || headers.jwt || headers.token || null;
};

const getUatGetTokenPayload = async (user) => {
  const ssoToken = (await getSsoToken()) || {};

  return {
    idToken: HARD_CODED_UAT_ID_TOKEN,
    accessToken: ssoToken.accessToken,
    idTokenGuid: ssoToken.idTokenGuid || user?.tokenGuid || "",
    refreshToken: ssoToken.refreshToken || user?.refreshToken,
  };
};

const fetchUatJwtToken = async (user) => {
  const payload = await getUatGetTokenPayload(user);
  const endpoint = `${UAT_AUTH_BASEURL}${getEndpoint(ENDPOINTS.LOGIN_SSO_GETTOKEN)}`;
  const payloadVariants = [
    { idToken: payload.idToken },
    {
      idToken: payload.idToken,
      accessToken: payload.accessToken,
      idTokenGuid: payload.idTokenGuid,
      refreshToken: payload.refreshToken,
    },
  ];

  let lastResponse = null;
  for (const body of payloadVariants) {
    const response = await axios.post(endpoint, body, {
      headers: {
        "Content-Type": "application/json",
      },
      timeout: 30000,
      validateStatus: () => true,
    });

    lastResponse = response;
    const jwt = extractJwtFromResponse(response?.data) || extractJwtFromHeaders(response?.headers);
    if (jwt) {
      return jwt;
    }
  }

  const status = lastResponse?.status ?? "no-status";
  const keys = Object.keys(lastResponse?.data || {}).join(",") || "none";
  throw new Error(`UAT gettoken response missing jwt token fields (status=${status}, keys=${keys})`);
};

const getUatJwtToken = async (user) => {
  if (cachedUatJwtToken) {
    return cachedUatJwtToken;
  }

  const jwt = await fetchUatJwtToken(user);
  cachedUatJwtToken = jwt;
  return jwt;
};

const buildRequest = async (usageType, extra = {}) => {
  const user = await getUser();
  const shouldUseUatUsageData =
    isDesignatedProdTestUser(user) && isProdBaseUrl(Config.API_ACP_BASEURL);

  const accountNumber = shouldUseUatUsageData
    ? UAT_USAGE_ACCOUNT
    : user?.userInfo?.accountNumber;

  const authToken = shouldUseUatUsageData
    ? await getUatJwtToken(user)
    : user.token;

  const config = {
    ...(shouldUseUatUsageData ? { baseURL: UAT_BASE_URL } : {}),
    headers: {
      Authorization: "Bearer " + authToken,
    },
  };

  const body = { account: accountNumber, usageType, ...extra };
  return { config, body };
};

const dataUsageApi = {
  getCurrentUsage: async () => {
    try {
      const { config, body } = await buildRequest("current");
      const response = await _axios.post(getEndpoint(ENDPOINTS.INTERNET_USAGE), body, config);
      return response.data;
    } catch (error) {
      console.error("[DataUsageService] current FAILED:", error?.response?.status, error?.message);
      if (error?.response?.status === 401) {
        cachedUatJwtToken = null;
      }
      throw error;
    }
  },

  getMonthlyUsage: async () => {
    try {
      const { config, body } = await buildRequest("monthly");
      const response = await _axios.post(getEndpoint(ENDPOINTS.INTERNET_USAGE), body, config);
      return response.data;
    } catch (error) {
      console.error("[DataUsageService] monthly FAILED:", error?.response?.status, error?.message);
      if (error?.response?.status === 401) {
        cachedUatJwtToken = null;
      }
      throw error;
    }
  },

  getDailyUsage: async (startDate, endDate) => {
    try {
      const { config, body } = await buildRequest("daily", {
        startDate,
        endDate,
      });
      const response = await _axios.post(getEndpoint(ENDPOINTS.INTERNET_USAGE), body, config);
      return response.data;
    } catch (error) {
      console.error("[DataUsageService] daily FAILED:", error?.response?.status, error?.message);
      if (error?.response?.status === 401) {
        cachedUatJwtToken = null;
      }
      throw error;
    }
  },

  getUsagePeriods: async () => {
    try {
      const { config, body } = await buildRequest("period");
      const response = await _axios.post(getEndpoint(ENDPOINTS.INTERNET_USAGE), body, config);
      return response.data;
    } catch (error) {
      console.error("[DataUsageService] period FAILED:", error?.response?.status, error?.message);
      if (error?.response?.status === 401) {
        cachedUatJwtToken = null;
      }
      throw error;
    }
  },
};

export default dataUsageApi;
