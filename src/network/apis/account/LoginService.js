
import {_axios_auth} from "../../RestApiClient";

const ssoLoginApi=(request)=>{
    
    return _axios_auth.post('/mobile/api/gettoken',  request).then(res=>res.data).catch(error=>{ throw error})
}

export {ssoLoginApi}