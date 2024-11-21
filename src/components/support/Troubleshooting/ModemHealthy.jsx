import React, { useEffect, useRef } from "react";
import { View, Text, StyleSheet, TouchableOpacity, Dimensions, SafeAreaView, ScrollView, AccessibilityInfo, findNodeHandle } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { Color, Padding, FontSize, FontFamily } from "../../../../GlobalStyles";
import { widthPercentageToDP as wp } from "react-native-responsive-screen";
import ServiceIcon from "../../../res/svgIcons/troubleshooting/icon-globe";
import RightArrow from "../../../res/svgIcons/RightArrow";
import ProfileSettingsHeader from "../../common/ProfileSettingsHeader";
import WifiIssueIcon from "../../../res/svgIcons/WifiIssueIcon";
import Surfingissue from "../../../res/svgIcons/surfingissue";
import IntermittentIssues from "../../../res/svgIcons/IntermittentIssues";
import Noconnection from "../../../res/svgIcons/Noconnection";
import Modemicon from "../../../res/svgIcons/Modemicon";
import WaveAnimation from '../../common/WaveIcon';

const windowHeight = Dimensions.get("window").height;
const windowWidth = Dimensions.get("window").width;

const ModemHealthy = () => {
  const navigation = useNavigation();
  const alertRef = useRef(null);

  useEffect(() => {
    const manageFocus = async () => {
      const isEnabled = await AccessibilityInfo.isScreenReaderEnabled();
      if (!isEnabled) return;

      // Focus on main alert message after component mount
      setTimeout(() => {
        const reactTag = findNodeHandle(alertRef?.current);
        if (reactTag) {
          AccessibilityInfo.setAccessibilityFocus(reactTag);
        }
      }, 500);
    };

    manageFocus();
  }, []);

  const MenuButton = ({ icon: Icon, text, onPress, testID }) => (
    <>
      <View style={styles.borderSec} />
      <TouchableOpacity
        style={styles.pressableStyle}
        onPress={onPress}
        accessible={true}
        accessibilityRole="button"
        accessibilityLabel={text}
        accessibilityHint={`Navigate to ${text} section`}
        testID={testID}
      >
        <View style={styles.menuWrap}>
          <Icon />
          <Text style={styles.menuText}>{text}</Text>
        </View>
        <RightArrow />
      </TouchableOpacity>
    </>
  );

  return (
    <View style={styles.mainContainer}>
      <ProfileSettingsHeader
        title="Troubleshooting"
        onPressBack={() => navigation.navigate('SupportStack')}
        accessibilityLabel="Back to Support"
        accessibilityHint="Navigates back to the Support screen"
      />

      <SafeAreaView style={styles.safeAreaContainer}>
        <ScrollView style={styles.scrollView}>
          <View style={styles.container}>
            <Text
              style={styles.topLeftText}
              accessible={true}
              accessibilityRole="header"
              accessibilityLabel="Step 3 of 3"
            >
              3 of 3
            </Text>

            <View style={styles.content}>
              <View
                accessible={true}
                accessibilityRole="image"
                accessibilityLabel="Service check complete, no issues detected"
              >
                <WaveAnimation loading={false} isIssueDetected={false}>
                  <ServiceIcon width={80} height={80} />
                </WaveAnimation>
              </View>

              <View
                ref={alertRef}
                accessible={true}
                accessibilityRole="alert"
                accessibilityLabel="No service issues were detected"
                style={styles.titleContainer}
              >
                <Text style={styles.title}>
                  No service issues were detected.
                </Text>
              </View>

              <View style={styles.cardContainer}>
                <View style={styles.card}>
                  <MenuButton
                    icon={Modemicon}
                    text="Manage Equipment"
                    onPress={() => navigation.navigate('ManageEquipment', { isFromTroubleshooting: true })}
                    testID="manage-equipment-button"
                  />

                  <MenuButton
                    icon={WifiIssueIcon}
                    text="Wi-Fi Issues"
                    onPress={() => navigation.navigate('ArticalWindowUtility', {
                      url: 'https://support.sparklight.com/hc/en-us/articles/115010184927-What-Can-I-Do-for-WiFi-Issues',
                      name: 'Wi-Fi Issues'
                    })}
                    testID="wifi-issues-button"
                  />

                  <MenuButton
                    icon={Surfingissue}
                    text="Surfing Issues"
                    onPress={() => navigation.navigate('ArticalWindowUtility', {
                      url: 'https://support.sparklight.com/hc/en-us/sections/115002453808-Surfing-Email',
                      name: 'Surfing Issues'
                    })}
                    testID="surfing-issues-button"
                  />

                  <MenuButton
                    icon={IntermittentIssues}
                    text="Intermittent Issues"
                    onPress={() => navigation.navigate("PeriodicProblems")}
                    testID="intermittent-issues-button"
                  />

                  <MenuButton
                    icon={Noconnection}
                    text="No Connection"
                    onPress={() => navigation.navigate('ModemConnectivityGuide', { isSuccess: true })}
                    testID="no-connection-button"
                  />

                  <View style={styles.borderSec} />
                </View>
              </View>
            </View>
          </View>
        </ScrollView>
      </SafeAreaView>
    </View>
  );
};

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    backgroundColor: Color.colorWhitesmoke_200
  },
  safeAreaContainer: {
    flex: 1,
    justifyContent: "center",
    paddingVertical: Padding.p_5xl,
    marginBottom: "15%",
  },
  scrollView: {
    marginBottom: 20,
    paddingHorizontal: Padding.p_base,
  },
  container: {
    flex: 1,
    justifyContent: "space-between",
    paddingTop: windowHeight * 0.00,
    backgroundColor: Color.sparklightWhite,
  },
  content: {
    flexGrow: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  titleContainer: {
    justifyContent: "center",
    paddingVertical: 8
  },
  cardContainer: {
    flexDirection: "column",
    flex: 1
  },
  pressableStyle: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginHorizontal: 20,
    alignItems: "center",
    paddingVertical: 20,
  },
  menuText: {
    color: Color.colorGray_200,
    fontFamily: FontFamily.openSansRegular,
    fontSize: FontSize.size_base,
    fontStyle: "normal",
    fontWeight: "400",
    marginLeft: 10,
  },
  menuWrap: {
    flexDirection: "row",
    alignContent: "center",
  },
  borderSec: {
    width: "100%",
    height: 1,
    backgroundColor: Color.sparklightGray,
  },
  title: {
    fontSize: 22,
    color: "#292929",
    textAlign: "center",
    lineHeight: 28,
    fontWeight: "400",
  },
  topLeftText: {
    position: "absolute",
    top: 0,
    left: 0,
    color: "#292929",
    fontFamily: FontFamily.openSansRegular,
    fontSize: 16,
    fontWeight: "700",
    lineHeight: 28,
    padding: 10,
  },
  card: {
    marginTop: Padding.p_base,
    width: wp("92%"),
  },
});

export default ModemHealthy;