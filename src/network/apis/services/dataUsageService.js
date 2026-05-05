import { _axios } from "../../RestApiClient";
import { getUser } from "../../../redux/utils/LocalStorage";
import { getEndpoint, ENDPOINTS } from "../endpoints/Endpoints";

const buildRequest = async (usageType, extra = {}) => {
  const user = await getUser();
  const accountNumber = user.userInfo.accountNumber;
  const config = {
    headers: {
      Authorization: "Bearer " + user.token,
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
      throw error;
    }
  },
};

export default dataUsageApi;
