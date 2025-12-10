import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Color, FontSize, FontFamily, Padding } from '../../../../GlobalStyles';
import SupportIcon from "../../../res/svgIcons/SupportIcon";
/**
 * ServiceHeader Component
 * Displays the main header with circular icon for the Services screen
 * Design matches the Billing screen header pattern
 */
const ServiceHeader = () => {
  return (
    <View style={styles.container}>
      {/* Circular Icon Container */}
      <View style={styles.rightActionableParent}>
        <View style={styles.rightActionable}>
          <SupportIcon color={Color.sparklightWhite} filled={true} />
        </View>
        <Text 
          style={styles.title}
          accessible={true}
          accessibilityRole="header"
          accessibilityLabel="My Sparklight Services"
        >
        Services
        </Text>
      </View>

      {/* Description Text */}
      {/* <Text 
        style={styles.description}
        accessible={true}
        accessibilityLabel="This centralized hub helps you stay informed, manage your service with ease, and make the most of your internet connection."
      >
        This centralized hub helps you stay informed, manage your service with ease, and make the most of your internet connection.
      </Text> */}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingTop: 50,
    paddingHorizontal: Padding.p_base,
  },
  rightActionableParent: {
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'stretch',
    overflow: 'hidden',
    marginBottom: Padding.p_base,
  },
  rightActionable: {
    borderColor: Color.colorWhitesmoke_200,
    borderWidth: 4,
    width: 72,
    height: 72,
    backgroundColor: Color.colorMidnightblue,
    borderRadius: 36,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: Padding.p_xs,
  },
  title: {
    fontSize: FontSize.size_3xl,
    fontFamily: FontFamily.openSansRegular,
    color: Color.colorGray_200,
    lineHeight: 28,
    textAlign: 'center',
  },
  description: {
    fontSize: FontSize.size_base,
    fontFamily: FontFamily.openSansRegular,
    color: Color.colorGray_200,
    lineHeight: 24,
    textAlign: 'center',
    paddingHorizontal: Padding.p_xs,
  },
});

export default ServiceHeader;