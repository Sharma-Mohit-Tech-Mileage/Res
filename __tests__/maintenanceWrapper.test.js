const React = require('react');
const renderer = require('react-test-renderer');
const { Text } = require('react-native');
const MaintenanceWrapper = require('../src/components/maintenance/MaintenanceWrapper').default;
const { useMaintenance } = require('../src/components/maintenance/MaintenanceContext');

jest.mock('../src/components/maintenance/MaintenanceContext', () => ({
  useMaintenance: jest.fn(),
}));

jest.mock('../src/components/maintenance/MaintenancePage', () => {
  const React = require('react');
  return jest.fn((props) =>
    React.createElement('MockMaintenancePage', props, null)
  );
});

describe('MaintenanceWrapper', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders maintenance page when maintenance mode is on', () => {
    useMaintenance.mockReturnValue({
      showMaintenancePage: true,
      pageConfig: {
        title: 'Planned Maintenance',
        message: 'Please try later',
        estimatedTime: '2 hours',
        contactInfo: 'Support',
        contactLink: 'https://support.example.com',
        showLoginButton: true,
        type: 'BLOCKING',
      },
      blockingState: {
        wasBlocked: true,
        blockingTimestamp: 123,
      },
      clearBlockingState: jest.fn(),
    });

    const tree = renderer.create(
      <MaintenanceWrapper>
        <Text>App Content</Text>
      </MaintenanceWrapper>
    );

    const page = tree.root.findByType('MockMaintenancePage');
    expect(page.props.title).toBe('Planned Maintenance');
    expect(page.props.isBlockingUser).toBe(true);
  });

  it('renders children when maintenance mode is off', () => {
    useMaintenance.mockReturnValue({
      showMaintenancePage: false,
      pageConfig: null,
      blockingState: {
        wasBlocked: false,
        blockingTimestamp: null,
      },
      clearBlockingState: jest.fn(),
    });

    const tree = renderer.create(
      <MaintenanceWrapper>
        <Text>App Content</Text>
      </MaintenanceWrapper>
    );

    const content = tree.root.findByType(Text);
    expect(content.props.children).toBe('App Content');
  });

  it('renders maintenance page with defaults when blocked and no pageConfig', () => {
    useMaintenance.mockReturnValue({
      showMaintenancePage: true,
      pageConfig: null,
      blockingState: {
        wasBlocked: true,
        blockingTimestamp: 456,
      },
      clearBlockingState: jest.fn(),
    });

    const tree = renderer.create(
      <MaintenanceWrapper>
        <Text>App Content</Text>
      </MaintenanceWrapper>
    );

    const page = tree.root.findByType('MockMaintenancePage');
    expect(page.props.title).toBe('System Maintenance in Progress');
    expect(page.props.pageType).toBe('NORMAL');
    expect(page.props.blockingInfo.wasBlocked).toBe(true);
  });

  it('renders children when maintenance is on but user is not blocked and config is missing', () => {
    useMaintenance.mockReturnValue({
      showMaintenancePage: true,
      pageConfig: null,
      blockingState: {
        wasBlocked: false,
        blockingTimestamp: null,
      },
      clearBlockingState: jest.fn(),
    });

    const tree = renderer.create(
      <MaintenanceWrapper>
        <Text>App Content</Text>
      </MaintenanceWrapper>
    );

    const content = tree.root.findByType(Text);
    expect(content.props.children).toBe('App Content');
  });
});
