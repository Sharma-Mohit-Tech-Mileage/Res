const React = require('react');
const renderer = require('react-test-renderer');
const { act } = renderer;
const { TextInput } = require('react-native');

const mockNavigate = jest.fn();

jest.mock('@react-native-async-storage/async-storage', () => require('@react-native-async-storage/async-storage/jest/async-storage-mock'));

jest.mock('@react-navigation/native', () => {
  const R = require('react');
  return { useFocusEffect: (cb) => R.useEffect(cb, []) };
});
jest.mock('../src/network/apis/account/paymentMethods.service', () => ({
  fetchAutoPayDetails: () => Promise.resolve({ enrolled: false, balanceDue: 2350.16, pastDueAmount: 0 }),
}));
jest.mock('../src/components/billing/payments/paymentAnalytics', () => ({
  usePaymentStep: () => {},
  endPaymentAttempt: () => {},
  trackPaymentTypeSelected: () => {},
  trackValidationError: () => {},
  trackApiError: () => {},
  errorStatus: () => 0,
}));
jest.mock('react-native-skeleton-placeholder', () => 'SkeletonPlaceholder');
jest.mock('../src/components/common/ProfileSettingsHeader', () => 'ProfileSettingsHeader');
jest.mock('../src/components/common/customui/NotificationAlert', () => 'NotificationAlert');
jest.mock('../src/components/common/customui/KeyboardAwareScrollView', () => 'KeyboardAwareScrollView');
jest.mock('../src/components/common/customui/Screen', () => ({ ScreenScroll: ({ children }) => children }));
jest.mock('../src/components/common/customui/PrimaryButton', () => {
  const { TouchableOpacity } = require('react-native');
  return (props) => require('react').createElement(TouchableOpacity, props);
});
jest.mock('../src/components/common/customui/Touchable', () => {
  const { TouchableOpacity } = require('react-native');
  return TouchableOpacity;
});

const MakePaymentScreen = require('../src/components/billing/payments/MakePaymentScreen').default;

const render = async (params) => {
  let tree;
  await act(async () => {
    tree = renderer.create(<MakePaymentScreen navigation={{ navigate: mockNavigate, goBack: jest.fn(), popToTop: jest.fn() }} route={{ params }} />);
  });
  return tree;
};
const otherAmountRadio = (tree) => tree.root.find((n) => typeof n.props.accessibilityLabel === 'string' && n.props.accessibilityLabel.startsWith('Other amount') && n.props.accessibilityState);
const continueButton = (tree) => tree.root.findByProps({ accessibilityLabel: 'Continue', title: 'Continue' });

describe('MakePaymentScreen prefill', () => {
  beforeEach(() => mockNavigate.mockClear());

  it('selects Other amount with the handed-over amount and continues with it', async () => {
    const tree = await render({ prefillAmount: 214.23 });
    expect(tree.root.findByType(TextInput).props.value).toBe('$214.23');
    expect(otherAmountRadio(tree).props.accessibilityState).toMatchObject({ checked: true });
    await act(async () => continueButton(tree).props.onPress());
    expect(mockNavigate).toHaveBeenCalledWith('MakePaymentMethod', expect.objectContaining({ amount: 214.23, paymentType: 'custom' }));
  });

  it('keeps the prefilled amount editable', async () => {
    const tree = await render({ prefillAmount: 214.23 });
    await act(async () => tree.root.findByType(TextInput).props.onChangeText('$100'));
    await act(async () => continueButton(tree).props.onPress());
    expect(mockNavigate).toHaveBeenCalledWith('MakePaymentMethod', expect.objectContaining({ amount: 100 }));
  });

  it('opens with nothing selected when no amount, or an invalid one, is handed over', async () => {
    for (const params of [undefined, { prefillAmount: 0 }, { prefillAmount: 'abc' }]) {
      const tree = await render(params);
      expect(tree.root.findByType(TextInput).props.value).toBe('');
      expect(otherAmountRadio(tree).props.accessibilityState).toMatchObject({ checked: false });
    }
  });
});
