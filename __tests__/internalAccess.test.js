jest.mock("react-native-device-info", () => ({
  __esModule: true,
  default: { getInstallerPackageName: jest.fn(() => Promise.resolve("AppStore")) },
}));

import { Platform } from "react-native";
import {
  isStoreInstall,
  isInternalBuild,
  isValidBypassCode,
  shouldSkipMaintenance,
} from "../src/utils/internalAccess";

const on = (over = {}) => ({ enabled: true, bypassCode: "SPK-2609", ...over });

describe("internalAccess — 52452", () => {
  afterEach(() => { Platform.OS = "ios"; });

  describe("identifying a public store install", () => {
    it("iOS: App Store is a store install, TestFlight is not", () => {
      Platform.OS = "ios";
      expect(isStoreInstall("AppStore")).toBe(true);
      expect(isStoreInstall("TestFlight")).toBe(false);
      expect(isStoreInstall("Other")).toBe(false);
    });

    it("Android: Play is a store install, a sideloaded APK is not", () => {
      Platform.OS = "android";
      expect(isStoreInstall("com.android.vending")).toBe(true);
      expect(isStoreInstall("com.google.android.packageinstaller")).toBe(false);
      expect(isStoreInstall("unknown")).toBe(false);
    });
  });

  describe("silent bypass for internal builds", () => {
    it("a TestFlight build bypasses", () => {
      Platform.OS = "ios";
      expect(isInternalBuild(on(), "TestFlight")).toBe(true);
    });

    it("an App Store build does NOT bypass", () => {
      Platform.OS = "ios";
      expect(isInternalBuild(on(), "AppStore")).toBe(false);
    });

    it("a sideloaded APK bypasses", () => {
      Platform.OS = "android";
      expect(isInternalBuild(on(), "com.google.android.packageinstaller")).toBe(true);
    });

    it("a Play Store build does NOT bypass — including Play internal testing", () => {
      Platform.OS = "android";
      expect(isInternalBuild(on(), "com.android.vending")).toBe(false);
    });

    it("nothing bypasses while the install source is still unknown", () => {
      expect(isInternalBuild(on(), null)).toBe(false);
    });

    it("the master switch turns the silent bypass off", () => {
      Platform.OS = "ios";
      expect(isInternalBuild(on({ enabled: false }), "TestFlight")).toBe(false);
    });
  });

  describe("bypass code, for store builds", () => {
    it("accepts the configured code, trimmed and case-insensitive", () => {
      expect(isValidBypassCode(on(), "spk-2609")).toBe(true);
      expect(isValidBypassCode(on(), "  SPK-2609 ")).toBe(true);
    });

    it("rejects a wrong code", () => {
      expect(isValidBypassCode(on(), "nope")).toBe(false);
    });

    it("never matches when no code is configured", () => {
      expect(isValidBypassCode(on({ bypassCode: "" }), "")).toBe(false);
      expect(isValidBypassCode(on({ bypassCode: "" }), "anything")).toBe(false);
    });

    it("the master switch turns the code off too", () => {
      expect(isValidBypassCode(on({ enabled: false }), "SPK-2609")).toBe(false);
    });
  });
});

describe("maintenance testing window — 52452", () => {
  afterEach(() => { Platform.OS = "ios"; });

  it("skips maintenance for an internal build while the feature is on", () => {
    expect(shouldSkipMaintenance(on(), "TestFlight")).toBe(true);
  });

  it("enabled:false is the test mode - internal builds see the page like customers", () => {
    expect(shouldSkipMaintenance(on({ enabled: false }), "TestFlight")).toBe(false);
  });

  it("enabled:false also blocks an accepted code, so no one slips past during a test window", () => {
    expect(shouldSkipMaintenance(on({ enabled: false }), "AppStore", true)).toBe(false);
  });

  it("lets a store build through only with an accepted code", () => {
    expect(shouldSkipMaintenance(on(), "AppStore")).toBe(false);
    expect(shouldSkipMaintenance(on(), "AppStore", true)).toBe(true);
  });
});
