// [51768] Caps and centres a dialog surface. Existing %-based widths stay below the cap on phones, so adopting this is a no-op there.
import React from "react";
import { View, StyleSheet } from "react-native";
import { useResponsive } from "../../../utils/responsive";
import theme from "../../../styles/theme";

const ModalCard = ({ children, style, maxWidth = theme.layout.modalMaxWidth, ...rest }) => {
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
