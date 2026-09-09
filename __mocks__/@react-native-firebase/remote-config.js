// Manual mock: the real v22 package ships ESM and is not transformed by Jest.
const instance = { lastFetchStatus: 'success' };

module.exports = {
  __esModule: true,
  default: jest.fn(() => instance),
  getRemoteConfig: jest.fn(() => instance),
  setDefaults: jest.fn(() => Promise.resolve()),
  setConfigSettings: jest.fn(() => Promise.resolve()),
  fetch: jest.fn(() => Promise.resolve()),
  fetchAndActivate: jest.fn(() => Promise.resolve(true)),
  activate: jest.fn(() => Promise.resolve(true)),
  getValue: jest.fn(() => ({
    asString: () => '',
    asBoolean: () => false,
    asNumber: () => 0,
    getSource: () => 'default',
  })),
  getAll: jest.fn(() => ({})),
};
