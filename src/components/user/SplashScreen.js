import React, { useEffect, useState } from "react";
import { View, Image, StyleSheet, Text } from "react-native";
import colors from "../../res/Colors";
import UserNavigations from "../../navigations/UserNavigations";
import LinearGradient from "react-native-linear-gradient";
import jwt_decode from "jwt-decode";
import { authorize } from "react-native-app-auth";

const config = {
  issuer: "https://login.uat.cableone.net/auth/realms/external-sso-realm",
  clientId: "sparklight-customer-mobile-app",
  redirectUrl:
    "com.sparklight.customer.app.auth0://sparklight-customer.us.auth0.com/ios/com.sparklight.customer.app/callback",
  scopes: ["openid", "profile", "email", "phone", "address"],
  iosPrefersEphemeralSession: false,
//   additionalParameters: { prompt: "login" },
};

const SplashScreen = ({ navigation }) => {
  const [isSplashReady, setIsSplashReady] = useState(false);
  const [data, setData] = useState(undefined);

  useEffect(() => {
    // Simulate a delay for the splash screen
    const loginAuth = async () => {
      try {
        const result = await authorize(config);
        // result includes accessToken, accessTokenExpirationDate and refreshToken
        console.log("result", result);
        var decoded = jwt_decode(result.idToken);
        console.log("data", decoded);
        if (result.accessToken) {
          //setIsSplashReady(true);
          navigation.navigate('Home', {
            email: decoded.email,
            name: decoded.name,
          });
        }
        setData(decoded);
      } catch (error) {
        console.log(error);
      }
    };
    loginAuth();
    // setTimeout(() => {

    //   setIsSplashReady(true);

    // }, 3000); // Adjust the duration as needed
  }, []);

  return  (isSplashReady) ? (
    <UserNavigations data={data} />
  ) : (
    <LinearGradient
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 0 }}
      colors={["rgba(53, 48, 145, 0.78)", "rgba(141, 59, 144, 0.9)"]}
      style={styles.container}
    >
      <View style={styles.splashContainer}>
        {/* Your centered logo */}
        <Image
          resizeMode="contain"
          source={require("../../res/images/Logo.png")}
          style={styles.logo}
        />
      </View>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.splash_bg,
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
});

export default SplashScreen;
