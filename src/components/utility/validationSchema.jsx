import * as yup from 'yup';

export const validationSchema = yup.object({
    firstName: yup.string().required('First Name is required'),
    lastName: yup.string().required('Last Name is required'),
    phone: yup.string()
        .nullable()
        .matches(/^(?:\([2-9]\d{2}\)\ ?|[2-9]\d{2}[- ]?)[2-9]\d{2}[- ]?\d{4}$/, 'Invalid US mobile phone number'),
});

export default validationSchema;
