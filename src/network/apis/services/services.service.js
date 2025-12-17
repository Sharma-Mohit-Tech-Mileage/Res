import { _axios } from "../../RestApiClient";
import { getUser } from "../../../redux/utils/LocalStorage";

const servicesApi = {
  /**
   * Fetch service details (Internet, Video, Phone)
   */
  fetchServiceDetails: async (accountNumber) => {
    try {
      let user = await getUser();
       const accNo= user.userInfo.accountNumber;
       const config = {
        headers: {
          Authorization: "Bearer " + user.token
        }
      };
      
      const response = await _axios.get(
        `api/Services/GetServiceDetails?accountNumber=${accNo}&includeEquipment=false&includeLocation=false`,
        {...config}
      );
     
      return response.data;
    } catch (error) {
      console.error("Error fetching service details:", error);
      throw error;
    }
  },

  /**
   * Check outage status
   */
  checkOutageStatus: async () => {
  try {
    let user = await getUser();
    const accountNumber = user.userInfo.accountNumber;
    const config = {
      headers: {
        Authorization: "Bearer " + user.token
      }
    };
    
    const response = await _axios.post(
      `api/outage/GetOutages?accountNumber=${accountNumber}`,
      {...config}
    );
   
    return response.data;
  } catch (error) {
    console.error("Error checking outage status:", error);
    throw error;
  }
}
};

export default servicesApi;