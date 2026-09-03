import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, AccessibilityInfo } from "react-native";
import { FontFamily, FontSize, Color, Padding } from "../../../GlobalStyles";
import NotificationAlert from "../common/customui/NotificationAlert";
import Icon from "../common/Icon";
import Touchable from "../common/customui/Touchable";
import { Hyperlink } from "../common/customui/Typography";

const DisconnectedBanner = ({ navigation, onClose, showCloseIcon = false }) => {
  const [isScreenReaderEnabled, setIsScreenReaderEnabled] = useState(false);

  const disconnectedBannerMessage = `Your service has been disconnected. However, your online account will remain active for 90 days after disconnection. During this time, you can continue to log in to view your account details and pay any remaining balances.`;

  useEffect(() => {
    AccessibilityInfo.isScreenReaderEnabled().then(setIsScreenReaderEnabled);
    const subscription = AccessibilityInfo.addEventListener(
      'screenReaderChanged',
      setIsScreenReaderEnabled
    );

    return () => subscription?.remove();
  }, []);

  const handleManageServicesPress = () => {
    if (navigation) {
      try {
        navigation.navigate("account", { screen: "Account" });
        setTimeout(() => {
          navigation.navigate("account", { screen: "ProfileSettings" });
        }, 100);
      } catch (error) {
        console.warn("Navigation error:", error);
        navigation.navigate("account", { screen: "Account" });
      }
    }
  };

  const handleContactSupportPress = () => {
    if (navigation) {
      try {
        navigation.navigate("ArticleWindowUtility", {
          url: "https://www.sparklight.com/contactus",
          name: "Contact Support",
        });
      } catch (error) {
        console.warn("Navigation error:", error);
      }
    }
  };

  // Render method for when accessibility is enabled (entire statement clickable)
  const renderAccessibleItem = (iconName, onPress, accessibilityLabel, accessibilityHint, children) => (
    <View style={styles.reconnectionItem}>
      <View style={styles.checkIconContainer}>
        <Icon
          name={iconName}
          size={16}
          color={Color.sparklightGreen}
          style={styles.checkIcon}
        />
      </View>
      <Touchable
        minSize={0}
        style={[styles.touchableTextContainer, { alignItems: 'stretch' }]}
        onPress={onPress}
        accessibilityRole="link"
        accessibilityLabel={accessibilityLabel}
        accessibilityHint={accessibilityHint}
        accessible={true}
        importantForAccessibility="yes"
      >
        <Text style={styles.reconnectionText}>
          {children}
        </Text>
      </Touchable>
    </View>
  );

  // Render method for when accessibility is disabled (only link text clickable)
  const renderRegularItem = (iconName, children) => (
    <View style={styles.reconnectionItem}>
      <View style={styles.checkIconContainer}>
        <Icon
          name={iconName}
          size={18}
          color={Color.sparklightGreen}
          style={styles.checkIcon}
        />
      </View>
      <Text style={styles.reconnectionText}>
        {children}
      </Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.bannerWrapper}>
        <NotificationAlert
          type="info"
          title="Service Disconnected – Account Access Still Available"
          message={disconnectedBannerMessage}
          showCloseIcon={showCloseIcon}
          isVisible={true}
          onClose={onClose}
          splitKey="contact our support team"
          contentStyle={{ paddingRight: 10}}
        />
      </View>

      <View style={styles.reconnectionSection}>
        {/* First statement - Manage Services */}
        {isScreenReaderEnabled ? (
          renderAccessibleItem(
            "green-checkcircle",
            handleManageServicesPress,
            "If you'd like to reconnect your service, please visit the Manage Services section in your account to explore available options.",
            "Double tap to navigate to Manage Services section",
            <>
              If you'd like to reconnect your service, please visit the{" "}
              <Hyperlink>Manage Services</Hyperlink>{" "}
              section in your account to explore available options.
            </>
          )
        ) : (
          renderRegularItem(
            "green-checkcircle",
            <>
              If you'd like to reconnect your service, please visit the{" "}
              <Hyperlink
                onPress={handleManageServicesPress}
                accessibilityRole="link"
                accessibilityLabel="Manage Services link"
                accessibilityHint="Double tap to navigate to Manage Services section"
                accessible={true}
                importantForAccessibility="yes"
              >
                Manage Services
              </Hyperlink>{" "}
              section in your account to explore available options.
            </>
          )
        )}

        {/* Second statement - Contact Support */}
        {isScreenReaderEnabled ? (
          renderAccessibleItem(
            "green-checkcircle",
            handleContactSupportPress,
            "If you have any questions or need assistance, please contact our support team.",
            "Double tap to contact support",
            <>
              If you have any questions or need assistance, please{" "}
              <Hyperlink>contact our support team</Hyperlink>.
            </>
          )
        ) : (
          renderRegularItem(
            "green-checkcircle",
            <>
              If you have any questions or need assistance, please{" "}
              <Hyperlink
                onPress={handleContactSupportPress}
                accessibilityRole="link"
                accessibilityLabel="Contact our support team link"
                accessibilityHint="Double tap to contact support"
                accessible={true}
                importantForAccessibility="yes"
              >
                contact our support team
              </Hyperlink>
              .
            </>
          )
        )}
      </View>

      <View style={styles.thankYouSection}>
        <Text style={styles.thankYouText}>
          Thank you for being a valued customer.
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: Color.sparklightWhite,
    marginBottom: Padding.p_xl,
  },
  bannerWrapper: {
    marginTop: 12,
    marginBottom: 0,
  },
  reconnectionSection: {
    paddingTop: Padding.p_base,
  },
  reconnectionItem: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginBottom: Padding.p_base,
  },
  checkIconContainer: {
    justifyContent: "center",
    alignItems: "center",
    marginRight: Padding.p_xs,
    marginTop: 5,
  },
  checkIcon: {
    color: Color.sparklightWhite,
    fontSize: FontSize.size_sm,
    fontWeight: "700",
    fontFamily: FontFamily.RadioCanadaSemiBold,
  },
  touchableTextContainer: {
    flex: 1,
  },
  reconnectionText: {
    flex: 1,
    fontFamily: FontFamily.RadioCanadaRegular,
    fontSize: FontSize.size_base,
    color: Color.colorGray_100,
    lineHeight: 22,
    flexWrap: "wrap",
  },
  thankYouSection: {
    paddingTop: Padding.p_xs,
  },
  thankYouText: {
    flex: 1,
    fontFamily: FontFamily.RadioCanadaRegular,
    fontSize: FontSize.size_base,
    color: Color.colorGray_100,
    lineHeight: 22,
    flexWrap: "wrap",
    textAlign: "center",
  },
});

export default DisconnectedBanner;