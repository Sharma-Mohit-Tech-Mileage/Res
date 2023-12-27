import axios from 'axios';
const BASE_URL_CABLEONE="https://customer.uat.cableone.net/apiWrapper/"
const BASE_URL="https://customer.uat.sparklight.com/apiWrapper/"

const _axios_auth = axios.create({
    baseURL: BASE_URL_CABLEONE,
    timeout: 15000,
    headers: {
        'Content-Type': 'application/json',
        
    }
});

const _axios = axios.create({
    baseURL: BASE_URL,
    withCredentials: false,
    crossDomain: true,
    timeout: 10000,
    headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
        
    }
});

const _axios_cableone = axios.create({
    baseURL: BASE_URL_CABLEONE,
    withCredentials: false,
    crossDomain: true,
    timeout: 10000,
    headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
        
    }
});

//https://customer.uat.cableone.net/apiWrapper/mobile/api/mobileuser/900690538/updatemobiletcacceptanceflag/900690538/true


// /**
//  * Setup axios
//  */
// export const setupAxios = (store) => {
//     // get token
//     //const token = window.localStorage.getItem('token');
//       const token="";
//     // if token exists set token
//     // dispatch login action
//     if (token && token !== '' && token !== 'null') {
//         // store.dispatch(userActions.login(token));
//     }

//     // reqeust intercpetor
//     axios.interceptors.request.use(
//         config => {
//             // config token as default per request
//             const _token = ""
//             if (_token) {
//                 config.headers.Authorization = `Bearer ${_token}`;
//             }
//             return config;
//         },
//     );

//     // Add a response interceptor
//     axios.interceptors.response.use(
//         (response) => {
//             // if error: "No permission!"
//             // logout & go to login page
//             if (response && response.data && response.data.error === 'No permission!') {
//                 // store.dispatch(userActions.logout());
//             }

//             return response;
//         },
//         (error) => {
//             const _error = { ...error };

//             if (_error.response && _error.response.status === 401) {
//                 // Unauthorized Request
//                 // store.dispatch(userActions.logout());
//             } else if (_error.response && _error.response.status === 403) {
//                 // Forbiden Request
//                 // store.dispatch(forbidenRequest());
//             } else if (_error.response && _error.response.status === 404) {
//                 // route not found
//                 // store.dispatch(erroredRequest());
//                 console.error('error 404');
//                 //history.push('/error/404');
//             } else if (!_error.response) {
//                 // route not found
//                 // store.dispatch(erroredRequest());
//                 console.error('error 404');
//                 //history.push('/error/404');
//             }

//             return Promise.reject(_error);
//         }
//     );
// };



export  {_axios, _axios_auth, _axios_cableone};
