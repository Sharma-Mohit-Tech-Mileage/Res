import { Platform } from "react-native";
import { calculateTabBarHeight, TAB_BAR_HEIGHT } from "../src/navigations/tabBarHeight";

describe("calculateTabBarHeight", () => {
  const originalOS = Platform.OS;
  afterEach(() => { Platform.OS = originalOS; });

  it("is fixed on iOS regardless of insets", () => {
    Platform.OS = "ios";
    expect(calculateTabBarHeight({ bottom: 34 })).toBe(TAB_BAR_HEIGHT.IOS);
    expect(calculateTabBarHeight()).toBe(TAB_BAR_HEIGHT.IOS);
  });

  it("adds the bottom inset on Android so 3-button nav bars are cleared", () => {
    Platform.OS = "android";
    expect(calculateTabBarHeight({ bottom: 0 })).toBe(60);
    expect(calculateTabBarHeight({ bottom: 24 })).toBe(84);
    expect(calculateTabBarHeight({ bottom: 48 })).toBe(108);
    expect(calculateTabBarHeight()).toBe(60);
  });
});
