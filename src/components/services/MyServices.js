import React, { useState, useCallback, useMemo, useEffect } from "react";
import { View, RefreshControl, StyleSheet } from "react-native";
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
import { useSelector, useDispatch } from "react-redux";
import { useFocusEffect } from "@react-navigation/native";
import { useAnnouncement } from '../../hooks/useAnnouncement';
import { extractZipCode } from "../utility/constant";
import { SERVICE_HEADER_GRADIENT } from "./utils/constants";
import { fetchCurrentUsageRequest } from "../../redux/actions/servicesActions";
import { ScreenScroll } from "../common/customui/Screen";
import {
  selectCurrentUsage,
  selectCurrentUsageLoading,
} from "../../redux/selectors/servicesSelectors";
 import ZendeskChatIcon from "../utility/ZendeskChatIcon";

const MyServicesContent = ({ route }) => {
  const { triggerOnScreenEntry } = useAnnouncement();
  const insets = useSafeAreaInsets();

  useFocusEffect(
    useCallback(() => {
      triggerOnScreenEntry('MyServicesStack');
    }, [triggerOnScreenEntry])
  );
  const dispatch = useDispatch();
  const accountDetails = useSelector((state) => state.profile?.accountDetails);
  const profileDetails =
    useSelector((state) => state.profile?.profileDetails) || {};
  const flagsReady = accountDetails?.services != null;

  const accountNumber = profileDetails.accountNumber || "";
  const legacySPA = accountDetails?.legacy_brand_by_spa;
  const { data, loading, error, refetch } = useServiceDetails(accountNumber);
  const { outageData, checking, checkStatus, clearOutageData } =
    useOutageStatus('services');
  const [refreshing, setRefreshing] = useState(false);
  const [hasUserInitiatedCheck, setHasUserInitiatedCheck] = useState(false);

  useFocusEffect(
    useCallback(() => {
      return () => setHasUserInitiatedCheck(false);
    }, [])
  );

  // Current usage for InternetCard dataPlan
  const currentUsage = useSelector(selectCurrentUsage);
  const currentUsageLoading = useSelector(selectCurrentUsageLoading);

  useEffect(() => {
    dispatch(fetchCurrentUsageRequest());
  }, [dispatch]);

  const dataPlan = useMemo(() => {
    if (!currentUsage) return null;
    return {
      usedGB: currentUsage.usedDataGB,
      totalGB: currentUsage.dataPlanGB,
      percentageUsed: currentUsage.dataUsedPercent,
    };
  }, [currentUsage]);

  const showInternet =
    loading || (!flagsReady ? true : accountDetails?.services?.hsd === true);
  const showVideo =
    loading || (!flagsReady ? true : accountDetails?.services?.video === true);
  const showPhone =
    loading || (!flagsReady ? true : accountDetails?.services?.phone === true);

  const zipCodeFromAccount = useMemo(() => {
    return extractZipCode(accountDetails?.service_address);
  }, [accountDetails]);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await refetch();
    dispatch(fetchCurrentUsageRequest());
    clearOutageData();
    setRefreshing(false);
  }, [refetch, clearOutageData, dispatch]);

  const handleCheckStatus = useCallback(() => {
    clearOutageData();
    setHasUserInitiatedCheck(true);
    checkStatus();
  }, [checkStatus, clearOutageData]);

  const handleCloseNotification = useCallback(() => {
    setHasUserInitiatedCheck(false);
    clearOutageData();
  }, [clearOutageData]);

  return (
    <View style={styles.safeArea}>
      <LinearGradient
        style={[styles.gradientHeader, { height: 88 + insets.top }]}
        locations={[0, 1]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1.3, y: 0}}
        colors={SERVICE_HEADER_GRADIENT}
      />

      <View style={{ paddingTop: insets.top + 27 }}>
        <ServiceHeader />
        <View style={{ position: "absolute", top: 60, right: 10, zIndex: 1 }}>
      <ZendeskChatIcon  screenName="My Services" />
      </View>
      </View>

      <ScreenScroll
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
          {showInternet && (
            <InternetCard
              planName={data?.internet?.planName?.toLowerCase()}
              downloadSpeed={data?.internet?.downloadSpeed}
              uploadSpeed={data?.internet?.uploadSpeed}
              loading={loading}
              dataPlan={dataPlan}
            />
          )}

          {showVideo && (
            <VideoCard
              planName={data?.video?.planName?.toLowerCase()}
              zipCode={zipCodeFromAccount}
              legacySpa={legacySPA}
              loading={loading}
            />
          )}

          {showPhone && (
            <PhoneCard
              planName={data?.phone?.planName?.toLowerCase()}
              legacyBrand={legacySPA}
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
          hasUserInitiatedCheck={hasUserInitiatedCheck}
        />

        <View style={{ height: theme.spacing["3xl"] + insets.bottom }} />
      </ScreenScroll>
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
