export default function speedTestErrorMessage(error) {
  const status = Number(error?.response?.status ?? error?.serviceStatus);
  if (status === 401) return "Your session has expired. Please sign in again.";
  if (status === 403) return "Speed testing is not available for this account. Please contact support.";
  if (error?.speedTestStage === "session") return "Your account information is unavailable. Please sign in again.";
  if (error?.speedTestStage === "waiting-result") return "The test was started, but a new result is not available yet. Please try again later.";
  if (error?.speedTestStage === "previous-result") return "We couldn't retrieve your modem's latest result, so the test has not started. Please try again.";
  if (error?.speedTestStage === "start") return "We couldn't start the modem speed test. Please try again.";
  if (error?.speedTestStage === "result") return "The test was started, but we couldn't retrieve its result. Please try again later.";
  return "We couldn't complete your speed test. Please try again.";
}
