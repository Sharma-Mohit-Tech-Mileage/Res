import * as yup from 'yup';

export const profileSchema = (isPrimaryAdmin, multipleEmails) => yup.object({
    firstName: yup.string().required('First Name is required'),
    lastName: yup.string().required('Last Name is required'),
    svEmailAddress: (isPrimaryAdmin && !multipleEmails)
        ? yup.string().email('Invalid email address').required('Email is required')
        : yup.string().nullable(),
    phoneNumber: isPrimaryAdmin
        ? yup.string()
            .matches(/^(?:(\+1|1)?\s*(?:\([2-9]\d{2}\)\ ?|[2-9]\d{2}[- ]?)[2-9]\d{2}[- ]?\d{4}(?:\s*(?:ext|x)\s*\d{2,6})?)?$/, 'Invalid mobile phone number.')
            .required('Phone number is required')
        : yup.string().nullable(),
});


export const phoneSchema = yup.object({
    phone: yup.string()
        .nullable()
        .matches(/^(?:(\+1|1)?\s*(?:\([2-9]\d{2}\)\ ?|[2-9]\d{2}[- ]?)[2-9]\d{2}[- ]?\d{4}(?:\s*(?:ext|x)\s*\d{2,6})?)?$/, 'Invalid US mobile phone number with optional extension'),
});

export const feedbackSchema = yup.object({
    feedbackText: yup.string().required('Comment is required.')
});


export const passwordSchema = (isCustomQuestionSelected) => yup.object({
    securityAnswer: yup.string()
        .required('Security answer is required'),
    newPassword: yup.string()
        .nullable()  // Allows null values
        .test(
            'newPassword-conditional-validation',
            'Password must meet the requirements',
            value => {
                // If the value is null or empty, skip further validation
                if (!value) return true;

                // Define the password rules
                const passwordRules = yup.string()
                    .min(8, 'Password must be at least 8 characters long')
                    .max(20, 'Password must not be more than 20 characters long')
                    .matches(/[A-Z]/, 'Password must have at least one uppercase letter')
                    .matches(/[a-z]/, 'Password must have at least one lowercase letter')
                    .matches(/[0-9]/, 'Password must have at least one number')
                    .matches(/[^a-zA-Z0-9]/, 'Password must include special characters like %, &, _, ?, #, =, -')
                    .notOneOf([yup.ref('userName'), null], 'Password must be different from your username')
                    .matches(/^\S*$/, 'No spaces are allowed in the password');

                // Try validating the password against the rules
                try {
                    passwordRules.validateSync(value);
                    return true; // Password is valid
                } catch (error) {
                    // Return validation error
                    return new yup.ValidationError(error.message, null, 'newPassword');
                }
            }
        ),
    securityQuestion: isCustomQuestionSelected
        ? yup.string().required('Custom security question is required')
        : yup.string().nullable(),
    // ... other fields
});



