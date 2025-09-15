import React, { useEffect, useState, useRef, useCallback } from "react";
import {
  View,
  StyleSheet,
  Text,
  Linking,
  Modal,
  Platform,
  Animated,
  Easing,
  TouchableOpacity,
  Dimensions,
} from "react-native";
import colors from "../../res/Colors";
import LinearGradient from "react-native-linear-gradient";
import { authorize, refresh, logout } from "react-native-app-auth";
import { useDispatch } from "react-redux";
import { saveUserInfo, logInfo } from "../../redux/actions/UserAction";
import {
  storeUser,
  storeSsoToken,
  getSsoToken,
  getUser,
  cleanUserData,
} from "../../redux/utils/LocalStorage";
import { PostAuthApiRequest } from "../../network/APIClient";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import AlertIcon from "../../res/svgIcons/AlertIcon";
import strings from "../../res/Strings";
import { Color, FontFamily } from "../../../GlobalStyles";
import CustomerDisconnectPage from "../common/CustomerDisconnectPage";
import { Env, ISUAT } from "../../network/apis/account/Constants";
import VersionCheck from "react-native-version-check";
import SparkLightLoginButton from "../common/customui/SparkLightLoginButton";
import RenderText from "../common/RenderText";
import moment from "moment";
import LoginLogger from "../../components/utility/LoginLogger";
import LoadingOverlay from "../common/customui/CustomLoading";
import analytics from "@react-native-firebase/analytics";
import { shouldBlockLogin } from "../utility/disconnectHelpers";
import Logo from "../../res/images/SpalshLogo";

const config = {
  issuer: Env.SSO_LOGIN,
  clientId: "sparklight-customer-mobile-app",
  redirectUrl:
    "com.sparklight.customer.app.auth0://sparklight-customer.us.auth0.com/ios/com.sparklight.customer.app/callback",
  scopes: ["openid", "profile", "email", "phone", "address"],
  iosPrefersEphemeralSession: true,
};

// Device size detection (matching business app)
const getDeviceSize = () => {
  const screenHeight = Dimensions.get("window").height;
  if (screenHeight < 550) return "tiny";
  if (screenHeight < 600) return "verySmall";
  if (screenHeight < 700) return "small";
  return "normal";
};

// Animation configuration per device size (matching business app)
const ANIMATION_CONFIG = {
  tiny: { logoStart: 200 },
  verySmall: { logoStart: 250 },
  small: { logoStart: 300 },
  normal: { logoStart: 350 },
};

const SplashScreen = ({ navigation, route }) => {
  const { isLogout } = route?.params?.isLogout
    ? route.params
    : { isLogout: false };

  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  const [authInProgress, setAuthInProgress] = useState(false);
  const authLockRef = useRef(false);
  const [bussinessApp, setIsBusiness] = useState(false);
  const [loginEnable, setLoginEnable] = useState(false);
  const [disconnected, setDisconnected] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [errorMessage1, setErrorMessage1] = useState("");
  const [isMobile, setIsMobile] = useState(false);
  const [loginAttemptInfo, setLoginAttemptInfo] = useState({});
  const [isVisible, setIsVisible] = useState(false);
  const [deviceSize, setDeviceSize] = useState(getDeviceSize());

  // Animation refs (matching business app structure)
  const backgroundFade = useRef(new Animated.Value(0)).current;
  const logoFade = useRef(new Animated.Value(0)).current;
  const logoMovement = useRef(
    new Animated.Value(ANIMATION_CONFIG[deviceSize].logoStart)
  ).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;

  // Dynamic style selector (matching business app)
  const getStyle = (baseStyle) => {
    const sizeStyle = `${baseStyle}_${deviceSize}`;
    return styles[sizeStyle] || styles[baseStyle];
  };

  // Update fadeAnim based on isVisible
  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: isVisible ? 1 : 0,
      duration: 300,
      useNativeDriver: true,
    }).start();
  }, [isVisible, fadeAnim]);

  // Initialize animations and handle refresh
  useEffect(() => {
    startAnimations();

    if (!isLogout) {
      refreshTokenIfAvailable();
    } else {
      setLoginEnable(true);
    }
  }, []);

  // Handle dimension changes
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

  // Start animations (matching business app timing)
  const startAnimations = () => {
    // Parallel fade animations
    Animated.parallel([
      Animated.timing(backgroundFade, {
        toValue: 1,
        duration: 2000,
        useNativeDriver: true,
      }),
      Animated.timing(logoFade, {
        toValue: 1,
        duration: 2000,
        useNativeDriver: true,
      }),
    ]).start();

    // Logo movement animation after delay
    setTimeout(() => {
      Animated.timing(logoMovement, {
        toValue: 0,
        duration: 2000,
        easing: Easing.inOut(Easing.exp),
        useNativeDriver: true,
      }).start(({ finished }) => {
        if (finished) {
          setIsVisible(true);
        }
      });
    }, 1500);
  };

  // Refresh token if available
  const refreshTokenIfAvailable = async () => {
    try {
      const user = await getUser();
      if (!user?.refreshToken) {
        setLoginEnable(true);
        return;
      }

      setLoginAttemptInfo({
        attemptTimestamp: new Date().toISOString(),
        authMethod: "refresh",
        accountNumber: user.userInfo?.accountNumber,
      });

      const result = await refresh(config, {
        refreshToken: user.refreshToken,
      });

      const data = {
        idToken: result.idToken,
        accessToken: result.accessToken,
        idTokenGuid: result.additionalParameters.session_state,
        refreshToken: result.refreshToken,
      };

      setLoading(true);
      storeSsoToken(data);
      callSSOLoginApi(data);
    } catch (error) {
      LoginLogger.logFailedLogin(
        dispatch,
        logInfo,
        {
          message: "Refresh token failed",
          code: 30802,
        },
        {
          authMethod: "refresh",
          errorDetails: error?.message,
        }
      );
      setLoginEnable(true);
    }
  };

  const callSSOLoginApi = useCallback((request) => {
    setLoading(true);
    setLoginAttemptInfo({
      attemptTimestamp: new Date().toISOString(),
      hasIdToken: !!request.idToken,
      hasAccessToken: !!request.accessToken,
    });

    PostAuthApiRequest("/mobile/api/gettoken", request, onSuccess, onError);
  }, []);

  const onSuccess = useCallback(
    async (res) => {
      if (res && res.userInfo) {
        LoginLogger.logSuccessfulLogin(dispatch, logInfo, res.userInfo, {
          hasJwtToken: !!res.jwtToken,
          userHasServices: !!res.custServices,
        });
      }
      handleLogin(res);
    },
    [dispatch]
  );

  const onError = useCallback(
    (error) => {
      console.error("Login API Error:", error);
      setLoading(false);
      setLoginEnable(true);
      if (error.status === 204) {
        setIsMobile(true);
        setErrorMessage(strings.ErrorMsg204);
        setTimeout(() => {
          setModalVisible(true);
        }, 500);
        return;
      }

      LoginLogger.logFailedLogin(
        dispatch,
        logInfo,
        {
          message: "API login failed",
          code: 30803,
        },
        {
          errorDetails: error?.message || "Unknown API error",
        }
      );
    },
    [dispatch, loginAttemptInfo]
  );

  const handleLogin = async (res) => {
    console.log("User data", res);
    if (res) {
      let token = res.jwtToken;
      let userInfo = res.userInfo;
      let user = {
        userInfo: userInfo,
        token: token,
        tokenGuid: res.idTokenGuid,
        refreshToken: res.refreshToken,
      };
      setIsBusiness(false);

      if (
        shouldBlockLogin(userInfo.acctStatus, userInfo.daysSinceDisconnectDate)
      ) {
        setLoading(false);
        setDisconnected(true);
        return;
      }

      if (
        res.userInfo?.authLevel != "HeadOfHousehold" &&
        userInfo?.authLevel == "Admin"
      ) {
        setLoading(false);
        setLoginEnable(true);
        setErrorMessage(strings.AdminMsg);
        setTimeout(() => {
          setModalVisible(true);
        }, 100);
      } else if (res.userInfo.customerType === "COM") {
        setLoading(false);
        setLoginEnable(true);
        setIsBusiness(true);
        setErrorMessage(strings.BusinessUserMsg);
        setErrorMessage1(
          " to manage your Sparklight Business services account."
        );
        setTimeout(() => {
          setModalVisible(true);
        }, 500);
      } else {
        moveAfterLogin(user);
      }
    } else {
      console.log("[HANDLE_LOGIN] No response received.");
      setLoading(false);
      setLoginEnable(true);
    }
  };

  const moveAfterLogin = async (user) => {
    try {
      storeUser(user);
      dispatch(saveUserInfo(user));

      // Analytics tracking
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
      console.error("Error in moveAfterLogin:", error);
      setLoading(false);
      setLoginEnable(true);
    }
  };

  const loginAuth = async () => {
    if (authLockRef.current || authInProgress || loading) {
      console.log("Auth already in progress, ignoring duplicate request");
      return;
    }

    authLockRef.current = true;
    setAuthInProgress(true);
    setLoading(true);
    setLoginEnable(false);

    try {
      console.log("Starting authorization...");
      const result = await authorize(config);
      const data = {
        idToken: result.idToken,
        accessToken: result.accessToken,
        idTokenGuid: result.authorizeAdditionalParameters.session_state,
        refreshToken: result.refreshToken,
      };
      storeSsoToken(data);
      setLoginAttemptInfo({
        attemptTimestamp: new Date().toISOString(),
        authMethod: "authorize",
        hasIdToken: !!data.idToken,
        hasAccessToken: !!data.accessToken,
      });

      callSSOLoginApi(data);
    } catch (error) {
      console.error("Authorization failed:", error);

      LoginLogger.logFailedLogin(
        dispatch,
        logInfo,
        {
          message: "Authorization failed",
          code: 30801,
        },
        {
          authMethod: "authorize",
          errorDetails: error?.message,
        }
      );
      setLoading(false);
      setLoginEnable(true);
    } finally {
      authLockRef.current = false;
      setAuthInProgress(false);
    }
  };

  const logoutAction = (postLogoutCallback) => {
    getSsoToken()
      .then((res) => {
        const token = res.idToken;

        getUser().then((user) => {
          if (user && user.userInfo) {
            LoginLogger.logLogout(dispatch, logInfo, user.userInfo);
          }

          logout(config, {
            idToken: token,
            postLogoutRedirectUrl: config.redirectUrl,
          })
            .then(async () => {
              try {
                await analytics().resetAnalyticsData();
                cleanUserData();
                if (
                  postLogoutCallback &&
                  typeof postLogoutCallback === "function"
                ) {
                  postLogoutCallback();
                }
              } catch (error) {
                console.error("Error during logout cleanup:", error);
                if (
                  postLogoutCallback &&
                  typeof postLogoutCallback === "function"
                ) {
                  postLogoutCallback();
                }
              }
            })
            .catch((error) => {
              console.error("Logout error:", error);
              cleanUserData();
              if (
                postLogoutCallback &&
                typeof postLogoutCallback === "function"
              ) {
                postLogoutCallback();
              }
            });
        });
      })
      .catch((error) => {
        console.error("Error getting SSO token for logout:", error);
        cleanUserData();
        if (postLogoutCallback && typeof postLogoutCallback === "function") {
          postLogoutCallback();
        }
      });
  };

  const handleCloseAlert = () => {
    setModalVisible(false);
    setLoading(false);
    if (isMobile) {
      setIsMobile(false);
      logoutAction();
      setTimeout(() => {
        Linking.openURL("tel:1-877-692-2253");
      }, 500);
      return;
    }
    logoutAction(() => {
      if (bussinessApp) {
        if (Platform.OS === "android") {
          Linking.openURL(
            "https://play.google.com/store/apps/details?id=com.sparklight.customer.business.app&pcampaignid=web_share"
          );
        } else {
          Linking.openURL(
            "https://apps.apple.com/us/app/mysparklight-business/id6478375256"
          );
        }
      } else {
        Linking.openURL(Env.URL);
      }
    });
  };

  const closeModal = () => {
    setModalVisible(false);
    setLoading(false);
    setLoginEnable(true);
    logoutAction();
  };

  const CustomAlertModal = ({
    visible,
    message,
    message2,
    onClose,
    closeModal,
  }) => (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <View style={styles.alertContainer}>
          <View style={{ flexDirection: "row", justifyContent: "center" }}>
            <View style={{ flexDirection: "row", alignItems: "center" }}>
              <AlertIcon />
              <Text style={styles.alertTitle}>{" Access Denied"}</Text>
            </View>
          </View>
          <View
            style={{ backgroundColor: "#F4F4F5", height: 1, marginTop: 10 }}
          />
          <RenderText
            navigation={navigation}
            style={styles.message}
            onTextPress={onClose}
            internalTextStyle={[
              styles.message,
              {
                fontWeight: "600",
                color: colors.sparklight_purple_blue,
                textDecorationLine: "",
              },
            ]}
            splitKey={
              bussinessApp
                ? "download the MySparklight Business mobile app"
                : isMobile
                ? "1-877-692-2253"
                : "log in to your online account"
            }
            instruction={
              message2
                ? `${message} ${
                    bussinessApp
                      ? "download the MySparklight Business mobile app"
                      : "log in to your online account"
                  }${message2}`
                : message
            }
          />
          <TouchableOpacity
            accessibilityRole="button"
            style={styles.closeBtn}
            onPress={closeModal}
          >
            <Text style={styles.closeAlertTxt}>Close</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );

  return (
    <LinearGradient
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 0 }}
      colors={["rgba(53, 48, 145, 1)", "rgba(141, 59, 144, 1)"]}
      style={styles.container}
    >
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

      {loading && (
        <View style={styles.loadingOverlay}>
          <LoadingOverlay loading={loading} isWhite={true} />
        </View>
      )}

      {!loading && !authInProgress && isVisible && (
        <Animated.View
          style={[getStyle("buttonWrapper"), { opacity: fadeAnim }]}
        >
          <SparkLightLoginButton
            onPress={() => {
              if (
                !authLockRef.current &&
                !authInProgress &&
                !loading &&
                loginEnable
              ) {
                loginAuth();
              }
            }}
            buttonText={"Login"}
            disabled={
              authLockRef.current || authInProgress || loading || !loginEnable
            }
          />
        </Animated.View>
      )}

      {isVisible && (
        <Text style={getStyle("version")}>
          {ISUAT ? "UAT" : ""} Version:{VersionCheck.getCurrentVersion()}
        </Text>
      )}

      <Text style={getStyle("copyright")}>
        {`Copyright © ${moment().year()}, Sparklight ®, All Rights Reserved.`}
      </Text>

      <CustomAlertModal
        visible={modalVisible}
        message={errorMessage}
        message2={errorMessage1}
        onClose={handleCloseAlert}
        closeModal={closeModal}
      />

      <CustomerDisconnectPage
        visible={disconnected}
        onLogin={() => {
          setDisconnected(false);
          if (!authLockRef.current && !authInProgress && !loading) {
            loginAuth();
          }
        }}
        onClose={() => {
          setDisconnected(false);
          setLoading(false);
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
  buttonTextFirstTime: {
    fontFamily: FontFamily.openSansRegular,
    fontSize: 16,
    textAlign: "center",
    color: Color.colorGray_100,
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContent: {
    backgroundColor: "white",
    padding: 20,
    borderRadius: 10,
    alignItems: "center",
    marginHorizontal: 20,
  },
  overlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  alertContainer: {
    backgroundColor: "white",
    padding: 20,
    borderRadius: 5,
    alignItems: "center",
    width: "90%",
    alignSelf: "center",
  },
  message: {
    color: colors.darkest_grey,
    fontFamily: FontFamily.openSansRegular,
    fontSize: 14,
    fontWeight: "400",
    lineHeight: 28,
    marginTop: 10,
    paddingLeft: 0,
    paddingRight: 0,
  },
  alertTitle: {
    color: colors.sparklight_grey,
    fontFamily: FontFamily.openSansRegular,
    fontSize: 22,
    fontWeight: "700",
    marginLeft: 5,
  },
  closeBtn: {
    backgroundColor: colors.backgound_blue,
    justifyContent: "center",
    width: "100%",
    marginTop: 15,
  },
  closeAlertTxt: {
    color: colors.sparklight_purple_blue,
    textAlign: "center",
    padding: 8,
    fontSize: 16,
    fontFamily: FontFamily.openSansRegular,
  },
  loadingOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "transparent",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 999,
  },

  // Normal device styles (default)
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
  },
  version: {
    color: "white",
    alignSelf: "center",
    marginTop: hp("5%"),
    fontSize: 16,
  },
  copyright: {
    position: "absolute",
    bottom: hp("5%"),
    fontFamily: FontFamily.openSansRegular,
    fontSize: 14,
    fontWeight: "400",
    color: colors.snow_white,
    alignSelf: "center",
    paddingHorizontal: wp("3%"),
  },

  // Small device styles
  splashContainer_small: {
    marginTop: hp("15%"),
    justifyContent: "center",
    alignItems: "center",
  },
  logo_small: {
    width: 300,
    height: 90,
  },
  buttonWrapper_small: {
    marginTop: hp("20%"),
    paddingHorizontal: wp("10%"),
  },
  version_small: {
    color: "white",
    alignSelf: "center",
    marginTop: hp("4%"),
    fontSize: 16,
  },
  copyright_small: {
    position: "absolute",
    bottom: hp("3%"),
    fontFamily: FontFamily.openSansRegular,
    fontSize: 14,
    fontWeight: "400",
    color: colors.snow_white,
    alignSelf: "center",
    paddingHorizontal: wp("3%"),
  },

  // Very small device styles
  splashContainer_verySmall: {
    marginTop: hp("10%"),
    justifyContent: "center",
    alignItems: "center",
  },
  logo_verySmall: {
    width: 280,
    height: 85,
  },
  buttonWrapper_verySmall: {
    marginTop: hp("18%"),
    paddingHorizontal: wp("10%"),
  },
  version_verySmall: {
    color: "white",
    alignSelf: "center",
    marginTop: hp("3.5%"),
    fontSize: 15,
  },
  copyright_verySmall: {
    position: "absolute",
    bottom: hp("2%"),
    fontFamily: FontFamily.openSansRegular,
    fontSize: 14,
    fontWeight: "400",
    color: colors.snow_white,
    alignSelf: "center",
    paddingHorizontal: wp("3%"),
  },

  // Tiny device styles
  splashContainer_tiny: {
    marginTop: hp("8%"),
    justifyContent: "center",
    alignItems: "center",
  },
  logo_tiny: {
    width: 240,
    height: 75,
  },
  buttonWrapper_tiny: {
    marginTop: hp("15%"),
    paddingHorizontal: wp("10%"),
  },
  version_tiny: {
    color: "white",
    alignSelf: "center",
    marginTop: hp("3%"),
    fontSize: 14,
  },
  copyright_tiny: {
    position: "absolute",
    bottom: hp("1%"),
    fontFamily: FontFamily.openSansRegular,
    fontSize: 12,
    fontWeight: "400",
    color: colors.snow_white,
    alignSelf: "center",
    paddingHorizontal: wp("3%"),
  },
});

export default SplashScreen;