import React from "react";
import renderer, { act } from "react-test-renderer";
import ManageEquipmentScreen from "../../src/components/services/manageEquipment/ManageEquipmentScreen";
import dataUsageApi from "../../src/network/apis/services/dataUsageService";

let mockAccount = "account-a";
jest.mock("react-redux", () => ({
  useSelector: (selector) =>
    selector({ profile: { accountDetails: { account_number: mockAccount } } }),
}));
jest.mock("@react-navigation/native", () => ({
  useFocusEffect: (callback) =>
    require("react").useEffect(callback, [callback]),
}));
jest.mock("@react-navigation/bottom-tabs", () => ({
  BottomTabBarHeightContext: require("react").createContext(0),
}));
jest.mock("react-native-safe-area-context", () => ({
  useSafeAreaInsets: () => ({ bottom: 0 }),
}));
jest.mock("../../src/network/apis/services/dataUsageService", () => ({
  getEquipment: jest.fn(),
}));
jest.mock("../../src/components/common/ProfileSettingsHeader", () => "Header");
jest.mock(
  "../../src/components/services/manageEquipment/MyModemCard",
  () => "Modem",
);
jest.mock(
  "../../src/components/services/manageEquipment/MyAddons",
  () => "Addons",
);
jest.mock(
  "../../src/components/services/manageEquipment/MySpeedCard",
  () => "Speed",
);
const eero = {
  equipment_category: "05",
  manufacturer: " Eero ",
  serial_number: "123",
};
const navigation = { goBack: jest.fn() };
beforeEach(() => {
  mockAccount = "account-a";
  jest.clearAllMocks();
});

it.each([
  [[eero], true],
  [[], false],
  [[{ ...eero, manufacturer: "OTHER" }], false],
  [[{ ...eero, serial_number: "*" }], false],
  [[{ ...eero, equipment_category: "03" }], true],
])(
  "gates eero UI using account equipment %j",
  async (equipments, supported) => {
    dataUsageApi.getEquipment.mockResolvedValue({ equipments });
    let screen;
    await act(async () => {
      screen = renderer.create(
        <ManageEquipmentScreen navigation={navigation} />,
      );
    });
    expect(screen.root.findAllByType("Addons")).toHaveLength(supported ? 1 : 0);
    expect(screen.root.findByType("Speed").props.hideModemSpeed).toBe(
      !supported,
    );
    expect(screen.root.findByType("Speed").props.hasEeroDevice).toBe(supported);
    act(() => screen.unmount());
  },
);

it("hides eero UI while validating and after a failed request", async () => {
  let reject;
  dataUsageApi.getEquipment.mockReturnValue(
    new Promise((resolve, rejectRequest) => {
      reject = rejectRequest;
    }),
  );
  let screen;
  act(() => {
    screen = renderer.create(<ManageEquipmentScreen navigation={navigation} />);
  });
  expect(screen.root.findAllByType("Addons")).toHaveLength(0);
  await act(async () => {
    reject(new Error("Unavailable"));
  });
  expect(screen.root.findByType("Speed").props.hideModemSpeed).toBe(true);
  act(() => screen.unmount());
});

it("ignores equipment from the previous account when accounts change", async () => {
  let resolveOld;
  dataUsageApi.getEquipment
    .mockReturnValueOnce(
      new Promise((resolve) => {
        resolveOld = resolve;
      }),
    )
    .mockResolvedValue({ equipments: [] });
  let screen;
  act(() => {
    screen = renderer.create(<ManageEquipmentScreen navigation={navigation} />);
  });
  mockAccount = "account-b";
  await act(async () => {
    screen.update(<ManageEquipmentScreen navigation={navigation} />);
  });
  await act(async () => {
    resolveOld({ equipments: [eero] });
  });
  expect(screen.root.findAllByType("Addons")).toHaveLength(0);
  expect(screen.root.findByType("Speed").props.hideModemSpeed).toBe(true);
  act(() => screen.unmount());
});

it("shows only the first modem using model_code and serial_number", async () => {
  dataUsageApi.getEquipment.mockResolvedValue({
    equipments: [
      {
        manufacturer: "MOTOR",
        equipment_category: "01",
        model_code: "DTA100U",
        serial_number: "PAQZ00675757",
        mac_address: "00001910007129804242",
      },
      {
        manufacturer: "error",
        equipment_category: "03",
        model_code: "IGNORE",
        serial_number: "IGNORE",
      },
      {
        manufacturer: "EVOL",
        equipment_category: "03",
        model_code: "EVO3000GW",
        serial_number: "743AEFAAF8E5",
      },
      {
        manufacturer: "OTHER",
        equipment_category: "03",
        model_code: "SECOND",
        serial_number: "SECOND",
      },
    ],
  });
  let screen;
  await act(async () => {
    screen = renderer.create(<ManageEquipmentScreen navigation={navigation} />);
  });
  expect(
    screen.root.findAllByType("Modem").map((card) => card.props.equipment),
  ).toEqual([
    {
      id: "743AEFAAF8E5",
      name: "Sparklight Modem",
      model: "EVO3000GW",
      identifierLabel: "Mac ID",
      identifierValue: "743AEFAAF8E5",
    },
  ]);
  expect(screen.root.findAllByType("Addons")).toHaveLength(0);
  mockAccount = "account-b";
  dataUsageApi.getEquipment.mockRejectedValue(new Error("Unavailable"));
  await act(async () => {
    screen.update(<ManageEquipmentScreen navigation={navigation} />);
  });
  expect(screen.root.findByType("Modem").props.equipment).toBeNull();
  act(() => screen.unmount());
});

it("does not show cable equipment as a modem when no modem is returned", async () => {
  dataUsageApi.getEquipment.mockResolvedValue({
    equipments: [
      {
        manufacturer: "MOTOR",
        equipment_category: "01",
        model_code: "DTA100U",
        serial_number: "PAQZ00675757",
      },
    ],
  });
  let screen;
  await act(async () => {
    screen = renderer.create(<ManageEquipmentScreen navigation={navigation} />);
  });
  expect(screen.root.findByType("Modem").props.equipment).toBeNull();
  act(() => screen.unmount());
});

it("shows Eero details in the modem card and add-ons while skipping placeholders", async () => {
  const response = {
    equipments: [
      {
        equipment_category: "03",
        equipment_type: "HN",
        manufacturer: "",
        model_code: "",
        serial_number: "*",
      },
      {
        equipment_category: "05",
        manufacturer: "EERO",
        equipment_description: "Eero Wifi",
        model_code: "EEROPRO6E",
        serial_number: "GGB1UD222372168X",
        mac_address: "",
      },
    ],
  };
  dataUsageApi.getEquipment.mockResolvedValue(response);
  let screen;
  await act(async () => {
    screen = renderer.create(<ManageEquipmentScreen navigation={navigation} />);
  });
  expect(screen.root.findByType("Modem").props.equipment).toEqual({
    id: "GGB1UD222372168X",
    name: "Ero wifi",
    model: "EEROPRO6E",
    identifierLabel: "Mac ID",
    identifierValue: "GGB1UD222372168X",
  });
  expect(screen.root.findByType("Addons").props.equipment).toEqual([
    {
      id: "GGB1UD222372168X",
      name: "Eero Wifi",
      model: "EEROPRO6E",
      identifierLabel: "Serial Number",
      identifierValue: "GGB1UD222372168X",
    },
  ]);
  const {
    transformEquipment,
  } = require("../../src/components/services/dataUsage/transformEquipment");
  expect(transformEquipment(response)).toEqual(
    screen.root.findByType("Addons").props.equipment,
  );
  mockAccount = "account-b";
  dataUsageApi.getEquipment.mockResolvedValue({ equipments: [] });
  await act(async () => {
    screen.update(<ManageEquipmentScreen navigation={navigation} />);
  });
  expect(screen.root.findAllByType("Addons")).toHaveLength(0);
  act(() => screen.unmount());
});
