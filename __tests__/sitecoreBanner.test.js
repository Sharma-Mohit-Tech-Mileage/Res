import React from "react";
import renderer, { act } from "react-test-renderer";
const RN = require("react-native");
import axios from "axios";
import Config from "react-native-config";
import {
  mapBanner,
  getBanner,
} from "../src/network/apis/sitecore/banner.service";
import SitecoreBanner from "../src/components/ACPDashboard/SitecoreBanner";
import { Color } from "../src/styles/GlobalStyles";

jest.mock("axios", () => ({ get: jest.fn() }));
jest.mock("react-native-config", () => ({ API_ACP_BASEURL: "" }));
jest.mock("@react-navigation/native", () => ({
  useFocusEffect: (callback) =>
    require("react").useEffect(callback, [callback]),
}));
jest.mock("../src/components/common/customui/Touchable", () => "Touchable");
const payload = {
  active: true,
  eyebrow: "CMS eyebrow",
  headline: "CMS headline",
  ctaLabel: "CMS CTA",
  ctaLink: JSON.stringify({ href: "https://mobile.example.test/" }),
  disclaimer: "CMS terms",
  backgroundImagePhone: JSON.stringify({
    src: "https://media.example.test/phone.png",
  }),
  tabletViewImage: JSON.stringify({
    src: "https://media.example.test/tablet.png",
  }),
  textTheme: "Light",
  textAlignment: "Left",
};
let onState;
let tree;
beforeEach(() => {
  jest
    .spyOn(RN, "useWindowDimensions")
    .mockReturnValue({ width: 393, height: 852, fontScale: 1, scale: 3 });
  jest
    .spyOn(RN.AppState, "addEventListener")
    .mockImplementation((_, callback) => {
      onState = callback;
      return { remove: jest.fn() };
    });
  Config.API_ACP_BASEURL = "https://customer.uat.cableone.net/apiWrapper/";
  axios.get.mockResolvedValue({ data: payload });
});
afterEach(() => {
  if (tree) {
    act(() => tree.unmount());
    tree = null;
  }
  jest.restoreAllMocks();
  jest.clearAllMocks();
});
const render = async () => {
  await act(async () => {
    tree = renderer.create(<SitecoreBanner />);
  });
};
const findText = (content) =>
  tree.root
    .findAllByType(RN.Text)
    .find((node) => node.props.children === content);

test.each([
  ["development", "https://customer.uat.cableone.net/apiWrapper/"],
  ["staging", "https://customer.uat.sparklight.com/apiWrapper/"],
  ["production", "https://publicservices.sparklight.com/Portalservices/"],
])("uses configured %s base URL", async (_, base) => {
  Config.API_ACP_BASEURL = base;
  expect(await getBanner()).toMatchObject({ headline: payload.headline });
  expect(axios.get).toHaveBeenCalledWith(
    `${base}api/Sitecore/Banner`,
    expect.objectContaining({ timeout: 15000 }),
  );
});

test("maps null, malformed and inactive responses safely", () => {
  [null, {}, { active: false }, { active: true }].forEach((value) =>
    expect(mapBanner(value)).toBeNull(),
  );
  expect(
    mapBanner({ ...payload, ctaLink: "{bad", backgroundImagePhone: null }),
  ).toMatchObject({ ctaUrl: null, phoneImage: null });
  expect(
    mapBanner({ ...payload, ctaLink: { href: "javascript:alert(1)" } }).ctaUrl,
  ).toBeNull();
});

test.each([
  ["Light", "Right", "#79246C"],
  ["Dark", "Left", "#FFFFFF"],
  ["Light", "Left", "#79246C"],
  ["Dark", "Right", "#FFFFFF"],
])(
  "renders CMS %s theme with %s alignment",
  async (textTheme, textAlignment, color) => {
    axios.get.mockResolvedValue({ data: { ...payload, textTheme, textAlignment } });
    await render();
    expect(findText(payload.eyebrow)).toBeDefined();
    expect(findText(payload.disclaimer)).toBeDefined();
    expect(
      RN.StyleSheet.flatten(findText(payload.headline).props.style).color,
    ).toBe(color);
    expect(
      RN.StyleSheet.flatten(findText(payload.eyebrow).props.style).color,
    ).toBe(color);
    expect(
      RN.StyleSheet.flatten(tree.root.findByType("Touchable").props.style)
        .backgroundColor,
    ).toBe(textTheme === "Dark" ? "#FFFFFF" : Color.sparklightPrimaryPurple);
    expect(tree.root.findByType(RN.ImageBackground).props.source.uri).toBe(
      "https://media.example.test/phone.png",
    );
  },
);

test.each([
  ["Left", "flex-start"],
  ["Center", "center"],
  ["Right", "flex-end"],
])("positions %s content", async (textAlignment, alignment) => {
  axios.get.mockResolvedValue({ data: { ...payload, textAlignment } });
  await render();
  expect(
    RN.StyleSheet.flatten(tree.root.findByType(RN.ImageBackground).props.style)
      .alignItems,
  ).toBe(alignment);
});

test("selects tablet media, navigates CTA and refreshes edited content", async () => {
  RN.useWindowDimensions.mockReturnValue({ width: 820, height: 1180 });
  jest.spyOn(RN.Linking, "openURL").mockResolvedValue(undefined);
  await render();
  expect(tree.root.findByType(RN.ImageBackground).props.source.uri).toBe(
    "https://media.example.test/tablet.png",
  );
  await act(async () => tree.root.findByType("Touchable").props.onPress());
  expect(RN.Linking.openURL).toHaveBeenCalledWith(
    "https://mobile.example.test/",
  );
  axios.get.mockResolvedValue({
    data: { ...payload, headline: "Published update" },
  });
  await act(async () => onState("active"));
  expect(findText("Published update")).toBeDefined();
});

test("handles failed image, failed CTA and API failure", async () => {
  jest.spyOn(RN.Linking, "openURL").mockRejectedValue(new Error("No handler"));
  await render();
  act(() => tree.root.findByType(RN.ImageBackground).props.onError());
  expect(tree.root.findByType(RN.ImageBackground).props.source).toBeUndefined();
  await act(async () => tree.root.findByType("Touchable").props.onPress());
  expect(findText("Unable to open this link. Please try again.")).toBeDefined();
  axios.get.mockRejectedValue(new Error("Offline"));
  await act(async () => onState("active"));
  expect(tree.toJSON()).toBeNull();
});

test("missing optional fields omit CTA and disclaimer", async () => {
  axios.get.mockResolvedValue({
    data: { active: true, headline: "Only headline" },
  });
  await render();
  expect(tree.root.findAllByType("Touchable")).toHaveLength(0);
  expect(tree.root.findAllByType(RN.Text)).toHaveLength(1);
});

test("fills the banner without letterboxing or a panel over the artwork", async () => {
  axios.get.mockResolvedValue({
    data: { ...payload, textAlignment: "Right", textTheme: "Dark" },
  });
  await render();
  const background = tree.root.findByType(RN.ImageBackground);
  expect(background.props.resizeMode).toBe("cover");
  expect(RN.StyleSheet.flatten(background.props.imageStyle).transform).toEqual([
    { scale: 1.4 },
    { translateY: 12 },
    { translateX: 18 },
  ]);
  expect(RN.StyleSheet.flatten(background.props.style).alignItems).toBe(
    "flex-end",
  );
  const content = tree.root.findByProps({ testID: "sitecore-banner-content" });
  expect(
    RN.StyleSheet.flatten(content.props.style).backgroundColor,
  ).toBeUndefined();
  expect(
    RN.StyleSheet.flatten(findText(payload.headline).props.style).color,
  ).toBe("#FFFFFF");
});

test("right-side composition aligns the column, purple copy and CTA to the right", async () => {
  axios.get.mockResolvedValue({
    data: { ...payload, textAlignment: "Right", textTheme: "Light" },
  });
  await render();
  expect(
    RN.StyleSheet.flatten(tree.root.findByType(RN.ImageBackground).props.style)
      .alignItems,
  ).toBe("flex-end");
  const content = tree.root.findByProps({ testID: "sitecore-banner-content" });
  expect(RN.StyleSheet.flatten(content.props.style).alignItems).toBe(
    "flex-end",
  );
  expect(
    RN.StyleSheet.flatten(findText(payload.headline).props.style),
  ).toMatchObject({ textAlign: "right", color: "#79246C" });
  expect(
    RN.StyleSheet.flatten(tree.root.findByType("Touchable").props.style)
      .backgroundColor,
  ).toBe(Color.sparklightPrimaryPurple);
});

test("gradient presentation places white copy on the left and the device on the right", async () => {
  axios.get.mockResolvedValue({
    data: { ...payload, textAlignment: "Right", textTheme: "Light" },
  });
  await act(async () => {
    tree = renderer.create(<SitecoreBanner presentation="phone-right-gradient" />);
  });
  expect(
    RN.StyleSheet.flatten(tree.root.findByType(RN.ImageBackground).props.style)
      .alignItems,
  ).toBe("flex-start");
  expect(
    RN.StyleSheet.flatten(findText(payload.headline).props.style),
  ).toMatchObject({ color: "#FFFFFF", textAlign: "left" });
  expect(
    RN.StyleSheet.flatten(findText(payload.eyebrow).props.style).color,
  ).toBe("#FFFFFF");
  expect(
    RN.StyleSheet.flatten(tree.root.findByType("Touchable").props.style)
      .backgroundColor,
  ).toBe("#FFFFFF");
  const artwork = tree.root.findByType(RN.ImageBackground);
  expect(artwork.props.resizeMode).toBe("cover");
  expect(RN.StyleSheet.flatten(artwork.props.style).minHeight).toBeCloseTo(393 * 660 / 1086);
  expect(
    RN.StyleSheet.flatten(artwork.props.imageStyle).transform,
  ).toBeUndefined();
  expect(RN.StyleSheet.flatten(artwork.props.style).backgroundColor).toBe(
    "#79246C",
  );
  const contentStyle = RN.StyleSheet.flatten(tree.root.findByProps({ testID: "sitecore-banner-content" }).props.style);
  expect(contentStyle.alignSelf).toBe("flex-start");
  expect(contentStyle.alignItems).toBe("flex-start");
  expect(contentStyle.position).toBeUndefined();
  expect(contentStyle.left).toBeUndefined();
  expect(contentStyle.width).toBe("58%");
  expect(RN.StyleSheet.flatten(findText(payload.headline).props.style).fontSize).toBe(20);
  expect(RN.StyleSheet.flatten(findText(payload.eyebrow).props.style).fontSize).toBe(16);
  expect(RN.StyleSheet.flatten(findText(payload.ctaLabel).props.style).fontSize).toBe(18);
  expect(findText(payload.ctaLabel)).toBeDefined();
  const device = tree.root.findByProps({ testID: "sitecore-banner-device" });
  expect(device.props.source).toEqual(require("../assets/reach-mobile-phone-right.png"));
  expect(RN.StyleSheet.flatten(device.props.style)).toMatchObject({ right: "2%", width: "38%" });
  expect(artwork.props.source).toEqual(require("../assets/reach-mobile-background.png"));
});

test("approved white presentation uses the tablet artwork proportions", async () => {
  RN.useWindowDimensions.mockReturnValue({
    width: 820,
    height: 1180,
    fontScale: 1,
    scale: 2,
  });
  await act(async () => {
    tree = renderer.create(<SitecoreBanner presentation="phone-right-gradient" />);
  });
  const artwork = tree.root.findByType(RN.ImageBackground);
  expect(artwork.props.resizeMode).toBe("cover");
  expect(RN.StyleSheet.flatten(artwork.props.style).minHeight).toBeCloseTo(
    820 * 900 / 2000,
  );
  expect(
    RN.StyleSheet.flatten(artwork.props.imageStyle).transform,
  ).toBeUndefined();
});

 test("tablet Dark artwork honors CMS left placement and white reference copy and CTA", async () => {
  RN.useWindowDimensions.mockReturnValue({ width: 820, height: 1180 });
  axios.get.mockResolvedValue({ data: { ...payload, textAlignment: "Left", textTheme: "Dark" } });
  await act(async () => {
    tree = renderer.create(<SitecoreBanner presentation="phone-right-gradient" />);
  });
  const artwork = tree.root.findByType(RN.ImageBackground);
  expect(artwork.props.source).toEqual(require("../assets/reach-mobile-background.png"));
  expect(RN.StyleSheet.flatten(artwork.props.style).alignItems).toBe("flex-start");
  expect(RN.StyleSheet.flatten(artwork.props.imageStyle).transform).toBeUndefined();
  expect(RN.StyleSheet.flatten(findText(payload.headline).props.style)).toMatchObject({ color: "#FFFFFF", textAlign: "left" });
  expect(RN.StyleSheet.flatten(findText(payload.eyebrow).props.style).color).toBe("#FFFFFF");
  expect(RN.StyleSheet.flatten(tree.root.findByType("Touchable").props.style).backgroundColor).toBe("#FFFFFF");
  expect(RN.StyleSheet.flatten(findText(payload.ctaLabel).props.style).color).toBe(Color.sparklightPrimaryPurple);
  const content = RN.StyleSheet.flatten(tree.root.findByProps({ testID: "sitecore-banner-content" }).props.style);
  expect(content.width).toBe("58%");
  expect(content.paddingLeft).toBe(16);
});

 test.each([
  [393, 16, 20, 18],
  [767, 16, 20, 18],
  [768, 18, 28, 20],
  [1024, 18, 28, 20],
])("uses device typography at width %s", async (width, eyebrowSize, headlineSize, ctaSize) => {
  RN.useWindowDimensions.mockReturnValue({ width, height: 1180 });
  await render();
  expect(RN.StyleSheet.flatten(tree.root.findByType("Touchable").props.style)).toMatchObject({ minHeight: 48, paddingVertical: 8 });
  expect(RN.StyleSheet.flatten(tree.root.findByType("Touchable").props.style).width).toBeUndefined();
  expect(RN.StyleSheet.flatten(findText(payload.eyebrow).props.style)).toMatchObject({ fontSize: eyebrowSize, fontWeight: "600", fontFamily: "RadioCanada-SemiBold" });
  expect(RN.StyleSheet.flatten(findText(payload.headline).props.style)).toMatchObject({ fontSize: headlineSize, fontWeight: "700", fontFamily: "RadioCanada-Bold" });
  expect(RN.StyleSheet.flatten(findText(payload.ctaLabel).props.style)).toMatchObject({ fontSize: ctaSize, fontWeight: "600", fontFamily: "RadioCanada-SemiBold" });
});
