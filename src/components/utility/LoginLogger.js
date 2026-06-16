import { getSystemName } from "../../utils/deviceInfo";

class LoginLogger {
  static createBaseLog() {
    return {
      host: getSystemName(),
      application: "Sparklight Residential Mobile App",
      className: "AuthenticationService",
    };
  }

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

  static logSuccessfulLogin(dispatch, logInfo, userInfo) {
    if (!dispatch || !logInfo) return;

    const userType = this.determineUserType(userInfo);
    const username = userInfo?.username || userInfo?.email || "N/A";
    const accountNumber = userInfo?.accountNumber || "N/A";

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

  static logFailedLogin(dispatch, logError, error, attemptInfo = {}) {
    if (!dispatch || !logError) return;

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

    dispatch(logError(logObject));
  }

  static logLoginRejection(dispatch, logInfo, userInfo, reason) {
    if (!dispatch || !logInfo) return;

    const userType = this.determineUserType(userInfo);
    const username = userInfo?.username || userInfo?.email || "N/A";
    const accountNumber = userInfo?.accountNumber || "N/A";

    const message = `Login rejected - ${reason} | User: ${username} | Account: ${accountNumber} | Type: ${userType}`;

    const logObject = {
      ...this.createBaseLog(),
      methodName: "handleLogin",
      messageDate: new Date().toISOString().split("T")[0],
      errorCode: 0,
      message: message,
    };

    dispatch(logInfo(logObject));
  }

  static logLogout(dispatch, logInfo, userInfo = null) {
    if (!dispatch || !logInfo) return;

    const userType = userInfo ? this.determineUserType(userInfo) : "Unknown";
    const username = userInfo?.username || userInfo?.email || "N/A";
    const accountNumber = userInfo?.accountNumber || "N/A";

    const message = `User logout | User: ${username} | Account: ${accountNumber} | Type: ${userType}`;

    const logObject = {
      ...this.createBaseLog(),
      methodName: "logoutAction",
      messageDate: new Date().toISOString().split("T")[0],
      errorCode: 0,
      message: message,
    };

    dispatch(logInfo(logObject));
  }
}

export default LoginLogger;
