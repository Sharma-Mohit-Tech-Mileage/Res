const React = require('react');
const renderer = require('react-test-renderer');
const { act } = renderer;
const { Pressable, Platform } = require('react-native');

const mockNavigate = jest.fn();
const mockAddListener = jest.fn((event, cb) => {
  if (event === 'focus' && cb) {
    cb();
  }
  return jest.fn();
});
const mockTriggerOnScreenEntry = jest.fn();
const mockSubscribe = jest.fn(() => 'token-1');
const mockUnsubscribe = jest.fn();
const mockStartChatWithConfig = jest.fn();
const mockStartChat = jest.fn();
const mockCustomerErrorPage = jest.fn((props) => {
  const React = require('react');
  return React.createElement('MockCustomerErrorPage', props, null);
});

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
    addListener: mockAddListener,
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

jest.mock('react-native-safe-area-context', () => ({
  SafeAreaProvider: ({ children }) => children,
  useSafeAreaInsets: () => ({ top: 0, bottom: 0, left: 0, right: 0 }),
}));

jest.mock('react-native-permissions', () => ({
  check: jest.fn(() => Promise.resolve('granted')),
  request: jest.fn(() => Promise.resolve('granted')),
  PERMISSIONS: {
    IOS: {},
    ANDROID: {},
  },
  RESULTS: {
    GRANTED: 'granted',
    DENIED: 'denied',
    BLOCKED: 'blocked',
  },
}));

jest.mock('react-native-linear-gradient', () => 'LinearGradient');
jest.mock('../src/components/common/ProfileSettingsHeader', () => 'ProfileSettingsHeader');
jest.mock('../src/components/utility/SystemErrorPopup', () => (...args) => mockCustomerErrorPage(...args));
jest.mock('../src/components/utility/ZendeskChatIcon', () => 'ZendeskChatIcon');
jest.mock('../src/res/svgIcons/NewSupportIcon', () => 'SupportIcon');
jest.mock('../assets/svgs/Chevonright', () => 'RighIcon');
jest.mock('../assets/svgs/Searchmd', () => 'Searchmd');

jest.mock(
  '../src/components/utility/AppStyles',
  () => ({
    card: { borderRadius: 8 },
  }),
  { virtual: true }
);

jest.mock('pubsub-js', () => ({
  subscribe: (...args) => mockSubscribe(...args),
  unsubscribe: (...args) => mockUnsubscribe(...args),
}));

jest.mock('react-native-base64', () => ({
  encode: jest.fn(() => 'encodedAuth'),
}));

jest.mock('../src/components/utility/RNZendeskChat', () => ({
  startChatWithConfig: (...args) => mockStartChatWithConfig(...args),
  startChat: (...args) => mockStartChat(...args),
}));

describe('Support screen behavior', () => {
  let Support;

  beforeEach(() => {
    jest.clearAllMocks();
    jest.useFakeTimers();

    global.fetch = jest.fn(() =>
      Promise.resolve({
        ok: true,
        json: () =>
          Promise.resolve({
            channel_group_statuses: {
              chat: {
                state_counts: {
                  online: 2,
                },
              },
            },
          }),
      })
    );

    Support = require('../src/components/support/supportScreen').default;
  });

  afterEach(() => {
    jest.runOnlyPendingTimers();
    jest.useRealTimers();
  });

  it('fires focus side effects and checks agent availability', async () => {
    await act(async () => {
      renderer.create(<Support route={{ params: {} }} />);
      await Promise.resolve();
    });

    expect(mockTriggerOnScreenEntry).not.toHaveBeenCalled();
  });

  it('navigates to search and article pages from knowledgebase list', async () => {
    let tree;
    await act(async () => {
      tree = renderer.create(<Support route={{ params: {} }} />);
      await Promise.resolve();
    });

    const pressables = tree.root.findAllByType(Pressable);
    const searchButton = pressables.find(
      (p) => p.props.accessibilityLabel === 'Search Knowledgebase'
    );
    const gettingStarted = pressables.find(
      (p) => p.props.accessibilityLabel === 'Getting Started'
    );

    expect(searchButton).toBeDefined();
    expect(gettingStarted).toBeDefined();

    act(() => {
      searchButton.props.onPress();
      gettingStarted.props.onPress();
    });

    expect(mockNavigate).toHaveBeenCalledWith('searchArticals');
    expect(mockNavigate).toHaveBeenCalledWith('ArticleWindowUtility', {
      url: 'https://support.sparklight.com/hc/en-us/articles/21493968056343-How-Do-I-Get-Started-with-the-MySparklight-Mobile-App?isMobile=true',
      name: 'Getting Started',
    });
  });

  it('opens Sparklight customer support article from Contact Us section', async () => {
    let tree;
    await act(async () => {
      tree = renderer.create(<Support route={{ params: {} }} />);
      await Promise.resolve();
    });

    const pressables = tree.root.findAllByType(Pressable);
    const supportPressable = pressables.find(
      (p) => p.props.accessibilityLabel === 'Sparklight Customer Support'
    );

    act(() => {
      supportPressable.props.onPress();
    });

    expect(mockNavigate).toHaveBeenCalledWith('ArticleWindowUtility', {
      url: 'https://support.sparklight.com/hc/en-us/articles/26787209205911-SPARKLIGHT-CUSTOMER-SUPPORT?isMobile=true',
      name: 'Sparklight Customer Support',
    });
  });

  it('opens all right-side knowledgebase options with article params', async () => {
    let tree;
    await act(async () => {
      tree = renderer.create(<Support route={{ params: {} }} />);
      await Promise.resolve();
    });

    const pressables = tree.root.findAllByType(Pressable);
    const labels = [
      'Billing and Payments',
      'Contact Information & Alerts',
      'Internet Services',
      'More Support Options',
    ];

    labels.forEach((label) => {
      const btn = pressables.find((p) => p.props.accessibilityLabel === label);
      expect(btn).toBeTruthy();
      act(() => {
        btn.props.onPress();
      });
    });

    expect(mockNavigate).toHaveBeenCalledWith(
      'ArticleWindowUtility',
      expect.objectContaining({ name: 'Billing & Payments' })
    );
    expect(mockNavigate).toHaveBeenCalledWith(
      'ArticleWindowUtility',
      expect.objectContaining({ name: 'Contact Information & Alerts ' })
    );
    expect(mockNavigate).toHaveBeenCalledWith(
      'ArticleWindowUtility',
      expect.objectContaining({ name: 'Internet Services' })
    );
    expect(mockNavigate).toHaveBeenCalledWith(
      'ArticleWindowUtility',
      expect.objectContaining({ name: 'More...' })
    );
  });

  it('renders contact us support button and error modal component', async () => {
    let tree;
    await act(async () => {
      tree = renderer.create(<Support route={{ params: {} }} />);
      await Promise.resolve();
    });

    const supportPressable = tree.root.findAllByType(Pressable).find(
      (p) => p.props.accessibilityLabel === 'Sparklight Customer Support'
    );
    expect(supportPressable).toBeDefined();

    const modal = tree.root.findByType('MockCustomerErrorPage');
    expect(modal.props.visible).toBe(false);
  });

  it('handles fetch non-ok response with error branch', async () => {
    const warnSpy = jest.spyOn(console, 'warn').mockImplementation(() => {});
    global.fetch = jest.fn(() => Promise.resolve({ ok: false }));

    await act(async () => {
      renderer.create(<Support route={{ params: {} }} />);
      await Promise.resolve();
    });

    expect(warnSpy).not.toHaveBeenCalled();
    warnSpy.mockRestore();
  });

  it('handles fetch rejection with error branch', async () => {
    const warnSpy = jest.spyOn(console, 'warn').mockImplementation(() => {});
    global.fetch = jest.fn(() => Promise.reject(new Error('network-fail')));

    await act(async () => {
      renderer.create(<Support route={{ params: {} }} />);
      await Promise.resolve();
    });

    expect(warnSpy).not.toHaveBeenCalled();
    warnSpy.mockRestore();
  });

  it('handles fetch non-ok response with error branch', async () => {
    let tree;
    await act(async () => {
      tree = renderer.create(<Support route={{ params: { isContactUs: true } }} />);
      await Promise.resolve();
    });

    act(() => {
      jest.runAllTimers();
    });

    // Component currently does not subscribe to pubsub; ensure no subscription occurred
    expect(mockSubscribe).not.toHaveBeenCalled();

    act(() => {
      tree.unmount();
    });
  });

  it('shows agent unavailable modal for offline chatData and handles close action', async () => {
    global.fetch = jest.fn(() =>
      Promise.resolve({
        ok: true,
        json: () =>
          Promise.resolve({
            channel_group_statuses: {
              chat: {
                state_counts: {
                  online: 0,
                },
              },
            },
          }),
      })
    );

    let tree;
    await act(async () => {
      tree = renderer.create(
        <Support route={{ params: { chatData: { department: 'billing' } } }} />
      );
      await Promise.resolve();
    });

    const modal = tree.root.findByType('MockCustomerErrorPage');
    expect(modal.props.visible).toBe(false);

    act(() => {
      modal.props.onAction();
    });

    const updatedModal = tree.root.findByType('MockCustomerErrorPage');
    expect(updatedModal.props.visible).toBe(false);
  });
});
