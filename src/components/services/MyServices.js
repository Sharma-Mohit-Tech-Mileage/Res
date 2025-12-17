import React, { useState, useCallback } from "react";
import {
  View,
  ScrollView,
  RefreshControl,
  StyleSheet,
  StatusBar,
} from "react-native";
import {
  SafeAreaProvider,
  useSafeAreaInsets,
} from "react-native-safe-area-context";
import LinearGradient from "react-native-linear-gradient";
import { theme } from "../../styles/theme";
import { container } from "../../styles/utilities";
import ServiceHeader from "./sections/ServiceHeader";
import InternetCard from "./cards/InternetCard";
import VideoCard from "./cards/VideoCard";
import PhoneCard from "./cards/PhoneCard";
import StatusSection from "./sections/StatusSection";
import { useServiceDetails } from "./hooks/useServiceDetails";
import { useOutageStatus } from "./hooks/useOutageStatus";
import { useSelector } from "react-redux";
const MyServicesContent = ({ route }) => {
  const insets = useSafeAreaInsets();
  const accountDetails = useSelector((state) => state.profile?.accountDetails);
  const accountNumber = route?.params?.accountNumber || "123456789";
  const { data, loading, error, refetch } = useServiceDetails(accountNumber);
  const { outageData, checking, checkStatus, clearOutageData } =
    useOutageStatus();
  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await refetch();
    clearOutageData();
    setRefreshing(false);
  }, [refetch, clearOutageData]);

  const handleCheckStatus = useCallback(() => {
    checkStatus();
  }, [checkStatus]);

  const handleCloseNotification = useCallback(() => {
    clearOutageData();
  }, [clearOutageData]);

  return (
    <View style={styles.safeArea}>
      <StatusBar
        barStyle="light-content"
        backgroundColor="transparent"
        translucent={true}
      />

      <LinearGradient
        style={[styles.gradientHeader, { height: 88 + insets.top }]}
        locations={[0, 1]}
        colors={["rgba(53, 48, 145, 1)", "rgba(141, 59, 144, 1)"]}
        useAngle={true}
        angle={90}
      />

      <View style={{ paddingTop: insets.top + 27 }}>
        <ServiceHeader />
      </View>

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
        <View style={styles.servicesContainer}>
          {/* Internet Service */}
          {data?.internet?.hasService && (
            <InternetCard
              planName={data.internet.planName}
              downloadSpeed={data.internet.downloadSpeed}
              uploadSpeed={data.internet.uploadSpeed}
              loading={loading}
            />
          )}

          {/* Video Service */}
          {data?.video?.hasService && (
            <VideoCard
              planName={data.video.planName}
              zipCode={data.video.zipCode}
              loading={loading}
            />
          )}

          {/* Phone Service */}
          {data?.phone?.hasService && (
            <PhoneCard
              planName={data.phone.planName}
              legacyBrand={data.phone.legacyBrand}
              loading={loading}
            />
          )}
        </View>

        {/* Service Status Section */}
        <StatusSection
          onCheckStatus={handleCheckStatus}
          outageData={outageData}
          checking={checking}
          onCloseNotification={handleCloseNotification}
        />
      </ScrollView>
    </View>
  );
};

const MyServices = (props) => (
  <SafeAreaProvider>
    <MyServicesContent {...props} />
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
    paddingBottom: theme.spacing["3xl"],
  },
  servicesContainer: {
    backgroundColor: theme.colors.background,
    paddingTop: theme.spacing.base,
  },
});

export default MyServices;
