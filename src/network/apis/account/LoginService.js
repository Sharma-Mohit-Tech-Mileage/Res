
import _axios from "../../RestApiClient";

const ssoLoginApi=(request)=>{
    
    return _axios.post('/mobile/api/gettoken',  request)
}

export {ssoLoginApi}