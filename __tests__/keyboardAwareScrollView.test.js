const React = require('react');
const renderer = require('react-test-renderer');
const { Keyboard, Platform, Text, TextInput } = require('react-native');

const mockScrollNode = { measureInWindow: jest.fn(), scrollTo: jest.fn() };

jest.mock('react-native/Libraries/Components/ScrollView/ScrollView', () => {
  const React = require('react');
  const ScrollView = React.forwardRef((props, ref) => {
    React.useImperativeHandle(ref, () => mockScrollNode);
    return React.createElement('ScrollView', props, props.children);
  });
  return ScrollView;
});

jest.mock('@react-navigation/bottom-tabs', () => {
  const React = require('react');
  return { BottomTabBarHeightContext: React.createContext(undefined) };
});

const {
  default: KeyboardAwareScrollView,
  computeScrollDelta,
  resolveVisibleBottom,
  KEYBOARD_GAP,
} = require('../src/components/common/customui/KeyboardAwareScrollView');
const { BottomTabBarHeightContext } = require('@react-navigation/bottom-tabs');

describe('computeScrollDelta', () => {
  it('does not scroll when the input already clears the keyboard by the gap', () => {
    expect(computeScrollDelta({ inputBottom: 400, visibleBottom: 500 })).toBe(0);
    expect(computeScrollDelta({ inputBottom: 484, visibleBottom: 500 })).toBe(0);
  });

  it('scrolls only by the overlap plus the gap', () => {
    expect(computeScrollDelta({ inputBottom: 500, visibleBottom: 500 })).toBe(KEYBOARD_GAP);
    expect(computeScrollDelta({ inputBottom: 640, visibleBottom: 500, gap: 10 })).toBe(150);
  });
});

describe('resolveVisibleBottom', () => {
  it('uses the keyboard top on iOS, capped by the scroll view bottom', () => {
    expect(resolveVisibleBottom({ scrollBottom: 800, keyboardTop: 500, tabBarHeight: 60, ios: true })).toBe(500);
    expect(resolveVisibleBottom({ scrollBottom: 450, keyboardTop: 500, ios: true })).toBe(450);
    expect(resolveVisibleBottom({ scrollBottom: 800, keyboardTop: 0, ios: true })).toBe(800);
  });

  it('uses the resized scroll view bottom minus the overlaid tab bar on Android', () => {
    expect(resolveVisibleBottom({ scrollBottom: 500, keyboardTop: 524, tabBarHeight: 60, ios: false })).toBe(440);
    expect(resolveVisibleBottom({ scrollBottom: 500, keyboardTop: 524, ios: false })).toBe(500);
  });
});

describe('KeyboardAwareScrollView', () => {
  const listeners = {};
  const originalOS = Platform.OS;

  const mount = ({ inputTop, inputHeight = 40, scrollTop = 100, scrollHeight = 700, tabBarHeight }) => {
    mockScrollNode.measureInWindow.mockImplementation((cb) => cb(0, scrollTop, 360, scrollHeight));
    jest.spyOn(TextInput.State, 'currentlyFocusedInput').mockReturnValue({
      measureInWindow: (cb) => cb(0, inputTop, 300, inputHeight),
    });
    let tree;
    renderer.act(() => {
      tree = renderer.create(
        React.createElement(
          BottomTabBarHeightContext.Provider,
          { value: tabBarHeight },
          React.createElement(KeyboardAwareScrollView, null, React.createElement(Text, null, 'form'))
        )
      );
    });
    return tree;
  };

  beforeEach(() => {
    mockScrollNode.scrollTo.mockReset();
    mockScrollNode.measureInWindow.mockReset();
    jest.spyOn(Keyboard, 'addListener').mockImplementation((name, fn) => {
      listeners[name] = fn;
      return { remove: jest.fn() };
    });
  });

  afterEach(() => {
    Platform.OS = originalOS;
    jest.restoreAllMocks();
  });

  it('renders its children inside a ScrollView with taps persisting through the keyboard', () => {
    const tree = mount({ inputTop: 200 });
    expect(tree.root.findByType('ScrollView').props.keyboardShouldPersistTaps).toBe('handled');
    expect(tree.root.findByType(Text).props.children).toBe('form');
  });

  it('leaves the offset alone when the focused input is already above the keyboard (iOS)', () => {
    Platform.OS = 'ios';
    mount({ inputTop: 200 });
    renderer.act(() => {
      listeners.keyboardWillShow({ endCoordinates: { screenY: 500, height: 300 }, duration: 250 });
    });
    expect(mockScrollNode.scrollTo).not.toHaveBeenCalled();
  });

  it('scrolls the focused input just above the keyboard by the needed amount (iOS)', () => {
    Platform.OS = 'ios';
    mount({ inputTop: 520, inputHeight: 40 });
    renderer.act(() => {
      listeners.keyboardWillShow({ endCoordinates: { screenY: 500, height: 300 }, duration: 250 });
    });
    // Input bottom 560 must end 16 above the keyboard top at 500: move by 76 from offset 0.
    expect(mockScrollNode.scrollTo).toHaveBeenCalledWith({ y: 76, animated: true });
  });

  it('accounts for the tab bar overlaying the resized scroll view (Android)', () => {
    Platform.OS = 'android';
    mount({ inputTop: 440, inputHeight: 40, scrollTop: 100, scrollHeight: 400, tabBarHeight: 60 });
    renderer.act(() => {
      listeners.keyboardDidShow({ endCoordinates: { screenY: 500, height: 300 } });
    });
    // Scroll view spans 100–500 after adjustResize, tab bar covers 440–500, input bottom 480: 480 + 16 − 440 = 56.
    expect(mockScrollNode.scrollTo).toHaveBeenCalledWith({ y: 56, animated: true });
  });

  it('adds the offset already scrolled so the delta stays relative', () => {
    Platform.OS = 'ios';
    const tree = mount({ inputTop: 520, inputHeight: 40 });
    renderer.act(() => {
      tree.root.findByType('ScrollView').props.onScroll({ nativeEvent: { contentOffset: { y: 120 } } });
      listeners.keyboardWillShow({ endCoordinates: { screenY: 500, height: 300 }, duration: 250 });
    });
    expect(mockScrollNode.scrollTo).toHaveBeenCalledWith({ y: 196, animated: true });
  });

  it('re-checks the focused input after a tap while the keyboard is open', () => {
    jest.useFakeTimers();
    Platform.OS = 'android';
    const tree = mount({ inputTop: 440, inputHeight: 40, scrollTop: 100, scrollHeight: 400, tabBarHeight: 60 });
    renderer.act(() => {
      listeners.keyboardDidShow({ endCoordinates: { screenY: 500, height: 300 } });
    });
    mockScrollNode.scrollTo.mockClear();
    renderer.act(() => {
      tree.root.findByType('ScrollView').props.onTouchEnd({});
      jest.advanceTimersByTime(100);
    });
    expect(mockScrollNode.scrollTo).toHaveBeenCalledTimes(1);
    jest.useRealTimers();
  });
});
