import React from 'react';
import { View, ActivityIndicator, StyleSheet } from 'react-native';
import { Color } from '../../../GlobalStyles';

const Loader = () => (
  <View style={styles.loaderContainer}>
    <ActivityIndicator size="large" color={Color.sparklightDarkGray} />
  </View>
);

const styles = StyleSheet.create({
  loaderContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    position: "absolute",
    zIndex: 999,
    top: 0,
    right: 0,
    left: 0,
    bottom: 0
  },
});

export default Loader;
