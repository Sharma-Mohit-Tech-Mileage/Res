import React, { createContext, useContext, useState, useEffect } from "react";
import RemoteConfigManager from "../../config/Remoteconfigmanager";
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
//import { Env } from "../../network/apis/account/Constants";
import Config from "react-native-config";
import { navigationRef } from "../../navigations/UserNavigations";
import { clearAuthCookies } from "../utility/NativeCookieManager";

const config = {
  issuer: Config.SSO_LOGIN,
  clientId: "sparklight-customer-mobile-app",
  redirectUrl:
    "com.sparklight.customer.app.auth0://sparklight-customer.us.auth0.com/ios/com.sparklight.customer.app/callback",
  scopes: ["openid", "profile", "email", "phone", "address"],
  iosPrefersEphemeralSession: true,
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

  const [blockingState, setBlockingState] = useState({
    isBlocking: false,
    wasBlocked: false,
    blockingConfig: null,
    blockingTimestamp: null,
  });

  const userData = useSelector((state) => state.user?.userData);
  const dispatch = useDispatch();

  const checkLoginStatus = async () => {
    try {
      const userData = await getUser();
      const isLoggedIn = !!(userData && userData.userInfo && userData.token);

      setIsUserLoggedIn(isLoggedIn);

      return { isLoggedIn, userData };
    } catch (error) {
      console.error("Error checking login status:", error);
      setIsUserLoggedIn(false);
      return { isLoggedIn: false, userData: null };
    }
  };

  const performImmediateBlockingCheck = () => {
    const { pageConfig, maintenanceWindow } = maintenanceConfig;

    if (!pageConfig || !pageConfig.enabled) {
      return;
    }

    if (!maintenanceWindow || !maintenanceWindow.enabled) {
      return;
    }

    const now = new Date();
    let isTimeValid = true;

    if (maintenanceWindow.mode === "SCHEDULED") {
      if (!maintenanceWindow.startTime || !maintenanceWindow.endTime) {
        return;
      }
      try {
        const startTime = new Date(maintenanceWindow.startTime);
        const endTime = new Date(maintenanceWindow.endTime);

        if (isNaN(startTime.getTime()) || isNaN(endTime.getTime())) {
          isTimeValid = false;
        } else {
          isTimeValid = now >= startTime && now <= endTime;
        }
      } catch (error) {
        console.error("Error parsing maintenance window times:", error);
        isTimeValid = false;
      }
    }

    if (!isTimeValid) {
      return;
    }

    const isBlockingType = pageConfig.type === "BLOCK_AND_LOGOUT";

    if (isBlockingType) {
      console.log("IMMEDIATE BLOCKING TRIGGERED");

      setBlockingState({
        isBlocking: true,
        wasBlocked: true,
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

  // Initial setup - Subscribe to RemoteConfigManager
  useEffect(() => {
    // Get initial config
    const initialConfig = RemoteConfigManager.getMaintenanceConfig();
    setMaintenanceConfig({
      maintenanceWindow: initialConfig.maintenanceWindow,
      bannerConfig: initialConfig.maintenanceBanner,
      pageConfig: initialConfig.maintenancePage,
      sessionConfig: initialConfig.sessionManagement,
    });

    // Subscribe to config changes
    const unsubscribe = RemoteConfigManager.subscribeToMaintenance(
      (newConfig) => {
        console.log("[Maintenance] Config updated from RemoteConfigManager");
        setMaintenanceConfig({
          maintenanceWindow: newConfig.maintenanceWindow,
          bannerConfig: newConfig.maintenanceBanner,
          pageConfig: newConfig.maintenancePage,
          sessionConfig: newConfig.sessionManagement,
        });
      }
    );

    checkLoginStatus();

    return () => {
      unsubscribe();
    };
  }, []);

  useEffect(() => {
    if (
      userData &&
      userData.userInfo &&
      Object.keys(userData.userInfo).length > 0
    ) {
      setIsUserLoggedIn(true);
      performImmediateBlockingCheck();
    } else {
      checkLoginStatus();
    }
  }, [userData]);

  useEffect(() => {
    determineMaintenanceState();
  }, [maintenanceConfig, isUserLoggedIn, blockingState]);

  useEffect(() => {
    if (!isUserLoggedIn) {
      return;
    }

    const handleSessionInvalidation = async () => {
      const { sessionConfig, maintenanceWindow } = maintenanceConfig;

      if (!sessionConfig) {
        return;
      }

      // Honor the maintenance window time before invalidating sessions
      if (maintenanceWindow?.enabled && maintenanceWindow.mode === "SCHEDULED") {
        const now = Date.now();
        const startTime = new Date(maintenanceWindow.startTime).getTime();
        const endTime = new Date(maintenanceWindow.endTime).getTime();

        if (isNaN(startTime) || isNaN(endTime) || now < startTime || now > endTime) {
          console.log("SESSION INVALIDATION SKIPPED - outside scheduled maintenance window");
          return;
        }
      }

      const invalidationFlag = sessionConfig.invalidateSessionsForAudience;
      const shouldInvalidate =
        !!invalidationFlag && invalidationFlag !== "NONE";

      if (shouldInvalidate && sessionConfig.redirectToSplash) {
        console.log("SESSION LOGOUT TRIGGERED");
        await performLogout(false);
      }
    };

    handleSessionInvalidation();
  }, [maintenanceConfig.sessionConfig, isUserLoggedIn]);

  const determineMaintenanceState = () => {
    const { maintenanceWindow, bannerConfig, pageConfig, sessionConfig } =
      maintenanceConfig;
    const now = new Date();

    let isMaintenanceActive = false;

    if (!maintenanceWindow || !maintenanceWindow.enabled) {
      setShowBanner(false);
      setShowMaintenancePage(false);
      return;
    }

    switch (maintenanceWindow.mode) {
      case "IMMEDIATE":
        isMaintenanceActive = true;
        break;
      case "SCHEDULED":
        if (maintenanceWindow.startTime && maintenanceWindow.endTime) {
          try {
            const startTimeUTC = new Date(
              maintenanceWindow.startTime
            ).getTime();
            const endTimeUTC = new Date(maintenanceWindow.endTime).getTime();
            const nowUTC = Date.now();
            if (isNaN(startTimeUTC) || isNaN(endTimeUTC)) {
              const errorData = {
                startTime: maintenanceWindow.startTime,
                endTime: maintenanceWindow.endTime,
                mode: "SCHEDULED",
                reason: "Invalid date format - not a valid ISO 8601 string",
              };

              console.warn(
                "MAINTENANCE CONFIG ERROR: Invalid times - falling back to DISABLED",
                errorData
              );
              isMaintenanceActive = false;
            } else {
              isMaintenanceActive =
                nowUTC >= startTimeUTC && nowUTC <= endTimeUTC;
              console.log("Maintenance SCHEDULED mode check:", {
                currentTime: new Date(nowUTC).toISOString(),
                startTime: new Date(startTimeUTC).toISOString(),
                endTime: new Date(endTimeUTC).toISOString(),
                isActive: isMaintenanceActive,
                timeUntilStart:
                  startTimeUTC > nowUTC
                    ? `${Math.round((startTimeUTC - nowUTC) / 60000)} minutes`
                    : "Started",
                timeUntilEnd:
                  endTimeUTC > nowUTC
                    ? `${Math.round((endTimeUTC - nowUTC) / 60000)} minutes`
                    : "Ended",
              });
            }
          } catch (error) {
            console.error(
              "MAINTENANCE ERROR: Exception in SCHEDULED mode check:",
              error
            );

            isMaintenanceActive = false;
          }
        } else {
          console.warn(
            "MAINTENANCE CONFIG ERROR: Missing startTime or endTime for SCHEDULED mode - falling back to DISABLED",
            {
              hasStartTime: !!maintenanceWindow.startTime,
              hasEndTime: !!maintenanceWindow.endTime,
              mode: maintenanceWindow.mode,
            }
          );
          isMaintenanceActive = false;
        }
        break;
      default:
        isMaintenanceActive = true;
    }

    if (!isMaintenanceActive) {
      setShowBanner(false);
      setShowMaintenancePage(false);
      if (blockingState.wasBlocked) {
        if (navigationRef.current) {
          navigationRef.current.reset({
            index: 0,
            routes: [{ name: "Splash", params: { isLogout: true } }],
          });
        }
        setBlockingState({
          isBlocking: false,
          wasBlocked: false,
          blockingConfig: null,
          blockingTimestamp: null,
        });
      }
      return;
    }

    if (
      bannerConfig &&
      bannerConfig.enabled &&
      (!pageConfig || !pageConfig.enabled) &&
      blockingState.wasBlocked
    ) {
      setBlockingState({
        isBlocking: false,
        wasBlocked: false,
        blockingConfig: null,
        blockingTimestamp: null,
      });
    }

    if (pageConfig && pageConfig.enabled) {
      if (blockingState.wasBlocked && blockingState.blockingConfig) {
        setShowMaintenancePage(true);
        setShowBanner(false);
        return;
      }

      if (!isUserLoggedIn) {
        setShowMaintenancePage(true);
      } else if (pageConfig.type === "BLOCK_AND_LOGOUT") {
        performImmediateBlockingCheck();
      } else {
        setShowMaintenancePage(true);
      }
    } else {
      setShowMaintenancePage(false);
    }

    if (bannerConfig && bannerConfig.enabled && isUserLoggedIn) {
      setShowBanner(true);
    } else {
      setShowBanner(false);
    }
  };

  const dismissBanner = () => {
    setShowBanner(false);
  };

  const clearBlockingState = () => {
    setBlockingState({
      isBlocking: false,
      wasBlocked: false,
      blockingConfig: null,
      blockingTimestamp: null,
    });
    setShowMaintenancePage(false);
  };

  const performLogout = async (isBlockingLogout = false) => {
    try {
      if (isBlockingLogout) {
        console.log("STARTING ENHANCED SILENT LOGOUT");

        try {
          const storedSsoToken = await getSsoToken();
          if (storedSsoToken && storedSsoToken.idToken) {
            await logout(config, {
              idToken: storedSsoToken.idToken,
              postLogoutRedirectUrl: config.redirectUrl,
            });
          }
        } catch (auth0Error) {
          console.error(
            "Auth0 logout failed during silent logout:",
            auth0Error
          );
        }

        await Promise.all([
          clearAuthCookies(),
          storeUser({}),
          storeSsoToken({}),
          cleanUserData(),
        ]);

        dispatch(saveUserInfo({}));

        await new Promise((resolve) => setTimeout(resolve, 200));
        setIsUserLoggedIn(false);
        setBlockingState((prev) => ({
          ...prev,
          isBlocking: false,
        }));

        console.log("Enhanced silent logout completed");
      } else {
        console.log("STARTING NORMAL SESSION LOGOUT");

        const storedSsoToken = await getSsoToken();

        if (storedSsoToken && storedSsoToken.idToken) {
          await logout(config, {
            idToken: storedSsoToken.idToken,
            postLogoutRedirectUrl: config.redirectUrl,
          });
        }

        await clearAuthCookies();
        await storeUser({});
        await storeSsoToken({});
        await cleanUserData();
        dispatch(saveUserInfo({}));

        setIsUserLoggedIn(false);
        setShowBanner(false);
        setShowMaintenancePage(false);
        setBlockingState({
          isBlocking: false,
          wasBlocked: false,
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

      try {
        await clearAuthCookies();
        await storeUser({});
        await storeSsoToken({});
        await cleanUserData();
        dispatch(saveUserInfo({}));

        setIsUserLoggedIn(false);

        if (!isBlockingLogout) {
          setShowBanner(false);
          setShowMaintenancePage(false);
          setBlockingState({
            isBlocking: false,
            wasBlocked: false,
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
        refreshConfig: () => RemoteConfigManager.refresh(),
        clearBlockingState,
        isUserLoggedIn,
        blockingState,
      }}
    >
      {children}
    </MaintenanceContext.Provider>
  );
};

export const useMaintenance = () => useContext(MaintenanceContext);
