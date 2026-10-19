import { Platform } from "react-native";

export const TAB_BAR_HEIGHT = {
  IOS: 90,
  ANDROID_MIN: 55,
  ANDROID_PADDING: 60,
};

export const calculateTabBarHeight = (insets = {}) => {
  return Platform.OS === "ios"
    ? TAB_BAR_HEIGHT.IOS
    : Math.max(TAB_BAR_HEIGHT.ANDROID_MIN, (insets.bottom || 0) + TAB_BAR_HEIGHT.ANDROID_PADDING);
};
