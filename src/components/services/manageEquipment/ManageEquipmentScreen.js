import AppStyles from "../../../styles/AppStyles";
import React, { useState, useCallback, useContext } from "react";
import {
  View,
  ScrollView,
  StyleSheet,
  RefreshControl,
  StatusBar,
} from "react-native";
import {
  useSafeAreaInsets,
} from "react-native-safe-area-context";
import { theme } from "../../../styles/theme";
import { container } from "../../../styles/utilities";
import ProfileSettingsHeader from "../../common/ProfileSettingsHeader";

import { BottomTabBarHeightContext } from "@react-navigation/bottom-tabs";
import { useFocusEffect } from "@react-navigation/native";
import dataUsageApi from "../../../network/apis/services/dataUsageService";
import { GetApiRequest } from "../../../network/RestApiClient";
import { isEeroEquipment } from "../dataUsage/transformEquipment";
import { getUser } from "../../../redux/utils/LocalStorage";
import { useSelector } from "react-redux";
import MyModemCard from "./MyModemCard";
import MyAddons from "./MyAddons";
import MySpeedCard from "./MySpeedCard";


const ManageEquipmentScreen = ({ navigation, route }) => {
  const insets = useSafeAreaInsets();
  const tabBarHeight = useContext(BottomTabBarHeightContext) ?? 0;
  const profile = useSelector((state) => state.profile || {});
  const accountNumber = profile.accountDetails?.account_number;
  const [eeroAccount, setEeroAccount] = useState(null);
  const [hasEeroDevice,setHasEeroDevice]=useState(false)
  const [refreshKey, setRefreshKey] = useState(0);
  const [refreshing, setRefreshing] = useState(false);

  useFocusEffect(useCallback(() => {
    let active = true;
    setEeroAccount(null);
    if (accountNumber) {
      dataUsageApi.getEquipment()
        .then(data => {
          if (active && Array.isArray(data?.equipments) && data.equipments.some(isEeroEquipment)) {
            setEeroAccount(accountNumber);
            setHasEeroDevice(true)
          }
        })
        .catch(() => {
          if (active) setEeroAccount(null);
        });
    }
   
    return () => { active = false; };
  }, [accountNumber, refreshKey]));

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    setRefreshKey(value => value + 1);
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
      <ProfileSettingsHeader title="Manage Equipment" onPressBack={handleBack} />
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={[styles.scrollContent, { paddingBottom: Math.max(tabBarHeight, insets.bottom) + theme.spacing["3xl"] + theme.spacing["2xl"] }]}
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

        <MyModemCard onReboot={() => navigation.navigate('RebootModem', { ip: route?.params?.ip })} />
        {hasEeroDevice && <MyAddons />}
        <MySpeedCard key={`${accountNumber}-${hasEeroDevice}`} hasEeroDevice={hasEeroDevice} onLoadEnd={onSpeedLoaded} refreshKey={refreshKey} navigation={navigation} hideModemSpeed={!hasEeroDevice} />




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
