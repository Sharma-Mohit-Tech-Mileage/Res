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
import { FontFamily, Padding } from "../../../../GlobalStyles";
import { Env } from "../../../network/apis/account/Constants";
import Wallet2icon from "../../../res/svgIcons/Wallet2icon";
import WalletSummaryIcon from "../../../res/svgIcons/WalletSummaryIcon";
const Card = ({
  billAmt,
  dueDate,
  isAutoPayStatus,
  paperlessStatus,
  navigation,
  style,
  acno
}) => {
 
  console.log('BillAmnt',dueDate)

  return (
    <View style={styles.shadowContainer}>
      <View style={[styles.card, style]}>
        <View style={styles.cardContent}>
          <View style={styles.cardHreader}>
            <View
              style={{
                marginLeft: 10,
                flexDirection: "row",
                alignItems: "center",
              }}
            >
              <View style={{ alignSelf: "center" }}>
                <WalletSummaryIcon />
              </View>

              <Text style={styles.leftTitle}>Bill Summary</Text>
            </View>
          </View>

          <View
            style={{
              flexDirection: "row",
              width: "70%",
              marginHorizontal: 20,
              justifyContent: "space-between",
              
              flex: 0.5,
            }}
          >
            <View
              style={{
                flexDirection: "column",
                flex: 1,
                marginVertical:24,
                justifyContent: "flex-start",
              }}
            >
              <Text style={[styles.label, { fontWeight: "600",color:colors.sparklight_purple_blue,fontSize:14 }]}>
                Account Number
              </Text>
              <Text style={[styles.label,{fontSize:14}]}>{acno}</Text>
            </View>
            <View style={{ flexDirection: "column", flex: 1,
                justifyContent: 'flex-start',   marginVertical:20, marginEnd:40}}>
            {billAmt == undefined ? (
            <ActivityIndicator
              size="large"
              color={colors.sparklight_bright_purple}
              style={{marginLeft:wp("15%")}}
            />
          ) : (
                  <Text style={styles.amount}>${billAmt}</Text>
                )}
              
              {(dueDate != "Invalid date" && billAmt!=undefined) && (
            <Text 
              accessible={true}
              accessibilityLabel={`${dueDate ? (dueDate=='Immediately')?"Due Immediately"  :"Due on": "Due on Not Available"}`}
              accessibilityRole={`${(dueDate!='Immediately')?'button':'none'}`}
             style={[styles.dueDate,{color:(dueDate=='Immediately')?colors.sparklight_red:colors.sparklight_purple_blue,fontWeight:(dueDate=='Immediately')? "400":'700'}]}>
              {dueDate ? (dueDate=='Immediately')?"Due"  :"Due on": <NotAvailable/>}
              <Text style={[styles.dueDate, { fontWeight: "400",color:(dueDate=='Immediately')?colors.sparklight_red:colors.sparklight_purple_blue }]}>
                {' '+dueDate}
              </Text>
             </Text>
            )}
              
            </View>
          </View>

          <View style={styles.cardFooter}>
            <TouchableOpacity
              onPress={() => {
                navigation.navigate("ArticalWindowUtility", {
                  url: `${Env.URL}/billing`,
                  name: "Billing Details",
                });
              }}
              accessible={true}
              accessibilityLabel="Make a Payment"
              accessibilityRole="button"
              style={styles.paymentButton}
            >
              <Text style={styles.paymentButtonText}>Make a Payment</Text>
              <View style={{ marginLeft: 2, alignSelf: "center" }}>
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
    width: wp("92%"),
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
    color: colors.sp_black,
    fontSize: 18,
    fontWeight: "400",
    textAlign: "center",
    marginLeft: 10,
    alignContent: "flex-start",
    alignSelf: "center",
  },
  cardContent: {
    alignItems: "flex-start",
  },
  amount: {
    fontSize: 28,
    fontWeight: "bold",
    alignSelf:'flex-end',
    color: colors.sp_black,
    fontWeight: "700",
    
  },
  dueDate: {

    fontSize: 14,
    fontWeight: "700",
    color: colors.dark_grey,
    alignSelf:'flex-end',
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
    fontSize: 12,
    fontFamily: FontFamily.openSansRegular,
    fontWeight: "400",
    color: colors.gray600,
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
    backgroundColor: colors.sparklight_purple_blue,
    width:wp("70%"),
    paddingVertical: 8,
    alignItems:'center',
    justifyContent:'center',
    borderRadius: 5,
    alignSelf: "center",
    marginLeft: wp("9%"),
  },
  paymentButtonText: {
    color: colors.snow_white,
    fontSize: 16,
    fontWeight: "600",
    alignSelf:'center',
    fontFamily: FontFamily.openSansRegular,
  },
  cardHreader: {
    flexDirection: "row",
    backgroundColor: "#F8F8F8",
    width: "92%",
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
    padding: 10,
  },
  cardFooter: {
    flexDirection: "row",
    backgroundColor: "#F8F8F8",
    width: "100%",
    borderBottomEndRadius: 10,
    borderBottomStartRadius: 10,
    padding: 10,
    position: "absolute",
    bottom: 0,
    left: 0,
  },
});

export default Card;
