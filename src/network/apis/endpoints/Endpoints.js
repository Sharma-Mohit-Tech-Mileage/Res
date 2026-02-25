export const ENDPOINTS = {
    // Auth
    LOGIN_SSO: 'api/mobile/gettoken',

    // Home
    ACCOUNTS_EASYPAY: 'api/Accounts/:accountNumber/easypay',
    GET_OUTAGE: 'api/outage/GetOutages?accountNumber=:accountNumber',

    //Zendesk
    ZENDESK_TOKEN: 'api/Zendesk/TokenAuth',

    // Profile
    GET_PROFILE: 'api/Accounts/:accountNumber/profile',
    UPDATE_PROFILE: 'api/Accounts/:accountNumber/profile',


    //Survey
    SURVEY: 'api/Survey',
    SERVICE_DISCONNECT_SURVEY: "api/Order/Disconnect",

    
};  



export const getEndpoint = (endpointOrKey, params = {}) => {
    // Allow passing either a key from ENDPOINTS or a raw endpoint string
    let endpoint = ENDPOINTS[endpointOrKey] || endpointOrKey;

    if (!endpoint) {
        return endpoint;
    }

    Object.keys(params).forEach((param) => {
        endpoint = endpoint.replace(`:${param}`, params[param]);
    });

    return endpoint;
};