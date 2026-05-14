import React, { useState } from "react";
import {
  Platform,
  StyleSheet,
  View,
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
    <>
    </>
  );
};

const styles = StyleSheet.create({
  perusable: {
    width: "100%",
  },
});

export default ZendeskChatIcon;
