// 3rd Party Libraries
import axios from 'axios';
const BASE_URL="https://customer.uat.cableone.net/apiWrapper/"
const headers = { 'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiI5MDAyNTQ2NDAiLCJnaXZlbl9uYW1lIjoiVGVzdCIsImZhbWlseV9uYW1lIjoiU2hlcm1hbiIsImp0aSI6IjU1YWJhOTM0LWM3ZmMtNDkwMi1iMzlmLTVlOTc3ZjQzZWY2OSIsImlhdCI6MTY5OTY0MDA2NSwiVXNlck5hbWUiOiI5MDAyNTQ2NDAiLCJuYW1lIjoiVGVzdCBTaGVybWFuIiwiZW1haWwiOiI5MDAyNTQ2NDBAY2FibGVvbmUubmV0IiwiZXh0ZXJuYWxfaWQiOiI5MDAyNTQ2NDAiLCJodHRwOi8vc2NoZW1hcy54bWxzb2FwLm9yZy93cy8yMDA1LzA1L2lkZW50aXR5L2NsYWltcy9uYW1lIjoiOTAwMjU0NjQwIiwiaWQiOiIyOWQ5MDM0NC00NjRhLTRjYWItODg5ZS01YzI1N2U3ODUwNzEiLCJjdXN0b21lcl90eXBlIjoiUmVzaWRlbnRpYWwiLCJyb2xlcyI6IlJlc2lkZW50aWFsIiwibGVnYWN5X2NvbXBhbnkiOiJDYWJsZSBPbmUiLCJuYmYiOjE2OTk2NDAwNjQsImV4cCI6MTY5OTY0MTI2NCwiaXNzIjoiV05XRUJTVkNVMDEiLCJhdWQiOiIxMC4xNDAuMzYuMjgifQ.hL25HB27onpqwyAk0hPZuMfpmSVnJpHclEjLRcmDdVI' };
const _axios = axios.create({
    baseURL: BASE_URL,
    timeout: 10000,
    headers: {
        'Content-Type': 'application/json',
        ...headers
    }
});

// _axios.interceptors.request.use(
//     (config) => {
//         // eslint-disable-next-line no-console
//         console.log('interceptorRequest', config);
//         //const token = sessionStorage.getItem('loginInfo') ? 'Bearer ' + JSON.parse(sessionStorage.getItem('loginInfo')).token : null;
//         const token = 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiI5MDAyNTQ2NDAiLCJnaXZlbl9uYW1lIjoiVGVzdCIsImZhbWlseV9uYW1lIjoiU2hlcm1hbiIsImp0aSI6IjI4MGY5MDljLTQwMjYtNDY2Yy1hZjI2LWY1ZDliYWU1ZjRmMSIsImlhdCI6MTY5OTYzMjUyOCwiVXNlck5hbWUiOiI5MDAyNTQ2NDAiLCJuYW1lIjoiVGVzdCBTaGVybWFuIiwiZW1haWwiOiI5MDAyNTQ2NDBAY2FibGVvbmUubmV0IiwiZXh0ZXJuYWxfaWQiOiI5MDAyNTQ2NDAiLCJodHRwOi8vc2NoZW1hcy54bWxzb2FwLm9yZy93cy8yMDA1LzA1L2lkZW50aXR5L2NsYWltcy9uYW1lIjoiOTAwMjU0NjQwIiwiaWQiOiIyOWQ5MDM0NC00NjRhLTRjYWItODg5ZS01YzI1N2U3ODUwNzEiLCJjdXN0b21lcl90eXBlIjoiUmVzaWRlbnRpYWwiLCJyb2xlcyI6IlJlc2lkZW50aWFsIiwibGVnYWN5X2NvbXBhbnkiOiJDYWJsZSBPbmUiLCJuYmYiOjE2OTk2MzI1MjgsImV4cCI6MTY5OTYzOTcyOCwiaXNzIjoiV05XRUJTVkNVMDEiLCJhdWQiOiIxMC4xNDAuMzYuMjgifQ.X69Rudc9exM3y97i1JtsgLhTuRnIIrWjcVP7Zj_VTNM'
//         config.headers.Authorization = token ;
//         return config;
//     },
//     (error) => {
//         // eslint-disable-next-line no-console
//         console.log('interceptorRequestError', error);
//         error = {
//             status: 400,
//             title: 'Error',
//             message: 'This is an invalid request.',
//         };
//         return Promise.reject(error);
//     }
// );

// _axios.interceptors.response.use(
//     (response) => {
//         return responseData;
//         // eslint-disable-next-line no-console
//         console.log('interceptorResponse', response);
//         const responseData = response.data;
//         if (parseInt(response.status, 10) === 200) {
//             return responseData;
//         } else if (
//             parseInt(responseData.code, 10) === 401 || parseInt(responseData.code, 10) === 403 || responseData.message === 'token_not_provided'
//         ) {
//             //sessionStorage.removeItem('loginInfo');
//         } else {
//             const error = {
//                 status: response.status || 500,
//                 title: 'Error',
//                 message: responseData.data.message || 'Please try again in a few minutes.',
//             };
//             return Promise.reject(error);
//         }
//     },
//     (error) => {
//         // eslint-disable-next-line no-console
//         console.log('interceptorResponseError', error);
//         if (error.response) {
//             const status = error.response.status;
//             let statusCode = parseInt(status, 10);
//             if (statusCode === 401 || statusCode === 403) {
//                // sessionStorage.removeItem('userInfo');
//             }
//         } else {
//             if (error.message.indexOf('timeout') >= 0) {
//                 error = {
//                     status: 400,
//                     title: 'The request timed out.',
//                     message: 'Please try again later.',
//                 };
//             } else if (error.message.indexOf('Network Error') >= 0) {
//                 error = {
//                     status: 400,
//                     title: 'The network connection is not smooth.',
//                     message: 'Please try again later.',
//                 };
//             } else {
//                 error = {
//                     status: error.status || 500,
//                     title: error.title || 'The network connection is not smooth.',
//                     message: error.message || 'Please try again later.',
//                 };
//             }
//             return Promise.reject(error);
//         }
//     }
// );

export default _axios;
