import React from "react";
import { View, StyleSheet } from "react-native";
import { theme } from "../../../styles/theme";
import SupportIcon from "../../../res/svgIcons/SupportIcon";
import { Title } from "../../common/customui/Typography";

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
        <Title
          //style={styles.title}
          accessible={true}
          accessibilityLabel="Services"
          accessibilityLevel={2}
          accessibilityRole="header"
          nativeID="services-header"
        >
          Services
        </Title>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: theme.spacing.base,
    paddingTop: theme.spacing.xl,
    alignItems: "center",
  },
  iconWrapper: {
    justifyContent: "center",
    alignItems: "center",
    marginBottom: theme.spacing.sm,
  },
  iconBadge: {
    borderColor: theme.colors.border,
    borderWidth: 4,
    width: 72,
    height: 72,
    backgroundColor: theme.colors.primaryDark,
    borderRadius: 36,
    alignItems: "center",
    justifyContent: "center",
  },
});

export default ServiceHeader;
