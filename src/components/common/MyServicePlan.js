import React, { useState, useEffect } from "react";
import colors from "../../res/Colors";
import strings from "../../res/Strings";
import InfoIcon from "../../res/svgIcons/InfoIcon";
import DataSpeedComponent from "./DataSpeedComponent";
import LinearGradient from "react-native-linear-gradient";
import SwipeUpDownModal from "react-native-swipe-modal-up-down";
import InternetIcon from "../../res/svgIcons/InternetIcon";
import { FontFamily, FontSize } from "../../../GlobalStyles";
import TickIcon from "../../res/svgIcons/TickIcon";
import { getUser } from "../../redux/utils/LocalStorage";
import { View, Text, StyleSheet, TouchableOpacity, Image, ScrollView } from "react-native";
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from "react-native-responsive-screen";
import { useSelector } from 'react-redux';
import TVIcon from "../../res/svgIcons/TVIcon";
import Phone from "../../res/svgIcons/Phone";
import { GetApiRequest } from "../../network/APIClient";

const MyServicePlan = ({ plans, tvPlan, phonePlan, navigation }) => {
  const [tabIndex, setTabIndex] = useState(0);
  const [showComment, setShowComment] = useState(false);
  const [animateModal, setAnimateModal] = useState(false);
  const [hasEeroDevice, setHasEeroDevice] = useState(false);
  const userInfo = useSelector(state => state.combinedReducers.profile);

  useEffect(() => {
    checkEeroDevice();
  }, []);

  const checkEeroDevice = () => {
    getUser().then((res) => {
      const request = `/mobile/api/Eero/GetEeroAccountDetails?accountnumber=${res.userInfo.accountNumber}`;
      GetApiRequest(request, (response) => {
        const networkId = response.data.networks[0]?.split('/').pop();
        if (networkId) {
          setHasEeroDevice(true);
        } else {
          setHasEeroDevice(false);
        }
      }, (error) => {
        console.log("error", error);
        setHasEeroDevice(false);
      });
    });
  };

  const MyPlanDetails = () => {
    return (
      <SwipeUpDownModal
        modalVisible={showComment}
        PressToanimate={animateModal}
        ContentModal={
          <View style={{ marginVertical: 10, borderRadius: 10 }}>
            <View style={styles.modelContainer} >
              <Text
                style={styles.modelChild}
                accessible={true}
                accessibilityLabel="Plan Details"
                accessibilityRole="header"
              >
                Plan Details
              </Text>
              <TouchableOpacity
                onPress={() => { setShowComment(false); }}
                accessible={true}
                accessibilityLabel="Close Plan Details"
                accessibilityHint="Closes the plan details modal"
              >
                <Image
                  style={{ height: 32, width: 32, overflow: "hidden" }}
                  resizeMode="cover"
                  source={require("../../../assets/right-actionable7.png")}
                  accessible={true}
                  accessibilityLabel="Close icon"
                />
              </TouchableOpacity>
            </View>
            <ScrollView style={{ marginBottom: hp('10%') }} contentContainerStyle={{ flexGrow: 1 }}>
              {plans && plans.map((item, index) => (
                <View key={index}>
                  <ServiceDetailsItem item={item} index={index} serviceType="internet" />
                </View>
              ))}
              {(userInfo.services?.iptv != undefined && userInfo.services.iptv) &&
                <ServiceMenuStatic key={30} planName={"Sparklight TV"} menuIcon='tv' serviceType={tvPlan?.planName || ''} />
              }
              {(userInfo.services?.basic && !userInfo.services?.iptv) &&
                <ServiceMenuStatic key={34} planName={"TV"} menuIcon='tv' serviceType={'Standard Cable TV'} />
              }
              {(userInfo.services?.phone || userInfo.services?.commercialPhone) &&
                <ServiceMenuStatic key={32} planName={"Phone"} menuIcon='phone' serviceType={'Standard Phone'} />
              }
            </ScrollView>
          </View>
        }
        ContentModalStyle={styles.Modal}
        onClose={() => {
          setShowComment(false);
          setAnimateModal(false);
        }}
      />
    );
  };

  const RenderTVIcon = () => {
    return (
      <TVIcon />
    )
  }

  const ServiceDetailsItem = ({ item, index, serviceType }) => {
    let IconComponent = InternetIcon;
    return (
      <View accessible accessibilityLabel={`Plan Details for ${serviceType} ${item.planName}`}>
        <View style={styles.planContainer} accessible accessibilityLabel={`${serviceType} Plan ${item.planName}`}>
          <LinearGradient
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            colors={["rgba(53, 48, 145, 1)", "rgba(141, 59, 144, 1)"]}
            style={styles.gradient}
          >
            <IconComponent accessible accessibilityLabel={`${serviceType} Icon`} />
          </LinearGradient>
          <Text style={styles.planDetailsRowHeader} accessibilityLabel={`${serviceType} ${item.planName}`}>
            {(serviceType && typeof serviceType === 'string') ? serviceType.charAt(0).toUpperCase() + serviceType.slice(1) : ''}
          </Text>
        </View>
        <View style={[styles.planDetailsRow]}>
          <View style={{ alignSelf: "center" }}>
            <TickIcon />
          </View>
          <Text style={styles.planDetailsTxt}>
            {item.planName} Download Speed Up To {item.downloadSpeed} Mbps
          </Text>
        </View>
        <View style={{ backgroundColor: colors.grey, height: 1, marginTop: 5 }} />
        <View style={[styles.planDetailsRow]}>
          <View style={{ alignSelf: "center" }}>
            <TickIcon />
          </View>
          <Text style={styles.planDetailsTxt}>
            {item.planName} Upload Speed Up To {item.uploadSpeed} Mbps
          </Text>
        </View>
        <View style={{ backgroundColor: colors.grey, height: 1, marginTop: 5 }} />
        <View style={styles.dataChild}>
          <View style={{ flexDirection: "row" }}>
            <View style={{ alignSelf: "center" }}>
              <TickIcon />
            </View>
            <Text style={styles.planDetailsTxt}>
              Data Plan {(item.dataQuotaGB == '15000') ? 'UNLIMITED' : item.dataQuotaGB + ' GB*'}
            </Text>
          </View>
        </View>
      </View>
    );
  };

  const ServiceMenuStatic = ({ itemindex, planName, menuIcon, serviceType }) => {
    let IconComponent;
    switch (menuIcon) {
      case 'tv':
        IconComponent = RenderTVIcon
        break;
      case 'phone':
        IconComponent = Phone;
        break;
      default:
        IconComponent = null;
    }

    const capitalizedServiceType = (serviceType && typeof serviceType === 'string') ? serviceType.charAt(0).toUpperCase() + serviceType.slice(1) : '';

    return (
      <View key={itemindex} accessible accessibilityLabel={`Plan Details for ${capitalizedServiceType} ${planName}`}>
        <View style={styles.planContainer} accessible accessibilityLabel={`${capitalizedServiceType} Plan ${planName}`}>
          <LinearGradient
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            colors={["rgba(53, 48, 145, 1)", "rgba(141, 59, 144, 1)"]}
            style={styles.gradient}
          >
            {IconComponent && <IconComponent accessible accessibilityLabel={`${capitalizedServiceType} Icon`} />}
          </LinearGradient>
          <Text style={styles.planDetailsRowHeader}>
            {planName}
          </Text>
        </View>
        {
          (planName === 'Phone') ? phonePlan.map((item) => {
            return (
              <>
                <DetailRow label={item} />
                <View style={{ backgroundColor: colors.grey, height: 1, marginTop: 2 }} />
              </>
            )
          }) : <DetailRow label={serviceType} />
        }
      </View>
    );
  };

  const DetailRow = ({ label }) => (
    <View style={styles.planDetailsRow}>
      <View style={{ alignSelf: "center" }}>
        <TickIcon />
      </View>
      <Text style={styles.planDetailsTxt}>
        {label}
      </Text>
    </View>
  );

  return (
    <View style={{ ...styles.card, ...styles.shadowProp, flexDirection: "column", marginBottom: hp("10%") }}>
      <View style={{ ...styles.subSec }}>
        <Text style={styles.subTitle}>{'My Speed'}</Text>
        <Text style={styles.date}>{plans[0]?.downloadSpeed ?? 0} Mbps</Text>
      </View>
      <View style={{ ...styles.subSec }}>
      </View>
      <View style={[styles.internetStatusSection, { marginHorizontal: 20 }]}>
        <View style={{ marginTop: 5 }}>
          <InfoIcon />
        </View>
        <View>
          <Text style={styles.internetStatusTxt}>
            {strings.test_speed_info}
          </Text>
          <View style={{ flexDirection: "row", marginLeft: 10, marginTop: 10 }}>
            <TouchableOpacity
              onPress={() => {
                navigation.navigate('ArticalWindowUtility', { url: 'https://support.sparklight.com/hc/en-us/articles/115010349927-Can-I-Run-an-Internet-Speed-Test-', name: ' More Details' })
              }}
            >
              <Text style={styles.learnMore}>{strings.learn_more}</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>

      <View style={styles.switchContainer}>
        <TouchableOpacity
          style={[
            tabIndex == 0 ? styles.selectedTab : styles.defaultTab,
            { 
              borderWidth: 1,
              ...(!hasEeroDevice ? { width: wp('80%') } : {})
            }
          ]}          
          onPress={() => setTabIndex(0)}>
          <Text style={{ color: tabIndex == 0 ? colors.sparklight_purple_blue : "#000", ...styles.usage }} >{" WiFi Speed"}
          </Text>
        </TouchableOpacity>
        {hasEeroDevice && (
          <TouchableOpacity
            style={[tabIndex == 1 ? styles.selectedTab : styles.defaultTab, { borderWidth: 1 }]}
            onPress={() => setTabIndex(1)}
          >
            <Text style={{ color: tabIndex == 1 ? colors.sparklight_purple_blue : "#000", ...styles.usage }}>
              {" Modem Speed"}
            </Text>
          </TouchableOpacity>
        )}
      </View>
      {tabIndex == 0 ? (
        <DataSpeedComponent navigation={navigation} speedType="wifi" hasEeroDevice={hasEeroDevice} />
      ) : (
        hasEeroDevice && <DataSpeedComponent navigation={navigation} speedType="modem" hasEeroDevice={hasEeroDevice}/>
      )}
      <MyPlanDetails />
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: "white",
    borderRadius: 2,
    paddingVertical: 15,
    width: wp("92%"),
  },
  shadowProp: {
    shadowColor: "#171717",
    shadowOffset: { width: -2, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
  },
  internetStatusTxt: {
    color: colors.darkest_grey,
    fontFamily: FontFamily.openSansRegular,
    fontSize: 14,
    marginLeft: 5,
    fontStyle: "normal",
    fontWeight: "400",
    lineHeight: 22,
  },
  learnMore: {
    color: colors.sparklight_purple_blue,
    fontSize: 14,
    fontFamily: FontFamily.openSansRegular,
    fontStyle: "normal",
    fontWeight: "400",
  },
  title: {
    color: "#101828",
    fontSize: 20,
    textAlign: "center",
    fontStyle: "normal",
    fontWeight: "400",
  },
  subTitle: {
    color: colors.darkest_grey,
    fontSize: 22,
    fontStyle: "normal",
    fontWeight: "400",
    fontFamily: FontFamily.openSansRegular,
  },
  usage: {
    fontSize: 16,
    fontStyle: "normal",
    textAlign: "center",
    fontFamily: FontFamily.openSansRegular,
    textAlignVertical: "center",
    fontWeight: "400",
  },
  modelContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginHorizontal: 20,
    marginVertical: 10,
  },
  modelChild: {
    textAlign: "center",
    fontSize: FontSize.size_3xl,
    color: colors.sparklight_grey,
    fontWeight: "400",
    fontFamily: FontFamily.openSansRegular,
  },
  internetStatusSection: {
    backgroundColor: "#EBEEF180",
    borderRadius: 10,
    padding: 10,
    marginTop: 10,
    flexDirection: "row",
  },
  switchContainer: {
    flexDirection: "row",
    justifyContent: "center",
    paddingHorizontal: wp("5%"),
    paddingTop: wp("5%")
  },
  date: {
    fontSize: 14,
    color: colors.sparklight_purple_blue,
    textAlignVertical: "center",
    marginLeft: 5,
    fontWeight: "600",
  },
  dataChild: {
    flexDirection: "column",
    padding: wp("4%"),
    marginLeft: 10,
  },
  subSec: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingRight: 5,
    marginHorizontal: 20
  },
  selectedTab: {
    backgroundColor: colors.grey,
    borderRadius: 0.5,
    borderColor: colors.grey,
    paddingVertical: 10,
    paddingHorizontal: 5,
    width: wp("40%"),
  },
  defaultTab: {
    backgroundColor: "white",
    borderRadius: 0.5,
    borderColor: colors.grey,
    paddingVertical: 10,
    paddingHorizontal: 5,
    width: wp("40%"),
  },
  gradient: {
    width: wp("10%"),
    height: wp("10%"),
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
    alignSelf: "center",
  },
  planContainer: {
    flexDirection: "row",
    backgroundColor: colors.backgound_blue,
    padding: wp("3%"),
  },
  Modal: {
    backgroundColor: "#fff",
    marginTop: hp("40%"),
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
  },
  planDetailsRow: {
    padding: wp("4%"),
    flexDirection: "row",
    marginLeft: 10,
  },
  planDetailsRowHeader: {
    color: colors.darkest_grey,
    fontSize: FontSize.size_3xl,
    marginLeft: 10,
    width: "90%",
    alignSelf: "center",
    fontFamily: FontFamily.openSansRegular,
  },
  planDetailsTxt: {
    color: colors.darkest_grey,
    fontSize: FontSize.size_base,
    fontFamily: FontFamily.openSansRegular,
    marginLeft: 10,
    fontWeight: "400",
  },
});

export default MyServicePlan;
