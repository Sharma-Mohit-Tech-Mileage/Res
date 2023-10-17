import React, { useEffect, useState } from 'react';
import { View, Image, StyleSheet, Text } from 'react-native';
import colors from '../../res/Colors';
import UserNavigations from '../../navigations/UserNavigations';
import LinearGradient from 'react-native-linear-gradient';

const SplashScreen = () => {
  const [isSplashReady, setIsSplashReady] = useState(false);

  useEffect(() => {
    // Simulate a delay for the splash screen
    setTimeout(() => {
      setIsSplashReady(true);
    }, 3000); // Adjust the duration as needed
  }, []);

  return (
    <LinearGradient start={{x: 0, y: 0}} end={{x: 1, y: 0}} colors={['rgba(53, 48, 145, 0.78)','rgba(141, 59, 144, 0.9)']} style={styles.container}>
      {isSplashReady ? (
        <UserNavigations />
      ) : (
        <View style={styles.splashContainer}>
          {/* Your centered logo */}
          <Image
           resizeMode='contain'
           
            source={require('../../res/images/Logo.png')}
            style={styles.logo}
          />
         
        </View>
      )}
    </LinearGradient>
  );
};



const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor:colors.splash_bg,
  },
  splashContainer: {
    marginTop:250,
    justifyContent: 'center',
    alignItems: 'center',
    // Customize your splash screen background color
  },
  logo: {
    width: 320,
    height: 100, // Adjust the logo size as needed
  },
  splashText: {
    marginTop: 20,
    fontSize: 18,
    color:colors.snow_white
  },
});

export default SplashScreen;
