import React, { createContext, useContext, useState, useEffect } from 'react';
import remoteConfig from '@react-native-firebase/remote-config';
import { AppState } from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import { saveUserInfo } from '../../redux/actions/UserAction';
import { storeUser, storeSsoToken, cleanUserData, getSsoToken, getUser } from '../../redux/utils/LocalStorage';
import { logout } from "react-native-app-auth";
import { Env } from '../../network/apis/account/Constants';
import { navigationRef } from '../../navigations/UserNavigations';

const config = {
  issuer: Env.SSO_LOGIN,
  clientId: "sparklight-customer-mobile-app",
  redirectUrl: "com.sparklight.customer.app.auth0://sparklight-customer.us.auth0.com/ios/com.sparklight.customer.app/callback",
  scopes: ["openid", "profile", "email", "phone", "address"],
  iosPrefersEphemeralSession: true,
};

export const MaintenanceContext = createContext();

export const MaintenanceProvider = ({ children }) => {
  const [maintenanceConfig, setMaintenanceConfig] = useState({
    bannerConfig: null,
    pageConfig: null,
    sessionConfig: null
  });
  
  const [showBanner, setShowBanner] = useState(false);
  const [showMaintenancePage, setShowMaintenancePage] = useState(false);
  const [isUserLoggedIn, setIsUserLoggedIn] = useState(false);
  const [currentUserAudience, setCurrentUserAudience] = useState(null);
  
  // Get user info from Redux
  const userInfo = useSelector(state => state.combinedReducers.user?.userInfo);
  const dispatch = useDispatch();
  
  // Simple user audience detection using ONLY isNormalUser flag
  function getUserAudience(userInfo) {
    console.log('🔧 getUserAudience called with:', userInfo);
    
    if (!userInfo) {
      console.log('🔧 No userInfo provided, returning null');
      return null;
    }
    
    // Fix the logic - check if isNormalUser exists and handle undefined
    console.log('🔧 isNormalUser value:', userInfo.isNormalUser);
    
    // If isNormalUser is undefined, determine from account number length
    let isNormalUser = userInfo.isNormalUser;
    if (isNormalUser === undefined && userInfo.accountNumber) {
      // 9 digits = normal user (SV), more than 9 = ACP user
      const accountLength = userInfo.accountNumber.toString().length;
      isNormalUser = accountLength === 9;
      console.log('🔧 isNormalUser was undefined, determined from account length:', {
        accountNumber: userInfo.accountNumber,
        accountLength: accountLength,
        isNormalUser: isNormalUser
      });
    }
    
    // isNormalUser = true → SV user (traditional Sparklight customers)
    // isNormalUser = false → ACP user (Affordable Connectivity Program customers)  
    const audience = isNormalUser ? "SV" : "ACP";
    
    console.log('🔧 🎯 User audience determined:', {
      isNormalUser: isNormalUser,
      audience: audience,
      accountNumber: userInfo.accountNumber
    });
    
    return audience;
  }

  // Check if user is logged in by checking local storage
  const checkLoginStatus = async () => {
    try {
      const userData = await getUser();
      const isLoggedIn = !!(userData && userData.userInfo && userData.token);
      
      console.log('🔧 🔐 Login status check:', {
        hasUserData: !!userData,
        hasUserInfo: !!(userData?.userInfo),
        hasToken: !!(userData?.token),
        isLoggedIn: isLoggedIn
      });
      
      setIsUserLoggedIn(isLoggedIn);
      
      if (isLoggedIn) {
        const audience = getUserAudience(userData.userInfo);
        setCurrentUserAudience(audience);
        console.log('🔧 🔐 User is logged in as:', audience);
      } else {
        setCurrentUserAudience(null);
        console.log('🔧 🔐 User is not logged in');
      }
      
      return { isLoggedIn, userData };
    } catch (error) {
      console.error('🔧 🔐 Error checking login status:', error);
      setIsUserLoggedIn(false);
      setCurrentUserAudience(null);
      return { isLoggedIn: false, userData: null };
    }
  };

  // Handle app state changes
  useEffect(() => {
    console.log('🔧 Setting up AppState listener');
    const subscription = AppState.addEventListener("change", nextAppState => {
      console.log('🔧 AppState changed to:', nextAppState);
      if (nextAppState === "active") {
        console.log('🔧 App became active, refreshing config and login status');
        fetchMaintenanceConfig();
        checkLoginStatus();
      }
    });
    
    return () => {
      console.log('🔧 Cleaning up AppState listener');
      subscription.remove();
    };
  }, []);
  
  // Initial setup
  useEffect(() => {
    console.log('🔧 🚀 Initial maintenance system setup');
    fetchMaintenanceConfig();
    checkLoginStatus();
  }, []);
  
  // Watch Redux userInfo changes (for login/logout detection)
  useEffect(() => {
    console.log('🔧 👤 Redux userInfo changed:', !!userInfo);
    
    if (userInfo && Object.keys(userInfo).length > 0) {
      // User just logged in via Redux
      console.log('🔧 👤 User logged in via Redux');
      setIsUserLoggedIn(true);
      const audience = getUserAudience(userInfo);
      setCurrentUserAudience(audience);
    } else {
      // User logged out or no user info
      console.log('🔧 👤 No user info in Redux, checking local storage');
      checkLoginStatus();
    }
  }, [userInfo]);
  
  // Determine maintenance state when config or login status changes
  useEffect(() => {
    console.log('🔧 🎯 Determining maintenance state due to changes');
    determineMaintenanceState();
  }, [maintenanceConfig, isUserLoggedIn, currentUserAudience]);
  
  // Session invalidation - only when logged in
  useEffect(() => {
    if (!isUserLoggedIn) {
      console.log('🔧 🚪 User not logged in, skipping session invalidation check');
      return;
    }
    
    console.log('🔧 🚪 Session invalidation check for logged in user');
    const handleSessionInvalidation = async () => {
      const { sessionConfig } = maintenanceConfig;
      
      if (!sessionConfig) {
        console.log('🔧 🚪 No session config available');
        return;
      }
      
      console.log('🔧 🚪 Session config:', sessionConfig);
      
      if (sessionConfig.invalidateSessionsForAudience !== "NONE" && currentUserAudience) {
        const shouldInvalidate = isAudienceMatch(sessionConfig.invalidateSessionsForAudience, currentUserAudience);
        
        console.log('🔧 🚪 Session invalidation decision:', {
          targetAudience: sessionConfig.invalidateSessionsForAudience,
          currentUserAudience: currentUserAudience,
          shouldInvalidate: shouldInvalidate,
          redirectToSplash: sessionConfig.redirectToSplash
        });
        
        if (shouldInvalidate && sessionConfig.redirectToSplash) {
          console.log('🔧 🚪 ⚠️ SESSION LOGOUT TRIGGERED for audience:', currentUserAudience);
          await performLogout();
        }
      }
    };
    
    handleSessionInvalidation();
  }, [maintenanceConfig.sessionConfig, isUserLoggedIn, currentUserAudience]);

  const fetchMaintenanceConfig = async () => {
    try {
      console.log('🔧 📡 Fetching maintenance config from Firebase...');
      
      await remoteConfig().setConfigSettings({
        minimumFetchIntervalMillis: 0
      });
      
      const defaultConfig = {
        maintenanceBanner: { enabled: false },
        maintenancePage: { enabled: false },
        sessionManagement: {
          invalidateSessionsForAudience: "NONE",
          redirectToSplash: false
        }
      };
      
      await remoteConfig().setDefaults({
        maintenance_configuration: JSON.stringify(defaultConfig)
      });
      
      await remoteConfig().fetch(0);
      const activated = await remoteConfig().activate();
      console.log('🔧 📡 ✅ Config activated:', activated);
      
      const configString = remoteConfig().getValue('maintenance_configuration').asString();
      console.log('🔧 📡 Raw config received:', configString);
      
      const parsedConfig = JSON.parse(configString);
      console.log('🔧 📡 Parsed config:', parsedConfig);
      
      // FIX: Check if config is nested under maintenance_configuration
      let finalConfig;
      if (parsedConfig.maintenance_configuration) {
        console.log('🔧 📡 Config is nested under maintenance_configuration');
        finalConfig = parsedConfig.maintenance_configuration;
      } else {
        console.log('🔧 📡 Config is at root level');
        finalConfig = parsedConfig;
      }
      
      console.log('🔧 📡 Final config structure:', finalConfig);
      
      setMaintenanceConfig({
        bannerConfig: finalConfig.maintenanceBanner,
        pageConfig: finalConfig.maintenancePage,
        sessionConfig: finalConfig.sessionManagement
      });
      
      console.log('🔧 📡 ✅ Maintenance config updated:', {
        hasBannerConfig: !!finalConfig.maintenanceBanner,
        hasPageConfig: !!finalConfig.maintenancePage,
        hasSessionConfig: !!finalConfig.sessionManagement,
        bannerEnabled: finalConfig.maintenanceBanner?.enabled,
        bannerAudience: finalConfig.maintenanceBanner?.audience
      });
      
    } catch (error) {
      console.error('🔧 📡 ❌ Error fetching config:', error);
    }
  };
  
  const determineMaintenanceState = () => {
    console.log('🔧 🎯 === DETERMINING MAINTENANCE STATE ===');
    const { bannerConfig, pageConfig } = maintenanceConfig;
    const now = new Date();
    
    console.log('🔧 🎯 Current state:', {
      currentTime: now.toISOString(),
      isUserLoggedIn: isUserLoggedIn,
      currentUserAudience: currentUserAudience,
      hasBannerConfig: !!bannerConfig,
      hasPageConfig: !!pageConfig,
      bannerEnabled: bannerConfig?.enabled,
      bannerAudience: bannerConfig?.audience
    });
    
    // ===== MAINTENANCE PAGE LOGIC =====
    if (pageConfig && pageConfig.enabled) {
      console.log('🔧 📄 Maintenance page config enabled:', pageConfig);
      
      const startTime = new Date(pageConfig.startTime);
      const endTime = new Date(pageConfig.endTime);
      const isTimeValid = now >= startTime && now <= endTime;
      
     
      
      if (isTimeValid) {
        if (!isUserLoggedIn) {
          // PRE-LOGIN: Show maintenance page for "BOTH" audience only
          const shouldShowForNotLoggedIn = pageConfig.audience === "BOTH";
          console.log('🔧 📄 Pre-login maintenance page decision:', {
            audience: pageConfig.audience,
            shouldShow: shouldShowForNotLoggedIn
          });
          setShowMaintenancePage(shouldShowForNotLoggedIn);
        } else {
          // POST-LOGIN: Show maintenance page based on user audience
          const isAudienceValid = isAudienceMatch(pageConfig.audience, currentUserAudience);
          console.log('🔧 📄 Post-login maintenance page decision:', {
            targetAudience: pageConfig.audience,
            userAudience: currentUserAudience,
            shouldShow: isAudienceValid
          });
          setShowMaintenancePage(isAudienceValid);
        }
      } else {
        console.log('🔧 📄 Maintenance page time not valid');
        setShowMaintenancePage(false);
      }
    } else {
      console.log('🔧 📄 Maintenance page disabled or not configured');
      setShowMaintenancePage(false);
    }
    
    // ===== BANNER LOGIC (only for logged in users) =====
    if (bannerConfig && bannerConfig.enabled && isUserLoggedIn) {
      console.log('🔧 🎌 Banner config enabled for logged in user:', bannerConfig);
      
      const startTime = new Date(bannerConfig.startTime);
      const endTime = new Date(bannerConfig.endTime);
      const isTimeValid = now >= startTime && now <= endTime;
      const isAudienceValid = isAudienceMatch(bannerConfig.audience, currentUserAudience);
      
      console.log('🔧 🎌 Banner decision:', {
        startTime: startTime.toISOString(),
        endTime: endTime.toISOString(),
        isTimeValid: isTimeValid,
        targetAudience: bannerConfig.audience,
        userAudience: currentUserAudience,
        isAudienceValid: isAudienceValid,
        finalResult: isTimeValid && isAudienceValid
      });
      
      setShowBanner(isTimeValid && isAudienceValid);
    } else {
      if (!bannerConfig) {
        console.log('🔧 🎌 No banner config available');
      } else if (!bannerConfig.enabled) {
        console.log('🔧 🎌 Banner config disabled');
      } else if (!isUserLoggedIn) {
        console.log('🔧 🎌 Banner disabled - user not logged in');
      }
      setShowBanner(false);
    }
    
    console.log('🔧 🎯 === FINAL MAINTENANCE STATE ===', {
      showMaintenancePage,
      showBanner
    });
  };
  
  const isAudienceMatch = (targetAudience, userAudience) => {
    console.log('🔧 🎯 Audience match check:', { targetAudience, userAudience });
    
    if (!userAudience && targetAudience !== "BOTH") {
      console.log('🔧 🎯 No user audience and target is not BOTH');
      return false;
    }
    
    const isMatch = targetAudience === "BOTH" || targetAudience === userAudience;
    console.log('🔧 🎯 Audience match result:', isMatch);
    
    return isMatch;
  };
  
  const dismissBanner = () => {
    console.log('🔧 🎌 Banner dismissed by user');
    setShowBanner(false);
  };
  
  const performLogout = async () => {
    try {
      console.log('🔧 🚪 === STARTING SESSION LOGOUT ===');
      
      const storedSsoToken = await getSsoToken();
      console.log('🔧 🚪 SSO Token available:', !!storedSsoToken?.idToken);
      
      if (storedSsoToken && storedSsoToken.idToken) {
        console.log('🔧 🚪 Performing SSO logout...');
        await logout(config, {
          idToken: storedSsoToken.idToken,
          postLogoutRedirectUrl: config.redirectUrl,
        });
        console.log('🔧 🚪 SSO logout completed');
      }
      
      console.log('🔧 🚪 Cleaning up storage and Redux...');
      await storeUser({});
      await storeSsoToken({});
      await cleanUserData();
      dispatch(saveUserInfo({}));
      
      // Reset maintenance context state
      setIsUserLoggedIn(false);
      setCurrentUserAudience(null);
      
      console.log('🔧 🚪 ✅ Session logout completed successfully');
      
      // Navigate to splash screen
      if (navigationRef.current) {
        console.log('🔧 🚪 Navigating to splash screen...');
        navigationRef.current.reset({
          index: 0,
          routes: [{ name: 'Splash', params: { isLogout: true } }],
        });
      } else {
        console.log('🔧 🚪 ⚠️ Navigation ref not available');
      }
      
    } catch (error) {
      console.error('🔧 🚪 ❌ Error during session logout:', error);
      
      // Fallback cleanup
      try {
        console.log('🔧 🚪 Attempting fallback cleanup...');
        await storeUser({});
        await storeSsoToken({});
        await cleanUserData();
        dispatch(saveUserInfo({}));
        
        setIsUserLoggedIn(false);
        setCurrentUserAudience(null);
        
        if (navigationRef.current) {
          navigationRef.current.reset({
            index: 0,
            routes: [{ name: 'Splash', params: { isLogout: true } }],
          });
        }
        console.log('🔧 🚪 ✅ Fallback cleanup completed');
      } catch (cleanupError) {
        console.error('🔧 🚪 ❌ Fallback cleanup failed:', cleanupError);
      }
    }
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
        // Expose for debugging
        isUserLoggedIn,
        currentUserAudience,
      }}
    >
      {children}
    </MaintenanceContext.Provider>
  );
};

export const useMaintenance = () => useContext(MaintenanceContext);