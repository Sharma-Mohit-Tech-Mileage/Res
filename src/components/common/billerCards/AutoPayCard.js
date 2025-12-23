import React from "react";
import { View, Text, StyleSheet, Pressable } from "react-native";
import colors from "../../../res/Colors";
import { widthPercentageToDP as wp } from "react-native-responsive-screen";
import { FontFamily, Color } from "../../../../GlobalStyles";
import { Env } from "../../../network/apis/account/Constants";
import AutoPayIcon from "../../../res/svgIcons/AutoPayIcon";
import SkeletonPlaceholder from "react-native-skeleton-placeholder";
import AppStyles from "../../utility/AppStyles";
const AutoPayCard = ({
  isAutoPayStatus,
  paymentDetails,
  navigation,
  isStatusLoading,
}) => {
  const handleCardPress = () => {
    if (!isStatusLoading) {
      navigation.navigate("AutoPayPCIConnector", {
        url: `${Env.URL}/billing`,
        name: isAutoPayStatus ? "Manage Auto Pay" : "Setup Auto Pay",
        useNewPayment: true,
        status: isAutoPayStatus,
        paymentDetails: paymentDetails,
      });
    }
  };

  return (
    <Pressable
      style={[AppStyles.card]}
      onPress={handleCardPress}
      activeOpacity={0.8}
     accessible={true}
      accessibilityRole="header" accessibilityLevel={2}
      accessibilityLabel={
        (isAutoPayStatus ? "Auto Pay is On. " : "Auto Pay is Off. ") +
        "Manage Auto Pay"
      }
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
          <Text style={styles.leftTitle} accessible={true} accessibilityRole="header" accessibilityLevel={2} >Auto Pay</Text>
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
});

export default AutoPayCard;
