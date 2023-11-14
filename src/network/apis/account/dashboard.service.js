// Project Sources
import _axios from "../../RestApiClient";

const getDashboardInfo =(params) =>{
        return _axios.post('/dashboard',params);
};

const getCurrentSpeedInfo = async(params)=> {
        console.log('AccountId',JSON.stringify(params))
        return _axios.get(`/Internet/api/internet/${params}/speedTest/Get`);
    
};

export {getDashboardInfo,getCurrentSpeedInfo}