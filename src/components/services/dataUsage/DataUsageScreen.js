import React, { useState, useCallback, useMemo } from "react";
import { View, StyleSheet, RefreshControl, StatusBar } from "react-native";
import {
  SafeAreaProvider,
  useSafeAreaInsets,
} from "react-native-safe-area-context";
import { theme } from "../../../styles/theme";
import { container } from "../../../styles/utilities";
import ProfileSettingsHeader from "../../common/ProfileSettingsHeader";
import UsageSummaryCard from "./components/UsageSummaryCard";
import UsageChart from "./components/UsageChart";
import ManageEquipmentCard from "./components/ManageEquipmentCard";
import EeroPromoCard from "./components/EeroPromoCard";
import { useDataUsage } from "../hooks/useDataUsage";
import { ScreenScroll } from "../../common/customui/Screen";

const DataUsageContent = ({ navigation, route }) => {
  const insets = useSafeAreaInsets();
  const [activeTab, setActiveTab] = useState("daily");
  const [refreshing, setRefreshing] = useState(false);
  const [selectedBar, setSelectedBar] = useState(null);
  const [selectedPeriodIndex, setSelectedPeriodIndex] = useState(null);

  const {
    currentUsage,
    currentUsageLoading,
    monthlyUsage,
    monthlyUsageLoading,
    dailyUsage,
    dailyUsageLoading,
    periodItems,
    usagePeriodsLoading,
    fetchDailyForPeriod,
    refetchAll,
    equipment,
  } = useDataUsage();

  // Default to last period (most recent) once loaded
  const activePeriodIndex = selectedPeriodIndex ?? (periodItems.length > 0 ? periodItems.length - 1 : 0);

  // Period dropdown labels for SparkLightDropdown
  const periodLabels = useMemo(
    () => periodItems.map((p) => p.label),
    [periodItems]
  );

  const selectedPeriodLabel = periodLabels[activePeriodIndex] || "";

  const usageData = activeTab === "monthly" ? (monthlyUsage || []) : (dailyUsage || []);
  const showRing = true;

  const handleTabChange = useCallback((tabId) => {
    setActiveTab(tabId);
    setSelectedBar(null);
  }, []);

  const handleBarPress = useCallback((item) => {
    setSelectedBar(item);
  }, []);

  const handlePeriodChange = useCallback(
    (label) => {
      const idx = periodLabels.indexOf(label);
      if (idx >= 0) {
        setSelectedPeriodIndex(idx);
        fetchDailyForPeriod(periodItems[idx]);
        setSelectedBar(null);
      }
    },
    [periodLabels, periodItems, fetchDailyForPeriod]
  );

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    refetchAll();
    // Give APIs a moment, then clear refreshing
    await new Promise((resolve) => setTimeout(resolve, 1500));
    setRefreshing(false);
  }, [refetchAll]);

  const handleBack = () => {
    navigation.goBack();
  };

  return (
    <View style={styles.safeArea}>
      <StatusBar
        barStyle="light-content"
        backgroundColor="transparent"
        translucent
      />
      <ProfileSettingsHeader title="Data Usage" onPressBack={handleBack} />
      <ScreenScroll
        framed
        stack
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor={theme.colors.primary}
            colors={[theme.colors.primary]}
          />
        }
      >

        {/* Usage Summary with Ring */}
        <UsageSummaryCard
          currentUsage={currentUsage}
          dailyData={dailyUsage || []}
          showRing={showRing}
          loading={currentUsageLoading}
        />

        {/* Historical Usage Chart */}
        <UsageChart
          data={usageData}
          type={activeTab}
          onBarPress={handleBarPress}
          selectedBar={selectedBar}
          activeTab={activeTab}
          onTabChange={handleTabChange}
          periodLabels={periodLabels}
          selectedPeriodLabel={selectedPeriodLabel}
          onPeriodChange={handlePeriodChange}
          loading={activeTab === "monthly" ? monthlyUsageLoading : dailyUsageLoading}
        />

        <ManageEquipmentCard equipment={equipment} />

        {/* eero Promo */}
        <EeroPromoCard
          promoData={{
            show: true,
            appName: "eero",
            tagline: "eero app simplifies connectivity",
            iosUrl: "https://apps.apple.com/us/app/eero-wifi-system/id1023499075",
            androidUrl:
              "https://play.google.com/store/apps/details?id=com.eero.android&pcampaignid=web_share",
          }}
        />

      </ScreenScroll>
    </View>
  );
};

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
  scrollView: container.page,
});

export default DataUsageScreen;
