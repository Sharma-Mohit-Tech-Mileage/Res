import React, { useEffect, useState } from "react";
import { View, StyleSheet, Text, ActivityIndicator, Pressable, Dimensions, } from "react-native";
import WebView from "react-native-webview";
import { Color, FontFamily, FontSize, Padding, Border, } from "../../../GlobalStyles";
import ProfileSettingsHeader from "../common/ProfileSettingsHeader";
import { useSelector, useDispatch } from "react-redux";
import { getSsoToken, cleanUserData, storeSsoToken, storeUser, } from "../../redux/utils/LocalStorage";
import { clearAuthCookies } from "../utility/NativeCookieManager";
import { updateTermsAndConditions, fetchSMSSelection, fetchPushNotifications, } from "../../redux/actions/ProfileActionSuite";
import { logout } from "react-native-app-auth";
import { saveUserInfo } from "../../redux/actions/UserAction";
import { updateWalkThroughStep } from "../../redux/actions/DashboardAction";
//import { Env } from "../../network/apis/account/Constants";
import Config from "react-native-config";
import NavigationUtils from "./NavigationUtils";
const config = { issuer: Config.SSO_LOGIN, iosPrefersEphemeralSession: true };

const { width, height } = Dimensions.get("window");

const Terms = ({ navigation }) => {
  const [loading, setLoading] = useState(true);
  const [progress, setProgress] = useState(0);
  const [isError, setIsError] = useState(false);
  const dispatch = useDispatch();

  const userData = useSelector((state) => state.user.userData);
  const profile = useSelector((state) => state.profile || {});
  const accountNumber = userData?.userInfo?.accountNumber || "";
  const url =
    "https://www.sparklight.com/legal/mobile-app-terms-and-conditions";

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 10000);
    const fetchData = async () => {
      try {
        await Promise.all([
          dispatch(fetchPushNotifications()),
          dispatch(fetchSMSSelection()),
        ]);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching data:", error);
        setLoading(false);
      }
    };

    fetchData();

    return () => clearTimeout(timer);
  }, [dispatch]);

  const termsAccepted = async () => {
    await dispatch(updateTermsAndConditions(true, null));
    await dispatch(updateWalkThroughStep(0));

    await NavigationUtils.navigateToNext(
      navigation,
      "Terms",
      profile,
      accountNumber
    );
  };

  const termsCanceled = () => {
    let re = getSsoToken().then((res) => {
      let token = res.idToken;
      logout(config, {
        idToken: token,
        postLogoutRedirectUrl:
          "com.sparklight.customer.app.auth0://sparklight-customer.us.auth0.com/ios/com.sparklight.customer.app/callback",
      }).then(async (result) => {
        await clearAuthCookies();
        storeUser({});
        storeSsoToken({});
        saveUserInfo({});
        cleanUserData();
        navigation.reset({
          index: 0,
          routes: [{ name: "Splash" }],
        });
      });
    });
  };

  return (
    <View style={styles.container}>
      <ProfileSettingsHeader showIcon={false} title={"Terms"} />
      {progress < 1 && (
        <View style={{ ...styles.progressBar }}>
          <View style={{ ...styles.progress, width: `${progress * 100}%` }} />
        </View>
      )}
      <WebView
        key={url}
        source={{ uri: url }}
        onLoadProgress={({ nativeEvent }) => setProgress(nativeEvent.progress)}
        onError={(e) => {
          setIsError(true);
          console.error("WebView error: ", e.nativeEvent);
        }}
      />
      {isError && (
        <View style={[styles.errorContainer, { marginTop: "23%" }]}>
          <Text style={styles.errorText}>
            Failed to load. Please try again later.
          </Text>
        </View>
      )}
      <View style={styles.bottomBar}>
        <View style={styles.buttonsParent} accessibilityLabel="Buttons Section">
          <Pressable
            style={[styles.buttonDecline, styles.buttonsLayout]}
            onPress={termsCanceled}
            //accessibilityLabel="Decline Button"
            accessibilityHint="Decline Terms and Conditions"
            accessibilityRole="button"
          >
            <Text style={styles.decline}>Decline</Text>
          </Pressable>
          {loading ? (
            <View style={[styles.buttons, styles.buttonsLayout]}>
              <ActivityIndicator size="small" color={"white"} />
            </View>
          ) : (
            <Pressable
              style={[styles.buttons, styles.buttonsLayout]}
              onPress={termsAccepted}
              accessibilityRole="button"
              accessibilityLabel="Accept terms and conditions"
              accessibilityHint="tap to accept the terms and conditions"
            >
              <Text style={styles.accept}>Accept</Text>
            </Pressable>
          )}
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  progressBar: {
    height: height * 0.004, // 0.4% of screen height
    backgroundColor: "lightgrey",
  },
  progress: {
    height: "100%",
    backgroundColor: "rgba(141, 59, 144, 1)",
  },
  errorContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: width * 0.05, // 5% of screen width
  },
  errorText: {
    fontSize: width * 0.04, // 4% of screen width
    marginBottom: height * 0.02, // 2% of screen height
  },
  bottomBar: {
    height: 150,
    backgroundColor: "#FFF",
    borderTopColor: "#CCC",
    borderTopWidth: 1,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#171717",
    shadowOffset: { width: -2, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
  },
  buttonDecline: {
    backgroundColor: Color.colorWhitesmoke_300,
  },
  buttons: {
    backgroundColor: Color.colorMidnightblue,
  },
  buttonsLayout: {
    paddingVertical: Padding.p_base,
    paddingHorizontal: 0,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: Border.br_11xs,
    minHeight: 50,
    width: "45%",
  },
  buttonsParent: {
    justifyContent: "space-between",
    flexDirection: "row",
    width: "90%",
  },
  accept: {
    fontSize: FontSize.size_base,
    fontFamily: FontFamily.openSansRegular,
    textAlign: "center",
    color: Color.sparklightWhite,
  },
  decline: {
    fontSize: FontSize.size_base,
    fontFamily: FontFamily.openSansRegular,
    color: Color.colorMidnightblue,
    textAlign: "center",
  },
  container: {
    flex: 1,
  },
});

export default Terms;
