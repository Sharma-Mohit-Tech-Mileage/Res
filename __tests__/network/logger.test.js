jest.mock('react-native-config', () => ({WEBVIEW_DIAG_ENABLED: 'false'}));
import {logDebug, logDiag} from '../../src/utils/logger';

afterEach(() => jest.restoreAllMocks());

test('debug and diagnostic logs preserve original nested values', () => {
  const output = jest.spyOn(console, 'log').mockImplementation(() => {});
  const payload = {token: 'test-token', nested: {password: 'test-password', pin: '1234'}};
  logDebug('test', payload);
  expect(output).toHaveBeenLastCalledWith('[App] [test]', payload);
  logDiag('test', payload);
  expect(output).toHaveBeenLastCalledWith(`[App] [DIAG] [test] ${JSON.stringify(payload)}`);
});

test('logging remains disabled when development and diagnostics are disabled', () => {
  const output = jest.spyOn(console, 'log').mockImplementation(() => {});
  const previous = global.__DEV__;
  global.__DEV__ = false;
  try {
    logDebug('test', {token: 'test-token'});
    logDiag('test', {token: 'test-token'});
    expect(output).not.toHaveBeenCalled();
  } finally {
    global.__DEV__ = previous;
  }
});
