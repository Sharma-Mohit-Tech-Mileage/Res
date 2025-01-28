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

const SupportChatHeader = ({
  title,
  onPressBack,
  iconAlignment = "right",
  iconSource = require("../../../assets/chevronleft.png"),
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
        
        <View style={[styles.navBar]}>
          {showIcon && (
            <View style={styles.buttonContainer}>
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
                <Image
                  style={[styles.icon, iconPressed ? styles.iconPressed : null]}
                  resizeMode="cover"
                  source={iconSource}
                />
              </Pressable>
            </View>
          )}
          <View style={styles.titleContainer}>
            <Text
              style={styles.title}
              accessible={true}
              accessibilityRole="header"
              accessibilityLabel={`Header: ${title}`}
            >
              {title}
            </Text>
          </View>
        </View>
      
        <Text
          style={{
            fontSize: FontSize.size_xs,
            fontWeight: "400",
            color: Color.sparklightWhite,
            fontFamily: FontFamily.openSansSemiBold,
            marginHorizontal:10,
            alignSelf:'center',
            textAlign:'center'
            
          }}
        >
          Please stay on this page while using the chat to ensure a smooth and
          uninterrupted experience.
        </Text>
        
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
    height: 140,
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
    flex: 0.1,
    justifyContent: "center",
    alignItems: "center",
  },
  titleContainer: {
    flex: 0.9,
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "column",
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
    paddingVertical: 5,
  },
  icon: {
    height: 24,
    width: 24,
  },
  iconPressed: {
    opacity: 0.5,
  },
});

export default SupportChatHeader;
