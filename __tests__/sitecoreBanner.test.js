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
import { Color } from "../GlobalStyles";

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
    expect.objectContaining({ timeout: 15000 })
  );
});

test("maps null, malformed and inactive responses safely", () => {
  [null, {}, { active: false }, { active: true }].forEach((value) =>
    expect(mapBanner(value)).toBeNull()
  );
  expect(
    mapBanner({ ...payload, ctaLink: "{bad", backgroundImagePhone: null })
  ).toMatchObject({ ctaUrl: null, phoneImage: null });
  expect(
    mapBanner({ ...payload, ctaLink: { href: "javascript:alert(1)" } }).ctaUrl
  ).toBeNull();
});

test.each(["Light", "Dark"])(
  "renders CMS text and %s theme",
  async (textTheme) => {
    axios.get.mockResolvedValue({ data: { ...payload, textTheme } });
    await render();
    expect(findText(payload.eyebrow)).toBeDefined();
    expect(findText(payload.disclaimer)).toBeDefined();
    expect(
      RN.StyleSheet.flatten(findText(payload.headline).props.style).color
    ).toBe(textTheme === "Light" ? "#FFFFFF" : Color.colorMidnightblue);
    expect(
      RN.StyleSheet.flatten(tree.root.findByType("Touchable").props.style)
        .backgroundColor
    ).toBe(textTheme === "Light" ? "#FFFFFF" : Color.sparklightPrimaryPurple);
    expect(tree.root.findByType(RN.ImageBackground).props.source.uri).toBe(
      "https://media.example.test/phone.png"
    );
  }
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
      .alignItems
  ).toBe(alignment);
});

test("selects tablet media, navigates CTA and refreshes edited content", async () => {
  RN.useWindowDimensions.mockReturnValue({ width: 820, height: 1180 });
  jest.spyOn(RN.Linking, "openURL").mockResolvedValue(undefined);
  await render();
  expect(tree.root.findByType(RN.ImageBackground).props.source.uri).toBe(
    "https://media.example.test/tablet.png"
  );
  await act(async () => tree.root.findByType("Touchable").props.onPress());
  expect(RN.Linking.openURL).toHaveBeenCalledWith(
    "https://mobile.example.test/"
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
  expect(RN.StyleSheet.flatten(background.props.style).alignItems).toBe(
    "flex-end"
  );
  const content = tree.root.findByProps({ testID: "sitecore-banner-content" });
  expect(
    RN.StyleSheet.flatten(content.props.style).backgroundColor
  ).toBeUndefined();
  expect(
    RN.StyleSheet.flatten(findText(payload.headline).props.style).color
  ).toBe(Color.colorMidnightblue);
});
