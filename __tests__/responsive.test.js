// [51768] Pins the compact size class to today's behaviour. If a token change would move phones, this fails in CI rather than in QA.
import React from "react";
import renderer from "react-test-renderer";
import { Image, PixelRatio, ScrollView, StyleSheet, Text, View } from "react-native";
import useWindowDimensions from "react-native/Libraries/Utilities/useWindowDimensions";
import { ScreenScroll, ScreenFrame } from "../src/components/common/customui/Screen";
import ModalCard from "../src/components/common/customui/ModalCard";
import {
  BREAKPOINTS,
  getSizeClass,
  getVerticalSizeTier,
  resolve,
  contentWidthStyle,
  gutterStyle,
  wp,
  hp,
  assetWidthCap,
} from "../src/utils/responsive";

jest.mock("react-native/Libraries/Utilities/useWindowDimensions", () => ({
  __esModule: true,
  default: jest.fn(() => ({ width: 393, height: 852, scale: 3, fontScale: 1 })),
}));

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

// The primitives are the things that actually render, so the no-regression promise is pinned here too — not just on the pure helpers above.
describe("layout primitives", () => {
  const setViewport = (width, height = 900) =>
    useWindowDimensions.mockReturnValue({ width, height, scale: 3, fontScale: 1 });
  const styleOf = (node) => StyleSheet.flatten(node.props.style) || {};
  const contentStyleOf = (node) => StyleSheet.flatten(node.props.contentContainerStyle) || {};
  const PHONE = 393;
  const TABLET = 1024;

  afterEach(() => useWindowDimensions.mockReset());


  // The adoption guarantee for waves 3+: at compact these must be indistinguishable from a bare View/ScrollView.
  describe("compact equivalence", () => {
    it("ScreenScroll adds nothing a bare ScrollView would not have", () => {
      setViewport(PHONE);
      const node = renderer.create(<ScreenScroll><Text>x</Text></ScreenScroll>).root.findByType(ScrollView);
      expect(styleOf(node)).toEqual({});
      expect(contentStyleOf(node)).toEqual({});
    });

    it("adds flex only when a caller opts in", () => {
      setViewport(PHONE);
      const node = renderer.create(<ScreenScroll fill><Text>x</Text></ScreenScroll>).root.findByType(ScrollView);
      expect(styleOf(node)).toEqual({ flex: 1 });
    });
  });

  describe("ScreenScroll", () => {
    // Screens hard-code 100/120/140/150 clearance today, so defaulting this on would silently repad phones.
    it("adds no bottom padding by default, at any size", () => {
      setViewport(PHONE);
      let node = renderer.create(<ScreenScroll><Text>x</Text></ScreenScroll>).root.findByType(ScrollView);
      expect(contentStyleOf(node).paddingBottom).toBeUndefined();

      setViewport(TABLET);
      node = renderer.create(<ScreenScroll><Text>x</Text></ScreenScroll>).root.findByType(ScrollView);
      expect(contentStyleOf(node).paddingBottom).toBeUndefined();
    });

    it("uses the token when opted in, and a caller's own value when given one", () => {
      setViewport(PHONE);
      const token = renderer.create(<ScreenScroll clearTabBar><Text>x</Text></ScreenScroll>).root.findByType(ScrollView);
      expect(contentStyleOf(token).paddingBottom).toBe(140);

      const kept = renderer.create(<ScreenScroll clearTabBar={100}><Text>x</Text></ScreenScroll>).root.findByType(ScrollView);
      expect(contentStyleOf(kept).paddingBottom).toBe(100);
    });

    it("framed applies the frame standard: side inset, top space and tab-bar clearance", () => {
      setViewport(PHONE);
      const scroll = renderer.create(<ScreenScroll framed><Text>x</Text></ScreenScroll>).root.findByType(ScrollView);
      expect(contentStyleOf(scroll).paddingBottom).toBe(140);
      const frame = scroll.findAll((n) => n.type === View && StyleSheet.flatten(n.props.style)?.paddingTop === 16)[0];
      expect(StyleSheet.flatten(frame.props.style)).toEqual(expect.objectContaining({ paddingHorizontal: 16, paddingTop: 16 }));
    });

    it("stack adds the app-wide gap between cards", () => {
      setViewport(PHONE);
      const scroll = renderer.create(<ScreenScroll framed stack><Text>x</Text></ScreenScroll>).root.findByType(ScrollView);
      const frame = scroll.findAll((n) => n.type === View && StyleSheet.flatten(n.props.style)?.gap !== undefined)[0];
      expect(StyleSheet.flatten(frame.props.style).gap).toBe(16);
    });

    it("ScreenFrame gives list screens the same frame and clearance on phone and tablet", () => {
      setViewport(PHONE);
      let inner = renderer.create(<ScreenFrame><Text>x</Text></ScreenFrame>).root.findAll((n) => n.type === View && StyleSheet.flatten(n.props.style)?.paddingTop === 16)[0];
      expect(StyleSheet.flatten(inner.props.style)).toEqual(expect.objectContaining({ paddingHorizontal: 16, paddingTop: 16, marginBottom: 140 }));
      expect(StyleSheet.flatten(inner.props.style).maxWidth).toBeUndefined();

      setViewport(TABLET);
      inner = renderer.create(<ScreenFrame><Text>x</Text></ScreenFrame>).root.findAll((n) => n.type === View && StyleSheet.flatten(n.props.style)?.paddingTop === 16)[0];
      expect(StyleSheet.flatten(inner.props.style)).toEqual(expect.objectContaining({ paddingHorizontal: 16, paddingTop: 16, marginBottom: 140 }));
      expect(StyleSheet.flatten(inner.props.style).maxWidth).toBeUndefined();
    });

    it("framed screens can opt out of the tab-bar clearance", () => {
      setViewport(PHONE);
      const scroll = renderer.create(<ScreenScroll framed clearTabBar={0}><Text>x</Text></ScreenScroll>).root.findByType(ScrollView);
      expect(contentStyleOf(scroll).paddingBottom).toBeUndefined();
    });
  });

  describe("ModalCard", () => {
    it("leaves a dialog full-width at compact", () => {
      setViewport(PHONE);
      const style = styleOf(renderer.create(<ModalCard><Text>x</Text></ModalCard>).root.findByType(View));
      expect(style).toEqual({ width: "100%" });
    });

    it("caps at the modal token from medium upward", () => {
      setViewport(768);
      const style = styleOf(renderer.create(<ModalCard><Text>x</Text></ModalCard>).root.findByType(View));
      expect(style).toMatchObject({ width: "100%", maxWidth: 480, alignSelf: "center" });
    });
  });

  // Every Wave-2 dialog passes its existing style through, so the array order is load-bearing: the caller's percentage width must win while the cap survives.
  describe("ModalCard style composition", () => {
    it("lets a caller's width win while keeping the cap", () => {
      setViewport(TABLET);
      const card = renderer
        .create(<ModalCard style={{ width: "85%" }}><Text>x</Text></ModalCard>)
        .root.findByType(View);
      expect(styleOf(card)).toMatchObject({ width: "85%", maxWidth: 480 });
    });

    it("lets a caller's tighter cap override the token", () => {
      setViewport(TABLET);
      const card = renderer
        .create(<ModalCard style={{ width: "90%", maxWidth: 400 }}><Text>x</Text></ModalCard>)
        .root.findByType(View);
      expect(styleOf(card).maxWidth).toBe(400);
    });

    it("applies neither on a phone", () => {
      setViewport(PHONE);
      const card = renderer
        .create(<ModalCard style={{ width: "85%" }}><Text>x</Text></ModalCard>)
        .root.findByType(View);
      expect(styleOf(card)).toEqual({ width: "85%" });
    });
  });

});

// The cap must come from the asset, not from a number typed into a screen's stylesheet.
describe("assetWidthCap", () => {
  afterEach(() => jest.restoreAllMocks());

  it("caps at the asset's own pixel width", () => {
    jest.spyOn(Image, "resolveAssetSource").mockReturnValue({ width: 326, height: 324 });
    expect(assetWidthCap(1)).toEqual({ width: "100%", maxWidth: 326, alignSelf: "center" });
  });

  it("reproduces the hand-written caps it replaces, so adoption moves nothing", () => {
    jest.spyOn(Image, "resolveAssetSource").mockReturnValue({ width: 354, height: 225 });
    expect(assetWidthCap(1).maxWidth).toBe(354);
  });

  it("falls back to full width when the asset cannot be resolved", () => {
    jest.spyOn(Image, "resolveAssetSource").mockReturnValue(null);
    expect(assetWidthCap(1)).toEqual({ width: "100%" });
  });
});
