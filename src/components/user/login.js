import React, { useState,useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { authorize } from "react-native-app-auth";



const LoginScreen = ({navigation}) => {
  const [setData] = useState(undefined);
 

  useEffect(() => {
    const loginAuth = async () => {
      try {
        const result = await authorize(config);
        // result includes accessToken, accessTokenExpirationDate and refreshToken
        console.log("result",result);
    
        
        if(result.accessToken){
          navigation.navigate('Home', {
            email: decoded.email,
            name: decoded.name,
          });
        }

        setData(result);
      } catch (error) {
        console.log(error);
      }
    };
    loginAuth();
  }, []);


  

  return (
    
     <View>
      <Text>Login</Text>
     </View>
      
      
    
  );
  
  
};


const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
  },
  header: {
    fontSize: 20,
    textAlign: 'center',
    margin: 10,
  },
  error: {
    margin: 20,
    textAlign: 'center',
    color: '#D8000C',
  },
});

export default LoginScreen;



