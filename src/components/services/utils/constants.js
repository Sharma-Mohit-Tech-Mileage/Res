export const PHONE_PORTAL_URLS = {
  sparklight: "https://phone.sparklight.com/",
  hargray: "https://vmail.hargray.com/",
  valunet: "https://cp.valu-net.net/commportal/login.html",
  cableamerica: null,
  fidelity: null,
  ahcontrol: null,
};

export const CHANNEL_LINEUP_BASE_URL =
  "https://www.sparklight.com/channel-lineup";

export const SUPPORT_PHONE_NUMBER = "877-692-2253";

export const HIDDEN_PHONE_BRANDS = [
  "cableamerica",
  "fidelity",
  "ahcontrol",
  null,
  undefined,
];

export const getPhonePortalURL = (legacyBrand) => {
  if (!legacyBrand || HIDDEN_PHONE_BRANDS.includes(legacyBrand.toLowerCase())) {
    return null;
  }
  return PHONE_PORTAL_URLS[legacyBrand.toLowerCase()] || null;
};

export const getChannelLineupURL = (zipCode) => {
  if (zipCode) {
    return `${CHANNEL_LINEUP_BASE_URL}?zipcode=${zipCode}`;
  }
  return CHANNEL_LINEUP_BASE_URL;
};

// Header gradient colors used across service screens
export const SERVICE_HEADER_GRADIENT = ["rgba(141, 59, 144, 1)", "rgba(53, 48, 145, 1)"];
