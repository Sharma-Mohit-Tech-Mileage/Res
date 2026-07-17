import React, { useEffect, useState, useRef, useCallback } from "react";
import { View, StyleSheet, Text, Linking, Platform, Animated, Easing, Dimensions, } from "react-native";
import colors from "../../res/Colors";
import LinearGradient from "react-native-linear-gradient";
import { logout } from "react-native-app-auth";
import { useDispatch } from "react-redux";
import { saveUserInfo } from "../../redux/actions/UserAction";
import { storeUser, storeSsoToken, getSsoToken, getUser, cleanUserData, } from "../../redux/utils/LocalStorage";
import { PostAuthApiRequest } from "../../network/RestApiClient";
import { getEndpoint ,ENDPOINTS} from "../../network/apis/endpoints/Endpoints";
import { widthPercentageToDP as wp, heightPercentageToDP as hp, } from "react-native-responsive-screen";
import { FontFamily } from "../../../GlobalStyles";
import CustomerDisconnectPage from "../common/CustomerDisconnectPage";
import VersionCheck from "react-native-version-check";
import SparkLightLoginButton from "../common/customui/SparkLightLoginButton";
import moment from "moment";
import analytics from "@react-native-firebase/analytics";
import { shouldBlockLogin } from "../utility/disconnectHelpers";
import Logo from "../../res/images/SpalshLogo";
import NetworkManager from "../../utils/NetworkManager";
import AuthenticationManager from "../../utils/AuthenticationManager";
import ErrorModal, { ErrorType } from "../common/ErrorModal";
import LoadingStateIndicator, { LoadingState, } from "../common/LoadingStateIndicator";
import Config from "react-native-config";
import { clearAuthCookies } from "../utility/NativeCookieManager";
import { logDebug, logWarn, logError } from "../../utils/logger";

const config = {
  issuer: Config.SSO_LOGIN,
  clientId: Config.SSO_CLIENT_ID,
  redirectUrl: Platform.OS === "ios" ? Config.SSO_REDIRECT_URL_IOS : Config.SSO_REDIRECT_URL_ANDROID,
  scopes: ["openid", "profile", "email", "phone", "address"],
  iosPrefersEphemeralSession: true,
};

const ANIMATION_DURATION = 2000;
const SESSION_CHECK_TIMEOUT = 10000;

const getDeviceSize = () => {
  const screenHeight = Dimensions.get("window").height;
  if (screenHeight < 550) return "tiny";
  if (screenHeight < 600) return "verySmall";
  if (screenHeight < 700) return "small";
  return "normal";
};

const ANIMATION_CONFIG = {
  tiny: { logoStart: 200 },
  verySmall: { logoStart: 250 },
  small: { logoStart: 300 },
  normal: { logoStart: 350 },
};

const SplashScreen = ({ navigation, route }) => {
  const { isLogout } = route?.params?.isLogout ? route.params : { isLogout: false };

  const dispatch = useDispatch();

  const [loadingState, setLoadingState] = useState(LoadingState.NONE);
  const [errorState, setErrorState] = useState({ visible: false, type: null, message: null, });
  const [authInProgress, setAuthInProgress] = useState(false);
  const authLockRef = useRef(false);
  const ssoIdTokenRef = useRef(null);
  const [loginEnable, setLoginEnable] = useState(false);
  const [disconnected, setDisconnected] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [deviceSize, setDeviceSize] = useState(getDeviceSize());
  const [networkState, setNetworkState] = useState({ isConnected: true, type: "unknown", });
  const [showConnectedBanner, setShowConnectedBanner] = useState(false);

  const networkUnsubscribe = useRef(null);
  const sessionCheckTimeout = useRef(null);
  const wasDisconnected = useRef(false);

  const logoFade = useRef(new Animated.Value(0)).current;
  const logoMovement = useRef( new Animated.Value(ANIMATION_CONFIG[deviceSize].logoStart) ).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;

  const envLabel =
    Config.ENV === "development"
      ? "Dev"
      : Config.ENV === "staging"
      ? "Staging"
      : "";

  const getStyle = (baseStyle) => {
    const sizeStyle = `${baseStyle}_${deviceSize}`;
    return styles[sizeStyle] || styles[baseStyle];
  };

  useEffect(() => {
    const networkManager = NetworkManager.getInstance();

    networkUnsubscribe.current = networkManager.subscribeToNetworkChanges(
      (state) => {
        const wasOffline = !networkState.isConnected;
        setNetworkState(state);
        if (wasOffline && state.isConnected) {
          wasDisconnected.current = false;
          setShowConnectedBanner(true);
          setTimeout(() => {
            setShowConnectedBanner(false);
          }, 3000);

          if (errorState.type === ErrorType.NETWORK_ERROR) {
            setErrorState({ visible: false, type: null, message: null });
          }
        }

        if (!state.isConnected) {
          wasDisconnected.current = true;
        }
      }
    );

    return () => {
      if (networkUnsubscribe.current) {
        networkUnsubscribe.current();
      }
      if (sessionCheckTimeout.current) {
        clearTimeout(sessionCheckTimeout.current);
      }
    };
  }, [errorState.type, networkState.isConnected]);

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: isVisible ? 1 : 0,
      duration: 300,
      useNativeDriver: true,
    }).start();
  }, [isVisible, fadeAnim]);

  useEffect(() => {
    startAnimations();
    if (!isLogout) {
      setTimeout(() => {
        refreshTokenIfAvailable();
      }, 500);
    } else {
      setLoginEnable(true);
    }
  }, []);

  useEffect(() => {
    const updateDimensions = () => {
      const newSize = getDeviceSize();
      setDeviceSize(newSize);
      logoMovement.setValue(ANIMATION_CONFIG[newSize].logoStart);
    };

    const subscription = Dimensions.addEventListener(
      "change",
      updateDimensions
    );
    return () => subscription?.remove();
  }, []);

  const startAnimations = () => {
    Animated.parallel([
      Animated.timing(logoFade, {
        toValue: 1,
        duration: ANIMATION_DURATION,
        useNativeDriver: true,
      }),
    ]).start();

    setTimeout(() => {
      Animated.timing(logoMovement, {
        toValue: 0,
        duration: ANIMATION_DURATION,
        easing: Easing.inOut(Easing.exp),
        useNativeDriver: true,
      }).start(({ finished }) => {
        if (finished) {
          setIsVisible(true);
        }
      });
    }, 500);
  };

  const refreshTokenIfAvailable = async () => {
    try {
      const networkManager = NetworkManager.getInstance();
      const connectivity = await networkManager.checkConnectivity();

      if (
        !connectivity.isConnected ||
        connectivity.isInternetReachable === false
      ) {
        logWarn("SplashScreen", "Refresh token check skipped due to no connectivity");
        setErrorState({
          visible: true,
          type: ErrorType.NETWORK_ERROR,
          message: null,
        });
        setLoginEnable(true);
        return;
      }

      setLoadingState(LoadingState.CHECKING_SESSION);
      sessionCheckTimeout.current = setTimeout(() => {
        setLoadingState(LoadingState.NONE);
        setLoginEnable(true);
        console.warn("Session check timeout");
      }, SESSION_CHECK_TIMEOUT);

      const user = await getUser();

      if (!user?.refreshToken) {
        logDebug("SplashScreen", "No refresh token available; skipping session refresh");
        clearTimeout(sessionCheckTimeout.current);
        setLoadingState(LoadingState.NONE);
        setLoginEnable(true);
        return;
      }

      const result = await AuthenticationManager.refreshWithTimeout(
        config,
        user.refreshToken
      );

      clearTimeout(sessionCheckTimeout.current);

      if (!result.success) {
        logWarn("SplashScreen", "Session refresh failed", result);
        setLoadingState(LoadingState.NONE);
        setLoginEnable(true);
        return;
      }

      const data = {
        idToken: result.data.idToken,
        accessToken: result.data.accessToken,
        idTokenGuid: result.data.additionalParameters?.session_state,
        refreshToken: result.data.refreshToken,
      };

      setLoadingState(LoadingState.LOADING_DATA);
      storeSsoToken(data);
      callSSOLoginApi(data);
    } catch (error) {
      logError("SplashScreen", error);
      clearTimeout(sessionCheckTimeout.current);
      setLoadingState(LoadingState.NONE);
      setLoginEnable(true);
    }
  };

  const callSSOLoginApi = useCallback((request) => {
    setLoadingState(LoadingState.LOADING_DATA);
    // Capture SSO idToken from request so handleLogin can store it in the user object
    ssoIdTokenRef.current = request.idToken || null;
    logDebug("SplashScreen", "Calling SSO login API", {
      endpoint: getEndpoint(ENDPOINTS.LOGIN_SSO_GETTOKEN),
      hasIdToken: Boolean(request.idToken),
    });
    PostAuthApiRequest(getEndpoint(ENDPOINTS.LOGIN_SSO_GETTOKEN), request, onSuccess, onError);
  }, []);

  const onSuccess = useCallback(
    async (res) => {
      logDebug("SplashScreen", "SSO login API succeeded", {
        hasJwtToken: Boolean(res?.jwtToken),
        userName: res?.userInfo?.userName,
      });
      handleLogin(res);
    },
    [dispatch]
  );

  const onError = useCallback(
    (error) => {
      logError("SplashScreen", error);
      logWarn("SplashScreen", "SSO login API failed", {
        status: error?.status,
        message: error?.message,
      });
      setLoadingState(LoadingState.NONE);
      setLoginEnable(true);
      if (error.status === 204) {
        setErrorState({
          visible: true,
          type: ErrorType.API_ERROR_204,
          message:
            null,
        });
        return;
      }

      // Network error
      if (
        error.message?.includes("Network") ||
        error.message?.includes("timeout")
      ) {
        setErrorState({
          visible: true,
          type: ErrorType.NETWORK_ERROR,
          message: null,
        });
        return;
      }

      // Generic API error
      setErrorState({
        visible: true,
        type: ErrorType.API_ERROR,
        message: null,
      });
    },
    [dispatch]
  );

  const handleLogin = async (res) => {
    logDebug("SplashScreen", "Handling login response", {
      userName: res?.userInfo?.userName,
      customerType: res?.userInfo?.customerType,
      authLevel: res?.userInfo?.authLevel,
    });

    if (res) {
      let token = res.jwtToken;
      let userInfo = res.userInfo;
      let user = {
        userInfo: userInfo,
        token: token,
        tokenGuid: res.idTokenGuid,
        refreshToken: res.refreshToken,
        idToken: ssoIdTokenRef.current || null,
        jwtTimestamp: Date.now(),
        idTokenTimestamp: Date.now(),
      };

      // Check for business account first
      if (res.userInfo.customerType === "COM") {
        logWarn("SplashScreen", "Business account login blocked");
        setLoadingState(LoadingState.NONE);
        setLoginEnable(true);
        setErrorState({
          visible: true,
          type: ErrorType.BUSINESS_ACCOUNT,
          message: null,
        });
        return;
      }

      if (
        shouldBlockLogin(userInfo.acctStatus, userInfo.daysSinceDisconnectDate)
      ) {
        logWarn("SplashScreen", "Login blocked due to disconnect status", {
          acctStatus: userInfo.acctStatus,
          daysSinceDisconnectDate: userInfo.daysSinceDisconnectDate,
        });
        setLoadingState(LoadingState.NONE);
        setDisconnected(true);
        return;
      }

      if (
        res.userInfo?.authLevel != "HeadOfHousehold" &&
        userInfo?.authLevel == "Admin"
      ) {
        logWarn("SplashScreen", "Admin permission login blocked");
        setLoadingState(LoadingState.NONE);
        setLoginEnable(true);
        setErrorState({
          visible: true,
          type: ErrorType.ADMIN_PERMISSION,
          message: null,
        });
      } else {
        moveAfterLogin(user);
      }
    } else {
      logWarn("SplashScreen", "Login response was empty");
      setLoadingState(LoadingState.NONE);
      setLoginEnable(true);
    }
  };

  const moveAfterLogin = async (user) => {
    try {
      logDebug("SplashScreen", "Moving user after successful login", {
        userName: user?.userInfo?.userName,
      });
      storeUser(user);
      dispatch(saveUserInfo(user));
      if (user.userInfo && user.userInfo.userName) {
        await analytics().setUserId(user.userInfo.userName.toString());
        await analytics().setUserProperty(
          "Sparklight_user_id",
          user.userInfo.userName.toString()
        );
        await analytics().logEvent("login", {
          Sparklight_user_id: user.userInfo.userName.toString(),
        });
      }

      if (user.userInfo.mobileTCAcceptanceFlag) {
        navigation.reset({ index: 0, routes: [{ name: "MyTab" }] });
      } else {
        navigation.reset({ index: 0, routes: [{ name: "Terms" }] });
      }
    } catch (error) {
      logError("SplashScreen", error);
      logWarn("SplashScreen", "Error in moveAfterLogin");
      setLoadingState(LoadingState.NONE);
      setLoginEnable(true);
      setErrorState({
        visible: true,
        type: ErrorType.UNKNOWN_ERROR,
        message: "Failed to complete login. Please try again.",
      });
    }
  };

  const loginAuth = async () => {
    if (
      authLockRef.current ||
      authInProgress ||
      loadingState !== LoadingState.NONE
    ) {
      return;
    }

    const networkManager = NetworkManager.getInstance();
    const connectivity = await networkManager.checkConnectivity();
    console.log("Connectivity check:", connectivity);
    if (
      !connectivity.isConnected ||
      connectivity.isInternetReachable === false
    ) {
      logWarn("SplashScreen", "Login skipped due to no connectivity");
      setErrorState({
        visible: true,
        type: ErrorType.NETWORK_ERROR,
        message: null,
      });
      return;
    }

    authLockRef.current = true;
    setAuthInProgress(true);
    setLoadingState(LoadingState.OPENING_BROWSER);
    setLoginEnable(false);

    try {
      const result = await AuthenticationManager.authorizeWithTimeout(config);
      logDebug("SplashScreen", "Authorization result", result);
      if (!result.success) {
        if (result.code === "USER_CANCELLED") {
          setLoadingState(LoadingState.NONE);
          setLoginEnable(true);
        } else if (result.code === "AUTH_TIMEOUT") {
          logWarn("SplashScreen", "Login timed out");
          setErrorState({
            visible: true,
            type: ErrorType.AUTH_TIMEOUT,
            message: null,
          });
          setLoadingState(LoadingState.NONE);
          setLoginEnable(true);
        } else if (result.code === "BROWSER_UNAVAILABLE") {
          logWarn("SplashScreen", "Browser unavailable for login");
          setErrorState({
            visible: true,
            type: ErrorType.BROWSER_UNAVAILABLE,
            message: null,
          });
          setLoadingState(LoadingState.NONE);
          setLoginEnable(true);
        } else if (result.code === "NETWORK_ERROR") {
          logWarn("SplashScreen", "Login network error");
          setErrorState({
            visible: true,
            type: ErrorType.NETWORK_ERROR,
            message: null,
          });
          setLoadingState(LoadingState.NONE);
          setLoginEnable(true);
        } else {
          logError("SplashScreen", result.error);
          setErrorState({
            visible: true,
            type: ErrorType.UNKNOWN_ERROR,
            message: result.error,
          });
          setLoadingState(LoadingState.NONE);
          setLoginEnable(true);
        }
        return;
      }

      const data = {
        idToken: result.data.idToken,
        accessToken: result.data.accessToken,
        idTokenGuid: result.data.authorizeAdditionalParameters.session_state,
        refreshToken: result.data.refreshToken,
      };

      storeSsoToken(data);
      setLoadingState(LoadingState.AUTHENTICATING);
      callSSOLoginApi(data);
    } catch (error) {
      logError("SplashScreen", error);
      logWarn("SplashScreen", "Authorization failed");
      setLoadingState(LoadingState.NONE);
      setLoginEnable(true);
      setErrorState({
        visible: true,
        type: ErrorType.UNKNOWN_ERROR,
        message: error.message,
      });
    } finally {
      authLockRef.current = false;
      setAuthInProgress(false);
    }
  };

  const logoutAction = (postLogoutCallback) => {
    getSsoToken()
      .then((res) => {
        const token = res?.idToken;

        getUser().then((user) => {
          if (token) {
            logout(config, {
              idToken: token,
              postLogoutRedirectUrl: config.redirectUrl,
            })
              .then(async () => {
                try {
                  await analytics().resetAnalyticsData();
                  await clearAuthCookies();
                  cleanUserData();
                  if (
                    postLogoutCallback &&
                    typeof postLogoutCallback === "function"
                  ) {
                    postLogoutCallback();
                  }
                } catch (error) {
                  console.warn("Error during logout cleanup:", error);
                  if (
                    postLogoutCallback &&
                    typeof postLogoutCallback === "function"
                  ) {
                    postLogoutCallback();
                  }
                }
              })
              .catch(async (error) => {
                console.warn("Logout error:", error);
                await clearAuthCookies();
                cleanUserData();
                if (
                  postLogoutCallback &&
                  typeof postLogoutCallback === "function"
                ) {
                  postLogoutCallback();
                }
              });
          } else {
            clearAuthCookies();
            cleanUserData();
            if (
              postLogoutCallback &&
              typeof postLogoutCallback === "function"
            ) {
              postLogoutCallback();
            }
          }
        });
      })
      .catch(async (error) => {
        console.warn("Error getting SSO token for logout:", error);
        await clearAuthCookies();
        cleanUserData();
        if (postLogoutCallback && typeof postLogoutCallback === "function") {
          postLogoutCallback();
        }
      });
  };

 const handleErrorAction = (action) => {
  setErrorState({ visible: false, type: null, message: null });

  switch (action) {
    case "RETRY":
      if (
        !authLockRef.current &&
        !authInProgress &&
        loadingState === LoadingState.NONE
      ) {
        loginAuth();
      }
      break;
    case "OPEN_SETTINGS":
      Linking.openSettings();
      break;
    case "CONTACT_SUPPORT":
      Linking.openURL("tel:1-877-692-2253");
      break;
    case "DOWNLOAD_BUSINESS_APP":
      logoutAction(() => {
        const businessAppUrl =
          Platform.OS === "android"
            ? "https://play.google.com/store/apps/details?id=com.sparklight.customer.business.app&pcampaignid=web_share"
            : "https://apps.apple.com/us/app/mysparklight-business/id6478375256";
        Linking.openURL(businessAppUrl);
      });
      break;
    case "CANCEL":
      // Clear authentication session when user cancels
      logoutAction(() => {
        // Reset auth states after logout
        setAuthInProgress(false);
        authLockRef.current = false;
        setLoadingState(LoadingState.NONE);
        setLoginEnable(true);
      });
      break;
    default:
      break;
  }
};

  const NetworkStatusBar = () => {
    const connectedFade = useRef(new Animated.Value(1)).current;

    useEffect(() => {
      if (showConnectedBanner) {
        connectedFade.setValue(1);
        setTimeout(() => {
          Animated.timing(connectedFade, {
            toValue: 0,
            duration: 1000,
            useNativeDriver: true,
          }).start();
        }, 2000);
      }
    }, [showConnectedBanner]);

    if (!networkState.isConnected) {
      return (
        <View style={styles.networkStatusBarBottom}>
          <Text style={styles.networkStatusText}>No Internet Connection</Text>
        </View>
      );
    }

    if (showConnectedBanner) {
      return (
        <Animated.View
          style={[
            styles.networkStatusBarBottomGreen,
            { opacity: connectedFade },
          ]}
        >
          <Text style={styles.networkStatusText}>✓ Connected</Text>
        </Animated.View>
      );
    }

    return null;
  };

  return (
    <LinearGradient
      start={{ x: 0, y: 0 }}
      end={{ x: 1.3, y: 0}}
      colors={["rgba(141, 59, 144, 1))", "rgba(53, 48, 145, 1)"]}
      style={styles.container}
    >
      <NetworkStatusBar />

      <View style={getStyle("splashContainer")}>
        <Animated.View
          style={[
            getStyle("logo"),
            {
              opacity: logoFade,
              transform: [{ translateY: logoMovement }],
            },
          ]}
          accessibilityRole="image"
          accessibilityLabel="SparkLight"
          accessible={true}
        >
          <View style={{ alignSelf: "center", marginTop: hp("5%") }}>
            <Logo width={300} height={84} />
          </View>
        </Animated.View>
      </View>

      {loadingState !== LoadingState.NONE && (
        <LoadingStateIndicator state={loadingState} isWhite={true} />
      )}

      {loadingState === LoadingState.NONE && !authInProgress && isVisible && (
        <Animated.View
          style={[getStyle("buttonWrapper"), { opacity: fadeAnim }]}
        >
          <SparkLightLoginButton
            onPress={() => {
              if (
                !authLockRef.current &&
                !authInProgress &&
                loadingState === LoadingState.NONE &&
                loginEnable
              ) {
                loginAuth();
              }
            }}
          customStyle={{ color: colors.sparklight_bright_purple }}
            buttonText={"Login"}
            disabled={
              authLockRef.current ||
              authInProgress ||
              loadingState !== LoadingState.NONE ||
              !loginEnable ||
              !networkState.isConnected
            }
          />
        </Animated.View>
      )}

      {isVisible && (
        <Text style={getStyle("version")}>
          {envLabel ? `${envLabel} ` : ""}Version: {VersionCheck.getCurrentVersion()}
        </Text>
      )}

      <Text 
      style={getStyle("copyright")}>
        {`©${moment().year()} Cable One, Inc. All rights reserved.`}
      </Text>

      <ErrorModal
        visible={errorState.visible}
        errorType={errorState.type}
        customMessage={errorState.message}
        onAction={handleErrorAction}
      />

      <CustomerDisconnectPage
        visible={disconnected}
        onLogin={() => {
          setDisconnected(false);
          if (
            !authLockRef.current &&
            !authInProgress &&
            loadingState === LoadingState.NONE
          ) {
            loginAuth();
          }
        }}
        onClose={() => {
          setDisconnected(false);
          setLoadingState(LoadingState.NONE);
          setLoginEnable(true);
          logoutAction();
        }}
      />
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.splash_bg,
  },
  networkStatusBarBottom: {
    position: "absolute",
    bottom: hp("12%"),
    left: 0,
    right: 0,
    backgroundColor: colors.sparklight_red,
    paddingVertical: 10,
    zIndex: 999,
  },
  networkStatusBarBottomGreen: {
    position: "absolute",
    bottom: hp("12%"),
    left: 0,
    right: 0,
    backgroundColor: colors.sparklight_green,
    paddingVertical: 10,
    zIndex: 999,
  },
  networkStatusText: {
    color: colors.snow_white,
    textAlign: "center",
    fontSize: 14,
    fontFamily: FontFamily.openSansRegular,
    fontWeight: "600",
  },
  splashContainer: {
    marginTop: hp("20%"),
    justifyContent: "center",
    alignItems: "center",
  },
  logo: {
    width: 320,
    height: 100,
  },
  buttonWrapper: {
    marginTop: hp("25%"),
    paddingHorizontal: wp("10%"),
    maxWidth: 480,
    width: "100%",
    alignSelf: "center",
  },
  version: {
    color: "white",
    alignSelf: "center",
    marginTop: hp("5%"),
    fontSize: 16,
  },
  copyright: {
    position: "absolute",
    bottom: hp("12%"),
    fontFamily: FontFamily.openSansRegular,
    fontSize: 14,
    textAlign: "center",
    fontWeight: "400",
    color: colors.snow_white,
    alignSelf: "center",
    paddingHorizontal: wp("3%"),
  },
});

export default SplashScreen;
