import { Platform } from "react-native";
import moment from "moment";
import { digitsToWords } from "../../../utils/a11y";

export const contentMaxWidth = { width: "100%", maxWidth: 640, alignSelf: "center" };

export const radioA11yProps = (label, checked) => ({
  accessibilityRole: "radio",
  accessibilityState: { checked: !!checked },
  accessibilityLabel: Platform.OS === "ios" ? `${label}, radio button` : label,
  accessibilityHint: Platform.OS === "ios" && !checked ? "Double tap to select." : undefined,
});

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

export const SURCHARGE_TITLE = "3% Credit Card Surcharge";

export const SURCHARGE_MESSAGE =
  "A 3% surcharge applies to all credit card payments. Payments made by debit card, directly from a checking or savings account, or by check are not subject to this surcharge.";

export const isCreditCard = (method) => method?.type === "card" && method?.cardType === "credit";

export const paymentMethodTitle = (method) => {
  if (!method) return "Payment method";
  return method.nickname || (method.type === "card" ? "Debit Card" : "Checking Account");
};

export const maskedDigits = (method) =>
  method?.type === "card" ? `**** **** **** ${method?.lastFour || ""}` : `**** **** ${method?.lastFour || ""}`;

const methodDisplayName = (method) => {
  const kind = method.type === "card" ? "card" : "account";
  const brand = method.nickname || method.brand || (method.type === "card" ? "Card" : "Bank account");
  return brand.toLowerCase().endsWith(kind) ? brand : `${brand} ${kind}`;
};

export const describePaymentMethod = (method) => {
  if (!method) return "No payment method on file";
  return method.lastFour ? `${methodDisplayName(method)} ending in ${method.lastFour}` : methodDisplayName(method);
};

export const paymentMethodA11yLabel = (method) => {
  if (!method) return "No payment method on file";
  return method.lastFour
    ? `${methodDisplayName(method)} ending in ${digitsToWords(method.lastFour)}`
    : methodDisplayName(method);
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

export const openOrbipayEdit = (navigation, method, { returnTo, headerTitle } = {}) =>
  navigation.navigate("OrbipayWidget", {
    mode: "edit",
    fundingAccountId: method?.id || "",
    idCustomer: method?.idCustomer || "",
    paymentOption: method?.type === "card" ? "card" : "bank",
    paymentOptionReadOnly: "true",
    returnTo,
    headerTitle,
  });

export const openOrbipaySecureCapture = (navigation, { returnTo, headerTitle } = {}) =>
  navigation.navigate("OrbipayWidget", { mode: "add", returnTo, headerTitle });

export const openOrbipayPaymentExecution = (navigation, { amount, headerTitle, email }) =>
  navigation.navigate("OrbipayWidget", { mode: "pay", amount, headerTitle, email });
