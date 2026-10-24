const React = require('react');
const renderer = require('react-test-renderer');
const { act } = renderer;

const mockWebViewMethods = { stopLoading: jest.fn(), injectJavaScript: jest.fn(), reload: jest.fn() };

jest.mock('react-native-webview', () => {
  const R = require('react');
  const WebView = R.forwardRef((props, ref) => {
    R.useImperativeHandle(ref, () => mockWebViewMethods);
    return R.createElement('WebView', props);
  });
  return { __esModule: true, default: WebView, WebView };
});
jest.mock('react-native-config', () => ({ PORTAL_BASE_URL: 'https://customer.uat.sparklight.com' }));
jest.mock('react-native-safe-area-context', () => ({ useSafeAreaInsets: () => ({ top: 0, bottom: 0, left: 0, right: 0 }) }));
jest.mock('react-redux', () => ({
  useSelector: (select) => select({ user: { userData: { token: 't' } }, profile: { accountDetails: {} } }),
  useDispatch: () => jest.fn(),
}));
jest.mock('../src/redux/actions/ProfileActionSuite', () => ({ fetchACPUserAccountDetails: jest.fn(), fetchEasyPayStatus: jest.fn() }));
jest.mock('../src/components/user/Session', () => ({ RefreshToken: jest.fn() }));
jest.mock('../src/components/utility/PDFViewModal', () => 'PDFViewModal');
jest.mock('../src/navigations/UserNavigations', () => ({ navigationRef: { current: null } }));
jest.mock('../src/components/common/customui/LoadingOverlay', () => 'LoadingOverlay');
jest.mock('../src/components/utility/LoadingSpinner', () => 'LoadingSpinner');
jest.mock('../src/components/common/ProfileSettingsHeader', () => 'ProfileSettingsHeader');
jest.mock('../src/redux/utils/LocalStorage', () => ({ getUser: jest.fn(async () => null) }));
jest.mock('@react-native-community/netinfo', () => ({ addEventListener: () => () => {}, fetch: async () => ({ isConnected: true }) }));
jest.mock('../src/components/utility/NativeCookieManager', () => ({ setAuthCookiesOnAllDomains: jest.fn(), clearAuthCookies: jest.fn() }));
jest.mock('../src/utils/logger', () => ({ logError: jest.fn() }));
jest.mock('../src/components/utility/constant', () => ({ getPrimaryEmail: () => '' }));
jest.mock('@react-native-firebase/analytics', () => ({ getAnalytics: () => ({}), logEvent: () => Promise.resolve() }));
jest.mock('../src/navigations/tabBarHeight', () => ({ calculateTabBarHeight: () => 0 }));

const ArticleWindowUtility = require('../src/components/utility/ArticleWindowUtility').default;

const MICROSITE = 'https://sparklight.flexipay.example.com/plan';
const QUICK_PAY = 'https://sparklight.flexipay.example.com/quick-pay?amount=214.23';

let tree;
const render = async () => {
  const navigation = {
    replace: jest.fn(), goBack: jest.fn(), navigate: jest.fn(), addListener: () => () => {},
    getState: () => ({ routeNames: ['MakePayment'] }),
  };
  await act(async () => {
    tree = renderer.create(<ArticleWindowUtility navigation={navigation} route={{ params: { name: 'Payment Plan', url: MICROSITE, quickPayToNative: true } }} />);
  });
  return { navigation, webView: () => tree.root.findByType('WebView') };
};

beforeEach(() => {
  jest.useFakeTimers();
  Object.values(mockWebViewMethods).forEach((fn) => fn.mockClear());
});
afterEach(() => {
  act(() => tree?.unmount());
  jest.useRealTimers();
});

describe('56336 FlexiPay Quick-Pay leaves only after the microsite is blanked', () => {
  it('blanks the page and opens Make a Payment once about:blank has loaded', async () => {
    const { navigation, webView } = await render();
    let allowed;
    act(() => { allowed = webView().props.onShouldStartLoadWithRequest({ url: QUICK_PAY, isTopFrame: true }); });
    expect(allowed).toBe(false);
    expect(navigation.replace).not.toHaveBeenCalled();
    expect(webView().props.importantForAccessibility).toBe('no-hide-descendants');

    act(() => { jest.advanceTimersByTime(300); });
    expect(mockWebViewMethods.stopLoading).toHaveBeenCalled();
    expect(mockWebViewMethods.injectJavaScript).toHaveBeenCalledWith(expect.stringContaining("location.replace('about:blank')"));
    expect(webView().props.onShouldStartLoadWithRequest({ url: 'about:blank' })).toBe(true);
    expect(webView().props.onShouldStartLoadWithRequest({ url: MICROSITE, isTopFrame: true })).toBe(false);
    expect(navigation.replace).not.toHaveBeenCalled();

    await act(async () => { await webView().props.onLoadEnd({ nativeEvent: { url: 'about:blank' } }); });
    expect(navigation.replace).toHaveBeenCalledTimes(1);
    expect(navigation.replace).toHaveBeenCalledWith('MakePayment', { prefillAmount: expect.anything() });

    act(() => { jest.advanceTimersByTime(2000); });
    expect(navigation.replace).toHaveBeenCalledTimes(1);
  });

  it('still opens Make a Payment if about:blank never reports loaded', async () => {
    const { navigation, webView } = await render();
    act(() => { webView().props.onShouldStartLoadWithRequest({ url: QUICK_PAY, isTopFrame: true }); });
    act(() => { jest.advanceTimersByTime(1799); });
    expect(navigation.replace).not.toHaveBeenCalled();
    act(() => { jest.advanceTimersByTime(1); });
    expect(navigation.replace).toHaveBeenCalledTimes(1);
  });

  it('does not navigate if the screen is closed while blanking', async () => {
    const { navigation, webView } = await render();
    act(() => { webView().props.onShouldStartLoadWithRequest({ url: QUICK_PAY, isTopFrame: true }); });
    act(() => tree.unmount());
    tree = null;
    act(() => { jest.advanceTimersByTime(2000); });
    expect(navigation.replace).not.toHaveBeenCalled();
  });
});
