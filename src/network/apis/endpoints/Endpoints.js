import { UPDATE_TEXT_NOTIFICATION } from "src/redux/constants";

export const ENDPOINTS = {
    // Auth / Session
    LOGIN_SSO_GETTOKEN: 'api/mobile/gettoken',
    

    // Accounts / Payments
    ACCOUNTS_EASYPAY: 'api/Accounts/:accountNumber/easypay',

    // Outage / Services
    GET_OUTAGE: 'api/outage/GetOutages?accountNumber=:accountNumber',
    SERVICES_DETAILS: 'api/Services/GetServiceDetails?accountNumber=:accountNumber&includeEquipment=false&includeLocation=false',

    // Zendesk (JWT for chat)
    ZENDESK_TOKEN: 'api/Zendesk/TokenAuth',

    // Profile / Account
    GET_CUSTOMER_BY_USERNAME: 'api/Accounts/GetCustomerByUserName?userName=:userName',
    PROFILE_DETAILS_BY_ACCOUNTID: 'api/Accounts/GetCustomerByAccountId?accountId=:accountNumber',
    PROFILE_DETAILS: 'api/profile/:accountNumber',
    PROFILE_USERS: 'api/account/:accountNumber/users',
    SMS_SUBSCRIPTION: 'api/SMS/sms?AccountNumber=:accountNumber',
    BILLING_STATUS: 'account/api/account/:accountNumber/paperless/status',
    PAPERLESS_DETAILS: 'account/api/account/:accountNumber/paperless',
    PAPERLESS_EMAIL_NOTIFICATION: 'api/account/:accountNumber/paperless/:email',
    PAPERLESS_RESEND_VERIFICATION: 'api/account/:accountNumber/paperless/resend',

    // SMS / Text notifications
    SMS_BASE: 'api/SMS',

    // Mobile notification preferences
    MOBILE_NOTIFICATION_PREFS_ACCOUNT: 'api/mobilenotificationpreferences/:userName/mobilepreferences/:accountNumber',
    MOBILE_NOTIFICATION_PREFS: 'api/mobilenotificationpreferences/:userName/mobilepreferences',

    // Terms & Conditions
    MOBILE_TC_FLAG: 'api/mobileuser/:accountNumber/updatemobiletcacceptanceflag/:userName/:flag',
    MOBILE_TC_UPDATE_USERDATA: 'api/Mobile/UpdateMobileAspnetUserData',

    // Payment methods / AutoPay wrappers (PortalServices non-widget routes; confirm final paths w/ portal team)
    EASYPAY_SETUP: 'api/Payment/SetupAutoPay',
    EASYPAY_DELETE: 'api/Payment/DeleteEasyPayAccount/:accountNumber',
    FUNDING_ACCOUNTS: 'api/Payment/RetrieveFundingAccounts/:accountNumber',
    FUNDING_ACCOUNT_DELETE: 'api/Payment/DeleteFundingAccount',
    PAYMENT_ONE_TIME: 'api/Payment/Submit',
    PAYMENT_MAKE_ONETIME: 'api/Payment/MakeAOneTimePayment',

    // Widget token flows land on the Payment controller directly (no separate Orbipay confirm routes)
    FUNDING_ACCOUNT_ADD: 'api/Payment/AddFundingAccount',
    FUNDING_ACCOUNT_UPDATE: 'api/Payment/UpdFundingAccount',

    // Logging
    LOG_ERROR: 'api/log/error',
    LOG_INFO: 'api/log/info',

    // Users
    USERS_BASE: 'api/users',
    USERS_BY_USERNAME: 'api/users/:userName',
    USERS_REMOVE: 'api/users/remove/:accountNumber/:userName',
    CHANGE_PASSWORD: 'api/profile/password/:accountNumber',
    PROFILE_INFO_UPDATE: 'api/profile',
    UPDATE_USERNAME:'/api/mobile/UpdateUserSpecChar',

    // Email / Paperless (notification service)
    PAPERLESS_GET_ALL_EMAILS: 'api/Paperless/GetAllEmails?account=:accountNumber',
    PAPERLESS_IS_ENABLED: 'api/Paperless/IsPaperless?account=:accountNumber&email=:email',
    PAPERLESS_ENROLL: 'api/Paperless/PaperlessEnrollment?emailAddress=:emailAddress&account=:accountNumber',
    PAPERLESS_UNENROLL: 'api/Paperless/PaperlessUnenroll?emailAddress=:emailAddress&account=:accountNumber',
    UPDATE_EMAIL_ADD_PRIMARY: 'api/UpdateEmail/AddPrimaryEmail',
    UPDATE_EMAIL_UPDATE_PRIMARY: 'api/UpdateEmail/UpdatePrimaryEmail',
    SMS_NOTIFICATION_PREFS: 'api/SMS/sms?AccountNumber=:accountNumber',
    UPDATE_TEXT_NOTIFICATION: 'api/SMS',

    // Email (SV emails)
    SV_EMAILS_GET_ALL: 'api/email/:accountNumber/GetAllSVEmails',
    SV_EMAIL_ADD_NO_FLAGS: 'mobile/api/email/:accountNumber/:email/AddSVEmailNoFlags',
    SV_EMAIL_DELETE: 'mobile/api/email/:accountNumber/:email/DeleteSVEmail',
    SV_EMAIL_UPDATE: 'mobile/api/email/:accountNumber/UpdateSVEmails',
    SV_EMAIL_ADD_MKT_FLAG: 'api/email/:accountNumber/:email/AddSVEmailMktFlag',

    // Account details
    //ACCOUNTS_DETAILS: 'api/Accounts/GetAccountDetails',
    ACCOUNTS_DETAILS: 'api/Accounts/GetAccountDetailsCache',
     ACCT_MGR_GET_BY_USER: 'api/Profile/AcctMgrGetByAcct/:accountNumber',

    // Payments
    PAYMENTS_HISTORY: 'api/payments/:accountNumber/paymentHistory',
    PAYMENTS_RECEIPT: 'api/payments/:accountNumber/receipt/:paymentId',

    // Statements / Billing breakdown
    STATEMENT_LIST: 'api/Statement/:accountNumber/get',
    STATEMENT_GET_BY_ID: 'api/Statement/:accountNumber/getbyId/:statementId',
    BILL_BREAKDOWN_GET: 'api/BillBreakdown/GetBills?accountId=:accountNumber&startDate=:startDate&endDate=:endDate',
    GET_BILL_EXPLAINER: 'api/GetBillExplainer/Get',

    // Dashboard (internet/account APIs)
    INTERNET_PLAN: 'internet/api/internet/:accountId/plan',
    ACCOUNT_INFO: 'account/api/account/:accountId',
    INTERNET_SPEED_GET: 'internet/api/internet/:accountNumber/speedTest/Get',
    INTERNET_SPEED_POST: 'internet/api/internet/:accountNumber/speedTest/Post',
    INTERNET_USAGE: 'api/Internet/Usage',
    EQUIPMENT_BY_ACCOUNT: 'api/Services/GetInternetData?account=:account',

    // Security / Password
    SECURITY_QUESTIONS: 'api/Security/GetSecurityQuestions',
    GET_SECURTY_ANSWERS: 'api/Security/GetSecurityQuestion?userName=:userName&accountNumber=:accountNumber',
    SECURITY_QUESTION_UPDATE: 'api/Security/UpdateSecurityAnswer/:userName/:accountNumber',
    RESET_PASSWORD: 'api/Security/ResetPassword?accountNumber=:accountNumber&userName=:userName',
    PROFILE_PASSWORD_UPDATE: 'api/profile/password/:accountNumber',

    // Survey / Cancellation
    SURVEY: 'api/Survey',
    SERVICE_DISCONNECT_SURVEY: 'api/Order/Disconnect',
    ORDER_COMMIT_DISCONNECT: 'api/Order/CommitDisconnect',

    //Payment methods
    PAYMENTS_HISTORY: 'api/payments/:accountNumber/paymentHistory',
    PAYMENT_RECEIPT: 'api/payments/:accountNumber/receipt/:paymentId',
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