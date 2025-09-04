import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import colors from "../../../res/Colors";
import RightArrow from "../../../res/svgIcons/RightArrow";
import { widthPercentageToDP as wp } from "react-native-responsive-screen";
import { FontFamily, Padding, Color } from "../../../../GlobalStyles";
import { Env } from "../../../network/apis/account/Constants";
import { getUser } from "../../../redux/utils/LocalStorage";
import AutoPayIcon from "../../../res/svgIcons/AutoPayIcon";
import SkeletonPlaceholder from "react-native-skeleton-placeholder";
import AppStyles from "../styles/AppStyles";
const AutoPayCard = ({
  cardDigit,
  isAutoPayStatus,
  paymentDetails,
  navigation,
  style,
  isStatusLoading,
}) => {
  const [useNewPayment, setUseNewPayment] = useState(false);
  const getStatus = () => {
    getUser().then((res) => {
      const accountNumber = res.userInfo.accountNumber;
      setUseNewPayment(accountNumber.toString().length >= 16);
    });
  };
  useEffect(() => {
    getStatus();
    console.log("isStatusLoading", isStatusLoading);
  }, []);

  return (
    <View style={[AppStyles.card, style]}>
      

      <View
          style={{
            margin: 10,
            flexDirection: "row",
            
          }}
        >
          
          <View style={styles.iconBg}>
            <AutoPayIcon />
          </View>
          <View style={{flexDirection:'column'}}>
          <Text style={styles.leftTitle}>Auto Pay</Text>
           <Text style={{textDecorationStyle:'solid',textDecorationLine:'underline', fontSize:14,fontWeight:'400',fontFamily:FontFamily.openSansRegular, marginLeft:10}} onPress={()=>{
            navigation.navigate("AutoPayPCIConnector", {
              url: `${Env.URL}/billing`,
              name: isAutoPayStatus ? "Manage Auto Pay" : "Setup Auto Pay",
              useNewPayment: useNewPayment,
              status: isAutoPayStatus,
              paymentDetails: paymentDetails,
            });
           }}>Manage</Text>
          </View>
        </View>
{/* 
      {isStatusLoading ? (
        <SkeletonPlaceholder>
          <>
            <View
              style={{
                width: wp("40%"),
                height: 20,
                alignSelf: "center",
                borderRadius: 4,
                marginTop: 10,
              }}
            />
            <View
              style={{
                width: wp("20%"),
                height: 30,
                alignSelf: "center",
                borderRadius: 4,
                marginVertical: 10,
              }}
            />

            <View
              style={{
                width: wp("50%"),
                height: 20,
                alignSelf: "center",
                borderRadius: 4,
                marginTop: 10,
              }}
            />
            <View
              style={{
                width: wp("70%"),
                height: 40,
                alignSelf: "center",
                borderRadius: 4,
                marginVertical: 10,
              }}
            />
          </>
        </SkeletonPlaceholder>
      ) : (
        <>
          {isAutoPayStatus ? (
            <>
              <View style={{ flexDirection: "row", alignSelf: "center" }}>
                <Text
                  style={[
                    styles.dueDate,
                    { fontWeight: "400", color: colors.gray600 },
                  ]}
                >
                  Account ending in{" "}
                </Text>
                <Text style={[styles.dueDate]}>{cardDigit}</Text>
              </View>
              <Text style={styles.autoPayStatusText}>Auto Pay On</Text>
              <Text style={[styles.thankYouText, { marginTop: 5 }]}>
                Thank you for choosing Auto Pay!
              </Text>
            </>
          ) : (
            <>
              <Text style={styles.autoPayStatusTextInActive}>Auto Pay Off</Text>
              <View style={{ flexDirection: "column" }}>
                <Text style={[styles.infoAuto]}>Turn on Auto Pay today!</Text>
                <Text style={styles.subText}>
                  Never miss a payment with peace of mind.
                </Text>
              </View>
            </>
          )}

          <View style={styles.cardFooter}>
            <TouchableOpacity
              onPress={() => {
                navigation.navigate("AutoPayPCIConnector", {
                  url: `${Env.URL}/billing`,
                  name: isAutoPayStatus ? "Manage Auto Pay" : "Setup Auto Pay",
                  useNewPayment: useNewPayment,
                  status: isAutoPayStatus,
                  paymentDetails: paymentDetails,
                });
              }}
              accessible={true}
              accessibilityLabel={
                isAutoPayStatus ? "Manage Auto Pay" : "Setup Auto Pay"
              }
              accessibilityRole="button"
              style={styles.paymentButton}
            >
              <Text style={styles.paymentButtonText}>
                {isAutoPayStatus ? "Manage Auto Pay" : "Setup Auto Pay"}
              </Text>
              <View style={{ marginLeft: 2 }}>
                <RightArrow color={colors.snow_white} />
              </View>
            </TouchableOpacity>
          </View> 
        </>
      )}*/}
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

  leftTitle: {
    color: colors.sp_black,
    fontSize: 18,
    fontWeight: "600",
    textAlign: "center",
    fontFamily: FontFamily.openSansRegular,
    marginLeft: 10,
    alignContent: "flex-start",
    alignSelf: "center",
  },
  cardContent: {
    alignItems: "center",
  },
  dueDate: {
    fontSize: 14,
    fontWeight: "700",
    alignContent: "center",
    fontFamily: FontFamily.openSansRegular,
    color: colors.sparklight_purple_blue,
    textAlign: "center",
    marginVertical: 5,
  },
  infoAuto: {
    fontSize: 14,
    fontWeight: "600",
    alignContent: "center",
    fontFamily: FontFamily.openSansRegular,
    color: colors.sparklight_purple_blue,
    textAlign: "center",
    marginTop: Padding.p_xs,
    marginHorizontal: Padding.p_xs,
  },
  thankYouText: {
    fontSize: 14,
    color: colors.sparklight_purple_blue,
    textAlign: "center",
    fontWeight: "700",
    marginTop: Padding.p_xs,
    marginBottom: 23,
  },
  subText: {
    fontSize: 14,
    color: colors.gray600,
    textAlign: "center",
    fontFamily: FontFamily.openSansRegular,
    fontWeight: "400",
  },
  autoPayStatusText: {
    fontSize: 14,
    fontWeight: "700",
    marginVertical: 5,
    color: colors.sparklight_green,
    backgroundColor: Color.success50,
    alignSelf: "center",
    width: wp("27%"),
    borderColor: colors.sparklight_green,
    borderWidth: 1,
    borderRadius: 5,
    textAlign: "center",
    padding: 5,
    marginTop: 13,
    marginBottom: Padding.p_base,
  },
  autoPayStatusTextInActive: {
    fontSize: 14,
    fontWeight: "700",
    marginVertical: 5,
    color: colors.dark_grey,
    backgroundColor: Color.sparklightGray,
    alignSelf: "center",
    width: wp("27%"),
    textAlign: "center",
    borderColor: colors.dark_grey,
    borderWidth: 1,
    borderRadius: 5,
    padding: 5,
    marginVertical: Padding.p_xs,
    marginTop: Padding.p_xs,
  },
  iconBg: {
    alignSelf: "center",
    backgroundColor: "#8D3B901A",
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: "center",
    alignItems: "center",
  },
  paymentButton: {
    flexDirection: "row",
    backgroundColor: colors.sparklight_purple_blue,
    width: wp("70%"),
    paddingVertical: 8,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 5,
    alignSelf: "center",
    marginLeft: wp("9%"),
  },
  paymentButtonText: {
    color: colors.snow_white,
    fontSize: 16,
    fontWeight: "600",
    alignSelf: "center",
    fontFamily: FontFamily.openSansRegular,
  },
  statusRow: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    width: "100%",
    marginVertical: 5,
  },
  cardHreader: {
    flexDirection: "row",
    width: wp("92%"),
    padding: 10,
  },
  cardFooter: {
    flexDirection: "row",

    width: wp("100%"),
    padding: 10,
    position: "absolute",
    bottom: 0,
    left: 0,
  },
});

export default AutoPayCard;
