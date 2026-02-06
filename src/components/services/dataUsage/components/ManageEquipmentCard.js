import React, { memo, useMemo, useCallback } from "react";
import { View, Text, StyleSheet } from "react-native";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import { theme } from "../../../../styles/theme";
import { card } from "../../../../styles/utilities";
const safeText = (v, fallback = "—") =>
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
  if (normalize(item?.macAddress || item?.mac)) {
    return { label: "MAC ID", value: safeText(item?.macAddress || item?.mac) };
  }
  if (normalize(item?.ipAddress || item?.ip)) {
    return { label: "IP Address", value: safeText(item?.ipAddress || item?.ip) };
  }
  return null;
};

const buildA11yLabel = (item) => {
  const name = safeText(item?.name, "Provider equipment");
  const model = safeText(item?.model);
  const connection = safeText(item?.connectionType);
  const location = safeText(item?.location);

  const identifier = getIdentifier(item);
  const idText = identifier ? ` ${identifier.label} ${identifier.value}.` : "";

  return `${name}. Model ${model}. ${connection} connection. Located in ${location}.${idText}`;
};

const EquipmentRow = memo(function EquipmentRow({ item, isLast }) {
  const icon = useMemo(() => getEquipmentIcon(item), [item]);
  const identifier = useMemo(() => getIdentifier(item), [item]);
  const a11yLabel = useMemo(() => buildA11yLabel(item), [item]);

  const connectionIcon =
    String(item?.connectionType).toLowerCase() === "wired" ? "ethernet" : "wifi";

  return (
    <View
      style={[styles.equipmentItem, isLast && styles.lastItem]}
      accessible
      accessibilityRole="text"
      accessibilityLabel={a11yLabel}
    >
      <View
        style={styles.equipmentIconWrapper}
        accessible={false}
        importantForAccessibility="no-hide-descendants"
      >
       
      </View>

      <View style={styles.equipmentInfo}>
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
              <MaterialCommunityIcons
                name="identifier"
                size={12}
                color={theme.colors.text.secondary}
                style={styles.inlineIcon}
              />
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
          >
            <MaterialCommunityIcons
              name="router-wireless"
              size={16}
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
    fontWeight: "600",
    color: theme.colors.text.secondary,
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },

  equipmentItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: theme.spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
  },
  lastItem: { borderBottomWidth: 0 },

  equipmentIconWrapper: {
   
    borderRadius: 20,
    backgroundColor: theme.colors.surfaceVariant,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 25,
  },

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

  detailRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  detailText: {
    fontSize: theme.typography.size.xs,
    color: theme.colors.text.secondary,
  },
  detailValue: {
    fontSize: theme.typography.size.xs,
    fontWeight: "600",
    color: theme.colors.text.primary,
  },
  detailDot: {
    marginHorizontal: 6,
    fontSize: theme.typography.size.xs,
    color: theme.colors.text.tertiary,
  },
  inlineIcon: { marginRight: 4 },

  homeBadge: {
    marginLeft: theme.spacing.sm,
    padding: 6,
    borderRadius: theme.radius.xs,
    backgroundColor: theme.colors.surfaceVariant,
  },
});

export default memo(ManageEquipmentCard);