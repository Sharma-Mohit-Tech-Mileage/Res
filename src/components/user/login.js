import React, { useState } from 'react';
import { View, Text, Button, StyleSheet,Alert } from 'react-native';
//import {CTAButton,PrimaryButtom,SecondaryButton} from '@customui'
//import CTAButton from '@customui/CTAButton.js'

const LoginScreen = () => {
  
  

  return (
    <View style={styles.container}>
      <Text style={styles.header}> Auth0Sample - Login </Text>
      
      
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



