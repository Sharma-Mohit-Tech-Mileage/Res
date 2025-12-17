import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { header } from "../../../styles/compositions";
import { theme } from "../../../styles/theme";
import SupportIcon from "../../../res/svgIcons/SupportIcon";

const ServiceHeader = () => {
  return (
    <View style={styles.container}>
      <View style={styles.iconWrapper}>
        <View 
          style={styles.iconBadge}
          accessible={false}
          importantForAccessibility="no"
        >
          <SupportIcon color={theme.colors.text.onPrimary} filled={true} />
        </View>
        <Text
          style={styles.title}
          accessible={true}
          accessibilityRole="header"
          accessibilityLabel="Services"
          accessibilityLevel={1}
          nativeID="services-header"
        >
          Services
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: header.container,
  iconWrapper: header.iconWrapper,
  iconBadge: header.iconBadge,
  title: header.title,
});

export default ServiceHeader;