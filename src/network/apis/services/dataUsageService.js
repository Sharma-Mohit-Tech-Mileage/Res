/**
 * dataUsageService.js
 * Path: src/network/apis/services/dataUsageService.js
 * 
 * API service for data usage endpoints
 */

import { _axios } from "../../RestApiClient";
import { getUser } from "../../../redux/utils/LocalStorage";

const dataUsageApi = {
  /**
   * Get current usage summary
   * GET /api/Bandwidth/CurrentUsage/{accountNumber}
   */
  getCurrentUsage: async () => {
    try {
      const user = await getUser();
      const accountNumber = user.userInfo.accountNumber;
      const config = {
        headers: {
          Authorization: "Bearer " + user.token
        }
      };
      
      const response = await _axios.get(
        `api/Bandwidth/CurrentUsage/${accountNumber}`,
        config
      );
      
      return response.data;
    } catch (error) {
      console.error("Error fetching current usage:", error);
      throw error;
    }
  },

  /**
   * Get monthly usage history
   * GET /api/Bandwidth/MonthlyUsage/{accountNumber}
   */
  getMonthlyUsage: async () => {
    try {
      const user = await getUser();
      const accountNumber = user.userInfo.accountNumber;
      const config = {
        headers: {
          Authorization: "Bearer " + user.token
        }
      };
      
      const response = await _axios.get(
        `api/Bandwidth/MonthlyUsage/${accountNumber}`,
        config
      );
      
      return response.data;
    } catch (error) {
      console.error("Error fetching monthly usage:", error);
      throw error;
    }
  },

  /**
   * Get daily usage for date range
   * GET /api/Bandwidth/DailyUsage/{accountNumber}/{startDate}/{endDate}
   */
  getDailyUsage: async (startDate, endDate) => {
    try {
      const user = await getUser();
      const accountNumber = user.userInfo.accountNumber;
      const config = {
        headers: {
          Authorization: "Bearer " + user.token
        }
      };
      
      const response = await _axios.get(
        `api/Bandwidth/DailyUsage/${accountNumber}/${startDate}/${endDate}`,
        config
      );
      
      return response.data;
    } catch (error) {
      console.error("Error fetching daily usage:", error);
      throw error;
    }
  },

  /**
   * Get available usage periods
   * GET /api/Bandwidth/UsagePeriods/{accountNumber}
   */
  getUsagePeriods: async () => {
    try {
      const user = await getUser();
      const accountNumber = user.userInfo.accountNumber;
      const config = {
        headers: {
          Authorization: "Bearer " + user.token
        }
      };
      
      const response = await _axios.get(
        `api/Bandwidth/UsagePeriods/${accountNumber}`,
        config
      );
      
      return response.data;
    } catch (error) {
      console.error("Error fetching usage periods:", error);
      throw error;
    }
  }
};

export default dataUsageApi;