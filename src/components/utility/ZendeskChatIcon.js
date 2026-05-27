import React, { useCallback } from "react";
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
import {
  useFeatureFlag,
  useFeatureRefresh,
} from "../../contexts/Featureflagscontext";
import FeatureFlags from "../../config/Featureflags";
import { useFocusEffect } from "@react-navigation/native";

const ZendeskChatIcon = () => {
  const refreshFeatureFlags = useFeatureRefresh();
  const isChatFeatureEnabled = useFeatureFlag(FeatureFlags.DASHBOARD_CHAT_ICON);

  useFocusEffect(
    useCallback(() => {
      // Re-check remote config whenever the current tab/screen is focused.
      refreshFeatureFlags().catch((error) => {
        console.warn("Error refreshing feature flags for chat icon", error);
      });
    }, [refreshFeatureFlags])
  );

  const handleChatPress = () => {
    if (Platform.OS === "ios") {
      startChat();
    } else {
      startChatWithConfig();
    }
  };

  return isChatFeatureEnabled ? (
    <Pressable
      style={[styles.pressable]}
      onPress={handleChatPress}
      accessible={true}
      accessibilityLabel="Chat with support"
      accessibilityHint="Opens the chat support screen"
      accessibilityRole="button"
    >
      <LottieView
        source={animationSource}
        autoPlay
        loop
        style={{ width: 40, height: 30 }}
      />
    </Pressable>
  ) : null;
};

const styles = StyleSheet.create({
  perusable: {
    //flex: 1,
    width: "100%",
  },
  
});

export default ZendeskChatIcon;
