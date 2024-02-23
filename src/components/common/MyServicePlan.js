import React, { useState, useEffect } from "react";
import {
  View,
  Text,
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
import { FontFamily, FontSize } from "../../../GlobalStyles";
import TickIcon from "../../res/svgIcons/TickIcon";
import { getUser } from "../../redux/utils/LocalStorage";
import { GetApiRequest } from "../../network/APIClient";

const MyServicePlan = ({ plans, navigation }) => {
  const [tabIndex, setTabIndex] = useState(0);
  const [ShowComment, setModelComment] = useState(false);
  const [animateModal, setanimateModal] = useState(false);
  const [data, setData] = useState({});

  const getDataUsage = () => {
     getUser().then((res) => {
      const request = `internet/api/internet/${res.userInfo.accountNumber}/usage/current`;
      GetApiRequest(request, (res)=>{
            if(res){
              setData(res)
            }
      }, (error)=>{
           console.log(error)
      });
    });
  };

  // const MyPlanDetails = () => {
  //   useEffect(() => {
  //     console.log('Plan data',plans)
  //   }, []);

  //   const PlanDetailsItem = ({ item, index }) => {
  //     return (
  //       <View key={index} accessible accessibilityLabel={`Plan Details for Internet ${item.planName}`}>
  //         <View
  //           style={{
  //             flexDirection: "row",
  //             backgroundColor: colors.backgound_blue,
  //             padding: wp("3%"),
  //           }}
  //           accessible
  //           accessibilityLabel={`Internet Plan ${item.planName}`}
  //         >
  //           <LinearGradient
  //             start={{ x: 0, y: 0 }}
  //             end={{ x: 1, y: 0 }}
  //             colors={["rgba(53, 48, 145, 0.78)", "rgba(141, 59, 144, 0.9)"]}
  //             style={{
  //               width: wp("10%"),
  //               height: wp("10%"),
  //               borderRadius: 10,
  //               justifyContent: "center",
  //               alignItems: "center",
  //               alignSelf: "center",
  //             }}
  //           >
  //             <InternetIcon accessible accessibilityLabel="Internet Icon" />
  //           </LinearGradient>
  //           <Text style={styles.planDetailsRowHeader} accessibilityLabel={`Internet ${item.planName}`}>
  //             Internet {item.planName}
  //           </Text>
  //         </View>

  //         <View style={[styles.planDetailsRow]}>
  //           <View style={{ alignSelf: "center" }}>
  //             <TickIcon />
  //           </View>

  //           <Text style={styles.planDetailsTxt}>
  //             Download Speed Up To {item.downloadSpeed} Mbps
  //           </Text>
  //         </View>

  //         <View
  //           style={{ backgroundColor: colors.grey, height: 1, marginTop: 5 }}
  //         />
  //         <View style={[styles.planDetailsRow]}>
  //           <View style={{ alignSelf: "center" }}>
  //             <TickIcon />
  //           </View>
  //           <Text style={styles.planDetailsTxt}>
  //             Upload Speed Up To {item.uploadSpeed} Mbps
  //           </Text>
  //         </View>
  //         <View
  //           style={{ backgroundColor: colors.grey, height: 1, marginTop: 5 }}
  //         />
  //         <View
  //           style={{
  //             flexDirection: "column",
  //             padding: wp("4%"),
  //             marginLeft: 10,
  //           }}
  //         >
  //           <View style={{ flexDirection: "row" }}>
  //             <View style={{ alignSelf: "center" }}>
  //               <TickIcon />
  //             </View>
  //             <Text style={styles.planDetailsTxt}>
  //               Data Plan {(item.dataQuotaGB=='15000')?'UNLIMITED':item.dataQuotaGB+' GB*'}
  //             </Text>
  //           </View>
  //           {/* <Text
  //             style={{
  //               fontSize: FontSize.size_xs,
  //               color: colors.sparklight_grey,
  //               fontWeight: "400",
  //               marginLeft: 10,
  //               marginTop: 5,
  //             }}
  //           >
  //             * $10 charge for each add'l 100GB; Up to $40/mo.
  //           </Text> */}
  //         </View>
  //         <View
  //           style={{
  //             backgroundColor: colors.grey,
  //             height: 1,
  //             width: "100%",
  //             marginTop: 5,
  //           }}
  //         />
  //       </View>
  //     );
  //   };

  //   return (
  //     <SwipeUpDownModal
  //       modalVisible={ShowComment}
  //       PressToanimate={animateModal}
  //       ContentModal={
  //         <View style={{ marginVertical: 10, borderRadius: 10 }}>
  //           <View
  //             style={{
  //               flexDirection: "row",
  //               justifyContent: "space-between",
  //               alignItems: "center",
  //               marginHorizontal: 20,
  //               marginVertical: 10,
  //             }}
  //           >
  //             <Text
  //               style={{
  //                 textAlign: "center",
  //                 fontSize: FontSize.size_3xl,
  //                 color: colors.sparklight_grey,
  //                 fontWeight: "400",
  //                 fontFamily: FontFamily.openSansRegular,
  //               }}
  //               accessible={true}
  //               accessibilityLabel="Plan Details"
  //               accessibilityRole="header"
  //             >
  //               Plan Details
  //             </Text>
  //             <TouchableOpacity
  //               onPress={() => {
  //                 setModelComment(false);
  //               }}
  //               accessible={true}
  //               accessibilityLabel="Close Plan Details"
  //               accessibilityHint="Closes the plan details modal"
  //             >
  //               <Image
  //                 style={{ height: 32, width: 32, overflow: "hidden" }}
  //                 resizeMode="cover"
  //                 source={require("../../../assets/right-actionable7.png")}
  //                 accessible={true}
  //                 accessibilityLabel="Close icon"
  //               />
  //             </TouchableOpacity>
  //           </View>
  //           {(plans.length>0) ? plans.map((item, index) => {
  //             return <PlanDetailsItem item={item} index={index} key={index} />;
  //           }):<></>}
  //         </View>
  //       }
  //       ContentModalStyle={styles.Modal}
  //       onClose={() => {
  //         setModelComment(false);
  //         setanimateModal(false);
  //       }}
  //     />
  //   );
  // };
  
  const MyPlanDetails = () => {
    

    const PlanDetailsItem = ({ item, index }) => {
      return (
        <View key={index} accessible accessibilityLabel={`Plan Details for Internet ${item.planName}`}>
          <View
            style={{
              flexDirection: "row",
              backgroundColor: colors.backgound_blue,
              padding: wp("3%"),
            }}
            accessible
            accessibilityLabel={`Internet Plan ${item.planName}`}
            accessibilityRole="header"
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
                alignSelf: "center",
              }}
            >
              <InternetIcon accessible accessibilityLabel="Internet Icon" accessibilityRole="image" />
            </LinearGradient>
            <Text style={styles.planDetailsRowHeader} accessibilityLabel={`Internet ${item.planName}`} accessibilityRole="header">
              Internet {item.planName}
            </Text>
          </View>

          <View style={[styles.planDetailsRow]}>
            <View style={{ alignSelf: "center" }}>
              <TickIcon accessible accessibilityLabel="Tick Icon" accessibilityRole="image" />
            </View>

            <Text style={styles.planDetailsTxt} accessibilityRole="header">
              Download Speed Up To {item.downloadSpeed} Mbps
            </Text>
          </View>

          <View style={{ backgroundColor: colors.grey, height: 1, marginTop: 5 }} accessible accessibilityRole="text" />

          <View style={[styles.planDetailsRow]}>
            <View style={{ alignSelf: "center" }}>
              <TickIcon accessible accessibilityLabel="Tick Icon" accessibilityRole="image" />
            </View>
            <Text style={styles.planDetailsTxt} accessibilityRole="text">
              Upload Speed Up To {item.uploadSpeed} Mbps
            </Text>
          </View>

          <View style={{ backgroundColor: colors.grey, height: 1, marginTop: 5 }} accessible accessibilityRole="none" />

          <View
            style={{
              flexDirection: "column",
              padding: wp("4%"),
              marginLeft: 10,
            }}
          >
            <View style={{ flexDirection: "row" }}>
              <View style={{ alignSelf: "center" }}>
                <TickIcon accessible accessibilityLabel="Tick Icon" accessibilityRole="image" />
              </View>
              <Text style={styles.planDetailsTxt} accessible accessibilityRole="text">
                Data Plan {(item.dataQuotaGB=='15000')?'UNLIMITED':item.dataQuotaGB+' GB*'}
              </Text>
            </View>
            {/* <Text
              style={{
                fontSize: FontSize.size_xs,
                color: colors.sparklight_grey,
                fontWeight: "400",
                marginLeft: 10,
                marginTop: 5,
              }}
            >
              * $10 charge for each add'l 100GB; Up to $40/mo.
            </Text> */}
          </View>

          <View style={{ backgroundColor: colors.grey, height: 1, width: "100%", marginTop: 5 }} accessible accessibilityRole="none" />
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
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
                alignItems: "center",
                marginHorizontal: 20,
                marginVertical: 10,
              }}
              accessible
              accessibilityRole="header"
            >
              <Text
                style={{
                  textAlign: "center",
                  fontSize: FontSize.size_3xl,
                  color: colors.sparklight_grey,
                  fontWeight: "400",
                  fontFamily: FontFamily.openSansRegular,
                }}
                accessible={true}
                accessibilityLabel="Plan Details"
                accessibilityRole="header"
              >
                Plan Details
              </Text>
              <TouchableOpacity
                onPress={() => {
                  setModelComment(false);
                }}
                accessible={true}
                accessibilityLabel="Close Plan Details"
                accessibilityHint="Closes the plan details modal"
                accessibilityRole="button"
              >
                <Image
                  style={{ height: 32, width: 32, overflow: "hidden" }}
                  resizeMode="cover"
                  source={require("../../../assets/right-actionable7.png")}
                  accessible={true}
                  accessibilityLabel="Close icon"
                  accessibilityRole="image"
                />
              </TouchableOpacity>
            </View>
            {(plans?.length > 0) ? plans.map((item, index) => {
              return <PlanDetailsItem item={item} index={index} key={index} />;
            }) : <></>}
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
    getDataUsage();
  }, []);
  return (
    <View
      style={[
        styles.card,
        styles.shadowProp,
        { flexDirection: "column", marginBottom: hp("10%") },
      ]}
    >
      <View style={[styles.subSec, { marginHorizontal: 20 }]}>
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
          // alignItems: "center",
          padding: wp("5%"),
        }}
      >
        <TouchableOpacity
          style={[
            tabIndex == 0 ? styles.selectedTab : styles.defaultTab,
            { borderWidth: 1 },
          ]}
          onPress={() => setTabIndex(0)}>
          <Text
          
            style={{
              color: tabIndex == 0 ? "white" : "#000",
              fontSize: 16,
              fontStyle: "normal",
              textAlign: "center",
              fontFamily: FontFamily.openSansRegular,
              textAlignVertical: "center",
              fontWeight: "400",
             
            }}
            
          >{" "}
            Data Speed
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            tabIndex == 1 ? styles.selectedTab : styles.defaultTab,
            { borderWidth: 1 },
          ]}
          onPress={() => setTabIndex(1)}
        >
          <Text
            style={{
              color: tabIndex == 1 ? "white" : "#000",
              fontSize: 16,
              fontStyle: "normal",
              textAlign: "center",
              fontFamily: FontFamily.openSansRegular,
              textAlignVertical: "center",
              fontWeight: "400",
            }}
          >
            {" "}
            Usage
          </Text>
        </TouchableOpacity>
      </View>

      {tabIndex == 0 ? (
        <DataSpeedComponent navigation={navigation} />
      ) : (
        <DataUsageComponent navigation={navigation} useData={data} />
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
  date: {
    fontSize: 14,
    color: colors.sparklight_purple_blue,
    textAlignVertical: "center",
    marginLeft: 5,
    fontWeight: "600",
  },
  subSec: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingRight: 5,
  },
  selectedTab: {
    backgroundColor: colors.sparklight_purple_blue,
    borderRadius: 0.5,
    borderColor: "#767676",
    paddingVertical: 5,
    paddingHorizontal: 5,
    width: wp("40%"),
  },
  defaultTab: {
    backgroundColor: "white",
    borderRadius: 0.5,
    borderColor: "#767676",
    paddingVertical: 5,
    paddingHorizontal: 5,
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
