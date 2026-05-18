const React = require('react');
const renderer = require('react-test-renderer');
const { act } = renderer;
const { TouchableOpacity, Linking } = require('react-native');
const MaintenancePage = require('../src/components/maintenance/MaintenancePage').default;
const { navigationRef } = require('../src/navigations/UserNavigations');

jest.mock('react-native-linear-gradient', () => 'LinearGradient');
jest.mock('../src/components/common/Icon', () => 'Icon');
jest.mock('../src/res/images/LogoSmall', () => 'Logo');
jest.mock('react-native-responsive-screen', () => ({
  widthPercentageToDP: jest.fn(() => 100),
  heightPercentageToDP: jest.fn(() => 100),
}));

jest.mock('react-native-version-check', () => ({
  getCurrentVersion: jest.fn(() => '25.7.0'),
}));

jest.mock('../src/navigations/UserNavigations', () => ({
  navigationRef: {
    current: {
      reset: jest.fn(),
    },
  },
}));

describe('MaintenancePage', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    navigationRef.current = {
      reset: jest.fn(),
    };
  });

  it('opens support link when contact link is pressed', async () => {
    const openSpy = jest
      .spyOn(Linking, 'openURL')
      .mockResolvedValueOnce(true);

    const tree = renderer.create(
      <MaintenancePage
        contactInfo="contact us"
        contactLink="https://support.example.com"
        showLoginButton={false}
      />
    );

    const touchables = tree.root.findAllByType(TouchableOpacity);
    const linkButton = touchables.find(
      (t) => t.props.accessibilityRole === 'link'
    );

    await act(async () => {
      linkButton.props.onPress();
    });

    expect(openSpy).toHaveBeenCalledWith('https://support.example.com');
  });

  it('navigates back to Splash when back to login is pressed', () => {
    const tree = renderer.create(
      <MaintenancePage showLoginButton contactLink={null} />
    );

    const touchables = tree.root.findAllByType(TouchableOpacity);
    const loginButton = touchables.find(
      (t) => t.props.accessibilityRole === 'button'
    );

    act(() => {
      loginButton.props.onPress();
    });

    expect(navigationRef.current.reset).toHaveBeenCalledWith({
      index: 0,
      routes: [
        {
          name: 'Splash',
          params: {
            isLogout: true,
            fromBlocking: true,
          },
        },
      ],
    });
  });

  it('does not attempt to open URL when contact link is not provided', () => {
    const openSpy = jest
      .spyOn(Linking, 'openURL')
      .mockResolvedValueOnce(true);

    const tree = renderer.create(
      <MaintenancePage
        contactInfo="contact us"
        contactLink={null}
        showLoginButton={false}
      />
    );

    const touchables = tree.root.findAllByType(TouchableOpacity);
    const linkButton = touchables.find(
      (t) => t.props.accessibilityRole === 'link'
    );

    expect(linkButton).toBeUndefined();
    expect(openSpy).not.toHaveBeenCalled();
  });

  it('logs when navigation ref is not available', () => {
    const errorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
    navigationRef.current = null;

    const tree = renderer.create(
      <MaintenancePage showLoginButton contactLink={null} />
    );

    const touchables = tree.root.findAllByType(TouchableOpacity);
    const loginButton = touchables.find(
      (t) => t.props.accessibilityRole === 'button'
    );

    act(() => {
      loginButton.props.onPress();
    });

    expect(errorSpy).toHaveBeenCalledWith('Navigation ref not available');
    errorSpy.mockRestore();
  });

  it('shows estimated completion time when provided', () => {
    const tree = renderer.create(
      <MaintenancePage estimatedTime="Tomorrow 2PM" showLoginButton={false} />
    );

    const estimatedText = tree.root.findAll(
      (node) => node.props?.children === 'Estimated Completion Time'
    );
    expect(estimatedText.length).toBeGreaterThan(0);
  });

  it('hides contact link section when showLoginButton is true', () => {
    const tree = renderer.create(
      <MaintenancePage
        contactInfo="contact us"
        contactLink="https://support.example.com"
        showLoginButton
      />
    );

    const touchables = tree.root.findAllByType(TouchableOpacity);
    const linkButton = touchables.find(
      (t) => t.props.accessibilityRole === 'link'
    );
    expect(linkButton).toBeUndefined();
  });

  it('attempts to open contact link even when openURL rejects', async () => {
    const openSpy = jest
      .spyOn(Linking, 'openURL')
      .mockRejectedValueOnce(new Error('cannot open'));

    const tree = renderer.create(
      <MaintenancePage
        contactInfo="contact us"
        contactLink="https://support.example.com"
        showLoginButton={false}
      />
    );

    const touchables = tree.root.findAllByType(TouchableOpacity);
    const linkButton = touchables.find(
      (t) => t.props.accessibilityRole === 'link'
    );

    await act(async () => {
      linkButton.props.onPress();
      await new Promise((resolve) => setTimeout(resolve, 0));
    });

    expect(openSpy).toHaveBeenCalledWith('https://support.example.com');
  });
});
