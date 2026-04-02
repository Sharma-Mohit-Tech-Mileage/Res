/**
 * dataUsageService.js
 * Path: src/network/apis/services/dataUsageService.js
 *
 * API service for data usage — single POST endpoint with usageType variants
 * Endpoint: POST api/Internet/Usage
 */

import { _axios } from "../../RestApiClient";
import { getUser } from "../../../redux/utils/LocalStorage";
import { Env } from "../account/Constants";

const ENDPOINT = "api/Internet/Usage";

const buildRequest = async (usageType, extra = {}) => {
  const user = await getUser();
  const accountNumber = user.userInfo.accountNumber;
  const config = {
    headers: {
      Authorization: "Bearer " + user.token,
    },
  };
  const body = { account: accountNumber, usageType, ...extra };
  return { config, body, token: user.token };
};

const logRequest = (usageType, body, token) => {
  const fullUrl = `${Env.API_ACP_BASEURL}${ENDPOINT}`;
  console.log(
    `\n========== DATA USAGE API CALL ==========\n` +
    `METHOD:  POST\n` +
    `URL:     ${fullUrl}\n` +
    `HEADERS: { Authorization: "Bearer ${token?.substring(0, 20)}...", Content-Type: "application/json" }\n` +
    `BODY:    ${JSON.stringify(body, null, 2)}\n` +
    `=========================================\n`
  );
};

const logResponse = (usageType, response) => {
  const data = response?.data;
  const status = response?.status;
  console.log(
    `\n---------- RESPONSE (${usageType}) ----------\n` +
    `STATUS:  ${status}\n` +
    `DATA:    ${JSON.stringify(data, null, 2)?.substring(0, 500)}\n` +
    `--------------------------------------------\n`
  );
};

const dataUsageApi = {
  /**
   * Get current usage summary
   * POST api/Internet/Usage  { usageType: "current" }
   */
  getCurrentUsage: async () => {
    try {
      const { config, body, token } = await buildRequest("current");
      logRequest("current", body, token);
      const response = await _axios.post(ENDPOINT, body, config);
      logResponse("current", response);
      return response.data;
    } catch (error) {
      console.error("[DataUsageService] current FAILED:", error?.response?.status, error?.message);
      throw error;
    }
  },

  /**
   * Get monthly usage history
   * POST api/Internet/Usage  { usageType: "monthly" }
   */
  getMonthlyUsage: async () => {
    try {
      const { config, body, token } = await buildRequest("monthly");
      logRequest("monthly", body, token);
      const response = await _axios.post(ENDPOINT, body, config);
      logResponse("monthly", response);
      return response.data;
    } catch (error) {
      console.error("[DataUsageService] monthly FAILED:", error?.response?.status, error?.message);
      throw error;
    }
  },

  /**
   * Get daily usage for a billing period
   * POST api/Internet/Usage  { usageType: "daily", startDate, endDate }
   */
  getDailyUsage: async (startDate, endDate) => {
    try {
      const { config, body, token } = await buildRequest("daily", {
        startDate,
        endDate,
      });
      logRequest("daily", body, token);
      const response = await _axios.post(ENDPOINT, body, config);
      logResponse("daily", response);
      return response.data;
    } catch (error) {
      console.error("[DataUsageService] daily FAILED:", error?.response?.status, error?.message);
      throw error;
    }
  },

  /**
   * Get available billing periods
   * POST api/Internet/Usage  { usageType: "period" }
   */
  getUsagePeriods: async () => {
    try {
      const { config, body, token } = await buildRequest("period");
      logRequest("period", body, token);
      const response = await _axios.post(ENDPOINT, body, config);
      logResponse("period", response);
      return response.data;
    } catch (error) {
      console.error("[DataUsageService] period FAILED:", error?.response?.status, error?.message);
      throw error;
    }
  },
};

export default dataUsageApi;
