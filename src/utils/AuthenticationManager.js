import { authorize, refresh, logout } from "react-native-app-auth";
import { Linking, Alert, Platform } from "react-native";
import { logDebug, logWarn, logError } from "./logger";

class AuthenticationManager {
  static AUTH_TIMEOUT = 120000;
  static REFRESH_TIMEOUT = 30000;
  static authorizationInFlight = null;

  static async authorizeWithTimeout(config) {
    if (this.authorizationInFlight) {
      logWarn("AuthenticationManager", "Authorization already in progress");
      return {
        success: false,
        error: "Login is already in progress.",
        code: "AUTH_IN_PROGRESS",
        userAction: "RETRY",
      };
    }

    try {
      const canOpenURL = await this.checkBrowserAvailability();
      if (!canOpenURL) {
        throw new Error("BROWSER_UNAVAILABLE");
      }

      const authConfig =
        Platform.OS === "android"
          ? {
              ...config,
              additionalParameters: {
                ...(config.additionalParameters || {}),
                prompt: "login",
              },
            }
          : config;
      logDebug("AuthenticationManager", "Starting auth flow", {
        platform: Platform.OS,
      });
      const authPromise = authorize(authConfig);
      this.authorizationInFlight = authPromise;
      authPromise
        .finally(() => {
          if (this.authorizationInFlight === authPromise) {
            this.authorizationInFlight = null;
          }
        })
        .catch(() => {});

      // AppAuth owns the native SFAuthenticationViewController. Do not reject
      // while it is still presented or React Native may present over it.
      let authTimedOut = false;
      const timeoutId = setTimeout(() => {
        authTimedOut = true;
        logWarn(
          "AuthenticationManager",
          "Authorization exceeded timeout; waiting for native completion",
        );
      }, this.AUTH_TIMEOUT);

      let result;
      try {
        result = await authPromise;
      } catch (error) {
        if (authTimedOut) {
          throw new Error("AUTH_TIMEOUT");
        }
        throw error;
      } finally {
        clearTimeout(timeoutId);
      }

      logDebug("AuthenticationManager", "Authorization completed successfully");
      return {
        success: true,
        data: result,
      };
    } catch (error) {
      logError("AuthenticationManager", error);
      return this.handleAuthError(error);
    }
  }

  static async refreshWithTimeout(config, refreshToken) {
    const timeoutPromise = new Promise((_, reject) =>
      setTimeout(
        () => reject(new Error("REFRESH_TIMEOUT")),
        this.REFRESH_TIMEOUT
      )
    );

    try {
      logDebug("AuthenticationManager", "Starting token refresh");
      const refreshPromise = refresh(config, { refreshToken });
      const result = await Promise.race([refreshPromise, timeoutPromise]);

      logDebug("AuthenticationManager", "Token refresh completed successfully");
      return {
        success: true,
        data: result,
      };
    } catch (error) {
      logError("AuthenticationManager", error);
      return {
        success: false,
        error: error.message || "Token refresh failed",
        code: "REFRESH_FAILED",
      };
    }
  }

  static async checkBrowserAvailability() {
    try {
      if (Platform.OS === "ios") {
        const canOpen = await Linking.canOpenURL("https://www.google.com");
        return canOpen;
      }

      if (Platform.OS === "android") {
        const canOpen = await Linking.canOpenURL("https://www.google.com");
        return canOpen;
      }

      return true;
    } catch (error) {
      logWarn("AuthenticationManager", "Browser availability check failed");
      logError("AuthenticationManager", error);
      return false;
    }
  }

  static handleAuthError(error) {

    const errorMessage = (
      error?.message ||
      error?.toString?.() ||
      ""
    ).toLowerCase();
    const errorCode = error?.code || "";
    const errorDomain = error?.domain || "";
    const underlyingErrorCode = error?.userInfo?.NSUnderlyingError?.code;
    const underlyingDomain = error?.userInfo?.NSUnderlyingError?.domain || "";

    const isCancelled =
      errorCode === "user_cancelled" ||
      errorCode === "-3" ||
      errorCode === "a0.session.user_cancelled" ||
      errorMessage.includes("error -3") ||
      (errorDomain === "org.openid.appauth.general" &&
        errorMessage.includes("error -3")) ||
      (underlyingErrorCode === "1" &&
        underlyingDomain.includes("AuthenticationServices")) ||
      errorMessage.includes("user cancel") ||
      errorMessage.includes("user dismissed") ||
      errorMessage.includes("authentication was canceled") ||
      errorMessage.includes("the user canceled");

    if (isCancelled) {
      return {
        success: false,
        error: "Login was cancelled.",
        code: "USER_CANCELLED",
        userAction: "RETRY",
      };
    }

    // Parse different error types
    if (
      String(errorCode).toLowerCase().includes("timeout") ||
      errorMessage.includes("timeout") ||
      errorMessage.includes("timed out")
    ) {
      return {
        success: false,
        error: "The sign-in process timed out. Check your connection and try again.",
        code: "AUTH_TIMEOUT",
        userAction: "RETRY",
      };
    }

    if (errorMessage.includes("BROWSER_UNAVAILABLE")) {
      return {
        success: false,
        error:
          "Unable to open browser for login. Please check your device settings.",
        code: "BROWSER_UNAVAILABLE",
        userAction: "CHECK_SETTINGS",
      };
    }

    if (
      errorMessage.includes("Network request failed") ||
      errorMessage.includes("network")
    ) {
      return {
        success: false,
        error: "Network error. Please check your internet connection.",
        code: "NETWORK_ERROR",
        userAction: "CHECK_NETWORK",
      };
    }

    // Default error
    return {
      success: false,
      error: "Login failed. Please try again.",
      code: "AUTH_FAILED",
      userAction: "RETRY",
      details: errorMessage,
    };
  }

  static showErrorAlert(errorResult) {
    const { error, userAction, code } = errorResult;

    let buttons = [
      {
        text: "Try Again",
        onPress: () => {},
      },
    ];

    if (userAction === "CHECK_SETTINGS") {
      buttons.unshift({
        text: "Open Settings",
        onPress: () => Linking.openSettings(),
      });
    }

    if (userAction === "CHECK_NETWORK") {
      buttons = [
        {
          text: "Check Network",
          onPress: () => {},
        },
        {
          text: "Try Again",
          onPress: () => {},
        },
      ];
    }

    Alert.alert("Login Error", error, buttons, { cancelable: false });

    return errorResult;
  }
}

export default AuthenticationManager;
