import { authorize, refresh, logout } from "react-native-app-auth";
import { Linking, Alert, Platform } from "react-native";

class AuthenticationManager {
  static AUTH_TIMEOUT = 120000; // 2 minutes for user to complete SSO
  static REFRESH_TIMEOUT = 30000; // 30 seconds for token refresh
  
  /**
   * Authorize with timeout and error handling
   * @param {Object} config - Auth config
   * @returns {Promise<Object>} Auth result
   */
  static async authorizeWithTimeout(config) {
    const timeoutPromise = new Promise((_, reject) =>
      setTimeout(() => reject(new Error('AUTH_TIMEOUT')), this.AUTH_TIMEOUT)
    );
    
    try {
      // Check if browser is available
      const canOpenURL = await this.checkBrowserAvailability();
      if (!canOpenURL) {
        throw new Error('BROWSER_UNAVAILABLE');
      }
      
      const authPromise = authorize(config);
      const result = await Promise.race([authPromise, timeoutPromise]);
      
      return {
        success: true,
        data: result,
      };
    } catch (error) {
      return this.handleAuthError(error);
    }
  }
  
  /**
   * Refresh token with timeout
   */
  static async refreshWithTimeout(config, refreshToken) {
    const timeoutPromise = new Promise((_, reject) =>
      setTimeout(() => reject(new Error('REFRESH_TIMEOUT')), this.REFRESH_TIMEOUT)
    );
    
    try {
      const refreshPromise = refresh(config, { refreshToken });
      const result = await Promise.race([refreshPromise, timeoutPromise]);
      
      return {
        success: true,
        data: result,
      };
    } catch (error) {
      return {
        success: false,
        error: error.message || 'Token refresh failed',
        code: 'REFRESH_FAILED',
      };
    }
  }
  
  /**
   * Check if browser/webview is available
   */
  static async checkBrowserAvailability() {
    try {
      // For iOS, check if Safari is available
      if (Platform.OS === 'ios') {
        const canOpen = await Linking.canOpenURL('https://www.google.com');
        return canOpen;
      }
      
      // For Android, check if Chrome or default browser is available
      if (Platform.OS === 'android') {
        const canOpen = await Linking.canOpenURL('https://www.google.com');
        return canOpen;
      }
      
      return true;
    } catch (error) {
      console.error('Browser availability check failed:', error);
      return false;
    }
  }
  
  /**
   * Handle authentication errors with user-friendly messages
   */
  static handleAuthError(error) {
    const errorMessage = error.message || error.toString();
    
    // Parse different error types
    if (errorMessage.includes('AUTH_TIMEOUT')) {
      return {
        success: false,
        error: 'Login timed out. Please try again.',
        code: 'AUTH_TIMEOUT',
        userAction: 'RETRY',
      };
    }
    
    if (errorMessage.includes('BROWSER_UNAVAILABLE')) {
      return {
        success: false,
        error: 'Unable to open browser for login. Please check your device settings.',
        code: 'BROWSER_UNAVAILABLE',
        userAction: 'CHECK_SETTINGS',
      };
    }
    
    if (errorMessage.includes('User cancelled') || errorMessage.includes('user_cancelled')) {
      return {
        success: false,
        error: 'Login was cancelled.',
        code: 'USER_CANCELLED',
        userAction: 'RETRY',
      };
    }
    
    if (errorMessage.includes('Network request failed') || errorMessage.includes('network')) {
      return {
        success: false,
        error: 'Network error. Please check your internet connection.',
        code: 'NETWORK_ERROR',
        userAction: 'CHECK_NETWORK',
      };
    }
    
    // Default error
    return {
      success: false,
      error: 'Login failed. Please try again.',
      code: 'AUTH_FAILED',
      userAction: 'RETRY',
      details: errorMessage,
    };
  }
  
  /**
   * Show error alert to user with actionable guidance
   */
  static showErrorAlert(errorResult) {
    const { error, userAction, code } = errorResult;
    
    let buttons = [
      {
        text: 'Try Again',
        onPress: () => console.log('User chose to retry'),
      },
    ];
    
    if (userAction === 'CHECK_SETTINGS') {
      buttons.unshift({
        text: 'Open Settings',
        onPress: () => Linking.openSettings(),
      });
    }
    
    if (userAction === 'CHECK_NETWORK') {
      buttons = [
        {
          text: 'Check Network',
          onPress: () => console.log('User should check network'),
        },
        {
          text: 'Try Again',
          onPress: () => console.log('User chose to retry'),
        },
      ];
    }
    
    Alert.alert(
      'Login Error',
      error,
      buttons,
      { cancelable: false }
    );
    
    return errorResult;
  }
}

export default AuthenticationManager;
