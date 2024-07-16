import React, { useEffect } from "react";
import { View, Text, StyleSheet, TouchableOpacity, Pressable } from "react-native";
import Billpaidicon from "../../res/svgIcons/Billpaidicon";
import Outageicon from "../../res/svgIcons/Outageicon";
import Modemicon from "../../res/svgIcons/Modemicon";
import colors from "../../res/Colors";
import strings from "../../res/Strings";
import { widthPercentageToDP as wp } from "react-native-responsive-screen";
import RightArrow from "../../res/svgIcons/RightArrow";
import { FontFamily } from "../../../GlobalStyles";
import { Env } from "../../network/apis/account/Constants";
import PubSub from "pubsub-js";
import { CommonActions } from '@react-navigation/native';
const NetworkDetails = ({ navigation, billPaid, hasOutage, currentHealth }) => {
  const GreenCircle = () => {
    return <View style={styles.greenTick}></View>;
  };

  const RedCircle = () => {
    return <View style={styles.redTick}></View>;
  };
  const OrangeCircle = () => {
    return <View style={styles.orangeTick}></View>;
  };

  return (
    <View style={styles.mainContainer}>
      <View style={styles.rowContainer}>
        <View style={styles.item}
          accessible={true}
          accessibilityLabel={hasOutage ? strings.noOutageDetected : strings.noOutageTxt}
        >
          <View style={styles.iconBg}>
            <Outageicon />
            {hasOutage ? <RedCircle /> : <GreenCircle />}
          </View>
          <Text style={styles.text}>
            {" "}
            {hasOutage ? strings.noOutageDetected : strings.noOutageTxt}
          </Text>
        </View>
        {/* <View style={styles.item}>
        <View style ={styles.iconBg}>
          <WifiIcon />
          <GreenCircle/>
          </View>
          <Text style={styles.text}>{strings.connect_wifi_txt}</Text>
        </View> */}
      </View>

      <View style={[styles.rowContainer]}>
        {<TouchableOpacity
          style={{ flexDirection: "row" }}
          disabled={currentHealth != "Optimal" ? false : true}
          accessible={true}
          accessibilityRole={currentHealth != "Optimal" ? "button" : null }
          accessabilityLabel={currentHealth != "Optimal"
          ? strings.modem_issue_detected
          : strings.no_modem_issue}
          onPress={() => {
            if (currentHealth != 'Optimal') {
              navigation.reset({
                index: 0,
                routes: [{ name: 'Support', params: { isManagementEquipment: true }, }],
              });
            }
            // navigation.navigate('Support',{isManagementEquipment:true});
          }}
        >
          <View style={styles.item}>
            <View style={styles.iconBg}>
              <Modemicon />
              {currentHealth === "Offline" ? (
                <RedCircle />
              ) : currentHealth === "Poor" ? (
                <OrangeCircle />
              ) : (
                <GreenCircle />
              )}
            </View>
            <Text style={styles.text}>
              {" "}
              {currentHealth != "Optimal"
                ? strings.modem_issue_detected
                : strings.no_modem_issue}
            </Text>
            {currentHealth != "Optimal" ? (
              <View
                style={{
                  justifyContent: "center",
                  right: 20,
                  top: 26,
                  position: "absolute",
                }}
              >
                <RightArrow />
              </View>
            ) : (
              <></>
            )}
          </View>
        </TouchableOpacity>}
        <TouchableOpacity
          style={{ flexDirection: "row" }}
          disabled={!billPaid ? false : true}
          accessible={true}
          accessibilityLabel={strings.bill_paid}
          accessibilityRole={!billPaid ? "button" : null }
          onPress={() => {
            if (!billPaid) {
              navigation.navigate("ArticalWindowUtility", {
                url: `${Env.URL}/billing`,
                name: "Billing Details",
              });
            }
          }}
        >
          <View 
          style={styles.item}
          >
            <View style={styles.iconBg}>
              <Billpaidicon />
              {billPaid ? <GreenCircle /> : <OrangeCircle />}
            </View>
            <Text style={styles.text}> {strings.bill_paid}</Text>
          </View>
          {!billPaid ? (
            <View
              style={{
                justifyContent: "center",
                right: 20,
                top: 26,
                position: "absolute",
              }}
            >
              <RightArrow />
            </View>
          ) : (
            <></>
          )}
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  mainContainer: {
    alignContent: "flex-start",
    alignItems: "flex-start",
    marginBottom: 10,
  },
  rowContainer: {
    flexDirection: "column",
  },
  item: {
    flexDirection: "row",
    backgroundColor: "white",
    width: wp("92%"),
    margin: 1,
    alignContent: "center",
    alignItems: "center",
    paddingVertical: wp("3%"),
    paddingHorizontal: 25,
    borderColor: colors.grey,
    borderTopWidth: 0.5,
  },
  iconBg: {
    backgroundColor: "#F4F4F5",
    padding: 5,
    width: wp("10%"),
    height: wp("10%"),
    borderRadius: 25,
    alignContent: "center",
    alignItems: "center",
    justifyContent: "center",
  },
  text: {
    marginTop: 5,
    fontFamily: FontFamily.openSansRegular,
    textAlign: "center",
    marginLeft: 10,
    color: colors.darkest_grey,
    fontWeight: "600",
  },
  greenTick: {
    width: 14,
    height: 14,
    borderRadius: 7,
    position: "absolute",
    bottom: 0,
    right: -3,
    backgroundColor: colors.sparklight_green,
    borderWidth: 2,
    borderColor: "white",
  },
  redTick: {
    width: 14,
    height: 14,
    borderRadius: 7,
    position: "absolute",
    bottom: 0,
    right: -3,
    backgroundColor: colors.sparklight_red,
    borderWidth: 2,
    borderColor: "white",
  },
  orangeTick: {
    width: 14,
    height: 14,
    borderRadius: 7,
    position: "absolute",
    bottom: 0,
    right: -3,
    backgroundColor: colors.sparklight_yellow,
    borderWidth: 2,
    borderColor: "white",
  },
});

export default NetworkDetails;
