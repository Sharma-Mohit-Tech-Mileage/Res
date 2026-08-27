// [51768] Window size classes (Material 3). Layout follows the WINDOW, never the device — that is what keeps split-screen, foldables and iPad Slide Over correct without a device-type check anywhere.
import { useMemo } from "react";
import { Dimensions, PixelRatio, useWindowDimensions } from "react-native";
import theme from "../styles/theme";

// Width breakpoints in dp. Compact covers 99.96% of phones in portrait, so compact is today's phone UI by construction.
export const BREAKPOINTS = { medium: 600, expanded: 840, large: 1200 };

// Ordered smallest to largest; resolve() walks this backwards.
export const SIZE_CLASSES = ["compact", "medium", "expanded", "large"];

export const LAYOUT = theme.layout;

export function getSizeClass(width) {
  if (!(width > 0)) return "compact";
  if (width >= BREAKPOINTS.large) return "large";
  if (width >= BREAKPOINTS.expanded) return "expanded";
  if (width >= BREAKPOINTS.medium) return "medium";
  return "compact";
}

// Reads a sparse per-class map, falling back down the ladder so { compact, expanded } still answers for "medium".
export function resolve(map, sizeClass) {
  if (map === null || typeof map !== "object") return map;
  const start = SIZE_CLASSES.indexOf(sizeClass);
  for (let i = start === -1 ? 0 : start; i >= 0; i--) {
    const value = map[SIZE_CLASSES[i]];
    if (value !== undefined && value !== null) return value;
  }
  return undefined;
}

// Caps and centres a content column. Returns null at compact so phones render the exact same style object they do today.
export function contentWidthStyle(sizeClass, maxWidth = LAYOUT.maxContentWidth) {
  if (sizeClass === "compact") return null;
  return { width: "100%", maxWidth, alignSelf: "center" };
}

export function gutterStyle(sizeClass) {
  const value = resolve(LAYOUT.gutter, sizeClass);
  return value ? { paddingHorizontal: value } : null;
}

// Vertical tier for height-sensitive layouts (splash logo, sheet max-heights) — orthogonal to the width size class.
export function getVerticalSizeTier(height) {
  if (height < 550) return "tiny";
  if (height < 600) return "verySmall";
  if (height < 700) return "small";
  return "normal";
}

// Single reactive source for layout decisions. Recomputes on rotation, fold and split-screen resize.
export function useResponsive() {
  const { width, height } = useWindowDimensions();
  return useMemo(() => {
    const sizeClass = getSizeClass(width);
    return {
      width,
      height,
      sizeClass,
      isCompact: sizeClass === "compact",
      isLandscape: width > height,
      verticalTier: getVerticalSizeTier(height),
      columns: resolve(LAYOUT.columns, sizeClass),
      gutter: resolve(LAYOUT.gutter, sizeClass),
      contentStyle: contentWidthStyle(sizeClass),
      gutterStyle: gutterStyle(sizeClass),
      select: (map) => resolve(map, sizeClass),
    };
  }, [width, height]);
}

// Deprecated shim for react-native-responsive-screen. Below 600dp this is that library's exact formula, so the migration is provably inert on phones; above it the reference width clamps and percentage widths stop stretching. Use useResponsive() in new code.
export function wp(percent) {
  const value = typeof percent === "number" ? percent : parseFloat(percent);
  const { width } = Dimensions.get("window");
  const reference = width >= BREAKPOINTS.medium ? Math.min(width, LAYOUT.maxContentWidth) : width;
  return PixelRatio.roundToNearestPixel((reference * value) / 100);
}

export function hp(percent) {
  const value = typeof percent === "number" ? percent : parseFloat(percent);
  const { height } = Dimensions.get("window");
  return PixelRatio.roundToNearestPixel((height * value) / 100);
}
