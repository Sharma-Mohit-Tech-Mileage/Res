import { Color } from '../../../GlobalStyles'
export const ROLE_COLORS = {
    primaryadmin: Color.colorMidnightblue,
    admin: Color.sparklightBrightPurple,
    user: Color.sparklightGreen,
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
    const defaultPhoneNumber = "N/A";
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

    // Transform the smsMessageType array into the required format
    const subscriptionDetails = smsMessageType.map(msgType => ({
        type: msgType.messageType,
        status: msgType.optOutFlag ? 'Off' : 'On'
    }));

    // Return an object with the phone number and transformed subscription details
    return {
        phoneNum,
        subscriptionDetails
    };
};
