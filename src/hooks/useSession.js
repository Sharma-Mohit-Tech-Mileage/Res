import { useState, useCallback, useEffect } from 'react';
import SessionManager from '../utils/SessionManager';

const useSession = () => {
  const [sessionData, setSessionData] = useState(null);
  const [hasValidSession, setHasValidSession] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    checkSession();
  }, []);

  const checkSession = useCallback(async () => {
    setIsLoading(true);
    const sessionManager = SessionManager.getInstance();
    const isValid = await sessionManager.hasValidSession();
    setHasValidSession(isValid);

    if (isValid) {
      const data = await sessionManager.getSessionData();
      setSessionData(data);
    }

    setIsLoading(false);
    return isValid;
  }, []);

  const refreshSession = useCallback(async () => {
    setIsLoading(true);
    const sessionManager = SessionManager.getInstance();
    const result = await sessionManager.refreshSession();
    setIsLoading(false);

    if (result.success) {
      setHasValidSession(true);
      const data = await sessionManager.getSessionData();
      setSessionData(data);
    } else {
      setHasValidSession(false);
    }

    return result;
  }, []);

  const clearSession = useCallback(async () => {
    const sessionManager = SessionManager.getInstance();
    const result = await sessionManager.clearSession();
    
    if (result.success) {
      setSessionData(null);
      setHasValidSession(false);
    }

    return result;
  }, []);

  const updateSession = useCallback(async (newSessionData) => {
    const sessionManager = SessionManager.getInstance();
    const result = await sessionManager.updateSession(newSessionData);

    if (result.success) {
      setSessionData(result.data);
    }

    return result;
  }, []);

  return {
    sessionData,
    hasValidSession,
    isLoading,
    checkSession,
    refreshSession,
    clearSession,
    updateSession,
  };
};

export default useSession;
