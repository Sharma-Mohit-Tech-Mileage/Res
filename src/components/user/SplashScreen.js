import React, { useEffect, useState, useRef } from "react";
import { View, StyleSheet, Text, ActivityIndicator, Linking, Modal, Platform, Animated, Easing, TouchableOpacity } from "react-native";
import colors from "../../res/Colors";
import LinearGradient from "react-native-linear-gradient";
import { authorize, refresh, logout } from "react-native-app-auth";
import { useDispatch } from "react-redux";
import { saveUserInfo, logError, logInfo, } from "../../redux/actions/UserAction";
import { storeUser, storeSsoToken, getSsoToken, getUser, cleanUserData, } from "../../redux/utils/LocalStorage";
import { PostAuthApiRequest } from "../../network/APIClient";
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from "react-native-responsive-screen";
import AlertIcon from "../../res/svgIcons/AlertIcon";
import strings from "../../res/Strings";
import { Color, Padding, Border, FontFamily } from "../../../GlobalStyles";
import CustomerDisconnectPage from "../common/CustomerDisconnectPage";
import { Env, ISUAT } from "../../network/apis/account/Constants";
import VersionCheck from "react-native-version-check";
import SparkLightLoginButton from "../common/customui/SparkLightLoginButton";
import RenderText from "../common/RenderText";
import moment from "moment";
import LoginLogger from "../../components/utility/LoginLogger";
import LoadingOverlay from "../common/customui/CustomLoading";
import analytics from '@react-native-firebase/analytics';
import { shouldBlockLogin } from "../utility/disconnectHelpers";

const config = {
  issuer: Env.SSO_LOGIN,
  clientId: "sparklight-customer-mobile-app",
  redirectUrl: "com.sparklight.customer.app.auth0://sparklight-customer.us.auth0.com/ios/com.sparklight.customer.app/callback",
  scopes: ["openid", "profile", "email", "phone", "address"],
  iosPrefersEphemeralSession: true,
};

const SplashScreen = ({ navigation, route }) => {
  const { isLogout } = route?.params?.isLogout ? route.params : { isLogout: false };

  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  const [authInProgress, setAuthInProgress] = useState(false);
  const authLockRef = useRef(false); // 🟢 IMPROVED: Synchronous lock
  const [bussinessApp, setIsBusiness] = useState(false);
  const [loginEnable, setLoginEnable] = useState(false);
  const [disconnected, setDisconnected] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [errorMessage1, setErrorMessage1] = useState("");
  const backgroundFade = useRef(new Animated.Value(0)).current;
  const logoFade = useRef(new Animated.Value(0)).current;
  const logoMovement = useRef(new Animated.Value(350)).current;
  const [isVisible, setIsVisible] = useState(false)
  const fadeAnim = useRef(new Animated.Value(0)).current;
  
  const [loginAttemptInfo, setLoginAttemptInfo] = useState({});

  const callSSOLoginApi = (request) => {
    setLoading(true);
    setLoginAttemptInfo({
      attemptTimestamp: new Date().toISOString(),
      hasIdToken: !!request.idToken,
      hasAccessToken: !!request.accessToken,
    });
    
    PostAuthApiRequest("/mobile/api/gettoken", request, onSuccess, onError);
  };

  const onSuccess = async (res) => {
    // 🟢 DON'T set loading to false here - keep it until navigation or error
    // setLoading(false);  // ❌ Removed this line
    
    if (res && res.userInfo) {
      LoginLogger.logSuccessfulLogin(dispatch, logInfo, res.userInfo, {
        hasJwtToken: !!res.jwtToken,
        userHasServices: !!res.custServices
      });
    }
    
    handleLogin(res);
  };

  const onError = (error) => {
    console.error('Login API Error:', error);
    setLoading(false);
    setLoginEnable(true);
    
    LoginLogger.logFailedLogin(dispatch, logInfo, {
      message: "API login failed",
      code: 30803
    }, {
      errorDetails: error?.message || 'Unknown API error'
    });
  };

  const handleLogin = async (res) => {
    console.log('User data',res)
    if (res) {
      let token = res.jwtToken;
      let userInfo = res.userInfo;
      let user = {
        userInfo: userInfo,
        token: token,
        tokenGuid: res.idTokenGuid,
        refreshToken: res.refreshToken,
      };

      let isNormalUser = userInfo && userInfo.accountNumber && userInfo.accountNumber.toString().length === 9 ? true : false;
      user['isNormalUser'] = isNormalUser;
      setIsBusiness(false);

      if (shouldBlockLogin(userInfo.acctStatus, userInfo.daysSinceDisconnectDate)) {
        setLoading(false); // 🟢 Set loading false for disconnect modal
        setDisconnected(true);
        return;
      }
      
      if (!isNormalUser) {
        if (res.userInfo?.authLevel != "HeadOfHousehold" && userInfo?.authLevel == "Admin") {
          setLoading(false); // 🟢 Set loading false for error modal
          setLoginEnable(true); // 🟢 Re-enable login for modal cases
          setErrorMessage(strings.AdminMsg);
          setTimeout(() => { setModalVisible(true); }, 100);
        } else if (res.userInfo.customerType === "COM") {
          setLoading(false); // 🟢 Set loading false for business modal
          setLoginEnable(true); // 🟢 Re-enable login for modal cases
          setIsBusiness(true);
          setErrorMessage(strings.BusinessUserMsg);
          setErrorMessage1(" to manage your Sparklight Business services account.");
          setTimeout(() => { setModalVisible(true); }, 500);
        } else {
          // 🟢 Keep loading true, navigation will happen
          moveAfterLogin(user);
        }
      } else if (
        (userInfo?.authLevel !== "HeadOfHousehold" && userInfo?.authLevel == "Admin") ||
        userInfo.acctStatus !== "Active"
      ) {
        setLoading(false); // 🟢 Set loading false for error modal
        setLoginEnable(true); // 🟢 Re-enable login for modal cases
        setErrorMessage(strings.AdminMsg);
        setTimeout(() => { setModalVisible(true); }, 100);
      } else if (userInfo.customerType != "Residential") {
        setLoading(false); // 🟢 Set loading false for business modal
        setLoginEnable(true); // 🟢 Re-enable login for modal cases
        setIsBusiness(true);
        setErrorMessage(strings.BusinessUserMsg);
        setErrorMessage1(" to manage your Sparklight Business services account");
        setTimeout(() => { setModalVisible(true); }, 100);
      } else if (userInfo.authLevel === 'Limited' || userInfo.authLevel === 'Restricted') {
        setLoading(false); // 🟢 Set loading false for error modal
        setLoginEnable(true); // 🟢 Re-enable login for modal cases
        setErrorMessage(strings.AdminMsg);
        setTimeout(() => { setModalVisible(true); }, 100);
      } else if (userInfo.customerType === 'Business') {
        setLoading(false); // 🟢 Set loading false for business modal
        setLoginEnable(true); // 🟢 Re-enable login for modal cases
        setErrorMessage(strings.BusinessUserMsg);
        setErrorMessage1(' to view information.');
        setTimeout(() => { setModalVisible(true); }, 100);
      } else if (res.custServices.internet == false) {
        setLoading(false); // 🟢 Set loading false for error modal
        setLoginEnable(true); // 🟢 Re-enable login for modal cases
        setErrorMessage(strings.nonInternetUserMessage);
        setErrorMessage1(" to manage your service.");
        setTimeout(() => { setModalVisible(true); }, 100);
      } else {
        // 🟢 Keep loading true, navigation will happen
        moveAfterLogin(user);
      }
    } else {
      console.log("[HANDLE_LOGIN] No response received.");
      setLoading(false); // 🟢 Set loading false for no response
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
        await analytics().setUserProperty('Sparklight_user_id', user.userInfo.userName.toString());
        await analytics().logEvent('login', {
          Sparklight_user_id: user.userInfo.userName.toString()
        });
      }
      
      // 🟢 Navigation will replace this screen, so keep loading true
      // Don't set setLoading(false) here
      
      // Navigation
      if (user.userInfo.mobileTCAcceptanceFlag) {
        navigation.reset({ index: 0, routes: [{ name: "MyTab" }] });
      } else {
        navigation.reset({ index: 0, routes: [{ name: "Terms" }] });
      }
    } catch (error) {
      console.error('Error in moveAfterLogin:', error);
      setLoading(false); // 🟢 Only set loading false on error
      setLoginEnable(true);
    }
  };

  const CustomAlertModal = ({
    visible,
    message,
    message2,
    onClose,
    closeModal,
  }) => {
    return (
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
                <View style={{marginTop:5}}>
                  <AlertIcon />
                </View>
                
                <Text style={styles.alertTitle}>{" Access Denied"}</Text>
              </View>
            </View>
            <View
              style={{ backgroundColor: "#F4F4F5", height: 1, marginTop: 10 }}
            />
            <RenderText
              navigation={navigation}
              style={styles.message}
              onTextPress={() => {
                onClose();
              }}
              internalTextStyle={[styles.message, { fontWeight: '600', color: colors.sparklight_purple_blue, textDecorationLine: '', }]}
              splitKey={bussinessApp ? "download the MySparklight Business mobile app" : "log in to your online account"}
              instruction={ message2? `${message} ${bussinessApp ? "download the MySparklight Business mobile app" : "log in to your online account"}${message2}`:message}
            />
             
            
            <TouchableOpacity accessibilityRole="button" style={[styles.closeBtn,{marginTop:20}]} onPress={closeModal}>
              <Text style={styles.closeAlertTxt}>Close</Text>
            </TouchableOpacity>
           
               

          </View>
        </View>
      </Modal>
    );
  };

  const handleCloseAlert = () => {
    setModalVisible(false);
    setLoading(false); // 🟢 Reset loading when closing modal
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
    setLoading(false); // 🟢 Reset loading when closing modal
    setLoginEnable(true); // 🟢 Re-enable login button
    logoutAction();
  };

  // 🟢 IMPROVED: Synchronous race condition protection
  const loginAuth = async () => {
    // Synchronous check - prevents all race conditions
    if (authLockRef.current || authInProgress || loading) {
      console.log('Auth already in progress, ignoring duplicate request');
      return;
    }
    
    // Immediately set synchronous lock
    authLockRef.current = true;
    setAuthInProgress(true);
    setLoading(true);
    setLoginEnable(false);
    
    try {
      console.log('Starting authorization...');
      const result = await authorize(config);
      
      const data = {
        idToken: result.idToken,
        accessToken: result.accessToken,
        idTokenGuid: result.authorizeAdditionalParameters.session_state,
        refreshToken: result.refreshToken,
      };
      
      storeSsoToken(data);
      
      // Log successful auth attempt
      setLoginAttemptInfo({
        attemptTimestamp: new Date().toISOString(),
        authMethod: "authorize",
        hasIdToken: !!data.idToken,
        hasAccessToken: !!data.accessToken
      });
      
      callSSOLoginApi(data);
      
    } catch (error) {
      console.error('Authorization failed:', error);
      
      LoginLogger.logFailedLogin(dispatch, logInfo, {
        message: "Authorization failed",
        code: 30801
      }, {
        authMethod: "authorize",
        errorDetails: error?.message
      });
      
      // Reset states on error
      setLoading(false);
      setLoginEnable(true);
    } finally {
      // Always reset both locks
      authLockRef.current = false;
      setAuthInProgress(false);
    }
  };

  const logoutAction = (postLogoutCallback) => {
    getSsoToken()
      .then((res) => {
        const token = res.idToken;
        
        getUser().then(user => {
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
                if (postLogoutCallback && typeof postLogoutCallback === 'function') {
                  postLogoutCallback();
                }
              } catch (error) {
                console.error('Error during logout cleanup:', error);
                if (postLogoutCallback && typeof postLogoutCallback === 'function') {
                  postLogoutCallback();
                }
              }
            })
            .catch((error) => {
              console.error('Logout error:', error);
              cleanUserData();
              if (postLogoutCallback && typeof postLogoutCallback === 'function') {
                postLogoutCallback();
              }
            });
        });
      })
      .catch((error) => {
        console.error('Error getting SSO token for logout:', error);
        cleanUserData();
        if (postLogoutCallback && typeof postLogoutCallback === 'function') {
          postLogoutCallback();
        }
      });
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const user = await getUser();
        if (user?.refreshToken != null) {
          setLoginAttemptInfo({
            attemptTimestamp: new Date().toISOString(),
            authMethod: "refresh",
            accountNumber: user.userInfo?.accountNumber
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
        } else {
          setLoginEnable(true);
        }
      } catch (error) {
        // Log refresh token failure
        LoginLogger.logFailedLogin(dispatch, logInfo, {
          message: "Refresh token failed",
          code: 30802
        }, {
          authMethod: "refresh",
          errorDetails: error?.message
        });
        
        setLoginEnable(true);
      }
    };
    
    if (!isLogout) {
      fetchData();
    } else {
      setLoginEnable(true);
    }

    // Animation setup
    Animated.timing(backgroundFade, {
      toValue: 1,
      duration: 2000,
      useNativeDriver: true,
    }).start();
    
    Animated.timing(logoFade, {
      toValue: 1,
      duration: 2000,
      useNativeDriver: true,
    }).start();
    
    setTimeout(() => {
      Animated.timing(logoMovement, {
        toValue: 0,
        duration: 2000,
        easing: Easing.inOut(Easing.exp),
        useNativeDriver: true,
      }).start(({finished}) => {
        if(finished){
          setIsVisible(true)
        }
      });
    }, 1500);

  }, []);

  useEffect(() => {
    if (isVisible) {
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }).start();
    } else {
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }).start();
    }
  }, [isVisible]);

  return (
    <LinearGradient
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 0 }}
      colors={["rgba(53, 48, 145, 1)", "rgba(141, 59, 144, 1)"]}
      style={styles.container}
    >
      <View style={styles.splashContainer}>
        <Animated.View style={{
          flex: 1,
          alignItems: 'center',
          justifyContent: 'center',
          opacity: backgroundFade
        }}>
          <Animated.Image
            resizeMode="contain"
            source={require("../../res/images/Logo.png")}
            style={[styles.logo, {
              opacity: logoFade,
              transform: [{ translateY: logoMovement }]
            }]}
            accessibilityRole="image"
            accessibilityLabel="SparkLight"
            accessible={true}
          />
        </Animated.View>
      </View>

      {loading ? <LoadingOverlay loading={loading} isWhite={true}/> : <></>}
      
      {/* 🟢 IMPROVED: Better button state management with synchronous protection */}
      {!loading && !authInProgress && isVisible && (
        <Animated.View style={{ marginTop: hp("35%"), opacity: fadeAnim }}>
          <SparkLightLoginButton
            customStyle={styles.SSoBtnContainer}
            onPress={() => {
              // Triple-check with synchronous ref
              if (!authLockRef.current && !authInProgress && !loading && loginEnable) {
                loginAuth();
              }
            }}
            buttonText={"Login"}
            disabled={authLockRef.current || authInProgress || loading || !loginEnable} // 🟢 Include sync lock
          />
        </Animated.View>
      )}
      
      {isVisible && (
        <Text style={{ color: "white", alignSelf: "center", marginTop: 45, fontSize: 16, }} >
          {" "}
          {ISUAT ? "UAT" : ""} Version:{VersionCheck.getCurrentVersion()}
        </Text>
      )}

      <Text style={[{
        position:"absolute",
        bottom:hp("5%"),
        FontFamily:FontFamily.openSansRegular,
        fontSize:14,
        fontWeight:"400",
        color:colors.snow_white,
        alignSelf:"center"
      }]}>
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
          setLoading(false); // 🟢 Reset loading when closing disconnect modal
          setLoginEnable(true); // 🟢 Re-enable login button
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
  splashContainer: {
    marginTop: hp("20%"),
    justifyContent: "center",
    alignItems: "center",
  },
  logo: {
    width: wp("60%"),
    height: hp("20%"),
  },
  SSoBtnContainer: {
    marginHorizontal: wp("10%"),
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 10,
    alignItems: 'center',
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
    marginBottom: 20,
  },
  closeButton: {
    position: "absolute",
    top: 10,
    right: 10,
    padding: 5,
  },
  closeText: {
    fontSize: 18,
    fontWeight: "bold",
    color: "black",
    fontFamily: FontFamily.openSansRegular,
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
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 10,
    textAlign: 'center',
  },
  alertDescription: {
    fontSize: 16,
    marginTop: 10,
    textAlign: 'center',
    lineHeight: 22,
  },
  closeBtn: {
    backgroundColor: colors.backgound_blue,
    paddingHorizontal: 30,
    paddingVertical: 10,
    width: "100%",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 5,
  },
  closeAlertTxt: {
    color: colors.sparklight_purple_blue,
    fontWeight:'400',
    fontFamily: FontFamily.openSansRegular,
    textAlign: "center",
    fontSize: 16,
  },
});

export default SplashScreen;