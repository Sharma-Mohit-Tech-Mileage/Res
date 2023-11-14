
import _axios from "../../RestApiClient";

const ssoLoginApi=(request)=>{
    
    return _axios.get('/mobile/api/gettoken',  {
        params: {
          idToken:request.idToken
        }
      }).then((response)=>{
         console.log('response data',response)
    })
}

export {ssoLoginApi}