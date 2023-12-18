import { Color } from '../../../GlobalStyles'
export const ROLE_COLORS = {
    primaryadmin: Color.colorMidnightblue,
    admin: Color.sparklightBrightPurple,
    viewonly: Color.sparklightGreen,
};
export const BOX_COLORS = {
    primaryadmin: Color.success50,
    admin: Color.success50,
    viewonly: Color.colorWhitesmoke_200,
};
export const validatePassword = (newPassword, userName) => {
    if (!newPassword) {
        // Return false for all conditions if newPassword is null, empty, or undefined
        return Array(5).fill(false);
    }
    const conditions = [
        newPassword !== userName, // It must be different than your user name.
        newPassword.length >= 8 && newPassword.length <= 20, // It must contain 8 to 20 characters.
        /[A-Z]/.test(newPassword) && /[a-z]/.test(newPassword) && /[0-9]/.test(newPassword), // It must include an upper and lower case letter and a number.
        /[%&_,?#=.-]/.test(newPassword), // You may include special characters %,&,_,?,#,=,-.
        !/\s/.test(newPassword) // Your new password cannot have any spaces.
    ];
    return conditions;
};

export const securityQuestions = [
    "Favorite author",
    "Favorite historical person",
    "Name of first grade teacher",
    "Name of first pet",
    "Street you grew up on",
    "Add your own question"
];

export const passwordTerms = [
    "It must be different than your user name.",
    "It must contain 8 to 20 characters.",
    "It must include an upper and lower case letter and a number.",
    "You may include special characters %,&,_,?,#,=,-.",
    "Your new password cannot have any spaces."
]

export const transformResponse = (responseArray) => {
    // Set default values
    const defaultPhoneNumber = "";
    const defaultSubscriptionDetails = [];

    // Check if the response is an array and not empty
    if (!Array.isArray(responseArray) || responseArray.length === 0) {
        return {
            phoneNum: defaultPhoneNumber,
            subscriptionDetails: defaultSubscriptionDetails
        };
    }

    const firstResponse = responseArray[0];

    // Check if the response contains the expected properties
    if (!firstResponse.phoneNum || !Array.isArray(firstResponse.smsMessageType)) {
        return {
            phoneNum: defaultPhoneNumber,
            subscriptionDetails: defaultSubscriptionDetails
        };
    }

    // Extract the phone number and smsMessageType array
    const { phoneNum, smsMessageType } = firstResponse;

    const subscriptionDetails = smsMessageType.map(msgType => {
        return {
            type: msgType.messageType,
            status: msgType.optOutFlag ? 'On' : 'Off'
        };
    });

    // Return an object with the phone number and transformed subscription details
    return {
        phoneNum,
        subscriptionDetails
    };
};

export const getUserType = (input) => {
    // Check for null or empty input
    if (input === null || input.trim() === '') {
        return '';
    }

    // Convert input to lower case for case-insensitive comparison
    const inputLower = input.toLowerCase();

    // Define the mapping
    const mapping = {
        'admin': 'ADMIN',
        'limited': 'VIEW ONLY',
        'restricted': 'VIEW ONLY',
        'headofhousehold': 'PRIMARY ADMIN'
    };
    // Return the corresponding value or a default message
    return mapping[inputLower] || '';
};

export const initializeSettings = (additionalData) => {
    // Default settings if additionalData or its properties are undefined
    if (!additionalData || !additionalData.phoneNum || !additionalData.subscriptionDetails) {
        return {
            accountNumber: "",
            phoneNumber: "",
            optOut: false,
            outageOptOut: false,
            billingOptOutStatus: false,
        };
    }

    const defaultSettings = {
        accountNumber: "",
        phoneNumber: additionalData.phoneNum,
        optOut: false,
        outageOptOut: false,
        billingOptOutStatus: false,
    };

    additionalData.subscriptionDetails.forEach((detail) => {
        const status = detail.status?.toLowerCase() === 'on';
        const type = detail.type?.toLowerCase();

        if (type === "appointment") {
            defaultSettings.optOut = status;
        }
        if (type === "outage") {
            defaultSettings.outageOptOut = status;
        }
        if (type === "billing") {
            defaultSettings.billingOptOutStatus = status;
        }
    });

    return defaultSettings;
};

