import { _axios } from "../../RestApiClient";
import { getUser } from "../../../redux/utils/LocalStorage";
import axios from 'axios'; // Make sure to import axios
import moment from "moment";
import { Env } from "./Constants";
import { getDeviceUniqueId } from "../../../firebase/FirebaseUtils";
let getProfileDetailsCount = 0;
const getProfileDetails = async () => {
    getProfileDetailsCount = getProfileDetailsCount + 1;
    let data = await getUser();
    const accountNumber = data.userInfo?.accountNumber || null;
    const config = {
        headers: {
            Authorization: "Bearer " + data.token
        }
    };
    console.log("Authorization header:", config.headers.Authorization);
    let ApiMethod = ''
    if (accountNumber.toString().length >= 16) {
        ApiMethod = `/api/profile/${accountNumber}`
    } else {
        ApiMethod = `/users/api/profile/${accountNumber}`
    }
    return _axios.get(ApiMethod, { ...config })
        .then(res => res.data)
        .catch(error => {
            console.error(`Error fetching /${ApiMethod}`, error);
            if (error.toString().includes('AxiosError: timeout of') && getProfileDetailsCount < 2) {
                getProfileDetails();
            } else {
                getProfileDetailsCount = 0;
                throw error;
            }
        });
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
            console.log(JSON.stringify(res.data, null, 2));
            return res.data;
        })
        .catch(error => {
            // Log and throw the error
            console.error('Error fetching user list:', JSON.stringify(error, null, 2));
            throw error;
        });
};

let fetchSmsSubscriptionCount = 0;
const fetchSmsSubscription = async () => {
    fetchSmsSubscriptionCount = fetchSmsSubscriptionCount + 1;
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
            if (error.toString().includes('AxiosError: timeout of') && fetchSmsSubscriptionCount < 2) {
                fetchSmsSubscription();
            } else {
                fetchSmsSubscriptionCount = 0;
                throw error;
            }
            throw error;
        });
};


let fetchBillingStatusCount = 0;
const fetchBillingStatus = async () => {
    fetchBillingStatusCount = fetchBillingStatusCount + 1;
    console.log('fetchBillingStatusCount: ', fetchBillingStatusCount);
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
            return res.data;
        })
        .catch(error => {
            console.error('Error fetching /account/api/account/`${accountNumber}`/paperless/status', error);
            if (error.toString().includes('AxiosError: timeout of') && fetchBillingStatusCount < 2) {
                console.log('Inside Billing Status');
                fetchBillingStatus();
            } else {
                fetchBillingStatusCount = 0;
                throw error;
            }
        });
};

let fetchPaperLessDetailsCount = 0;
const fetchPaperLessDetails = async () => {
    fetchPaperLessDetailsCount = fetchPaperLessDetailsCount + 1;
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
            if (error.toString().includes('AxiosError: timeout of') && fetchPaperLessDetailsCount < 2) {
                fetchPaperLessDetails();
            } else {
                fetchPaperLessDetailsCount = 0
                throw error;
            }
        });
};

let fetchPushNotificationsCount = 0;
const fetchPushNotifications = async () => {
    fetchPushNotificationsCount = fetchPushNotificationsCount + 1;
    let user = await getUser();
    const userName = user.userInfo?.userName || null;
    const accountNumber = user.userInfo?.accountNumber || null;
    const config = {
        headers: {
            Authorization: "Bearer " + user.token
        }
    };
    console.log(`/mobile/api/mobilenotificationpreferences/${userName}/mobilepreferencesSec/${accountNumber}`);
    try {
        const response = await _axios.get(`/mobile/api/mobilenotificationpreferences/${userName}/mobilepreferencesSec/${accountNumber}`, { ...config });
        return response.data;
    } catch (error) {
        console.error(`Error in API Call to /mobile/api/mobilenotificationpreferences/${userName}/mobilepreferencesSec/${accountNumber}`, error);
        if (error.toString().includes('AxiosError: timeout of') && fetchPushNotificationsCount < 2) {
            fetchPushNotifications();
        } else {
            fetchPushNotificationsCount = 0;
            throw error;
        }
    }
};

const postProfileInfo = async (data) => {
    try {
        const user = await getUser();
        if (!user || !user.token) {
            throw new Error("User information or token is missing");
        }

        const config = {
            headers: {
                Authorization: `Bearer ${user.token}`,
            },
        };
        console.log('API Request Configuration:', config);

        const accountNumber = user.userInfo?.accountNumber;
        if (!accountNumber) {
            throw new Error("Account number is missing");
        }
        let ApiMethod = ''
        if (accountNumber.toString().length >= 16) {
            ApiMethod = `/api/profile`
        } else {
            ApiMethod = `/users/api/profile`
        }
        console.log(`Making API Call to ${ApiMethod} with data:`, data);

        const response = await _axios.put(ApiMethod, data, config);
        console.log('API Call Successful, Response:', response.data);

        return response.data;
    } catch (error) {
        console.error('API Call Failed:', error.message);
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

    try {
        const response = await _axios.put(`/account/api/account/${accountNumber}/paperless/${email}`, {}, config);

        console.log(`API Call Successful to /account/api/account/${accountNumber}/paperless/${email}, Response:`, response);
        return response;
    } catch (error) {
        console.error(`Error in API Call to /account/api/account/${accountNumber}/paperless/${email}:`, error);
        throw error;
    }
};

const resendEmailVerification = async () => {
    let user = await getUser();
    const accountNumber = user.userInfo?.accountNumber || null;
    const config = {
        headers: {
            Authorization: `Bearer ${user.token}`
        }
    };

    try {
        const response = await _axios.post(`/account/api/account/${accountNumber}/paperless/resend`, {}, config);

        console.log(`API Call Successful to /account/api/account/${accountNumber}/paperless/resend, Response:`, response);
        return response;
    } catch (error) {
        console.error(`Error in API Call to /account/api/account/${accountNumber}/paperless/resend:`, error);
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

    try {
        const response = await _axios.post(`/account/api/account/${accountNumber}/paperless/${email}`, {}, config);

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

    try {
        const response = await _axios.put(`/mobile/api/mobileuser/${accountNumber}/updatemobiletcacceptanceflag/${userName}/${flag}`, {}, config);

        return response;
    } catch (error) {
        console.error(`Error in API Call to /mobile/api/mobileuser/${accountNumber}/updatemobiletcacceptanceflag/${userName}/${flag}:`, error);
        throw error;
    }
};

const postTermsAndConditionsv2 = async (flag) => {
    let user = await getUser();
    const accountNumber = user.userInfo?.accountNumber;
    const userName = user.userInfo?.userName;
    const mobileTCAcceptanceFlag = flag;
    const tcAccpetanceDate = moment().format();
    const customerType = "Residential";

    const payload = {
        accountNumber,
        userName,
        mobileTCAcceptanceFlag,
        tcAccpetanceDate,
        customerType
    };

    const config = {
        headers: {
            Authorization: `Bearer ${user.token}`
        }
    };
    try {
        const response = await _axios.put('/api/Mobile/UpdateMobileAspnetUserData', payload, config);
        console.log(`API Call Successful to /mobile/api/MobileUser/updateMobiletAspnuserDataSec, Response:`, response);
        return response;
    } catch (error) {
        console.error(`Error in API Call to /mobile/api/MobileUser/updateMobiletAspnuserDataSec:`, error);
        throw error;
    }
};

const postPushNotifications = async (data) => {
    let user = await getUser();
    let deviceToken = await getDeviceUniqueId();
    const accountNumber = user.userInfo?.accountNumber || null;
    const userName = user.userInfo?.userName || null;
    data.accountNumber = accountNumber;
    data.userName = userName;
    data['deviceId'] = deviceToken;
    data['customerType'] = 'Residential'
    const config = {
        headers: {
            Authorization: `Bearer ${user.token}`
        }
    };

    try {
        const response = await _axios.post(`/mobile/api/mobilenotificationpreferences/${userName}/mobilepreferences`, data, config);

        console.log(`API Call Successful to /mobile/api/mobilenotificationpreferences/${userName}/mobilepreferences, Response:`, response);
        return response;
    } catch (error) {
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
    try {
        const response = await _axios.put(`/account/api/account/${accountNumber}/paperless/unsubscribe`, {}, config);
        return response;
    } catch (error) {
        console.error(`Error in API Call to /account/api/account/${accountNumber}/paperless/unsubscribe:`, error);
        throw error;
    }
};

const handleSubmitFeedback = async (obj) => {
    const zendeskRequestApiUrl = Env.ZENDESK_FEEDBACK.Url
    let user = await getUser();
    const fullName = user.userInfo?.fullName;
    const payload = {
        request: {
            ticket_form_id: Env.ZENDESK_FEEDBACK.ticket_form_id,
            requester: {
                name: fullName,
                email: obj.feedbackEmail
            },
            recipient: Env.ZENDESK_FEEDBACK.recipient,
            assignee_id: Env.ZENDESK_FEEDBACK.assignee_id,
            group_id: Env.ZENDESK_FEEDBACK.group_id,
            type: null,
            custom_fields: [
                { id: Env.ZENDESK_FEEDBACK.category_id, value: obj.category },
                { id: Env.ZENDESK_FEEDBACK.feedbackValue_id, value: obj.feedbackValue },
                { id: Env.ZENDESK_FEEDBACK.email_id, value: obj.feedbackEmail }
            ],
            subject: "Residential MobileApp Feedback",
            comment: {
                body: obj.feedbackText,
                uploads: null
            },
            tags: ["Feedback", "Residential", "resimobileapp", 'pid_' + user.userInfo.accountNumber],
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

const logError = async (errorData) => {
   
    try {
        await _axios.post('/logging/api/log/error', errorData);
        console.log('Error logged successfully');
    } catch (logErr) {
        console.error('Failed to log error:', logErr);
    }
};

const logInfo = async (infoData) => {
    try {
        const response = await _axios.post('/logging/api/log/info', infoData);
        console.log('Info logged successfully');
    } catch (logErr) {
        console.error('Failed to log info:', logErr);
    }
};

const addUserAction = async (data) => {
    let user = await getUser();

    const config = {
        headers: {
            Authorization: "Bearer " + user.token
        }
    };

    try {
        const response = await _axios.post('/users/api/users', data, config);
        console.log('API Call Successful, Response:', response.data);
        return response.data;
    } catch (error) {
        console.error('API Call Failed, Error:', error);
        throw error;
    }
};

const editUserAction = async (data) => {
    let user = await getUser();

    const config = {
        headers: {
            Authorization: "Bearer " + user.token
        }
    };

    console.log('Making API Call to /users/api/users with data:', data); // Log the request data

    try {
        const response = await _axios.put(`/users/api/users/${data.userName}`, data, config);
        console.log('API Call Successful, Response:', response.data); // Log the successful response
        return response.data;
    } catch (error) {
        console.error('API Call Failed, Error:', error); // Log the error
        throw error;
    }
};

const removeUser = async (data) => {
    let user = await getUser();

    const config = {
        headers: {
            Authorization: "Bearer " + user.token
        }
    };

    console.log(`/users/api/users/remove/${data.accountNumber}/${data.userName}`); // Log the request data

    try {
        const response = await _axios.put(`/users/api/users/remove/${data.accountNumber}/${data.userName}`, data, config);
        console.log('API Call Successful, Response:', response.data); // Log the successful response
        return response.data;
    } catch (error) {
        console.error('API Call Failed, Error:', error); // Log the error
        throw error;
    }
};
const fetchAllSvEmails = async (data) => {
    let user = await getUser();
    const accountNumber = user.userInfo?.accountNumber || null;
    const config = {
        headers: {
            Authorization: "Bearer " + user.token
        }
    };
    console.log(`/mobile/api/email/${accountNumber}/GetAllSVEmails`);
    try {
        const response = await _axios.get(`/mobile/api/email/${accountNumber}/GetAllSVEmails`, config);
        console.log('API Call Successful, Response:', response.data);
        return response.data;
    } catch (error) {
        console.error('API Call Failed, Error:', error); // Log the error
        throw error;
    }
};

const addSVEmailNoFlags = async (email) => {
    let user = await getUser();
    const accountNumber = user.userInfo?.accountNumber || null;
    const config = {
        headers: {
            Authorization: "Bearer " + user.token
        }
    };

    try {
        const response = await _axios.post(`Mobile/api/email/${accountNumber}/${email}/AddSVEmailNoFlags`, {}, config);
        console.log(`API Call Successful to add SV email without flags: ${email}`, response.data);
        return response.data;
    } catch (error) {
        console.error(`Error in API Call to add SV email without flags: ${email}`, error);
        throw error;
    }
};

const deleteSVEmail = async (email) => {
    let user = await getUser();
    const accountNumber = user.userInfo?.accountNumber || null;
    const config = {
        headers: {
            Authorization: "Bearer " + user.token
        }
    };

    try {
        const response = await _axios.post(`mobile/api/email/${accountNumber}/${email}/DeleteSVEmail`, {}, config);
        console.log(`API Call Successful to delete SV email: ${email}`, response.data);
        return response.data;
    } catch (error) {
        console.error(`Error in API Call to delete SV email: ${email}`, error);
        throw error;
    }
};

const updateSVEmails = async (emailList) => {
    let user = await getUser();
    const accountNumber = user.userInfo?.accountNumber || null;
    const config = {
        headers: {
            Authorization: `Bearer ${user.token}`
        }
    };

    const body = emailList.map(email => ({ "EmailAddress": email }));

    try {
        const response = await _axios.post(`Mobile/api/email/${accountNumber}/UpdateSVEmails`, body, config);
        return response.data;
    } catch (error) {
        throw error;
    }
};


const manageSVEmails = async (emailList) => {
    try {
        let user = await getUser();
        console.log('User Details:', user);
        const accountNumber = user.userInfo?.accountNumber || null;
        console.log('Account Number:', accountNumber);
        const config = {
            headers: {
                Authorization: `Bearer ${user.token}`
            }
        };
        console.log('Request Config:', config);
        console.log('Email List:', emailList);
        const response = await _axios.post(`Mobile/api/email/${accountNumber}/UpdateSVEmails`, emailList, config);
        console.log('Response Data:', response.data);
        return response.data;
    } catch (error) {
        console.error('Error managing SV emails:', error);
        throw error;
    }
};
const addSVEmailMktFlag = async (email) => {
    let user = await getUser();
    const accountNumber = user.userInfo?.accountNumber || null;
    const config = {
        headers: {
            Authorization: "Bearer " + user.token
        }
    };
    try {
        const response = await _axios.post(`/Mobile/api/email/${accountNumber}/${email}/AddSVEmailMktFlag`, {}, config);
        console.log(`API Call Successful to add SV email marketing flag: ${email}`, response.data);
        return response.data;
    } catch (error) {
        console.error(`Error in API Call to add SV email marketing flag: ${email}`, error);
        throw error;
    }
};

const isPaperlessEnabled = async (email) => {
    const user = await getUser();
    const response = await _axios.get(
        `/api/Paperless/IsPaperless?account=${user.userInfo.accountNumber}&email=${email}`,
        { headers: { Authorization: `Bearer ${user.token}` } }
    );
    return response.data;
};

 const fetchACPUserAccountDetails = async () => {
    let user = await getUser();
    const accountNumber = user.userInfo?.accountNumber || null;
    
    const config = {
        headers: {
            Authorization: "Bearer " + user.token
        }
    };

    const requestUrl = `/api/Accounts/GetAccountDetails`;
    const data = {
        accountNumber: accountNumber,
        fieldList: [
            "first_name", "last_name",
            "current_balance", "past_due_amount",
            "payment_due_date", "customer_type",
            "services",
            "email_details",
             "email",
             "unreturned_equipment_fees",
        ],
    };

    try {
        const response = await _axios.post(requestUrl, data, config);
        console.log("API Call Successful:", response.data);
        return response.data;
    } catch (error) {
        console.error("Error in API Call:", error);
        throw error;
    }
};


export { fetchACPUserAccountDetails,logError, logInfo, fetchUserList, getProfileDetails, fetchSmsSubscription, postProfileInfo, postTextNotifictionInfo, fetchBillingStatus, fetchPaperLessDetails, putEmailNotification, postEmailNotification, postTermsAndConditions, postTermsAndConditionsv2, postPushNotifications, unsubscribPaperLess, fetchPushNotifications, handleSubmitFeedback, manageSVEmails, isPaperlessEnabled, resendEmailVerification, addUserAction, removeUser, editUserAction, fetchAllSvEmails, addSVEmailNoFlags, deleteSVEmail, updateSVEmails, addSVEmailMktFlag }