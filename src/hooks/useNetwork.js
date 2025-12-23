import { useState, useEffect, useCallback } from 'react';
import NetworkManager from '../utils/NetworkManager';

const useNetwork = () => {
  const [networkState, setNetworkState] = useState({
    isConnected: true,
    type: 'unknown',
    isInternetReachable: true,
  });
  const [isChecking, setIsChecking] = useState(false);

  useEffect(() => {
    const networkManager = NetworkManager.getInstance();
    
    // Initial check
    checkConnectivity();

    // Subscribe to changes
    const unsubscribe = networkManager.subscribeToNetworkChanges((state) => {
      setNetworkState(state);
    });

    return () => {
      if (unsubscribe) {
        unsubscribe();
      }
    };
  }, []);

  const checkConnectivity = useCallback(async () => {
    setIsChecking(true);
    const networkManager = NetworkManager.getInstance();
    const state = await networkManager.checkConnectivity();
    setNetworkState(state);
    setIsChecking(false);
    return state;
  }, []);

  const waitForConnectivity = useCallback(async (timeout = 5000) => {
    const networkManager = NetworkManager.getInstance();
    return await networkManager.waitForConnectivity(timeout);
  }, []);

  return {
    networkState,
    isConnected: networkState.isConnected,
    isInternetReachable: networkState.isInternetReachable,
    connectionType: networkState.type,
    isChecking,
    checkConnectivity,
    waitForConnectivity,
  };
};

export default useNetwork;
