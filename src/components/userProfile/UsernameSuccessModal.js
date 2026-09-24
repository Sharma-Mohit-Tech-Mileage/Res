import React from "react";
import { Modal, View, StyleSheet, ScrollView } from "react-native";
import AnimatedSuccessIcon from "../billing/payments/AnimatedSuccessIcon";
import { HeadingH2, Body } from "../common/customui/Typography";
import ModalOverlay from "../common/customui/ModalOverlay";
import ModalCard from "../common/customui/ModalCard";
import AppStyles from "../../styles/AppStyles";
import PrimaryButton from "../common/customui/PrimaryButton";

const UsernameSuccessModal = ({ visible = false, onClose = () => {} }) => (
  <Modal
    visible={visible}
    transparent
    animationType="fade"
    onRequestClose={onClose}
  >
    <ModalOverlay style={styles.backdrop}>
      <ModalCard
        style={[AppStyles.card, styles.card]}
        accessibilityViewIsModal
        importantForAccessibility="yes"
      >
        <ScrollView
          showsVerticalScrollIndicator={false}
          bounces={false}
          contentContainerStyle={styles.scrollContent}
        >
          <View style={styles.panel}>
            <View style={styles.summary}>
              <View
                style={styles.iconWrap}
                accessible
                accessibilityRole="image"
                accessibilityLabel="Success"
              >
                <View
                  accessible={false}
                  importantForAccessibility="no-hide-descendants"
                >
                  <AnimatedSuccessIcon size={64} />
                </View>
              </View>
              <HeadingH2 style={styles.title} accessibilityRole="header">
                Success!
              </HeadingH2>
              <Body style={styles.message}>
                Your account username has been successfully updated.
              </Body>
            </View>
            <View style={styles.actionNotice}>
              <HeadingH2 style={styles.title} accessibilityRole="header">
                Sign back in to finish
              </HeadingH2>
              <Body style={[styles.message, styles.instructions]}>
                Please sign out and sign back into your account to apply your
                recent changes. Your updates will take effect immediately upon
                re-login.
              </Body>
            </View>
          </View>
          <PrimaryButton
            title="Sign Out"
            buttonType="submit"
            onPress={onClose}
            containerStyle={styles.buttonContainer}
          />
        </ScrollView>
      </ModalCard>
    </ModalOverlay>
  </Modal>
);
const styles = StyleSheet.create({
  backdrop: {
    backgroundColor: "rgba(0,0,0,0.4)",
    paddingVertical: 32,
  },
  card: {
    width: "90%",
    maxWidth: 420,
    maxHeight: "90%",
    borderWidth: 2,
    borderColor: "#FFFFFF",
    overflow: "hidden",
  },
  panel: { overflow: "hidden" },
  scrollContent: { paddingBottom: 20 },
  summary: {
    alignItems: "center",
    paddingHorizontal: 24,
    paddingTop: 16,
    paddingBottom: 24,
  },
  iconWrap: {
    width: 64,
    height: 64,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 16,
  },
  title: {
    textAlign: "center",
    marginBottom: 8,
    color: "#000000",
  },
  message: {
    lineHeight: 20,
    color: "#000000",
    textAlign: "center",
  },
  actionNotice: {
    backgroundColor: "#EAF7ED",
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 16,
  },
  instructions: { marginTop: 12 },
  buttonContainer: { marginTop: 24, marginHorizontal: 20, marginBottom: 16 },
});
export default UsernameSuccessModal;
