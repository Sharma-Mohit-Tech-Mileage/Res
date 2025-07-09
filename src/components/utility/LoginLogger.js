// LoginLogger.js
import DeviceInfo from "react-native-device-info";
import moment from "moment";

/**
 * Utility class to handle login-related logging in a consistent format
 * working with existing log properties only
 */
class LoginLogger {
  /**
   * Creates a base log object with common properties
   * @returns {Object} Base log object
   */
  static createBaseLog() {
    const baseLog = {
      host: DeviceInfo.getSystemName(),
      application: "Sparklight Residential Mobile App",
      className: "AuthenticationService",
    };
    
    
    return baseLog;
  }

  /**
   * Determines user type based on account information
   * @param {Object} userInfo User information object
   * @returns {string} User type description
   */
  static determineUserType(userInfo) {
    if (!userInfo) return "Unknown";
    
    const isACP = userInfo.accountNumber && userInfo.accountNumber.toString().length > 9;
    const accountType = userInfo.customerType || "Unknown";
    const authLevel = userInfo.authLevel || "Unknown";
    
    if (isACP) {
      return `ACP User (${accountType}, ${authLevel})`;
    } else {
      return `SV User (${accountType}, ${authLevel})`;
    }
  }

  /**
   * Logs a successful login attempt
   * @param {Object} dispatch Redux dispatch function
   * @param {Function} logInfo Redux action creator for info logs
   * @param {Object} userInfo User information
   */
  static logSuccessfulLogin(dispatch, logInfo, userInfo) {
    if (!dispatch || !logInfo) return;
    
    const userType = this.determineUserType(userInfo);
    const username = userInfo?.username || userInfo?.email || "N/A";
    const accountNumber = userInfo?.accountNumber || "N/A";
    
    // Format additional info as part of the message string
    const message = `Successful SSO Login | User: ${username} | Account: ${accountNumber} | Type: ${userType}`;
    
    const logObject = {
      ...this.createBaseLog(),
      methodName: "callSSOLoginApi",
      messageDate: new Date().toISOString().split("T")[0],
      errorCode: 0,
      message: message,
    };
    
    dispatch(logInfo(logObject));
  }

  /**
   * Logs a failed login attempt
   * @param {Object} dispatch Redux dispatch function
   * @param {Function} logError Redux action creator for error logs
   * @param {Object} error Error object
   * @param {Object} attemptInfo Login attempt info
   */
  static logFailedLogin(dispatch, logError, error, attemptInfo = {}) {
    if (!dispatch || !logError) return;
    
    // Format attempt info as part of the message
    const attemptDetails = Object.entries(attemptInfo)
      .map(([key, value]) => `${key}: ${value}`)
      .join(" | ");
    
    const errorMessage = error?.message || "Unknown error during login";
    const message = `${errorMessage} | ${attemptDetails}`;
    
    const logObject = {
      ...this.createBaseLog(),
      methodName: "callSSOLoginApi",
      errorDate: new Date().toISOString().split("T")[0],
      message: message,
      errorCode: 30800,
    };
    
    console.log("[LoginLogger] Failed Login:", message);
    dispatch(logError(logObject));
  }
  
  /**
   * Logs a login rejection (when user is of incorrect type)
   * @param {Object} dispatch Redux dispatch function
   * @param {Function} logInfo Redux action creator for info logs
   * @param {Object} userInfo User information
   * @param {string} reason Reason for rejection
   */
  static logLoginRejection(dispatch, logInfo, userInfo, reason) {
    if (!dispatch || !logInfo) return;
    
    const userType = this.determineUserType(userInfo);
    const username = userInfo?.username || userInfo?.email || "N/A";
    const accountNumber = userInfo?.accountNumber || "N/A";
    
    // Format the message string with all information
    const message = `Login rejected - ${reason} | User: ${username} | Account: ${accountNumber} | Type: ${userType}`;
    
    const logObject = {
      ...this.createBaseLog(),
      methodName: "handleLogin",
      messageDate: new Date().toISOString().split("T")[0],
      errorCode: 0,
      message: message,
    };
    
    console.log("[LoginLogger] Login Rejection:", message);
    dispatch(logInfo(logObject));
  }
  
  /**
   * Logs user logout
   * @param {Object} dispatch Redux dispatch function
   * @param {Function} logInfo Redux action creator for info logs
   * @param {Object} userInfo User information if available
   */
  static logLogout(dispatch, logInfo, userInfo = null) {
    if (!dispatch || !logInfo) return;
    
    const userType = userInfo ? this.determineUserType(userInfo) : "Unknown";
    const username = userInfo?.username || userInfo?.email || "N/A";
    const accountNumber = userInfo?.accountNumber || "N/A";
    
    // Format the message with all user info
    const message = `User logout | User: ${username} | Account: ${accountNumber} | Type: ${userType}`;
    
    const logObject = {
      ...this.createBaseLog(),
      methodName: "logoutAction",
      messageDate: new Date().toISOString().split("T")[0],
      errorCode: 0,
      message: message,
    };
    
    console.log("[LoginLogger] User Logout:", message);
    dispatch(logInfo(logObject));
  }
}

export default LoginLogger;