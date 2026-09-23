import React from 'react';
import renderer, { act } from 'react-test-renderer';
import { AccessibilityInfo, Image } from 'react-native';
import Svg from 'react-native-svg';
import SpeedAnimation from '../../src/components/common/SpeedAnimation';

beforeEach(() => {
  jest.useFakeTimers();
  jest.spyOn(AccessibilityInfo, 'isReduceMotionEnabled').mockResolvedValue(true);
});
afterEach(() => { jest.restoreAllMocks(); jest.useRealTimers(); });

it.each([
  ['wifi', true, '0 0 281 109'],
  ['wifi', false, '0 0 201 109'],
  ['modem', true, '0 0 281 109'],
])('renders %s with eero=%s as scalable vectors', async (speedType, hasEeroDevice, viewBox) => {
  let screen;
  await act(async () => {
    screen = renderer.create(<SpeedAnimation speedType={speedType} hasEeroDevice={hasEeroDevice} />);
  });
  expect(screen.root.findByType(Svg).props.viewBox).toBe(viewBox);
  expect(screen.root.findAllByType(Image)).toHaveLength(0);
  act(() => screen.unmount());
});
