/**
 * DataUsageScreen - Main Screen
 * Path: src/components/services/dataUsage/DataUsageScreen.js
 * 
 * Main data usage screen with:
 * - Usage summary (horizontal bar)
 * - Historical usage chart (with tabs)
 * - Equipment management
 * - eero promo
 * - Pull to refresh
 */

import React, { useState, useCallback } from "react";
import { 
  View, 
  ScrollView, 
  StyleSheet, 
  RefreshControl, 
  StatusBar 
} from "react-native";
import {
  SafeAreaProvider,
  useSafeAreaInsets,
} from "react-native-safe-area-context";
import LinearGradient from "react-native-linear-gradient";
import { theme } from "../../../styles/theme";
import { container } from "../../../styles/utilities";
import ProfileSettingsHeader from "../../common/ProfileSettingsHeader";
import UsageSummaryCard from "./components/UsageSummaryCard";
import UsageChart from "./components/UsageChart";
import ManageEquipmentCard from "./components/ManageEquipmentCard";
import EeroPromoCard from "./components/EeroPromoCard";
import MOCK_DATA_USAGE, { getUsageByPeriod } from "./mockDataUsage";

const DataUsageContent = ({ navigation, route }) => {
  const insets = useSafeAreaInsets();
  const [activeTab, setActiveTab] = useState("monthly");
  const [refreshing, setRefreshing] = useState(false);
  const [selectedBar, setSelectedBar] = useState(null);

  // Get route params (from InternetCard navigation)
  const { planName, downloadSpeed, uploadSpeed } = route?.params || {};

  // Get usage data based on active tab
  const usageData = getUsageByPeriod(activeTab);

  // Handle tab change
  const handleTabChange = useCallback((tabId) => {
    setActiveTab(tabId);
    setSelectedBar(null); // Reset selection on tab change
  }, []);

  // Handle bar selection
  const handleBarPress = useCallback((item) => {
    setSelectedBar(item);
  }, []);

  // Handle pull to refresh
  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    setRefreshing(false);
  }, []);

  // Handle back navigation
  const handleBack = () => {
    navigation.goBack();
  };

  return (
    <View style={styles.safeArea}>
      {/* Header with Back Button */}
      <View >
        <ProfileSettingsHeader
          title="Data Usage"
          onPressBack={handleBack}
          accessibleLable="Data Usage. Double tap back button to return to services"
        />
      </View>

      {/* Scrollable Content */}
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor={theme.colors.primary}
            colors={[theme.colors.primary]}
            progressViewOffset={20}
          />
        }
        accessible={false}
        importantForAccessibility="no-hide-descendants"
      >
        {/* 1. Usage Summary Card */}
        <UsageSummaryCard
          dataPlan={MOCK_DATA_USAGE.dataPlan}
          billingCycle={MOCK_DATA_USAGE.billingCycle}
        />

        {/* 2. Historical Usage Chart (with tabs attached) */}
        <UsageChart
          data={usageData}
          type={activeTab}
          onBarPress={handleBarPress}
          selectedBar={selectedBar}
          activeTab={activeTab}
          onTabChange={handleTabChange}
        />

        {/* 3. Manage Equipment Card */}
        <ManageEquipmentCard equipment={MOCK_DATA_USAGE.equipment} />

        {/* 4. eero Promo Card */}
        <EeroPromoCard promoData={MOCK_DATA_USAGE.eeroPromo} />

        {/* Bottom Safe Area Spacing */}
        <View style={{ height: theme.spacing["3xl"] + insets.bottom }} />
      </ScrollView>
    </View>
  );
};

// Wrap with SafeAreaProvider
const DataUsageScreen = (props) => (
  <SafeAreaProvider>
    <DataUsageContent {...props} />
  </SafeAreaProvider>
);

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  gradientHeader: {
    position: "absolute",
    left: 0,
    right: 0,
    top: 0,
    zIndex: 0,
  },
  scrollView: {
    ...container.page,
  },
  scrollContent: {
    paddingTop: theme.spacing.md,
  },
});

export default DataUsageScreen;