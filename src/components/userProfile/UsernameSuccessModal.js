import React, { useEffect, useRef } from "react";
import { Modal, View, Text, StyleSheet, TouchableOpacity } from "react-native";
import AnimatedSuccessIcon from "../../components/billing/payments/AnimatedSuccessIcon";
import {
  HeadingH2,
  FieldContent,
  FieldTitle,
} from "../common/customui/Typography";
import { Color, FontFamily, FontSize } from "../../../GlobalStyles";
import PrimaryButton from "../common/customui/PrimaryButton";
import { widthPercentageToDP as wp } from "react-native-responsive-screen";

const UsernameSuccessModal = ({ visible = false, onClose = () => {} }) => {
  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <View style={styles.backdrop}>
        <View
          style={styles.card}
          accessibilityViewIsModal
          importantForAccessibility="yes"
        >
          <View
            style={styles.iconWrap}
            accessible
            accessibilityRole="image"
            accessibilityLabel="Success icon"
            importantForAccessibility="yes"
          >
            <View accessible={false} importantForAccessibility="no-hide-descendants">
              <AnimatedSuccessIcon size={64} />
            </View>
          </View>
          <HeadingH2
            style={styles.title}
            accessibilityRole="header"
            accessibilityLevel={1}
            accessible
          >
            Success!
          </HeadingH2>
          <Text
            style={[
              styles.message,
              {
                marginHorizontal: 16,
                fontFamily: FontFamily.RadioCanadaBold,
                fontWeight: "700",
                fontSize: FontSize.size_sm,
                marginTop: 12,
                marginBottom: 12,
                paddingHorizontal: 16,
                textAlign: "center",
              },
            ]}
            accessible
            accessibilityRole="text"
          >
            Your account username has been successfully updated.
          </Text>

          <View
            style={{
              marginTop: 16,
              alignItems: "center",
              justifyContent: "center",
              backgroundColor: "#EAF7ED",
              borderBottomLeftRadius: 8,
              borderBottomRightRadius: 8,
            }}
          >
            <View
              style={{
                marginVertical: 16,
                alignItems: "center",
                justifyContent: "center",
                flexDirection: "column",
                width: "100%",
              }}
            >
              <HeadingH2
                style={[styles.title]}
                accessibilityRole="header"
                accessibilityLevel={2}
                accessible
              >
                Signing back in to finish
              </HeadingH2>
              <Text
                style={[
                  styles.message,
                  {
                    fontFamily: FontFamily.RadioCanadaBold,
                    fontWeight: "700",
                    fontSize: FontSize.size_sm,
                    marginTop: 12,
                    marginBottom: 12,
                    paddingHorizontal: 16,
                    textAlign: "center",
                  },
                ]}
                accessible
                accessibilityRole="text"
              >
                Please sign out and sign back into your account to apply your
                recent changes. Your updates will take effect immediately upon
                re-login.
              </Text>
              <View
                style={{
                  marginTop: 16,
                  width: wp("86%"),
                  paddingHorizontal: 16,
                }}
              >
                <PrimaryButton
                  title="Sign Out"
                  buttonType="submit"
                  style={{ width: "100%" }}
                  accessibilityLabel="Sign Out"
                  onPress={onClose}
                />
              </View>
            </View>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.4)",
    justifyContent: "center",
    alignItems: "center",
  },
  card: {
    width: wp("90%"),
    backgroundColor: "#fff",
    borderRadius: 8,
    alignItems: "center",
  },
  iconWrap: { marginBottom: 16, marginTop: 16 },
  title: { textAlign: "center", marginBottom: 4 },
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
  closeButton: {
    marginTop: 16,
    backgroundColor: Color.colorPrimary,
    paddingVertical: 10,
    paddingHorizontal: 28,
    borderRadius: 6,
  },
  closeButtonText: { color: "#fff", fontWeight: "600" },
});

export default UsernameSuccessModal;
