import React, { useEffect, useState } from "react";
import {
  View,
  Image,
  StyleSheet,
  Text,
  ActivityIndicator,
  Linking,
  Alert,
  TouchableOpacity,
  Modal,
  Pressable,
} from "react-native";
import colors from "../../res/Colors";
import LinearGradient from "react-native-linear-gradient";
import { authorize, revoke, refresh } from "react-native-app-auth";
import { useDispatch, useSelector } from "react-redux";
import { ssoLoginAction, saveUserInfo } from "../../redux/actions/UserAction";
import { storeUser, storeSsoToken, getSsoToken } from "../../redux/utils/LocalStorage";
import { PostAuthApiRequest,GetApiRequest } from "../../network/APIClient";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import RNExitApp from "react-native-exit-app"
import AlertIcon from "../../res/svgIcons/AlertIcon";
import CloseIcon from "../../res/svgIcons/CloseIcon";
import strings from "../../res/Strings";
import { Color, Padding, Border, FontFamily } from "../../../GlobalStyles";
import { getUser } from "../../redux/utils/LocalStorage";
import { SetRenewTokenTimer, SetClearTimer } from './Session';
import CustomerDisconnectPage from "../common/CustomerDisconnectPage";

const config = {
  issuer: "https://login.uat.cableone.net/auth/realms/external-sso-realm",
  clientId: "sparklight-customer-mobile-app",
  redirectUrl:
    "com.sparklight.customer.app.auth0://sparklight-customer.us.auth0.com/ios/com.sparklight.customer.app/callback",
  scopes: ["openid", "profile", "email", "phone", "address"],
  iosPrefersEphemeralSession: true,
  //additionalParameters: { prompt: "login" },
};


const SplashScreen = ({ navigation }) => {
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  const [loginEnable, setLoginEnable] = useState(true);
  const [disconnected, setDisconnected] = useState(false);
  const [data, setData] = useState({});
  const [modalVisible, setModalVisible] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const callSSOLoginApi = (request) => {
    setLoading(true);
    PostAuthApiRequest("/mobile/api/gettoken", request, onSuccess, onError);
  };
  
  const onSuccess = async (res) => {
    setLoading(false);   
    handleLogin(res)
  };

 const handleLogin = async (res) => {
    if (res) {
      let token = res.jwtToken;
      let userInfo = res.userInfo;
      let user = {
        userInfo: userInfo,
        token: token,
        tokenGuid: res.idTokenGuid,
        refreshToken: res.refreshToken
      };

      if (res.userInfo.acctStatus==='Disconnect'){
        setDisconnected(true)
       } else if (userInfo.authLevel==='Limited') {
          setErrorMessage(strings.nonAdminUserMsg);
          setTimeout(() => {
            setModalVisible(true);
          }, 100);
        } else if (res.custServices.internet==false) {
          setErrorMessage(strings.nonInternetUserMessage);
          setTimeout(() => {
            setModalVisible(true);
          }, 100);
        } else {
          storeUser(user);
          dispatch(saveUserInfo(user));
          SetRenewTokenTimer();

          if (user.userInfo.mobileTCAcceptanceFlag) {
            navigation.navigate("MyTab");
          } else {
            navigation.navigate("Terms");
          }
        }         
    }
  }

  const onError = (error) => {
    console.log(" callSSOLoginApi error", error);
    setLoading(false);
    setDisconnected(true)
  };

  const CustomAlertModal = ({ visible, message, onClose }) => {
    return (
      <Modal
        visible={visible}
        transparent
        animationType="fade"
        onRequestClose={onClose}
      >
        <View style={styles.overlay}>
          <View style={styles.alertContainer}>
            <View
              style={{ flexDirection: "row", justifyContent: "space-between" }}
            >
              <View style={{ flexDirection: "row", alignSelf: "flex-start" }}>
                <AlertIcon />
                <Text
                  style={styles.alertTitle}
                >
                  {" "}
                  Access Denied
                </Text>
              </View>
              
            </View>
            <View
              style={{ backgroundColor: "#F4F4F5", height: 1, marginTop: 10 }}
            />
            <Text style={styles.message}>{message}</Text>
            <TouchableOpacity
              style={styles.openBtn}
              onPress={() => {
                Linking.openURL("https://customer.uat.sparklight.com/SecureLogin/login.aspx");

              }}
            >
              <Text
                style={styles.openPortaltxt}
              >
                Open Portal
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.closeBtn}
              onPress={onClose}
            >
              <Text
                style={styles.closeAlertTxt}
              >
                Close
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    );
  };

  const handleCloseAlert = () => {
    setModalVisible(false);
  };

  const loginAuth = async () => {
    try {
      const result = await authorize(config);

      console.log('loginAuthResult: ', result);

      const data = { 
        idToken: result.idToken,
        accessToken:result.accessToken,
        idTokenGuid: result.authorizeAdditionalParameters.session_state,
        refreshToken: result.refreshToken
      };
      
      setLoading(true);
      //dispatch(ssoLoginAction(data))
      callSSOLoginApi(data);
      storeSsoToken(data);
      setData(result)
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const user = await getUser();
        console.log('SplashScreen getUser: ', user);
  
        if (user !== null 
            && user !== undefined
            && user.refreshToken !== undefined
            && user.refreshToken !== null) {
          const result = await refresh(config, {
            refreshToken: user.refreshToken,
          });

          //console.log('result: ', JSON.stringify(result));

          const data = { 
            idToken: result.idToken,
            accessToken: result.accessToken,
            idTokenGuid: result.additionalParameters.session_state,
            refreshToken: result.refreshToken
          };
    
          setLoading(true);
          callSSOLoginApi(data);
        }
      } catch (error) {
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
        {/* Your centered logo */}
        {loading ? <ActivityIndicator size="large" color={"white"} /> : <></>}
        <Image
          resizeMode="contain"
          source={require("../../res/images/Logo.png")}
          style={styles.logo}
        />
      </View>
      {
        !loading &&
        (
          <>
            <TouchableOpacity
              style={styles.SSoBtnContainer}
              onPress={() => {
                if(loginEnable){
                  setLoginEnable(false)
                   loginAuth();
                   setTimeout(()=>{
                    setLoginEnable(true)
                   },1500)
                }
              }}
            >
              <Text style={styles.SSoBtn}>Login</Text>
            </TouchableOpacity>        
          </>
        )
      }            
      <CustomAlertModal
        visible={modalVisible}
        message={errorMessage}
        onClose={handleCloseAlert}
      />   
      <CustomerDisconnectPage
      visible={disconnected}
      onLogin={()=>{
        setDisconnected(false)
        loginAuth();
      }}
      onClose={()=>{
        setDisconnected(false)
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
    textAlign: 'center',
    color: Color.colorGray_100,
  },  
  splashContainer: {
    marginTop: hp('20%'),
    justifyContent: "center",
    alignItems: "center",
    // Customize your splash screen background color
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
    fontFamily:FontFamily.openSansRegular,
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
    width: "85%",
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
    fontFamily:FontFamily.openSansRegular,
  },
  message: {
    color: colors.darkest_grey,
    fontFamily:FontFamily.openSansRegular,
    fontSize: 14,
    fontWeight: "400",
    lineHeight: 28,
    marginTop: 10,
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
  },alertTitle:
  {
    color: colors.sparklight_grey,
    fontFamily:FontFamily.openSansRegular,
    fontSize: 22,
    fontWeight: "400",
    marginLeft: 5,
  },openBtn:
  {
    backgroundColor: colors.sparklight_purple_blue,
    justifyContent: "center",
    width: "100%",
    marginTop: 20,
  },closeBtn:
  {
    backgroundColor: colors.backgound_blue,
    justifyContent: "center",
    width: "100%",
    marginTop: 15,
  },openPortaltxt:
  {
    color: colors.snow_white,
    textAlign: "center",
    padding: 8,
    fontSize: 16,
    fontFamily:FontFamily.openSansRegular,
  },closeAlertTxt:
  {
    color: colors.sparklight_purple_blue,
    textAlign: "center",
    padding: 8,
    fontSize: 16,
    fontFamily:FontFamily.openSansRegular,
  }
});

export default SplashScreen;

