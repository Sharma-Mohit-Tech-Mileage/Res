jest.mock('react-native-app-auth', () => ({
  authorize: jest.fn(), refresh: jest.fn(), logout: jest.fn(),
}));
jest.mock('../src/utils/logger', () => ({
  logDebug: jest.fn(), logWarn: jest.fn(), logError: jest.fn(),
}));

import AuthenticationManager from '../src/utils/AuthenticationManager';

describe('authentication error classification', () => {
  test.each([
    { code: 'AUTH_TIMEOUT' },
    { code: 'request_timeout', message: 'Authorization failed' },
    { code: 'authentication_failed', message: 'java.net.SocketTimeoutException: timeout' },
    { message: 'Connection timed out' },
    {
      code: 'service_configuration_fetch_error',
      message: 'Network error',
      userInfo: { nativeError: 'timeout' },
    },
    {
      code: 'token_exchange_failed',
      message: 'Unable to complete token exchange request',
      userInfo: { nativeError: 'Read timed out' },
    },
    {
      code: 'authentication_error',
      message: 'Authorization failed',
      userInfo: { nativeError: 'java.net.SocketTimeoutException' },
    },
  ])('routes timeout %j to the timeout dialog', error => {
    expect(AuthenticationManager.handleAuthError(error).code).toBe('AUTH_TIMEOUT');
  });

  test('preserves user cancellation', () => {
    expect(AuthenticationManager.handleAuthError({ code: 'user_cancelled' }).code)
      .toBe('USER_CANCELLED');
  });

  test('preserves unrelated authentication failures', () => {
    expect(AuthenticationManager.handleAuthError(new Error('Invalid credentials')).code)
      .toBe('AUTH_FAILED');
  });

  test('does not classify every native connection failure as a timeout', () => {
    expect(AuthenticationManager.handleAuthError({
      code: 'token_exchange_failed',
      message: 'Unable to complete token exchange request',
      userInfo: { nativeError: 'Connection refused' },
    }).code).toBe('AUTH_FAILED');
  });
});
