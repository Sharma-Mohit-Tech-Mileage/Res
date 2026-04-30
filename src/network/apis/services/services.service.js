import { _axios } from "../../RestApiClient";
import { getUser } from "../../../redux/utils/LocalStorage";
import { getEndpoint, ENDPOINTS } from "../endpoints/Endpoints";

const servicesApi = {
  fetchServiceDetails: async (accountNumber) => {
    try {
      let user = await getUser();
      const accNo = user.userInfo.accountNumber;
      const config = {
        headers: {
          Authorization: "Bearer " + user.token
        }
      };

      const response = await _axios.get(
        getEndpoint(ENDPOINTS.SERVICES_DETAILS, { accountNumber: accNo }),
        { ...config }
      );

      return response.data;
    } catch (error) {
      console.error("Error fetching service details:", error);
      throw error;
    }
  },

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
        getEndpoint(ENDPOINTS.GET_OUTAGE, { accountNumber }),
        { ...config },
        { timeout: 30000 }
      );

      return response.data;
    } catch (error) {
      console.error(
        `[checkOutageStatus] FAILED | code=${error?.code || error?.lastError?.code || '?'}` +
        ` | status=${error?.response?.status ?? error?.lastError?.response?.status ?? 'no-response'}` +
        ` | statusText=${error?.response?.statusText || error?.lastError?.response?.statusText || ''}` +
        ` | url=${error?.config?.url || error?.lastError?.config?.url || '?'}` +
        ` | baseURL=${error?.config?.baseURL || error?.lastError?.config?.baseURL || '?'}` +
        ` | message=${error?.message}` +
        ` | data=${JSON.stringify(error?.response?.data || error?.lastError?.response?.data || null)}`
      );
      throw error;
    }
  }
};

export default servicesApi;
