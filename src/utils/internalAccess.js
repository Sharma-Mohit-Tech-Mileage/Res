import { Platform } from "react-native";
import DeviceInfo from "react-native-device-info";

// 52452: lets the team keep using the app while maintenance blocks customers.
//
// A build is "internal" when it did not come from a public store:
//   iOS      getInstallerPackageName() === "AppStore" only for App Store installs.
//            TestFlight builds report "TestFlight" (the receipt is a sandbox receipt).
//   Android  Play reports "com.android.vending" for every track, so a Play internal-testing
//            install is indistinguishable from a customer's. What we can detect is a build
//            that did not come from Play at all - which is how QA APKs are handed out here.
//
// Store builds have no such signal, so they use the bypass code instead.

const APP_STORE = "AppStore";
const PLAY_STORE = "com.android.vending";

export const readInstallSource = async () => {
  try {
    return (await DeviceInfo.getInstallerPackageName()) || "unknown";
  } catch {
    return "unknown";
  }
};

export const isStoreInstall = (installSource) =>
  Platform.OS === "ios" ? installSource === APP_STORE : installSource === PLAY_STORE;

// Pure build check, independent of Remote Config.
export const isNonStoreBuild = (installSource) =>
  !!installSource && !isStoreInstall(installSource);

// Silent bypass: a non-store build, but only while Remote Config has the feature switched on.
export const isInternalBuild = (config, installSource) =>
  Boolean(config?.enabled) && isNonStoreBuild(installSource);

// Manual fallback for store builds. A blank configured code never matches, so leaving
// bypassCode empty disables code entry without disabling the silent path.
export const isValidBypassCode = (config, entered) => {
  if (!config?.enabled) return false;
  const expected = String(config.bypassCode || "").trim();
  if (!expected) return false;
  return String(entered || "").trim().toLowerCase() === expected.toLowerCase();
};

// The single switch: enabled:false means nobody bypasses, so internal users get the customer
// experience and a maintenance change can be verified end to end from an internal build.
export const shouldSkipMaintenance = (config, installSource, codeAccepted = false) =>
  isInternalBuild(config, installSource) || (Boolean(config?.enabled) && codeAccepted);
