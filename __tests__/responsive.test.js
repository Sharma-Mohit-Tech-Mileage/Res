// [51768] Pins the compact size class to today's behaviour. If a token change would move phones, this fails in CI rather than in QA.
import { PixelRatio } from "react-native";
import {
  BREAKPOINTS,
  getSizeClass,
  getVerticalSizeTier,
  resolve,
  contentWidthStyle,
  gutterStyle,
  wp,
  hp,
} from "../src/utils/responsive";

const setWindow = (width, height) => {
  jest.spyOn(require("react-native").Dimensions, "get").mockReturnValue({ width, height, scale: 3, fontScale: 1 });
};

afterEach(() => jest.restoreAllMocks());

describe("getSizeClass", () => {
  it("treats every phone width as compact", () => {
    [320, 360, 375, 390, 393, 414, 430, 599].forEach((w) => expect(getSizeClass(w)).toBe("compact"));
  });

  it("maps tablet widths onto the Material 3 ladder", () => {
    expect(getSizeClass(600)).toBe("medium");
    expect(getSizeClass(820)).toBe("medium");
    expect(getSizeClass(839)).toBe("medium");
    expect(getSizeClass(840)).toBe("expanded");
    expect(getSizeClass(1180)).toBe("expanded");
    expect(getSizeClass(1199)).toBe("expanded");
    expect(getSizeClass(1200)).toBe("large");
    expect(getSizeClass(1376)).toBe("large");
  });

  it("falls back to compact for a missing or zero width", () => {
    expect(getSizeClass(0)).toBe("compact");
    expect(getSizeClass(undefined)).toBe("compact");
  });
});

describe("resolve", () => {
  it("cascades a sparse map down to the nearest smaller class", () => {
    const map = { compact: 1, expanded: 2 };
    expect(resolve(map, "compact")).toBe(1);
    expect(resolve(map, "medium")).toBe(1);
    expect(resolve(map, "expanded")).toBe(2);
    expect(resolve(map, "large")).toBe(2);
  });

  it("passes non-map values straight through", () => {
    expect(resolve(16, "expanded")).toBe(16);
  });
});

describe("no phone regression", () => {
  it("adds no width cap at compact", () => {
    expect(contentWidthStyle("compact")).toBeNull();
  });

  it("adds no gutter at compact", () => {
    expect(gutterStyle("compact")).toBeNull();
  });

  it("caps and centres from medium upward", () => {
    expect(contentWidthStyle("medium")).toEqual({ width: "100%", maxWidth: 640, alignSelf: "center" });
    expect(gutterStyle("medium")).toEqual({ paddingHorizontal: 24 });
    expect(gutterStyle("expanded")).toEqual({ paddingHorizontal: 32 });
  });
});

// The library captures the window once at import (index.js:5), so it cannot be re-pointed at a mocked width. Parity is asserted against its formula instead — PixelRatio.roundToNearestPixel(width * percent / 100), copied verbatim into wp().
describe("wp/hp parity with react-native-responsive-screen", () => {
  const libraryFormula = (size, percent) => PixelRatio.roundToNearestPixel((size * parseFloat(percent)) / 100);

  it("returns the library's value at every phone width", () => {
    [320, 360, 375, 390, 393, 414, 430, 599].forEach((width) => {
      setWindow(width, 800);
      [4, 7, 25, 55, 80, 92, 100].forEach((percent) => {
        expect(wp(percent)).toBe(libraryFormula(width, percent));
      });
    });
  });

  it("accepts a percentage string exactly as the library does", () => {
    setWindow(393, 852);
    expect(wp("55%")).toBe(libraryFormula(393, 55));
    expect(wp("55%")).toBe(wp(55));
  });

  it("still uses the real window width just below the medium breakpoint", () => {
    setWindow(599, 800);
    expect(wp(100)).toBe(libraryFormula(599, 100));
  });

  it("clamps the reference width once the window reaches medium", () => {
    setWindow(1180, 820);
    expect(wp(100)).toBe(PixelRatio.roundToNearestPixel(640));
    expect(wp(100)).toBeLessThan(1180);
  });

  it("leaves hp driven by real window height at every size", () => {
    setWindow(1180, 820);
    expect(hp(50)).toBe(PixelRatio.roundToNearestPixel(410));
  });
});

describe("getVerticalSizeTier", () => {
  it("buckets by window height", () => {
    expect(getVerticalSizeTier(540)).toBe("tiny");
    expect(getVerticalSizeTier(580)).toBe("verySmall");
    expect(getVerticalSizeTier(660)).toBe("small");
    expect(getVerticalSizeTier(852)).toBe("normal");
  });
});

describe("breakpoints", () => {
  it("matches the sw600/sw840/sw1200 values named in the story", () => {
    expect(BREAKPOINTS).toEqual({ medium: 600, expanded: 840, large: 1200 });
  });
});
