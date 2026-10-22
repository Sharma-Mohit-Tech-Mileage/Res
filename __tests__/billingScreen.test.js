const React = require('react');
const renderer = require('react-test-renderer');
const { act } = renderer;
const { TouchableOpacity } = require('react-native');

const mockDispatch = jest.fn();
const mockTriggerOnScreenEntry = jest.fn();
const mockGetUser = jest.fn();
const mockGetApiRequest = jest.fn();
const mockPostApiRequest = jest.fn();

let mockSelectorState = {
  profile: {
    accountDetails: {
      payment_due_date: '2026-06-02',
      past_due_amount: 0,
      current_balance: 12.5,
    },
    paperlessStatusAcp: true,
    isPaperLessStatusLoading: false,
  },
  user: { userData: { userInfo: { accountNumber: '8160110010005227' } } },
};

const mockNavigation = {
  navigate: jest.fn(),
};

jest.mock('@react-navigation/native', () => ({
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
}));

jest.mock('../src/network/RestApiClient', () => ({
  GetApiRequest: (...args) => mockGetApiRequest(...args),
  PostApiRequest: (...args) => mockPostApiRequest(...args),
}));

jest.mock('../src/network/apis/endpoints/Endpoints', () => ({
  ENDPOINTS: { ACCOUNTS_EASYPAY: 'ACCOUNTS_EASYPAY', GET_BILL_EXPLAINER: 'GET_BILL_EXPLAINER' },
  getEndpoint: jest.fn(() => '/accounts/easypay'),
}));

jest.mock('../src/redux/actions/ProfileActionSuite', () => ({
  fetchACPUserAccountDetails: jest.fn(() => ({ type: 'FETCH_ACP_DETAILS' })),
}));

jest.mock('../src/components/utility/constant', () => ({
  getPrimaryEmail: jest.fn(() => 'qa@example.com'),
}));

jest.mock('react-native-linear-gradient', () => 'LinearGradient');
jest.mock('react-native-config', () => ({ PAY_METHOD: 'https://pay.method' }));
jest.mock('../src/components/common/customui/Touchable', () => {
  const React = require('react');
  const { TouchableOpacity } = require('react-native');
  return function MockTouchable(props) {
    return React.createElement(TouchableOpacity, props, props.children);
  };
});

jest.mock('../src/components/common/ProfileSettingsHeader', () => ({
  __esModule: true,
  default: 'ProfileSettingsHeader',
  TAB_BAND_EXTENSION: 52,
  TAB_BADGE_SIZE: 72,
  TAB_BADGE_TOP: 16,
  useInternalHeaderHeight: () => 112,
}));
jest.mock('../src/components/utility/ZendeskChatIcon', () => 'ZendeskChatIcon');
jest.mock('../src/components/common/Icon', () => 'Icon');
jest.mock('../src/components/common/customui/LoadingOverlay', () => {
  const React = require('react');
  const { Pressable, Text } = require('react-native');

  return function MockLoadingOverlay(props) {
    return (
      <Pressable testID="billing-loading-close" onPress={props.onRequestClose}>
        <Text>Loading</Text>
      </Pressable>
    );
  };
});
jest.mock('../src/components/common/billerCards/BillerSummary', () => 'Card');
jest.mock('../src/components/common/billerCards/AutoPayCard', () => 'AutoPayCard');
jest.mock('../src/components/common/billerCards/PeperLessCard', () => 'PeperLessCard');
jest.mock('../src/components/common/billerCards/PaymentPlanCard', () => 'PaymentPlanCard');
jest.mock('../src/components/common/WebViewWarmup', () => 'WebViewWarmup');
jest.mock('../src/components/utility/AppStyles', () => ({ card: { borderRadius: 8 } }), { virtual: true });
jest.mock('../src/res/svgIcons/BillingIconWhite', () => 'BillingIconWhite');
jest.mock('../assets/svgs/Chevonright', () => 'RightIcon');

const flushPromises = () => new Promise((resolve) => setTimeout(resolve, 0));

describe('BillingScreen behavior', () => {
  let BillingScreen;

  beforeEach(() => {
    jest.clearAllMocks();

    mockSelectorState = {
      profile: {
        accountDetails: {
          payment_due_date: '2026-06-02',
          past_due_amount: 0,
          current_balance: 12.5,
        },
        paperlessStatusAcp: true,
        isPaperLessStatusLoading: false,
      },
      user: { userData: { userInfo: { accountNumber: '8160110010005227' } } },
    };

    mockPostApiRequest.mockImplementation(() => {});

    mockGetUser.mockResolvedValue({
      userInfo: {
        accountNumber: '8160110010005227',
      },
    });

    mockGetApiRequest.mockImplementation((endpoint, onSuccess) => {
      onSuccess({ isEasyPay: true });
    });

    BillingScreen = require('../src/components/billing/BillingScreen').default;
  });

  it('triggers focus analytics and renders billing options actions', async () => {
    let tree;
    await act(async () => {
      tree = renderer.create(<BillingScreen navigation={mockNavigation} />);
      await flushPromises();
    });

    expect(mockTriggerOnScreenEntry).toHaveBeenCalledWith('BillingStackScreen');

    const actions = tree.root.findAllByType(TouchableOpacity);
    const managePayment = actions.find(
      (a) => a.props.accessibilityLabel === 'Manage Payment Method'
    );

    act(() => {
      managePayment.props.onPress();
    });

    expect(mockNavigation.navigate).toHaveBeenCalledWith('PaymentMethods');
  });

  it('hides the bill breakdown option and navigates to payment history', async () => {
    let tree;
    await act(async () => {
      tree = renderer.create(<BillingScreen navigation={mockNavigation} />);
      await flushPromises();
    });

    const actions = tree.root.findAllByType(TouchableOpacity);
    expect(actions.find((a) => a.props.accessibilityLabel === 'View Bill Breakdown')).toBeUndefined();
    const paymentHistory = actions.find(
      (a) => a.props.accessibilityLabel === 'View Payment History'
    );

    act(() => {
      paymentHistory.props.onPress();
    });

    expect(mockNavigation.navigate).not.toHaveBeenCalledWith('BillingBreakDown');
    expect(mockNavigation.navigate).toHaveBeenCalledWith('PaymentHistory');
  });

  it('computes immediate due-date branch when past due exists', async () => {
    mockSelectorState = {
      profile: {
        accountDetails: {
          payment_due_date: '2026-06-02',
          past_due_amount: 55,
          current_balance: 12.5,
        },
        paperlessStatusAcp: true,
        isPaperLessStatusLoading: false,
      },
    };

    let tree;
    await act(async () => {
      tree = renderer.create(<BillingScreen navigation={mockNavigation} />);
      await flushPromises();
    });

    const actions = tree.root.findAllByType(TouchableOpacity);
    const billingStatements = actions.find(
      (a) => a.props.accessibilityLabel === 'View Billing Statements'
    );

    act(() => {
      billingStatements.props.onPress();
    });

    expect(mockNavigation.navigate).toHaveBeenCalledWith('BillingStatements');
  });

  it('handles getUser failures without crashing', async () => {
    const consoleSpy = jest.spyOn(console, 'warn').mockImplementation(() => {});
    mockGetUser.mockRejectedValueOnce(new Error('user unavailable'));

    await act(async () => {
      renderer.create(<BillingScreen navigation={mockNavigation} />);
      await flushPromises();
    });

    expect(mockGetApiRequest).not.toHaveBeenCalled();
    expect(consoleSpy).toHaveBeenCalledWith(
      '[App] [Error getting user status:]',
      expect.any(Error)
    );

    consoleSpy.mockRestore();
  });

  it('runs the autopay error handler when the API request fails', async () => {
    const consoleSpy = jest.spyOn(console, 'warn').mockImplementation(() => {});

    mockGetApiRequest.mockImplementation((endpoint, onSuccess, onError) => {
      onError(new Error('autopay unavailable'));
    });

    await act(async () => {
      renderer.create(<BillingScreen navigation={mockNavigation} />);
      await flushPromises();
    });

    expect(consoleSpy).toHaveBeenCalledWith(
      '[App] [error on Billing auto pay]',
      expect.any(Error)
    );

    consoleSpy.mockRestore();
  });
  const renderPaymentPlanCards = async (accountOverrides) => {
    mockSelectorState.profile.accountDetails = { ...mockSelectorState.profile.accountDetails, ...accountOverrides };
    let tree;
    await act(async () => {
      tree = renderer.create(<BillingScreen navigation={mockNavigation} />);
      await flushPromises();
    });
    return tree.root.findAllByType('PaymentPlanCard');
  };

  it('shows the payment plan card for enrolled customers', async () => {
    const cards = await renderPaymentPlanCards({ has_payment_plan: true });
    expect(cards).toHaveLength(1);
  });

  it('hides the payment plan card when the customer is not enrolled', async () => {
    expect(await renderPaymentPlanCards({ has_payment_plan: false })).toHaveLength(0);
    expect(await renderPaymentPlanCards({})).toHaveLength(0);
  });
  const renderCardProps = async (accountOverrides, explainerResponse) => {
    mockSelectorState.profile.accountDetails = { ...mockSelectorState.profile.accountDetails, ...accountOverrides };
    mockPostApiRequest.mockImplementation((endpoint, body, onSuccess) => explainerResponse && onSuccess(explainerResponse));
    let tree;
    await act(async () => {
      tree = renderer.create(<BillingScreen navigation={mockNavigation} />);
      await flushPromises();
    });
    return tree.root.findByType('Card').props;
  };

  it('passes the bill explainer url to Bill Summary when the API says eligible', async () => {
    const props = await renderCardProps({ customer_type: 'R' }, { eligibility: true, be_url: 'https://explainer' });
    expect(props.explainerUrl).toBe('https://explainer');
    expect(mockPostApiRequest.mock.calls[0][1]).toMatchObject({ account: '8160110010005227', utmSource: 'selfcare_mobile' });
  });

  it('hands the explainer url to the WebView warm-up', async () => {
    mockSelectorState.profile.accountDetails = { ...mockSelectorState.profile.accountDetails, customer_type: 'R' };
    mockPostApiRequest.mockImplementation((endpoint, body, onSuccess) => onSuccess({ eligibility: true, be_url: 'https://explainer' }));
    let tree;
    await act(async () => {
      tree = renderer.create(<BillingScreen navigation={mockNavigation} />);
      await flushPromises();
    });
    expect(tree.root.findByType('WebViewWarmup').props.url).toBe('https://explainer');
  });

  it('hides the explainer when not eligible, without a url, or when the call fails', async () => {
    expect((await renderCardProps({}, { eligibility: false, be_url: 'https://explainer' })).explainerUrl).toBeNull();
    expect((await renderCardProps({}, { eligibility: true })).explainerUrl).toBeNull();
    mockPostApiRequest.mockImplementation((endpoint, body, onSuccess, onError) => onError(new Error('x')));
    let tree;
    await act(async () => {
      tree = renderer.create(<BillingScreen navigation={mockNavigation} />);
      await flushPromises();
    });
    expect(tree.root.findByType('Card').props.explainerUrl).toBeNull();
  });

  it('flags the explainer as loading until the API answers', async () => {
    let respond;
    mockSelectorState.profile.accountDetails = { ...mockSelectorState.profile.accountDetails, customer_type: 'R' };
    mockPostApiRequest.mockImplementation((endpoint, body, onSuccess) => { respond = onSuccess; });
    let tree;
    await act(async () => {
      tree = renderer.create(<BillingScreen navigation={mockNavigation} />);
      await flushPromises();
    });
    expect(tree.root.findByType('Card').props.explainerLoading).toBe(true);
    await act(async () => respond({ eligibility: true, be_url: 'https://explainer' }));
    expect(tree.root.findByType('Card').props).toMatchObject({ explainerLoading: false, explainerUrl: 'https://explainer' });
  });

  it('skips the explainer call for accounts with a hierarchy id', async () => {
    const props = await renderCardProps({ hierarchy: { hierarchy_id: 'H1' } }, { eligibility: true, be_url: 'https://explainer' });
    expect(mockPostApiRequest).not.toHaveBeenCalled();
    expect(props.explainerLoading).toBe(false);
  });
});
