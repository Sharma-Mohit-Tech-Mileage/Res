import React, { useState, useCallback, useEffect } from "react";
import {
  View,
  ScrollView,
  StyleSheet,
  RefreshControl,
  StatusBar,
} from "react-native";
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
import {
  MOCK_CURRENT_USAGE,
  MOCK_MONTHLY_USAGE,
  MOCK_DAILY_USAGE,
  MOCK_USAGE_PERIODS,
} from "./mockDataUsage";

const DataUsageContent = ({ navigation, route }) => {
  const insets = useSafeAreaInsets();
  const [activeTab, setActiveTab] = useState("monthly");
  const [refreshing, setRefreshing] = useState(false);
  const [selectedBar, setSelectedBar] = useState(null);
  const [selectedPeriod, setSelectedPeriod] = useState(MOCK_USAGE_PERIODS[0]);
  const [showRing, setShowRing] = useState(true);

  // Simulate loading different period data
  const [currentUsage, setCurrentUsage] = useState(MOCK_CURRENT_USAGE);
  const [monthlyData] = useState(MOCK_MONTHLY_USAGE);
  const [dailyData] = useState(MOCK_DAILY_USAGE);

  const usageData = activeTab === "monthly" ? monthlyData : dailyData;

  const handleTabChange = useCallback((tabId) => {
    setActiveTab(tabId);
    setSelectedBar(null);
  }, []);

  const handleBarPress = useCallback((item) => {
    setSelectedBar(item);
  }, []);

  const handlePeriodChange = useCallback((period) => {
    setSelectedPeriod(period);
    // In real app: fetch new data for this period
    console.log("Selected period:", period);
  }, []);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000));
    setRefreshing(false);
  }, []);

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
          />
        }
      >
       

        {/* Usage Summary with Ring */}
        <UsageSummaryCard
          currentUsage={currentUsage}
          dailyData={dailyData}
          showRing={showRing}
        />


        {/* Historical Usage Chart */}
        <UsageChart
          data={usageData}
          type={activeTab}
          onBarPress={handleBarPress}
          selectedBar={selectedBar}
          activeTab={activeTab}
          onTabChange={handleTabChange}
        />

        {/* Equipment */}
        <ManageEquipmentCard
          equipment={[
            {
              id: "1",
              name: "Sparklight Modem",
              type: "modem",
              model: "C3000Z",
              macId: "00:1A:2B:3C:4D:5E",
              connectionType: "Wired",
              location: "Living Room",
              connectedDevices: 8,
              icon: "router-wireless",
            },
            {
              id: "2",
              name: "eero Pro 6e",
              type: "router",
              model: "J010001",
              macId: "00:1A:2B:3C:4D:5F",
              connectionType: "Wireless",
              location: "Main Floor",
              connectedDevices: 12,
              icon: "wifi",
            },
          ]}
        />

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

        <View style={{ height: theme.spacing["3xl"] + insets.bottom }} />
      </ScrollView>
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
  gradientHeader: {
    position: "absolute",
    left: 0,
    right: 0,
    top: 0,
  },
  scrollView: container.page,
  scrollContent: {
    paddingTop: theme.spacing.md,
  },
  selectorContainer: {
    marginHorizontal: theme.spacing.base,
    marginBottom: theme.spacing.base,
  },
  paceContainer: {
    marginHorizontal: theme.spacing.base,
  },
});

export default DataUsageScreen;