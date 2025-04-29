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
      hasAccessToken: !!request.accessToken
    });
    PostAuthApiRequest("/mobile/api/gettoken", request, onSuccess, onError);
  };

  const onSuccess = async (res) => {
    setLoading(false);
    
    if (res && res.userInfo) {
      LoginLogger.logSuccessfulLogin(dispatch, logInfo, res.userInfo, {
        hasJwtToken: !!res.jwtToken,
        userHasServices: !!res.custServices
      });
    }
    
    handleLogin(res);
  };

  const handleLogin = async (res) => {
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
      
      if (!isNormalUser) {
        if (res.userInfo.authLevel != "HeadOfHousehold" && userInfo.authLevel == "Admin") {
          setErrorMessage(strings.AdminMsg);
          setTimeout(() => { setModalVisible(true); }, 100);
        } else if (res.userInfo.customerType === "COM") {
          setIsBusiness(true);
          setErrorMessage(strings.BusinessUserMsg);
          setErrorMessage1(" to manage your Sparklight Business services account.");
          setTimeout(() => { setModalVisible(true); }, 500);
        } else if (res.userInfo.acctStatus != "Normal") {
          setTimeout(() => { setDisconnected(true); }, 500);
        } else {
          moveAfterLogin(user);
        }
      } else if (res.userInfo.acctStatus === "Disconnect") {
        setTimeout(() => { setDisconnected(true); }, 500);
      } else if (
        (userInfo.authLevel !== "HeadOfHousehold" && userInfo.authLevel == "Admin") ||
        userInfo.acctStatus !== "Active"
      ) {
        setErrorMessage(strings.AdminMsg);
        setTimeout(() => { setModalVisible(true); }, 100);
      } else if (userInfo.customerType != "Residential") {
        setIsBusiness(true);
        setErrorMessage(strings.BusinessUserMsg);
        setErrorMessage1(" to manage your Sparklight Business services account");
        setTimeout(() => { setModalVisible(true); }, 100);
      } else if (userInfo.authLevel === 'Limited' || userInfo.authLevel === 'Restricted') {
        setErrorMessage(strings.AdminMsg);
        setTimeout(() => { setModalVisible(true); }, 100);
      } else if (userInfo.customerType === 'Business') {
        setErrorMessage(strings.BusinessUserMsg);
        setErrorMessage1(' to view information.');
        setTimeout(() => { setModalVisible(true); }, 100);
      } else if (res.custServices.internet == false) {
        setErrorMessage(strings.nonInternetUserMessage);
        setErrorMessage1(" to manage your service.");
        setTimeout(() => { setModalVisible(true); }, 100);
      } else {
        moveAfterLogin(user);
      }
    } else {
      console.log("[HANDLE_LOGIN] No response received.");
    }
  };

  const moveAfterLogin = (user) => {
    storeUser(user);
    dispatch(saveUserInfo(user));
    if (user.userInfo.mobileTCAcceptanceFlag) {
      navigation.reset({ index: 0, routes: [{ name: "MyTab" }], });
    } else {
      navigation.reset({ index: 0, routes: [{ name: "Terms" }], });
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
            .then(() => {
              storeUser({});
              storeSsoToken({});
              saveUserInfo({});
              cleanUserData();
              if (postLogoutCallback) {
                postLogoutCallback();
              }
            })
            .catch((error) => {
              if (postLogoutCallback) {
                postLogoutCallback();
              }
            });
        }).catch(() => {
          // If we can't get user info, still proceed with logout
          logout(config, {
            idToken: token,
            postLogoutRedirectUrl: config.redirectUrl,
          })
            .then(() => {
              storeUser({});
              storeSsoToken({});
              saveUserInfo({});
              cleanUserData();
              if (postLogoutCallback) {
                postLogoutCallback();
              }
            })
            .catch((error) => {
              if (postLogoutCallback) {
                postLogoutCallback();
              }
            });
        });
      })
      .catch((error) => {
        if (postLogoutCallback) {
          postLogoutCallback();
        }
      });
  };
  
  const onError = (error) => {
    console.log("Error in SSO login API:---------------------------", error);
    setLoading(false);
    setDisconnected(true);
    LoginLogger.logFailedLogin(dispatch, logError, error, loginAttemptInfo);
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
    logoutAction();
  };

  const loginAuth = async () => {
    try {
      const result = await authorize(config);
      const data = {
        idToken: result.idToken,
        accessToken: result.accessToken,
        idTokenGuid: result.authorizeAdditionalParameters.session_state,
        refreshToken: result.refreshToken,
      };
      setLoading(true);
      storeSsoToken(data);
      
      // Log login attempt info
      setLoginAttemptInfo({
        attemptTimestamp: new Date().toISOString(),
        authMethod: "authorize",
        hasIdToken: !!data.idToken,
        hasAccessToken: !!data.accessToken
      });
      
      callSSOLoginApi(data);
    } catch (error) {
      LoginLogger.logFailedLogin(dispatch, logError, {
        message: "Authorization failed",
        code: error?.code || 30801
      }, {
        authMethod: "authorize",
        errorDetails: error?.message
      });
      
      setLoginEnable(true);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const user = await getUser();
        if (user?.refreshToken != null) {
          // Log refresh token attempt
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
        LoginLogger.logFailedLogin(dispatch, logError, {
          message: "Refresh token failed",
          code: error?.code || 30802
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
            toValue:  0,
            duration: 2000,
            easing: Easing.inOut(Easing.exp),
            useNativeDriver: true,
      }).start(({finished}) => {
        /* completion callback */
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
      colors={["rgba(53, 48, 145, 0.78)", "rgba(141, 59, 144, 0.9)"]}
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

      {loading ? <ActivityIndicator style={styles.loadingStyle} size="large" color={"white"} /> : <></>}
      {!loading && isVisible && (
        <Animated.View style={{ marginTop: hp("35%"), opacity: fadeAnim }}>
          <SparkLightLoginButton
            customStyle={styles.SSoBtnContainer}
            onPress={() => {
              loginAuth();
            }}
            buttonText={"Login"}
          >
          </SparkLightLoginButton>
        </Animated.View>
      )}
      {isVisible && (
      <Text style={{ color: "white", alignSelf: "center", marginTop: 45, fontSize: 16, }} >
        {" "}
        {ISUAT ? "UAT" : ""} Version:{VersionCheck.getCurrentVersion()}
      </Text>
      )}

        <Text style={[{position:"absolute",bottom:hp("5%"),FontFamily:FontFamily.openSansRegular,fontSize:14,fontWeight:"400",color:colors.snow_white,alignSelf:"center"}]}>
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
          loginAuth();
        }}
        onClose={() => {
          setDisconnected(false);
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
    width: 320,
    height: 100, // Adjust the logo size as needed
  },
  splashText: {
    marginTop: 20,
    fontSize: 18,
    color: colors.snow_white,
  },
  SSoBtnContainer: {
    borderRadius: 5,
    justifyContent: "center",
    marginHorizontal: wp("10%"),
  },
  SSoBtn: {
    color: colors.darkest_grey,
    fontFamily: FontFamily.openSansRegular,
    textAlign: "center",
    padding: 16,
    fontSize: 16,
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
  buttonContainer: {
    alignItems: "center",
  },
  buttons: {
    backgroundColor: Color.colorWhitesmoke_300,
  },
  buttonsLayout: {
    paddingVertical: Padding.p_base,
    paddingHorizontal: 0,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: Border.br_11xs,
    height: 50,
    width: "45%",
    marginTop: 20,
  },
  alertTitle: {
    color: colors.sparklight_grey,
    fontFamily: FontFamily.openSansRegular,
    fontSize: 22,
    fontWeight: "700",
    marginLeft: 5,
  },
  openBtn: {
    backgroundColor: colors.sparklight_purple_blue,
    justifyContent: "center",
    width: "100%",
    marginTop: 20,
  },
  closeBtn: {
    backgroundColor: colors.backgound_blue,
    justifyContent: "center",
    width: "100%",
    marginTop: 15,
  },
  openPortaltxt: {
    color: colors.snow_white,
    textAlign: "center",
    padding: 8,
    fontSize: 16,
    fontFamily: FontFamily.openSansRegular,
  },
  closeAlertTxt: {
    color: colors.sparklight_purple_blue,
    textAlign: "center",
    padding: 8,
    fontSize: 16,
    fontFamily: FontFamily.openSansRegular,
  },loadingStyle:
  {position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    alignItems: 'center',
    justifyContent: 'center'
  }
});

export default SplashScreen;