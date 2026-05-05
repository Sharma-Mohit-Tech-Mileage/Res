// Project Sources
import {_axios} from "../../RestApiClient";
import { getUser } from "../../../redux/utils/LocalStorage";
import { getEndpoint,ENDPOINTS } from "../endpoints/Endpoints";
import moment from 'moment';

const getInternetPlan = async(accountId) =>{
    let res= await getUser();
    const config = {
            headers: {
                Authorization: "Bearer " + res.token
            }
        };

    const requestUrl = getEndpoint(ENDPOINTS.INTERNET_PLAN, { accountId });
    return _axios.get(requestUrl, {...config}).then(res=>res.data).catch(error=>{ throw error})
};

const getAccountInfo = async(accountId) =>{
        let res= await getUser();
        const config = {
                headers: {
                    Authorization: "Bearer " + res.token
                }
            };

        const requestUrl = getEndpoint(ENDPOINTS.ACCOUNT_INFO, { accountId });
        return _axios.get(requestUrl, {...config}).then(res=>res.data).catch(error=>{ throw error})
};

const getCurrentSpeedInfo = async()=> {
        let res = await getUser();
        const config = {
                headers: {
                    Authorization: "Bearer " + res.token
                }
            };
            console.log('config',config)
        const requestUrl = getEndpoint(ENDPOINTS.INTERNET_SPEED_GET, { accountNumber: res.userInfo.accountNumber });
        return _axios.get(requestUrl, {...config}).then(res=>res.data).catch(error=>{ throw error})
};

const postCurrentSpeedInfo = async(params)=> {
        let user = await getUser();

        const data = {
                accountId: user.userInfo.accountNumber,
                userId: user.userInfo.accountNumber,
                download_Kbps: Math.round(params.download*1000),
                upload_Kbps: Math.round(params.upload*1000),
                ping_ms: (Math.round(params.ping*100)/100),
                jitter_ms: (Math.round(params.jitter*100)/100),
                host: params.host,
                createdOn: moment().format()
        };

        const config = {
                headers: {
                        Authorization: "Bearer " + user.token
                }
        };

        const requestUrl = getEndpoint(ENDPOINTS.INTERNET_SPEED_POST, { accountNumber: user.userInfo.accountNumber });
        return _axios.post(requestUrl, data, {...config}).then(res=>res.data).catch(error=>{ throw error})
};

export {getAccountInfo, getCurrentSpeedInfo, postCurrentSpeedInfo, getInternetPlan}