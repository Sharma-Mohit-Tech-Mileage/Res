import { useEffect, useState } from 'react';
import SessionManager from '../../utils/SessionManager';
import NetworkManager from '../../utils/NetworkManager';
import { ErrorType } from '../common/ErrorModal';

/**
 * SessionCheck component handles automatic session validation on app start
 * Checks for valid tokens and attempts silent refresh if available
 */
const SessionCheck = ({
  onSessionValid,
  onSessionInvalid,
  onError,
  onLoading,
  skipCheck = false,
}) => {
  const [checking, setChecking] = useState(false);

  useEffect(() => {
    if (!skipCheck) {
      checkSession();
    } else {
      onSessionInvalid?.();
    }
  }, [skipCheck]);

  const checkSession = async () => {
    if (checking) return;

    setChecking(true);
    onLoading?.(true);

    try {
      // Check network first
      const networkManager = NetworkManager.getInstance();
      const connectivity = await networkManager.checkConnectivity();

      if (!connectivity.isConnected || connectivity.isInternetReachable === false) {
        onError?.({
          type: ErrorType.NETWORK_ERROR,
          message: 'No internet connection',
        });
        onLoading?.(false);
        setChecking(false);
        return;
      }

      // Check if user has valid session
      const sessionManager = SessionManager.getInstance();
      const hasValidSession = await sessionManager.hasValidSession();

      if (!hasValidSession) {
        onSessionInvalid?.();
        onLoading?.(false);
        setChecking(false);
        return;
      }

      // Attempt to refresh token
      const result = await sessionManager.refreshSession();

      if (result.success) {
        onSessionValid?.(result.data);
      } else {
        // Token refresh failed, need manual login
        onSessionInvalid?.();
      }

      onLoading?.(false);
      setChecking(false);
    } catch (error) {
      console.error('Session check failed:', error);
      onError?.({
        type: ErrorType.UNKNOWN_ERROR,
        message: error.message,
      });
      onSessionInvalid?.();
      onLoading?.(false);
      setChecking(false);
    }
  };

  // This is a logic-only component, no UI
  return null;
};

export default SessionCheck;
