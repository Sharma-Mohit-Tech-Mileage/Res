import React, { useEffect, useState } from "react";
import { View, Image, StyleSheet, Text,ActivityIndicator, Pressable } from "react-native";
import colors from "../../res/Colors";
import LinearGradient from "react-native-linear-gradient";
import { authorize } from "react-native-app-auth";
import { useDispatch, useSelector } from 'react-redux';
import { ssoLoginAction } from "../../redux/actions/UserAction";
import { storeUser,storeSsoToken } from "../../redux/utils/LocalStorage";
import { PostAuthApiRequest } from "../../network/APIClient";
import { Color, FontFamily, FontSize, Padding, Border } from "../../../GlobalStyles";


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
  const userData = useSelector((state) =>{ 
    //console.log('respose1',JSON.stringify(state.combinedReducers.user))
     if(state.combinedReducers.user && Object.keys(state.combinedReducers.user.userData).length!=0){
     }
    
  });

  const callSSOLoginApi=(request)=>{
    setLoading(true)
    PostAuthApiRequest('/mobile/api/gettoken',request , onSuccess,onError)
  }
 
  const onSuccess=(res)=>{
    setLoading(false)
    console.log('callSSOLoginApi',res)
    if(res){
      let  token = res.jwtToken;
      let userInfo=res.userInfo;
      let user={
       userInfo: userInfo,
       token:token
      }
      
       if(token){
        storeUser(user)
        
       }
     
      navigation.navigate('MyTab', {
        fname: userInfo.firstName,
        lname: userInfo.lastName,
      
      });
    
    }
  }

  const onError=(error)=>{
    console.log(' callSSOLoginApi error',error)
  }

  const onLogin = () => {
    const loginAuth = async () => {
      try {
        const result = await authorize(config);
        const data={idToken:result.idToken}
        setLoading(true)
         //dispatch(ssoLoginAction(data))
         callSSOLoginApi(data)
         storeSsoToken(data)
         
      } catch (error) {
        console.log(error);
      }
    };
    loginAuth();
  }

  useEffect(() => {
    // const loginAuth = async () => {
    //   try {
    //     const result = await authorize(config);
    //     const data={idToken:result.idToken}
    //     setLoading(true)
    //      //dispatch(ssoLoginAction(data))
    //      callSSOLoginApi(data)
    //      storeSsoToken(data)
         
    //   } catch (error) {
    //     console.log(error);
    //   }
    // };
    // loginAuth();
    // navigation.navigate('Terms');
  }, []);


  return  (
    <LinearGradient
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 0 }}
      colors={["rgba(53, 48, 145, 0.78)", "rgba(141, 59, 144, 0.9)"]}
      style={styles.container}
    >
      <View style={styles.splashContainer}>
        {/* Your centered logo */}
        {loading ? <ActivityIndicator size="large" color={'white'}/> :<></>}
        <Image
          resizeMode="contain"
          source={require("../../res/images/Logo.png")}
          style={styles.logo}
        />
      </View>
      <View style={styles.buttonContainer}>
        <Pressable
            style={[styles.buttons, styles.buttonsLayout]}
            onPress={onLogin}
        >
            <Text style={styles.accept}>Login</Text>
        </Pressable>
        <Pressable
            style={[styles.buttons, styles.buttonsLayout]}
            onPress={() => navigation.navigate("Terms")}
        >
            <Text style={styles.accept}>First Time Entry</Text>
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
  buttonContainer: {
    alignItems: 'center'
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
      width: '45%',
      marginTop: 20
  },   
});

export default SplashScreen;
