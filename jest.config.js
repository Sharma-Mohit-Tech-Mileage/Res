module.exports = {
  preset: 'react-native',
  transform: {
    '^.+\\.[jt]sx?$': 'babel-jest',
  },
  transformIgnorePatterns: [
    'node_modules/(?!(react-native|@react-native|@react-navigation|react-native-vector-icons)/)',
  ],
  collectCoverage: true,
  collectCoverageFrom: [
    'src/utils/announcementHelpers.js',
    'src/redux/actions/NotificationActionSuite.js',
    'src/redux/actions/paymentHistoryActions.js',
    'src/redux/actions/billingBreakdownActions.js',
    'src/redux/actions/billingStatementActions.js',
    'src/redux/actions/UserAction.js',
    'src/components/maintenance/MaintenancePage.js',
    'src/components/maintenance/MaintenanceWrapper.js',
    'src/components/services/dataUsage/DataUsageScreen.js',
    'src/components/support/supportScreen.js',
    'src/components/account/AccountOverview.js',
    'src/components/billing/BillingScreen.js',
  ],
  coverageReporters: ['json-summary', 'json', 'text', 'text-summary'],
  coverageThreshold: {
    global: {
      lines: 90,
      statements: 90,
      functions: 90,
      branches: 90,
    },
  },
};
