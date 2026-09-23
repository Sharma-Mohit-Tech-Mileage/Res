jest.mock('../../src/utils/logger', () => ({ logDebug: jest.fn() }));
import { installApiLogging, sanitizeApiData, loggedFetch } from '../../src/network/apiLogging';
import { ENDPOINTS, getEndpoint } from '../../src/network/apis/endpoints/Endpoints';
import { logDebug } from '../../src/utils/logger';

beforeEach(() => jest.clearAllMocks());
test('preserves account values and redacts nested secrets without mutating serialized retry payloads', () => {
  const data = { accountNumber: '123', token: 'secret', detail: { password: 'secret', download_Result: '980', error: null } };
  expect(sanitizeApiData(JSON.stringify(data))).toEqual({ accountNumber: '123', token: '[REDACTED]', detail: { password: '[REDACTED]', download_Result: '980', error: null } });
  expect(data.token).toBe('secret');
});
test('logs request, HTTP status and body, preserves response and rejection, installs once', async () => {
  const client = { interceptors: { request: { use: jest.fn() }, response: { use: jest.fn() } } };
  installApiLogging(client);
  installApiLogging(client);
  expect(client.interceptors.request.use).toHaveBeenCalledTimes(1);
  const request = client.interceptors.request.use.mock.calls[0][0];
  const [success, failure] = client.interceptors.response.use.mock.calls[0];
  const config = { baseURL: 'https://customer.uat.cableone.net/apiWrapper/', method: 'post', url: getEndpoint(ENDPOINTS.OOKLA_SPEED_DETAILS, { accountId: '123456789', userId: 'user-name' }) + '?token=secret&idType=account', data: { accountId: '123', download_MBs: 33 }, headers: { Authorization: 'secret' } };
  expect(request(config)).toBe(config);
  expect(logDebug).toHaveBeenLastCalledWith('API REQUEST', expect.objectContaining({ url: 'https://customer.uat.cableone.net/apiWrapper/' + ENDPOINTS.OOKLA_SPEED_DETAILS, query: { token: '[REDACTED]', idType: 'account' } }));
  const response = { config, status: 200, data: { statusCode: 500, result: false } };
  expect(success(response)).toBe(response);
  expect(logDebug).toHaveBeenLastCalledWith('API RESPONSE', expect.objectContaining({ statusCode: 200, response: { statusCode: 500, result: false } }));
  const error = { config, response: { status: 503, data: { error: 'unavailable' } } };
  await expect(failure(error)).rejects.toBe(error);
  expect(logDebug).toHaveBeenLastCalledWith('API ERROR', expect.objectContaining({ statusCode: 503 }));
  const logs = JSON.stringify(logDebug.mock.calls);
  expect(logs).not.toContain('secret');
  expect(logs).not.toContain('123456789');
  expect(logs).not.toContain('user-name');
});
test('fetch logging reads a clone and returns original response', async () => {
  const previousFetch = global.fetch;
  const response = { ok: true, status: 202, clone: jest.fn(() => ({ text: async () => '{"result":true}' })) };
  global.fetch = jest.fn().mockResolvedValue(response);
  try {
    await expect(loggedFetch('https://example.com/api/test', { method: 'POST', body: '{"token":"secret"}' })).resolves.toBe(response);
    expect(logDebug).toHaveBeenLastCalledWith('API RESPONSE', expect.objectContaining({ statusCode: 202, response: { result: true } }));
    expect(JSON.stringify(logDebug.mock.calls)).not.toContain('secret');
  } finally { global.fetch = previousFetch; }
});
test('production does not install logging interceptors', () => {
  const previous = global.__DEV__;
  global.__DEV__ = false;
  try {
    const client = { interceptors: { request: { use: jest.fn() }, response: { use: jest.fn() } } };
    installApiLogging(client);
    expect(client.interceptors.request.use).not.toHaveBeenCalled();
  } finally { global.__DEV__ = previous; }
});

test('logs ping measurements while still redacting authentication PINs', () => {
  expect(sanitizeApiData({ ping_ms: 12, Ping_Ms: 13, ping: 14, pin: '1234', pinCode: '5678', securityPin: '9012' })).toEqual({
    ping_ms: 12, Ping_Ms: 13, ping: 14, pin: '[REDACTED]', pinCode: '[REDACTED]', securityPin: '[REDACTED]',
  });
});

test('shows original Ookla payload values in development logs', () => {
  const payload = { accountId: '8160111080054970', userId: 'JimmyJJomma', download_MBs: 361.756, upload_MBs: 40.606, ping_ms: 12, jitter_ms: 2, host: 'SAH Host3' };
  expect(sanitizeApiData(payload)).toEqual(payload);
  expect(sanitizeApiData(JSON.stringify(payload))).toEqual(payload);
});
