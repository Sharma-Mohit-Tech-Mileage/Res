// Project Sources
import {_axios} from "../../RestApiClient";
import { getUser } from "../../../redux/utils/LocalStorage";
import moment from 'moment';

const getInternetPlan = async(accountId) =>{
    let res= await getUser();
    const config = {
            headers: {
                Authorization: "Bearer " + res.token
            }
        };

    return _axios.get(`/internet/api/internet/${accountId}/plan`,{...config}).then(res=>res.data).catch(error=>{ throw error})
};

const getAccountInfo = async(accountId) =>{
        let res= await getUser();
        const config = {
                headers: {
                    Authorization: "Bearer " + res.token
                }
            };

        return _axios.get(`/account/api/account/${accountId}`,{...config}).then(res=>res.data).catch(error=>{ throw error})
};

const getCurrentSpeedInfo = async()=> {
        let res = await getUser();
        console.log('getCurrentSpeedInfo User: ', res);
        const config = {
                headers: {
                    Authorization: "Bearer " + res.token
                }
            };
            console.log('config',config)
        return _axios.get(`/Internet/api/internet/${res.userInfo.accountNumber}/speedTest/Get`,{...config}).then(res=>res.data).catch(error=>{ throw error})
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

        return _axios.post(`/Internet/api/internet/${user.userInfo.accountNumber}/speedTest/Post`, data, {...config}).then(res=>res.data).catch(error=>{ throw error})
};

export {getAccountInfo, getCurrentSpeedInfo, postCurrentSpeedInfo, getInternetPlan}