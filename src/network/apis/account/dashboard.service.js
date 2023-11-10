// Project Sources
import _axios from "../../RestApiClient";

const DashboardService = {
    getDashboardInfo (payload) {
        
        return _axios.post('/dashboard',payload);
    },
};

const SpeedTestApi = {
    getCurrentSpeedInfo (accountId) {
        console.log('AccountId',accountId)
        return _axios.get(`/Internet/api/internet/900254640/speedTest/Get`);
    },
};

export const DashboardApi={SpeedTestApi,DashboardService}