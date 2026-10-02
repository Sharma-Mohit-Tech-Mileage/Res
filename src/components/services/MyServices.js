import React, { useState, useCallback, useMemo, useEffect } from "react";
import { View, RefreshControl, StyleSheet } from "react-native";
import {
  SafeAreaProvider,
  useSafeAreaInsets,
} from "react-native-safe-area-context";
import { theme } from "../../styles/theme";
import { container } from "../../styles/utilities";
import TabRootHeader from "../common/TabRootHeader";
import SupportIcon from "../../res/svgIcons/SupportIcon";
import InternetCard from "./cards/InternetCard";
import VideoCard from "./cards/VideoCard";
import PhoneCard from "./cards/PhoneCard";
import StatusSection from "./sections/StatusSection";
import PrimaryButton from "../common/customui/PrimaryButton";
import { useServiceDetails } from "./hooks/useServiceDetails";
import { useOutageStatus } from "./hooks/useOutageStatus";
import { useSelector, useDispatch } from "react-redux";
import { useFocusEffect } from "@react-navigation/native";
import { useAnnouncement } from '../../hooks/useAnnouncement';
import { extractZipCode } from "../utility/constant";
import { fetchCurrentUsageRequest } from "../../redux/actions/servicesActions";
import { ScreenScroll } from "../common/customui/Screen";
import {
  selectCurrentUsage,
  selectCurrentUsageLoading,
} from "../../redux/selectors/servicesSelectors";

const MyServicesContent = ({ route, navigation }) => {
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
      <TabRootHeader
        chatScreenName="My Services"
        icon={<SupportIcon color={theme.colors.text.onPrimary} filled={true} />}
        title="Services"
        titleProps={{
          accessibilityLabel: "Services",
          accessibilityRole: "header",
          accessibilityLevel: 2,
          nativeID: "services-header",
        }}
      />

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

        <PrimaryButton
          title="Manage Equipment"
          buttonType="outline"
          onPress={() => navigation.navigate("manageEquipment")}
          containerStyle={styles.manageEquipmentButton}
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
  scrollView: container.page,
  scrollContent: {
    paddingBottom: theme.spacing["3xl"],
  },
  servicesContainer: {
    backgroundColor: theme.colors.background,
    paddingTop: theme.spacing.base,
  },
  manageEquipmentButton: {
    marginHorizontal: theme.spacing.base,
    marginTop: theme.spacing.base,
  },
});

export default MyServices;
