import { _axios } from "../RestApiClient";
import { getUser } from "../../redux/utils/LocalStorage";

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

// Get all emails associated with account
export const getAllEmails = async () => {
    try {
        const config = await getAuthConfig();
        const accountNumber = await getUserAccountNumber();
        
        const response = await _axios.get(
            `/api/Paperless/GetAllEmails?account=${accountNumber}`, 
            {...config}
        );
        console.log(' Emails fetched successfully:', response.data);
        return response.data;
    } catch (error) {
        console.error(' Error fetching emails:', error);
        throw error;
    }
};

// Check paperless status for an email
export const isPaperlessEnabled = async (email) => {
    try {
        const config = await getAuthConfig();
        const accountNumber = await getUserAccountNumber();
        console.log('🔍 Checking paperless status for:', { email, accountNumber });
        
        const response = await _axios.get(
            `/api/Paperless/IsPaperless?account=${accountNumber}&email=${email}`, 
            {...config}
        );
        console.log(' Paperless status checked:', response.data);
        return response.data;
    } catch (error) {
        console.error(' Error checking paperless status:', error);
        throw error;
    }
};

// Enroll in paperless for an email
export const enrollPaperless = async (data) => {
    try {
        const config = await getAuthConfig();
        const accountNumber = await getUserAccountNumber();
        
        const response = await _axios.post(
            `/api/Paperless/PaperlessEnrollment?emailAddress=${data.emailAddress}&account=${accountNumber}`, 
            null, 
            {...config}
        );
        console.log('Paperless enrollment successful:', response.data);
        return response.data;
    } catch (error) {
        console.error(' Error enrolling in paperless:', error);
        throw error;
    }
};

export const unenrollPaperless = async (data) => {
    try {
        const config = await getAuthConfig();
        const accountNumber = await getUserAccountNumber();
        const { emailAddress } = data;
        const response = await _axios.post(
            `/api/Paperless/PaperlessUnenroll?emailAddress=${emailAddress}&account=${accountNumber}`,
            null,
            { ...config }
        );
        console.log(' Paperless unenrollment successful:', response);
        return response.data;
    } catch (error) {
        console.error(' Error unenrolling from paperless:', error);
        throw error;
    }
};

// Add primary email
export const addPrimaryEmail = async ({ newEmail, oldEmail }) => {
    try {
        const config = await getAuthConfig();
        const accountNumber = await getUserAccountNumber();
        console.log('📧 Adding primary email:', { newEmail, oldEmail, accountNumber });
        
        const payload = {
            account: accountNumber,
            newEmail,
            oldEmail: oldEmail || ""
        };
        
        const response = await _axios.post(
            '/api/UpdateEmail/AddPrimaryEmail', 
            payload, 
            {...config}
        );
        console.log(' Primary email added successfully:', response.data);
        return response.data;
    } catch (error) {
        console.error(' Error adding primary email:', error);
        throw error;
    }
};

// Update primary email
export const updatePrimaryEmail = async ({ newEmail, oldEmail }) => {
    try {
        const config = await getAuthConfig();
        const accountNumber = await getUserAccountNumber();
        console.log('📧 Updating primary email:', { newEmail, oldEmail, accountNumber });
        
        const payload = {
            account: accountNumber,
            newEmail,
            oldEmail
        };
        
        const response = await _axios.post(
            '/api/UpdateEmail/UpdatePrimaryEmail', 
            payload, 
            {...config}
        );
        console.log(' Primary email updated successfully:', response.data);
        return response.data;
    } catch (error) {
        console.error(' Error updating primary email:', error);
        throw error;
    }
};