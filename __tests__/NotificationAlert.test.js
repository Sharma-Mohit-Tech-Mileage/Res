import React from 'react';
import renderer, { act } from 'react-test-renderer';
import { Pressable } from 'react-native';
import NotificationAlert from '../src/components/services/manageEquipment/EquipmentAlert';

jest.mock('@react-navigation/native', () => ({ useNavigation: () => ({}) }));
jest.mock('react-redux', () => ({ useDispatch: () => jest.fn() }));
jest.mock('../src/redux/actions/ProfileActionSuite', () => ({ resentEmailVerifiction: jest.fn() }));
jest.mock('react-native-a11y-order', () => ({ A11y: { Order: 'View', Index: 'View' } }));

beforeEach(() => jest.useFakeTimers());
afterEach(() => { jest.clearAllTimers(); jest.useRealTimers(); });
const close = screen => screen.root.findAllByType(Pressable).find(node => node.props.accessibilityLabel === 'Close notification');

it.each(['success', 'error', 'warning', 'info'])('dismisses a %s alert without a parent handler', type => {
  let screen;
  act(() => { screen = renderer.create(<NotificationAlert type={type} title="Status" message="Result" />); });
  expect(close(screen).props.accessibilityRole).toBe('button');
  act(() => close(screen).props.onPress());
  expect(screen.toJSON()).toBeNull();
  act(() => screen.update(<NotificationAlert type={type} title="Status" message="Result" />));
  expect(screen.toJSON()).toBeNull();
  act(() => screen.update(<NotificationAlert type={type} title="Status" message="New result" />));
  expect(close(screen)).toBeDefined();
  act(() => screen.unmount());
});

it('calls the parent handler and can reopen after a visibility cycle', () => {
  const onClose = jest.fn();
  let screen;
  const render = isVisible => <NotificationAlert message="Notice" isVisible={isVisible} onClose={onClose} />;
  act(() => { screen = renderer.create(render(true)); });
  act(() => close(screen).props.onPress());
  expect(onClose).toHaveBeenCalledTimes(1);
  expect(screen.toJSON()).toBeNull();
  act(() => screen.update(render(false)));
  act(() => screen.update(render(true)));
  expect(close(screen)).toBeDefined();
  act(() => screen.unmount());
});
