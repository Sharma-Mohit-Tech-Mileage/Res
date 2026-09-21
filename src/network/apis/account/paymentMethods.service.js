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

const cleanName = (value) =>
  String(value || "").replace(/\b(?:null|undefined)\b/gi, "").replace(/\s+/g, " ").trim();

const normalizePaymentMethod = (raw = {}, customerId = "") => {
  const accountType = (raw.account_type || raw.accountType || "").toLowerCase();
  const subtype = (raw.account_subtype || raw.accountSubType || "").toLowerCase();
  const isCard = accountType.includes("card") || subtype.includes("credit") || subtype.includes("debit");
  const masked = String(raw.display_text || raw.displayText || "");
  const fallbackName = isCard
    ? subtype.includes("credit") ? "Credit Card" : "Debit Card"
    : subtype === "savings" ? "Savings Account" : "Checking Account";
  return {
    id: String(raw.id || raw.fundingAccountId || raw.funding_account_id || ""),
    idCustomer: customerId,
    type: isCard ? "card" : "bank",
    // Surcharge applies to credit cards only, so the credit/debit subtype has to survive normalisation.
    cardType: isCard ? (subtype.includes("credit") ? "credit" : subtype.includes("debit") ? "debit" : "") : "",
    brand: (subtype.split("_")[0] || (isCard ? "card" : "bank")).toLowerCase(),
    nickname: cleanName(raw.nickname) || cleanName(raw.account_holder_name) || fallbackName,
    lastFour: masked.replace(/[^0-9]/g, "").slice(-4),
    expiry: raw.expiry_date || raw.expiryDate || "",
    isDefault: false,
    status: (raw.status || "active").toLowerCase(),
  };
};

const pickConfirmationNumber = (data) => {
  const scopes = [data, data?.data, data?.payment, data?.result].filter(Boolean);
  for (const scope of scopes) {
    for (const key of Object.keys(scope)) {
      if (/confirm|reference/i.test(key) && /number|no$|code|id$/i.test(key) && scope[key]) return String(scope[key]);
    }
  }
  return String(data?.confirmationNumber || data?.confirmation_number || "");
};

const ensureServiceOk = (res) => {
  const errs = res?.data?.errors || res?.data?.error_list;
  if (Array.isArray(errs) && errs.length) {
    const raw = String(errs[0]?.message || errs[0]?.description || "");
    throw new Error(!raw || raw.includes("<") ? "The payment service is temporarily unavailable. Please try again later." : raw);
  }
};

// Defect 55051: the customer id comes from RetrieveCustomerData only — urls are never parsed for it, since a stale url is what sent US Bank an invalid CustomerId.
// RetrieveCustomerData returns an Orbipay paged envelope; the customer sits in list[0] and "id" is the authoritative field (per Portals team).
const pickCustomerId = (data) => {
  const customer = data?.list?.[0] || data?.customer || data || {};
  return String(customer.id ?? "");
};

let cachedCustomerId = { accountNumber: "", id: "" };

// Resolves once per account; a failed lookup returns "" rather than throwing, so the payment methods list still renders.
const fetchCustomerId = async () => {
  const { accountNumber, config } = await authContext();
  if (!accountNumber) return "";
  if (cachedCustomerId.accountNumber === accountNumber && cachedCustomerId.id) return cachedCustomerId.id;
  try {
    const res = await _axios.get(getEndpoint(ENDPOINTS.PAYMENT_RETRIEVE_CUSTOMER_DATA, { accountNumber }), config);
    const id = pickCustomerId(res?.data);
    if (id) cachedCustomerId = { accountNumber, id };
    return id;
  } catch (err) {
    return "";
  }
};

export const fetchPaymentMethods = async () => {
  const { accountNumber, config } = await authContext();
  const [res, customerId] = await Promise.all([
    _axios.get(getEndpoint(ENDPOINTS.FUNDING_ACCOUNTS, { accountNumber }), config),
    fetchCustomerId(),
  ]);
  ensureServiceOk(res);
  const list = Array.isArray(res.data) ? res.data : res.data?.fundingAccounts || [];
  return list.map((raw) => normalizePaymentMethod(raw, customerId)).filter((m) => m.id && m.status !== "deleted");
};

export const fetchAutoPayDetails = async () => {
  const { accountNumber, config } = await authContext();

  const res = await _axios.get(getEndpoint(ENDPOINTS.ACCOUNTS_EASYPAY, { accountNumber }), config);
  ensureServiceOk(res);
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
  ensureServiceOk(res);
  return res.data;
};

// The fee arrives as a string, either flat (CalculateFee {"fee":"0.33"}, payment DTO surchargeAmount) or nested (upstream fee.fee_amount).
const pickFeeAmount = (data) => {
  const value = Number(data?.surchargeAmount ?? data?.fee?.fee_amount ?? data?.fee ?? data?.data?.fee);
  return isFinite(value) ? value : null;
};

// Orbipay Fee Calculator. FundingAccountId comes off the funding account, CustomerId from RetrieveCustomerData.
export const calculateFee = async (amount, method, paymentScheduleType = "one_time_payment") => {
  const { config } = await authContext();
  const customerId = method?.idCustomer || (await fetchCustomerId());
  const res = await _axios.post(
    getEndpoint(ENDPOINTS.PAYMENT_CALCULATE_FEE),
    {
      // API binds "amount" — sending "surchargeAmount" made the server price a
      // $0 payment and return fee 0.00 (portal sends "amount" and gets 0.66).
      amount: Number(amount),
      paymentScheduleType,
      CustomerId: customerId,
      FundingAccountId: method?.id || "",
    },
    config
  );
  return pickFeeAmount(res?.data);
};

export const submitPayment = async (amount, method, emailOverride) => {
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
      email: emailOverride || email,
      comment: "",
      customFields: {},
    },
    config
  );
  ensureServiceOk(res);
  const status = String(res?.data?.status || "").toLowerCase();
  const confirmationNumber = pickConfirmationNumber(res.data);
  // Declines come back HTTP 200 with status "Failed" and every field null, so only a confirmation number proves success.
  if (status === "failed" || status === "declined" || !confirmationNumber) {
    const err = new Error("Payment was not accepted");
    err.code = "PAYMENT_DECLINED";
    throw err;
  }
  return { confirmationNumber, fee: pickFeeAmount(res.data) };
};

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
  ensureServiceOk(res);
  return { confirmationNumber: pickConfirmationNumber(res.data) };
};

export const updateAutoPayPaymentMethod = async (methodId) => {
  const { accountNumber, config } = await authContext();
  const res = await _axios.post(getEndpoint(ENDPOINTS.EASYPAY_DELETE, { accountNumber }), {}, config);
  ensureServiceOk(res);
  return enrollAutoPay(methodId);
};

export const confirmBankToken = async (token, digiSign) => {
  const { accountNumber, config } = await authContext();
  const res = await _axios.post(
    getEndpoint(ENDPOINTS.FUNDING_ACCOUNT_ADD),
    { token, digiSign, customer_account_reference: accountNumber, accountNumber },
    config
  );
  ensureServiceOk(res);
  const method = normalizePaymentMethod(res.data?.funding_account || res.data?.fundingAccount || res.data || {});
  if (!method.id) throw new Error("The payment service did not confirm your new payment method.");
  return method;
};

export const confirmPaymentToken = async (token, digiSign, amount, emailOverride) => {
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
      email: emailOverride || email,
      paymentRequestDate: moment().format("YYYY-MM-DD"),
    },
    config
  );
  ensureServiceOk(res);
  return { confirmationNumber: pickConfirmationNumber(res.data), fee: pickFeeAmount(res.data) };
};

export const updateFundingAccount = async (methodId, { token, digiSign } = {}) => {
  const { accountNumber, config } = await authContext();
  const res = await _axios.put(
    getEndpoint(ENDPOINTS.FUNDING_ACCOUNT_UPDATE),
    { token, digiSign, id_account: methodId, customer_account_reference: null, accountNumber },
    config
  );
  ensureServiceOk(res);
  return res.data;
};

export const cancelAutoPay = async () => {
  const { accountNumber, config } = await authContext();
  const res = await _axios.post(getEndpoint(ENDPOINTS.EASYPAY_DELETE, { accountNumber }), {}, config);
  ensureServiceOk(res);
  return { confirmationNumber: pickConfirmationNumber(res.data) };
};
