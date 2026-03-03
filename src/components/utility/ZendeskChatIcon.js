import React, { useState } from "react";
import {
  Platform,
  StyleSheet,
  View,
  Pressable,
} from "react-native";

import LottieView from "lottie-react-native";
import animationSource from "../../../assets/animations/chatbot-animation.json";
import {
  startChatWithConfig,
  initChat,
  startChat,
} from "../utility/RNZendeskChat";

const ZendeskChatIcon = () => {
  const handleChatPress = () => {
    if (Platform.OS === "ios") {
      startChat();
    } else {
      startChatWithConfig();
    }
  };

  return (
    // <Pressable
    //   style={[styles.pressable ]}
    //   onPress={handleChatPress}
    //   accessible={true}
    //   accessibilityLabel="Chat with support"
    //   accessibilityHint="Opens the chat support screen"
    //   accessibilityRole="button"
      
    // >
    //   <LottieView
    //     source={animationSource}
    //     autoPlay
    //     loop
    //     style={{ width: 40, height: 30 }}
    //   />
    // </Pressable>
    <>
    </>
  );
};

const styles = StyleSheet.create({
  perusable: {
    //flex: 1,
    width: "100%",
  },
  
});

export default ZendeskChatIcon;
