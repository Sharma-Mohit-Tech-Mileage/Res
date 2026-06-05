const BASE = 'https://www.sparklight.com';
const SUPPORT = 'https://support.sparklight.com';

export const SPARKLIGHT_URLS = {
  // Legal
  privacyPolicy: `${BASE}/legal/mobile-app-privacy-policy`,
  termsConditions: `${BASE}/legal/mobile-app-terms-and-conditions`,
  paperlessTerms: `${BASE}/legal/paperless-terms-and-conditions`,
  textMessagingTerms: `${BASE}/legal/text-messaging-terms-and-conditions`,

  // Marketing / info
  contactUs: `${BASE}/contactus`,
  channelLineup: `${BASE}/channel-lineup`,
  locations: `${BASE}/locations`,
  activationFaqs: `${BASE}/Activation-faqs`,

  // Support / help
  supportHome: `${SUPPORT}/hc/en-us`,
  releaseNotes: `${SUPPORT}/hc/en-us/articles/30080605597079-MySparklight-App-Release-Notes`,
  customerSupport: `${SUPPORT}/hc/en-us/articles/26787209205911-SPARKLIGHT-CUSTOMER-SUPPORT`,
  gettingStarted: `${SUPPORT}/hc/en-us/articles/21493968056343-How-Do-I-Get-Started-with-the-MySparklight-Mobile-App`,
  internetHelp: `${SUPPORT}/hc/en-us/categories/115000833068-Internet`,
  billingHelp: `${SUPPORT}/hc/en-us/sections/22829302944279-Billing`,
  profileSettingsHelp: `${SUPPORT}/hc/en-us/sections/36871771193623-Profile-Settings`,
};

// withMobile(url) — append ?isMobile=true (or &isMobile=true if a query already exists) so the support site renders the mobile shell.
export const withMobile = (url) => url + (url.includes('?') ? '&' : '?') + 'isMobile=true';
