/**
 * ManageEquipmentCard Component
 * Path: src/components/services/dataUsage/components/ManageEquipmentCard.js
 * 
 * Displays equipment with USEFUL info:
 * - Connection type (Wired/Wireless)
 * - Location
 * - Connected devices count
 * NOT just "Active" status
 */

import React from "react";
import { View, Text, StyleSheet } from "react-native";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import { theme } from "../../../../styles/theme";
import { card } from "../../../../styles/utilities";

const ManageEquipmentCard = ({ equipment }) => {
  if (!equipment || equipment.length === 0) return null;

  return (
    <View style={styles.container}>
      <View style={styles.card}>
        {/* Header */}
        <View style={styles.header}>
          <View
            style={styles.iconWrapper}
            accessible={false}
            importantForAccessibility="no-hide-descendants"
          >
            <MaterialCommunityIcons
              name="devices"
              size={16}
              color={theme.colors.primary}
              accessible={false}
            />
          </View>
          <Text style={styles.headerTitle}>MY EQUIPMENT</Text>
        </View>

        {/* Equipment List */}
        {equipment.map((item, index) => (
          <View
            key={item.id}
            style={[
              styles.equipmentItem,
              index === equipment.length - 1 && styles.lastItem
            ]}
            accessible={true}
            accessibilityRole="text"
            accessibilityLabel={`${item.name}, Model ${item.model}, ${item.connectionType} connection, Located in ${item.location}, ${item.connectedDevices} devices connected`}
          >
            {/* Equipment Icon */}
            <View
              style={styles.equipmentIconWrapper}
              accessible={false}
              importantForAccessibility="no-hide-descendants"
            >
              <MaterialCommunityIcons
                name={item.icon}
                size={20}
                color={theme.colors.primary}
                accessible={false}
              />
            </View>

            {/* Equipment Info */}
            <View style={styles.equipmentInfo}>
              <Text style={styles.equipmentName}>{item.name}</Text>
              
              {/* Details - USEFUL INFO */}
              <View style={styles.equipmentDetails}>
                {/* Model */}
                <View style={styles.detailRow}>
                  <Text style={styles.detailText}>Model: </Text>
                  <Text style={styles.detailValue}>{item.model}</Text>
                </View>
                
                {/* Connection Type + Location */}
                <View style={styles.detailRow}>
                  <MaterialCommunityIcons
                    name={item.connectionType === "Wired" ? "ethernet" : "wifi"}
                    size={12}
                    color={theme.colors.text.secondary}
                    style={{ marginRight: 4 }}
                  />
                  <Text style={styles.detailValue}>{item.connectionType}</Text>
                  <Text style={styles.detailDot}> • </Text>
                  <MaterialCommunityIcons
                    name="map-marker"
                    size={12}
                    color={theme.colors.text.secondary}
                    style={{ marginRight: 4 }}
                  />
                  <Text style={styles.detailValue}>{item.location}</Text>
                </View>
              </View>
            </View>

            {/* Connected Devices Badge */}
            <View
              style={styles.devicesBadge}
              accessible={false}
              importantForAccessibility="no-hide-descendants"
            >
              <MaterialCommunityIcons
                name="devices"
                size={14}
                color={theme.colors.primary}
                accessible={false}
              />
              <Text style={styles.devicesText}>{item.connectedDevices}</Text>
            </View>
          </View>
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: theme.spacing.base,
    marginHorizontal: theme.spacing.base,
  },
  card: {
    ...card.base,
    padding: theme.spacing.base,
  },
  
  // Header
  header: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: theme.spacing.base,
  },
  iconWrapper: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: `${theme.colors.primary}12`,
    alignItems: "center",
    justifyContent: "center",
    marginRight: theme.spacing.sm,
  },
  headerTitle: {
    fontSize: theme.typography.size.sm,
    fontFamily: theme.typography.family.semiBold,
    fontWeight: "600",
    color: theme.colors.text.secondary,
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  
  // Equipment Item
  equipmentItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: theme.spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
  },
  lastItem: {
    borderBottomWidth: 0,
  },
  equipmentIconWrapper: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: theme.colors.surfaceVariant,
    alignItems: "center",
    justifyContent: "center",
    marginRight: theme.spacing.sm,
  },
  
  // Equipment Info
  equipmentInfo: {
    flex: 1,
  },
  equipmentName: {
    fontSize: theme.typography.size.base,
    fontFamily: theme.typography.family.semiBold,
    fontWeight: "600",
    color: theme.colors.text.primary,
    marginBottom: 4,
  },
  equipmentDetails: {
    gap: 2,
  },
  detailRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  detailText: {
    fontSize: theme.typography.size.xs,
    fontFamily: theme.typography.family.regular,
    color: theme.colors.text.secondary,
  },
  detailValue: {
    fontSize: theme.typography.size.xs,
    fontFamily: theme.typography.family.semiBold,
    fontWeight: "600",
    color: theme.colors.text.primary,
  },
  detailDot: {
    fontSize: theme.typography.size.xs,
    color: theme.colors.text.tertiary,
    marginHorizontal: 4,
  },
  
  // Connected Devices Badge
  devicesBadge: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: theme.spacing.sm,
    paddingVertical: 4,
    backgroundColor: theme.colors.surfaceVariant,
    borderRadius: theme.radius.xs,
    gap: 4,
  },
  devicesText: {
    fontSize: theme.typography.size.xs,
    fontFamily: theme.typography.family.semiBold,
    fontWeight: "600",
    color: theme.colors.primary,
  },
});

export default ManageEquipmentCard;