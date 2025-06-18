import React, { createContext, useContext, useState, useEffect } from "react";
import remoteConfig from "@react-native-firebase/remote-config";
import { Alert, AppState } from "react-native";
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

  // 🔧 NEW: Enhanced blocking state management
  const [blockingState, setBlockingState] = useState({
    isBlocking: false, // Currently in blocking mode
    wasBlocked: false, // Was blocked after login (persists after logout)
    blockedAudience: null, // What audience was blocked
    blockingConfig: null, // Config that caused blocking
    blockingTimestamp: null, // When blocking started
  });

  const userData = useSelector(
    (state) => state.combinedReducers.user?.userData
  );
  const dispatch = useDispatch();

  // 🔧 DEBUG: Add logging to see what's happening
  console.log("🔧 🐛 MaintenanceContext mounted, Redux userData:", userData);
  console.log(
    "🔧 🐛 UserData keys:",
    userData ? Object.keys(userData) : "No userData"
  );
  console.log("🔧 🐛 UserInfo from userData:", userData?.userInfo);
  console.log("🔧 🐛 Current states:", {
    isUserLoggedIn,
    currentUserAudience,
    hasUserData: !!userData,
    hasUserInfo: !!userData?.userInfo,
  });

  // Simple user audience detection using ONLY isNormalUser flag
  function getUserAudience(userInfo) {
    console.log("🔧 getUserAudience called with:", userInfo);

    if (!userInfo) {
      console.log("🔧 No userInfo provided, returning null");
      return null;
    }

    console.log("🔧 isNormalUser value:", userInfo.isNormalUser);

    let isNormalUser = userInfo.isNormalUser;
    if (isNormalUser === undefined && userInfo.accountNumber) {
      const accountLength = userInfo.accountNumber.toString().length;
      isNormalUser = accountLength === 9;
      console.log("🔧 isNormalUser determined from account length:", {
        accountNumber: userInfo.accountNumber,
        accountLength: accountLength,
        isNormalUser: isNormalUser,
      });
    }

    const audience = isNormalUser ? "SV" : "ACP";

    console.log("🔧 🎯 User audience determined:", {
      isNormalUser: isNormalUser,
      audience: audience,
      accountNumber: userInfo.accountNumber,
    });

    return audience;
  }

  // Check if user is logged in by checking local storage
  const checkLoginStatus = async () => {
    try {
      const userData = await getUser();
      const isLoggedIn = !!(userData && userData.userInfo && userData.token);

      console.log("🔧 🔐 Login status check:", {
        hasUserData: !!userData,
        hasUserInfo: !!userData?.userInfo,
        hasToken: !!userData?.token,
        isLoggedIn: isLoggedIn,
      });

      setIsUserLoggedIn(isLoggedIn);

      if (isLoggedIn) {
        const audience = getUserAudience(userData.userInfo);
        setCurrentUserAudience(audience);
        console.log("🔧 🔐 User is logged in as:", audience);
      } else {
        setCurrentUserAudience(null);
        console.log("🔧 🔐 User is not logged in");
      }

      return { isLoggedIn, userData };
    } catch (error) {
      console.error("🔧 🔐 Error checking login status:", error);
      setIsUserLoggedIn(false);
      setCurrentUserAudience(null);
      return { isLoggedIn: false, userData: null };
    }
  };

  // 🔧 NEW: Enhanced immediate blocking check function
  const performImmediateBlockingCheck = (userAudience) => {
    console.log("🔧 👤 ⚡ === IMMEDIATE BLOCKING CHECK ===");
    const { pageConfig } = maintenanceConfig;

    if (!pageConfig || !pageConfig.enabled) {
      console.log("🔧 👤 ⚡ No page config or disabled - no blocking needed");
      return;
    }

    console.log("🔧 👤 ⚡ Checking blocking for user audience:", userAudience);
    console.log("🔧 👤 ⚡ Page config:", {
      type: pageConfig.type,
      audience: pageConfig.audience,
      enabled: pageConfig.enabled,
    });

    // Check time validity
    const now = new Date();
    let isTimeValid = true;

    if (pageConfig.startTime && pageConfig.endTime) {
      try {
        const startTime = new Date(pageConfig.startTime);
        const endTime = new Date(pageConfig.endTime);

        if (isNaN(startTime.getTime()) || isNaN(endTime.getTime())) {
          console.log("🔧 👤 ⚡ ❌ Invalid date format in blocking config");
          isTimeValid = false;
        } else {
          // Same logic: valid if before end time (allows past start time for testing)
          isTimeValid = now <= endTime;
        }
      } catch (error) {
        console.error("🔧 👤 ⚡ ❌ Error parsing blocking times:", error);
        isTimeValid = false;
      }
    }

    console.log("🔧 👤 ⚡ Time check:", {
      currentTime: now.toISOString(),
      isTimeValid: isTimeValid,
    });

    if (!isTimeValid) {
      console.log("🔧 👤 ⚡ Time not valid - no blocking");
      return;
    }

    // Check audience and type
    const isAudienceValid = isAudienceMatch(pageConfig.audience, userAudience);
    const isBlockingType = pageConfig.type === "BLOCK_AND_LOGOUT";

    console.log("🔧 👤 ⚡ Blocking decision:", {
      targetAudience: pageConfig.audience,
      userAudience: userAudience,
      isAudienceValid: isAudienceValid,
      isBlockingType: isBlockingType,
      shouldBlock: isAudienceValid && isBlockingType,
    });

    if (isAudienceValid && isBlockingType) {
      console.log("🔧 👤 ⚡ 🚫 IMMEDIATE BLOCKING TRIGGERED!");

      // 🔧 NEW: Set comprehensive blocking state
      setBlockingState({
        isBlocking: true,
        wasBlocked: true,
        blockedAudience: userAudience,
        blockingConfig: pageConfig,
        blockingTimestamp: now.toISOString(),
      });

      // Set maintenance page visibility immediately
      setShowMaintenancePage(true);

      // Trigger immediate silent data clearing (no delay)
      setTimeout(() => {
        console.log("🔧 👤 ⚡ 🚫 Triggering immediate silent data clearing");
        performLogout(true); // Silent data clearing
      }, 500); // Reduced delay - just enough to show maintenance page // Slightly longer delay for better UX
    }
  };

  // Handle app state changes
  useEffect(() => {
    console.log("🔧 Setting up AppState listener");
    const subscription = AppState.addEventListener("change", (nextAppState) => {
      console.log("🔧 AppState changed to:", nextAppState);
      if (nextAppState === "active") {
        console.log("🔧 App became active, refreshing config and login status");
        fetchMaintenanceConfig();
        checkLoginStatus();
      }
    });

    return () => {
      console.log("🔧 Cleaning up AppState listener");
      subscription.remove();
    };
  }, []);

  // Initial setup
  useEffect(() => {
    console.log("🔧 🚀 Initial maintenance system setup");
    fetchMaintenanceConfig();
    checkLoginStatus();
  }, []);

  // 🔧 ENHANCED: Watch Redux userData changes with immediate blocking
  useEffect(() => {
    console.log("🔧 👤 🐛 Redux userData effect triggered:", {
      hasUserData: !!userData,
      userDataKeys: userData ? Object.keys(userData) : [],
      hasUserInfo: !!userData?.userInfo,
      userInfo: userData?.userInfo,
    });

    if (
      userData &&
      userData.userInfo &&
      Object.keys(userData.userInfo).length > 0
    ) {
      // User just logged in via Redux
      console.log("🔧 👤 ⚡ User logged in via Redux - IMMEDIATE CHECK");
      setIsUserLoggedIn(true);
      const audience = getUserAudience(userData.userInfo);
      setCurrentUserAudience(audience);

      // IMMEDIATE BLOCKING CHECK: Don't wait for other effects
      console.log(
        "🔧 👤 ⚡ Performing IMMEDIATE maintenance check for new login"
      );
      performImmediateBlockingCheck(audience);
    } else {
      // User logged out or no user info
      console.log("🔧 👤 No user info in Redux, checking local storage");
      checkLoginStatus();
    }
  }, [userData]);

  // 🔧 ENHANCED: Determine maintenance state when config or login status changes
  useEffect(() => {
    console.log("🔧 🎯 Determining maintenance state due to changes");
    console.log("🔧 🎯 Current blocking state:", blockingState);
    determineMaintenanceState();
  }, [maintenanceConfig, isUserLoggedIn, currentUserAudience, blockingState]);

  // Session invalidation - only when logged in
  useEffect(() => {
    if (!isUserLoggedIn) {
      console.log(
        "🔧 🚪 User not logged in, skipping session invalidation check"
      );
      return;
    }

    console.log("🔧 🚪 Session invalidation check for logged in user");
    const handleSessionInvalidation = async () => {
      const { sessionConfig } = maintenanceConfig;

      if (!sessionConfig) {
        console.log("🔧 🚪 No session config available");
        return;
      }

      console.log("🔧 🚪 Session config:", sessionConfig);

      if (
        sessionConfig.invalidateSessionsForAudience !== "NONE" &&
        currentUserAudience
      ) {
        const shouldInvalidate = isAudienceMatch(
          sessionConfig.invalidateSessionsForAudience,
          currentUserAudience
        );

        console.log("🔧 🚪 Session invalidation decision:", {
          targetAudience: sessionConfig.invalidateSessionsForAudience,
          currentUserAudience: currentUserAudience,
          shouldInvalidate: shouldInvalidate,
          redirectToSplash: sessionConfig.redirectToSplash,
        });

        if (shouldInvalidate && sessionConfig.redirectToSplash) {
          console.log(
            "🔧 🚪 ⚠️ SESSION LOGOUT TRIGGERED for audience:",
            currentUserAudience
          );
          await performLogout(false); // Regular logout (not blocking)
        }
      }
    };

    handleSessionInvalidation();
  }, [maintenanceConfig.sessionConfig, isUserLoggedIn, currentUserAudience]);

  const fetchMaintenanceConfig = async () => {
    try {
      console.log("🔧 📡 Fetching maintenance config from Firebase...");
      await remoteConfig().reset();
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

      await remoteConfig().reset();
    
    await remoteConfig().setConfigSettings({
      minimumFetchIntervalMillis: 0,
    });
    
    // Rest of your existing code unchanged...
    await remoteConfig().setDefaults({ dev_config: JSON.stringify(defaultConfig) });
    await remoteConfig().fetch(0);
    await remoteConfig().activate();

      const configString = remoteConfig().getValue("dev_config").asString();
      console.log("🔧 📡 Raw config received:", configString);

      const parsedConfig = JSON.parse(configString);
      console.log("🔧 📡 Parsed config:", parsedConfig);

      let finalConfig;
      if (parsedConfig.dev_config) {
        console.log("🔧 📡 Config is nested under dev_config");
        finalConfig = parsedConfig.dev_config;
      } else {
        console.log("🔧 📡 Config is at root level");
        finalConfig = parsedConfig;
      }

      console.log("🔧 📡 Final config structure:", finalConfig);

      setMaintenanceConfig({
        maintenanceWindow: finalConfig.maintenanceWindow,
        bannerConfig: finalConfig.maintenanceBanner,
        pageConfig: finalConfig.maintenancePage,
        sessionConfig: finalConfig.sessionManagement,
      });

      console.log("🔧 📡 ✅ Maintenance config updated:", {
        hasMaintenanceWindow: !!finalConfig.maintenanceWindow,
        maintenanceMode: finalConfig.maintenanceWindow?.mode,
        maintenanceEnabled: finalConfig.maintenanceWindow?.enabled,
        hasBannerConfig: !!finalConfig.maintenanceBanner,
        hasPageConfig: !!finalConfig.maintenancePage,
        hasSessionConfig: !!finalConfig.sessionManagement,
        bannerEnabled: finalConfig.maintenanceBanner?.enabled,
        bannerAudience: finalConfig.maintenanceBanner?.audience,
        pageType: finalConfig.maintenancePage?.type,
        pageAudience: finalConfig.maintenancePage?.audience,
      });
    } catch (error) {
      console.error("🔧 📡 ❌ Error fetching config:", error);
    }
  };

  const determineMaintenanceState = () => {
    console.log("🔧 🎯 === TWO-MODE MAINTENANCE STATE CHECK ===");
    const { maintenanceWindow, bannerConfig, pageConfig, sessionConfig } =
      maintenanceConfig;
    const now = new Date();

    // 🔧 Step 1: Check if maintenance window is active
    let isMaintenanceActive = false;

    if (!maintenanceWindow || !maintenanceWindow.enabled) {
      console.log("🔧 ❌ Maintenance window disabled - all features OFF");
      setShowBanner(false);
      setShowMaintenancePage(false);
      return;
    }

    console.log("🔧 🎯 Maintenance window config:", maintenanceWindow);

    // 🔧 Step 2: Determine if maintenance is active based on mode
    switch (maintenanceWindow.mode) {
      case "IMMEDIATE":
        // IMMEDIATE mode = always active when enabled
        isMaintenanceActive = true;
        console.log(
          "🔧 ⚡ IMMEDIATE MODE - Maintenance active until manually disabled"
        );
        break;

      case "SCHEDULED":
        // SCHEDULED mode = check global time window
        if (maintenanceWindow.startTime && maintenanceWindow.endTime) {
          try {
            const startTime = new Date(maintenanceWindow.startTime);
            const endTime = new Date(maintenanceWindow.endTime);

            if (isNaN(startTime.getTime()) || isNaN(endTime.getTime())) {
              console.log("🔧 📅 ❌ Invalid date format in scheduled window");
              isMaintenanceActive = false;
            } else {
              // Use same flexible logic: active if before end time
              isMaintenanceActive = now <= endTime;

              console.log("🔧 📅 SCHEDULED MODE - Global time window check:", {
                currentTime: now.toISOString(),
                startTime: startTime.toISOString(),
                endTime: endTime.toISOString(),
                isActive: isMaintenanceActive,
                status: isMaintenanceActive
                  ? "WITHIN WINDOW"
                  : "WINDOW EXPIRED",
              });
            }
          } catch (error) {
            console.error(
              "🔧 📅 ❌ Error parsing scheduled window times:",
              error
            );
            isMaintenanceActive = false;
          }
        } else {
          console.log(
            "🔧 📅 ⚠️ SCHEDULED mode but no times specified - defaulting to active"
          );
          isMaintenanceActive = true;
        }
        break;

      default:
        console.log("🔧 ⚠️ Unknown maintenance mode - defaulting to active");
        isMaintenanceActive = true;
    }

    console.log("🔧 🎯 🎪 MAINTENANCE WINDOW STATUS:", isMaintenanceActive);

    // 🔧 Step 3: If maintenance not active, disable everything
    if (!isMaintenanceActive) {
      console.log("🔧 ❌ Maintenance window inactive - disabling all features");
      setShowBanner(false);
      setShowMaintenancePage(false);
      return;
    }

    // 🔧 Step 4: Maintenance is active - check individual features
    console.log(
      "🔧 ✅ Maintenance window ACTIVE - checking individual features..."
    );
    if (
      bannerConfig &&
      bannerConfig.enabled &&
      (!pageConfig || !pageConfig.enabled) &&
      blockingState.wasBlocked
    ) {
      console.log("🔧 Auto-clearing blocking state for banner mode");
      setBlockingState({
        isBlocking: false,
        wasBlocked: false,
        blockedAudience: null,
        blockingConfig: null,
        blockingTimestamp: null,
      });
    }

    // ===== MAINTENANCE PAGE LOGIC (No Individual Time Checks) =====
    if (pageConfig && pageConfig.enabled) {
      console.log("🔧 📄 Maintenance page ENABLED within active window");

      // Handle persistent blocking state first
      if (blockingState.wasBlocked && blockingState.blockingConfig) {
        console.log(
          "🔧 📄 🚫 Persistent blocking state detected - maintaining page"
        );
        setShowMaintenancePage(true);
        setShowBanner(false);
        return;
      }

      // Determine based on login state and audience
      if (!isUserLoggedIn) {
        // Pre-login: Show for "BOTH" audience only
        const shouldShowForNotLoggedIn = pageConfig.audience === "BOTH";
        console.log("🔧 📄 Pre-login decision:", {
          audience: pageConfig.audience,
          shouldShow: shouldShowForNotLoggedIn,
          reason: shouldShowForNotLoggedIn
            ? "BOTH audience = show before login"
            : "Specific audience = wait for login",
        });
        setShowMaintenancePage(shouldShowForNotLoggedIn);
      } else {
        // Post-login: Check audience match
        const isAudienceValid = isAudienceMatch(
          pageConfig.audience,
          currentUserAudience
        );

        console.log("🔧 📄 Post-login decision:", {
          targetAudience: pageConfig.audience,
          userAudience: currentUserAudience,
          isAudienceValid: isAudienceValid,
          pageType: pageConfig.type || "NORMAL",
        });

        if (isAudienceValid && pageConfig.type === "BLOCK_AND_LOGOUT") {
          console.log(
            "🔧 📄 🚫 BLOCK_AND_LOGOUT - triggering immediate blocking"
          );
          performImmediateBlockingCheck(currentUserAudience);
        } else if (isAudienceValid) {
          console.log("🔧 📄 ✅ Showing regular maintenance page");
          setShowMaintenancePage(true);
        } else {
          console.log("🔧 📄 ❌ Audience mismatch - no page");
          setShowMaintenancePage(false);
        }
      }
    } else {
      console.log("🔧 📄 Maintenance page DISABLED");
      setShowMaintenancePage(false);
    }

    // ===== BANNER LOGIC (No Individual Time Checks) =====
    if (bannerConfig && bannerConfig.enabled && isUserLoggedIn) {
      const isAudienceValid = isAudienceMatch(
        bannerConfig.audience,
        currentUserAudience
      );

      console.log("🔧 🎌 Banner decision within active window:", {
        targetAudience: bannerConfig.audience,
        userAudience: currentUserAudience,
        isAudienceValid: isAudienceValid,
      });

      setShowBanner(isAudienceValid);
    } else {
      if (!bannerConfig) {
        console.log("🔧 🎌 No banner config");
      } else if (!bannerConfig.enabled) {
        console.log("🔧 🎌 Banner DISABLED");
      } else if (!isUserLoggedIn) {
        console.log("🔧 🎌 Banner disabled - user not logged in");
      } else if (blockingState.wasBlocked) {
        console.log("🔧 🎌 Banner disabled - user in blocking state");
      }
      setShowBanner(false);
    }

    console.log("🔧 🎯 === FINAL TWO-MODE STATE ===", {
      maintenanceMode: maintenanceWindow?.mode,
      isMaintenanceActive: isMaintenanceActive,
      showMaintenancePage,
      showBanner,
      blockingState: blockingState.wasBlocked,
    });
  };

  const isAudienceMatch = (targetAudience, userAudience) => {
    console.log("🔧 🎯 Audience match check:", {
      targetAudience,
      userAudience,
    });

    if (!userAudience && targetAudience !== "BOTH") {
      console.log("🔧 🎯 No user audience and target is not BOTH");
      return false;
    }

    const isMatch =
      targetAudience === "BOTH" || targetAudience === userAudience;
    console.log("🔧 🎯 Audience match result:", isMatch);

    return isMatch;
  };

  const dismissBanner = () => {
    console.log("🔧 🎌 Banner dismissed by user");
    setShowBanner(false);
  };

  // 🔧 NEW: Function to clear blocking state (for manual override)
  const clearBlockingState = () => {
    console.log("🔧 🚫 Manually clearing blocking state");
    setBlockingState({
      isBlocking: false,
      wasBlocked: false,
      blockedAudience: null,
      blockingConfig: null,
      blockingTimestamp: null,
    });
    setShowMaintenancePage(false);
  };

  // FIXED performLogout function in MaintenanceContext.js
  // Key change: Reset navigation stack during blocking logout

  const performLogout = async (isBlockingLogout = false) => {
    try {
      if (isBlockingLogout) {
        console.log("🔧 🚪 === STARTING ENHANCED SILENT LOGOUT ===");

        // 🔧 THOROUGH STORAGE CLEARING
        await Promise.all([
          storeUser({}),
          storeUser(null), // Double-clear to ensure removal
          storeSsoToken({}),
          storeSsoToken(null), // Double-clear to ensure removal
          cleanUserData(),
        ]);

        dispatch(saveUserInfo({}));

        // 🔧 WAIT FOR ASYNC OPERATIONS TO COMPLETE
        await new Promise((resolve) => setTimeout(resolve, 200));

        // Reset states
        setIsUserLoggedIn(false);
        setCurrentUserAudience(null);
        setBlockingState((prev) => ({
          ...prev,
          isBlocking: false,
        }));

        console.log("🔧 🚪 ✅ Enhanced silent logout completed");
      } else {
        // NORMAL LOGOUT: Keep existing browser-based logout for regular scenarios
        console.log("🔧 🚪 === STARTING NORMAL SESSION LOGOUT ===");

        const storedSsoToken = await getSsoToken();
        console.log("🔧 🚪 SSO Token available:", !!storedSsoToken?.idToken);

        if (storedSsoToken && storedSsoToken.idToken) {
          console.log("🔧 🚪 Performing SSO logout...");
          await logout(config, {
            idToken: storedSsoToken.idToken,
            postLogoutRedirectUrl: config.redirectUrl,
          });
          console.log("🔧 🚪 SSO logout completed");
        }

        console.log("🔧 🚪 Cleaning up storage and Redux...");
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
        console.log("🔧 🚪 Navigating to splash screen...");
        navigationRef.current.reset({
          index: 0,
          routes: [{ name: "Splash", params: { isLogout: true } }],
        });
      }
    } catch (error) {
      console.error("🔧 🚪 ❌ Error during logout:", error);

      // Fallback cleanup (always silent for blocking logout)
      try {
        console.log("🔧 🚪 Attempting fallback cleanup...");
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
        console.log("🔧 🚪 ✅ Fallback cleanup completed");
      } catch (cleanupError) {
        console.error("🔧 🚪 ❌ Fallback cleanup failed:", cleanupError);
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
        clearBlockingState, // 🔧 NEW: Allow manual clearing of blocking state
        // Expose for debugging
        isUserLoggedIn,
        currentUserAudience,
        blockingState, // 🔧 NEW: Expose blocking state
      }}
    >
      {children}
    </MaintenanceContext.Provider>
  );
};

export const useMaintenance = () => useContext(MaintenanceContext);
