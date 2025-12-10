import React, { useState, useCallback } from "react";
import {
  View,
  ScrollView,
  RefreshControl,
  StyleSheet,
  StatusBar,
  SafeAreaView,
} from "react-native";
import LinearGradient from "react-native-linear-gradient";
import { Color, Padding } from "../../../GlobalStyles";
import ServiceHeader from "./components/ServiceHeader";
import InternetServiceCard from "./components/InternetServiceCard";
import VideoServiceCard from "./components/VideoServiceCard";
import PhoneServiceCard from "./components/PhoneServiceCard";
import ServiceStatusSection from "./components/ServiceStatusSection";
import { useServiceDetails } from "./hooks/useServiceDetails";
import { useOutageStatus } from "./hooks/useOutageStatus";

/**
 * MyServices Screen
 * Main container for the Services tab
 * Displays all service cards and status checking functionality
 */
const MyServices = ({ route }) => {
  // Get account number from route params or use mock
  const accountNumber = route?.params?.accountNumber || "123456789";

  // Fetch service details
  const { data, loading, error, refetch } = useServiceDetails(accountNumber);

  // Outage status checking
  const { outageData, checking, checkStatus, clearOutageData } =
    useOutageStatus();

  // Pull to refresh state
  const [refreshing, setRefreshing] = useState(false);

  /**
   * Handle pull to refresh
   */
  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await refetch();
    clearOutageData();
    setRefreshing(false);
  }, [refetch, clearOutageData]);

  /**
   * Handle check service status button press
   */
  const handleCheckStatus = useCallback(() => {
    checkStatus();
  }, [checkStatus]);

  /**
   * Handle closing outage notification
   */
  const handleCloseNotification = useCallback(() => {
    clearOutageData();
  }, [clearOutageData]);

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar
        barStyle="light-content"
        backgroundColor={Color.sparklightBrightPurple}
      />

      {/* Purple Gradient Header Background */}
      <LinearGradient
        style={styles.linearGradientStyle}
        locations={[0, 1]}
        colors={["rgba(53, 48, 145, 1)", "rgba(141, 59, 144, 1)"]}
        useAngle={true}
        angle={90}
      />
      <ServiceHeader />

      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.contentContainer}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor={Color.sparklightBrightPurple}
            colors={[Color.sparklightBrightPurple]}
          />
        }
      >
        {/* Header Section */}

        {/* Service Cards Container */}
        <View style={styles.servicesContainer}>
          {/* Internet Service */}
          {data?.internet?.hasService && (
            <InternetServiceCard
              planName={data.internet.planName}
              downloadSpeed={data.internet.downloadSpeed}
              uploadSpeed={data.internet.uploadSpeed}
              loading={loading}
            />
          )}

          {/* Video Service */}
          {data?.video?.hasService && (
            <VideoServiceCard
              planName={data.video.planName}
              zipCode={data.video.zipCode}
              loading={loading}
            />
          )}

          {/* Phone Service */}
          {data?.phone?.hasService && (
            <PhoneServiceCard
              planName={data.phone.planName}
              legacyBrand={data.phone.legacyBrand}
              loading={loading}
            />
          )}
        </View>

        {/* Service Status Section */}
        <ServiceStatusSection
          onCheckStatus={handleCheckStatus}
          outageData={outageData}
          checking={checking}
          onCloseNotification={handleCloseNotification}
        />
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: Color.backgroundBlur,
  },
  linearGradientStyle: {
    position: "absolute",
    left: 0,
    right: 0,
    top: 0,
    height: 150,
  },
  container: {
    flex: 1,
  },
  contentContainer: {
    paddingBottom: Padding.p_37xl,
  },
  servicesContainer: {
    backgroundColor: Color.backgroundBlur,
    paddingTop: Padding.p_base,
  },
});

export default MyServices;
