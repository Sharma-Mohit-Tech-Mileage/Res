import React, { useEffect, useState } from "react";
import { View, Image, StyleSheet, Text } from "react-native";
import colors from "../../res/Colors";
import LinearGradient from "react-native-linear-gradient";
import { authorize } from "react-native-app-auth";
import { useDispatch, useSelector } from 'react-redux';
import { ssoLoginAction } from "../../redux/actions/UserAction";


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
  const [isSplashReady, setIsSplashReady] = useState(false);
  const [data, setData] = useState(undefined);
  const userData = useSelector((state) =>{ 
    //console.log('respose1',JSON.stringify(state.combinedReducers.user))
     if(state.combinedReducers.user && Object.keys(state.combinedReducers.user.userData).length!=0){
      
      let  token = state.combinedReducers.user.userData.jwtToken;
      let userInfo=state.combinedReducers.user.userData.userInfo
      console.log('token',token)
      console.log('user info',userInfo)
      navigation.navigate('MyTab', {
        fname: userInfo.firstName,
        lname: userInfo.lastName,
      
      });
    }
    
  });

  useEffect(()=>{
   
  },[userData])
  

  useEffect(() => {
   
    // Simulate a delay for the splash screen
    const loginAuth = async () => {
      try {
        const result = await authorize(config);
        // result includes accessToken, accessTokenExpirationDate and refreshToken
        //console.log("result", result);
        const data={idToken:result.idToken}
        
         dispatch(ssoLoginAction(data))
         //callAPI(data)
        //
        
        if (result.accessToken) {
          //setIsSplashReady(true);
          
        }
        //setData(decoded);
      } catch (error) {
        console.log(error);
      }
    };
    loginAuth();
    // setTimeout(() => {

    //   setIsSplashReady(true);

    // }, 3000); // Adjust the duration as needed
  }, []);

  const callAPI=(data)=>{
    fetch('https://customer.uat.cableone.net/apiWrapper/mobile/api/gettoken', {
  method: 'POST',
  headers: {
    Accept: 'application/json',
    'Content-Type': 'application/json'
  },
  body: JSON.stringify(
  data
  )
}).then((response) => response.json())
.then((json) => {console.log(json)})
.catch((error) => console.error(error));
  }

  return  (
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
