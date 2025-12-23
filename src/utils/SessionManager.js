import { getUser, storeUser } from '../redux/utils/LocalStorage';
import AuthenticationManager from './AuthenticationManager';
import { Env } from '../network/apis/account/Constants';

const AUTH_CONFIG = {
  issuer: Env.SSO_LOGIN,
  clientId: 'sparklight-customer-mobile-app',
  redirectUrl:
    'com.sparklight.customer.app.auth0://sparklight-customer.us.auth0.com/ios/com.sparklight.customer.app/callback',
  scopes: ['openid', 'profile', 'email', 'phone', 'address'],
  iosPrefersEphemeralSession: true,
};

class SessionManager {
  static instance = null;
  static TOKEN_EXPIRY_BUFFER = 5 * 60 * 1000; // 5 minutes in ms

  static getInstance() {
    if (!SessionManager.instance) {
      SessionManager.instance = new SessionManager();
    }
    return SessionManager.instance;
  }

  /**
   * Check if user has a valid session
   */
  async hasValidSession() {
    try {
      const user = await getUser();
      
      if (!user || !user.refreshToken) {
        return false;
      }

      // Check if token exists and is not expired
      if (user.token && user.tokenGuid) {
        // TODO: Add JWT expiry check if needed
        return true;
      }

      // Has refresh token but no access token
      return user.refreshToken ? true : false;
    } catch (error) {
      console.error('Error checking session validity:', error);
      return false;
    }
  }

  /**
   * Refresh the current session
   */
  async refreshSession() {
    try {
      const user = await getUser();

      if (!user || !user.refreshToken) {
        return {
          success: false,
          error: 'No refresh token available',
        };
      }

      const result = await AuthenticationManager.refreshWithTimeout(
        AUTH_CONFIG,
        user.refreshToken
      );

      if (!result.success) {
        return {
          success: false,
          error: result.error,
        };
      }

      const sessionData = {
        idToken: result.data.idToken,
        accessToken: result.data.accessToken,
        idTokenGuid: result.data.additionalParameters?.session_state || '',
        refreshToken: result.data.refreshToken,
      };

      return {
        success: true,
        data: sessionData,
      };
    } catch (error) {
      console.error('Session refresh failed:', error);
      return {
        success: false,
        error: error.message,
      };
    }
  }

  /**
   * Clear current session
   */
  async clearSession() {
    try {
      // Clear user data from storage
      // Implementation depends on your cleanUserData function
      console.log('Session cleared');
      return { success: true };
    } catch (error) {
      console.error('Error clearing session:', error);
      return { success: false, error: error.message };
    }
  }

  /**
   * Get current session data
   */
  async getSessionData() {
    try {
      const user = await getUser();
      return user;
    } catch (error) {
      console.error('Error getting session data:', error);
      return null;
    }
  }

  /**
   * Check if token is about to expire
   */
  isTokenExpiringSoon(tokenExpiry) {
    if (!tokenExpiry) return true;
    
    const now = Date.now();
    const expiryTime = new Date(tokenExpiry).getTime();
    
    return (expiryTime - now) < SessionManager.TOKEN_EXPIRY_BUFFER;
  }

  /**
   * Update session data
   */
  async updateSession(sessionData) {
    try {
      const user = await getUser();
      const updatedUser = {
        ...user,
        token: sessionData.token || user.token,
        tokenGuid: sessionData.tokenGuid || user.tokenGuid,
        refreshToken: sessionData.refreshToken || user.refreshToken,
        userInfo: sessionData.userInfo || user.userInfo,
      };

      await storeUser(updatedUser);
      return { success: true, data: updatedUser };
    } catch (error) {
      console.error('Error updating session:', error);
      return { success: false, error: error.message };
    }
  }
}

export default SessionManager;
