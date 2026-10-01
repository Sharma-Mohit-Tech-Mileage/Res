import AppStyles from "../../../styles/AppStyles";
import React, { useState, useCallback, useContext } from "react";
import {
  View,
  ScrollView,
  StyleSheet,
  RefreshControl,
  StatusBar,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { theme } from "../../../styles/theme";
import { container } from "../../../styles/utilities";
import ProfileSettingsHeader from "../../common/ProfileSettingsHeader";

import { BottomTabBarHeightContext } from "@react-navigation/bottom-tabs";
import { useFocusEffect } from "@react-navigation/native";
import dataUsageApi from "../../../network/apis/services/dataUsageService";
import {
  isEeroEquipment,
  isModemEquipment,
  transformEquipment,
} from "../dataUsage/transformEquipment";
import { useSelector } from "react-redux";
import MyModemCard from "./MyModemCard";
import MyAddons from "./MyAddons";
import MySpeedCard from "./MySpeedCard";

const ManageEquipmentScreen = ({ navigation, route }) => {
  const insets = useSafeAreaInsets();
  const tabBarHeight = useContext(BottomTabBarHeightContext) ?? 0;
  const profile = useSelector((state) => state.profile || {});
  const accountNumber = profile.accountDetails?.account_number;
  const [equipment, setEquipment] = useState(null);
  const [equipmentLoading, setEquipmentLoading] = useState(false);
  const [eeroEquipment, setEeroEquipment] = useState([]);
  const hasEeroDevice = eeroEquipment.length > 0;
  const [refreshKey, setRefreshKey] = useState(0);
  const [refreshing, setRefreshing] = useState(false);

  useFocusEffect(
    useCallback(() => {
      let active = true;
      setEquipment(null);
      setEeroEquipment([]);
      setEquipmentLoading(Boolean(accountNumber));
      if (accountNumber) {
        dataUsageApi
          .getEquipment()
          .then((data) => {
            if (!active) return;
            const devices = Array.isArray(data?.equipments)
              ? data.equipments
              : [];
            const modem =
              devices.find(isEeroEquipment) || devices.find(isModemEquipment);
            const modemDetails = transformEquipment({
              equipments: modem ? [modem] : [],
            })[0];
            setEquipment(
              modemDetails
                ? {
                    ...modemDetails,
                    name: isEeroEquipment(modem)
                      ? "Ero wifi"
                      : "Sparklight Modem",
                    identifierLabel: "Mac ID",
                  }
                : null,
            );
            setEeroEquipment(
              transformEquipment({
                equipments: devices.filter(isEeroEquipment),
              }),
            );
          })
          .catch(() => {
            if (active) setEquipment(null);
          })
          .finally(() => {
            if (active) setEquipmentLoading(false);
          });
      }

      return () => {
        active = false;
      };
    }, [accountNumber, refreshKey]),
  );

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    setRefreshKey((value) => value + 1);
  }, []);
  const onSpeedLoaded = useCallback(() => setRefreshing(false), []);

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
      <ProfileSettingsHeader
        title="Manage Equipment"
        onPressBack={handleBack}
      />
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={[
          styles.scrollContent,
          {
            paddingBottom:
              Math.max(tabBarHeight, insets.bottom) +
              theme.spacing["3xl"] +
              theme.spacing["2xl"],
          },
        ]}
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
        <MyModemCard
          loading={equipmentLoading}
          equipment={equipment}
          onReboot={() =>
            navigation.navigate("RebootModem", { ip: route?.params?.ip })
          }
        />
        {hasEeroDevice && <MyAddons equipment={eeroEquipment} />}
        <MySpeedCard
          key={`${accountNumber}-${hasEeroDevice}`}
          hasEeroDevice={hasEeroDevice}
          onLoadEnd={onSpeedLoaded}
          refreshKey={refreshKey}
          navigation={navigation}
          hideModemSpeed={!hasEeroDevice}
        />
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  scrollView: container.page,
  scrollContent: {
    ...AppStyles.headerCardSpacing,
  },
});

export default ManageEquipmentScreen;
