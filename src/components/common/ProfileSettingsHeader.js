import React, { useState } from "react";
import {
  View,
  Text,
  StatusBar,
  Pressable,
  Image,
  StyleSheet,
  AccessibilityInfo,
} from "react-native";
import LinearGradient from "react-native-linear-gradient";
import { Color, FontFamily, FontSize } from "../../../GlobalStyles";
import LeftIcon from "../../../assets/svgs/Chevronleft";
import ZendeskChatIcon from "../utility/ZendeskChatIcon";

const ProfileSettingsHeader = ({
  title,
  onPressBack,
  accessibleLable = undefined,
  iconAlignment = "right",
  iconSource = LeftIcon,
  showIcon = true,
}) => {
  const [iconPressed, setIconPressed] = useState(false);

  const handlePressIn = () => {
    setIconPressed(true);
    AccessibilityInfo.announceForAccessibility("Back button pressed");
  };

  const handlePressOut = () => {
    setIconPressed(false);
  };

  return (
    <View style={styles.perusable}>
      <StatusBar
        barStyle="light-content"
        translucent={true}
        backgroundColor="transparent"
      />
      <LinearGradient
        style={[styles.profileSettingsChild]}
        locations={[0, 1]}
        colors={["rgba(53, 48, 145, 1)", "rgba(141, 59, 144, 1)"]}
        useAngle={true}
        angle={90}
      >
        <>
          <View style={[styles.navBar]}>
            {showIcon && (
              <View style={[styles.buttonContainer, { flex: 1 }]}>
                <Pressable
                  style={[styles.pressable]}
                  onPress={onPressBack}
                  accessible={true}
                  accessibilityLabel="Back"
                  accessibilityHint="Returns to the previous screen"
                  accessibilityRole="button"
                  hitSlop={{ top: 60, bottom: 60, left: 60, right: 60 }}
                  onPressIn={handlePressIn}
                  onPressOut={handlePressOut}
                >
                  
                  <View
                    style={[
                      styles.icon,
                      iconPressed ? styles.iconPressed : null,
                    ]}
                  >
                    <LeftIcon />
                  </View>
                </Pressable>
              </View>
            )}
            <View style={[styles.titleContainer, { flex: 1 }]}>
              <Text
                style={styles.title}
                accessible={title ? true : false}
                accessibilityRole="header"
                accessibilityLevel={1}
                accessibilityLabel={accessibleLable ? accessibleLable : title}
              >
                {title}
              </Text>
            </View>
            <View style={{ justifyContent: "flex-end" }}>
              <ZendeskChatIcon />
            </View>
          </View>
        </>
      </LinearGradient>
    </View>
  );
};

const styles = StyleSheet.create({
  perusable: {
    //flex: 1,
    width: "100%",
  },
  profileSettingsChild: {
    overflow: "hidden",
    width: "100%",
    paddingTop: 40,
  },
  navBar: {
    height: 56,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 8,
  },
  buttonContainer: {
    position: "absolute", // Position the button absolutely
    left: 8, // Align to the left
    justifyContent: "center",
    alignItems: "center",
  },
  titleContainer: {
    justifyContent: "center",
    alignItems: "center",
  },
  pressable: {
    justifyContent: "center",
    alignItems: "center",
    height: 24,
    width: 24,
  },
  title: {
    fontSize: FontSize.size_lg,
    fontWeight: "600",
    color: Color.sparklightWhite,
    fontFamily: FontFamily.openSansSemiBold,
  },
  icon: {
    height: 24,
    width: 24,
    marginLeft: 10,
    marginTop: 12,
  },
  iconPressed: {
    opacity: 0.5,
  },
});

export default ProfileSettingsHeader;
