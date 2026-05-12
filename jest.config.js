module.exports = {
  preset: 'react-native',
  collectCoverage: true,
  collectCoverageFrom: [
    'src/utils/announcementHelpers.js',
    'src/redux/actions/NotificationActionSuite.js',
    'src/redux/actions/paymentHistoryActions.js',
    'src/redux/actions/billingBreakdownActions.js',
    'src/redux/actions/billingStatementActions.js',
    'src/redux/actions/UserAction.js',
  ],
  coverageReporters: ['json-summary', 'json', 'text', 'text-summary'],
};
