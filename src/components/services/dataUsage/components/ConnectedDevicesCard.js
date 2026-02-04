import React from "react";
import { View, Text, StyleSheet } from "react-native";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import { theme } from "../../../../styles/theme";
import { card } from "../../../../styles/utilities";

const ConnectedDevicesCard = ({ devices }) => {
  if (!devices || devices.topDevices.length === 0) {
    return null;
  }

  return (
    <View style={styles.container}>
      <View style={styles.card}>
        {/* Header */}
        <View style={styles.header}>
          <View
            style={styles.iconWrapper}
            accessible={false}
            importantForAccessibility="no"
          >
            <MaterialCommunityIcons
              name="devices"
              size={20}
              color={theme.colors.primary}
              accessible={false}
            />
          </View>
          <View style={styles.headerContent}>
            <Text
              style={styles.headerTitle}
              accessible={true}
              accessibilityRole="header"
              accessibilityLevel={2}
            >
              CONNECTED DEVICES
            </Text>
            <Text
              style={styles.deviceCount}
              accessible={true}
              accessibilityLabel={`${devices.activeDevices} of ${devices.totalDevices} devices currently active`}
            >
              {devices.activeDevices} of {devices.totalDevices} active
            </Text>
          </View>
        </View>

        {/* Top Devices List */}
        <View style={styles.devicesList}>
          <Text style={styles.sectionLabel}>Top Data Usage:</Text>
          
          {devices.topDevices.map((device, index) => (
            <View
              key={index}
              style={styles.deviceItem}
              accessible={true}
              accessibilityLabel={`${device.name}, ${device.usage} gigabytes used, ${device.percentOfTotal} percent of total usage`}
            >
              <View style={styles.deviceInfo}>
                <View
                  style={styles.deviceIcon}
                  accessible={false}
                  importantForAccessibility="no"
                >
                  <MaterialCommunityIcons
                    name={device.icon}
                    size={20}
                    color={theme.colors.primary}
                    accessible={false}
                  />
                </View>
                <View style={styles.deviceDetails}>
                  <Text style={styles.deviceName}>{device.name}</Text>
                  <View style={styles.usageBar}>
                    <View
                      style={[
                        styles.usageBarFill,
                        { width: `${device.percentOfTotal}%` }
                      ]}
                      accessible={false}
                    />
                  </View>
                </View>
              </View>
              <View style={styles.deviceUsage}>
                <Text style={styles.usageAmount}>{device.usage} GB</Text>
                <Text style={styles.usagePercent}>{device.percentOfTotal}%</Text>
              </View>
            </View>
          ))}
        </View>

        {/* Info Footer */}
        <View style={styles.infoFooter}>
          <MaterialCommunityIcons
            name="information-outline"
            size={16}
            color={theme.colors.text.secondary}
            style={{ marginRight: 6 }}
          />
          <Text style={styles.infoText}>
            Device usage data is estimated and may vary
          </Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginHorizontal: theme.spacing.base,
    marginBottom: theme.spacing.base,
  },
  card: {
    ...card.base,
    padding: theme.spacing.base,
  },
  
  // Header
  header: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginBottom: theme.spacing.base,
  },
  iconWrapper: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: `${theme.colors.primary}12`,
    alignItems: "center",
    justifyContent: "center",
    marginRight: theme.spacing.sm,
  },
  headerContent: {
    flex: 1,
  },
  headerTitle: {
    fontSize: theme.typography.size.sm,
    fontFamily: theme.typography.family.semiBold,
    fontWeight: "600",
    color: theme.colors.text.secondary,
    textTransform: "uppercase",
    letterSpacing: 0.5,
    marginBottom: 2,
  },
  deviceCount: {
    fontSize: theme.typography.size.sm,
    fontFamily: theme.typography.family.regular,
    color: theme.colors.text.secondary,
  },
  
  // Devices List
  devicesList: {
    marginBottom: theme.spacing.sm,
  },
  sectionLabel: {
    fontSize: theme.typography.size.sm,
    fontFamily: theme.typography.family.semiBold,
    fontWeight: "600",
    color: theme.colors.text.secondary,
    marginBottom: theme.spacing.sm,
  },
  deviceItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: theme.spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
  },
  deviceInfo: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    marginRight: theme.spacing.md,
  },
  deviceIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: theme.colors.surfaceVariant,
    alignItems: "center",
    justifyContent: "center",
    marginRight: theme.spacing.sm,
  },
  deviceDetails: {
    flex: 1,
  },
  deviceName: {
    fontSize: theme.typography.size.sm,
    fontFamily: theme.typography.family.semiBold,
    fontWeight: "600",
    color: theme.colors.text.primary,
    marginBottom: 4,
  },
  usageBar: {
    height: 4,
    backgroundColor: theme.colors.surfaceVariant,
    borderRadius: 2,
    overflow: "hidden",
  },
  usageBarFill: {
    height: "100%",
    backgroundColor: theme.colors.primary,
    borderRadius: 2,
  },
  deviceUsage: {
    alignItems: "flex-end",
  },
  usageAmount: {
    fontSize: theme.typography.size.sm,
    fontFamily: theme.typography.family.semiBold,
    fontWeight: "600",
    color: theme.colors.text.primary,
  },
  usagePercent: {
    fontSize: theme.typography.size.xs,
    fontFamily: theme.typography.family.regular,
    color: theme.colors.text.secondary,
  },
  
  // Footer
  infoFooter: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: theme.spacing.sm,
    paddingTop: theme.spacing.sm,
    borderTopWidth: 1,
    borderTopColor: theme.colors.border,
  },
  infoText: {
    flex: 1,
    fontSize: theme.typography.size.xs,
    fontFamily: theme.typography.family.regular,
    color: theme.colors.text.secondary,
    lineHeight: 16,
  },
});

export default ConnectedDevicesCard;
