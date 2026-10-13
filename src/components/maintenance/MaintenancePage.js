import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Linking,
  TextInput,
} from "react-native";
import Touchable from "../common/customui/Touchable";
import LinearGradient from "react-native-linear-gradient";
import { wp, hp } from "../../utils/responsive";
import moment from "moment";
import { navigationRef } from "../../navigations/UserNavigations";
import Icon from "../common/Icon";
import VersionCheck from "react-native-version-check";
import {
  Color,
  Padding,
  Border,
  FontFamily,
  FontSize,
} from "../../styles/GlobalStyles";
import Logo from "../../res/images/LogoSmall";

const MaintenancePage = ({
  title = "We'll Be Back Soon",
  message = "Our app is currently undergoing scheduled maintenance and will be temporarily unavailable. Thanks for your patience as we work to improve your experience. Please relaunch the app after the maintenance window.",
  estimatedTime = null,
  contactInfo = "contact us",
  contactLink = null,
  showLoginButton = false,
  isBlockingUser = false,
  pageType = "NORMAL",
  internalAccessConfig,
  submitBypassCode,
}) => {
  // 52452: internal testers can unlock the app during a maintenance window. The link
  // only renders when internalAccess is switched on in Remote Config, so customers
  // never see it during a normal window.
  const [showCodeEntry, setShowCodeEntry] = useState(false);
  const [code, setCode] = useState("");
  const [codeError, setCodeError] = useState("");

  const canEnterCode = Boolean(
    internalAccessConfig?.enabled && internalAccessConfig?.bypassCode
  );

  const handleSubmitCode = () => {
    if (submitBypassCode?.(code)) {
      setCodeError("");
      return;
    }
    setCodeError("That code was not recognised.");
  };
  const handleContactPress = () => {
    if (!contactLink) {
      return;
    }

    Linking.openURL(contactLink).catch((err) =>
      console.warn("Error opening contact link:", err)
    );
  };

  const handleBackToLogin = () => {
    if (navigationRef.current) {
      navigationRef.current.reset({
        index: 0,
        routes: [
          {
            name: "Splash",
            params: {
              isLogout: true,
              fromBlocking: true,
            },
          },
        ],
      });
    } else {
      console.warn("Navigation ref not available");
    }
  };

  return (
    <LinearGradient
      start={{ x: 0, y: 0 }}
      end={{ x: 1.3, y: 0 }}
      colors={["rgba(141, 59, 144, 1)", "rgba(53, 48, 145, 1)"]}
      style={styles.container}
    >
      <View style={styles.contentContainer}>
        {/* Logo with Version */}
        <View style={styles.logoContainer}>
          <View
            style={styles.logo}
            accessibilityRole="image"
            accessibilityLabel="Sparklight logo"
          >
            <Logo width={300} height={84}/>
          </View>
          <Text
            style={{ color: "white", alignSelf: "center", marginTop: 0.8, fontSize: 16, }}
            accessibilityLabel={`Version ${VersionCheck.getCurrentVersion()}`}
            accessible={true}
          >
            Version: {VersionCheck.getCurrentVersion()}
          </Text>
        </View>

        {/* Maintenance Message Card */}
        <View style={styles.cardOuterContainer}>
          <View style={styles.cardContainer}>
            <View
              style={styles.gearIconsContainer}
              accessible={false}
              importantForAccessibility="no-hide-descendants"
            >
              <View
                accessible={true}
                accessibilityRole="image"
                accessibilityLabel="Maintenance gear icon"
              >
                <Icon name="gear" color={Color.colorMidnightblue} size={84} />
              </View>
            </View>

            <Text
              style={styles.titleText}
              accessibilityRole="text"
              accessible={true}
              accessibilityLabel={title}
            >
              {title}
            </Text>

            <Text
              style={styles.messageText}
              accessible={true}
              accessibilityLabel={message}
            >
              {message}
            </Text>

            {estimatedTime && (
              <View style={styles.estimatedTimeSection}>
                <Text style={styles.estimatedTimeLabel}>
                  Estimated Completion Time
                </Text>
                <Text style={styles.estimatedTimeValue}>{estimatedTime}</Text>
              </View>
            )}

            {contactInfo && contactLink && !showLoginButton && (
              <View style={styles.contactSection}>
                <View style={styles.contactMessageContainer}>
                  <Text style={styles.contactMessage}>
                    For immediate assistance, please{" "}
                  </Text>
                  <Touchable
                    minSize={0}
                    onPress={handleContactPress}
                    accessibilityRole="link"
                    accessibilityLabel={`${contactInfo} link`}
                    accessibilityHint="Opens support page"
                    accessible={true}
                  >
                    <Text style={styles.contactLink}>{contactInfo}</Text>
                  </Touchable>
                  <Text style={styles.contactMessage}>.</Text>
                </View>
              </View>
            )}

            {/* Back to Login Button for blocking scenarios */}
            {showLoginButton && (
              <Touchable
                minSize={0}
                style={[styles.loginButton, { alignItems: 'stretch' }]}
                onPress={handleBackToLogin}
                accessibilityRole="button"
                accessibilityLabel="Back to Login, go back to login screen"
                accessibilityHint="Double tap to return to login screen"
                accessible={true}
              >
                <Text style={styles.loginButtonText}>Back to Login</Text>
              </Touchable>
            )}
          </View>
        </View>

        {/* 52452: inside contentContainer so it stays on screen - the footer below is absolutely positioned. */}
        {canEnterCode && !showCodeEntry && (
          <Touchable
            onPress={() => setShowCodeEntry(true)}
            style={styles.internalLinkBtn}
            accessibilityRole="button"
            accessibilityLabel="Internal access"
            accessibilityHint="Double tap to enter an internal access code"
          >
            <Text style={styles.internalLinkText}>Internal access</Text>
          </Touchable>
        )}
        {canEnterCode && showCodeEntry && (
          <View style={styles.internalEntry}>
            <TextInput
              value={code}
              onChangeText={(t) => { setCode(t); setCodeError(""); }}
              placeholder="Access code"
              placeholderTextColor={Color.sparklightWhite}
              autoCapitalize="characters"
              autoCorrect={false}
              returnKeyType="go"
              onSubmitEditing={handleSubmitCode}
              style={styles.internalInput}
              accessibilityLabel="Internal access code"
            />
            <Touchable
              onPress={handleSubmitCode}
              style={styles.internalSubmitBtn}
              accessibilityRole="button"
              accessibilityLabel="Unlock"
              accessibilityHint="Double tap to unlock the app with this code"
            >
              <Text style={styles.internalSubmitText}>Unlock</Text>
            </Touchable>
          {!!codeError && (
              <Text style={styles.internalError} accessibilityLiveRegion="polite">
              {codeError}
              </Text>
            )}
          </View>
        )}
      </View>

      <View style={styles.copyrightContainer}>
        <Text
          style={[
            {
              position: "absolute",
              bottom: hp("5%"),
              FontFamily: FontFamily.RadioCanadaRegular,
              fontSize: 14,
              fontWeight: "400",
              color: Color.sparklightWhite,
              alignSelf: "center",
            },
          ]}
        >
          {`Copyright © ${moment().year()}, Sparklight ®, All Rights Reserved.`}
        </Text>
      </View>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  // 52452: internal access affordance - only rendered when Remote Config enables it.
  internalLinkBtn: { alignSelf: "center", marginTop: 8, minHeight: 44, justifyContent: "center" },
  internalLinkText: {
    color: Color.sparklightWhite,
    fontSize: 13,
    textDecorationLine: "underline",
    opacity: 0.85,
  },
  internalEntry: { alignSelf: "center", marginTop: 8, width: "80%" },
  internalInput: {
    borderWidth: 1,
    borderColor: Color.sparklightWhite,
    borderRadius: 6,
    paddingHorizontal: 12,
    minHeight: 44,
    color: Color.sparklightWhite,
    fontSize: 14,
  },
  internalSubmitBtn: { marginTop: 8, minHeight: 44, alignItems: "center", justifyContent: "center" },
  internalSubmitText: { color: Color.sparklightWhite, fontSize: 14, textDecorationLine: "underline" },
  internalError: { marginTop: 6, color: Color.sparklightWhite, fontSize: 12, textAlign: "center" },
  container: {
    flex: 1,
  },
  contentContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: wp("5%"),
    paddingVertical: hp("2%"),
    minHeight: hp("85%"), 
  },
  logoContainer: {
    alignItems: "center",
    marginBottom: hp("3%"),
  },
  logo: {
    maxWidth: 280,
    maxHeight: 90,
    marginBottom: 10,
  },
  versionText: {
    fontFamily: FontFamily.RadioCanadaRegular,
    fontSize: FontSize.size_sm,
    color: Color.sparklightWhite,
    fontWeight: "400",
    opacity: 0.8,
  },
  cardOuterContainer: {
    borderRadius: 20,
    borderWidth: 10,
    borderColor: "rgba(255, 255, 255, 0.15)",
    width: wp("90%"),
    maxWidth: 400,
  },
  cardContainer: {
    backgroundColor: Color.sparklightWhite,
    borderRadius: 10,
    padding: wp("6%"),
    alignItems: "center",
    shadowColor: Color.colorblack_100,
    shadowOffset: {
      width: 0,
      height: 8,
    },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 12,
  },
  gearIconsContainer: {
    flexDirection: "row",
    marginBottom: hp("2%"),
    alignItems: "center",
  },
  titleText: {
    fontFamily: FontFamily.RadioCanadaRegular,
    fontSize: wp("7%"),
    maxFontSize: 32,
    color: Color.sparklightGray1,
    textAlign: "center",
    marginBottom: hp("2%"),
    fontWeight: "400",
  },
  messageText: {
    fontFamily: FontFamily.RadioCanadaRegular,
    fontSize: FontSize.size_base,
    color: "#707679",
    textAlign: "left",
    lineHeight: 24,
    marginBottom: hp("2%"),
  },
  estimatedTimeSection: {
    backgroundColor: Color.Gray300,
    padding: wp("4%"),
    borderRadius: Border.br_5xs,
    marginBottom: hp("2%"),
    width: "100%",
    alignItems: "center",
  },
  estimatedTimeLabel: {
    fontFamily: FontFamily.RadioCanadaSemiBold,
    fontSize: FontSize.size_base,
    color: Color.colorblack_100,
    marginBottom: 4,
    fontWeight: "400",
  },
  estimatedTimeValue: {
    fontFamily: FontFamily.RadioCanadaSemiBold,
    fontSize: FontSize.size_base,
    color: Color.colorblack_100,
    fontWeight: "700",
  },
  contactSection: {
    width: "100%",
    alignItems: "center",
  },
  contactMessageContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    alignItems: "center",
    justifyContent: "center",
  },
  contactMessage: {
    fontFamily: FontFamily.RadioCanadaRegular,
    fontSize: FontSize.size_base,
    color: Color.sparklightGray1,
    textAlign: "center",
    fontWeight: "400",
  },
  contactLink: {
    fontFamily: FontFamily.RadioCanadaRegular,
    fontSize: FontSize.size_base,
    color: Color.sparklightPrimaryPurple,
    fontWeight: "700",
    textDecorationLine: "underline",
  },
  copyrightContainer: {
    paddingBottom: hp("5%"),
    paddingHorizontal: wp("5%"),
    alignItems: "center",
  },
  copyrightText: {
    fontFamily: FontFamily.RadioCanadaRegular,
    fontSize: 14,
    fontWeight: "400",
    color: Color.sparklightWhite,
    textAlign: "center",
    opacity: 0.8,
  },
  loginButton: {
    backgroundColor: Color.colorMidnightblue,
    borderRadius: Border.br_xs,
    paddingVertical: Padding.p_base,
    paddingHorizontal: Padding.p_5xl,
    marginTop: Padding.p_base,
    width: "100%",
    alignItems: "center",
  },
  loginButtonText: {
    fontFamily: FontFamily.RadioCanadaSemiBold,
    fontSize: FontSize.size_base,
    color: Color.sparklightWhite,
    textAlign: "center",
  },
  blockingInfoContainer: {
    backgroundColor: "#FFF3CD",
    borderColor: "#FFEAA7",
    borderWidth: 1,
    borderRadius: Border.br_5xs,
    padding: Padding.p_base,
    marginTop: Padding.p_base,
    width: "100%",
  },
  blockingInfoText: {
    fontFamily: FontFamily.RadioCanadaRegular,
    fontSize: FontSize.size_sm,
    color: "#856404",
    textAlign: "center",
    fontStyle: "italic",
  },
});

export default MaintenancePage;
