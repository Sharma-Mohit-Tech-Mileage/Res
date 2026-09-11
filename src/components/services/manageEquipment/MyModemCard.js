import React, { useEffect } from "react";
import { View, Text, StyleSheet, Platform, useWindowDimensions } from "react-native";

import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import { theme } from '../../../styles/theme'
import { cardHeader } from "../../../styles/compositions";
import AppStyles from "../../../styles/AppStyles";
import { SectionTitle } from "../../common/customui/Typography"




const MyModemCard = ({ currentUsage, loading = false }) => {
  const { width: windowWidth } = useWindowDimensions();
  const donutSize = Math.min(220, Math.max(140, Math.floor(windowWidth * 0.32)));

  if (!currentUsage || loading) {
    return (
      <View style={styles.container}>
        <View style={styles.card}>
          <View style={styles.header}>
            <View style={styles.iconWrapper} accessible={false} importantForAccessibility="no-hide-descendants" accessibilityElementsHidden={true}>
              <MaterialCommunityIcons name="chart-donut" size={20} color={theme.colors.primary} />
            </View>
            <Text style={styles.headerTitle} accessibilityRole="header">DATA USAGE</Text>
          </View>
          <View style={{ height: 200, alignItems: "center", justifyContent: "center" }}>
            <Text style={styles.statLabel}>Loading usage data...</Text>
          </View>
        </View>
      </View>
    );
  }

 

  return (
    <View style={styles.container}>
      <View style={styles.card}>
        <View style={styles.header}>
          
          <SectionTitle accessibilityRole="header">
            My Modem
          </SectionTitle>
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
     ...AppStyles.card,
    padding: theme.spacing.base,
  },
  header: cardHeader.container,
  headerTitle: cardHeader.title,
  textLabel: {
    alignItems: 'flex-start',
  },
  labelText: {
    fontSize: theme.typography.size.base,
    fontFamily: theme.typography.family.regular,
    color: theme.colors.text.secondary,
    fontWeight: '700',
  },
  labelSubtext: {
    fontSize: theme.typography.size.sm,
    fontFamily: theme.typography.family.regular,
    color: theme.colors.text.secondary,
    marginTop: 1,
  },
  stats: {
    flexDirection: "row",
    gap: theme.spacing.xs,
  },
  statBox: {
    flex: 1,
    alignItems: "center",
    paddingVertical: theme.spacing.sm,
    paddingHorizontal: theme.spacing["2xs"],
    backgroundColor: theme.colors.surfaceVariant,
    borderRadius: theme.radius.base,
  },
  statValue: {
    fontSize: theme.typography.size.sm,
    fontFamily: theme.typography.family.semiBold,
    fontWeight: "600",
    color: theme.colors.text.primary,
    textAlign: "center",
    marginVertical: 2,
  },
  statLabel: {
    fontSize: theme.typography.size.sm,
    fontFamily: theme.typography.family.regular,
    color: theme.colors.text.secondary,
    textAlign: "center",
  },
  iconWrapper: cardHeader.iconWrapper,
});

export default MyModemCard;
