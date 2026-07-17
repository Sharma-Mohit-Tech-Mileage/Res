import React, { useEffect, useState, useRef } from "react";
import { View, StyleSheet, Text, ActivityIndicator, Dimensions, Platform, } from "react-native";
import WebView from "react-native-webview";
import { Color, FontFamily, FontSize, Padding, Border, } from "../../../GlobalStyles";
import ProfileSettingsHeader from "../common/ProfileSettingsHeader";
import Touchable from "../common/customui/Touchable";
import { useSelector, useDispatch } from "react-redux";
import { getSsoToken, cleanUserData, storeSsoToken, storeUser, } from "../../redux/utils/LocalStorage";
import { clearAuthCookies } from "../utility/NativeCookieManager";
import { updateTermsAndConditions, saveSMSSelection, savePushNotifications, } from "../../redux/actions/ProfileActionSuite";
import { fetchSmsSubscription, fetchPushNotifications } from "../../network/apis/account/profile.service";
import { logout } from "react-native-app-auth";
import { saveUserInfo } from "../../redux/actions/UserAction";
import { updateWalkThroughStep } from "../../redux/actions/DashboardAction";
import Config from "react-native-config";
import NavigationUtils from "./NavigationUtils";
const config = { issuer: Config.SSO_LOGIN, iosPrefersEphemeralSession: true };

const { width, height } = Dimensions.get("window");

const Terms = ({ navigation }) => {
  const [loading, setLoading] = useState(true);
  const [progress, setProgress] = useState(0);
  const [isError, setIsError] = useState(false);
  const fetchDoneRef = useRef(false);
  const fetchPromiseRef = useRef(null);
  const dataRef = useRef({ push: null, sms: null });
  const dispatch = useDispatch();

  const userData = useSelector((state) => state.user.userData);
  const profile = useSelector((state) => state.profile || {});
  const accountNumber = userData?.userInfo?.accountNumber || "";
  const url =
    "https://www.sparklight.com/legal/mobile-app-terms-and-conditions";

  // fetch push/SMS via the services directly — awaiting the saga dispatch resolves before the data lands in redux
  const runFetch = () => {
    const promise = (async () => {
      // const [pushRes, smsRes] = await Promise.allSettled([
      //   fetchPushNotifications(),
      //   fetchSmsSubscription(),
      // ]);
      // if (pushRes.status === "fulfilled") {
      //   dataRef.current.push = pushRes.value;
      //   dispatch(savePushNotifications(pushRes.value));
      // }
      // if (smsRes.status === "fulfilled") {
      //   dataRef.current.sms = smsRes.value;
      //   dispatch(saveSMSSelection(smsRes.value));
      // }
      // fetchDoneRef.current =
      //   pushRes.status === "fulfilled" && smsRes.status === "fulfilled";
      return fetchDoneRef.current;
    })();
    fetchPromiseRef.current = promise;
    return promise;
  };

  useEffect(() => {
    // failsafe so a hung request can't lock the Accept button forever
    const timer = setTimeout(() => setLoading(false), 10000);
    runFetch().finally(() => setLoading(false));

    return () => clearTimeout(timer);
  }, [dispatch]);

  const termsAccepted = async () => {
    await dispatch(updateTermsAndConditions(true, null));
    await dispatch(updateWalkThroughStep(0));

    // never route on data that hasn't arrived — wait for the in-flight fetch, retry once if it failed
    if (!fetchDoneRef.current) {
      setLoading(true);
      await fetchPromiseRef.current;
      if (!fetchDoneRef.current) await runFetch();
      setLoading(false);
    }

    const profileForNav = {
      ...profile,
      ...(dataRef.current.push != null && { pushNotifications: dataRef.current.push }),
      ...(dataRef.current.sms != null && { smsSubscription: dataRef.current.sms }),
    };

    await NavigationUtils.navigateToNext(
      navigation,
      "Terms",
      profileForNav,
      accountNumber
    );
  };

  const termsCanceled = () => {
    let re = getSsoToken().then((res) => {
      let token = res.idToken;
      logout(config, {
        idToken: token,
        postLogoutRedirectUrl: Platform.OS === "ios" ? Config.SSO_REDIRECT_URL_IOS : Config.SSO_REDIRECT_URL_ANDROID,
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
          console.warn("WebView error: ", e.nativeEvent);
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
          <Touchable
            style={[styles.buttonDecline, styles.buttonsLayout]}
            onPress={termsCanceled}
            accessibilityHint="Decline Terms and Conditions"
          >
            <Text style={styles.decline}>Decline</Text>
          </Touchable>
          {loading ? (
            <View style={[styles.buttons, styles.buttonsLayout]}>
              <ActivityIndicator size="small" color={"white"} />
            </View>
          ) : (
            <Touchable
              style={[styles.buttons, styles.buttonsLayout]}
              onPress={termsAccepted}
              accessibilityLabel="Accept terms and conditions"
              accessibilityHint="tap to accept the terms and conditions"
            >
              <Text style={styles.accept}>Accept</Text>
            </Touchable>
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
    backgroundColor: Color.sparklightPrimaryPurple + "1A",
  },
  buttons: {
    backgroundColor: Color.sparklightPrimaryPurple,
  },
  buttonsLayout: {
    paddingVertical: Padding.p_base,
    paddingHorizontal: 0,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 25,
    minHeight: 50,
    width: '45%',
  },
  buttonsParent: {
    justifyContent: 'space-between',
    flexDirection: 'row',
    width: '90%',
  },
  accept: {
    fontSize: FontSize.size_base,
    fontFamily: FontFamily.RadioCanadaBold,
    fontWeight: "700",
    textAlign: "center",
    color: Color.sparklightWhite,
  },
  decline: {
    fontSize: FontSize.size_base,
    fontFamily: FontFamily.RadioCanadaBold,
    fontWeight: "700",
    color: Color.sparklightPrimaryPurple,
    textAlign: "center",
  },
  container: {
    flex: 1,
  },
});

export default Terms;
