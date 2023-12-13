import { _axios } from "../../RestApiClient";
import { getUser } from "../../../redux/utils/LocalStorage";
import moment from 'moment';

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
            // Log the stringified data for debugging
           // console.log(JSON.stringify(res.data, null, 2)); // null and 2 are for formatting
            return res.data;  // Return the actual data, not the stringified version
        })
        .catch(error => {
            // Log and throw the error
            console.error('Error fetching user list:', JSON.stringify(error, null, 2));
            throw error;
        });
};

export { fetchUserList, getProfileDetails, fetchSmsSubscription }