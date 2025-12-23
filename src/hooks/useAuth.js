import { useState, useCallback, useRef } from 'react';
import { useDispatch } from 'react-redux';
import AuthenticationManager from '../utils/AuthenticationManager';
import { logInfo } from '../redux/actions/UserAction';
import LoginLogger from '../components/utility/LoginLogger';
import { ErrorType } from '../components/common/ErrorModal';

const useAuth = (config) => {
  const dispatch = useDispatch();
  const [isAuthenticating, setIsAuthenticating] = useState(false);
  const [error, setError] = useState(null);
  const authLockRef = useRef(false);

  const authenticate = useCallback(async () => {
    if (authLockRef.current || isAuthenticating) {
      console.log('Authentication already in progress');
      return { success: false, error: 'AUTH_IN_PROGRESS' };
    }

    authLockRef.current = true;
    setIsAuthenticating(true);
    setError(null);

    try {
      const result = await AuthenticationManager.authorizeWithTimeout(config);

      if (!result.success) {
        setError({
          type: mapErrorCodeToType(result.code),
          message: result.error,
          code: result.code,
        });

        LoginLogger.logFailedLogin(
          dispatch,
          logInfo,
          { message: 'Authorization failed', code: 30801 },
          { authMethod: 'authorize', errorDetails: result.error, errorCode: result.code }
        );

        return result;
      }

      return result;
    } catch (err) {
      const errorResult = {
        success: false,
        error: err.message,
        code: 'UNKNOWN_ERROR',
      };

      setError({
        type: ErrorType.UNKNOWN_ERROR,
        message: err.message,
      });

      return errorResult;
    } finally {
      authLockRef.current = false;
      setIsAuthenticating(false);
    }
  }, [config, dispatch, isAuthenticating]);

  const refreshToken = useCallback(async (refreshToken) => {
    try {
      const result = await AuthenticationManager.refreshWithTimeout(config, refreshToken);
      
      if (!result.success) {
        setError({
          type: ErrorType.API_ERROR,
          message: result.error,
        });
      }

      return result;
    } catch (err) {
      setError({
        type: ErrorType.UNKNOWN_ERROR,
        message: err.message,
      });

      return { success: false, error: err.message };
    }
  }, [config]);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  return {
    authenticate,
    refreshToken,
    isAuthenticating,
    error,
    clearError,
  };
};

const mapErrorCodeToType = (code) => {
  switch (code) {
    case 'AUTH_TIMEOUT':
      return ErrorType.AUTH_TIMEOUT;
    case 'BROWSER_UNAVAILABLE':
      return ErrorType.BROWSER_UNAVAILABLE;
    case 'USER_CANCELLED':
      return ErrorType.USER_CANCELLED;
    case 'NETWORK_ERROR':
      return ErrorType.NETWORK_ERROR;
    default:
      return ErrorType.UNKNOWN_ERROR;
  }
};

export default useAuth;
