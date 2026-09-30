import React from "react";
import { View, StyleSheet } from "react-native";
import Checkcircle from "../../../../assets/svgs/Checkcircle";
import Checkcircle1 from "../../../../assets/svgs/Checkcircle1"
import AutoPayIcon from "../../../res/svgIcons/AutoPayIcon";
import SkeletonPlaceholder from "react-native-skeleton-placeholder";
import Touchable from "../customui/Touchable";
import AppStyles from "../../../styles/AppStyles";
import {SectionTitle,IndicatorText,Hyperlink } from "../customui/Typography";
import { Color } from "../../../styles/GlobalStyles";

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
      navigation.navigate("AutoPay", { entryPoint: "autopay_card" });
    }
  };

  return (
    <Touchable
      style={[AppStyles.card, { alignItems: 'stretch', flexGrow: 1 }]}
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
         <View style={styles.iconBg} accessible={true} accessibilityRole="text" accessibilityLabel="Auto Pay Icon">
          <AutoPayIcon />
        </View> 
        <View style={styles.textColumn}>
          <SectionTitle style={styles.leftTitle} accessible={true} accessibilityRole="header" accessibilityLevel={2} accessibilityLabel="Auto Pay" >
            Auto Pay
          </SectionTitle>
          {showSkeleton ? (
            <SkeletonPlaceholder>
              <View style={{ width: 80, height: 20, borderRadius: 4, marginLeft: 10, marginTop: 6 }} />
            </SkeletonPlaceholder>
          ) : (
            <Hyperlink
              style={styles.manageLink}
              accessible={true}
              accessibilityRole='link'
              accessibilityHint="Double tap to navigate to Auto Pay management page."
              accessibilityLabel={"Manage Auto Pay" }
            >
              Manage
            </Hyperlink>
          )}
        </View>
        <View style={styles.statusColumn}>
          {showSkeleton ? (
            <SkeletonPlaceholder>
              <View style={{ width: 56, height: 22, borderRadius: 4 }} />
            </SkeletonPlaceholder>
          ) :( <>
              {isAutoPayStatus ? (
                <View style={styles.iconContainer}>
                  <StatusIcon status="On" style={styles.statusIcon} />
                  <IndicatorText style={styles.statusText} accessible={true} accessibilityRole='text' accessibilityLabel="Auto Pay is On">On</IndicatorText>
                </View>
              ) : (
                <View style={styles.iconContainer}>
                  <StatusIcon status="Off" style={styles.statusIcon} />
                  <IndicatorText style={styles.statusText} accessible={true} accessibilityRole='text' accessibilityLabel="Auto Pay is Off">Off</IndicatorText>
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
  // Title takes the free width and wraps; the status sits beside it in the flow so the two never overlap on narrow cards.
  textColumn: { flex: 1, flexShrink: 1 },
  statusColumn: { marginLeft: 8, justifyContent: "center" },

  leftTitle: {
    marginLeft: 8,
    alignContent: "flex-start",
    alignSelf: "flex-start",
  },
  
  iconBg: {
    alignSelf: "center",
    backgroundColor: Color.primaryTint,
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: "center",
    alignItems: "center",
  },
  manageLink: {
    marginLeft: 10,
  },
  iconContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  statusIcon: {
    marginTop: 0,
    marginRight: 4,
  },
  statusText: {
    marginLeft: 0,
    marginTop: 0,
  },
});

export default AutoPayCard;
