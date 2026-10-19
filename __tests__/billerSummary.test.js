const React = require('react');
const renderer = require('react-test-renderer');
const { act } = renderer;

jest.mock('rn-tooltip', () => 'Tooltip');
jest.mock('react-native-skeleton-placeholder', () => 'SkeletonPlaceholder');
jest.mock('../src/res/svgIcons/InfoIcon1', () => 'InfoIcon1');
jest.mock('../assets/svgs/Chevonright', () => 'RightIcon');
jest.mock('../src/components/common/customui/PrimaryButton', () => 'PrimaryButton');
jest.mock('../src/components/common/customui/Touchable', () => {
  const { TouchableOpacity } = require('react-native');
  return TouchableOpacity;
});

describe('BillerSummary explainer row', () => {
  const navigation = { navigate: jest.fn() };
  let Card;

  beforeEach(() => {
    jest.clearAllMocks();
    Card = require('../src/components/common/billerCards/BillerSummary').default;
  });

  const render = (props) => {
    let tree;
    act(() => {
      tree = renderer.create(<Card billAmt="64.00" dueDate="Oct 16, 2026" navigation={navigation} {...props} />);
    });
    return tree;
  };

  it('shows Understand your bill and opens the explainer in the portal WebView', () => {
    const tree = render({ explainerUrl: 'https://explainer' });
    const row = tree.root.findByProps({ accessibilityHint: 'Double tap to open the Bill Explainer.' });
    expect(row.props.accessibilityRole).toBe('link');
    act(() => row.props.onPress());
    expect(navigation.navigate).toHaveBeenCalledWith('ArticleWindowUtility', { name: 'Bill Explainer', url: 'https://explainer', quickPayToNative: true });
  });

  it('hides the row without a url or while the amount is still loading', () => {
    expect(render({}).root.findAllByProps({ accessibilityHint: 'Double tap to open the Bill Explainer.' })).toHaveLength(0);
    expect(render({ explainerUrl: 'https://explainer', billAmt: undefined }).root.findAllByProps({ accessibilityHint: 'Double tap to open the Bill Explainer.' })).toHaveLength(0);
  });

  it('shows a skeleton row while the explainer link is loading', () => {
    const tree = render({ explainerLoading: true });
    expect(tree.root.findAllByProps({ accessibilityLabel: 'Loading bill explainer' }).length).toBeGreaterThan(0);
    expect(tree.root.findAllByProps({ accessibilityHint: 'Double tap to open the Bill Explainer.' })).toHaveLength(0);
    expect(render({ explainerLoading: true, billAmt: undefined }).root.findAllByProps({ accessibilityLabel: 'Loading bill explainer' })).toHaveLength(0);
  });
});
