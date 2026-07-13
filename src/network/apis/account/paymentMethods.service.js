import moment from "moment";
import store from "../../../redux/configureStore";
import { getPrimaryEmail } from "../../../components/utility/constant";

// Demo data layer until the Orbipay payment-method APIs land (stories 52950/52952); shapes mirror the planned endpoints
export const isDemoPaymentData = true;

let demoMethods = [
  { id: "pm-1", type: "card", brand: "visa", nickname: "Debit Card", lastFour: "3897", expiry: "04/26", isDefault: true },
  { id: "pm-2", type: "bank", brand: "bank", nickname: "Checking Account", lastFour: "2905", expiry: "", isDefault: false },
];

let demoAutoPay = { enrolled: false, paymentMethodId: "" };
let demoSeq = 3;

const delay = (ms = 350) => new Promise((resolve) => setTimeout(resolve, ms));

const accountSnapshot = () => {
  const accountDetails = store.getState()?.profile?.accountDetails || {};
  const parsedDueDate = moment(accountDetails.payment_due_date);
  return {
    balanceDue: Number(accountDetails.current_balance) || 0,
    pastDueAmount: Number(accountDetails.past_due_amount) || 0,
    dueDay: parsedDueDate.isValid() ? parsedDueDate.date() : 22,
    email: getPrimaryEmail(accountDetails) || "",
  };
};

const confirmation = () => ({
  confirmationNumber: `${Date.now()}${Math.floor(Math.random() * 900) + 100}`,
});

export const fetchPaymentMethods = async () => {
  await delay();
  return demoMethods.map((method) => ({ ...method }));
};

export const fetchAutoPayDetails = async () => {
  await delay();
  return { ...demoAutoPay, ...accountSnapshot() };
};

export const addDemoPaymentMethod = async () => {
  await delay();
  const added = {
    id: `pm-${demoSeq++}`,
    type: "card",
    brand: "mastercard",
    nickname: "Debit Card",
    lastFour: `${Math.floor(Math.random() * 9000) + 1000}`,
    expiry: moment().add(3, "years").format("MM/YY"),
    isDefault: false,
  };
  demoMethods = [...demoMethods, added];
  return { ...added };
};

export const deletePaymentMethod = async (methodId) => {
  await delay();
  demoMethods = demoMethods.filter((method) => method.id !== methodId);
  if (demoAutoPay.paymentMethodId === methodId) demoAutoPay = { enrolled: false, paymentMethodId: "" };
  return { success: true };
};

export const setDefaultPaymentMethod = async (methodId) => {
  await delay();
  demoMethods = demoMethods.map((method) => ({ ...method, isDefault: method.id === methodId }));
  return { success: true };
};

export const submitDemoPayment = async () => {
  await delay(600);
  return confirmation();
};

export const enrollAutoPay = async (methodId) => {
  await delay(600);
  demoAutoPay = { enrolled: true, paymentMethodId: methodId };
  return confirmation();
};

export const updateAutoPayPaymentMethod = async (methodId) => {
  await delay(600);
  demoAutoPay = { enrolled: true, paymentMethodId: methodId };
  return confirmation();
};

export const cancelAutoPay = async () => {
  await delay(600);
  demoAutoPay = { enrolled: false, paymentMethodId: "" };
  return confirmation();
};
