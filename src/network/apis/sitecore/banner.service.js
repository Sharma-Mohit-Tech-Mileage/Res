import axios from "axios";
import Config from "react-native-config";

const text = (value) => (typeof value === "string" ? value.trim() : "");
const object = (value) => {
  if (typeof value === "string") {
    try {
      value = JSON.parse(value);
    } catch (_) {
      return {};
    }
  }
  return value && typeof value === "object" && !Array.isArray(value)
    ? value
    : {};
};
const url = (value) =>
  /^https?:\/\/[^\s/]+(?:[/?#][^\s]*)?$/i.test(text(value))
    ? text(value)
    : null;
const image = (value) => url(object(value).src);

export const mapBanner = (value) => {
  const data = object(value);
  if (data.active !== true) {
    return null;
  }
  const link = object(data.ctaLink);
  const banner = {
    eyebrow: text(data.eyebrow),
    headline: text(data.headline),
    ctaLabel: text(data.ctaLabel),
    ctaUrl: url(link.href) || url(link.url),
    disclaimer: text(data.disclaimer),
    phoneImage: image(data.backgroundImagePhone),
    tabletImage: image(data.tabletViewImage),
    alignment: ["left", "center", "right"].includes(
      text(data.textAlignment).toLowerCase()
    )
      ? text(data.textAlignment).toLowerCase()
      : "left",
    lightText: text(data.textTheme).toLowerCase() === "light",
  };
  return banner.headline ||
    banner.eyebrow ||
    banner.phoneImage ||
    banner.tabletImage ||
    (banner.ctaLabel && banner.ctaUrl)
    ? banner
    : null;
};

// Use the selected build environment; CMS failures must not trigger auth redirects.
export async function getBanner() {
  const base = Config.API_ACP_BASEURL;
  if (!base) {
    return null;
  }
  const response = await axios.get(
    `${base.replace(/\/+$/, "")}/api/Sitecore/Banner`,
    {
      timeout: 15000,
      headers: {
        Accept: "application/json",
        CallingApp: "MobileApp",
        "Cache-Control": "no-cache",
      },
    }
  );
  return mapBanner(response.data);
}
