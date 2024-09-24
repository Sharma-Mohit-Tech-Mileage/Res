import React from 'react';
import { View, ActivityIndicator, Text, StyleSheet, Dimensions } from 'react-native';
import { Color, FontFamily } from "../../../GlobalStyles";

const LoadingOverlay = ({ isLoading, message = "Please wait...", headerHeight = 96 }) => {
  if (!isLoading) return null;

  const window = Dimensions.get('window');

  return (
    <View style={[styles.overlay, { top: headerHeight, height: window.height - headerHeight }]}>
      <ActivityIndicator size="large" color={Color.sparklightBrightPurple} />
      <Text style={styles.message}>{message}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  overlay: {
    position: 'absolute',
    left: 0,
    right: 0,
    backgroundColor: Color.colorWhitesmoke_300,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 999,
  },
  message: {
    marginTop: 16,
    color: Color.sparklightBrightPurple,
    fontSize: 16,
    fontWeight: '400',
    fontFamily: FontFamily.openSansRegular,
  },
});

export default LoadingOverlay;