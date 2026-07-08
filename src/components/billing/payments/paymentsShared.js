import Config from "react-native-config";
import moment from "moment";
import { digitsToWords } from "../../../utils/a11y";

// Tablet-friendly content width: full-width on phones, centered column on wide screens
export const contentMaxWidth = { width: "100%", maxWidth: 640, alignSelf: "center" };

export const ordinal = (day) => {
  const n = Number(day);
  if (!isFinite(n)) return String(day || "");
  const mod10 = n % 10;
  const mod100 = n % 100;
  if (mod10 === 1 && mod100 !== 11) return `${n}st`;
  if (mod10 === 2 && mod100 !== 12) return `${n}nd`;
  if (mod10 === 3 && mod100 !== 13) return `${n}rd`;
  return `${n}th`;
};

export const paymentMethodTitle = (method) => {
  if (!method) return "Payment method";
  return method.nickname || (method.type === "card" ? "Debit Card" : "Checking Account");
};

export const maskedDigits = (method) =>
  method?.type === "card" ? `**** **** **** ${method?.lastFour || ""}` : `**** **** ${method?.lastFour || ""}`;

export const describePaymentMethod = (method) => {
  if (!method) return "No payment method on file";
  const kind = method.type === "card" ? "card" : "account";
  const brand = method.nickname || method.brand || (method.type === "card" ? "Card" : "Bank account");
  return method.lastFour ? `${brand} ${kind} ending in ${method.lastFour}` : brand;
};

export const paymentMethodA11yLabel = (method) => {
  if (!method) return "No payment method on file";
  const kind = method.type === "card" ? "card" : "account";
  const brand = method.nickname || method.brand || (method.type === "card" ? "Card" : "Bank account");
  return method.lastFour ? `${brand} ${kind} ending in ${digitsToWords(method.lastFour)}` : brand;
};

export const isMethodExpired = (method) => {
  if (!method?.expiry || method.type !== "card") return false;
  const parsed = moment(method.expiry, ["MM/YY", "MM/YYYY", "YYYY-MM", moment.ISO_8601], true);
  return parsed.isValid() ? parsed.endOf("month").isBefore(moment()) : false;
};

export const formatScheduledDate = (dueDate) => {
  if (!dueDate) return "";
  const parsed = moment(dueDate, ["YYYY-MM-DD", "MM/DD/YYYY", moment.ISO_8601]);
  return parsed.isValid() ? parsed.format("MMMM D, YYYY") : String(dueDate);
};

export const formatCurrency = (value) => {
  const amount = Number(value);
  if (!isFinite(amount)) return "$0.00";
  return `$${amount.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ",")}`;
};

export const parseAmountInput = (text) => {
  const cleaned = String(text || "").replace(/[^0-9.]/g, "");
  const amount = parseFloat(cleaned);
  if (!isFinite(amount) || amount <= 0 || amount > 99999.99) return null;
  return Math.round(amount * 100) / 100;
};

// Orbipay stays WebView-hosted for PCI capture only; every other screen in this flow is native
export const openOrbipaySecureCapture = (navigation, name = "Add Payment Method") => {
  navigation.navigate("ArticleWindowUtility", {
    url: `${Config.PORTAL_BASE_URL}/portals/app-secure/billing-payment`,
    name,
    injectPaymentObj: true,
  });
};

export const openOrbipayPaymentExecution = (navigation, { amount, paymentMethodId, onSuccessRoute }) => {
  const query = [
    amount ? `amount=${encodeURIComponent(amount)}` : null,
    paymentMethodId ? `paymentMethodId=${encodeURIComponent(paymentMethodId)}` : null,
  ]
    .filter(Boolean)
    .join("&");
  navigation.navigate("ArticleWindowUtility", {
    url: `${Config.PORTAL_BASE_URL}/portals/app-secure/make-payment${query ? `?${query}` : ""}`,
    name: "Make a Payment",
    injectPaymentObj: true,
    onSuccessRoute,
  });
};
