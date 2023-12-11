import React, { useEffect, useState } from "react";
import { View, Image, StyleSheet, Text,ActivityIndicator,Linking,Alert } from "react-native";
import colors from "../../res/Colors";
import LinearGradient from "react-native-linear-gradient";
import { authorize } from "react-native-app-auth";
import { useDispatch, useSelector } from 'react-redux';
import { ssoLoginAction } from "../../redux/actions/UserAction";
import { storeUser,storeSsoToken } from "../../redux/utils/LocalStorage";
import { PostAuthApiRequest } from "../../network/APIClient";
import RNExitApp from 'react-native-exit-app';

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
  //HeadOfHousehold
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

       if(userInfo.accountNumber==='900690538'){
        nonAdminUserMessage();
       }else if(userInfo.accountNumber==='902862879'){
       nonInternetUserMessage();
       }else{
        navigation.navigate('MyTab', {
          fname: userInfo.firstName,
          lname: userInfo.lastName,
        
        });
       }
     
     
    
    }
  }

  const onError=(error)=>{
    console.log(' callSSOLoginApi error',error)
  }

const nonAdminUserMessage=()=>{
  Alert.alert(
    'Alert Message',
    'Currently, only the Primary Admin or an Admin of a Sparklight account can use the MySparklight mobile app for account management. Please login to your online account to view information.',
    [
      {
        text: 'Close',
        onPress: () => {
          RNExitApp.exitApp()
        },
        style: 'cancel',
      },
      {
        text: 'Open Portal',
        onPress: () => {
          Linking.openURL('https://www.sparklight.com/')
        },
      },
    ],
    { cancelable: true }
  );
  
}


const nonInternetUserMessage=()=>{
  Alert.alert(
    'Alert Message',
    'Currently, only a Sparklight account with Internet service can use the MySparklight mobile app for service management. Please login to your online account to manage your service.',
    [
      {
        text: 'Close',
        onPress: () => {
          RNExitApp.exitApp()
        },
        style: 'cancel',
      },
      {
        text: 'Open Portal',
        onPress: () => {
          Linking.openURL('https://www.sparklight.com/')
        },
      },
    ],
    { cancelable: true }
  );
  
}

  useEffect(() => {
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
