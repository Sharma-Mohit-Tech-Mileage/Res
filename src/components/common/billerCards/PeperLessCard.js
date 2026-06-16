import React from "react";
import { View, Text, StyleSheet } from "react-native";
import colors from "../../../res/Colors";
import PaperIconBg from "../../../res/svgIcons/PaperIconBg";
import { wp } from "../../../utils/responsive";
import { FontFamily, Padding, Color } from "../../../../GlobalStyles";
import { card } from "../../../styles/utilities";
import SkeletonPlaceholder from "react-native-skeleton-placeholder";
import Touchable from "../customui/Touchable";

const PeperLessCard = ({ paperlessStatus, navigation, isStatusLoading }) => {
  const showSkeleton = isStatusLoading || paperlessStatus === undefined;

  const handleCardPress = () => {
    if (!showSkeleton) {
      navigation.navigate("account", { screen: "Notifications" });
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
        <View style={styles.iconBg} accessible={true} accessibilityRole="Text" accessibilityLabel="Paperless Billing Icon">
          <PaperIconBg />
        </View>
        <View style={{ flexDirection: "column" }}>
          <Text style={styles.leftTitle} accessible={true} accessibilityRole="header" accessibilityLevel={2} accessibilityLabel="Paperless Billing">Paperless Billing</Text>
          {showSkeleton ? (
            <SkeletonPlaceholder>
              <View
                style={{
                  width: wp("16%"),
                  height: 25,
                  marginLeft: 10,
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
              accessibilityHint="Double tap to navigate to Paperless Billing management page."
              accessibilityLabel="Manage Paperless Billing"
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
          ) : (
            <>
              {paperlessStatus ? (
                <Text style={styles.autoPayStatusText} accessible={true} accessibilityLabel="Paperless Billing is On">ON</Text>
              ) : (
                <Text style={styles.autoPayStatusTextInActive} accessible={true} accessibilityLabel="Paperless Billing is Off">OFF</Text>
              )}
            </>
          )}
        </View>
      </View>
    </Touchable>
  );
};

const styles = StyleSheet.create({
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

export default PeperLessCard;
