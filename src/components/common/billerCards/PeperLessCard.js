import React from "react";
import { View, Text, StyleSheet, Pressable } from "react-native";
import colors from "../../../res/Colors";
import RightArrow from "../../../res/svgIcons/RightArrow";
import PaperIconBg from "../../../res/svgIcons/PaperIconBg";
import { widthPercentageToDP as wp } from "react-native-responsive-screen";
import { FontFamily, Padding, Color } from "../../../../GlobalStyles";
import AppStyles from "../styles/AppStyles";
import SkeletonPlaceholder from "react-native-skeleton-placeholder";

const PeperLessCard = ({
  paperlessCardEmail,
  paperlessStatus,
  navigation,
  style,
  isStatusLoading,
}) => {
  const handleCardPress = () => {
    if (!isStatusLoading){
      navigation.navigate("account", { screen: "Notifications" });
    }
  };

  return (
    <Pressable
      style={[AppStyles.card, style]}
      onPress={handleCardPress}
      activeOpacity={0.8}
      accessible={true}
      accessibilityLabel={
        (paperlessStatus ? "Paperless Billing is On. " : "Paperless Billing is Off. ") +
        "Manage Paperless Billing"
      }
      accessibilityRole="link"
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
          <PaperIconBg />
        </View>
        <View style={{ flexDirection: "column" }}>
          <Text 
          style={styles.leftTitle}>Paperless Billing</Text>
          {isStatusLoading ? (
            <SkeletonPlaceholder>
              <View
                style={{
                 width: wp("16%"),
                    height: 25,
                    marginLeft: 10,
                    borderRadius: 4,
                    paddingVertical: 4,
                    paddingHorizontal: 8,
                    marginTop: 5,// <-- Add this line to move it more to the left
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
          ) : (
            <>
              {paperlessStatus ? (
                <Text style={styles.autoPayStatusText}>ON</Text>
              ) : (
                <Text style={styles.autoPayStatusTextInActive}>OFF</Text>
              )}
            </>
          )}
        </View>
      </View>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  headerContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: Padding.p_xs,
    marginBottom: 23,
  },
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
    paddingHorizontal: Padding.p_5xl,
    paddingBottom: Padding.p_xs,
    alignItems: "center",
    justifyContent: "center",
    width: wp("39%"),
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
  icon: {
    alignContent: "flex-start",
    alignSelf: "flex-start",
    marginBottom: 10,
  },
  leftTitle: {
    color: colors.sp_black,
    fontSize: 18,
    fontWeight: "600",
    fontFamily: FontFamily.openSansRegular,
    textAlign: "center",
    marginLeft: 10,
    alignContent: "flex-start",
    alignSelf: "center",
  },
  cardContent: {
    alignItems: "center",
  },
  statusRow: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    width: "100%",
    marginVertical: 5,
  },
  dueDate: {
    fontSize: 14,
    fontWeight: "700",
    alignContent: "center",
    fontFamily: FontFamily.openSansRegular,
    color: colors.sparklight_purple_blue,
    textAlign: "center",
    marginHorizontal: 20,
  },
  thankYouText: {
    fontSize: 14,
    color: colors.sparklight_purple_blue,
    textAlign: "center",
    fontWeight: "700",
    FontFamily: FontFamily.openSansRegular,
    marginTop: Padding.p_xs,
    marginBottom: 19,
  },
  subText: {
    fontSize: 14,
    color: colors.gray600,
    alignSelf: "center",
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
  cardHreader: {
    flexDirection: "row",
    width: wp("92%"),
    padding: 10,
  },
  cardFooter: {
    flexDirection: "row",
    backgroundColor: "#F8F8F8",
    width: wp("100%"),
    padding: 10,
    position: "absolute",
    bottom: 0,
    left: 0,
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

export default PeperLessCard;
