import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet } from 'react-native';
import { WebView,WebViewNavigation } from 'react-native-webview';
const LoginSSO='https://customer.uat.sparklight.com/SecureLogin/login.aspx'
const LoginScreen = ({navigation}) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  
  const onNavigationStateChange = (navigationState) => {
    const url = navigationState.url;
  
    // parseURLParams is a pseudo function.
    // Make sure to write your own function or install a package
    //const params = parseURLParams(url);
    console.log('URL Params',JSON.stringify(url))
   
    
//     if(url.redirect_uri){
//         const queryParams = new URLSearchParams(url)
//         const param1=queryParams.get('redirect_uri')
//         console.log('param',param1)
//     for (const [key, value] of queryParams) {
//   console.log({ key, value }) // {key: 'term', value: 'pizza'} {key: 'location', value: 'Bangalore'}
//   }
// }
  
    //if (params.token) {
      // Save token for native requests & move to the next screen
    //}
  };
  

  return (
    
        <WebView source={{ uri: LoginSSO }} style={{ flex: 1 }}
        onNavigationStateChange={onNavigationStateChange} 
        />
      
    
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor:'#333333',
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    color:'white',
    marginBottom: 20,
  },
  input: {
    width: '80%',
    height: 40,
    color:'white',
    borderColor: '#c8c8c8',
    borderWidth: 1,
    marginBottom: 10,
    paddingLeft: 10,
  },
});

export default LoginScreen;



