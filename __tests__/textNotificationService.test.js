// 56520: first-login text opt-in must reach the SMS API as literal opt-out flags (false = subscribed).
const mockPost = jest.fn();
jest.mock("../src/network/RestApiClient", () => ({ _axios: { post: (...a) => mockPost(...a), get: jest.fn(), put: jest.fn() } }));
jest.mock("../src/redux/utils/LocalStorage", () => ({ getUser: async () => ({ token: "t", userInfo: { accountNumber: "123" } }) }));
jest.mock("../src/firebase/FirebaseUtils", () => ({ getDeviceUniqueId: jest.fn(), getFcmToken: jest.fn() }));

import { postTextNotifictionInfo } from "../src/network/apis/account/profile.service";

beforeEach(() => { mockPost.mockReset(); mockPost.mockResolvedValue({ data: true }); });

const sentBody = () => mockPost.mock.calls[0][1];

describe("postTextNotifictionInfo", () => {
  it("sends an opt-in to all three types as false flags", async () => {
    await postTextNotifictionInfo({ phoneNumber: "5551234567", optOut: false, outageOptOut: false, billingOptOutStatus: false });
    expect(sentBody()).toEqual({ accountNumber: "123", phoneNumber: "5551234567", optOut: false, outageOptOut: false, billingOptOutStatus: false });
  });

  it("passes opt-outs through unchanged", async () => {
    await postTextNotifictionInfo({ phoneNumber: "5551234567", optOut: true, outageOptOut: false, billingOptOutStatus: true });
    expect(sentBody()).toMatchObject({ optOut: true, outageOptOut: false, billingOptOutStatus: true });
  });
});
