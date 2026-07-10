import React from "react";
import { View, Text, StyleSheet } from "react-native";
import colors from "../../../res/Colors";
import PaperIconBg from "../../../res/svgIcons/PaperIconBg";
import { widthPercentageToDP as wp } from "react-native-responsive-screen";
import { FontFamily, Padding, Color } from "../../../../GlobalStyles";
import { card } from "../../../styles/utilities";
import SkeletonPlaceholder from "react-native-skeleton-placeholder";
import Touchable from "../customui/Touchable";
import AppStyles from "../../../styles/AppStyles";
import { SectionTitle, IndicatorText } from "../customui/Typography";
import Checkcircle from "../../../../assets/svgs/Checkcircle";
import Checkcircle1 from "../../../../assets/svgs/Checkcircle1";

const StatusIcon = ({ status, style }) => {
  return (
    <View style={style}>
      {status === "On" ? <Checkcircle /> : <Checkcircle1 />}
    </View>
  );
};

const PeperLessCard = ({ paperlessStatus, navigation, isStatusLoading }) => {
  const showSkeleton = isStatusLoading || paperlessStatus === undefined;

  const handleCardPress = () => {
    if (!showSkeleton) {
      navigation.navigate("account", { screen: "Notifications" });
    }
  };

  return (
    <Touchable
      style={[AppStyles.card, { alignItems: "stretch", marginBottom: 16 }]}
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
          <SectionTitle
            style={styles.leftTitle}
            accessible={true}
            accessibilityRole="header"
            accessibilityLevel={2}
            accessibilityLabel="Paperless Billing"
          >
            Paperless Billing
          </SectionTitle>
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
              accessibilityRole="link"
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
                <View style={{ flexDirection: "row" }}>
                  <StatusIcon status="On" style={styles.statusIcon} />
                  <IndicatorText
                    style={{ marginLeft: 4, marginTop: 4 }}
                    accessible={true}
                    accessibilityRole="text"
                    accessibilityLabel="Paperless Billing is On"
                  >
                    On
                  </IndicatorText>
                </View>
              ) : (
                <View style={{ flexDirection: "row" }}>
                  <StatusIcon status="Off" style={styles.statusIcon} />
                  <IndicatorText
                    style={{ marginLeft: 4, marginTop: 2 }}
                    accessible={true}
                    accessibilityRole="text"
                    accessibilityLabel="Paperless Billing is Off"
                  >
                    Off
                  </IndicatorText>
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
  leftTitle: {
    marginLeft: 8,
    alignContent: "flex-start",
    alignSelf: "center",
  },
  
  statusRow: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    width: "100%",
    marginVertical: 5,
  },
  iconContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  statusIcon: {
    marginTop: 4,
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
