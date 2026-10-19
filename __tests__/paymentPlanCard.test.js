const React = require('react');
const renderer = require('react-test-renderer');
const { act } = renderer;

const mockPostApiRequest = jest.fn();
const mockGetUser = jest.fn();

jest.mock('../src/redux/utils/LocalStorage', () => ({ getUser: (...a) => mockGetUser(...a) }));
jest.mock('../src/network/RestApiClient', () => ({ PostApiRequest: (...a) => mockPostApiRequest(...a) }));
jest.mock('../src/network/apis/endpoints/Endpoints', () => ({
  ENDPOINTS: { PAYMENT_FLEXIBLE_PLAN: 'api/Payment/GetFlexiblePaymentPlan' },
  getEndpoint: (e) => e,
}));
jest.mock('react-native-skeleton-placeholder', () => 'SkeletonPlaceholder');
jest.mock('../src/res/svgIcons/PaymentPlanIcon', () => 'PaymentPlanIcon');
jest.mock('../assets/svgs/Chevonright', () => 'RightIcon');
jest.mock('../src/components/common/customui/Touchable', () => {
  const { TouchableOpacity } = require('react-native');
  return TouchableOpacity;
});

const flush = () => new Promise((r) => setTimeout(r, 0));

describe('PaymentPlanCard', () => {
  const navigation = { navigate: jest.fn() };
  let PaymentPlanCard;
  let getPaymentPlanInfo;

  beforeEach(() => {
    jest.clearAllMocks();
    mockGetUser.mockResolvedValue({ userInfo: { accountNumber: '8160210010006710' } });
    PaymentPlanCard = require('../src/components/common/billerCards/PaymentPlanCard').default;
    getPaymentPlanInfo = require('../src/utils/paymentPlan').getPaymentPlanInfo;
  });

  const mount = async () => {
    let tree;
    await act(async () => {
      tree = renderer.create(<PaymentPlanCard navigation={navigation} />);
      await flush();
    });
    return tree;
  };
  const tap = async (tree) => {
    await act(async () => {
      tree.root.findByProps({ accessibilityRole: 'link' }).props.onPress();
      await flush();
    });
  };

  it('fetches the link on load with the account number and opens it instantly on tap', async () => {
    mockPostApiRequest.mockImplementation((endpoint, body, onSuccess) => onSuccess({ url: 'https://plan', tokenId: 't' }));
    const tree = await mount();
    expect(mockPostApiRequest).toHaveBeenCalledTimes(1);
    expect(mockPostApiRequest.mock.calls[0][0]).toBe('api/Payment/GetFlexiblePaymentPlan');
    expect(mockPostApiRequest.mock.calls[0][1]).toMatchObject({ sub: '8160210010006710', lang: 'en' });
    expect(navigation.navigate).not.toHaveBeenCalled();
    await tap(tree);
    expect(mockPostApiRequest).toHaveBeenCalledTimes(1);
    expect(navigation.navigate).toHaveBeenCalledWith('ArticleWindowUtility', { name: 'Payment Plan', url: 'https://plan', quickPayToNative: true });
  });

  it('shows a skeleton until the prefetch settles', async () => {
    let finish;
    mockPostApiRequest.mockImplementation((endpoint, body, onSuccess) => { finish = onSuccess; });
    const tree = await mount();
    expect(tree.root.findAllByType('SkeletonPlaceholder')).toHaveLength(1);
    expect(tree.root.findAllByProps({ accessibilityRole: 'link' })).toHaveLength(0);
    await act(async () => { finish({ url: 'https://plan' }); await flush(); });
    expect(tree.root.findAllByType('SkeletonPlaceholder')).toHaveLength(0);
    expect(tree.root.findAllByProps({ accessibilityRole: 'link' }).length).toBeGreaterThan(0);
  });

  it('refetches on tap when the prefetched link is older than 4 minutes', async () => {
    mockPostApiRequest.mockImplementation((endpoint, body, onSuccess) => onSuccess({ url: 'https://plan' }));
    const now = jest.spyOn(Date, 'now');
    now.mockReturnValue(1000);
    const tree = await mount();
    now.mockReturnValue(1000 + 5 * 60 * 1000);
    await tap(tree);
    expect(mockPostApiRequest).toHaveBeenCalledTimes(2);
    expect(navigation.navigate).toHaveBeenCalledTimes(1);
    now.mockRestore();
  });

  it('shows an error without navigating when the prefetch fails, and retries on tap', async () => {
    mockPostApiRequest.mockImplementationOnce((endpoint, body, onSuccess) => onSuccess(null));
    const tree = await mount();
    expect(navigation.navigate).not.toHaveBeenCalled();
    expect(JSON.stringify(tree.toJSON())).toContain("couldn't open your payment plan");
    mockPostApiRequest.mockImplementationOnce((endpoint, body, onSuccess) => onSuccess({ url: 'https://plan2' }));
    await tap(tree);
    expect(navigation.navigate).toHaveBeenCalledWith('ArticleWindowUtility', { name: 'Payment Plan', url: 'https://plan2', quickPayToNative: true });
    expect(JSON.stringify(tree.toJSON())).not.toContain("couldn't open your payment plan");
  });

  it('treats only has_payment_plan === true as enrolled', () => {
    expect(getPaymentPlanInfo({ has_payment_plan: true }).isEnrolled).toBe(true);
    expect(getPaymentPlanInfo({ has_payment_plan: null }).isEnrolled).toBe(false);
    expect(getPaymentPlanInfo(undefined).isEnrolled).toBe(false);
  });
});

describe('quickPayAmount', () => {
  const { quickPayAmount } = require('../src/utils/paymentPlan');

  it('reads the amount the microsite hands to Quick Pay', () => {
    expect(quickPayAmount('https://customer.uat.sparklight.com/Quick-Pay?accountNumber=8160&amount=214.23')).toBe(214.23);
    expect(quickPayAmount('https://x/quick-pay?AMOUNT=%2475&accountNumber=1')).toBe(75);
    expect(quickPayAmount('https://x/Quick-Pay?amount=1%2C250.50#top')).toBe(1250.5);
  });

  it('returns null when the amount is missing or outside the payment limits', () => {
    expect(quickPayAmount('https://x/Quick-Pay?accountNumber=8160')).toBeNull();
    expect(quickPayAmount('https://x/Quick-Pay?amount=')).toBeNull();
    expect(quickPayAmount('https://x/Quick-Pay?amount=0')).toBeNull();
    expect(quickPayAmount('https://x/Quick-Pay?amount=100000')).toBeNull();
    expect(quickPayAmount('https://x/Quick-Pay?amount=12.345')).toBeNull();
    expect(quickPayAmount('https://x/Quick-Pay?amount=abc')).toBeNull();
    expect(quickPayAmount('https://x/Quick-Pay?amount=%E0%A4%A')).toBeNull();
    expect(quickPayAmount(undefined)).toBeNull();
  });
});

describe('isOffSiteUrl', () => {
  const { isOffSiteUrl } = require('../src/utils/paymentPlan');
  const explainer = 'https://cableone.billexplainerdemo.com/?utm_source=selfcare_mobile&token=abc';

  it('flags links that leave the page\'s site, like the explainer My Account button', () => {
    expect(isOffSiteUrl('https://customer.sparklight.com/', explainer)).toBe(true);
    expect(isOffSiteUrl('https://www.sparklight.com/contactus', explainer)).toBe(true);
  });

  it('keeps same-site navigation and non-web urls in place', () => {
    expect(isOffSiteUrl('https://cableone.billexplainerdemo.com/statement?id=1', explainer)).toBe(false);
    expect(isOffSiteUrl('https://CableOne.BillExplainerDemo.com/', explainer)).toBe(false);
    expect(isOffSiteUrl('about:blank', explainer)).toBe(false);
    expect(isOffSiteUrl('', explainer)).toBe(false);
  });
});
