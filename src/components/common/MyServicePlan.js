import React, { useState } from "react";
import colors from "../../res/Colors";
import strings from "../../res/Strings";
import InfoIcon from "../../res/svgIcons/InfoIcon";
import DataSpeedComponent from "./DataSpeedComponent";
import { FontFamily } from "../../../GlobalStyles";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { widthPercentageToDP as wp } from "react-native-responsive-screen";

const MyServicePlan = ({ plans, hasEeroDevice, networkId, navigation }) => {
  const [tabIndex, setTabIndex] = useState(0);

  return (
    <View style={{ ...styles.card, ...styles.shadowProp, flexDirection: "column", marginBottom: 20 }}>
      <View style={{ ...styles.subSec, flexDirection: "row", alignItems: "center" }}>
        <Text style={styles.subTitle}>{'My Speed'}</Text>
        <Text style={styles.date}>{plans[0]?.downloadSpeed ?? 0} Mbps</Text>
      </View>
      <View style={styles.subSec} />
      <View style={[styles.internetStatusSection, { marginHorizontal: wp('5%'), marginVertical: 16 }]}>
        <View style={{ marginTop: 5 }}>
          <InfoIcon />
        </View>
        <View>
          <Text style={styles.internetStatusTxt}>
            {strings.test_speed_info}
          </Text>
          <View style={{ flexDirection: "row", marginLeft: 10, marginTop: 10 }}>
            <TouchableOpacity
              accessible={true}
              accessibilityLabel={strings.learn_more}
              accessibilityRole="link"
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
          accessible={true}
          accessibilityLabel={`WiFi Speed`}
          accessibilityRole="button"
          style={[
            tabIndex == 0 ? styles.selectedTab : styles.defaultTab,
            {
              borderWidth: 1,
              ...(!hasEeroDevice ? { width: wp('80%'),borderBottomWidth:1 } : {})
            }
          ]}
          onPress={() => setTabIndex(0)}>
          <Text style={{ color: tabIndex == 0 ? '#8D3B90' : "#4C5458", ...styles.usage }} >{" WiFi Speed"}
          </Text>
        </TouchableOpacity>
        {hasEeroDevice && (
          <TouchableOpacity
            accessible={true}
            accessibilityLabel={`Modem Speed`}
            accessibilityRole="button"
            style={[tabIndex == 1 ? styles.selectedTab : styles.defaultTab, { borderWidth: 1 }]}
            onPress={() => setTabIndex(1)}
          >
            <Text style={{ color: tabIndex == 1 ? '#8D3B90' : "#4C5458", ...styles.usage }}>
              {" Modem Speed"}
            </Text>
          </TouchableOpacity>
        )}
      </View>
      {tabIndex == 0 ? (
        <DataSpeedComponent navigation={navigation} speedType="wifi" hasEeroDevice={hasEeroDevice} networkId={networkId} />
      ) : (
        hasEeroDevice && <DataSpeedComponent navigation={navigation} speedType="modem" hasEeroDevice={hasEeroDevice} networkId={networkId} />
      )}
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
    fontWeight: "600",
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
    fontWeight: "600",
  },
  internetStatusSection: {
    backgroundColor: "#EBEEF180",
    borderRadius: 10,
    padding: 10,
    flexDirection: "row",
  },
  switchContainer: {
    flexDirection: "row",
    justifyContent: "center",
    paddingHorizontal: wp("5%"),
  },
  date: {
    fontSize: 16,
    color: colors.sparklight_purple_blue,
    textAlignVertical: "center",
    marginLeft: 5,
    fontWeight: "600",
  },
  subSec: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingRight: 5,
    marginHorizontal: wp('5%')
  },
  selectedTab: {
    backgroundColor: 'white',
    borderRadius: 0,
    borderColor: colors.grey,
    paddingVertical: 10,
    paddingHorizontal: 5,
    width: wp("40%"),
    borderBottomWidth: 0,  // Remove bottom border
    borderTopWidth: 1,
    borderLeftWidth: 1,
    borderRightWidth: 1
  },
  defaultTab: {
    backgroundColor: colors.backgound_blue,
    borderRadius: 0.5,
    borderColor: colors.grey,
    paddingVertical: 10,
    paddingHorizontal: 5,
    width: wp("40%"),
    borderWidth: 1
  },
});

export default MyServicePlan;
