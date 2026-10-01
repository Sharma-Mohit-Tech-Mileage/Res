import React from "react";
import renderer, { act } from "react-test-renderer";
import MyAddons from "../../src/components/services/manageEquipment/MyAddons";

jest.mock("../../src/components/common/Icon", () => "Icon");
jest.mock("../../src/components/common/customui/Touchable", () => "Touchable");
jest.mock(
  "../../src/components/common/customui/SurfaceCard",
  () => "SurfaceCard",
);
jest.mock("../../src/components/common/customui/Typography", () => ({
  SectionTitle: "SectionTitle",
  FieldContent: "FieldContent",
}));

it("renders one API Eero with its serial as Mac Id and no example devices", () => {
  let card;
  act(() => {
    card = renderer.create(
      <MyAddons
        equipment={[
          {
            id: "eero",
            model: "EEROPRO6E",
            identifierValue: "GGB1UD222372168X",
          },
        ]}
      />,
    );
  });
  const fields = card.root.findAllByType("FieldContent");
  expect(fields).toHaveLength(2);
  expect(fields[0].props.children[1]).toBe("EEROPRO6E");
  expect(fields[1].props.children[0].props.children).toBe("Mac Id: ");
  expect(fields[1].props.children[1]).toBe("GGB1UD222372168X");
  act(() => {
    card.update(<MyAddons />);
  });
  expect(card.root.findAllByType("FieldContent")).toHaveLength(0);
  act(() => card.unmount());
});

it.each([
  [false, 4],
  [true, 6],
])(
  "collapses and expands devices with connection status %s",
  (showConnectionStatus, contentCount) => {
    let screen;
    act(() => {
      screen = renderer.create(
        <MyAddons
          equipment={[
            { id: "one", model: "MODEL1", identifierValue: "SERIAL1" },
            { id: "two", model: "MODEL2", identifierValue: "SERIAL2" },
          ]}
          showConnectionStatus={showConnectionStatus}
        />,
      );
    });
    expect(
      screen.root
        .findAllByType("FieldContent")
        .filter((node) => node.props.children === "Connected"),
    ).toHaveLength(showConnectionStatus ? 2 : 0);
    const header = () => screen.root.findByType("Touchable");
    expect(header().props.accessibilityState.expanded).toBe(true);
    expect(screen.root.findAllByType("FieldContent").length).toBe(contentCount);
    act(() => header().props.onPress());
    expect(header().props.accessibilityState.expanded).toBe(false);
    expect(screen.root.findAllByType("FieldContent")).toHaveLength(0);
    act(() => header().props.onPress());
    expect(screen.root.findAllByType("FieldContent").length).toBe(contentCount);
    act(() => screen.unmount());
  },
);
