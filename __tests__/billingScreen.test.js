const React = require('react');
const renderer = require('react-test-renderer');
const { act } = renderer;
const { TouchableOpacity } = require('react-native');

const mockDispatch = jest.fn();
const mockTriggerOnScreenEntry = jest.fn();
const mockGetUser = jest.fn();
const mockGetApiRequest = jest.fn();

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
}));

jest.mock('../src/network/apis/endpoints/Endpoints', () => ({
  ENDPOINTS: { ACCOUNTS_EASYPAY: 'ACCOUNTS_EASYPAY' },
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

jest.mock('../src/components/common/ProfileSettingsHeader', () => 'ProfileSettingsHeader');
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
    };

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

  it('navigates to bill breakdown and payment history actions', async () => {
    let tree;
    await act(async () => {
      tree = renderer.create(<BillingScreen navigation={mockNavigation} />);
      await flushPromises();
    });

    const actions = tree.root.findAllByType(TouchableOpacity);
    const billBreakdown = actions.find(
      (a) => a.props.accessibilityLabel === 'View Bill Breakdown'
    );
    const paymentHistory = actions.find(
      (a) => a.props.accessibilityLabel === 'View Payment History'
    );

    act(() => {
      billBreakdown.props.onPress();
      paymentHistory.props.onPress();
    });

    expect(mockNavigation.navigate).toHaveBeenCalledWith('BillingBreakDown');
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
      'Error getting user status:',
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
      'error on Billing auto pay',
      expect.any(Error)
    );

    consoleSpy.mockRestore();
  });
});
