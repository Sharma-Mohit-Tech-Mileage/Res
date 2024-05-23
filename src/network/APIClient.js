import { getUser } from "../redux/utils/LocalStorage";
import { Env } from "./apis/account/Constants";

const BASE_URL = Env.API_BASEURL
const SUPPORT_URL="https://support.sparklight.com/api/v2/help_center/"
const MODEM_BASE_URL=Env.MODEM_BASE_URL

export let UserAuthorized = false;

export const isUserAuthorized = (authorize) => {
    UserAuthorized = authorize;
}

export const PostAuthApiRequest=(endpoint, body, onSuccess, onError)=>{
    const idTokenGuid = body.idTokenGuid;
    const refreshToken = body.refreshToken;
    
    delete body.idTokenGuid;
    delete body.refreshToken;
    console.log('API URL',BASE_URL)
    fetch(`${BASE_URL}/${endpoint}`, {
        method: 'POST',
        headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json'
   },
        body: JSON.stringify(body)
    })
        .then(response => Promise.all([response, response.json()]))
        .then(([response, json]) => {
            //Add Token Guid
            console.log(response)
            json.idTokenGuid = idTokenGuid;
            json.refreshToken = refreshToken;
            onSuccess(json)
        })
        .catch(exception => {
            onError(exception)
           
        });
    
    }
    

export const PostApiRequest=async(endpoint,body, onSuccess,onError)=>{
// Example POST request
const user= await getUser()
console.log('API URL',BASE_URL)
fetch(`${BASE_URL}/${endpoint}`, {
    method: 'GET',
    headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${user.token}`
    },
    body: JSON.stringify({
        body
    })
})
    .then(response => Promise.all([response, response.json()]))
    .then(([response, json]) => {
        // console.log('response', response);
        if (!response.ok || !response.status === 201) { // We should get a 201 (Created) status code if everything is fine/working
            throw Error(`Respsonse status ${response.status} (${response.statusText}): ${json.message}`);
        }
        onSuccess(json)
        // console.log(json);
        // Whatever you want to do next after the POST request - maybe dispatch something?
    })
    .catch(exception => {
        onError(exception.message)
    });

}

export const GetApiRequest= async(endpoint, onSuccess,onError)=>{
 const user= await getUser()
 console.log('API URL',BASE_URL+endpoint)
 console.log(user.token)
fetch(`${BASE_URL}/${endpoint}`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${user.token}` // Not always needed with a GET request
        }
    })
    .then(response => {
        if (response.status === 401) {
            isUserAuthorized(false);
            throw Error(`Response status ${response.status} (${response.statusText})`);
        } else if(response.status===204){
            onError(response.status)
        } else {
            return response.json();
        }     
    })
    .then((json) => {
        isUserAuthorized(true);
        onSuccess(json);
    })
    .catch(exception => {
        onError(exception.message)
        
    });

}

export const GetApiRequestSearch= async(endpoint, onSuccess,onError)=>{
    const user= await getUser()
   fetch(`${SUPPORT_URL}/${endpoint}`, {
       method: 'GET',
       headers: {
           'Content-Type': 'application/json',
           'Authorization': `Bearer ${user.token}` // Not always needed with a GET request
       }
   })
       .then(response => Promise.all([response, response.json()]))
       .then(([response, json]) => {
           //console.log('response', response);
           if (!response.ok) { // We should get a 200 (OK) status code if everything is fine/working
               throw Error(`Respsonse status ${response.status} (${response.statusText}): ${json.message}`);
           }
           //console.log("Response",json);
           onSuccess(json)
           // Whatever you want to do next after fetching - maybe dispatch something?
       })
       .catch(exception => {
           onError(exception.message)
           
       });
   
   }


export const GetModemStatusApiRequest= async(endpoint, onSuccess,onError)=>{
   fetch(`${MODEM_BASE_URL}/${endpoint}`, {
           method: 'GET',
           headers: {
               'Content-Type': 'application/json',
               'client_id': '0224e1c5310a45f4a02a244a54e50350',
                'client_secret':'1237E83e1676480B90BfEdB0aa73c91b'
           }
       })
       .then(response => {
           if (response.status === 400) {
            onError(response.status)
           } else if(response.status===204){
               onError(response.status)
           }else if(response.status===404 || response.status===500){
            onError(response.status)
           } else {
               return response.json();
           }     
       })
       .then((json) => {
           onSuccess(json);
       })
       .catch(exception => {
           onError(exception.message)
           
       });
   
   }
   




