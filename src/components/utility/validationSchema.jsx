import * as yup from "yup";

export const profileSchema = (isPrimaryAdmin, multipleEmails) =>
  yup.object({
    firstName: yup.string().required("First Name is required"),
    lastName: yup.string().required("Last Name is required"),
  });

export const updatePasswordSchema = () =>
  yup.object({
    newPassword: yup.string().required("New Password is required"),
    confirmPassword: yup.string().required("confirm New Password is required"),
    confirmPassword: yup
      .string()
      .oneOf([yup.ref("newPassword"), null], "Passwords must match"),
    newPassword: yup
      .string()
      .nullable() // Allows null values
      .test(
        "newPassword-conditional-validation",
        "Password must meet the requirements",
        (value) => {
          // Define the password rules
          const passwordRules = yup
            .string()
            .min(8, "Password must be at least 8 characters long")
            .max(20, "Password must not be more than 20 characters long")
            .matches(
              /[A-Z]/,
              "Password must have at least one uppercase letter"
            )
            .matches(
              /[a-z]/,
              "Password must have at least one lowercase letter"
            )
            .matches(/[0-9]/, "Password must have at least one number")
            .matches(
              /[^a-zA-Z0-9]/,
              "Password must include special characters like %, &, _, ?, #, =, -"
            )
            .notOneOf(
              [yup.ref("userName"), null],
              "Password must be different from your username"
            )
            .matches(/^\S*$/, "No spaces are allowed in the password");

          // Try validating the password against the rules
          try {
            passwordRules.validateSync(value);
            return true; // Password is valid
          } catch (error) {
            // Return validation error
            return new yup.ValidationError(error.message, null, "newPassword");
          }
        }
      ),
  });
export const userSchema = (isCustomQuestionSelected) =>
  yup.object({
    firstName: yup.string().required("First Name is required"),
    lastName: yup.string().required("Last Name is required"),
    //userName: yup.string().required('User Name is required').matches(/^[a-zA-Z ]{2,30}$/,'User Name can not contain any special characters'),
    userName: yup
      .string()
      .required("Username is required")
      .matches(/$/, "Username can not contain any special characters"),
    securityAnswer: yup.string().required("Password Reset Answer is required"),
    newPassword: yup
      .string()
      .required("Password is required") // Password must be enteredz
      .test(
        "newPassword-conditional-validation",
        "Password must meet the requirements",
        (value) => {
          // If the value is null or empty, skip further validation
          //if (!value) return true;

          // Define the password rules
          const passwordRules = yup
            .string()
            .min(8, "Password must be at least 8 characters long")
            .max(20, "Password must not be more than 20 characters long")
            .matches(
              /[A-Z]/,
              "Password must have at least one uppercase letter"
            )
            .matches(
              /[a-z]/,
              "Password must have at least one lowercase letter"
            )
            .matches(/[0-9]/, "Password must have at least one number")
            .matches(
              /[^a-zA-Z0-9]/,
              "Password must include special characters like %, &, _, ?, #, =, -"
            )
            .notOneOf(
              [yup.ref("userName"), null],
              "Password must be different from your username"
            )
            .matches(/^\S*$/, "No spaces are allowed in the password");

          // Try validating the password against the rules
          try {
            passwordRules.validateSync(value);
            return true; // Password is valid
          } catch (error) {
            // Return validation error
            return new yup.ValidationError(error.message, null, "newPassword");
          }
        }
      ),
    securityQuestion: isCustomQuestionSelected
      ? yup.string().required("Custom security question is required")
      : yup.string().nullable(),
    // ... other fields
  });

export const userSchemaNoPass = (isCustomQuestionSelected) =>
  yup.object({
    firstName: yup.string().required("First Name is required"),
    lastName: yup.string().required("Last Name is required"),
    userName: yup.string().required("Username is required"),
    securityAnswer: yup.string().required("Password Reset Answer is required"),

    securityQuestion: isCustomQuestionSelected
      ? yup.string().required("Custom security question is required")
      : yup.string().nullable(),
    // ... other fields
  });

export const phoneSchema = yup.object({
  phone: yup
    .string()
    .nullable()
    .matches(
      /^(?:(\+1|1)?\s*(?:\([2-9]\d{2}\)\ ?|[2-9]\d{2}[- ]?)[2-9]\d{2}[- ]?\d{4}(?:\s*(?:ext|x)\s*\d{2,6})?)?$/,
      "Invalid US mobile phone number with optional extension"
    ),
});

export const feedbackSchema = yup.object().shape({
  category: yup.string().required("Please select a rating"),
  feedbackValue: yup.number().required("Please select a rating").min(1).max(5),
  cosentContactUs: yup
    .boolean()
    .nullable()
    .required("Please choose Yes or No to contact you ."),
  areaOfConcern: yup
    .array()
    .of(yup.string())
    .when("feedbackValue", {
      is: (val) => val < 3,
      then: (schema) =>
        schema
          .min(1, "Please select at least one area of concern")
          .required("Please select at least one area of concern"),
      otherwise: (schema) => schema.optional(),
    }),
  feedbackText: yup
    .string()
    .transform((value) => (typeof value === "string" ? value.trim() : value))
    .min(1, "Additional feedback is required")
    .max(500, "Feedback must be 500 characters or less")
    .required("Additional feedback is required"),
  feedbackEmail: yup
    .string()
    .matches(
      /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
      "Please enter a valid email address"
    )
    .required("Email is required"),
});

export const passwordSchema = (isCustomQuestionSelected) =>
  yup.object({
    securityAnswer: yup.string().required("Password Reset Answer is required"),
    newPassword: yup
      .string()
      .required("Password is required") // Allows null values
      .test(
        "newPassword-conditional-validation",
        "Password must meet the requirements",
        (value) => {
          // If the value is null or empty, skip further validation
          if (!value) return true;

          // Define the password rules
          const passwordRules = yup
            .string()
            .min(8, "Password must be at least 8 characters long")
            .max(20, "Password must not be more than 20 characters long")
            .matches(
              /[A-Z]/,
              "Password must have at least one uppercase letter"
            )
            .matches(
              /[a-z]/,
              "Password must have at least one lowercase letter"
            )
            .matches(/[0-9]/, "Password must have at least one number")
            .matches(
              /[^a-zA-Z0-9]/,
              "Password must include special characters like %, &, _, ?, #, =, -"
            )
            .notOneOf(
              [yup.ref("userName"), null],
              "Password must be different from your username"
            )
            .matches(/^\S*$/, "No spaces are allowed in the password");

          // Try validating the password against the rules
          try {
            passwordRules.validateSync(value);
            return true; // Password is valid
          } catch (error) {
            // Return validation error
            return new yup.ValidationError(error.message, null, "newPassword");
          }
        }
      ),
    securityQuestion: isCustomQuestionSelected
      ? yup.string().required("Custom security question is required")
      : yup.string().nullable(),
    // ... other fields
  });

export const userTicketSchema = () =>
  yup.object({
    subject: yup.string().required("Subject is required"),
    category: yup.string().required("Category is required"),
    comment: yup.string().required("Issue Description is required"),
    email: yup
      .string()
      .email("Please enter a valid email address")
      .required("Email is required"),
    PhoneNumber: yup.string().notRequired(),
  });

export const securitySchema = (isCustomQuestionSelected) =>
  yup.object({
    securityAnswer: yup.string().required("Password Reset Answer is required"),
    securityQuestion: isCustomQuestionSelected
      ? yup.string().required("Custom Security Question is required")
      : yup.string().nullable(),
    // ... other fields
  });
