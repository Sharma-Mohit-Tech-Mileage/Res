import React from "react";
import { Modal, View, Text, StyleSheet } from "react-native";
import { Color, FontFamily } from "../../../../GlobalStyles";
import LottieView from "lottie-react-native";

const LoadingOverlay = ({ loading, loadingTxt, onRequestClose, isWhite = false }) => {
  const animationSource = isWhite
    ? require("../../../../assets/animations/loader-white.json")
    : require("../../../../assets/animations/loader-colored.json");

  const LottieAnimation = (
    <LottieView
      source={animationSource}
      autoPlay
      loop
      style={styles.lottie}
    />
  );

  return loadingTxt !== undefined ? (
    <Modal
      visible={loading}
      transparent
      animationType="fade"
      onRequestClose={() => onRequestClose(false)}
    >
      <View style={styles.overlay}>
        <View style={styles.alertContainer}>
          {LottieAnimation}
          <Text style={styles.loadingTxt}>{loadingTxt}...</Text>
        </View>
      </View>
    </Modal>
  ) : (
    <View style={styles.noBackground}>
      {LottieAnimation}
    </View>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#ffffff",
  },
  lottie: {
    width: 180,
    height: 120,
    alignSelf: "center",
  },
  alertContainer: {
    backgroundColor: "#ffffff",
    padding: 20,
    alignSelf: "center",
    borderRadius: 5,
  },
  noBackground: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    position: "absolute",
    zIndex: 999,
    top: 0,
    right: 0,
    left: 0,
    bottom: 0,
  },
  loadingTxt: {
    color: Color.sparklightGray1,
    textAlign: "center",
    fontFamily: FontFamily.openSansRegular,
    fontSize: 22,
    fontStyle: "normal",
    fontWeight: "400",
  },
});

export default LoadingOverlay;