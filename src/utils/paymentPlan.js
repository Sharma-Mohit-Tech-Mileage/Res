import { getUser } from "../redux/utils/LocalStorage";
import { PostApiRequest } from "../network/RestApiClient";
import { getEndpoint, ENDPOINTS } from "../network/apis/endpoints/Endpoints";

export const getPaymentPlanInfo = (accountDetails) => ({
  isEnrolled: accountDetails?.has_payment_plan === true,
});

// utm_source/utm_medium are our proposed app values; the portal sends selfcare_portal/web.
export const fetchPaymentPlanLink = async (onSuccess, onError) => {
  try {
    const user = await getUser();
    const body = {
      sub: user?.userInfo?.accountNumber,
      lang: "en",
      utm_source: "sparklight_app",
      utm_medium: "mobile_app",
    };
    PostApiRequest(
      getEndpoint(ENDPOINTS.PAYMENT_FLEXIBLE_PLAN),
      body,
      (res) => (res?.url ? onSuccess(res.url) : onError(new Error("No payment plan link"))),
      onError
    );
  } catch (error) {
    onError(error);
  }
};

// Amount the payment plan microsite hands to Quick Pay (?amount=), or null when missing or outside the payment limits.
export const quickPayAmount = (url) => {
  const match = String(url || "").match(/[?&]amount=([^&#]*)/i);
  if (!match) return null;
  let raw;
  try {
    raw = decodeURIComponent(match[1].replace(/\+/g, " "));
  } catch (e) {
    return null;
  }
  const cleaned = raw.replace(/[$,\s]/g, "");
  if (!/^\d+(\.\d{1,2})?$/.test(cleaned)) return null;
  const amount = Number(cleaned);
  return amount > 0 && amount <= 99999.99 ? amount : null;
};


const hostOf = (url) => {
  const match = /^https?:\/\/([^/?#]+)/i.exec(String(url || ""));
  return match ? match[1].toLowerCase() : "";
};

// True when a link leaves the site the page was opened on (e.g. the explainer's My Account going to the portal).
export const isOffSiteUrl = (url, pageUrl) => {
  const host = hostOf(url);
  return Boolean(host) && host !== hostOf(pageUrl);
};
