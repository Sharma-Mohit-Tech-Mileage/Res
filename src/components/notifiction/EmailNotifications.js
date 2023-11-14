import * as React from "react";
import { useState } from "react";
import { StyleSheet, Text, Pressable, View } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { Color, Padding, Border, FontSize, FontFamily } from "../../../GlobalStyles";
import Toggle from '../common/Toggle';
import ProfileSettingsHeader from '../common/ProfileSettingsHeader';

const EmailNotifications = () => {
  const [isToggleActive, setIsToggleActive] = useState(false);

  const handleToggle = (isActive) => {
    setIsToggleActive(isActive);
  };

  const navigation = useNavigation();

  return (
    <View style={{ flex: 1, backgroundColor: Color.sparklightBlue }} accessible accessibilityLabel="Email Notifications">
      <ProfileSettingsHeader
        title="Edit Email Notifications"
        onPressBack={() => navigation.navigate('Notifications')}
        accessibilityLabel="Back to Account"
        accessibilityHint="Navigates back to the Notifications screen"
      />
      <View style={styles.emailNotificationsInner}>
        <View style={styles.frameParent}>
          <View style={[styles.frameContainer, styles.navigationBorder]} accessible >
            <View style={styles.frameGroup}>
              <View style={[styles.frameView, styles.frameFlexBox]}>
                <View style={styles.frameParent1} >
                  <View
                    style={[
                      styles.paperlessBillingParent,
                      styles.frameFlexBox,
                    ]}
                    accessible
                    accessibilityRole="switch"
                    accessibilityLabel="Paperless Billing"
                    accessibilityHint="Toggle paperless billing on or off"
                    accessibilityValue={{ text: isToggleActive ? "On" : "Off" }}
                  >
                    <Text style={styles.paperlessBilling}>
                      Paperless Billing
                    </Text>
                    <View>
                      <Toggle onToggle={handleToggle} />
                    </View>
                  </View>
                  <Text
                    style={[
                      styles.receiveBillingStatements,
                      styles.receiveTypo,
                    ]}
                    accessibilityRole="text"
                  >
                    Receive billing statements via email and no longer receive
                    paper statements in the mail.
                  </Text>
                </View>
              </View>
            </View>
          </View>
          <View style={styles.buttonsParent} accessible >
            <Pressable
              style={[styles.buttons, styles.buttonsLayout]}
              onPress={() => {/* Save function */ }}
              accessible
              accessibilityRole="button"
              accessibilityLabel="Save"
            >
              <Text style={[styles.makePayment, styles.makeTypo]}>Save</Text>
            </Pressable>
            <Pressable
              style={[styles.buttons1, styles.buttonsLayout]}
              onPress={() => navigation.navigate("Notifications")}
              accessible
              accessibilityRole="button"
              accessibilityLabel="Cancel"
              accessibilityHint="Cancels the action and returns to Notifications screen"
            >
              <Text style={[styles.makePayment1, styles.makeTypo]}>Cancel</Text>
            </Pressable>
          </View>
        </View>
      </View>
    </View>
  );
};


const styles = StyleSheet.create({

  navigationBorder: {
    borderColor: Color.colorGainsboro_100,
    justifyContent: "center",
    alignItems: "center",
    borderStyle: "solid",
    backgroundColor: Color.sparklightWhite,
  },
  frameFlexBox: {
    flexDirection: "row",
    alignSelf: "stretch",
  },

  receiveTypo: {
    fontSize: FontSize.textXsSemibold_size,
    color: Color.colorGray_100,
    textAlign: "left",
    fontFamily: FontFamily.openSansRegular,
    alignSelf: "stretch",
  },
  buttonsLayout: {
    paddingHorizontal: 0,
    width: '100%',
    paddingVertical: Padding.p_base,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: Border.br_11xs,
    height: 56,
  },
  makeTypo: {
    width: 282,
    fontFamily: FontFamily.openSansRegular,
    fontSize: FontSize.size_base,
    textAlign: "center",
  },
  paperlessBilling: {
    color: Color.colorGray_200,
    textAlign: "left",
    fontFamily: FontFamily.openSansRegular,
    fontSize: FontSize.size_base,
    lineHeight: 28,
    flex: 1,
  },
  paperlessBillingParent: {
    alignItems: "center",
  },
  receiveBillingStatements: {
    color: Color.colorGray_100,
    lineHeight: 28,
  },
  frameParent1: {
    paddingVertical: Padding.p_base,
    justifyContent: "center",
    paddingHorizontal: Padding.p_5xl,
    flex: 1,
  },
  frameView: {
    borderBottomWidth: 1,
    flexDirection: "row",
    alignItems: "center",
    borderColor: Color.colorGainsboro_100,
    borderStyle: "solid",
    borderTopWidth: 1,
  },
  receiveMarketingEmails: {
    lineHeight: 28,
  },
  promotions: {
    lineHeight: 22,
  },
  receiveMarketingEmailsContainer: {
    color: Color.colorGray_100,
  },
  frameWrapper1: {
    borderBottomWidth: 1,
    flexDirection: "row",
    alignItems: "center",
    borderColor: Color.colorGainsboro_100,
    borderStyle: "solid",
    backgroundColor: Color.sparklightWhite,
  },
  frameGroup: {
    justifyContent: "center",
    alignItems: "center",
    alignSelf: "stretch",
  },
  frameContainer: {
    borderWidth: 1,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: Border.br_11xs,
    borderColor: Color.colorGainsboro_100,
    alignSelf: "stretch",
    overflow: "hidden",
  },
  frameParent: {
    alignSelf: "stretch",
  },
  makePayment: {
    color: Color.sparklightWhite,
    width: 282,
  },
  buttons: {
    backgroundColor: Color.colorMidnightblue,
  },
  makePayment1: {
    color: Color.colorMidnightblue,
  },
  buttons1: {
    marginTop: 16,
    backgroundColor: Color.colorWhitesmoke_200,
    paddingHorizontal: 0,
    width: 382,
  },
  buttonsParent: {
    marginTop: 16,
    alignSelf: "stretch",
  },
  emailNotificationsInner: {
    top: 100,
    marginTop: Padding.p_base,
    paddingBottom: Padding.p_base,
    paddingHorizontal: Padding.p_base,
    width: '100%',
    overflow: "hidden",
  },
});

export default EmailNotifications;
