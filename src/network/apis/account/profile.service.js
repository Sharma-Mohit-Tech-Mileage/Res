import { _axios } from "../../RestApiClient";
import { getUser } from "../../../redux/utils/LocalStorage";

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

const postEmailNotification = async (email) => {
    let user = await getUser();
    const accountNumber = user.userInfo?.accountNumber || null;
    const config = {
        headers: {
            Authorization: `Bearer ${user.token}`
        }
    };

    // Log the request endpoint and data
    console.log(`Making API Call to /account/api/account/${accountNumber}/paperless with email:`, email);

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



export { fetchUserList, getProfileDetails, fetchSmsSubscription, postProfileInfo, postTextNotifictionInfo, fetchBillingStatus, fetchPaperLessDetails, postEmailNotification }