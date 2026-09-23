// 55255: HTTP 200 responses that the Self Service portal treats as failures must fail on mobile too.
const mockPost = jest.fn();
const mockGet = jest.fn();
jest.mock("../src/network/RestApiClient", () => ({ _axios: { post: (...a) => mockPost(...a), get: (...a) => mockGet(...a), put: jest.fn() } }));
jest.mock("../src/redux/utils/LocalStorage", () => ({ getUser: async () => ({ token: "t", userInfo: { accountNumber: "123" } }) }));
jest.mock("../src/redux/configureStore", () => ({ getState: () => ({ profile: { accountDetails: {} } }) }));
jest.mock("../src/components/utility/constant", () => ({ getPrimaryEmail: () => "a@b.c" }));

import {
  submitPayment,
  confirmPaymentToken,
  enrollAutoPay,
  cancelAutoPay,
  updateAutoPayPaymentMethod,
  deletePaymentMethod,
  paymentErrorMessage,
  PAYMENT_ERROR_MESSAGES,
} from "../src/network/apis/account/paymentMethods.service";

const method = { id: "9", lastFour: "1111" };
const ok = (data) => Promise.resolve({ status: 200, data });
const codeOf = (p) => p.then(() => "resolved", (e) => e.code);

beforeEach(() => { mockPost.mockReset(); mockGet.mockReset(); });

describe("MakeAOneTimePayment (saved method)", () => {
  it("succeeds only when an id comes back", async () => {
    mockPost.mockReturnValueOnce(ok({ id: "P1", status: "processed", confirmation_number: "C1", fee: { fee_amount: "0.50" } }));
    await expect(submitPayment(10, method)).resolves.toEqual({ confirmationNumber: "C1", fee: 0.5 });
  });
  it("maps status Duplicate to its own code and copy", async () => {
    mockPost.mockReturnValueOnce(ok({ id: null, status: "Duplicate" }));
    await expect(codeOf(submitPayment(10, method))).resolves.toBe("PAYMENT_DUPLICATE");
  });
  it("treats a 200 decline (status Failed, no id) as declined", async () => {
    mockPost.mockReturnValueOnce(ok({ id: null, status: "Failed", confirmation_number: null }));
    await expect(codeOf(submitPayment(10, method))).resolves.toBe("PAYMENT_DECLINED");
  });
  it("treats a 200 with no id as declined even if status looks fine", async () => {
    mockPost.mockReturnValueOnce(ok({ status: "processed" }));
    await expect(codeOf(submitPayment(10, method))).resolves.toBe("PAYMENT_DECLINED");
  });
});

describe("Submit (widget / new method)", () => {
  it("fails when paymentConfirmationId is missing", async () => {
    mockPost.mockReturnValueOnce(ok({ paymentStatus: 3, paymentConfirmationId: null }));
    await expect(codeOf(confirmPaymentToken("tok", "sig", 10))).resolves.toBe("PAYMENT_UNCONFIRMED");
  });
  it("succeeds with paymentConfirmationId", async () => {
    mockPost.mockReturnValueOnce(ok({ paymentStatus: 1, paymentConfirmationId: "PC1", surchargeAmount: "0.33" }));
    await expect(confirmPaymentToken("tok", "sig", 10)).resolves.toEqual({ confirmationNumber: "PC1", fee: 0.33 });
  });
});

describe("AutoPay", () => {
  it("enrollment requires status scheduled and an id", async () => {
    mockPost.mockReturnValueOnce(ok({ id: "E1", status: " Scheduled " }));
    await expect(enrollAutoPay(method)).resolves.toEqual({ confirmationNumber: "E1" });
    mockPost.mockReturnValueOnce(ok({ id: "E2", status: "failed" }));
    await expect(codeOf(enrollAutoPay(method))).resolves.toBe("AUTOPAY_NOT_SCHEDULED");
    mockPost.mockReturnValueOnce(ok({ status: "scheduled" }));
    await expect(codeOf(enrollAutoPay(method))).resolves.toBe("AUTOPAY_NOT_SCHEDULED");
  });
  it("deactivation requires deleted: true", async () => {
    mockPost.mockReturnValueOnce(ok({ deleted: false, id: "E1" }));
    await expect(codeOf(cancelAutoPay())).resolves.toBe("AUTOPAY_NOT_DELETED");
    mockPost.mockReturnValueOnce(ok({ deleted: true, id: "E1" }));
    await expect(cancelAutoPay()).resolves.toEqual({ confirmationNumber: "E1" });
  });
  it("update stops before setup when the delete did not confirm", async () => {
    mockPost.mockReturnValueOnce(ok({ deleted: false }));
    await expect(codeOf(updateAutoPayPaymentMethod(method))).resolves.toBe("AUTOPAY_NOT_DELETED");
    expect(mockPost).toHaveBeenCalledTimes(1);
  });
  it("update reports the customer as un-enrolled when setup fails after a confirmed delete", async () => {
    mockPost.mockReturnValueOnce(ok({ deleted: true, id: "E1" })).mockReturnValueOnce(ok({ id: null, status: "failed" }));
    await expect(codeOf(updateAutoPayPaymentMethod(method))).resolves.toBe("AUTOPAY_UPDATE_UNENROLLED");
    expect(mockPost).toHaveBeenCalledTimes(2);
  });
});

describe("Delete funding account", () => {
  it("fails on an empty body", async () => {
    mockPost.mockReturnValueOnce(ok(""));
    await expect(codeOf(deletePaymentMethod("9"))).resolves.toBe("METHOD_NOT_DELETED");
  });
});

describe("paymentErrorMessage", () => {
  it("uses portal copy for typed codes, passes backend error_list text through, and hides technical text", () => {
    expect(paymentErrorMessage({ code: "PAYMENT_DUPLICATE" })).toBe(PAYMENT_ERROR_MESSAGES.PAYMENT_DUPLICATE);
    const serviceErr = Object.assign(new Error("Card limit exceeded"), { code: "SERVICE_ERROR" });
    expect(paymentErrorMessage(serviceErr)).toBe("Card limit exceeded");
    const axiosErr = Object.assign(new Error("Request failed with status code 500"), { isAxiosError: true });
    expect(paymentErrorMessage(axiosErr)).toBe(PAYMENT_ERROR_MESSAGES.PAYMENT_REQUEST_FAILED);
    expect(paymentErrorMessage(axiosErr, "PAYMENT_SUBMIT_FAILED")).toBe(PAYMENT_ERROR_MESSAGES.PAYMENT_SUBMIT_FAILED);
    expect(paymentErrorMessage(new TypeError("Cannot read property 'id' of undefined"))).toBe(PAYMENT_ERROR_MESSAGES.PAYMENT_REQUEST_FAILED);
  });
  it("backend error_list text is tagged so it reaches the customer verbatim", async () => {
    mockPost.mockReturnValueOnce(ok({ errors: [{ message: "Funding account is inactive" }] }));
    await expect(submitPayment(10, method)).rejects.toMatchObject({ code: "SERVICE_ERROR", message: "Funding account is inactive" });
  });
});
