import React, { useState, useCallback } from "react";
import {
  View,
  Text,
  StyleSheet,
  Modal,
  Clipboard,
  AccessibilityInfo,
} from "react-native";
import Touchable from "./customui/Touchable";
import Alerttriangle from "../../../assets/svgs/Alerttriangle";
import CopyIcon from "../../../assets/svgs/CopyIcon";
import colors from "../../res/Colors";
import { FontFamily } from "../../../GlobalStyles";

const groupDigits = (value) =>
  String(value || "")
    .replace(/\s+/g, "")
    .replace(/(.{4})/g, "$1 ")
    .trim();

const TransferOfServiceModal = ({
  visible,
  newAccountNumber,
  onSignIn,
  onRegister,
}) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = useCallback(() => {
    if (!newAccountNumber) return;
    Clipboard.setString(String(newAccountNumber));
    setCopied(true);
    AccessibilityInfo.announceForAccessibility("Account number copied");
    setTimeout(() => setCopied(false), 2000);
  }, [newAccountNumber]);

  return (
    <Modal visible={visible} transparent animationType="fade">
      <View style={styles.overlay}>
        <View style={styles.card} accessibilityViewIsModal={true}>
          <View style={styles.titleRow}>
            <Alerttriangle width={16} height={16} color="#F88700" />
            <Text
              style={styles.title}
              accessibilityRole="header"
              accessible={true}
            >
              Account update required
            </Text>
          </View>

          <Text style={styles.body}>
            Your previous account number is no longer active. Use your new
            account number below to continue:
          </Text>

          <View style={styles.accountRow}>
            <Text
              style={styles.accountNumber}
              accessible={true}
              accessibilityLabel={`New account number ${String(
                newAccountNumber || ""
              )
                .split("")
                .join(" ")}`}
            >
              {groupDigits(newAccountNumber)}
            </Text>
            <View style={styles.copyWrap}>
              {copied && (
                <View style={styles.copiedTip} accessible={false} pointerEvents="none">
                  <View style={styles.copiedTipBubble}>
                    <Text style={styles.copiedTipText}>Copied!</Text>
                  </View>
                  <View style={styles.copiedTipArrow} />
                </View>
              )}
              <Touchable
                minSize={0}
                style={styles.copyBtn}
                onPress={handleCopy}
                accessible={true}
                accessibilityRole="button"
                accessibilityLabel={
                  copied ? "Account number copied" : "Copy account number"
                }
              >
                <CopyIcon />
              </Touchable>
            </View>
          </View>

          <Touchable
            minSize={0}
            style={styles.primaryBtn}
            onPress={onSignIn}
            accessible={true}
            accessibilityRole="button"
            accessibilityLabel="Sign in with new account"
          >
            <Text style={styles.primaryTxt}>Sign in with new account</Text>
          </Touchable>

          {!!onRegister && (
            <>
              <Text style={styles.notRegistered}>Not registered?</Text>

              <Touchable
                minSize={0}
                style={styles.secondaryBtn}
                onPress={onRegister}
                accessible={true}
                accessibilityRole="button"
                accessibilityLabel="Register new account"
              >
                <Text style={styles.secondaryTxt}>Register new account</Text>
              </Touchable>
            </>
          )}
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
    backgroundColor: "rgba(0, 0, 0, 0.4)",
    paddingHorizontal: 24,
  },
  card: {
    backgroundColor: colors.snow_white,
    borderRadius: 24,
    paddingVertical: 32,
    paddingHorizontal: 32,
    width: "100%",
  },
  titleRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  title: {
    color: colors.black,
    fontFamily: FontFamily.RadioCanadaBold,
    fontSize: 18,
    fontWeight: "700",
    marginLeft: 8,
  },
  body: {
    color: colors.black,
    fontFamily: FontFamily.RadioCanadaRegular,
    fontSize: 18,
    lineHeight: 22,
    textAlign: "center",
    marginTop: 16,
  },
  accountRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "#F5EFF6",
    borderRadius: 8,
    paddingVertical: 20,
    paddingHorizontal: 16,
    marginTop: 36,
  },
  accountNumber: {
    color: colors.black,
    fontFamily: FontFamily.RadioCanadaMedium,
    fontSize: 16,
    fontWeight: "500",
    flex: 1,
    textAlign: "center",
  },
  copyWrap: {
    marginLeft: 12,
  },
  copyBtn: {
    backgroundColor: "#EBDDED",
    borderRadius: 6,
    padding: 8,
  },
  copiedTip: {
    // Fixed width + negative left centers the bubble over the 44px copy button; absolute children otherwise measure against that width and wrap
    position: "absolute",
    top: -40,
    left: -18,
    width: 80,
    alignItems: "center",
    zIndex: 1,
  },
  copiedTipBubble: {
    backgroundColor: "#34744B",
    borderRadius: 3,
    paddingVertical: 5,
    paddingHorizontal: 12,
  },
  copiedTipArrow: {
    width: 0,
    height: 0,
    borderLeftWidth: 7,
    borderRightWidth: 7,
    borderTopWidth: 7,
    borderLeftColor: "transparent",
    borderRightColor: "transparent",
    borderTopColor: "#34744B",
  },
  copiedTipText: {
    color: colors.snow_white,
    fontFamily: FontFamily.RadioCanadaRegular,
    fontSize: 13,
  },
  primaryBtn: {
    backgroundColor: colors.sparklight_bright_purple,
    borderRadius: 100,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 44,
  },
  primaryTxt: {
    color: colors.snow_white,
    fontFamily: FontFamily.RadioCanadaBold,
    fontSize: 15,
    fontWeight: "700",
    paddingVertical: 14,
  },
  notRegistered: {
    color: colors.darkest_grey,
    fontFamily: FontFamily.RadioCanadaRegular,
    fontSize: 16,
    textAlign: "center",
    marginTop: 44,
  },
  secondaryBtn: {
    backgroundColor: "#F1EDF2",
    borderRadius: 100,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 12,
  },
  secondaryTxt: {
    color: colors.sparklight_bright_purple,
    fontFamily: FontFamily.RadioCanadaBold,
    fontSize: 15,
    fontWeight: "700",
    paddingVertical: 14,
  },
});

export default TransferOfServiceModal;
