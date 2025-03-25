import { _axios } from "../../RestApiClient";
import { getUser } from "../../../redux/utils/LocalStorage";

// API service for payment history
const paymentHistoryApi = {
  /**
   * Fetch payment history for the current user's account
   * @returns {Promise} - A promise that resolves to the payment history
   */
  fetchPaymentHistory: async () => {
    try {
      let user = await getUser();
      const accountNumber = user.userInfo.accountNumber;
      const config = {
        headers: {
          Authorization: "Bearer " + user.token
        }
      };
      
      // Use the actual API endpoint from your requirements
      const response = await _axios.get(`/api/payments/${accountNumber}/paymentHistory`, {...config});
      return response.data;
    } catch (error) {
      console.error("Error fetching payment history:", error);
      throw error;
    }
  },

  /**
   * Download a payment receipt (if this functionality is needed)
   * @param {string} paymentId - The payment/transaction ID
   * @returns {Promise} - A promise that resolves to the receipt data
   */
  downloadPaymentReceipt: async (paymentId) => {
    try {
      let user = await getUser();
      const accountNumber = user.userInfo.accountNumber;
      const config = {
        headers: {
          Authorization: "Bearer " + user.token
        },
      };
      
      // Note: This is a placeholder endpoint, update it based on your actual API
      const response = await _axios.get(
        `/api/payments/${accountNumber}/receipt/${paymentId}`,
        {...config}
      );
      
      return response.data;
    } catch (error) {
      console.error("Error downloading payment receipt:", error);
      throw error;
    }
  }
};

export default paymentHistoryApi;