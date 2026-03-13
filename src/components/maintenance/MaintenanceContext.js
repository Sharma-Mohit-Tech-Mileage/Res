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
import { Env } from "../../network/apis/account/Constants";
import { navigationRef } from "../../navigations/UserNavigations";
import { clearAuthCookies } from "../utility/NativeCookieManager";

const config = {
  issuer: Env.SSO_LOGIN,
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
  const [currentUserAudience, setCurrentUserAudience] = useState(null);

  // Enhanced blocking state management
  const [blockingState, setBlockingState] = useState({
    isBlocking: false,
    wasBlocked: false,
    blockedAudience: null,
    blockingConfig: null,
    blockingTimestamp: null,
  });

  const userData = useSelector((state) => state.user?.userData);
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

  const performImmediateBlockingCheck = (userAudience) => {
    const { pageConfig } = maintenanceConfig;

    if (!pageConfig || !pageConfig.enabled) {
      return;
    }

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
      const audience = getUserAudience(userData.userInfo);
      setCurrentUserAudience(audience);

      performImmediateBlockingCheck(audience);
    } else {
      checkLoginStatus();
    }
  }, [userData]);

  useEffect(() => {
    determineMaintenanceState();
  }, [maintenanceConfig, isUserLoggedIn, currentUserAudience, blockingState]);

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
          console.log(
            "SESSION LOGOUT TRIGGERED for audience:",
            currentUserAudience
          );
          await performLogout(false);
        }
      }
    };

    handleSessionInvalidation();
  }, [maintenanceConfig.sessionConfig, isUserLoggedIn, currentUserAudience]);

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
        blockedAudience: null,
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
        const shouldShowForNotLoggedIn = pageConfig.audience === "BOTH";
        setShowMaintenancePage(shouldShowForNotLoggedIn);
      } else {
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
        await Promise.all([
          clearAuthCookies(),
          storeUser({}),
          storeUser(null),
          storeSsoToken({}),
          storeSsoToken(null),
          cleanUserData(),
        ]);

        dispatch(saveUserInfo({}));

        await new Promise((resolve) => setTimeout(resolve, 200));
        setIsUserLoggedIn(false);
        setCurrentUserAudience(null);
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

      try {
        await clearAuthCookies();
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
        refreshConfig: () => RemoteConfigManager.refresh(),
        clearBlockingState,
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
