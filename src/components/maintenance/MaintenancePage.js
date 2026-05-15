import React from "react";
import {
  View,
  Text,
  StyleSheet,
  Linking,
  TouchableOpacity,
} from "react-native";
import LinearGradient from "react-native-linear-gradient";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
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
} from "../../../GlobalStyles";
import colors from "../../res/Colors";
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
}) => {
  const handleContactPress = () => {
    if (!contactLink) {
      return;
    }

    Linking.openURL(contactLink).catch((err) =>
      console.error("Error opening contact link:", err)
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
      console.error("Navigation ref not available");
    }
  };

  return (
    <LinearGradient
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 0 }}
      colors={["rgba(53, 48, 145, 1)", "rgba(141, 59, 144, 1)"]}
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
                  <TouchableOpacity
                    onPress={handleContactPress}
                    accessibilityRole="link"
                    accessibilityLabel={`${contactInfo} link`}
                    accessibilityHint="Opens support page"
                    accessible={true}
                  >
                    <Text style={styles.contactLink}>{contactInfo}</Text>
                  </TouchableOpacity>
                  <Text style={styles.contactMessage}>.</Text>
                </View>
              </View>
            )}

            {/* Back to Login Button for blocking scenarios */}
            {showLoginButton && (
              <TouchableOpacity
                style={styles.loginButton}
                onPress={handleBackToLogin}
                accessibilityRole="button"
                accessibilityLabel="Back to Login, go back to login screen"
                accessibilityHint="Double tap to return to login screen"
                accessible={true}
              >
                <Text style={styles.loginButtonText}>Back to Login</Text>
              </TouchableOpacity>
            )}
          </View>
        </View>
      </View>

      <View style={styles.copyrightContainer}>
        <Text
          style={[
            {
              position: "absolute",
              bottom: hp("5%"),
              FontFamily: FontFamily.openSansRegular,
              fontSize: 14,
              fontWeight: "400",
              color: colors.snow_white,
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
    fontFamily: FontFamily.openSansRegular,
    fontSize: FontSize.size_sm,
    color: "#FFFFFF",
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
    shadowColor: "#000000",
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
    fontFamily: FontFamily.openSansRegular,
    fontSize: wp("7%"),
    maxFontSize: 32,
    color: Color.sparklightGray1,
    textAlign: "center",
    marginBottom: hp("2%"),
    fontWeight: "400",
  },
  messageText: {
    fontFamily: FontFamily.openSansRegular,
    fontSize: FontSize.size_base,
    color: "#707679",
    textAlign: "left",
    lineHeight: 24,
    marginBottom: hp("2%"),
  },
  estimatedTimeSection: {
    backgroundColor: Color.colorWhitesmoke_200,
    padding: wp("4%"),
    borderRadius: 8,
    marginBottom: hp("2%"),
    width: "100%",
    alignItems: "center",
  },
  estimatedTimeLabel: {
    fontFamily: FontFamily.openSansSemiBold,
    fontSize: FontSize.size_base,
    color: "#000",
    marginBottom: 4,
    fontWeight: "400",
  },
  estimatedTimeValue: {
    fontFamily: FontFamily.openSansSemiBold,
    fontSize: FontSize.size_base,
    color: "#000",
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
    fontFamily: FontFamily.openSansRegular,
    fontSize: FontSize.size_base,
    color: Color.sparklightGray1,
    textAlign: "center",
    fontWeight: "400",
  },
  contactLink: {
    fontFamily: FontFamily.openSansRegular,
    fontSize: FontSize.size_base,
    color: Color.sparklightBrightPurple,
    fontWeight: "700",
    textDecorationLine: "underline",
  },
  copyrightContainer: {
    paddingBottom: hp("5%"),
    paddingHorizontal: wp("5%"),
    alignItems: "center",
  },
  copyrightText: {
    fontFamily: FontFamily.openSansRegular,
    fontSize: 14,
    fontWeight: "400",
    color: "#FFFFFF",
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
    fontFamily: FontFamily.openSansSemiBold,
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
    fontFamily: FontFamily.openSansRegular,
    fontSize: FontSize.size_sm,
    color: "#856404",
    textAlign: "center",
    fontStyle: "italic",
  },
});

export default MaintenancePage;
