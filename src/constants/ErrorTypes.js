/**
 * Error types for consistent error handling across the app
 */
export const ErrorType = {
  NETWORK_ERROR: 'NETWORK_ERROR',
  AUTH_TIMEOUT: 'AUTH_TIMEOUT',
  BROWSER_UNAVAILABLE: 'BROWSER_UNAVAILABLE',
  USER_CANCELLED: 'USER_CANCELLED',
  API_ERROR: 'API_ERROR',
  SESSION_EXPIRED: 'SESSION_EXPIRED',
  INVALID_CREDENTIALS: 'INVALID_CREDENTIALS',
  SERVER_ERROR: 'SERVER_ERROR',
  UNKNOWN_ERROR: 'UNKNOWN_ERROR',
};

/**
 * Error messages for each error type
 */
export const ERROR_MESSAGES = {
  [ErrorType.NETWORK_ERROR]: {
    title: 'Connection Issue',
    message: 'Please check your internet connection and try again.',
    icon: 'wifi-off',
  },
  [ErrorType.AUTH_TIMEOUT]: {
    title: 'Login Timeout',
    message: 'The login process took too long. Please try again.',
    icon: 'clock',
  },
  [ErrorType.BROWSER_UNAVAILABLE]: {
    title: 'Browser Not Available',
    message: 'Unable to open your browser for secure login. Please check your device settings.',
    icon: 'browser',
  },
  [ErrorType.USER_CANCELLED]: {
    title: 'Login Cancelled',
    message: 'You cancelled the login process.',
    icon: 'cancel',
  },
  [ErrorType.API_ERROR]: {
    title: 'Service Error',
    message: 'We encountered an issue connecting to our services. Please try again.',
    icon: 'server',
  },
  [ErrorType.SESSION_EXPIRED]: {
    title: 'Session Expired',
    message: 'Your session has expired. Please log in again.',
    icon: 'clock',
  },
  [ErrorType.INVALID_CREDENTIALS]: {
    title: 'Invalid Credentials',
    message: 'The provided credentials are invalid. Please try again.',
    icon: 'lock',
  },
  [ErrorType.SERVER_ERROR]: {
    title: 'Server Error',
    message: 'Our servers are experiencing issues. Please try again later.',
    icon: 'server',
  },
  [ErrorType.UNKNOWN_ERROR]: {
    title: 'Something Went Wrong',
    message: 'An unexpected error occurred. Please try again or contact support if the issue persists.',
    icon: 'alert',
  },
};

/**
 * Error codes mapping
 */
export const ERROR_CODES = {
  30801: ErrorType.AUTH_TIMEOUT,
  30802: ErrorType.SESSION_EXPIRED,
  30803: ErrorType.API_ERROR,
  204: ErrorType.API_ERROR,
  401: ErrorType.INVALID_CREDENTIALS,
  500: ErrorType.SERVER_ERROR,
  503: ErrorType.SERVER_ERROR,
};

/**
 * Get error type from code
 */
export const getErrorTypeFromCode = (code) => {
  return ERROR_CODES[code] || ErrorType.UNKNOWN_ERROR;
};

/**
 * Get error message from type
 */
export const getErrorMessage = (errorType) => {
  return ERROR_MESSAGES[errorType] || ERROR_MESSAGES[ErrorType.UNKNOWN_ERROR];
};
