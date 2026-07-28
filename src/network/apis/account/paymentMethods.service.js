import moment from "moment";
import store from "../../../redux/configureStore";
import { _axios } from "../../RestApiClient";
import { getUser } from "../../../redux/utils/LocalStorage";
import { getEndpoint, ENDPOINTS } from "../endpoints/Endpoints";
import { getPrimaryEmail } from "../../../components/utility/constant";

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

const authContext = async () => {
  const user = await getUser();
  return {
    accountNumber: user?.userInfo?.accountNumber || "",
    config: { headers: { Authorization: `Bearer ${user?.token}` } },
  };
};

// Maps an Orbipay funding account (RetrieveFundingAccounts shape) onto the app's method model
const normalizePaymentMethod = (raw = {}) => {
  const accountType = (raw.account_type || raw.accountType || "").toLowerCase();
  const subtype = (raw.account_subtype || raw.accountSubType || "").toLowerCase();
  const isCard = accountType.includes("card") || subtype.includes("credit") || subtype.includes("debit");
  const masked = String(raw.display_text || raw.displayText || "");
  const customerMatch = String(raw.url || "").match(/customers\/(\d+)/);
  const fallbackName = isCard
    ? subtype.includes("credit") ? "Credit Card" : "Debit Card"
    : subtype === "savings" ? "Savings Account" : "Checking Account";
  return {
    id: String(raw.id || raw.fundingAccountId || raw.funding_account_id || ""),
    idCustomer: customerMatch ? customerMatch[1] : "",
    type: isCard ? "card" : "bank",
    brand: (subtype.split("_")[0] || (isCard ? "card" : "bank")).toLowerCase(),
    nickname: raw.nickname || raw.account_holder_name || fallbackName,
    lastFour: masked.replace(/[^0-9]/g, "").slice(-4),
    expiry: raw.expiry_date || raw.expiryDate || "",
    isDefault: false,
    status: (raw.status || "active").toLowerCase(),
  };
};

export const fetchPaymentMethods = async () => {
  const { accountNumber, config } = await authContext();
  const res = await _axios.get(getEndpoint(ENDPOINTS.FUNDING_ACCOUNTS, { accountNumber }), config);
  const list = Array.isArray(res.data) ? res.data : res.data?.fundingAccounts || [];
  return list.map(normalizePaymentMethod).filter((m) => m.id && m.status === "active");
};

export const fetchAutoPayDetails = async () => {
  const { accountNumber, config } = await authContext();
  // easyPayId is the enrolled funding account id
  const res = await _axios.get(getEndpoint(ENDPOINTS.ACCOUNTS_EASYPAY, { accountNumber }), config);
  return {
    enrolled: !!res.data?.isEasyPay,
    paymentMethodId: String(res.data?.easyPayId || ""),
    ...accountSnapshot(),
  };
};

export const deletePaymentMethod = async (methodId) => {
  const { accountNumber, config } = await authContext();
  const res = await _axios.post(
    getEndpoint(ENDPOINTS.FUNDING_ACCOUNT_DELETE),
    { accountNumber, fundingAccountId: methodId },
    config
  );
  return res.data;
};

// Saved-method one-time payment: DIRECT (no widget/token), keyed by fundingAccountNumber = last four
export const submitPayment = async (amount, method) => {
  const { accountNumber, config } = await authContext();
  const { email } = accountSnapshot();
  const res = await _axios.post(
    getEndpoint(ENDPOINTS.PAYMENT_MAKE_ONETIME),
    {
      accountNumber,
      fundingAccountNumber: method?.lastFour || "",
      amount: String(amount),
      paymentDate: moment().format("YYYY-MM-DD"),
      paymentRequestDate: "",
      paymentAmountType: "",
      fee: null,
      email,
      comment: "",
      customFields: {},
    },
    config
  );
  return { confirmationNumber: String(res.data?.confirmationNumber || res.data?.confirmation_number || "") };
};

// Payload captured from the portal's change-autopay flow (2026-07-15)
const setupAutoPayPayload = (accountNumber, method) => ({
  accountNumber,
  fundingAccountNumber: method?.lastFour || "",
  fundingAccountId: method?.id || method,
  amount: "",
  startDate: moment().format("YYYY-MM-DD"),
  paymentRecurringType: "monthly",
  paymentAmountType: "current_balance",
  payment_setup_schedule_type: "autopay_enrollment",
  paymentDeferDays: "",
  fee: "",
  comment: "Setup EasyPay",
  customFields: {},
});

export const enrollAutoPay = async (methodId) => {
  const { accountNumber, config } = await authContext();
  const method = typeof methodId === "object" ? methodId : (await fetchPaymentMethods()).find((m) => m.id === methodId);
  const res = await _axios.post(getEndpoint(ENDPOINTS.EASYPAY_SETUP), setupAutoPayPayload(accountNumber, method || methodId), config);
  return { confirmationNumber: String(res.data?.confirmationNumber || res.data?.confirmation_number || "") };
};

// The portal has no update wrapper: changing the AutoPay method = deactivate, then enroll again
export const updateAutoPayPaymentMethod = async (methodId) => {
  const { accountNumber, config } = await authContext();
  await _axios.post(getEndpoint(ENDPOINTS.EASYPAY_DELETE, { accountNumber }), {}, config);
  return enrollAutoPay(methodId);
};

// Widget checkout-event -> AddFundingAccount consumes the single-use token directly
export const confirmBankToken = async (token, digiSign) => {
  const { accountNumber, config } = await authContext();
  const res = await _axios.post(
    getEndpoint(ENDPOINTS.FUNDING_ACCOUNT_ADD),
    { token, digiSign, customer_account_reference: accountNumber, accountNumber },
    config
  );
  return normalizePaymentMethod(res.data?.fundingAccount || res.data || {});
};

// Widget create_payment checkout-event -> Payment/Submit (token+digiSign ride the payload)
export const confirmPaymentToken = async (token, digiSign, amount) => {
  const { accountNumber, config } = await authContext();
  const { email } = accountSnapshot();
  const res = await _axios.post(
    getEndpoint(ENDPOINTS.PAYMENT_ONE_TIME),
    {
      token,
      digiSign,
      accountNumber,
      isAutoPay: false,
      amount: Number(amount).toFixed(2),
      webId: "0",
      email,
      paymentRequestDate: moment().format("YYYY-MM-DD"),
    },
    config
  );
  return { confirmationNumber: String(res.data?.confirmationNumber || res.data?.confirmation_number || "") };
};

// Widget update_funding_account mode -> UpdFundingAccount (PUT), keyed by id_account
export const updateFundingAccount = async (methodId, { token, digiSign } = {}) => {
  const { accountNumber, config } = await authContext();
  const res = await _axios.put(
    getEndpoint(ENDPOINTS.FUNDING_ACCOUNT_UPDATE),
    { token, digiSign, id_account: methodId, customer_account_reference: null, accountNumber },
    config
  );
  return res.data;
};

export const cancelAutoPay = async () => {
  const { accountNumber, config } = await authContext();
  const res = await _axios.post(getEndpoint(ENDPOINTS.EASYPAY_DELETE, { accountNumber }), {}, config);
  return { confirmationNumber: String(res.data?.confirmationNumber || res.data?.confirmation_number || "") };
};
