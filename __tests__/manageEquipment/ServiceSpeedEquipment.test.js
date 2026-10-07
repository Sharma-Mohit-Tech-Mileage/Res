import React from "react";
import renderer, { act } from "react-test-renderer";
import { useServiceSpeedEquipment } from "../../src/components/services/hooks/useServiceSpeedEquipment";
import api from "../../src/network/apis/services/dataUsageService";
jest.mock("@react-navigation/native", () => ({
  useFocusEffect: (callback) =>
    require("react").useEffect(callback, [callback]),
}));
jest.mock("../../src/network/apis/services/dataUsageService", () => ({
  getEquipment: jest.fn(),
}));
const Probe = ({ account = "a", refreshKey = 0 }) => (
  <Result supported={useServiceSpeedEquipment(account, refreshKey)} />
);
const Result = () => null;
const eero = { manufacturer: " Eero ", serial_number: "123" };
beforeEach(() => jest.clearAllMocks());
it.each([
  [[eero], true],
  [[{ manufacturer: "OTHER", serial_number: "123" }], false],
  [[{ ...eero, serial_number: "*" }], false],
  [[], false],
  [null, false],
])(
  "validates eero and non-eero equipment %j",
  async (equipments, supported) => {
    api.getEquipment.mockResolvedValue({ equipments });
    let screen;
    await act(async () => {
      screen = renderer.create(<Probe />);
    });
    expect(screen.root.findByType(Result).props.supported).toBe(supported);
    act(() => screen.unmount());
  },
);
it("hides modem speed during loading and after failure, then revalidates on refresh", async () => {
  let reject;
  api.getEquipment
    .mockReturnValueOnce(
      new Promise((_, fail) => {
        reject = fail;
      }),
    )
    .mockResolvedValue({ equipments: [eero] });
  let screen;
  act(() => {
    screen = renderer.create(<Probe />);
  });
  expect(screen.root.findByType(Result).props.supported).toBe(false);
  await act(async () => {
    reject(new Error("Unavailable"));
  });
  expect(screen.root.findByType(Result).props.supported).toBe(false);
  await act(async () => {
    screen.update(<Probe refreshKey={1} />);
  });
  expect(screen.root.findByType(Result).props.supported).toBe(true);
  act(() => screen.unmount());
});
it("ignores stale responses from a previous account", async () => {
  let resolveOld;
  api.getEquipment
    .mockReturnValueOnce(
      new Promise((resolve) => {
        resolveOld = resolve;
      }),
    )
    .mockResolvedValue({ equipments: [] });
  let screen;
  act(() => {
    screen = renderer.create(<Probe />);
  });
  await act(async () => {
    screen.update(<Probe account="b" />);
  });
  await act(async () => {
    resolveOld({ equipments: [eero] });
  });
  expect(screen.root.findByType(Result).props.supported).toBe(false);
  act(() => screen.unmount());
});
