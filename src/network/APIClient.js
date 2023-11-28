import React from "react";
import { getUser } from "../redux/utils/LocalStorage";

const BASE_URL = 'https://customer.uat.sparklight.com/apiWrapper/' 
const BASE_URL_AUTH="https://customer.uat.cableone.net/apiWrapper/"

export const PostAuthApiRequest=(endpoint,body, onSuccess,onError)=>{
    
    fetch(`${BASE_URL_AUTH}/${endpoint}`, {
        method: 'POST',
        headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json'
   },
        body: JSON.stringify(body)
    })
        .then(response => Promise.all([response, response.json()]))
        .then(([response, json]) => {
             //console.log('response', response);
            //if (!response.ok || !response.status === 201) { // We should get a 201 (Created) status code if everything is fine/working
             //   throw Error(`Respsonse status ${response.status} (${response.statusText}): ${json.message}`);
            //}
            // console.log(json);
            // Whatever you want to do next after the POST request - maybe dispatch something?
            onSuccess(json)
        })
        .catch(exception => {
            onError(exception)
            console.log(new Map([
                [TypeError, "There was a problem fetching the response."],
                [SyntaxError, "There was a problem parsing the response."],
                [Error, exception.message]
            ]).get(exception.constructor()));
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
        // console.log(json);
        // Whatever you want to do next after the POST request - maybe dispatch something?
    })
    .catch(exception => {
        console.log(new Map([
            [TypeError, "There was a problem fetching the response."],
            [SyntaxError, "There was a problem parsing the response."],
            [Error, exception.message]
        ]).get(exception.constructor()));
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
        console.log("Response",json);
        onSuccess(json)
        // Whatever you want to do next after fetching - maybe dispatch something?
    })
    .catch(exception => {
        console.log(new Map([
            [TypeError, "There was a problem fetching the response."],
            [SyntaxError, "There was a problem parsing the response."],
            [Error, exception.message]
        ]).get(exception.constructor()));
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




// // Example PATCH resquest - with token and encodeURIComponent
// fetch(`${baseUrl}/whatever-endpoint/${encodeURIComponent(userId)}`, {
//     method: 'PATCH',
//     headers: {
//         'Content-Type': 'application/json',
//         'Authorization': `Bearer ${JWT}`
//     },
//     body: JSON.stringify({
//         sendSomething,
//         sendSomething2,
//         sendSomething3
//     })
// })
//     .then(response => Promise.all([response, response.json()]))
//     .then(([response, json]) => {
//         // console.log('response', response);
//         if (!response.ok || !response.status === 204) { // We should get a 200 (OK) or 204 (No Content) status code if everything is fine/working
//             throw Error(`Respsonse status ${response.status} (${response.statusText}): ${json.message}`);
//         }
//         // console.log(json);
//         // Whatever you want to do next after the PATCH request - maybe dispatch something?
//     })
//     .catch(exception => {
//         console.log(new Map([
//             [TypeError, "There was a problem fetching the response."],
//             [SyntaxError, "There was a problem parsing the response."],
//             [Error, exception.message]
//         ]).get(exception.constructor()));
//     });




// // Example DELETE resquest - with token and encodeURIComponent
// fetch(`${baseUrl}/whatever-endpoint/${encodeURIComponent(userId)}`, {
//     method: 'DELETE',
//     headers: {
//         'Content-Type': 'application/json',
//         'Authorization': `Bearer ${JWT}`
//     },
//     body: JSON.stringify({
//         sendSomething,
//         sendSomething2,
//         sendSomething3
//     })
// })
//     .then(response => Promise.all([response, response.json()]))
//     .then(([response, json]) => {
//         // console.log('response', response);
//         if (!response.ok) { // We should get a 200 (OK) status code if everything is fine/working
//             throw Error(`Respsonse status ${response.status} (${response.statusText}): ${json.message}`);
//         }
//         // console.log(json);
//         // Whatever you want to do next after the DELETE request - maybe dispatch something?
//     })
//     .catch(exception => {
//         console.log(new Map([
//             [TypeError, "There was a problem fetching the response."],
//             [SyntaxError, "There was a problem parsing the response."],
//             [Error, exception.message]
//         ]).get(exception.constructor()));
//     });
 