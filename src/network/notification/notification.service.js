import { _axios } from "../RestApiClient";
import { getUser } from "../../redux/utils/LocalStorage";
import { getEndpoint, ENDPOINTS } from "../apis/endpoints/Endpoints";

const getAuthConfig = async () => {
    const user = await getUser();
    return {
        headers: {
            Authorization: "Bearer " + user.token
        }
    };
};

const getUserAccountNumber = async () => {
    const user = await getUser();
    return user.userInfo.accountNumber;
};

export const getAllEmails = async () => {
    try {
        const config = await getAuthConfig();
        const accountNumber = await getUserAccountNumber();
        const response = await _axios.get(
            getEndpoint(ENDPOINTS.PAPERLESS_GET_ALL_EMAILS, { accountNumber }),
            { ...config }
        );
        return response.data;
    } catch (error) {
        console.error('Error fetching emails:', error);
        throw error;
    }
};

export const isPaperlessEnabled = async (email) => {
    try {
        const config = await getAuthConfig();
        const accountNumber = await getUserAccountNumber();
        const response = await _axios.get(
            getEndpoint(ENDPOINTS.PAPERLESS_IS_ENABLED, { accountNumber, email }),
            { ...config }
        );
        return response.data;
    } catch (error) {
        console.error('Error checking paperless status:', error);
        throw error;
    }
};

export const enrollPaperless = async (data) => {
    try {
        const config = await getAuthConfig();
        const accountNumber = await getUserAccountNumber();
        const response = await _axios.post(
            getEndpoint(ENDPOINTS.PAPERLESS_ENROLL, { emailAddress: data.emailAddress, accountNumber }),
            null,
            { ...config }
        );
        return response.data;
    } catch (error) {
        console.error('Error enrolling in paperless:', error);
        throw error;
    }
};

export const unenrollPaperless = async (data) => {
    try {
        const config = await getAuthConfig();
        const accountNumber = await getUserAccountNumber();
        const { emailAddress } = data;
        const response = await _axios.post(
            getEndpoint(ENDPOINTS.PAPERLESS_UNENROLL, { emailAddress, accountNumber }),
            null,
            { ...config }
        );
        return response.data;
    } catch (error) {
        console.error('Error unenrolling from paperless:', error);
        throw error;
    }
};

export const addPrimaryEmail = async ({ newEmail, oldEmail }) => {
    try {
        const config = await getAuthConfig();
        const accountNumber = await getUserAccountNumber();

        const payload = {
            account: accountNumber,
            newEmail,
            oldEmail: oldEmail || ""
        };

        const response = await _axios.post(
            getEndpoint(ENDPOINTS.UPDATE_EMAIL_ADD_PRIMARY),
            payload,
            { ...config }
        );
        return response.data;
    } catch (error) {
        console.error('Error adding primary email:', error);
        throw error;
    }
};

export const updatePrimaryEmail = async ({ newEmail, oldEmail }) => {
    try {
        const config = await getAuthConfig();
        const accountNumber = await getUserAccountNumber();

        const payload = {
            account: accountNumber,
            newEmail,
            oldEmail
        };

        const response = await _axios.post(
            getEndpoint(ENDPOINTS.UPDATE_EMAIL_UPDATE_PRIMARY),
            payload,
            { ...config }
        );
        return response.data;
    } catch (error) {
        console.error('Error updating primary email:', error);
        throw error;
    }
};
