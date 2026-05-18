import React from "react";
import { View, Text, StyleSheet } from "react-native";
import colors from "../../../res/Colors";
import { widthPercentageToDP as wp } from "react-native-responsive-screen";
import { FontFamily, Color } from "../../../../GlobalStyles";
import Config from "react-native-config";
import AutoPayIcon from "../../../res/svgIcons/AutoPayIcon";
import SkeletonPlaceholder from "react-native-skeleton-placeholder";
import { card } from "../../../styles/utilities";
import Touchable from "../customui/Touchable";
const AutoPayCard = ({
  isAutoPayStatus,
  paymentDetails,
  navigation,
  isStatusLoading,
}) => {
  const showSkeleton = isStatusLoading || isAutoPayStatus === undefined;
  const handleCardPress = () => {
    if (!showSkeleton) {
      navigation.navigate("AutoPayPCIConnector", {
        url: `${Config.URL}/billing`,
        name: isAutoPayStatus ? "Manage Auto Pay" : "Setup Auto Pay",
        useNewPayment: true,
        status: isAutoPayStatus,
        paymentDetails: paymentDetails,
      });
    }
  };

  return (
    <Touchable
      style={[card.elevated, { alignItems: 'stretch' }]}
      minSize={0}
      onPress={handleCardPress}
     accessible={false}
      importantForAccessibility="no"
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
        <View style={styles.iconBg} accessible={true} accessibilityRole="Text" accessibilityLabel="Auto Pay Icon">
          <AutoPayIcon />
        </View>
        <View style={{ flexDirection: "column" }}>
          <Text style={styles.leftTitle} accessible={true} accessibilityRole="header" accessibilityLevel={2} accessibilityLabel="Auto Pay" >Auto Pay</Text>
          {showSkeleton ? (
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
              accessible={true}
              accessibilityRole='link'
              accessibilityHint="Double tap to navigate to Auto Pay management page."
              accessibilityLabel={"Manage Auto Pay" }
            >
              Manage
            </Text>
          )}
        </View>
        <View style={{ position: "absolute", right: 10 }}>
          {showSkeleton ? (
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
            <Text style={styles.autoPayStatusText} accessible={true} accessibilityLabel="Auto Pay is On">ON</Text>
          ) : (
            <Text style={styles.autoPayStatusTextInActive} accessible={true} accessibilityLabel="Auto Pay is Off">OFF</Text>
          )}
        </View>
      </View>
    </Touchable>
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
