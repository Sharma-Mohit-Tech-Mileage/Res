const React = require('react');
const renderer = require('react-test-renderer');
const { act } = renderer;

const mockTrackApiError = jest.fn();
const mockWebViewMounts = { count: 0 };

jest.mock('@react-native-async-storage/async-storage', () => require('@react-native-async-storage/async-storage/jest/async-storage-mock'));
jest.mock('react-native-config', () => ({ ORBIPAY_DEFAULT_HOST: 'app' }));
jest.mock('react-native-webview', () => {
  const R = require('react');
  const WebView = (props) => {
    R.useEffect(() => {
      mockWebViewMounts.count += 1;
    }, []);
    return R.createElement('WebView', props);
  };
  return { WebView };
});
jest.mock('react-native-safe-area-context', () => ({ useSafeAreaInsets: () => ({ top: 0, bottom: 0, left: 0, right: 0 }) }));
jest.mock('react-redux', () => ({ useSelector: (select) => select({ profile: { accountDetails: {} }, user: { userData: { userInfo: { accountNumber: '8160370520067998' } } } }) }));
jest.mock('../src/contexts/Featureflagscontext', () => ({ useFeatureFlag: (_key, fallback) => fallback }));
jest.mock('../src/network/apis/account/paymentMethods.service', () => ({
  confirmBankToken: jest.fn(),
  confirmPaymentToken: jest.fn(),
  updateFundingAccount: jest.fn(),
  paymentErrorMessage: () => 'error',
}));
jest.mock('../src/components/billing/payments/paymentAnalytics', () => ({
  usePaymentStep: () => {},
  trackApiError: (...args) => mockTrackApiError(...args),
  errorStatus: () => 0,
  trackPaymentSubmitted: () => {},
  trackPaymentSuccess: () => {},
  trackPaymentFailed: () => {},
  trackPaymentMethodAdded: () => {},
  trackPaymentMethodFailed: () => {},
}));
jest.mock('../src/components/utility/constant', () => ({ getPrimaryEmail: () => '' }));
jest.mock('../src/utils/a11y', () => ({ announceA11y: () => {} }));
jest.mock('../src/components/common/ProfileSettingsHeader', () => 'ProfileSettingsHeader');
jest.mock('../src/components/common/customui/NotificationAlert', () => 'NotificationAlert');
jest.mock('../src/components/common/customui/SmallLoader', () => 'SmallLoader');
jest.mock('../src/components/common/customui/PrimaryButton', () => 'PrimaryButton');

const OrbipayWidgetScreen = require('../src/components/billing/payments/OrbipayWidgetScreen').default;

let mounted;
const render = async () => {
  let tree;
  const navigation = { goBack: jest.fn(), navigate: jest.fn(), replace: jest.fn(), isFocused: () => true, getState: () => ({ routes: [], index: 0 }) };
  await act(async () => {
    tree = renderer.create(<OrbipayWidgetScreen navigation={navigation} route={{ params: { mode: 'pay', amount: 339.5 } }} />);
  });
  // The form mounts after the first layout pass.
  const body = tree.root.find((n) => typeof n.props.onLayout === 'function');
  await act(async () => body.props.onLayout({ nativeEvent: { layout: { height: 800 } } }));
  mounted = tree;
  return tree;
};

describe('OrbipayWidgetScreen renderer loss (56336)', () => {
  beforeEach(() => {
    mockWebViewMounts.count = 0;
    mockTrackApiError.mockClear();
  });
  afterEach(() => act(() => mounted?.unmount()));

  it('remounts the payment form on a fresh WebView when the Android renderer dies', async () => {
    const tree = await render();
    expect(mockWebViewMounts.count).toBe(1);

    await act(async () => tree.root.findByType('WebView').props.onRenderProcessGone({ nativeEvent: { didCrash: true } }));

    expect(mockWebViewMounts.count).toBe(2);
    expect(mockTrackApiError).toHaveBeenCalledWith('orbipay-widget', 'renderer_gone', 'orbipay_widget');
  });

  it('remounts on an iOS content-process termination too', async () => {
    const tree = await render();
    await act(async () => tree.root.findByType('WebView').props.onContentProcessDidTerminate());
    expect(mockWebViewMounts.count).toBe(2);
  });
});
