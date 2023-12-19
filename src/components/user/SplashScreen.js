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
import { authorize } from "react-native-app-auth";
import { useDispatch, useSelector } from "react-redux";
import { ssoLoginAction, saveUserInfo } from "../../redux/actions/UserAction";
import { storeUser, storeSsoToken } from "../../redux/utils/LocalStorage";
import { PostAuthApiRequest } from "../../network/APIClient";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import RNExitApp from "react-native-exit-app";
import AlertIcon from "../../res/svgIcons/AlertIcon";
import CloseIcon from "../../res/svgIcons/CloseIcon";
import strings from "../../res/Strings";
import { Color, Padding, Border, FontFamily } from "../../../GlobalStyles";

const config = {
  issuer: "https://login.uat.cableone.net/auth/realms/external-sso-realm",
  clientId: "sparklight-customer-mobile-app",
  redirectUrl:
    "com.sparklight.customer.app.auth0://sparklight-customer.us.auth0.com/ios/com.sparklight.customer.app/callback",
  scopes: ["openid", "profile", "email", "phone", "address"],
  iosPrefersEphemeralSession: false,
  additionalParameters: { prompt: "login" },
};


const SplashScreen = ({ navigation }) => {
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const callSSOLoginApi = (request) => {
    setLoading(true);
    PostAuthApiRequest("/mobile/api/gettoken", request, onSuccess, onError);
  };
  //HeadOfHousehold
  const onSuccess = (res) => {
    setLoading(false);
    console.log("callSSOLoginApi", res);
    if (res) {
      let token = res.jwtToken;
      let userInfo = res.userInfo;
      let user = {
        userInfo: userInfo,
        token: token,
      };

      if (token) {
        storeUser(user);
      }

      dispatch(saveUserInfo(user));

      // if (userInfo.accountNumber === "900690538") {
      //   navigation.navigate("Terms");
      // } else {
      //   navigation.navigate("MyTab", {
      //     fname: userInfo.firstName,
      //     lname: userInfo.lastName,
      //   });
      // }

      if (userInfo.accountNumber === "900690538") {
        setErrorMessage(strings.nonAdminUserMsg);
        setTimeout(() => {
          setModalVisible(true);
        }, 100);
      } else if (userInfo.accountNumber === "902862879") {
        setErrorMessage(strings.nonInternetUserMessage);
        setTimeout(() => {
          setModalVisible(true);
        }, 100);
      } else {
        navigation.navigate("MyTab", {
          fname: userInfo.firstName,
          lname: userInfo.lastName,
        });
      }
    }
  };

  const onError = (error) => {
    console.log(" callSSOLoginApi error", error);
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
                style={{
                  color: colors.snow_white,
                  textAlign: "center",
                  padding: 8,
                  fontSize: 16,
                }}
              >
                Open Portal
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.closeBtn}
              onPress={onClose}
            >
              <Text
                style={{
                  color: colors.sparklight_purple_blue,
                  textAlign: "center",
                  padding: 8,
                  fontSize: 16,
                }}
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
      const data = { idToken: result.idToken };
      setLoading(true);
      //dispatch(ssoLoginAction(data))
      callSSOLoginApi(data);
      storeSsoToken(data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {}, []);

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

      <TouchableOpacity
        style={styles.SSoBtnContainer}
        onPress={() => {
          loginAuth();
        }}
      >
        <Text style={styles.SSoBtn}>Login</Text>
      </TouchableOpacity>
      <CustomAlertModal
        visible={modalVisible}
        message={errorMessage}
        onClose={handleCloseAlert}
      />

      <View style={styles.buttonContainer}>
        <Pressable
          style={[styles.buttons, styles.buttonsLayout]}
          onPress={() => navigation.navigate("Terms")}
        >
            <Text style={styles.buttonTextFirstTime}>First Time Flow</Text>
        </Pressable> 
      </View>        
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
    marginTop: 250,
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
  },
  message: {
    color: colors.darkest_grey,
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
  }
});

export default SplashScreen;
