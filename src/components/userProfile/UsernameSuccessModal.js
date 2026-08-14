import React, { useEffect, useRef } from "react";
import { Modal, View, Text, StyleSheet, TouchableOpacity } from "react-native";
import AnimatedSuccessIcon from "../../components/billing/payments/AnimatedSuccessIcon";
import { HeadingH2, FieldContent, FieldTitle } from "../common/customui/Typography";
import { Color, FontFamily, FontSize } from "../../../GlobalStyles";
import PrimaryButton from "../common/customui/PrimaryButton";

const UsernameSuccessModal = ({ visible = false, onClose = () => {}}) => {

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <View style={styles.backdrop}>
        <View style={styles.card} accessible accessibilityLiveRegion="polite">
          <View style={styles.iconWrap} accessible={false} importantForAccessibility="no-hide-descendants">
            <AnimatedSuccessIcon size={64} />
          </View>
          <HeadingH2 style={styles.title} accessibilityRole="header" accessibilityLevel={1}>
            Success!!
          </HeadingH2>
          <Text style={styles.message}>Your account username has been successfully updated.</Text>

          <Text style={[styles.message,{ fontFamily: FontFamily.RadioCanadaBold ,fontWeight: "bold",marginTop: 12, marginBottom: 12}]}>For your security, you'll be logged out and need to log back in with your new username.</Text>

          

          
            
            <PrimaryButton
              title="  Sign Out  "
              buttonType="submit"
              accessibilityLabel="Sign Out"
              onPress={onClose}
            />
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  backdrop: { flex: 1, backgroundColor: "rgba(0,0,0,0.4)", justifyContent: "center", alignItems: "center" },
  card: { width: "86%", backgroundColor: "#fff", borderRadius: 8, padding: 20, alignItems: "center" },
  iconWrap: { marginBottom: 16 },
  title: { textAlign: "center", marginBottom: 8 },
  message: {
    fontSize: FontSize.size_base,
    fontFamily: FontFamily.RadioCanadaRegular,
    color: Color.colorGray_200,
    textAlign: "center",
    marginTop: 12,
  },
  detailBlock: { alignSelf: "stretch", marginTop: 8 },
  detailLabel: { marginBottom: 6 },
  detailValue: {},
  closeButton: { marginTop: 16, backgroundColor: Color.colorPrimary, paddingVertical: 10, paddingHorizontal: 28, borderRadius: 6 },
  closeButtonText: { color: "#fff", fontWeight: "600" },
});

export default UsernameSuccessModal;
