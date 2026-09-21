const React = require('react');
const renderer = require('react-test-renderer');
const { act } = renderer;
const { Linking } = require('react-native');
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

    const linkButton = tree.root.find(
      (node) => node.props?.accessibilityRole === 'link'
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

    const loginButton = tree.root.find(
      (node) => node.props?.accessibilityRole === 'button'
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

    const linkButtons = tree.root.findAll(
      (node) => node.props?.accessibilityRole === 'link'
    );

    expect(linkButtons.length).toBe(0);
    expect(openSpy).not.toHaveBeenCalled();
  });

  it('logs when navigation ref is not available', () => {
    const warnSpy = jest.spyOn(console, 'warn').mockImplementation(() => {});
    navigationRef.current = null;

    const tree = renderer.create(
      <MaintenancePage showLoginButton contactLink={null} />
    );

    const loginButton = tree.root.find(
      (node) => node.props?.accessibilityRole === 'button'
    );

    act(() => {
      loginButton.props.onPress();
    });

    expect(warnSpy).toHaveBeenCalledWith('Navigation ref not available');
    warnSpy.mockRestore();
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

    const linkButtons = tree.root.findAll(
      (node) => node.props?.accessibilityRole === 'link'
    );
    expect(linkButtons.length).toBe(0);
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

    const linkButton = tree.root.find(
      (node) => node.props?.accessibilityRole === 'link'
    );

    await act(async () => {
      linkButton.props.onPress();
      await new Promise((resolve) => setTimeout(resolve, 0));
    });

    expect(openSpy).toHaveBeenCalledWith('https://support.example.com');
  });
});


// --- 52452: internal access affordance ---
describe("MaintenancePage — internal access link (52452)", () => {
  const findByLabel = (tree, label) =>
    tree.root.findAll((n) => n.props?.accessibilityLabel === label);
  const linkVisible = (tree) => findByLabel(tree, "Internal access").length > 0;

  const render = (cfg, submit = jest.fn()) => {
    let tree;
    act(() => {
      tree = renderer.create(
        <MaintenancePage
          title="System Maintenance in Progress"
          internalAccessConfig={cfg}
          submitBypassCode={submit}
        />
      );
    });
    return tree;
  };

  it("hides the link when internal access is off", () => {
    expect(linkVisible(render({ enabled: false, bypassCode: "SPK" }))).toBe(false);
  });

  it("hides the link when no code is configured", () => {
    expect(linkVisible(render({ enabled: true, bypassCode: "" }))).toBe(false);
  });

  it("shows the link when enabled with a code", () => {
    expect(linkVisible(render({ enabled: true, bypassCode: "SPK" }))).toBe(true);
  });

  it("reveals the code field when the link is tapped", () => {
    const tree = render({ enabled: true, bypassCode: "SPK" });
    expect(findByLabel(tree, "Internal access code").length).toBe(0);
    act(() => findByLabel(tree, "Internal access")[0].props.onPress());
    expect(findByLabel(tree, "Internal access code").length).toBeGreaterThan(0);
  });

  it("reports an error for a wrong code", () => {
    const submit = jest.fn(() => false);
    const tree = render({ enabled: true, bypassCode: "SPK" }, submit);
    act(() => findByLabel(tree, "Internal access")[0].props.onPress());
    act(() => findByLabel(tree, "Internal access code")[0].props.onChangeText("nope"));
    act(() => findByLabel(tree, "Unlock")[0].props.onPress());
    expect(submit).toHaveBeenCalledWith("nope");
  });
});
