import React from "react";
import { View, Text, StyleSheet } from "react-native";
import colors from "../../../res/Colors";
import Checkcircle from "../../../../assets/svgs/Checkcircle";
import Checkcircle1 from "../../../../assets/svgs/Checkcircle1"
import AutoPayIcon from "../../../res/svgIcons/AutoPayIcon";
import { widthPercentageToDP as wp } from "react-native-responsive-screen";
import { FontFamily, Color } from "../../../../GlobalStyles";
import Config from "react-native-config";
import SkeletonPlaceholder from "react-native-skeleton-placeholder";
import Touchable from "../customui/Touchable";
import AppStyles from "../../../styles/AppStyles";
import {SectionTitle,IndicatorText } from "../customui/Typography";

const StatusIcon = ({ status, style }) => {
  return <View style={style}>{status === "On" ? <Checkcircle /> : <Checkcircle1 />}</View>;
};

const AutoPayCard = ({
  isAutoPayStatus,
  paymentDetails,
  navigation,
  isStatusLoading,
}) => {
  const showSkeleton = isStatusLoading || isAutoPayStatus === undefined;
  const handleCardPress = () => {
    if (!showSkeleton) {
      navigation.navigate("ArticleWindowUtility", {
        url: `${Config.PORTAL_BASE_URL}/portals/app-secure/${isAutoPayStatus ? 'manage-autopay' : 'activate-autopay'}`,
        name: isAutoPayStatus ? "Manage Auto Pay" : "Setup Auto Pay",
        injectPaymentObj: true,
      });
    }
  };

  return (
    <Touchable
      style={[AppStyles.card, { alignItems: 'stretch', marginBottom: 16 }]}
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
          <SectionTitle style={styles.leftTitle} accessible={true} accessibilityRole="header" accessibilityLevel={2} accessibilityLabel="Auto Pay" >
            Auto Pay
          </SectionTitle>
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
                color: colors.sparklight_bright_purple,
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
          ) :( <>
              {isAutoPayStatus ? (
                <View style={styles.iconContainer}>
                  <StatusIcon status="On" style={styles.statusIcon} />
                  <IndicatorText style={{marginLeft: 4, marginTop: 4}}  accessible={true} accessibilityRole='text' accessibilityLabel="Auto Pay is On">On</IndicatorText>
                </View>
              ) : (
                <View style={styles.iconContainer}>
                  <StatusIcon status="Off" style={styles.statusIcon} />
                  <IndicatorText style={{marginLeft: 4, marginTop: 2}}  accessible={true} accessibilityRole='text' accessibilityLabel="Auto Pay is Off">Off</IndicatorText>
                </View>
              )}
            </>
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
    marginLeft: 8,
    alignContent: "flex-start",
    alignSelf: "center",
  },
  
  iconBg: {
    alignSelf: "center",
    backgroundColor: "#8D3B901A",
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: "center",
    alignItems: "center",
  },statusRow: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    width: "100%",
    marginVertical: 5,
  },
  iconContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  statusIcon: {
    marginTop: 4,
  },
});

export default AutoPayCard;
