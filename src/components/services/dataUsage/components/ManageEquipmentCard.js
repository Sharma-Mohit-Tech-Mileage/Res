import React, { memo, useMemo, useCallback } from "react";
import { View, Text, StyleSheet } from "react-native";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import { theme } from "../../../../styles/theme";
import { card } from "../../../../styles/utilities";
import { cardHeader } from "../../../../styles/compositions";
import { Layout } from "../../../../../GlobalStyles";

const safeText = (v, fallback = "\u2014") =>
  v === null || v === undefined || String(v).trim() === "" ? fallback : String(v);

const normalize = (v) => String(v ?? "").trim();

const getEquipmentIcon = (item) => {
  const blob = `${normalize(item?.type)} ${normalize(item?.name)}`.toLowerCase();

  if (blob.includes("extender") || blob.includes("mesh")) return "wifi-plus";
  if (blob.includes("modem")) return "access-point-network";
  if (blob.includes("gateway")) return "router-network";
  return "router-wireless"; 
};

const getIdentifier = (item) => {
  if (normalize(item?.macAddress || item?.mac || item?.macId)) {
    return { label: "MAC ID", value: safeText(item?.macAddress || item?.mac || item?.macId) };
  }
  if (normalize(item?.ipAddress || item?.ip)) {
    return { label: "IP Address", value: safeText(item?.ipAddress || item?.ip) };
  }
  return null;
};

const buildA11yLabel = (item) => {
  const parts = [];
  const name = normalize(item?.name);
  parts.push(name || "Provider equipment");
  
  const model = normalize(item?.model);
  if (model) parts.push(`Model ${model}`);

  const identifier = getIdentifier(item);
  if (identifier) parts.push(`${identifier.label} ${identifier.value}`);

  return parts.join(". ") + ".";
};

const EquipmentRow = memo(function EquipmentRow({ item, isLast }) {
  const identifier = useMemo(() => getIdentifier(item), [item]);
  const a11yLabel = useMemo(() => buildA11yLabel(item), [item]);

  return (
    <View
      style={[styles.equipmentItem, isLast && styles.lastItem]}
      accessible={true}
      accessibilityRole="text"
      accessibilityLabel={a11yLabel}
    >
      <View
        style={styles.equipmentInfo}
        importantForAccessibility="no-hide-descendants"
        accessibilityElementsHidden={true}
      >
        <Text style={styles.equipmentName} numberOfLines={1}>
          {safeText(item?.name, "Provider Equipment")}
        </Text>

        <View style={styles.equipmentDetails}>
          <View style={styles.detailRow}>
            <Text style={styles.detailText}>Model: </Text>
            <Text style={styles.detailValue} numberOfLines={1}>
              {safeText(item?.model)}
            </Text>
          </View>

          {identifier && (
            <View style={styles.detailRow}>
              <Text style={styles.detailText}>{identifier.label}: </Text>
              <Text style={styles.detailValue} numberOfLines={1}>
                {identifier.value}
              </Text>
            </View>
          )}
        </View>
      </View>
    </View>
  );
});

const ManageEquipmentCard = ({ equipment }) => {
  const list = useMemo(() => (Array.isArray(equipment) ? equipment : []), [equipment]);
  if (!list.length) return null;

  const getKey = useCallback(
    (item, index) =>
      String(
        item?.id ??
          item?.macAddress ??
          item?.mac ??
          item?.ipAddress ??
          item?.ip ??
          `${index}`
      ),
    []
  );

  return (
    <View style={styles.container}>
      <View style={styles.card}>
        <View style={styles.header} accessibilityRole="header">
          <View
            style={styles.iconWrapper}
            accessible={false}
            importantForAccessibility="no-hide-descendants"
            accessibilityElementsHidden={true}
          >
            <MaterialCommunityIcons
              name="router-wireless"
              size={18}
              color={theme.colors.primary}
            />
          </View>
          <Text style={styles.headerTitle}>MY EQUIPMENT</Text>
        </View>

        {list.map((item, index) => (
          <EquipmentRow
            key={getKey(item, index)}
            item={item}
            isLast={index === list.length - 1}
          />
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

  header: cardHeader.container,
  iconWrapper: cardHeader.iconWrapper,
  headerTitle: cardHeader.title,

  equipmentItem: {
    flexDirection: "row",
    alignItems: "flex-start",
    paddingVertical: theme.spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
  },
  lastItem: { borderBottomWidth: 0 },

  equipmentInfo: {
    flex: 1,
    minWidth: 0,
  },
  equipmentName: {
    fontSize: theme.typography.size.base,
    fontWeight: "600",
    color: theme.colors.text.primary,
    marginBottom: 4,
  },
  equipmentDetails: { gap: 2 },

  detailRow: Layout.rowCenter,
  detailText: {
    fontWeight:'700',
    fontSize: theme.typography.size.base,
    color: theme.colors.text.secondary,
  },
  detailValue: {
    fontSize: theme.typography.size.base,
    fontWeight: "400",
    color: theme.colors.text.secondary,
  },

});

export default memo(ManageEquipmentCard);