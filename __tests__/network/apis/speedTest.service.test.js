jest.mock('../../../src/network/RestApiClient', () => ({ _axios: { get: jest.fn(), post: jest.fn() } }));
jest.mock('../../../src/redux/utils/LocalStorage', () => ({ getUser: jest.fn() }));
import api from '../../../src/network/apis/services/speedTest.service';
import { _axios } from '../../../src/network/RestApiClient';
import { getUser } from '../../../src/redux/utils/LocalStorage';

const result = (tstamp = '09/21/2026 09:20:52') => ({ data: {
  statusCode: 200, error: null,
  detail: { id: '1', download_Result: '980.4000244140625', upload_Result: '0', tstamp },
} });
beforeEach(() => {
  jest.resetAllMocks();
  getUser.mockResolvedValue({ token: 'test-token', userInfo: { accountNumber: 'account-1', userName: 'user/name' } });
});
afterEach(() => jest.useRealTimers());

test('reboot sends the session account and supplied IP; rejects application-level failure', async () => {
  _axios.post.mockResolvedValue({ data: { statusCode: 500, error: null, result: false } });
  await expect(api.rebootModem('10.1.2.3')).rejects.toThrow();
  expect(_axios.post).toHaveBeenCalledWith('api/ModemReboot', { ip: '10.1.2.3', AccountNumber: 'account-1' }, expect.objectContaining({ skipRetry: true }));
  _axios.post.mockResolvedValue({ data: { statusCode: 200, result: true } });
  await expect(api.rebootModem('10.1.2.3')).resolves.toBe(true);
});
test('unavailable IP is sent as null', async () => {
  _axios.post.mockResolvedValue({ data: { statusCode: 500, result: false } });
  await expect(api.rebootModem()).rejects.toThrow();
  expect(_axios.post).toHaveBeenCalledWith('api/ModemReboot', { ip: null, AccountNumber: 'account-1' }, expect.any(Object));
});
test('network mode sends account number for both identifiers and retains zero', async () => {
  _axios.get.mockResolvedValue(result());
  await expect(api.getEeroDetails('network')).resolves.toMatchObject({ download: 980.4000244140625, upload: 0 });
  expect(_axios.get).toHaveBeenCalledWith('api/Eerospeedtest/details', expect.objectContaining({ params: { idType: 'network', id: 'account-1', accountNumber: 'account-1' } }));
});
test('successful Eero run, details and history execute sequentially with nullable telemetry', async () => {
  _axios.get.mockResolvedValueOnce(result('previous')).mockResolvedValueOnce(result());
  _axios.post.mockResolvedValueOnce({ data: { statusCode: 202, error: null } }).mockResolvedValueOnce({ data: true });
  await expect(api.runEeroSpeedTest()).resolves.toMatchObject({ historySaved: true });
  expect(_axios.post.mock.calls[0]).toEqual(['api/post/EeroSpeedtest', { idType: 'account', id: 'account-1', AccountNumber: 'account-1' }, expect.any(Object)]);
  expect(_axios.post.mock.calls[1]).toEqual(['api/InsertEeroSpeedTestHistory', {
    AccountId: 'account-1', UserId: 'user/name', Download_MBs: 980.4000244140625,
    Upload_MBs: 0, Ping_Ms: null, Jitter_Ms: null, Host: null,
  }, expect.any(Object)]);
  expect(_axios.post.mock.invocationCallOrder[0]).toBeLessThan(_axios.get.mock.invocationCallOrder[1]);
  expect(_axios.get.mock.invocationCallOrder[1]).toBeLessThan(_axios.post.mock.invocationCallOrder[1]);
});
test('stale result polling times out without inserting history', async () => {
  jest.useFakeTimers();
  _axios.get.mockResolvedValue(result());
  _axios.post.mockResolvedValue({ data: { statusCode: 202 } });
  const assertion = expect(api.runEeroSpeedTest()).rejects.toThrow('No new');
  await jest.runAllTimersAsync();
  await assertion;
  expect(_axios.post).toHaveBeenCalledTimes(1);
});
test('failed start does not retrieve another result or insert history', async () => {
  _axios.get.mockResolvedValue(result());
  _axios.post.mockResolvedValue({ data: { statusCode: 500 } });
  await expect(api.runEeroSpeedTest()).rejects.toThrow();
  expect(_axios.get).toHaveBeenCalledTimes(1);
  expect(_axios.post).toHaveBeenCalledTimes(1);
});
test('history failure preserves the measurement with an unsaved flag', async () => {
  _axios.get.mockResolvedValueOnce(result('old')).mockResolvedValueOnce(result());
  _axios.post.mockResolvedValueOnce({ data: { statusCode: 202 } }).mockResolvedValueOnce({ data: false });
  await expect(api.runEeroSpeedTest()).resolves.toMatchObject({ upload: 0, historySaved: false });
});
test('cancelled test does not start or insert history', async () => {
  _axios.get.mockResolvedValue(result());
  await expect(api.runEeroSpeedTest({ isCancelled: () => true })).rejects.toThrow('cancelled');
  expect(_axios.post).not.toHaveBeenCalled();
});
test('Ookla payload uses exact casing; false is rejected; retrieval encodes user identity', async () => {
  _axios.post.mockResolvedValue({ data: false });
  await expect(api.saveOoklaResult({ download: 333, upload: 444, ping: 99.9, jitter: 88.8, host: 'Host3' })).rejects.toThrow('save');
  expect(_axios.post).toHaveBeenCalledWith('api/post/OoklaSpeedtest', {
    accountId: 'account-1', userId: 'user/name', download_MBs: 333, upload_MBs: 444,
    ping_ms: 99.9, jitter_ms: 88.8, host: 'Host3',
  }, expect.objectContaining({ headers: { Authorization: 'Bearer test-token' } }));
  _axios.get.mockResolvedValue({ data: { download_MBs: 0, upload_MBs: 231, createdOn: 'today' } });
  await expect(api.getOoklaResult()).resolves.toEqual({ download: 0, upload: 231, updated: 'today' });
  expect(_axios.get).toHaveBeenCalledWith('api/get/OoklaSpeedtest/account-1/user%2Fname', expect.objectContaining({ headers: { Authorization: 'Bearer test-token' } }));
});
test.each([null, '', ' ', 'invalid', false, -1])('invalid measured speed %p never becomes a fabricated zero', async download => {
  await expect(api.saveOoklaResult({ download, upload: 1 })).rejects.toThrow();
  expect(_axios.post).not.toHaveBeenCalled();
});
test('missing session prevents requests', async () => {
  getUser.mockResolvedValue(null);
  await expect(api.getOoklaResult()).rejects.toThrow();
  expect(_axios.get).not.toHaveBeenCalled();
});

test.each([[316.112, 41.235, 316.112, 41.235], [316.8, 41.5, 316.8, 41.5], [0, 41, 0, 41]])('Ookla preserves measured decimal speeds for %s and %s', async (download, upload, expectedDownload, expectedUpload) => {
  _axios.post.mockResolvedValue({ data: true });
  await api.saveOoklaResult({ download, upload, ping: 19.5, jitter: 6.777778, host: 'Host3' });
  expect(_axios.post).toHaveBeenCalledWith('api/post/OoklaSpeedtest', expect.objectContaining({
    download_MBs: expectedDownload, upload_MBs: expectedUpload, ping_ms: 19.5, jitter_ms: 6.777778,
  }), expect.any(Object));
});
