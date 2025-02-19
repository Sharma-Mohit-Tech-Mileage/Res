import React from 'react';
import { Modal, View, ActivityIndicator, Text, StyleSheet } from 'react-native';
import { Color, FontFamily } from '../../../../GlobalStyles';

const LoadingOverlay = ({ loading, loadingTxt, onRequestClose }) => {
  return (
    <Modal
      visible={loading}
      transparent
      animationType="fade"
      onRequestClose={() => {
        onRequestClose(false);
      }}
    >
      <View style={styles.overlay}>
        <View style={styles.alertContainer}>
          <ActivityIndicator size="large" color={Color.sparklightBrightPurple} />
          <Text style={styles.loadingTxt}>{loadingTxt}...</Text>
        </View>
      </View>
    </Modal>
  );
};
const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  alertContainer: {
    backgroundColor: "white",
    padding: 20,
    borderRadius: 5,
    width: "45%",
  },
  loadingTxt: {
    color: Color.sparklightGray1,
    textAlign: "center",
    fontFamily: FontFamily.openSansRegular,
    fontSize: 22,
    fontStyle: "normal",
    fontWeight: "400",
  },

})
export default LoadingOverlay;