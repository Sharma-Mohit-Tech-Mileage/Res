// [51768] Material 3 window size classes. Keyed off the WINDOW, never the device, so split-screen, foldables and Slide Over stay correct.
import { useMemo } from "react";
import { Dimensions, Image, PixelRatio, useWindowDimensions } from "react-native";
import theme from "../styles/theme";

// Compact covers phone widths, so compact is today's UI by construction.
export const BREAKPOINTS = { medium: 600, expanded: 840, large: 1200 };

const SIZE_CLASSES = ["compact", "medium", "expanded", "large"];

export const LAYOUT = theme.layout;

export function getSizeClass(width) {
  if (!(width > 0)) return "compact";
  if (width >= BREAKPOINTS.large) return "large";
  if (width >= BREAKPOINTS.expanded) return "expanded";
  if (width >= BREAKPOINTS.medium) return "medium";
  return "compact";
}

// Sparse maps cascade down the ladder: { compact, expanded } still answers for "medium".
export function resolve(map, sizeClass) {
  if (map === null || typeof map !== "object") return map;
  const start = SIZE_CLASSES.indexOf(sizeClass);
  for (let i = start === -1 ? 0 : start; i >= 0; i--) {
    const value = map[SIZE_CLASSES[i]];
    if (value !== undefined && value !== null) return value;
  }
  return undefined;
}

// Returns null at compact so phones render the same style object as today.
export function contentWidthStyle(sizeClass, maxWidth = LAYOUT.maxContentWidth) {
  if (sizeClass === "compact") return null;
  return { width: "100%", maxWidth, alignSelf: "center" };
}

export function gutterStyle(sizeClass) {
  const value = resolve(LAYOUT.gutter, sizeClass);
  return value ? { paddingHorizontal: value } : null;
}

// Height tier, orthogonal to the width size class.
export function getVerticalSizeTier(height) {
  if (height < 550) return "tiny";
  if (height < 600) return "verySmall";
  if (height < 700) return "small";
  return "normal";
}

// The one reactive source for layout decisions.
export function useResponsive() {
  const { width, height } = useWindowDimensions();
  return useMemo(() => {
    const sizeClass = getSizeClass(width);
    return {
      width,
      height,
      sizeClass,
      isCompact: sizeClass === "compact",
      gutterStyle: gutterStyle(sizeClass),
    };
  }, [width, height]);
}

// Deprecated shim: identical to react-native-responsive-screen below 600dp, clamped above it. Use useResponsive() in new code.
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

// Caps an image at its own pixel width so a 1x asset is never upscaled. Re-baseline the asset to render wider.
export function assetWidthCap(source) {
  const meta = Image.resolveAssetSource(source);
  return meta && meta.width
    ? { width: "100%", maxWidth: meta.width, alignSelf: "center" }
    : { width: "100%" };
}
