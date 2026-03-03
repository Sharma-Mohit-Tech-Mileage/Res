import { _axios } from "../../RestApiClient";
import { getUser } from "../../../redux/utils/LocalStorage";
import moment from "moment";

// API service for billing statements
const billingStatementApi = {
  /**
   * Fetch billing statements for the current user's account
   * @returns {Promise} - A promise that resolves to the billing statements
   */
  fetchBillingStatements: async () => {
    try {
      let user = await getUser();
      const accountNumber = user.userInfo.accountNumber;
      const config = {
        headers: {
          Authorization: "Bearer " + user.token
        }
      };
      
      const response = await _axios.get(`api/Statement/${accountNumber}/get`, {...config});
     
      return response.data;
    } catch (error) {
      console.error("Error fetching billing statements:", error);
      throw error;
    }
  },

  /**
   * Download a specific statement
   * @param {string} statementId - The statement ID
   * @returns {Promise} - A promise that resolves to the statement data
   */
  downloadStatement: async (statementId) => {
    try {
      let user = await getUser();
      const accountNumber = user.userInfo.accountNumber;
      const config = {
        headers: {
          Authorization: "Bearer " + user.token
        },
      };
      const response = await _axios.get(
        `api/Statement/${accountNumber}/getbyId/${statementId}`,
        {...config}
      );
      
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  fetchBillingBreakdown: async () => {
    try {
      let startDate = moment().subtract(180, 'days').format('YYYY-MM-DD');
      let endDate = moment().format('YYYY-MM-DD');
      let user = await getUser();
      const accountNumber = user.userInfo.accountNumber;
      const config = {
        headers: {
          Authorization: "Bearer " + user.token
        }
      };
      const response = await _axios.get(`api/BillBreakdown/GetBills?accountId=${accountNumber}&startDate=${startDate}&endDate=${endDate}`, {...config});
      console.log("Response Data for Billing Breakdown:", JSON.stringify(response));
      return {data:response.data, status: response.status}
    } catch (error) {
      console.error("Error fetching billing breakdown:", error);
      throw error;
    }
  },

  fetchBillExplainer: async (requestData ) => {
    try {
      let user = await getUser();
      const config = {
        headers: {
          Authorization: "Bearer " + user.token
        }
      };
      console.log("Request Data for Bill Explainer:", JSON.stringify(requestData));
      const response = await _axios.post(`api/GetBillExplainer/Get`, requestData, {...config});
      return {data:response.data, status: response.status}
    } catch (error) {
      console.error("Error fetching bill explainer:", error);
      throw error;
    }
  
  }

};



export default billingStatementApi;