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


/**
 * Setup axios
 */
export const setupAxios = (store) => {
    // get token
    //const token = window.localStorage.getItem('token');
      const token="";
    // if token exists set token
    // dispatch login action
    if (token && token !== '' && token !== 'null') {
        // store.dispatch(userActions.login(token));
    }

    // reqeust intercpetor
    axios.interceptors.request.use(
        config => {
            // config token as default per request
            const _token = window.localStorage.getItem('token');
            if (_token) {
                config.headers.Authorization = `Bearer ${_token}`;
            }
            return config;
        },
    );

    // Add a response interceptor
    axios.interceptors.response.use(
        (response) => {
            // if error: "No permission!"
            // logout & go to login page
            if (response && response.data && response.data.error === 'No permission!') {
                // store.dispatch(userActions.logout());
            }

            return response;
        },
        (error) => {
            const _error = { ...error };

            if (_error.response && _error.response.status === 401) {
                // Unauthorized Request
                // store.dispatch(userActions.logout());
            } else if (_error.response && _error.response.status === 403) {
                // Forbiden Request
                // store.dispatch(forbidenRequest());
            } else if (_error.response && _error.response.status === 404) {
                // route not found
                // store.dispatch(erroredRequest());
                console.error('error 404');
                //history.push('/error/404');
            } else if (!_error.response) {
                // route not found
                // store.dispatch(erroredRequest());
                console.error('error 404');
                //history.push('/error/404');
            }

            return Promise.reject(_error);
        }
    );
};



export default _axios;
