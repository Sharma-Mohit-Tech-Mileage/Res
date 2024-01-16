import React from "react";
import { getUser } from "../redux/utils/LocalStorage";

const BASE_URL = 'https://customer.uat.sparklight.com/apiWrapper/' 
//const BASE_URL_AUTH="https://customer.uat.cableone.net/apiWrapper/"
const SUPPORT_URL="https://support.sparklight.com/api/v2/help_center/"

export const PostAuthApiRequest=(endpoint, body, onSuccess, onError)=>{
    const idTokenGuid = body.idTokenGuid;
    const refreshToken = body.refreshToken;
    
    delete body.idTokenGuid;
    delete body.refreshToken;

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
            json.idTokenGuid = idTokenGuid;
            json.refreshToken = refreshToken;
            onSuccess(json)
        })
        .catch(exception => {
            onError(exception)
           
        });
    
    }
    

export const PostApiRequest=(endpoint,body, onSuccess,onError)=>{
// Example POST request
fetch(`${BASE_URL}/${endpoint}`, {
    method: 'GET',
    headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${JWT}`
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
fetch(`${BASE_URL}/${endpoint}`, {
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

// // Example GET request with id
// fetch(`${BASE_URL}/whatever-endpoint/${encodeURIComponent(userId)}`, {
//     method: 'GET',
//     headers: {
//         'Content-Type': 'application/json',
//         'Authorization': `Bearer ${JWT}` // Not always needed with a GET request
//     }
// })
//     .then(response => Promise.all([response, response.json()]))
//     .then(([response, json]) => {
//         // console.log('response', response);
//         if (!response.ok) { // We should get a 200 (OK) status code if everything is fine/working
//             throw Error(`Respsonse status ${response.status} (${response.statusText}): ${json.message}`);
//         }
//         // console.log(json);
//         // Whatever you want to do next after fetching - maybe dispatch something?
//     })
//     .catch(exception => {
//         console.log(new Map([
//             [TypeError, "There was a problem fetching the response."],
//             [SyntaxError, "There was a problem parsing the response."],
//             [Error, exception.message]
//         ]).get(exception.constructor()));
//     });




// // // Example PUT resquest - with token and encodeURIComponent
// // fetch(`${baseUrl}/whatever-endpoint/${encodeURIComponent(userId)}`, {
// //     method: 'PUT',
// //     headers: {
// //         'Content-Type': 'application/json',
// //         'Authorization': `Bearer ${JWT}`
// //     },
// //     body: JSON.stringify({
// //         sendSomething,
// //         sendSomething2,
// //         sendSomething3
// //     })
// // })
// //     .then(response => Promise.all([response, response.json()]))
// //     .then(([response, json]) => {
// //         // console.log('response', response);
// //         if (!response.ok || !response.status === 204) { // We should get a 200 (OK) or 204 (No Content) status code if everything is fine/working
//             throw Error(`Respsonse status ${response.status} (${response.statusText}): ${json.message}`);
//         }
//         // console.log(json);
//         // Whatever you want to do next after the PUT request - maybe dispatch something?
//     })
//     .catch(exception => {
//         console.log(new Map([
//             [TypeError, "There was a problem fetching the response."],
//             [SyntaxError, "There was a problem parsing the response."],
//             [Error, exception.message]
//         ]).get(exception.constructor()));
//     });




