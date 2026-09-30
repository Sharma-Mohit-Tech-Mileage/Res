import { _axios } from "../../RestApiClient";
import { getUser } from "../../../redux/utils/LocalStorage";
import { getEndpoint, ENDPOINTS } from "../endpoints/Endpoints";

// Every user's usage comes from their own account with their own session token.
const buildRequest = async (usageType, extra = {}) => {
  const user = await getUser();
  const config = {
    headers: {
      Authorization: "Bearer " + user.token,
    },
  };

  const body = { account: user?.userInfo?.accountNumber, usageType, ...extra };
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

  getEquipment: async () => {
    try {
      const { config, body } = await buildRequest("equipment");
      const url = getEndpoint(ENDPOINTS.EQUIPMENT_BY_ACCOUNT, { account: body.account });
      const response = await _axios.get(url, config);
      return response.data;
    } catch (error) {
      throw error;
    }
  },
};

export default dataUsageApi;
