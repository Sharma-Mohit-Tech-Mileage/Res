jest.mock("../../../src/network/RestApiClient", () => ({
  _axios: { get: jest.fn(), post: jest.fn() },
}));
jest.mock("../../../src/redux/utils/LocalStorage", () => ({
  getUser: jest.fn(),
}));
import api from "../../../src/network/apis/services/speedTest.service";
import { _axios } from "../../../src/network/RestApiClient";
import { getUser } from "../../../src/redux/utils/LocalStorage";

const result = (tstamp = "2026-09-25T08:20:52-07:00") => ({
  data: {
    statusCode: 200,
    error: null,
    data: [
      { id: "1", down_Mbps: "980.4000244140625", up_Mbps: "0", date: tstamp },
    ],
    detail: {
      id: "1",
      download_Result: "980.4000244140625",
      upload_Result: "0",
      tstamp,
    },
  },
});
beforeEach(() => {
  jest.resetAllMocks();
  getUser.mockResolvedValue({
    token: "test-token",
    userInfo: { accountNumber: "account-1", userName: "user/name" },
  });
});
afterEach(() => jest.useRealTimers());

test("Eero accepts Success in successful start and result envelopes", async () => {
  const latest = result();
  latest.data.error = "Success";
  _axios.get
    .mockResolvedValueOnce({ status: 204 })
    .mockResolvedValueOnce(latest);
  _axios.post
    .mockResolvedValueOnce({ data: { statusCode: 202, error: "Success" } })
    .mockResolvedValueOnce({ data: true });
  await expect(api.runEeroSpeedTest()).resolves.toMatchObject({
    download: "980.4000244140625",
    historySaved: true,
  });
});

test("Eero still rejects service errors with a successful status code", async () => {
  _axios.get.mockResolvedValueOnce({ status: 204 });
  _axios.post.mockResolvedValueOnce({
    data: { statusCode: 200, error: "Network unavailable" },
  });
  await expect(api.runEeroSpeedTest()).rejects.toMatchObject({
    speedTestStage: "start",
  });
  expect(_axios.get).toHaveBeenCalledTimes(1);
  expect(_axios.post).toHaveBeenCalledTimes(1);
});

test("accepts the observed GET envelope and nested history success", async () => {
  _axios.get.mockResolvedValue({
    data: {
      results: null,
      detail: null,
      data: [
        {
          id: 21299029,
          down_Mbps: 973.24,
          up_Mbps: 54.71,
          date: "2026-09-25T07:07:26-07:00",
        },
      ],
    },
  });
  const latest = await api.getEeroResults();
  expect(latest).toMatchObject({ download: 973.24, upload: 54.71 });
  _axios.post.mockResolvedValue({
    data: {
      historyResults: { statusCode: 200, error: "Success", result: "true" },
      download_MBs: 0,
      upload_MBs: 0,
    },
  });
  await expect(api.insertEeroHistory(latest)).resolves.toBe(true);
  expect(_axios.post).toHaveBeenCalledWith(
    "api/InsertEeroSpeedTestHistory",
    {
      accountId: "account-1",
      userId: "account-1",
      download_MBs: 973.24,
      upload_MBs: 54.71,
      ping_Ms: 0,
      jitter_Ms: 0,
      host: "",
    },
    expect.any(Object),
  );
});

test.each(["false", false])(
  "rejects nested history result %p",
  async (result) => {
    _axios.post.mockResolvedValue({
      data: { historyResults: { statusCode: 200, result } },
    });
    await expect(
      api.insertEeroHistory({ download: 1, upload: 2 }),
    ).rejects.toThrow("save");
  },
);

test("Eero starts with no prior details and no username, then posts raw history", async () => {
  getUser.mockResolvedValue({
    token: "test-token",
    userInfo: { accountNumber: "account-1", userId: "user-123" },
  });
  _axios.get
    .mockResolvedValueOnce({ status: 204, data: "" })
    .mockResolvedValueOnce(result());
  _axios.post
    .mockResolvedValueOnce({ data: { statusCode: 202 } })
    .mockResolvedValueOnce({ data: true });
  await expect(api.runEeroSpeedTest()).resolves.toMatchObject({
    historySaved: true,
  });
  expect(_axios.post).toHaveBeenNthCalledWith(
    1,
    "api/post/EeroSpeedtest",
    {
      idType: "account",
      id: "account-1",
      accountNumber: "account-1",
    },
    expect.any(Object),
  );
  expect(_axios.post).toHaveBeenNthCalledWith(
    2,
    "api/InsertEeroSpeedTestHistory",
    expect.objectContaining({
      userId: "user-123",
      download_MBs: "980.4000244140625",
      upload_MBs: "0",
    }),
    expect.any(Object),
  );
});

test("modem display falls back to live details when saving history failed", async () => {
  _axios.get
    .mockRejectedValueOnce({ response: { status: 500 } })
    .mockResolvedValueOnce(result());
  await expect(api.getLatestEeroResult()).resolves.toMatchObject({
    download: "980.4000244140625",
  });
  expect(_axios.get.mock.calls.map(([path]) => path)).toEqual([
    "api/GetEeroSpeedTestHistory/account-1",
    "api/get/EeroSpeedtest",
  ]);
});

test("modem history authentication failure is not hidden by a fallback", async () => {
  _axios.get.mockRejectedValueOnce({ response: { status: 401 } });
  await expect(api.getLatestEeroResult()).rejects.toMatchObject({
    response: { status: 401 },
  });
  expect(_axios.get).toHaveBeenCalledTimes(1);
});

test("POST keeps raw measurement strings and full precision unchanged", async () => {
  _axios.post.mockResolvedValue({ data: true });
  const raw = {
    download: "980.4000244140625",
    upload: "54.689998626708984",
    ping: "11.00",
    jitter: "22.00",
  };
  await api.saveOoklaResult(raw);
  expect(_axios.post).toHaveBeenLastCalledWith(
    "api/post/OoklaSpeedtest",
    expect.objectContaining({
      download_MBs: raw.download,
      upload_MBs: raw.upload,
      ping_ms: raw.ping,
      jitter_ms: raw.jitter,
    }),
    expect.any(Object),
  );
  await api.insertEeroHistory(raw);
  expect(_axios.post).toHaveBeenLastCalledWith(
    "api/InsertEeroSpeedTestHistory",
    expect.objectContaining({
      download_MBs: raw.download,
      upload_MBs: raw.upload,
      ping_Ms: raw.ping,
      jitter_Ms: raw.jitter,
    }),
    expect.any(Object),
  );
});

test("Eero history reads saved measurements and handles empty history", async () => {
  _axios.get.mockResolvedValueOnce({
    data: {
      download_MBs: 221,
      upload_MBs: 231,
      createdOn: "2026-09-17T19:40:54Z",
    },
  });
  await expect(api.getEeroHistory()).resolves.toEqual({
    download: 221,
    upload: 231,
    updated: "2026-09-17T19:40:54Z",
  });
  expect(_axios.get).toHaveBeenCalledWith(
    "api/GetEeroSpeedTestHistory/account-1",
    expect.any(Object),
  );
  _axios.get.mockResolvedValueOnce({ status: 204 });
  await expect(api.getEeroHistory()).resolves.toBeNull();
});
test("option one selects the newest measurement even when results are unordered", async () => {
  _axios.get.mockResolvedValue({
    data: {
      statusCode: 200,
      error: null,
      data: [
        {
          id: 1,
          down_Mbps: 100,
          up_Mbps: 10,
          date: "2026-09-13T02:12:43-07:00",
        },
        {
          id: 2,
          down_Mbps: 980.4,
          up_Mbps: 54.69,
          date: "2026-09-14T09:20:52-07:00",
        },
      ],
    },
  });
  await expect(api.getEeroResults()).resolves.toMatchObject({
    id: 2,
    download: 980.4,
    upload: 54.69,
  });
  expect(_axios.get).toHaveBeenCalledWith(
    "api/get/EeroSpeedtest",
    expect.objectContaining({
      timeout: 0,
      params: {
        idType: "account",
        id: "account-1",
        accountNumber: "account-1",
      },
    }),
  );
});
test("network mode requires a network ID before making a request", async () => {
  await expect(api.getEeroDetails("network")).rejects.toThrow("Network ID");
  expect(_axios.get).not.toHaveBeenCalled();
});

test("reboot sends the session account and supplied IP; rejects application-level failure", async () => {
  _axios.post.mockResolvedValue({
    data: { statusCode: 500, error: null, result: false },
  });
  await expect(api.rebootModem("10.1.2.3")).rejects.toThrow();
  expect(_axios.post).toHaveBeenCalledWith(
    "api/ModemReboot",
    { ip: "10.1.2.3", AccountNumber: "account-1" },
    expect.objectContaining({ skipRetry: true }),
  );
  _axios.post.mockResolvedValue({ data: { statusCode: 200, result: true } });
  await expect(api.rebootModem("10.1.2.3")).resolves.toBe(true);
});
test("unavailable IP is sent as null", async () => {
  _axios.post.mockResolvedValue({ data: { statusCode: 500, result: false } });
  await expect(api.rebootModem()).rejects.toThrow();
  expect(_axios.post).toHaveBeenCalledWith(
    "api/ModemReboot",
    { ip: null, AccountNumber: "account-1" },
    expect.any(Object),
  );
});
test("network mode sends the network ID and account number and retains zero", async () => {
  _axios.get.mockResolvedValue(result());
  await expect(
    api.getEeroDetails("network", "network-1"),
  ).resolves.toMatchObject({ download: "980.4000244140625", upload: "0" });
  expect(_axios.get).toHaveBeenCalledWith(
    "api/Eerospeedtest/details",
    expect.objectContaining({
      params: {
        idType: "network",
        id: "network-1",
        accountNumber: "account-1",
      },
    }),
  );
});
test("successful Eero run, details and history execute sequentially with nullable telemetry", async () => {
  _axios.get
    .mockResolvedValueOnce(result("2026-09-25T07:07:26-07:00"))
    .mockResolvedValueOnce(result());
  _axios.post
    .mockResolvedValueOnce({ data: { statusCode: 202, error: null } })
    .mockResolvedValueOnce({ data: true });
  await expect(api.runEeroSpeedTest()).resolves.toMatchObject({
    historySaved: true,
  });
  expect(_axios.post.mock.calls[0]).toEqual([
    "api/post/EeroSpeedtest",
    { idType: "account", id: "account-1", accountNumber: "account-1" },
    expect.any(Object),
  ]);
  expect(_axios.post.mock.calls[1]).toEqual([
    "api/InsertEeroSpeedTestHistory",
    {
      accountId: "account-1",
      userId: "account-1",
      download_MBs: "980.4000244140625",
      upload_MBs: "0",
      ping_Ms: 0,
      jitter_Ms: 0,
      host: "",
    },
    expect.any(Object),
  ]);
  expect(_axios.post.mock.invocationCallOrder[0]).toBeLessThan(
    _axios.get.mock.invocationCallOrder[1],
  );
  expect(_axios.get.mock.invocationCallOrder[1]).toBeLessThan(
    _axios.post.mock.invocationCallOrder[1],
  );
});
test("stale result polling times out without inserting history", async () => {
  jest.useFakeTimers();
  _axios.get.mockResolvedValue(result());
  _axios.post.mockResolvedValue({ data: { statusCode: 202 } });
  const assertion = expect(api.runEeroSpeedTest()).rejects.toThrow("No new");
  await jest.runAllTimersAsync();
  await assertion;
  expect(_axios.post).toHaveBeenCalledTimes(1);
});
test("failed start does not retrieve another result or insert history", async () => {
  _axios.get.mockResolvedValue(result());
  _axios.post.mockResolvedValue({ data: { statusCode: 500 } });
  await expect(api.runEeroSpeedTest()).rejects.toThrow();
  expect(_axios.get).toHaveBeenCalledTimes(1);
  expect(_axios.post).toHaveBeenCalledTimes(1);
});
test("history failure preserves the measurement with an unsaved flag", async () => {
  _axios.get
    .mockResolvedValueOnce(result("2026-09-25T07:07:26-07:00"))
    .mockResolvedValueOnce(result());
  _axios.post
    .mockResolvedValueOnce({ data: { statusCode: 202 } })
    .mockResolvedValueOnce({ data: false });
  await expect(api.runEeroSpeedTest()).resolves.toMatchObject({
    upload: "0",
    historySaved: false,
  });
});
test("cancelled test does not start or insert history", async () => {
  _axios.get.mockResolvedValue(result());
  await expect(
    api.runEeroSpeedTest({ isCancelled: () => true }),
  ).rejects.toThrow("cancelled");
  expect(_axios.post).not.toHaveBeenCalled();
});
test("Ookla payload uses exact casing; false is rejected; retrieval encodes user identity", async () => {
  _axios.post.mockResolvedValue({ data: false });
  await expect(
    api.saveOoklaResult({
      download: 333,
      upload: 444,
      ping: 99.9,
      jitter: 88.8,
      host: "Host3",
    }),
  ).rejects.toThrow("save");
  expect(_axios.post).toHaveBeenCalledWith(
    "api/post/OoklaSpeedtest",
    {
      accountId: "account-1",
      userId: "user/name",
      download_MBs: 333,
      upload_MBs: 444,
      ping_ms: 99.9,
      jitter_ms: 88.8,
      host: "Host3",
    },
    expect.objectContaining({
      headers: { Authorization: "Bearer test-token" },
    }),
  );
  _axios.get.mockResolvedValue({
    data: {
      testResults: { download_MBs: 0, upload_MBs: 231, createdOn: "today" },
    },
  });
  await expect(api.getOoklaResult()).resolves.toEqual({
    download: 0,
    upload: 231,
    updated: "today",
  });
  expect(_axios.get).toHaveBeenCalledWith(
    "api/get/OoklaSpeedtest/account-1/user%2Fname",
    expect.objectContaining({
      headers: { Authorization: "Bearer test-token" },
    }),
  );
});
test.each([null, "", " ", "invalid", false, -1])(
  "invalid measured speed %p never becomes a fabricated zero",
  async (download) => {
    await expect(
      api.saveOoklaResult({ download, upload: 1 }),
    ).rejects.toThrow();
    expect(_axios.post).not.toHaveBeenCalled();
  },
);
test("missing session prevents requests", async () => {
  getUser.mockResolvedValue(null);
  await expect(api.getOoklaResult()).rejects.toThrow();
  expect(_axios.get).not.toHaveBeenCalled();
});

test.each([
  [316.112, 41.235, 316.112, 41.235],
  [316.8, 41.5, 316.8, 41.5],
  [0, 41, 0, 41],
])(
  "Ookla preserves measured decimal speeds for %s and %s",
  async (download, upload, expectedDownload, expectedUpload) => {
    _axios.post.mockResolvedValue({ data: true });
    await api.saveOoklaResult({
      download,
      upload,
      ping: 19.5,
      jitter: 6.777778,
      host: "Host3",
    });
    expect(_axios.post).toHaveBeenCalledWith(
      "api/post/OoklaSpeedtest",
      expect.objectContaining({
        download_MBs: expectedDownload,
        upload_MBs: expectedUpload,
        ping_ms: 19.5,
        jitter_ms: 6.777778,
      }),
      expect.any(Object),
    );
  },
);

test.each(["true", true])(
  "Ookla accepts the observed history envelope with result %p",
  async (result) => {
    _axios.post.mockResolvedValue({
      status: 200,
      data: {
        historyResults: { statusCode: 200, error: "Success", result },
        testResults: null,
      },
    });
    await expect(
      api.saveOoklaResult({
        download: 404.9,
        upload: 41.4,
        ping: 20,
        jitter: 1,
      }),
    ).resolves.toBe(true);
    expect(_axios.post).toHaveBeenCalledTimes(1);
  },
);

test.each([
  { statusCode: 200, result: false },
  { statusCode: 200, result: "false" },
  { statusCode: 500, result: "true" },
  { statusCode: 200 },
  { result: "true" },
  null,
])(
  "Ookla rejects unsuccessful or incomplete history envelope %p",
  async (historyResults) => {
    _axios.post.mockResolvedValue({
      status: 200,
      data: { historyResults, testResults: null },
    });
    await expect(
      api.saveOoklaResult({ download: 404.9, upload: 41.4 }),
    ).rejects.toThrow("Unable to save");
  },
);
