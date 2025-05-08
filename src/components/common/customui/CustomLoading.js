import React from "react";
import { Modal, View, Text, StyleSheet } from "react-native";
import { Color, FontFamily } from "../../../../GlobalStyles";
import FastImage from "react-native-fast-image";
const LoadingIcon = require("../../../../assets/loading.gif"); 
const LoadingIconWhite = require("../../../../assets/loader-white.gif");

const LoadingOverlay = ({ loading, loadingTxt, onRequestClose, isWhite=false }) => {
  return loadingTxt !== undefined ? (
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
          <FastImage
            resizeMode="contain"
            source={(isWhite)? LoadingIconWhite:LoadingIcon}
            style={styles.LoadingImage}
            co
          />
          <Text style={styles.loadingTxt}>{loadingTxt}...</Text>
        </View>
      </View>
    </Modal>
  ) : (
    <View style={styles.noBackground}>
      <FastImage
        resizeMode="contain"
        source={(isWhite)? LoadingIconWhite:LoadingIcon}
        style={{ width: 180, height: 120 }}
      />
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
  LoadingImage: {
    width: 180,
    height: 120,
    alignSelf: "center",
  },
  alertContainer: {
    backgroundColor: "white",
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
