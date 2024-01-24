import { _axios, _axios_cableone } from "../../RestApiClient";
import { getUser } from "../../../redux/utils/LocalStorage";
import axios from 'axios'; // Make sure to import axios
import { Env } from "./Constants";

const getProfileDetails = async () => {
    let data = await getUser();
    const accountNumber = data.userInfo?.accountNumber || null;
    const config = {
        headers: {
            Authorization: "Bearer " + data.token
        }
    };

    return _axios.get(`/users/api/profile/${accountNumber}`, { ...config }).then(res => res.data).catch(error => { throw error })
};

const fetchUserList = async () => {
    let data = await getUser();
    const accountNumber = data.userInfo?.accountNumber || null;
    const config = {
        headers: {
            Authorization: "Bearer " + data.token
        }
    };

    return _axios.get(`/users/api/account/${accountNumber}/users`, { ...config })
        .then(res => {
            // Log the stringified data for debugging
            console.log(JSON.stringify(res.data, null, 2)); // null and 2 are for formatting
            return res.data;  // Return the actual data, not the stringified version
        })
        .catch(error => {
            // Log and throw the error
            console.error('Error fetching user list:', JSON.stringify(error, null, 2));
            throw error;
        });
};

const fetchSmsSubscription = async () => {
    let data = await getUser();
    const accountNumber = data.userInfo?.accountNumber || null;
    const config = {
        headers: {
            Authorization: "Bearer " + data.token
        }
    };

    return _axios.get(`/users/api/SMS/sms?AccountNumber=${accountNumber}`, { ...config })
        .then(res => {
            console.log('fetching SMS subscription list:', JSON.stringify(res.data, null, 2));
            return res.data;  // Return the actual data, not the stringified version
        })
        .catch(error => {
            console.error('Error fetching SMS subscription list:', error);
            throw error;
        });
};

const fetchBillingStatus = async () => {
    let data = await getUser();
    const accountNumber = data.userInfo?.accountNumber || null;
    const config = {
        headers: {
            Authorization: "Bearer " + data.token
        }
    };

    return _axios.get(`/account/api/account/${accountNumber}/paperless/status`, { ...config })
        .then(res => {
            console.log('fetching fetching /account/api/account/`${accountNumber}`/paperless/status', JSON.stringify(res.data, null, 2));
            return res.data;  // Return the actual data, not the stringified version
        })
        .catch(error => {
            console.error('Error fetching /account/api/account/`${accountNumber}`/paperless/status', error);
            throw error;
        });
};

const fetchPaperLessDetails = async () => {
    let data = await getUser();
    const accountNumber = data.userInfo?.accountNumber || null;
    const config = {
        headers: {
            Authorization: "Bearer " + data.token
        }
    };

    return _axios.get(`/account/api/account/${accountNumber}/paperless`, { ...config })
        .then(res => {
            console.log('fetching fetchPaperLessDetails /account/api/account/`${accountNumber}`/paperless', JSON.stringify(res.data, null, 2));
            return res.data;  // Return the actual data, not the stringified version
        })
        .catch(error => {
            console.error('Error fetching fetchPaperLessDetails /account/api/account/`${accountNumber}`/paperless', error);
            throw error;
        });
};

const fetchPushNotifications = async () => {
    let user = await getUser();
    const userName = user.userInfo?.userName || null;
    const config = {
        headers: {
            Authorization: "Bearer " + user.token
        }
    };

    //https://customer.uat.cableone.net/apiWrapper/mobile/api/mobilenotificationpreferences/{UserName}/mobilepreferences

    // Log the request endpoint and data
    console.log(`Making API Call to /mobile/api/mobilenotificationpreferences/${userName}/mobilepreferences`);

    try {
        const response = await _axios_cableone.get(`/mobile/api/mobilenotificationpreferences/${userName}/mobilepreferences`, { ...config });

        // Log the successful response
        console.log(`API Call Successful to /mobile/api/mobilenotificationpreferences/${userName}/mobilepreferences, Response:;;;;;;;;;;;;;;;;;`, JSON.stringify(response.data));
        return response.data;
    } catch (error) {
        // Log the error with a descriptive message
        console.error(`Error in API Call to /mobile/api/mobilenotificationpreferences/${userName}/mobilepreferences`, error);
        throw error;
    }
};

const postProfileInfo = async (data) => {
    let user = await getUser();

    const config = {
        headers: {
            Authorization: "Bearer " + user.token
        }
    };

    console.log('Making API Call to /users/api/profile with data:', data); // Log the request data

    try {
        const response = await _axios.put(`/users/api/profile`, data, config);
        console.log('API Call Successful, Response:', response.data); // Log the successful response
        return response.data;
    } catch (error) {
        console.error('API Call Failed, Error:', error); // Log the error
        throw error;
    }
};

const postTextNotifictionInfo = async (data) => {
    let user = await getUser();
    const accountNumber = user.userInfo?.accountNumber || null;
    data['accountNumber'] = accountNumber;
    const config = {
        headers: {
            Authorization: "Bearer " + user.token
        }
    };
    console.log('Making API Call to /users/api/SMS with data:', data); // Log the request data
    try {
        const response = await _axios.post(`/users/api/SMS`, data, config);
        console.log('API Call Successful, Response:', response.data); // Log the successful response
        return response.data;
    } catch (error) {
        console.error('API Call Failed, Error:', error); // Log the error
        throw error;
    }
};

const putEmailNotification = async (email) => {
    let user = await getUser();
    const accountNumber = user.userInfo?.accountNumber || null;
    const config = {
        headers: {
            Authorization: `Bearer ${user.token}`
        }
    };

    // Log the request endpoint and data
    console.log(`Making API putEmailNotification Call to /account/api/account/${accountNumber}/paperless with email:`, email);

    try {
        const response = await _axios.put(`/account/api/account/${accountNumber}/paperless/${email}`, {}, config);

        // Log the successful response
        console.log(`API Call Successful to /account/api/account/${accountNumber}/paperless, Response:`, response);
        return response;
    } catch (error) {
        // Log the error with a descriptive message
        console.error(`Error in API Call to /account/api/account/${accountNumber}/paperless:`, error);
        throw error;
    }
};

const postEmailNotification = async (email) => {
    let user = await getUser();
    const accountNumber = user.userInfo?.accountNumber || null;
    const config = {
        headers: {
            Authorization: `Bearer ${user.token}`
        }
    };

    // Log the request endpoint and data
    console.log(`Making API  postEmailNotification Call to /account/api/account/${accountNumber}/paperless with email:`, email);

    try {
        const response = await _axios.post(`/account/api/account/${accountNumber}/paperless/${email}`, {}, config);

        // Log the successful response
        console.log(`API Call Successful to /account/api/account/${accountNumber}/paperless, Response:`, response);
        return response;
    } catch (error) {
        // Log the error with a descriptive message
        console.error(`Error in API Call to /account/api/account/${accountNumber}/paperless:`, error);
        throw error;
    }
};

const postTermsAndConditions = async (flag) => {
    let user = await getUser();
    const accountNumber = user.userInfo?.accountNumber || null;
    const userName = user.userInfo?.userName || null;
    const config = {
        headers: {
            Authorization: `Bearer ${user.token}`
        }
    };

    // Log the request endpoint and data
    console.log(`Making API Call to /mobile/api/mobileuser/${accountNumber}/updatemobiletcacceptanceflag/${userName}/${flag}:`);

    try {
        const response = await _axios_cableone.put(`/mobile/api/mobileuser/${accountNumber}/updatemobiletcacceptanceflag/${userName}/${flag}`, {}, config);

        // Log the successful response
        console.log(`API Call Successful to /mobile/api/mobileuser/${accountNumber}/updatemobiletcacceptanceflag/${userName}/${flag}, Response:`, response);
        return response;
    } catch (error) {
        // Log the error with a descriptive message
        console.error(`Error in API Call to /mobile/api/mobileuser/${accountNumber}/updatemobiletcacceptanceflag/${userName}/${flag}:`, error);
        throw error;
    }
};

const postPushNotifications = async (data) => {
    let user = await getUser();
    const accountNumber = user.userInfo?.accountNumber || null;
    const userName = user.userInfo?.userName || null;
    // Update data object with accountNumber and userName
    data.accountNumber = accountNumber;
    data.userName = userName;

    const config = {
        headers: {
            Authorization: `Bearer ${user.token}`
        }
    };

    //https://customer.uat.cableone.net/apiWrapper/mobile/api/mobilenotificationpreferences/{UserName}/mobilepreferences

    // Log the request endpoint and data
    console.log(`Making API Call to /mobile/api/mobilenotificationpreferences/${userName}/mobilepreferences with payload`, data);

    try {
        const response = await _axios_cableone.post(`/mobile/api/mobilenotificationpreferences/${userName}/mobilepreferences`, data, config);

        // Log the successful response
        console.log(`API Call Successful to /mobile/api/mobilenotificationpreferences/${userName}/mobilepreferences, Response:`, response);
        return response;
    } catch (error) {
        // Log the error with a descriptive message
        console.error(`Error in API Call to /mobile/api/mobilenotificationpreferences/${userName}/mobilepreferences`, error);
        throw error;
    }
};

const unsubscribPaperLess = async () => {
    let user = await getUser();
    const accountNumber = user.userInfo?.accountNumber || null;

    const config = {
        headers: {
            Authorization: `Bearer ${user.token}`
        }
    };

    // Log the request endpoint and data
    console.log(`Making API Call to /account/api/account/${accountNumber}/paperless/ with accountNumber:`, accountNumber);

    try {
        const response = await _axios.put(`/account/api/account/${accountNumber}/paperless/unsubscribe`, {}, config);

        // Log the successful response
        console.log(`API Call Successful to /account/api/account/${accountNumber}/paperless/unsubscribe, Response:`, response);
        return response;
    } catch (error) {
        // Log the error with a descriptive message
        console.error(`Error in API Call to /account/api/account/${accountNumber}/paperless/unsubscribe:`, error);
        throw error;
    }
};

// const handleSubmitFeedback = async (obj) => {
//     const zendeskRequestApiUrl = 'https://cableone.zendesk.com/api/v2/requests.json';
//     let user = await getUser();
//     const fullName = user.userInfo?.fullName;
//     const payload = {
//         request: {
//             ticket_form_id: "360000052934",
//             requester: {
//                 name: fullName,
//                 email: obj.email
//             },
//             recipient: "400018994093",
//             assignee_id: "400018994093",
//             group_id: "360000672214",
//             type: null,
//             custom_fields: [
//                 { id: "360022798993", value: obj.category },
//                 { id: "1900000846365", value: obj.feedbackValue },
//                 { id: "36003617614", value: obj.email }
//             ],
//             subject: "Residential MobileApp Feedback",
//             comment: {
//                 body: obj.feedbackText,
//                 uploads: null
//             },
//             tags: ["Feedback", "Residential", "MobileApp"],
//             via: { channel: "MobileApp" }
//         }
//     };
//     console.log('PAYLOAD====================', payload);
//     try {
//         const response = await axios.post(zendeskRequestApiUrl, payload);
//         return response;
//     } catch (error) {
//         throw error;
//     }
// };

const handleSubmitFeedback = async (obj) => {
    const zendeskRequestApiUrl = Env.ZENDESK_FEEDBACK.Url
    let user = await getUser();
    const fullName = user.userInfo?.fullName;
    const payload = {
        request: {
            ticket_form_id:Env.ZENDESK_FEEDBACK.ticket_form_id ,
            requester: {
                name: fullName,
                email: obj.email
            },
            recipient: Env.ZENDESK_FEEDBACK.recipient,
            assignee_id:Env.ZENDESK_FEEDBACK.assignee_id,
            group_id: Env.ZENDESK_FEEDBACK.group_id,
            type: null,
            custom_fields: [
                { id:Env.ZENDESK_FEEDBACK.category_id , value: obj.category },
                { id: "18708581262999", value: obj.feedbackValue },
                { id: "1500002222302", value: obj.email }
            ],
            subject: "Residential MobileApp Feedback",
            comment: {
                body: obj.feedbackText,
                uploads: null
            },
            tags: ["Feedback", "Residential", "MobileApp"],
            via: { channel: "MobileApp" }
        }
    };
    console.log('PAYLOAD====================', payload);
    try {
        const response = await axios.post(zendeskRequestApiUrl, payload);
        return response;
    } catch (error) {
        throw error;
    }
};


export { fetchUserList, getProfileDetails, fetchSmsSubscription, postProfileInfo, postTextNotifictionInfo, fetchBillingStatus, fetchPaperLessDetails, putEmailNotification, postEmailNotification, postTermsAndConditions, postPushNotifications, unsubscribPaperLess, fetchPushNotifications, handleSubmitFeedback }