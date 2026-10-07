// [55104] The Dashboard Auto Pay and Paperless cards stack on phones and sit side by side from 600dp.
import React from "react";
import renderer, { act } from "react-test-renderer";
import { Text } from "react-native";
import ResponsiveRow from "../src/components/common/customui/ResponsiveRow";

jest.mock("react-native/Libraries/Utilities/useWindowDimensions", () => ({
  __esModule: true,
  default: jest.fn(),
}));

const useWindowDimensions = require("react-native/Libraries/Utilities/useWindowDimensions").default;

const render = (width) => {
  useWindowDimensions.mockReturnValue({ width, height: 1000, scale: 2, fontScale: 1 });
  let tree;
  act(() => {
    tree = renderer.create(
      <ResponsiveRow>
        <Text key="a">Auto Pay</Text>
        <Text key="b">Paperless Billing</Text>
      </ResponsiveRow>
    );
  });
  return tree.toJSON();
};

const flexDirection = (node) => [].concat(node.props.style).flat(Infinity).filter(Boolean).reduce((acc, s) => ({ ...acc, ...s }), {}).flexDirection;

describe("Dashboard card row", () => {
  it("stacks the two cards on phone widths", () => {
    [320, 393, 430, 599].forEach((w) => expect(flexDirection(render(w))).toBeUndefined());
  });

  it("puts the two cards side by side from 600dp up", () => {
    [600, 768, 820, 1024].forEach((w) => expect(flexDirection(render(w))).toBe("row"));
  });
});
