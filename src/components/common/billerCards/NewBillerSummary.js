import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  ActivityIndicator,
} from "react-native";
import colors from "../../../res/Colors";
import RightArrow from "../../../res/svgIcons/RightArrow";
import WalletIcon from "../../../res/svgIcons/WalletIcon";
import { widthPercentageToDP as wp } from "react-native-responsive-screen";
import { Color, FontFamily, Padding } from "../../../../GlobalStyles";
import { Env } from "../../../network/apis/account/Constants";
import InfoIcon1 from "../../../res/svgIcons/InfoIcon1";
import Tooltip from "rn-tooltip";
const CardNewBiller = ({
  billAmt,
  dueDate,
  isAutoPayStatus,
  paperlessStatus,
  navigation,
  style,
}) => {
  const uncheck = require("../../../../assets/checkcircle1.png");
  const check = require("../../../../assets/checkcircle.png");
  const info = require("../../../../assets/info_icon.png");

console.log("Due Date",dueDate)

  const NotAvailable = () => {
    return (
      <>
       
          <View style={{ flexDirection: "row", alignItems: "center" }}>
            <Text style={styles.dueDate}>{"Due "}</Text>
            <Text
              style={[
                styles.dueDate,
                { fontWeight: "400", color: colors.dark_grey },
              ]}
            >
              {"on: "}
            </Text>
            <Text
              style={[
                styles.dueDate,
                { textDecorationLine: "underline", marginRight: 5 },
              ]}
            >
              Not Available
            </Text>
            <Tooltip
          backgroundColor="#4C5458"
          width={200}
          height={100}
          popover={
            <Text style={{ color: "#FFF" }}>
              Your due date takes 10 business days to generate. Please check
              back later.
            </Text>
          }
        >
            <Image
                  resizeMode="cover"
                  source={info}
                  style={styles.statusIcon}
                />
                </Tooltip>
          </View>
        
      </>
    );
  };

  return (
    <View style={styles.shadowContainer}>
      <View style={[styles.card, style]}>
        <View style={styles.leftSection}>
          <View style={styles.circleContainerShadow}></View>
          <View style={styles.circleContainer}></View>
          <View style={[styles.icon, { paddingRight: 24 }]}>
            <WalletIcon />
          </View>
          <Text style={styles.leftTitle}>Bill Summary</Text>
        </View>
        <View style={styles.cardContent}>
          {billAmt == undefined ? (
            <ActivityIndicator
              size="large"
              color={Color.sparklightBrightPurple}
            />
          ) : (
            <Text style={styles.amount}>${billAmt}</Text>
          )}
          {dueDate != "Invalid date" && (
            <Text style={[styles.dueDate,{color:(dueDate=='Immediately')?colors.sparklight_red:colors.sparklight_purple_blue,fontWeight:(dueDate=='Immediately')? "400":'700'}]}>
              {dueDate ? (dueDate=='Immediately')?"Due"  :"Due on": <NotAvailable/>}
              <Text style={[styles.dueDate, { fontWeight: "400",color:(dueDate=='Immediately')?colors.sparklight_red:colors.sparklight_purple_blue }]}>
                {' '+dueDate}
              </Text>
            </Text>
          )}
          <View style={{ marginVertical: Padding.p_base }}>
            <View style={[styles.statusRow,{marginTop:10}]}>
              <Text style={styles.label}>Auto Pay : </Text>
              <View style={styles.status}>
                <Image
                  resizeMode="cover"
                  source={isAutoPayStatus ? check : uncheck}
                  style={styles.statusIcon}
                />
                <Text
                  style={isAutoPayStatus ? styles.labelActive : styles.label}
                >
                  {isAutoPayStatus ? "On" : "Off"}
                </Text>
              </View>
            </View>
      
                               
            
          </View>
          <View style={[styles.statusRow,{marginTop:26}]}>
            <TouchableOpacity
              onPress={() => {
                navigation.navigate("ArticalWindowUtility", {
                  url: `${Env.PAYMENTURLNEW}`,
                  name: "Billing Details",
                });
              }}
              accessible={true}
              accessibilityLabel="Make a Payment"
              accessibilityRole="button"
              style={styles.paymentButton}
            >
              <Text style={styles.paymentButtonText}>Make a Payment</Text>
              <View style={{ marginLeft: 2 }}>
                <RightArrow color={colors.snow_white} />
              </View>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  shadowContainer: {
    shadowColor: "#171717",
    shadowOffset: { width: -2, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
  },
  card: {
    flexDirection: "row",
    backgroundColor: "white",
    borderRadius: 10,
    alignSelf: "center",
    overflow: "hidden",
    width: wp("85%"),
  },
  leftSection: {
    paddingHorizontal: Padding.p_3xs,
    paddingBottom: Padding.p_xs,
    alignItems: "center",
    justifyContent: "center",
    width: wp("40%"),
    height: "100%",
    position: "relative",
  },
  circleContainerShadow: {
    position: "absolute",
    top: "50%",
    left: -wp("38.75%") - 20,
    width: wp("84%"),
    height: wp("84%"),
    borderRadius: wp("41.5%"),
    backgroundColor: "rgba(71, 84, 103, 0.05)",
    transform: [{ translateY: -wp("41.5%") }],
  },
  circleContainer: {
    position: "absolute",
    top: "50%",
    left: -wp("38.75%") - 15,
    width: wp("77.5%"),
    height: wp("77.5%"),
    borderRadius: wp("38.75%"),
    backgroundColor: colors.sparklight_bright_purple,
    transform: [{ translateY: -wp("38.75%") }],
  },
  circle: {
    width: "100%",
    height: "100%",
    alignItems: "center",
    justifyContent: "center",
  },
  icon: {
    alignContent: "center",
    alignSelf: "center",
  },
  leftTitle: {
    color: colors.snow_white,
    fontSize: 18,
    fontWeight: "400",
    textAlign: "center",
    alignContent: "flex-start",
    alignSelf: "flex-start",
  },
  cardContent: {
    flex: 1,
    paddingVertical: Padding.p_base,
    paddingRight: Padding.p_5xl,
    alignItems: "center",
  },
  amount: {
    fontSize: 28,
    fontWeight: "bold",
    color: colors.sp_black,
    marginVertical: Padding.p_8xs,
    fontWeight: "700",
    alignSelf:'flex-end'
  },
  dueDate: {
    fontSize: 14,
    fontWeight: "700",
    color: colors.sparklight_purple_blue,
    alignSelf: 'flex-end',
    fontFamily: FontFamily.openSansRegular,
    color: colors.sparklight_purple_blue,
  },
  statusRow: {
    flexDirection: "row",
    justifyContent: "flex-end",
    alignItems: "flex-end",
    width: "100%",
    marginVertical: Padding.p_8xs,
  },
  label: {
    fontSize: 14,
    fontFamily: FontFamily.openSansRegular,
    fontWeight: "400",
    color: colors.gray600,
    alignItems: "flex-end",
    alignContent: "flex-end",
  },
  labelActive: {
    fontSize: 14,
    fontFamily: FontFamily.openSansRegular,
    fontWeight: "700",
    color: colors.sparklight_green,
    alignItems: "flex-end",
    alignContent: "flex-end",
  },
  status: {
    flexDirection: "row",
    alignItems: "center",
  },
  statusIcon: {
    width: 13,
    height: 13,
    marginRight: 3,
  },
  paymentButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.sparklight_purple_blue,
    paddingLeft: 8,
    paddingVertical: 5,
    borderRadius: 5,
  },
  paymentButtonText: {
    color: colors.snow_white,
    fontSize: 14,
    fontWeight: "600",
    flexDirection: "row",
    justifyContent: "flex-end",
    alignItems: "flex-end",
    fontFamily: FontFamily.openSansRegular,
  },
});

export default CardNewBiller;
