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
  FieldTitle: "Title",
  FieldContent: "Content",
}));
beforeEach(() => jest.useFakeTimers());
afterEach(() => jest.useRealTimers());
it("completes modem preview and allows rerun", () => {
  let screen;
  act(() => {
    screen = renderer.create(<ModemScreen navigation={{}} />);
  });
  expect(screen.root.findByType("Progress")).toBeTruthy();
  act(() => jest.advanceTimersByTime(3000));
  expect(screen.root.findByType("Complete")).toBeTruthy();
  act(() => screen.root.findByType("Layout").props.action.props.onPress());
  expect(screen.root.findByType("Progress")).toBeTruthy();
  act(() => screen.unmount());
  expect(jest.getTimerCount()).toBe(0);
});
it("runs WiFi ready, running, complete and again states", () => {
  let screen;
  act(() => {
    screen = renderer.create(<WifiScreen navigation={{}} />);
  });
  act(() => screen.root.findByType("Ready").props.onStart());
  expect(screen.root.findByType("Running")).toBeTruthy();
  act(() => jest.advanceTimersByTime(3000));
  act(() => screen.root.findByType("WifiComplete").props.onStart());
  expect(screen.root.findByType("Running")).toBeTruthy();
  act(() => screen.unmount());
  expect(jest.getTimerCount()).toBe(0);
});
