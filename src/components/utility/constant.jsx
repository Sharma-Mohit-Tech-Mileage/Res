import { Color } from '../../../GlobalStyles'
export const ROLE_COLORS = {
    primaryadmin: Color.colorMidnightblue,
    admin: Color.sparklightBrightPurple,
    viewonly: Color.sparklightGreen,
};
export const BOX_COLORS = {
    primaryadmin: Color.success50,
    admin: Color.colorWhitesmoke_200,
    viewonly: Color.colorWhitesmoke_200,
};

export const convertToSpecialCase = (str) => {
    // Check if the string is null, empty, or less than 2 characters
    if (!str || typeof str !== 'string' || str.length < 2) {
        return null; // or throw an error, depending on your requirements
    }

    return str.split(' ').map(word =>
        word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
    ).join(' ');
}


export const BORDER_COLORS = {
    primaryadmin: Color.colorAquamarine,
    admin: Color.colorWhitesmoke_200,
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
        /[^a-zA-Z0-9]/.test(newPassword), // You may include special characters %,&,_,?,#,=,-.
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
    "It must include at least one special character such as %, &, _, ?, #, =, -",
    "Your new password cannot have any spaces."
]

export const transformResponse = (responseArray) => {
    const defaultPhoneNumber = "";
    const defaultSubscriptionDetails = [
        { type: 'Appointments', status: 'Off' },
        { type: 'Outage', status: 'Off' },
        { type: 'Billing', status: 'Off' },
    ];

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
            status: !msgType.optOutFlag ? 'On' : 'Off'
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

export const isPrimaryAdmin = (input) => {
    // Check for null, undefined, or non-string input
    if (!input || typeof input !== 'string' || input.trim() === '') {
        return false;
    }

    // Convert input to lower case for case-insensitive comparison
    const inputLower = input.toLowerCase();

    // Check if the user is a primary admin
    return inputLower === 'headofhousehold';
};


export const initializeSettings = (additionalData) => {
    // Default settings if additionalData or its properties are undefined
    if (!additionalData || !additionalData.phoneNum || !additionalData.subscriptionDetails) {
        return {
            accountNumber: "",
            phoneNumber: "",
            optOut: true,
            outageOptOut: true,
            billingOptOutStatus: true,
        };
    }

    const defaultSettings = {
        accountNumber: "",
        phoneNumber: additionalData.phoneNum,
        optOut: true,
        outageOptOut: true,
        billingOptOutStatus: true,
    };

    additionalData.subscriptionDetails.forEach((detail) => {
        const status = detail.status?.toLowerCase() === 'on';
        const type = detail.type?.toLowerCase();
        if (type === "appointment") {
            defaultSettings.optOut = !status;
        }
        if (type === "outage") {
            defaultSettings.outageOptOut = !status;
        }
        if (type === "billing") {
            defaultSettings.billingOptOutStatus = !status;
        }
    });
    return defaultSettings;
};

export const getRoleBasedMessage = (input) => {
    // Check for null or empty input
    if (!input || input.trim() === '') {
        return '';
    }

    // Convert input to lower case for case-insensitive comparison
    const inputLower = input.toLowerCase();

    // Define the mapping
    const mapping = {
        'admin': 'As an admin, you can manage this account, but you are not the primary contact for this account.',
        'limited': 'VIEW ONLY',
        'restricted': 'VIEW ONLY',
        'headofhousehold': 'As the primary admin, you are the main contact and have full control over this account.'
    };

    // Return the corresponding value from the mapping or an empty string if not found
    return mapping[inputLower] || '';
};

export const transformNotificationPreferences = (response) => {
   // console.log('Default structure for when data is missing or in an unexpected format', JSON.stringify(response));
    const defaultStructure = [
        { type: 'Appointments', status: 'Off' },
        { type: 'Outage', status: 'Off' },
        { type: 'Billing', status: 'Off' }
    ];

    if (!response || !Array.isArray(response) || response.length === 0) {
        return defaultStructure;
    }

    const pushMessageTypeArray = response[0].pushMessageType;
    if (!pushMessageTypeArray || !Array.isArray(pushMessageTypeArray)) {
        return defaultStructure;
    }

    return pushMessageTypeArray.map(item => {
        const typeMapping = {
            'appointment': 'Appointments',
            'outage': 'Outage',
            'billing': 'Billing'
        };

        const messageTypeLower = item.messageType.toLowerCase();
        const type = typeMapping[messageTypeLower] || 'Unknown';
        const status = item.optOutFlag ? 'Off' : 'On';

        return { type, status };
    });
};



export const transformToUserPreferences = (data) => {
    console.log('Data is undefined or not an array, returning default transformToUserPreferences=======================', data);
    if (!Array.isArray(data)) {
       
        return {
            accountNumber: '',
            deviceToken: '',
            deviceTokenTimestamp: '',
            optOut: true, // Default value
            outageOptOut: true, // Default value
            billingOptOutStatus: true, // Default value
            userName: '',
            isAndroid: ''
        };
    }

    const transformedData = {
        accountNumber: '',
        deviceToken: '',
        deviceTokenTimestamp: '',
        optOut: true, // Default value
        outageOptOut: true, // Default value
        billingOptOutStatus: true, // Default value
        userName: '',
        isAndroid: ''
    };

    data.forEach(item => {
        const itemType = item.type.toLowerCase();
        const itemStatus = item.status.toLowerCase();

        switch (itemType) {
            case 'appointments':
                transformedData.optOut = itemStatus === 'off';
                break;
            case 'outage':
                transformedData.outageOptOut = itemStatus === 'off';
                break;
            case 'billing':
                transformedData.billingOptOutStatus = itemStatus === 'off';
                break;
            default:
                // Handle unexpected type or ignore
                break;
        }
    });
    console.log('final Update values based on the data array-------------------------', transformedData)
    return transformedData;
};




