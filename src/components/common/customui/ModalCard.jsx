// [51768] Caps and centres a dialog. Existing %-widths sit below the cap on phones, so adoption is a no-op there.
import React from "react";
import { View, StyleSheet } from "react-native";
import { LAYOUT, useResponsive } from "../../../utils/responsive";

const ModalCard = ({ children, style, maxWidth = LAYOUT.modalMaxWidth, ...rest }) => {
  const { isCompact } = useResponsive();
  return (
    <View style={[styles.card, isCompact ? null : { maxWidth, alignSelf: "center" }, style]} {...rest}>
      {children}
    </View>
  );
};

const styles = StyleSheet.create({
  card: { width: "100%" },
});

export default ModalCard;
