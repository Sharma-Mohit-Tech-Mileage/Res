import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, Pressable } from "react-native";
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
  }, []);

  const handleCardPress = () => {
    if (!isStatusLoading){
    navigation.navigate("AutoPayPCIConnector", {
      url: `${Env.URL}/billing`,
      name: "Manage Auto Pay" ,
      useNewPayment: useNewPayment,
      status: isAutoPayStatus,
      paymentDetails: paymentDetails,
    });
  }
  };

  return (
    <Pressable
      style={[AppStyles.card, style]}
      onPress={handleCardPress}
      activeOpacity={0.8}
      accessible={true}
      accessibilityLabel="Manage Auto Pay"
      accessibilityRole="button"
    >
      <View
        style={{
          margin: 10,
          flexDirection: "row",
          flex: 1,
          padding: 5,
          alignItems: "center",
        }}
      >
        <View style={styles.iconBg}>
          <AutoPayIcon />
        </View>
        <View style={{ flexDirection: "column" }}>
          <Text accessible={true} accessibilityRole="text"
            accessibilityLabel={"Auto Pay"+ (isStatusLoading ? "" : isAutoPayStatus ? " is On" : " is Off")}
          style={styles.leftTitle}>Auto Pay</Text>
          {isStatusLoading ? (
            <SkeletonPlaceholder>
              <View
                style={{
                  width: wp("16%"),
                  height: 25,
                  alignSelf: "center",
                  borderRadius: 4,
                  paddingVertical: 4,
                  paddingHorizontal: 8,
                  marginTop: 5,
                }}
              />
            </SkeletonPlaceholder>
          ) : (
            <Text
              style={{
                textDecorationStyle: "solid",
                textDecorationLine: "underline",
                fontSize: 14,
                fontWeight: "400",
                color: colors.sparklight_purple_blue,
                fontFamily: FontFamily.openSansRegular,
                marginLeft: 10,
              }}
            >
            Manage
            </Text>
          )}
        </View>
        <View style={{ position: "absolute", right: 10 }}>
          {isStatusLoading ? (
            <SkeletonPlaceholder>
              <View
                style={{
                  width: wp("16%"),
                  height: 25,
                  alignSelf: "center",
                  borderRadius: 4,
                  paddingVertical: 4,
                  paddingHorizontal: 8,
                }}
              />
            </SkeletonPlaceholder>
          ) : isAutoPayStatus ? (
            <Text style={styles.autoPayStatusText}>ON</Text>
          ) : (
            <Text style={styles.autoPayStatusTextInActive}>OFF</Text>
          )}
        </View>
      </View>
    </Pressable>
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
    color: colors.sp_black,
    backgroundColor: Color.success50,
    alignSelf: "center",
    width: wp("16%"),
    borderColor: colors.sparklight_green,
    borderWidth: 1,
    borderRadius: 3,
    textAlign: "center",
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  autoPayStatusTextInActive: {
    fontSize: 14,
    fontWeight: "700",
    color: colors.sp_black,
    backgroundColor: Color.sparklightGray,
    alignSelf: "center",
    width: wp("16%"),
    textAlign: "center",
    borderColor: colors.dark_grey,
    borderWidth: 1,
    borderRadius: 3,
    paddingHorizontal: 8,
    paddingVertical: 4,
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
