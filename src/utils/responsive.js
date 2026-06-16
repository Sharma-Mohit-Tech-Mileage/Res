// [51768] Single source of truth for device-size layout. Phones: isTablet=false gates all tablet-only behavior.
import { useWindowDimensions, Dimensions, PixelRatio } from "react-native";
import { isTabletDevice } from "./deviceInfo";

// Android smallest-width breakpoints (dp), per ticket AC.
export const BREAKPOINTS = { sw600: 600, sw720: 720, sw840: 840 };

export const TABLET_GUTTER = 16;

// Max content column / form width on tablets (dp).
export const CONTENT_MAX_WIDTH = 640;

// Max centered dialog / alert width on tablets (dp).
export const MODAL_MAX_WIDTH = 480;

export function getBreakpoint(smallestWidth) {
  if (smallestWidth >= BREAKPOINTS.sw840) return "sw840";
  if (smallestWidth >= BREAKPOINTS.sw720) return "sw720";
  if (smallestWidth >= BREAKPOINTS.sw600) return "sw600";
  return "phone";
}

// deviceSize bucket: small <360 / medium <400 / large <600 / tablet >=600 (dp).
export function getDeviceSize(width, height) {
  const sw = Math.min(width, height);
  if (sw >= BREAKPOINTS.sw600) return "tablet";
  if (sw >= 400) return "large";
  if (sw >= 360) return "medium";
  return "small";
}

// isTablet: native flag OR width >= sw600 (covers foldables reporting false).
export function isTabletForSize(width, height) {
  return isTabletDevice || Math.min(width, height) >= BREAKPOINTS.sw600;
}

// Vertical space tier by window height (dp) — for height-sensitive layouts (e.g. splash logo).
export function getVerticalSizeTier(height) {
  if (height < 550) return "tiny";
  if (height < 600) return "verySmall";
  if (height < 700) return "small";
  return "normal";
}

// wp/hp: drop-in for react-native-responsive-screen. Phone-identical; wp clamps to CONTENT_MAX_WIDTH on tablets.
export function wp(percent) {
  const n = typeof percent === "number" ? percent : parseFloat(percent);
  const { width, height } = Dimensions.get("window");
  const refWidth = Math.min(width, height) >= BREAKPOINTS.sw600 ? Math.min(width, CONTENT_MAX_WIDTH) : width;
  return PixelRatio.roundToNearestPixel((refWidth * n) / 100);
}

export function hp(percent) {
  const n = typeof percent === "number" ? percent : parseFloat(percent);
  const { height } = Dimensions.get("window");
  return PixelRatio.roundToNearestPixel((height * n) / 100);
}

// Per-breakpoint value with downward fallback when a level is omitted.
export function resolveColumns(map, breakpoint) {
  const order = ["sw840", "sw720", "sw600", "phone"];
  for (let i = order.indexOf(breakpoint); i < order.length; i++) {
    if (map[order[i]] != null) return map[order[i]];
  }
  return map.phone ?? 1;
}

// Static snapshot for non-React callers (not reactive to rotation).
export function getResponsiveSnapshot() {
  const { width, height } = Dimensions.get("window");
  return {
    width,
    height,
    smallestWidth: Math.min(width, height),
    isTablet: isTabletForSize(width, height),
    isLandscape: width > height,
    breakpoint: getBreakpoint(Math.min(width, height)),
    deviceSize: getDeviceSize(width, height),
  };
}

// Reactive hook (updates on rotation / split-screen).
export function useResponsive() {
  const { width, height } = useWindowDimensions();
  const smallestWidth = Math.min(width, height);
  const isTablet = isTabletForSize(width, height);
  const breakpoint = getBreakpoint(smallestWidth);

  return {
    width,
    height,
    smallestWidth,
    isTablet,
    isLandscape: width > height,
    breakpoint,
    deviceSize: getDeviceSize(width, height),
    columns: (map = {}) => resolveColumns(map, breakpoint),
    gutterStyle: isTablet ? { paddingHorizontal: TABLET_GUTTER } : null,
    contentMaxWidth: CONTENT_MAX_WIDTH,
  };
}
