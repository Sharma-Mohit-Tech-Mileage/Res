jest.mock("react-native-skeleton-placeholder", () => "SkeletonPlaceholder");
import SpeedTestResults from '../../src/components/services/speedTest/SpeedTestResults';
import formatSpeedTestTimestamp from '../../src/components/services/speedTest/formatSpeedTestTimestamp';

test.each([
  [29.321, '29.32'], [980.4000244140625, '980.40'], [0, '0.00'],
  ['54.689998626708984', '54.69'], [null, '---'], ['', '---'],
])('formats speed %p for display without changing stored precision', (value, expected) => {
  const result = SpeedTestResults({ download: value, upload: value });
  expect(result.props.downloadSpeed).toBe(expected);
  expect(result.props.uploadSpeed).toBe(expected);
});

test('supports the details API timestamp and invalid or missing timestamps', () => {
  expect(formatSpeedTestTimestamp('09/14/2026 09:20:52')).toBe('Sep 14, 2026, 9:20 AM');
  expect(formatSpeedTestTimestamp('2026-09-17T19:40:54.2302873+00:00')).not.toBe('---');
  expect(formatSpeedTestTimestamp(null)).toBe('---');
  expect(formatSpeedTestTimestamp('invalid')).toBe('---');
});
