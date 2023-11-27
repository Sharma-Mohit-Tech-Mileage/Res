// Project Sources
import {_axios} from "../../RestApiClient";
import { getUser } from "../../../redux/utils/LocalStorage";
const getDashboardInfo =(params) =>{
        return _axios.post('/dashboard',params);
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

export {getDashboardInfo,getCurrentSpeedInfo}