import { _axios } from "../../RestApiClient";
import { getUser } from "../../../redux/utils/LocalStorage";
import { getEndpoint,ENDPOINTS } from "../endpoints/Endpoints";
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
      
      const response = await _axios.get(getEndpoint(ENDPOINTS.STATEMENT_LIST, { accountNumber }), {...config});
     
      return response.data;
    } catch (error) {
      console.warn("Error fetching billing statements:", error);
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
      const response = await _axios.get(getEndpoint(ENDPOINTS.STATEMENT_GET_BY_ID, { accountNumber, statementId }), {...config});
      
      return response.data;
    } catch (error) {
      throw error;
    }
  }
};

export default billingStatementApi;