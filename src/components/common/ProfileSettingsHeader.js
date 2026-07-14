import React, { useState } from "react";
import {
  View,
  Text,
  StatusBar,
  StyleSheet,
} from "react-native";
import LinearGradient from "react-native-linear-gradient";
import { Color, FontFamily, FontSize } from "../../../GlobalStyles";
import { A11Y } from "../../styles/theme";
import LeftIcon from "../../../assets/svgs/Chevronleft";
import ZendeskChatIcon from "../utility/ZendeskChatIcon";
import Touchable from "./customui/Touchable";

const ProfileSettingsHeader = ({
  title,
  onPressBack,
  accessibleLable = undefined,
  iconAlignment = "right",
  iconSource = LeftIcon,
  showIcon = true,
}) => {
  const [iconPressed, setIconPressed] = useState(false);
  const IconComponent = iconSource || LeftIcon;

  const handleBackPress = () => {
    if (typeof onPressBack === "function") {
      onPressBack();
    }
  };

  const handlePressIn = () => {
    setIconPressed(true);
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
        start={{ x: 0, y: 0 }}
        end={{ x: 3, y: 1 }}
        colors={["rgba(141, 59, 144, 1))", "rgba(53, 48, 145, 1)"]}
        useAngle={true}
        angle={90}
      >
        <>
          <View style={[styles.navBar]}>
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

            {showIcon && (
              <View style={styles.buttonContainer} pointerEvents="box-none">
                <Touchable
                  style={styles.pressable}
                  onPress={handleBackPress}
                  onAccessibilityTap={handleBackPress}
                  onAccessibilityAction={({ nativeEvent }) => {
                    if (nativeEvent.actionName === "activate") {
                      handleBackPress();
                    }
                  }}
                  accessible={true}
                  focusable={true}
                  accessibilityLabel="Back"
                  accessibilityHint="Returns to the previous screen"
                  accessibilityRole="button"
                  accessibilityActions={[{ name: "activate", label: "Go back" }]}
                  accessibilityState={{ disabled: typeof onPressBack !== "function" }}
                  hitSlop={A11Y.hitSlop}
                  onPressIn={handlePressIn}
                  onPressOut={handlePressOut}
                >
                  <View
                    style={[styles.icon, iconPressed ? styles.iconPressed : null]}
                    accessible={false}
                    accessibilityElementsHidden={true}
                    importantForAccessibility="no-hide-descendants"
                  >
                    <IconComponent accessible={false} />
                  </View>
                </Touchable>
              </View>
            )}
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
    position: "absolute",
    left: 8,
    top: 0,
    bottom: 0,
    justifyContent: "center",
    alignItems: "center",
    zIndex: 10,
  },
  titleContainer: {
    justifyContent: "center",
    alignItems: "center",
  },
  pressable: {
    justifyContent: "center",
    alignItems: "center",
    minHeight: A11Y.minTouch,
    minWidth: A11Y.minTouch,
    paddingHorizontal: 10,
    paddingVertical: 10,
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
    justifyContent: "center",
    alignItems: "center",
  },
  iconPressed: {
    opacity: 0.5,
  },
});

export default ProfileSettingsHeader;
