import React, { useEffect, useState } from "react";
import {View,Image,StyleSheet, Text, ActivityIndicator, Linking, TouchableOpacity, Modal, Platform, } from "react-native";
import colors from "../../res/Colors";
import LinearGradient from "react-native-linear-gradient";
import { authorize, refresh, logout } from "react-native-app-auth";
import { useDispatch } from "react-redux";
import { saveUserInfo, logError, logInfo, } from "../../redux/actions/UserAction"; 
import { storeUser, storeSsoToken, getSsoToken, getUser, cleanUserData, } from "../../redux/utils/LocalStorage";
import { PostAuthApiRequest } from "../../network/APIClient";
import { widthPercentageToDP as wp, heightPercentageToDP as hp, } from "react-native-responsive-screen";
import AlertIcon from "../../res/svgIcons/AlertIcon";
import DeviceInfo from "react-native-device-info";
import strings from "../../res/Strings";
import { Color, Padding, Border, FontFamily } from "../../../GlobalStyles";
import CustomerDisconnectPage from "../common/CustomerDisconnectPage";
import { Env, ISUAT } from "../../network/apis/account/Constants";
import VersionCheck from "react-native-version-check";

const config = {
  issuer: Env.SSO_LOGIN,
  clientId: "sparklight-customer-mobile-app",
  redirectUrl:"com.sparklight.customer.app.auth0://sparklight-customer.us.auth0.com/ios/com.sparklight.customer.app/callback",
  scopes: ["openid", "profile", "email", "phone", "address"],
  iosPrefersEphemeralSession: true,
};

const SplashScreen = ({ navigation }) => {
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  const [bussinessApp, setIsBusiness] = useState(false);
  const [loginEnable, setLoginEnable] = useState(false);
  const [disconnected, setDisconnected] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [errorMessage1, setErrorMessage1] = useState("");

  const callSSOLoginApi = (request) => {
    setLoading(true);
    PostAuthApiRequest("/mobile/api/gettoken", request, onSuccess, onError);
  };

  const onSuccess = async (res) => {
    setLoading(false);
    handleLogin(res);
    dispatch(
      logInfo({
        host: DeviceInfo.getSystemName(),
        application: "Sparklight Residential Mobile App",
        className: "AuthenticationService",
        methodName: "callSSOLoginApi",
        messageDate: new Date().toISOString().split("T")[0],
        errorCode: 0,
        message: "Successful SSO Login",
      })
    );
  };

  const handleLogin = async (res) => {
    if (res) {
      console.log("[HANDLE_LOGIN] Received response:***********************************************************************", res.jwtToken);
  
      let token = res.jwtToken;
      let userInfo = res.userInfo;
      let user = {
        userInfo: userInfo,
        token: token,
        tokenGuid: res.idTokenGuid,
        refreshToken: res.refreshToken,
      };
  
      console.log("[HANDLE_LOGIN] Parsed user info:", JSON.stringify(user));
  
      // Check if the user is a normal residential user
      let isNormalUser =
        userInfo &&
        userInfo.accountNumber &&
        userInfo.accountNumber.toString().length === 9
          ? true
          : false;
      console.log("[HANDLE_LOGIN] Is normal user:", isNormalUser);
      user['isNormalUser'] = isNormalUser;
      setIsBusiness(false);
  
      if (!isNormalUser) {
        console.log("[HANDLE_LOGIN] User is not a normal residential user.");
        if (res.userInfo.authLevel != "HeadOfHousehold") {
          console.log("[HANDLE_LOGIN] User is not HeadOfHousehold.");
          setErrorMessage(strings.nonAdminUserMsg);
          setErrorMessage1(" to view information.");
          setTimeout(() => {
            setModalVisible(true);
          }, 100);
        } else if (res.userInfo.customerType === "COM") {
          console.log("[HANDLE_LOGIN] User is a Business user.");
          setIsBusiness(true);
          setErrorMessage(strings.BusinessUserMsg);
          setErrorMessage1(" to manage your Sparklight Business services account.");
          setTimeout(() => {
            setModalVisible(true);
          }, 500);
        } else if (res.userInfo.acctStatus != "Normal") {
          console.log("[HANDLE_LOGIN] User account status is not Normal:", res.userInfo.acctStatus);
          setTimeout(() => {
            setDisconnected(true);
          }, 500);
        } else {
          console.log("[HANDLE_LOGIN] Normal user, proceeding to move after login.");
          moveAfterLogin(user);
        }
      } else if (res.userInfo.acctStatus === "Disconnect") {
        console.log("[HANDLE_LOGIN] User account is disconnected.");
        setTimeout(() => {
          setDisconnected(true);
        }, 500);
      } else if (
        (userInfo.authLevel !== "HeadOfHousehold" && userInfo.authLevel !== "Admin") ||
        userInfo.acctStatus !== "Active"
      ) {
        console.log(
          "[HANDLE_LOGIN] User does not have the required auth level or account is not active.",
          "Auth Level:", userInfo.authLevel,
          "Account Status:", userInfo.acctStatus
        );
        setErrorMessage(strings.nonAdminUserMsg);
        setErrorMessage1(" to view information.");
        setTimeout(() => {
          setModalVisible(true);
        }, 100);
      } else if (userInfo.customerType != "Residential") {
        console.log("[HANDLE_LOGIN] User is not Residential, customer type:", userInfo.customerType);
        setIsBusiness(true);
        setErrorMessage(strings.BusinessUserMsg);
        setErrorMessage1(" to manage your Sparklight Business services account");
        setTimeout(() => {
          setModalVisible(true);
        }, 100);
      } else if (userInfo.authLevel === 'Limited' || userInfo.authLevel === 'Restricted') {
        console.log("[HANDLE_LOGIN] User has Limited or Restricted auth level:", userInfo.authLevel);
        setErrorMessage(strings.nonAdminUserMsg);
        setErrorMessage1(' to view information.');
        setTimeout(() => {
          setModalVisible(true);
        }, 100);
      } else if (userInfo.customerType === 'Business') {
        console.log("[HANDLE_LOGIN] User is a Business user.");
        setErrorMessage(strings.BusinessUserMsg);
        setErrorMessage1(' to view information.');
        setTimeout(() => {
          setModalVisible(true);
        }, 100);
      } else if (res.custServices.internet == false) {
        console.log("[HANDLE_LOGIN] User does not have internet service.");
        setErrorMessage(strings.nonInternetUserMessage);
        setErrorMessage1(" to manage your service.");
        setTimeout(() => {
          setModalVisible(true);
        }, 100);
      } else {
        console.log("[HANDLE_LOGIN] All checks passed, proceeding to move after login.");
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
      navigation.reset({
        index: 0,
        routes: [{ name: "MyTab" }],
      });
    } else {
      navigation.reset({
        index: 0,
        routes: [{ name: "Terms" }],
      });
    }
  };

  const logoutAction = (postLogoutCallback) => {
    getSsoToken()
      .then((res) => {
        const token = res.idToken;
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
            console.error("Logout error:", error);
            if (postLogoutCallback) {
              postLogoutCallback();
            }
          });
      })
      .catch((error) => {
        console.error("Error getting SSO token:", error);
        if (postLogoutCallback) {
          postLogoutCallback();
        }
      });
  };
  const onError = (error) => {
    setLoading(false);
    setDisconnected(true);
    dispatch(
      logError({
        host: DeviceInfo.getSystemName(),
        application: "Sparklight Residential Mobile App",
        className: "AuthenticationService",
        methodName: "callSSOLoginApi",
        errorDate: new Date().toISOString().split("T")[0],
        errorData: error,
        errorCode: 30800,
      })
    );
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
              instruction={`${message} ${bussinessApp ? "download the MySparklight Business mobile app" : "log in to your online account"}${message2}`}
            />
            {/* <Text style={styles.message}>{message}{" "}
              <Text style={[styles.message, { fontWeight: '600', color: colors.sparklight_purple_blue, textDecorationLine: 'underline', }]} onPress={onClose}>
                {bussinessApp ? "download the MySparklight Business mobile app" : "login to your online account"}
              </Text>
              {message2}
            </Text> */}
            <TouchableOpacity style={styles.closeBtn} onPress={closeModal}>
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
      callSSOLoginApi(data);
    } catch (error) {
      setLoginEnable(true);
      console.log(error);
      setLoginEnable(true);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const user = await getUser();
        if (user?.refreshToken != null) {
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
        setLoginEnable(true);
        console.error("Error fetching data", error);
      }
    };

    fetchData();
  }, []);


  return (
    <LinearGradient
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 0 }}
      colors={["rgba(53, 48, 145, 0.78)", "rgba(141, 59, 144, 0.9)"]}
      style={styles.container}
    >
      <View style={styles.splashContainer}>
        {loading ? <ActivityIndicator size="large" color={"white"} /> : <></>}
        <Image
          resizeMode="contain"
          source={require("../../res/images/Logo.png")}
          style={styles.logo}
        />
      </View>
      {!loading && loginEnable && (
        <>
          <TouchableOpacity
            style={[styles.SSoBtnContainer, { marginTop: hp("35%") }]}
            onPress={() => {
              loginAuth();
            }}
          >
            <Text style={styles.SSoBtn}>{"Login"}</Text>
          </TouchableOpacity>
        </>
      )}
      <Text
        style={{
          color: "white",
          alignSelf: "center",
          marginTop: 45,
          fontSize: 16,
        }}
      >
        {" "}
        {ISUAT ? "UAT" : ""} Version:{VersionCheck.getCurrentVersion()}
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
    backgroundColor: colors.sparklight_yellow,
    borderRadius: 5,
    justifyContent: "center",
    marginTop: hp("25%"),
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
  },
});

export default SplashScreen;
