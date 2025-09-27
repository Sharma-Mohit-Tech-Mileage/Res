import React, { createContext, useContext, useState, useEffect } from "react";
import remoteConfig from "@react-native-firebase/remote-config";
import { AppState } from "react-native";
import { useSelector, useDispatch } from "react-redux";
import { saveUserInfo } from "../../redux/actions/UserAction";
import {
  storeUser,
  storeSsoToken,
  cleanUserData,
  getSsoToken,
  getUser,
} from "../../redux/utils/LocalStorage";
import { logout } from "react-native-app-auth";
import { Env, ISUAT } from "../../network/apis/account/Constants";
import { navigationRef } from "../../navigations/UserNavigations";

const config = {
  issuer: Env.SSO_LOGIN,
  clientId: "sparklight-customer-mobile-app",
  redirectUrl:
    "com.sparklight.customer.app.auth0://sparklight-customer.us.auth0.com/ios/com.sparklight.customer.app/callback",
  scopes: ["openid", "profile", "email", "phone", "address"],
  iosPrefersEphemeralSession: true,
};

// Environment-based Firebase configuration keys
const FIREBASE_CONFIG_KEYS = {
  PRODUCTION: "maintenance_configuration",
  UAT: "dev_config"
};

// Get the appropriate config key based on environment
const getFirebaseConfigKey = () => {
  const configKey = ISUAT ? FIREBASE_CONFIG_KEYS.UAT : FIREBASE_CONFIG_KEYS.PRODUCTION;
  console.log("Environment-based config:", {
    isUAT: ISUAT,
    environment: ISUAT ? "UAT/DEV" : "PRODUCTION",
    configKey: configKey
  });
  return configKey;
};

export const MaintenanceContext = createContext();

export const MaintenanceProvider = ({ children }) => {
  const [maintenanceConfig, setMaintenanceConfig] = useState({
    maintenanceWindow: null,
    bannerConfig: null,
    pageConfig: null,
    sessionConfig: null,
  });

  const [showBanner, setShowBanner] = useState(false);
  const [showMaintenancePage, setShowMaintenancePage] = useState(false);
  const [isUserLoggedIn, setIsUserLoggedIn] = useState(false);
  const [currentUserAudience, setCurrentUserAudience] = useState(null);

  // Enhanced blocking state management
  const [blockingState, setBlockingState] = useState({
    isBlocking: false,
    wasBlocked: false,
    blockedAudience: null,
    blockingConfig: null,
    blockingTimestamp: null,
  });

  const userData = useSelector(
    (state) => state.user?.userData
  );
  const dispatch = useDispatch();

  // Simple user audience detection using ONLY  flag
  function getUserAudience(userInfo) {
    if (!userInfo) {
      return null;
    }
    const audience = "ACP";
    return audience;
  }

  // Check if user is logged in by checking local storage
  const checkLoginStatus = async () => {
    try {
      const userData = await getUser();
      const isLoggedIn = !!(userData && userData.userInfo && userData.token);

      setIsUserLoggedIn(isLoggedIn);

      if (isLoggedIn) {
        const audience = getUserAudience(userData.userInfo);
        setCurrentUserAudience(audience);
      } else {
        setCurrentUserAudience(null);
      }

      return { isLoggedIn, userData };
    } catch (error) {
      console.error("Error checking login status:", error);
      setIsUserLoggedIn(false);
      setCurrentUserAudience(null);
      return { isLoggedIn: false, userData: null };
    }
  };

  // Enhanced immediate blocking check function
  const performImmediateBlockingCheck = (userAudience) => {
    const { pageConfig } = maintenanceConfig;

    if (!pageConfig || !pageConfig.enabled) {
      return;
    }

    // Check time validity
    const now = new Date();
    let isTimeValid = true;

    if (pageConfig.startTime && pageConfig.endTime) {
      try {
        const startTime = new Date(pageConfig.startTime);
        const endTime = new Date(pageConfig.endTime);

        if (isNaN(startTime.getTime()) || isNaN(endTime.getTime())) {
          isTimeValid = false;
        } else {
          isTimeValid = now <= endTime;
        }
      } catch (error) {
        console.error("Error parsing blocking times:", error);
        isTimeValid = false;
      }
    }

    if (!isTimeValid) {
      return;
    }

    // Check audience and type
    const isAudienceValid = isAudienceMatch(pageConfig.audience, userAudience);
    const isBlockingType = pageConfig.type === "BLOCK_AND_LOGOUT";

    if (isAudienceValid && isBlockingType) {
      console.log("IMMEDIATE BLOCKING TRIGGERED for audience:", userAudience);

      // Set comprehensive blocking state
      setBlockingState({
        isBlocking: true,
        wasBlocked: true,
        blockedAudience: userAudience,
        blockingConfig: pageConfig,
        blockingTimestamp: now.toISOString(),
      });

      // Set maintenance page visibility immediately
      setShowMaintenancePage(true);

      // Trigger immediate silent data clearing
      setTimeout(() => {
        performLogout(true);
      }, 500);
    }
  };

  // Handle app state changes
  useEffect(() => {
    const subscription = AppState.addEventListener("change", (nextAppState) => {
      if (nextAppState === "active") {
        fetchMaintenanceConfig();
        checkLoginStatus();
      }
    });

    return () => {
      subscription.remove();
    };
  }, []);

  // Initial setup
  useEffect(() => {
    fetchMaintenanceConfig();
    checkLoginStatus();
  }, []);

  // Watch Redux userData changes with immediate blocking
  useEffect(() => {
    if (
      userData &&
      userData.userInfo &&
      Object.keys(userData.userInfo).length > 0
    ) {
      // User just logged in via Redux
      setIsUserLoggedIn(true);
      const audience = getUserAudience(userData.userInfo);
      setCurrentUserAudience(audience);

      // IMMEDIATE BLOCKING CHECK: Don't wait for other effects
      performImmediateBlockingCheck(audience);
    } else {
      // User logged out or no user info
      checkLoginStatus();
    }
  }, [userData]);

  // Determine maintenance state when config or login status changes
  useEffect(() => {
    determineMaintenanceState();
  }, [maintenanceConfig, isUserLoggedIn, currentUserAudience, blockingState]);

  // Session invalidation - only when logged in
  useEffect(() => {
    if (!isUserLoggedIn) {
      return;
    }

    const handleSessionInvalidation = async () => {
      const { sessionConfig } = maintenanceConfig;

      if (!sessionConfig) {
        return;
      }

      if (
        sessionConfig.invalidateSessionsForAudience !== "NONE" &&
        currentUserAudience
      ) {
        const shouldInvalidate = isAudienceMatch(
          sessionConfig.invalidateSessionsForAudience,
          currentUserAudience
        );

        if (shouldInvalidate && sessionConfig.redirectToSplash) {
          console.log("SESSION LOGOUT TRIGGERED for audience:", currentUserAudience);
          await performLogout(false);
        }
      }
    };

    handleSessionInvalidation();
  }, [maintenanceConfig.sessionConfig, isUserLoggedIn, currentUserAudience]);

  const fetchMaintenanceConfig = async () => {
    try {
      // Get environment-specific config key
      const configKey = getFirebaseConfigKey();

      await remoteConfig().setConfigSettings({
        minimumFetchIntervalMillis: 0,
      });

      const defaultConfig = {
        maintenanceWindow: {
          mode: "IMMEDIATE",
          enabled: false,
        },
        maintenanceBanner: { enabled: false },
        maintenancePage: { enabled: false },
        sessionManagement: {
          invalidateSessionsForAudience: "NONE",
          redirectToSplash: false,
        },
      };

      // Set defaults using environment-specific key
      await remoteConfig().setDefaults({
        [configKey]: JSON.stringify(defaultConfig),
      });

      await remoteConfig().fetch(0);
      const activated = await remoteConfig().activate();

      // Get config using environment-specific key
      const configString = remoteConfig()
        .getValue(configKey)
        .asString();

      const parsedConfig = JSON.parse(configString);

      let finalConfig;
      if (parsedConfig.maintenance_configuration) {
        finalConfig = parsedConfig.maintenance_configuration;
      } else {
        finalConfig = parsedConfig;
      }

      setMaintenanceConfig({
        maintenanceWindow: finalConfig.maintenanceWindow,
        bannerConfig: finalConfig.maintenanceBanner,
        pageConfig: finalConfig.maintenancePage,
        sessionConfig: finalConfig.sessionManagement,
      });

    } catch (error) {
      console.error("Error fetching config:", error);
    }
  };

  const determineMaintenanceState = () => {
    const { maintenanceWindow, bannerConfig, pageConfig, sessionConfig } =
      maintenanceConfig;
    const now = new Date();

    // Step 1: Check if maintenance window is active
    let isMaintenanceActive = false;

    if (!maintenanceWindow || !maintenanceWindow.enabled) {
      setShowBanner(false);
      setShowMaintenancePage(false);
      return;
    }

    // Step 2: Determine if maintenance is active based on mode
    switch (maintenanceWindow.mode) {
      case "IMMEDIATE":
        // IMMEDIATE mode = always active when enabled
        isMaintenanceActive = true;
        break;

      case "SCHEDULED":
        // SCHEDULED mode = check global time window
        if (maintenanceWindow.startTime && maintenanceWindow.endTime) {
          try {
            const startTime = new Date(maintenanceWindow.startTime);
            const endTime = new Date(maintenanceWindow.endTime);

            if (isNaN(startTime.getTime()) || isNaN(endTime.getTime())) {
              isMaintenanceActive = false;
            } else {
              // Use same flexible logic: active if before end time
              isMaintenanceActive = now <= endTime;
            }
          } catch (error) {
            console.error("Error parsing scheduled window times:", error);
            isMaintenanceActive = false;
          }
        } else {
          isMaintenanceActive = true;
        }
        break;

      default:
        isMaintenanceActive = true;
    }

    // Step 3: If maintenance not active, disable everything
    if (!isMaintenanceActive) {
      setShowBanner(false);
      setShowMaintenancePage(false);
      return;
    }

    // Step 4: Maintenance is active - check individual features
    if (
      bannerConfig &&
      bannerConfig.enabled &&
      (!pageConfig || !pageConfig.enabled) &&
      blockingState.wasBlocked
    ) {
      setBlockingState({
        isBlocking: false,
        wasBlocked: false,
        blockedAudience: null,
        blockingConfig: null,
        blockingTimestamp: null,
      });
    }

    // MAINTENANCE PAGE LOGIC (No Individual Time Checks)
    if (pageConfig && pageConfig.enabled) {
      // Handle persistent blocking state first
      if (blockingState.wasBlocked && blockingState.blockingConfig) {
        setShowMaintenancePage(true);
        setShowBanner(false);
        return;
      }

      // Determine based on login state and audience
      if (!isUserLoggedIn) {
        // Pre-login: Show for "BOTH" audience only
        const shouldShowForNotLoggedIn = pageConfig.audience === "BOTH";
        setShowMaintenancePage(shouldShowForNotLoggedIn);
      } else {
        // Post-login: Check audience match
        const isAudienceValid = isAudienceMatch(
          pageConfig.audience,
          currentUserAudience
        );

        if (isAudienceValid && pageConfig.type === "BLOCK_AND_LOGOUT") {
          performImmediateBlockingCheck(currentUserAudience);
        } else if (isAudienceValid) {
          setShowMaintenancePage(true);
        } else {
          setShowMaintenancePage(false);
        }
      }
    } else {
      setShowMaintenancePage(false);
    }

    // BANNER LOGIC (No Individual Time Checks)
    if (bannerConfig && bannerConfig.enabled && isUserLoggedIn) {
      const isAudienceValid = isAudienceMatch(
        bannerConfig.audience,
        currentUserAudience
      );

      setShowBanner(isAudienceValid);
    } else {
      setShowBanner(false);
    }
  };

  const isAudienceMatch = (targetAudience, userAudience) => {
    if (!userAudience && targetAudience !== "BOTH") {
      return false;
    }

    const isMatch =
      targetAudience === "BOTH" || targetAudience === userAudience;

    return isMatch;
  };

  const dismissBanner = () => {
    setShowBanner(false);
  };

  // Function to clear blocking state (for manual override)
  const clearBlockingState = () => {
    setBlockingState({
      isBlocking: false,
      wasBlocked: false,
      blockedAudience: null,
      blockingConfig: null,
      blockingTimestamp: null,
    });
    setShowMaintenancePage(false);
  };

  const performLogout = async (isBlockingLogout = false) => {
    try {
      if (isBlockingLogout) {
        console.log("STARTING ENHANCED SILENT LOGOUT");

        // THOROUGH STORAGE CLEARING
        await Promise.all([
          storeUser({}),
          storeUser(null),
          storeSsoToken({}),
          storeSsoToken(null),
          cleanUserData(),
        ]);

        dispatch(saveUserInfo({}));

        // WAIT FOR ASYNC OPERATIONS TO COMPLETE
        await new Promise((resolve) => setTimeout(resolve, 200));

        // Reset states
        setIsUserLoggedIn(false);
        setCurrentUserAudience(null);
        setBlockingState((prev) => ({
          ...prev,
          isBlocking: false,
        }));

        console.log("Enhanced silent logout completed");
      } else {
        // NORMAL LOGOUT: Keep existing browser-based logout for regular scenarios
        console.log("STARTING NORMAL SESSION LOGOUT");

        const storedSsoToken = await getSsoToken();

        if (storedSsoToken && storedSsoToken.idToken) {
          await logout(config, {
            idToken: storedSsoToken.idToken,
            postLogoutRedirectUrl: config.redirectUrl,
          });
        }

        await storeUser({});
        await storeSsoToken({});
        await cleanUserData();
        dispatch(saveUserInfo({}));

        // Reset all states for normal logout
        setIsUserLoggedIn(false);
        setCurrentUserAudience(null);
        setShowBanner(false);
        setShowMaintenancePage(false);
        setBlockingState({
          isBlocking: false,
          wasBlocked: false,
          blockedAudience: null,
          blockingConfig: null,
          blockingTimestamp: null,
        });
      }

      if (navigationRef.current) {
        navigationRef.current.reset({
          index: 0,
          routes: [{ name: "Splash", params: { isLogout: true } }],
        });
      }
    } catch (error) {
      console.error("Error during logout:", error);

      // Fallback cleanup (always silent for blocking logout)
      try {
        await storeUser({});
        await storeSsoToken({});
        await cleanUserData();
        dispatch(saveUserInfo({}));

        setIsUserLoggedIn(false);
        setCurrentUserAudience(null);

        if (!isBlockingLogout) {
          setShowBanner(false);
          setShowMaintenancePage(false);
          setBlockingState({
            isBlocking: false,
            wasBlocked: false,
            blockedAudience: null,
            blockingConfig: null,
            blockingTimestamp: null,
          });

          if (navigationRef.current) {
            navigationRef.current.reset({
              index: 0,
              routes: [{ name: "Splash", params: { isLogout: true } }],
            });
          }
        }
        console.log("Fallback cleanup completed");
      } catch (cleanupError) {
        console.error("Fallback cleanup failed:", cleanupError);
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
        clearBlockingState,
        // Expose for debugging
        isUserLoggedIn,
        currentUserAudience,
        blockingState,
      }}
    >
      {children}
    </MaintenanceContext.Provider>
    );
};

export const useMaintenance = () => useContext(MaintenanceContext);