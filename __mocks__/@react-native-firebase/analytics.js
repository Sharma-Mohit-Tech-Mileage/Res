// Manual mock: the real v22 package ships ESM and is not transformed by Jest.
const instance = {
  logEvent: jest.fn(() => Promise.resolve()),
  setUserId: jest.fn(() => Promise.resolve()),
  setUserProperty: jest.fn(() => Promise.resolve()),
  setAnalyticsCollectionEnabled: jest.fn(() => Promise.resolve()),
  resetAnalyticsData: jest.fn(() => Promise.resolve()),
};

const getAnalytics = jest.fn(() => instance);
const logEvent = jest.fn(() => Promise.resolve());
const setUserId = jest.fn(() => Promise.resolve());
const setUserProperty = jest.fn(() => Promise.resolve());
const setAnalyticsCollectionEnabled = jest.fn(() => Promise.resolve());
const resetAnalyticsData = jest.fn(() => Promise.resolve());
const firebase = { app: jest.fn(() => ({ analytics: () => instance })) };

// Legacy default export is still used by RNZendeskChat.js.
const analytics = jest.fn(() => instance);
analytics.getAnalytics = getAnalytics;

module.exports = {
  __esModule: true,
  default: analytics,
  getAnalytics,
  logEvent,
  setUserId,
  setUserProperty,
  setAnalyticsCollectionEnabled,
  resetAnalyticsData,
  firebase,
};
