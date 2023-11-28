// Project Sources
import {_axios} from "../../RestApiClient";
import { getUser } from "../../../redux/utils/LocalStorage";



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

const getCurrentSpeedInfo = async(params)=> {
        let res= await getUser();
        const config = {
                headers: {
                    Authorization: "Bearer " + res.token
                }
            };
            console.log('config',config)
        return _axios.get(`/Internet/api/internet/${params}/speedTest/Get`,{...config}).then(res=>res.data).catch(error=>{ throw error})
        
    
};

export {getAccountInfo,getCurrentSpeedInfo,getInternetPlan}