// Service-related constants

// Phone portal URLs based on legacy brand
export const PHONE_PORTAL_URLS = {
  sparklight: 'https://phone.sparklight.com/',
  hargray: 'https://vmail.hargray.com/',
  valunet: 'https://cp.valu-net.net/commportal/login.html',
  // These brands should hide the phone features link
  cableamerica: null,
  fidelity: null,
  ahcontrol: null,
};

// Channel lineup URL
export const CHANNEL_LINEUP_BASE_URL = 'https://www.sparklight.com/channel-lineup';

// Support contact number
export const SUPPORT_PHONE_NUMBER = '877-692-2253';

// Brands that should hide phone features link
export const HIDDEN_PHONE_BRANDS = ['cableamerica', 'fidelity', 'ahcontrol', null, undefined];

// Helper function to get phone portal URL
export const getPhonePortalURL = (legacyBrand) => {
  if (!legacyBrand || HIDDEN_PHONE_BRANDS.includes(legacyBrand.toLowerCase())) {
    return null;
  }
  return PHONE_PORTAL_URLS[legacyBrand.toLowerCase()] || null;
};

// Helper function to build channel lineup URL
export const getChannelLineupURL = (zipCode) => {
  if (zipCode) {
    return `${CHANNEL_LINEUP_BASE_URL}?zipcode=${zipCode}`;
  }
  return CHANNEL_LINEUP_BASE_URL;
};
