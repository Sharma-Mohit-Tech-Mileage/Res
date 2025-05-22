import React, { createContext, useContext, useState, useEffect } from 'react';
import remoteConfig from '@react-native-firebase/remote-config';
import { AppState } from 'react-native';
import { useSelector } from 'react-redux';

// Create the context
export const MaintenanceContext = createContext();

/**
 * MaintenanceProvider
 */
export const MaintenanceProvider = ({ children }) => {
  // State for maintenance configuration
  const [maintenanceConfig, setMaintenanceConfig] = useState({
    bannerConfig: null,
    pageConfig: null,
    sessionConfig: null
  });
  
  // State for visibility
  const [showBanner, setShowBanner] = useState(false);
  const [showMaintenancePage, setShowMaintenancePage] = useState(false);
  
  // Get user info from Redux store
  const userInfo = useSelector(state => state.combinedReducers.user?.userInfo);
  
  // Determine if user is SV or ACP
  const userAudience = getUserAudience(userInfo);
  
  // Handle app state changes (background/foreground)
  useEffect(() => {
    const subscription = AppState.addEventListener("change", nextAppState => {
      if (nextAppState === "active") {
        // Refresh config when app comes to foreground
        fetchMaintenanceConfig();
      }
    });
    
    return () => {
      subscription.remove();
    };
  }, []);
  
  // Initial fetch of configuration
  useEffect(() => {
    fetchMaintenanceConfig();
  }, []);
  
  // Check if maintenance should be shown when config or user changes
  useEffect(() => {
    determineMaintenanceState();
  }, [maintenanceConfig, userInfo]);
  
  /**
   * Fetches maintenance configuration from Firebase Remote Config
   */
  const fetchMaintenanceConfig = async () => {
    try {
      console.log('Fetching maintenance config...');
      
      // CHANGE 1: Set minimum fetch interval to 0 for immediate updates
      await remoteConfig().setConfigSettings({
        minimumFetchIntervalMillis: 0 // Force immediate fetch every time
      });
      
      // Set default values
      await remoteConfig().setDefaults({
        maintenance_configuration: JSON.stringify({
          maintenanceBanner: {
            enabled: false
          },
          maintenancePage: {
            enabled: false
          },
          sessionManagement: {
            invalidateSessionsForAudience: "NONE",
            redirectToSplash: false
          }
        })
      });
      
      // CHANGE 2: Separate fetch and activate for more control
      // Force a fresh fetch from server with 0 cache expiration
      console.log('Forcing fresh fetch from server...');
      await remoteConfig().fetch(0);
      
      // CHANGE 3: Explicitly activate the fetched values
      const activated = await remoteConfig().activate();
      console.log('Config activated successfully:', activated);
      
      // Get the maintenance configuration
      const configString = remoteConfig().getValue('maintenance_configuration').asString();
      console.log('Received config:', configString);
      
      const config = JSON.parse(configString);
      console.log('Parsed config:', config);
      
      // Update state
      setMaintenanceConfig({
        bannerConfig: config.maintenanceBanner,
        pageConfig: config.maintenancePage,
        sessionConfig: config.sessionManagement
      });
      
      console.log('Maintenance config updated in state');
    } catch (error) {
      console.error('Error fetching maintenance config:', error);
    }
  };
  
  /**
   * Determines if maintenance messaging should be shown based on
   * current time, user type, and configuration
   */
  const determineMaintenanceState = () => {
    const { bannerConfig, pageConfig } = maintenanceConfig;
    const now = new Date();
    
    // Check banner visibility
    if (bannerConfig && bannerConfig.enabled) {
      const startTime = new Date(bannerConfig.startTime);
      const endTime = new Date(bannerConfig.endTime);
      
      const isTimeValid = now >= startTime && now <= endTime;
      const isAudienceValid = isAudienceMatch(bannerConfig.audience, userAudience);
      
      const shouldShowBanner = isTimeValid && isAudienceValid;
      console.log('Banner visibility determined:', shouldShowBanner);
      console.log('Time window valid:', isTimeValid, 'Audience match:', isAudienceValid);
      
      setShowBanner(shouldShowBanner);
    } else {
      setShowBanner(false);
    }
    
    // Check maintenance page visibility
    if (pageConfig && pageConfig.enabled) {
      const startTime = new Date(pageConfig.startTime);
      const endTime = new Date(pageConfig.endTime);
      
      const isTimeValid = now >= startTime && now <= endTime;
      const isAudienceValid = isAudienceMatch(pageConfig.audience, userAudience);
      
      const shouldShowMaintenancePage = isTimeValid && isAudienceValid;
      console.log('Maintenance page visibility determined:', shouldShowMaintenancePage);
      
      setShowMaintenancePage(shouldShowMaintenancePage);
    } else {
      setShowMaintenancePage(false);
    }
  };
  
  /**
   * Helper to determine if the user matches the target audience
   */
  const isAudienceMatch = (targetAudience, userAudience) => {
    return targetAudience === "BOTH" || targetAudience === userAudience;
  };
  
  /**
   * Helper to determine user audience type
   */
  function getUserAudience(userInfo) {
    if (!userInfo) return null;
    
    // Replace with your actual business logic
    if (userInfo.isNormalUser) {
      return "ACP";
    }
    return "SV";
  }
  
  /**
   * Dismisses the maintenance banner
   */
  const dismissBanner = () => {
    setShowBanner(false);
  };
  
  /**
   * Checks if the user's session should be invalidated
   */
  const shouldInvalidateSession = () => {
    const { sessionConfig } = maintenanceConfig;
    
    if (!sessionConfig) return false;
    
    return isAudienceMatch(sessionConfig.invalidateSessionsForAudience, userAudience);
  };
  
  return (
    <MaintenanceContext.Provider
      value={{
        showBanner,
        showMaintenancePage,
        bannerConfig: maintenanceConfig.bannerConfig,
        pageConfig: maintenanceConfig.pageConfig,
        dismissBanner,
        refreshConfig: fetchMaintenanceConfig,
        shouldInvalidateSession,
        shouldRedirectToSplash: maintenanceConfig.sessionConfig?.redirectToSplash
      }}
    >
      {children}
    </MaintenanceContext.Provider>
  );
};

// Custom hook for easy access to maintenance context
export const useMaintenance = () => useContext(MaintenanceContext);