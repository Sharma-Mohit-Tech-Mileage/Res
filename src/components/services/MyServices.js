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
import { theme } from "../../styles/theme";
import { container } from "../../styles/utilities";
import { gradientHeader } from "../../styles/compositions";
import ServiceHeader from "./sections/ServiceHeader";
import InternetCard from "./cards/InternetCard";
import VideoCard from "./cards/VideoCard";
import PhoneCard from "./cards/PhoneCard";
import StatusSection from "./sections/StatusSection";
import { useServiceDetails } from "./hooks/useServiceDetails";
import { useOutageStatus } from "./hooks/useOutageStatus";

const MyServices = ({ route }) => {
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
    <SafeAreaView style={styles.safeArea}>
      <StatusBar
        barStyle="light-content"
        backgroundColor={theme.colors.primary}
      />

      <LinearGradient
        style={styles.gradientHeader}
        locations={[0, 1]}
        colors={["rgba(53, 48, 145, 1)", "rgba(141, 59, 144, 1)"]}
        useAngle={true}
        angle={90}
      />

      <ServiceHeader />

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
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  gradientHeader,
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
