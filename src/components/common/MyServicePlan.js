import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  Button,
  StyleSheet,
  TouchableOpacity,
  Image,
} from "react-native";
import colors from "../../res/Colors";
import InfoIcon from "../../res/svgIcons/InfoIcon";
import DataSpeedComponent from "./DataSpeedComponent";
import DataUsageComponent from "./DataUsageComponent";
import strings from "../../res/Strings";
import LinearGradient from "react-native-linear-gradient";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import SwipeUpDownModal from "react-native-swipe-modal-up-down";
import InternetIcon from "../../res/svgIcons/InternetIcon";
import { Color, FontFamily, FontSize } from "../../../GlobalStyles";
import TickIcon from "../../res/svgIcons/TickIcon";

const MyServicePlan = ({ plans }) => {
  const [tabIndex, setTabIndex] = useState(0);
  const [ShowComment, setModelComment] = useState(false);
  const [animateModal, setanimateModal] = useState(false);

  const MyPlanDetails = () => {
    useEffect(() => {}, []);

    const PlanDetailsItem = ({ item, index }) => {
      console.log("PlanDetailsItem", item);
      return (
        <View key={index}>
          <View
            style={{
              flexDirection: "row",
              backgroundColor: colors.backgound_blue,
              padding: wp("3%"),
            }}
          >
            <LinearGradient
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              colors={["rgba(53, 48, 145, 0.78)", "rgba(141, 59, 144, 0.9)"]}
              style={{
                width: wp("10%"),
                height: wp("10%"),
                borderRadius: 10,
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <InternetIcon />
            </LinearGradient>
            <Text style={styles.planDetailsRowHeader}>
              Internet {item.planName}
            </Text>
          </View>

          <View style={[styles.planDetailsRow]}>
            <TickIcon />
            <Text style={styles.planDetailsTxt}>
              Download Speed Up To {item.downloadSpeed} Mbps
            </Text>
          </View>

          <View
            style={{ backgroundColor: colors.grey, height: 1, marginTop: 5 }}
          />
          <View style={[styles.planDetailsRow]}>
            <TickIcon />
            <Text style={styles.planDetailsTxt}>
              Upload Speed Up To {item.uploadSpeed} Mbps
            </Text>
          </View>
          <View
            style={{ backgroundColor: colors.grey, height: 1, marginTop: 5 }}
          />
          <View
            style={{
              flexDirection: "column",
              padding: wp("4%"),
              marginLeft: 10,
            }}
          >
            <View style={{ flexDirection: "row" }}>
              <TickIcon />
              <Text style={styles.planDetailsTxt}>
                Data Plan {item.dataQuotaGB}GB*
              </Text>
            </View>
            <Text
              style={{
                fontSize: FontSize.size_xs,
                color: colors.sparklight_grey,
                fontWeight: "400",
                marginLeft: 10,
                marginTop: 5,
              }}
            >
              * $10 charge for each add'l 100GB; Up to $40/mo.
            </Text>
          </View>
          <View
            style={{
              backgroundColor: colors.grey,
              height: 1,
              width: "100%",
              marginTop: 5,
            }}
          />
        </View>
      );
    };

    return (
      <SwipeUpDownModal
        modalVisible={ShowComment}
        PressToanimate={animateModal}
        ContentModal={
          <View style={{ marginVertical: 10, borderRadius: 10 }}>
            <View
              style={{ flexDirection: "row", flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'center',
            marginHorizontal:20,
          marginVertical:10}}
            >
              <Text style={{textAlign:'center',fontSize:FontSize.size_3xl,color:colors.sparklight_grey,fontWeight:'400'}}>Plan Details</Text>
              <TouchableOpacity onPress={()=>{
                setModelComment(false)
              }}>
              <Image 
                style={{ height: 32, width: 32, overflow: "hidden" }}
                resizeMode="cover"
                source={require("../../../assets/right-actionable7.png")}
              />
              </TouchableOpacity>
            </View>
            {plans.map((item, index) => {
              return <PlanDetailsItem item={item} index={index} key={index} />;
            })}
          </View>
        }
        ContentModalStyle={styles.Modal}
        onClose={() => {
          setModelComment(false);
          setanimateModal(false);
        }}
      />
    );
  };

  useEffect(() => {
    //console.log("data");
  }, []);
  return (
    <View
      style={[
        styles.card,
        styles.shadowProp,
        { flexDirection: "column", marginBottom: hp("10%") },
      ]}
    >
      <View style={styles.subSec}>
        <Text style={styles.subTitle}>{strings.my_service_txt}</Text>
        <TouchableOpacity
          style={{ flexDirection: "row", alignItems: "center" }}
          onPress={() => setModelComment(true)}
        >
          <InfoIcon />
          <Text style={styles.date}>{strings.my_plan_details_txt}</Text>
        </TouchableOpacity>
      </View>

      <View
        style={{
          flexDirection: "row",
          justifyContent: "center",
          marginTop: wp("5%"),
        }}
      >
        <TouchableOpacity
          style={[
            tabIndex == 0 ? styles.selectedTab : styles.defaultTab,
            { borderBottomWidth: 2, borderTopWidth: 2, borderLeftWidth: 2 },
          ]}
          onPress={() => setTabIndex(0)}
        >
          <Text
            style={{
              color: tabIndex == 0 ? "white" : "#000",
              fontSize: 16,
              fontStyle: "normal",
              fontWeight: "400",
            }}
          >
            {" "}
            Data Speed
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            tabIndex == 1 ? styles.selectedTab : styles.defaultTab,
            { borderBottomWidth: 2, borderTopWidth: 2, borderRightWidth: 2 },
          ]}
          onPress={() => setTabIndex(1)}
        >
          <Text
            style={{
              color: tabIndex == 1 ? "white" : "#000",
              fontSize: 16,
              fontStyle: "normal",
              textAlign: "center",
              fontFamily:FontFamily.openSansRegular,
              textAlignVertical: "center",
              fontWeight: "400",
            }}
          >
            {" "}
            Usage
          </Text>
        </TouchableOpacity>
      </View>

      {tabIndex == 0 ? <DataSpeedComponent /> : <DataUsageComponent />}
      <MyPlanDetails />
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: "white",
    borderRadius: 5,
    paddingVertical: 15,
    paddingHorizontal: 20,
    width: wp("87%"),
  },
  shadowProp: {
    shadowColor: "#171717",
    shadowOffset: { width: -2, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
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
  },
  date: {
    fontSize: 14,
    color: colors.sparklight_purple_blue,
    textAlignVertical: "center",
    marginLeft: 5,
    fontWeight:'600'
  },
  subSec: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingRight: 5,
  },
  selectedTab: {
    backgroundColor: colors.sparklight_purple_blue,
    borderRadius: 2,
    borderColor: colors.dark_grey,
    paddingVertical: 5,
    paddingHorizontal: 32,
    width: wp("40%"),
  },
  defaultTab: {
    backgroundColor: "white",
    borderRadius: 2,
    borderColor: colors.dark_grey,
    paddingVertical: 5,
    paddingHorizontal: 32,
    width: wp("40%"),
  },
  containerContent: { flex: 1, marginTop: 40 },
  containerHeader: {
    flex: 1,
    alignContent: "center",
    alignItems: "center",
    justifyContent: "center",
    height: 40,
    backgroundColor: "red",
  },
  headerContent: {
    marginTop: 0,
  },
  Modal: {
    backgroundColor: "#fff",
    marginTop: hp("20%"),
    borderTopLeftRadius:16,
    borderTopRightRadius:16
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
    alignSelf: "center",
  },
  planDetailsTxt: {
    color: colors.darkest_grey,
    fontSize: FontSize.size_base,
    marginLeft: 10,
    fontWeight: "400",
  },
});

export default MyServicePlan;
