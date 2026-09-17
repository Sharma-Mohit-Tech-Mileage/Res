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
});
