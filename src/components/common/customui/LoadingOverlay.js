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
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  lottie: {
    width: 180,
    height: 120,
    alignSelf: "center",
  },
  alertContainer: {
    backgroundColor: "#ffffff",
    padding: 30,
    alignSelf: "center",
    borderRadius: 15,
    elevation: 10,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 5,
    },
    shadowOpacity: 0.25,
    shadowRadius: 10,
    minWidth: 200,
    alignItems: "center",
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
    fontFamily: FontFamily.RadioCanadaRegular,
    fontSize: 22,
    fontStyle: "normal",
    fontWeight: "400",
  },
});

export default LoadingOverlay;