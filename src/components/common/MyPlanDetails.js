import React from "react";
import { View, Text, TouchableOpacity, Image, ScrollView, StyleSheet } from "react-native";
import SwipeUpDownModal from "react-native-swipe-modal-up-down";
import { useSelector } from 'react-redux';
import colors from "../../res/Colors";
import { heightPercentageToDP as hp ,widthPercentageToDP as wp} from "react-native-responsive-screen";
import { FontFamily, FontSize } from "../../../GlobalStyles";
import TickIcon from "../../res/svgIcons/TickIcon";
import InternetIcon from "../../res/svgIcons/InternetIcon";
import TVIcon from "../../res/svgIcons/TVIcon";
import Phone from "../../res/svgIcons/Phone";
import LinearGradient from "react-native-linear-gradient";

const MyPlanDetails = ({ showComment, setShowComment, plans, tvPlan, phonePlan }) => {
  const userInfo = useSelector(state => state.combinedReducers.profile);

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
            {serviceType.charAt(0).toUpperCase() + serviceType.slice(1)}
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
        IconComponent = TVIcon;
        break;
      case 'phone':
        IconComponent = Phone;
        break;
      default:
        IconComponent = null;
    }

    const capitalizedServiceType = serviceType.charAt(0).toUpperCase() + serviceType.slice(1);

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
    <SwipeUpDownModal
      modalVisible={showComment}
      ContentModal={
        <View style={{ marginVertical: 10, borderRadius: 10 }}>
          <View style={styles.modelcontainer} >
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
            {((userInfo.services?.iptv != undefined && userInfo.services.iptv)) &&
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
      }}
    />
  );
};

const styles = StyleSheet.create({
  modelcontainer: {
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
  planContainer: {
    flexDirection: "row",
    backgroundColor: colors.backgound_blue,
    padding: wp("3%"),
  },
  gradient: {
    width: wp("10%"),
    height: wp("10%"),
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
    alignSelf: "center",
  },
  planDetailsRowHeader: {
    color: colors.darkest_grey,
    fontSize: FontSize.size_3xl,
    marginLeft: 10,
    width: "90%",
    alignSelf: "center",
    fontFamily: FontFamily.openSansRegular,
  },
  planDetailsRow: {
    padding: wp("4%"),
    flexDirection: "row",
    marginLeft: 10,
  },
  planDetailsTxt: {
    color: colors.darkest_grey,
    fontSize: FontSize.size_base,
    fontFamily: FontFamily.openSansRegular,
    marginLeft: 10,
    fontWeight: "400",
  },
  dataChild: {
    flexDirection: "column",
    padding: wp("4%"),
    marginLeft: 10,
  },
  Modal: {
    backgroundColor: "#fff",
    marginTop: hp("40%"),
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
  },
});

export default MyPlanDetails;
