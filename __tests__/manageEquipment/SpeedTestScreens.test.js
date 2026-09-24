jest.mock("react-native-skeleton-placeholder", () => "SkeletonPlaceholder");
jest.mock("../../src/network/apis/services/speedTest.service", () => ({
  runEeroSpeedTest: jest.fn(), saveOoklaResult: jest.fn(),
}));
import speedTestApi from "../../src/network/apis/services/speedTest.service";
import React from "react";
import renderer, { act } from "react-test-renderer";
import ModemScreen from "../../src/components/services/speedTest/ModemSpeedTestScreen";
import WifiScreen from "../../src/components/services/speedTest/WifiSpeedTestScreen";
jest.mock(
  "../../src/components/services/speedTest/SpeedTestLayout",
  () => "Layout",
);
jest.mock(
  "../../src/components/services/speedTest/ModemSpeedTestProgress",
  () => "Progress",
);
jest.mock(
  "../../src/components/services/speedTest/ModemSpeedTestComplete",
  () => "Complete",
);
jest.mock(
  "../../src/components/services/speedTest/WifiSpeedTestReady",
  () => "Ready",
);
jest.mock(
  "../../src/components/services/speedTest/WifiSpeedTestRunning",
  () => "Running",
);
jest.mock(
  "../../src/components/services/speedTest/WifiSpeedTestComplete",
  () => "WifiComplete",
);
jest.mock("../../src/components/common/customui/SurfaceCard", () => "Card");
jest.mock("../../src/components/common/customui/PrimaryButton", () => "Button");
jest.mock("../../src/components/common/customui/Typography", () => ({
  Body: "Body",
  HintText: "Hint",
  FieldTitle: "Title",
  FieldContent: "Content",
}));
jest.mock("react-native-safe-area-context", () => ({
  useSafeAreaInsets: () => ({top: 0, right: 0, bottom: 0, left: 0}),
}));
jest.mock("../../src/components/common/customui/CancelButton", () => "CancelButton");
jest.mock("react-native-webview", () => ({WebView: "WebView"}));
jest.mock("../../src/components/common/ProfileSettingsHeader", () => "Header");
jest.mock("../../src/components/common/customui/NotificationAlert", () => "Notification");
beforeEach(() => jest.useFakeTimers());
afterEach(() => jest.useRealTimers());
it("runs the modem API and allows rerun", async () => {
  speedTestApi.runEeroSpeedTest.mockResolvedValue({download: 400, upload: 20});
  let screen;
  await act(async () => { screen = renderer.create(<ModemScreen navigation={{}} />); });
  expect(screen.root.findByType("Complete")).toBeTruthy();
  await act(async () => { await screen.root.findByType("Layout").props.action.props.onPress(); });
  expect(speedTestApi.runEeroSpeedTest).toHaveBeenCalledTimes(2);
  act(() => screen.unmount());
});
it("opens the requested WiFi test in a web view and retries a load failure", () => {
  let screen;
  const navigation = {goBack: jest.fn()};
  act(() => { screen = renderer.create(<WifiScreen navigation={navigation} />); });
  expect(screen.root.findByType("WebView").props.source.html).toContain("https://cableone.speedtestcustom.com");
  act(() => screen.root.findByType("WebView").props.onError());
  expect(screen.root.findByType("Notification").props.type).toBe("error");
  act(() => screen.root.findAllByType("Button").find(button => button.props.title === "Retry").props.onPress());
  expect(screen.root.findByType("WebView")).toBeTruthy();
  act(() => screen.root.findByType("CancelButton").props.onPress());
  expect(navigation.goBack).toHaveBeenCalledTimes(1);
  act(() => screen.unmount());
});
it("shows a modem failure and allows a successful retry", async () => {
  const onRunSpeedTest = jest.fn().mockRejectedValueOnce(new Error("offline")).mockResolvedValueOnce({download: 500, upload: 50});
  let screen;
  await act(async () => { screen = renderer.create(<ModemScreen navigation={{}} onRunSpeedTest={onRunSpeedTest} />); });
  expect(screen.root.findByType("Complete").props.error).toBe(true);
  expect(screen.root.findByType("Layout").props.action.props.disabled).toBe(false);
  await act(async () => { await screen.root.findByType("Layout").props.action.props.onPress(); });
  expect(screen.root.findByType("Complete").props.error).toBeUndefined();
  expect(onRunSpeedTest).toHaveBeenCalledTimes(2);
  act(() => screen.unmount());
});
it("prevents overlapping modem requests during pull to refresh", async () => {
  let resolve;
  const onRunSpeedTest = jest.fn(() => new Promise(done => { resolve = done; }));
  let screen;
  act(() => { screen = renderer.create(<ModemScreen navigation={{}} onRunSpeedTest={onRunSpeedTest} />); });
  expect(screen.root.findByType("Layout").props.action.props.disabled).toBe(true);
  act(() => { screen.root.findByType("Layout").props.refreshControl.props.onRefresh(); });
  expect(onRunSpeedTest).toHaveBeenCalledTimes(1);
  await act(async () => resolve({download: 500, upload: 50}));
  act(() => screen.unmount());
});

it("saves completed WiFi results once and retries a failed save", async () => {
  speedTestApi.saveOoklaResult.mockRejectedValueOnce(new Error("offline")).mockResolvedValueOnce(true);
  let screen;
  act(() => { screen = renderer.create(<WifiScreen navigation={{}} />); });
  const event = { nativeEvent: { data: JSON.stringify({ type: "ookla-complete", result: {
    config: {testId: "test-1"}, device: {platform: "speedtest-custom"},
    end: {timestamp: "2026-09-22"}, units: "Mbps", download: 200, upload: 20,
  } }) } };
  const onMessage = screen.root.findByType("WebView").props.onMessage;
  await act(async () => { onMessage(event); onMessage(event); });
  expect(speedTestApi.saveOoklaResult).toHaveBeenCalledTimes(1);
  await act(async () => { await screen.root.findAllByType("Button").find(b => b.props.title === "Retry Saving Result").props.onPress(); });
  expect(speedTestApi.saveOoklaResult).toHaveBeenCalledTimes(2);
  expect(screen.root.findByType("Notification").props.title).toBe("Speed test result saved");
  act(() => screen.unmount());
});
