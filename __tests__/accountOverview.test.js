const React = require('react');
const renderer = require('react-test-renderer');
const { act } = renderer;
const { Pressable, Alert, Platform } = require('react-native');

const mockNavigate = jest.fn();
const mockReset = jest.fn();
const mockTriggerOnScreenEntry = jest.fn();
const mockDispatch = jest.fn();

const mockSelectorState = {
  profile: {
    profileDetails: {
      firstName: 'john',
      lastName: 'doe',
    },
  },
};

const mockGetUser = jest.fn();
const mockGetSsoToken = jest.fn(() => Promise.resolve({ idToken: 'id-token' }));
const mockLogoutZendesk = jest.fn();
const mockLogout = jest.fn(() => Promise.resolve({}));
const mockSetUserId = jest.fn();
const mockSetUserProperty = jest.fn(() => Promise.resolve());

jest.mock('../src/components/common/customui/Touchable', () => {
  const React = require('react');
  const { Pressable } = require('react-native');
  return function MockTouchable(props) {
    return React.createElement(Pressable, props, props.children);
  };
});

jest.mock('@react-navigation/native', () => ({
  useNavigation: () => ({
    navigate: mockNavigate,
    reset: mockReset,
  }),
  useFocusEffect: (cb) => {
    const React = require('react');
    React.useEffect(() => cb(), []);
  },
}));

jest.mock('../src/hooks/useAnnouncement', () => ({
  useAnnouncement: () => ({
    triggerOnScreenEntry: mockTriggerOnScreenEntry,
  }),
}));

jest.mock('react-redux', () => ({
  useDispatch: () => mockDispatch,
  useSelector: (fn) => fn(mockSelectorState),
}));

jest.mock('../src/redux/utils/LocalStorage', () => ({
  getUser: () => mockGetUser(),
  getSsoToken: () => mockGetSsoToken(),
  cleanUserData: jest.fn(),
  storeSsoToken: jest.fn(),
  storeUser: jest.fn(),
}));

jest.mock('../src/redux/actions/ProfileActionSuite', () => ({
  fetchProfileDetails: jest.fn(() => ({ type: 'FETCH_PROFILE_DETAILS' })),
}));

jest.mock('../src/redux/actions/UserAction', () => ({
  saveUserInfo: jest.fn((payload) => ({ type: 'SAVE_USER_INFO', payload })),
  logoutApp: jest.fn(() => ({ type: 'LOGOUT_APP' })),
}));

jest.mock('react-native-app-auth', () => ({
  logout: (...args) => mockLogout(...args),
}));

jest.mock('@react-native-firebase/analytics', () => {
  const analyticsFn = () => ({
    setUserId: (...args) => mockSetUserId(...args),
    setUserProperty: (...args) => mockSetUserProperty(...args),
  });
  return analyticsFn;
});

jest.mock('react-native-linear-gradient', () => 'LinearGradient');
jest.mock('react-native-config', () => ({
  SSO_LOGIN: 'https://sso.example.com',
  SSO_REDIRECT_URL_IOS: 'sparklight://ios',
  SSO_REDIRECT_URL_ANDROID: 'sparklight://android',
}));
jest.mock('react-native-version-check', () => ({
  getCurrentVersion: jest.fn(() => '25.7.0'),
}));
jest.mock('moment', () => () => ({ year: () => 2026 }));

jest.mock('../src/components/common/ProfileSettingsHeader', () => 'ProfileSettingsHeader');
jest.mock('../src/components/utility/ZendeskChatIcon', () => 'ZendeskChatIcon');
jest.mock('../src/components/utility/AppStyles', () => ({ card: { borderRadius: 8 } }), { virtual: true });
jest.mock('../src/res/svgIcons/UserIconWhite', () => 'UserIconWhite');
jest.mock('../assets/svgs/Rightactionable15', () => {
  const React = require('react');
  return function ProfileSettingsIcon() {
    return React.createElement('ProfileSettingsIcon', null, null);
  };
});
jest.mock('../assets/svgs/Rightactionable16', () => 'PasswordSecurityIcon');
jest.mock('../assets/svgs/Rightactinable17', () => 'NotificationsIcon');
jest.mock('../assets/svgs/Rightactionable18', () => 'UserManagementIcon');
jest.mock('../assets/svgs/Messagealertcircle', () => 'Feedbackicon');
jest.mock('../assets/svgs/Chevonright', () => 'RightIcon');
jest.mock('react-native-responsive-screen', () => ({ widthPercentageToDP: () => 100 }));
jest.mock('../src/components/utility/RNZendeskChat', () => ({ logoutZendesk: () => mockLogoutZendesk() }));
jest.mock('../src/components/utility/NativeCookieManager', () => ({ clearAuthCookies: jest.fn() }));

const flushPromises = () => Promise.resolve().then(() => Promise.resolve());

describe('AccountOverview behavior', () => {
  let AccountOverview;

  beforeEach(() => {
    jest.useRealTimers();
    jest.clearAllMocks();
    mockSetUserProperty.mockResolvedValue(undefined);
    mockGetUser.mockResolvedValue({
      userInfo: {
        accountNumber: '1234567890123',
      },
    });

    AccountOverview = require('../src/components/account/AccountOverview').default;
  });

  it('loads full menu and navigates to User Management for standard account number', async () => {
    let tree;
    await act(async () => {
      tree = renderer.create(<AccountOverview />);
      await flushPromises();
    });

    expect(mockTriggerOnScreenEntry).toHaveBeenCalledWith('AccountStackScreen');

    const buttons = tree.root.findAllByType(Pressable);
    const userMgmt = buttons.find((b) => b.props.accessibilityLabel === 'User Management');

    act(() => {
      userMgmt.props.onPress();
    });

    expect(mockNavigate).toHaveBeenCalledWith('UserManagement');
  });

  it('hides User Management for 16+ digit account numbers', async () => {
    mockGetUser.mockResolvedValue({
      userInfo: {
        accountNumber: '1234567890123456',
      },
    });

    let tree;
    await act(async () => {
      tree = renderer.create(<AccountOverview />);
      await flushPromises();
    });

    const buttons = tree.root.findAllByType(Pressable);
    const userMgmt = buttons.find((b) => b.props.accessibilityLabel === 'User Management');

    expect(userMgmt).toBeUndefined();
  });

  it('navigates all menuItems1 entries for 16+ digit accounts', async () => {
    mockGetUser.mockResolvedValue({
      userInfo: {
        accountNumber: '1234567890123456',
      },
    });

    let tree;
    await act(async () => {
      tree = renderer.create(<AccountOverview />);
      await flushPromises();
    });

    const buttons = tree.root.findAllByType(Pressable);
    const profileBtn = buttons.find((b) => b.props.accessibilityLabel === 'Profile');
    const passwordBtn = buttons.find((b) => b.props.accessibilityLabel === 'Password & Security');
    const notificationsBtn = buttons.find((b) => b.props.accessibilityLabel === 'Notifications');
    const feedbackBtn = buttons.find((b) => b.props.accessibilityLabel === 'App Feedback');

    act(() => {
      profileBtn.props.onPress();
      passwordBtn.props.onPress();
      notificationsBtn.props.onPress();
      feedbackBtn.props.onPress();
    });

    expect(mockNavigate).toHaveBeenCalledWith('ProfileSettings');
    expect(mockNavigate).toHaveBeenCalledWith('PasswordSecurity');
    expect(mockNavigate).toHaveBeenCalledWith('Notifications');
    expect(mockNavigate).toHaveBeenCalledWith('Feedback');
  });

  it('opens logout confirmation when logout is pressed', async () => {
    const alertSpy = jest.spyOn(Alert, 'alert').mockImplementation(() => {});

    let tree;
    await act(async () => {
      tree = renderer.create(<AccountOverview />);
      await flushPromises();
    });

    const buttons = tree.root.findAllByType(Pressable);
    const logoutButton = buttons.find((b) => b.props.accessibilityLabel === 'Logout');

    act(() => {
      logoutButton.props.onPress();
    });

    expect(alertSpy).toHaveBeenCalled();
    expect(alertSpy.mock.calls[0][0]).toBe('Confirm Logout');
    alertSpy.mockRestore();
  });

  it('navigates to profile-related menus and policy links', async () => {
    let tree;
    await act(async () => {
      tree = renderer.create(<AccountOverview />);
      await flushPromises();
    });

    const buttons = tree.root.findAllByType(Pressable);
    const profileBtn = buttons.find((b) => b.props.accessibilityLabel === 'Profile');
    const passwordBtn = buttons.find((b) => b.props.accessibilityLabel === 'Password & Security');
    const notificationsBtn = buttons.find((b) => b.props.accessibilityLabel === 'Notifications');

    const linkButtons = buttons.filter((b) => b.props.accessibilityRole === 'link');
    const privacyBtn = linkButtons[0];
    const termsBtn = linkButtons[1];
    const releaseBtn = linkButtons[2];

    act(() => {
      profileBtn.props.onPress();
      passwordBtn.props.onPress();
      notificationsBtn.props.onPress();
      privacyBtn.props.onPress();
      termsBtn.props.onPress();
      releaseBtn.props.onPress();
    });

    expect(mockNavigate).toHaveBeenCalledWith('ProfileSettings');
    expect(mockNavigate).toHaveBeenCalledWith('PasswordSecurity');
    expect(mockNavigate).toHaveBeenCalledWith('Notifications');
    expect(mockNavigate).toHaveBeenCalledWith('ArticleWindowUtility', {
      url: 'https://www.sparklight.com/legal/mobile-app-privacy-policy',
      name: 'Privacy Policy',
    });
    expect(mockNavigate).toHaveBeenCalledWith('ArticleWindowUtility', {
      url: 'https://www.sparklight.com/legal/mobile-app-terms-and-conditions?isMobile=true',
      name: 'Terms & Conditions',
    });
    expect(mockNavigate).toHaveBeenCalledWith('ArticleWindowUtility', {
      url: 'https://support.sparklight.com/hc/en-us/articles/30080605597079-MySparklight-App-Release-Notes?isMobile=true',
      name: 'App Release Notes',
    });
  });

  it('executes logout action when OK is pressed in confirmation', async () => {
    const alertSpy = jest.spyOn(Alert, 'alert').mockImplementation((title, msg, buttons) => {
      const okAction = buttons.find((b) => b.text === 'OK');
      okAction.onPress();
    });

    let tree;
    await act(async () => {
      tree = renderer.create(<AccountOverview />);
      await flushPromises();
    });

    const buttons = tree.root.findAllByType(Pressable);
    const logoutButton = buttons.find((b) => b.props.accessibilityLabel === 'Logout');

    await act(async () => {
      logoutButton.props.onPress();
      await flushPromises();
    });

    expect(mockGetSsoToken).toHaveBeenCalled();
    expect(mockLogout).toHaveBeenCalled();
    expect(mockReset).toHaveBeenCalledWith({
      index: 0,
      routes: [{ name: 'Splash', params: { isLogout: true } }],
    });
    expect(mockLogoutZendesk).toHaveBeenCalled();
    alertSpy.mockRestore();
  });

  it('navigates to app feedback action', async () => {
    let tree;
    await act(async () => {
      tree = renderer.create(<AccountOverview />);
      await flushPromises();
    });

    const buttons = tree.root.findAllByType(Pressable);
    const feedbackBtn = buttons.find((b) => b.props.accessibilityLabel === 'App Feedback');

    act(() => {
      feedbackBtn.props.onPress();
    });

    expect(mockNavigate).toHaveBeenCalledWith('Feedback');
  });

  it('does not execute logout action when Cancel is pressed', async () => {
    const alertSpy = jest.spyOn(Alert, 'alert').mockImplementation((title, msg, buttons) => {
      const cancelAction = buttons.find((b) => b.text === 'Cancel');
      cancelAction.onPress();
    });

    let tree;
    await act(async () => {
      tree = renderer.create(<AccountOverview />);
      await flushPromises();
    });

    const buttons = tree.root.findAllByType(Pressable);
    const logoutButton = buttons.find((b) => b.props.accessibilityLabel === 'Logout');

    act(() => {
      logoutButton.props.onPress();
    });

    expect(mockGetSsoToken).not.toHaveBeenCalled();
    expect(mockLogout).not.toHaveBeenCalled();
    alertSpy.mockRestore();
  });

  it('renders fallback profile label format when names are missing', async () => {
    mockSelectorState.profile.profileDetails = {
      firstName: undefined,
      lastName: undefined,
    };

    let tree;
    await act(async () => {
      tree = renderer.create(<AccountOverview />);
      await flushPromises();
    });

    const labels = tree.root.findAllByType(Pressable);
    expect(labels.length).toBeGreaterThan(0);
  });

  it('uses selector fallbacks when profile object is missing', async () => {
    mockSelectorState.profile = undefined;

    let tree;
    await act(async () => {
      tree = renderer.create(<AccountOverview />);
      await flushPromises();
    });

    const labels = tree.root.findAllByType(Pressable);
    expect(labels.length).toBeGreaterThan(0);

    mockSelectorState.profile = {
      profileDetails: {
        firstName: 'john',
        lastName: 'doe',
      },
    };
  });

  it('handles analytics cleanup error during logout without blocking reset', async () => {
    const warnSpy = jest.spyOn(console, 'warn').mockImplementation(() => {});
    mockSetUserProperty.mockRejectedValueOnce(new Error('analytics failed'));

    const alertSpy = jest.spyOn(Alert, 'alert').mockImplementation((title, msg, buttons) => {
      const okAction = buttons.find((b) => b.text === 'OK');
      okAction.onPress();
    });

    let tree;
    await act(async () => {
      tree = renderer.create(<AccountOverview />);
      await flushPromises();
    });

    const buttons = tree.root.findAllByType(Pressable);
    const logoutButton = buttons.find((b) => b.props.accessibilityLabel === 'Logout');

    await act(async () => {
      logoutButton.props.onPress();
      await flushPromises();
    });

    expect(warnSpy).toHaveBeenCalled();
    expect(mockReset).toHaveBeenCalled();
    alertSpy.mockRestore();
    warnSpy.mockRestore();
  });

  it('uses android logout redirect URL when platform is android', async () => {
    const restoreOs = jest.replaceProperty(Platform, 'OS', 'android');
    const alertSpy = jest.spyOn(Alert, 'alert').mockImplementation((title, msg, buttons) => {
      const okAction = buttons.find((b) => b.text === 'OK');
      okAction.onPress();
    });

    let tree;
    await act(async () => {
      tree = renderer.create(<AccountOverview />);
      await flushPromises();
    });

    const buttons = tree.root.findAllByType(Pressable);
    const logoutButton = buttons.find((b) => b.props.accessibilityLabel === 'Logout');

    await act(async () => {
      logoutButton.props.onPress();
      await flushPromises();
    });

    expect(mockLogout).toHaveBeenCalledWith(
      expect.any(Object),
      expect.objectContaining({ postLogoutRedirectUrl: 'sparklight://android' })
    );

    alertSpy.mockRestore();
    restoreOs.restore();
  });
});
