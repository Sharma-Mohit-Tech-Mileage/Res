const mockSetItem = jest.fn().mockResolvedValue(undefined);
const mockGetItem = jest.fn();
const mockGetAllKeys = jest.fn();
const mockMultiRemove = jest.fn().mockResolvedValue(undefined);

jest.mock('@react-native-async-storage/async-storage', () => ({
  setItem: (...args) => mockSetItem(...args),
  getItem: (...args) => mockGetItem(...args),
  getAllKeys: (...args) => mockGetAllKeys(...args),
  multiRemove: (...args) => mockMultiRemove(...args),
}));

import {
  cleanUserData,
  getPushNotificationStatus,
  getSsoToken,
  getUpgradeToken,
  getUser,
  storePushNotificationStatus,
  storeSsoToken,
  storeUpgradeToken,
  storeUser,
} from '../../../src/redux/utils/LocalStorage';

describe('LocalStorage utils', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('stores and gets user', async () => {
    const user = { userInfo: { userName: 'john' } };
    await storeUser(user);
    expect(mockSetItem).toHaveBeenCalledWith('busi_user', JSON.stringify(user));

    mockGetItem.mockResolvedValueOnce(JSON.stringify(user));
    await expect(getUser()).resolves.toEqual(user);
  });

  it('stores and gets sso token', async () => {
    await storeSsoToken('tok');
    expect(mockSetItem).toHaveBeenCalledWith('idToken', JSON.stringify('tok'));

    mockGetItem.mockResolvedValueOnce(JSON.stringify('tok'));
    await expect(getSsoToken()).resolves.toBe('tok');
  });

  it('stores and gets upgrade token', async () => {
    await storeUpgradeToken('up');
    expect(mockSetItem).toHaveBeenCalledWith('upgradeToken', JSON.stringify('up'));

    mockGetItem.mockResolvedValueOnce(JSON.stringify('up'));
    await expect(getUpgradeToken()).resolves.toBe('up');
  });

  it('stores and gets push notification status with user-specific key', async () => {
    mockGetItem.mockResolvedValueOnce(JSON.stringify({ userInfo: { userName: 'john' } }));
    await storePushNotificationStatus(true);
    expect(mockSetItem).toHaveBeenCalledWith('pushNotificationStatus_john', JSON.stringify(true));

    mockGetItem
      .mockResolvedValueOnce(JSON.stringify({ userInfo: { userName: 'john' } }))
      .mockResolvedValueOnce(JSON.stringify(false));

    await expect(getPushNotificationStatus()).resolves.toBe(false);
    expect(mockGetItem).toHaveBeenLastCalledWith('pushNotificationStatus_john');
  });

  it('cleans user data while preserving allowed keys', async () => {
    mockGetAllKeys.mockResolvedValueOnce([
      'busi_user',
      'idToken',
      'upgradeToken',
      'pushNotificationStatus_john',
      'FEATURE_ANNOUNCEMENTS_STATE',
      'LAST_APP_VERSION',
    ]);

    await cleanUserData();

    expect(mockMultiRemove).toHaveBeenCalledWith(['busi_user', 'idToken', 'upgradeToken']);
  });
});
