// [55104] Tab-root header (Billing/Account/Support/Services): gradient band + shared nav + badge and title, identical on every tab.
import React from "react";
import { StyleSheet, View } from "react-native";
import LinearGradient from "react-native-linear-gradient";
import { Color } from "../../styles/GlobalStyles";
import ProfileSettingsHeader, { HEADER_GRADIENT, TAB_BADGE_SIZE, TAB_BADGE_TOP, TAB_BAND_EXTENSION, useInternalHeaderHeight } from "./ProfileSettingsHeader";
import { Title } from "./customui/Typography";

const TabRootHeader = ({ icon, title, titleProps, chatScreenName }) => {
  const headerHeight = useInternalHeaderHeight();
  return (
    <>
      <LinearGradient style={[styles.band, { height: headerHeight + TAB_BAND_EXTENSION }]} {...HEADER_GRADIENT} />
      <ProfileSettingsHeader chatScreenName={chatScreenName} title="" showIcon={false} />
      <View style={styles.badgeBlock}>
        <View style={styles.badge} accessible={false} importantForAccessibility="no-hide-descendants">
          {icon}
        </View>
        <Title style={styles.title} {...titleProps}>
          {title}
        </Title>
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  band: {
    position: "absolute",
    left: 0,
    right: 0,
    top: 0,
  },
  badgeBlock: {
    paddingTop: TAB_BADGE_TOP,
    alignItems: "center",
    alignSelf: "stretch",
  },
  badge: {
    width: TAB_BADGE_SIZE,
    height: TAB_BADGE_SIZE,
    borderRadius: TAB_BADGE_SIZE / 2,
    borderWidth: 4,
    borderColor: Color.Gray300,
    backgroundColor: Color.colorMidnightblue,
    alignItems: "center",
    justifyContent: "center",
  },
  title: {
    width: 210,
    lineHeight: 28,
    textAlign: "center",
  },
});

export default TabRootHeader;
