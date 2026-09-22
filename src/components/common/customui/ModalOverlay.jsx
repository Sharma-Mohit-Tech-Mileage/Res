// [51768] The dimmed, centring backdrop a dialog sits on. Was duplicated byte-for-byte across 7 files.
import React from "react";
import { View, StyleSheet } from "react-native";

const ModalOverlay = ({ children, style, ...rest }) => (
  <View style={[styles.overlay, style]} {...rest}>
    {children}
  </View>
);

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
});

export default ModalOverlay;
