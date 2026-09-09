// Manual mock: the real v22 package ships ESM and is not transformed by Jest.
const unsubscribe = jest.fn();
const instance = {};

module.exports = {
  __esModule: true,
  default: jest.fn(() => instance),
  getMessaging: jest.fn(() => instance),
  getToken: jest.fn(() => Promise.resolve('test-fcm-token')),
  deleteToken: jest.fn(() => Promise.resolve()),
  onTokenRefresh: jest.fn(() => unsubscribe),
  onMessage: jest.fn(() => unsubscribe),
  onNotificationOpenedApp: jest.fn(() => unsubscribe),
  getInitialNotification: jest.fn(() => Promise.resolve(null)),
  hasPermission: jest.fn(() => Promise.resolve(1)),
  requestPermission: jest.fn(() => Promise.resolve(1)),
  setBackgroundMessageHandler: jest.fn(),
  AuthorizationStatus: { NOT_DETERMINED: -1, DENIED: 0, AUTHORIZED: 1, PROVISIONAL: 2 },
};
