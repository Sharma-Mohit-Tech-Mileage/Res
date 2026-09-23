import vm from 'vm';
import { OOKLA_HTML, OOKLA_ORIGIN, parseOoklaCompletion } from '../../src/components/services/speedTest/ooklaBridge';
const result = {
  config: { testId: 'test-id', host: 'test-host' }, device: { platform: 'speedtest-custom' },
  end: { timestamp: '2026-09-21T12:00:00Z' }, units: 'Kbps', download: 980400, upload: 54690,
  latency: { minimum: 11, jitter: 22 },
};
const message = value => JSON.stringify({ type: 'ookla-complete', result: value });
test('converts Kbps to Mbps and keeps latency in milliseconds', () => {
  expect(parseOoklaCompletion(message(result))).toEqual({ testId: 'test-id', download: 980.4, upload: 54.69, ping: 11, jitter: 22, host: 'test-host' });
});
test('preserves zero and null optional measurements; rejects partial or invalid results', () => {
  expect(parseOoklaCompletion(message({ ...result, download: 0, latency: null }))).toMatchObject({ download: 0, ping: null, jitter: null });
  expect(parseOoklaCompletion(message({ ...result, end: null }))).toBeNull();
  expect(() => parseOoklaCompletion(message({ ...result, download: 'n/a' }))).toThrow();
  expect(() => parseOoklaCompletion(message({ ...result, units: 'unknown' }))).toThrow();
  expect(parseOoklaCompletion(JSON.stringify({ type: 'progress' }))).toBeNull();
});
test('embedded bridge accepts only completion from the actual trusted iframe', () => {
  const postMessage = jest.fn();
  let receive;
  const frame = { contentWindow: {} };
  const script = OOKLA_HTML.match(/<script>([\s\S]*?)<\/script>/)[1];
  vm.runInNewContext(script, {
    window: { addEventListener: (name, fn) => { receive = fn; }, ReactNativeWebView: { postMessage } },
    document: { getElementById: () => frame },
  });
  receive({ origin: 'https://untrusted.example', source: frame.contentWindow, data: result });
  receive({ origin: OOKLA_ORIGIN, source: {}, data: result });
  receive({ origin: OOKLA_ORIGIN, source: frame.contentWindow, data: { ...result, end: null } });
  expect(postMessage).not.toHaveBeenCalled();
  receive({ origin: OOKLA_ORIGIN, source: frame.contentWindow, data: result });
  expect(JSON.parse(postMessage.mock.calls[0][0])).toEqual({ type: 'ookla-complete', result });
});
