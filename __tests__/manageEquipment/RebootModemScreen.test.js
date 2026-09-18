import React from 'react';
import renderer, { act } from 'react-test-renderer';
import RebootModemScreen from '../../src/components/services/manageEquipment/RebootModemScreen';

jest.mock('../../src/components/services/manageEquipment/RebootModemLayout', () => {
  const React = require('react');
  return ({children, actions}) => React.createElement('Layout', null,
    React.createElement('Card', null, children,
      React.createElement('Actions', null, actions)));
});
jest.mock('../../src/components/common/customui/ServiceLoader', () => 'Loader');
jest.mock('../../src/components/services/manageEquipment/RebootModemLoading', () => 'Loading');
jest.mock('../../src/components/services/manageEquipment/RebootModemSuccess', () => 'Success');
jest.mock('../../src/components/services/manageEquipment/RebootModemFailure', () => 'Failure');
jest.mock('../../src/components/common/customui/NotificationAlert', () => 'Notification');
jest.mock('../../src/components/common/customui/PrimaryButton', () => 'Button');
jest.mock('../../src/components/common/customui/Typography', () => ({ Body: 'Body' }));

it('shows loading until reboot completes and prevents duplicate requests', async () => {
  let resolve;
  const onReboot = jest.fn(() => new Promise(done => { resolve = done; }));
  let screen;
  act(() => { screen = renderer.create(<RebootModemScreen navigation={{}} onReboot={onReboot} />); });
  const press = screen.root.findAllByType('Button')[0].props.onPress;
  let request;
  act(() => { request = press(); press(); });
  expect(screen.root.findByType('Loading')).toBeTruthy();
  expect(onReboot).toHaveBeenCalledTimes(1);
  await act(async () => { resolve(); await request; });
  expect(screen.root.findByType('Success')).toBeTruthy();
  act(() => screen.unmount());
});

it('shows failure and retries the same reboot callback', async () => {
  const onReboot = jest.fn().mockRejectedValueOnce(new Error('offline')).mockResolvedValueOnce(undefined);
  let screen;
  act(() => { screen = renderer.create(<RebootModemScreen navigation={{}} onReboot={onReboot} />); });
  await act(async () => { await screen.root.findAllByType('Button')[0].props.onPress(); });
  const failure = screen.root.findByType('Failure');
  await act(async () => { await failure.props.onRetry(); });
  expect(onReboot).toHaveBeenCalledTimes(2);
  expect(screen.root.findByType('Success')).toBeTruthy();
  act(() => screen.unmount());
});

it('previews loading, failure, and retry success without an API', () => {
  jest.useFakeTimers();
  let screen;
  act(() => { screen = renderer.create(<RebootModemScreen navigation={{}} />); });
  act(() => { screen.root.findAllByType('Button')[0].props.onPress(); });
  expect(screen.root.findByType('Loading')).toBeTruthy();
  act(() => jest.advanceTimersByTime(2000));
  act(() => { screen.root.findByType('Failure').props.onRetry(); });
  expect(screen.root.findByType('Loading')).toBeTruthy();
  act(() => jest.advanceTimersByTime(2000));
  expect(screen.root.findByType('Success')).toBeTruthy();
  act(() => screen.unmount());
  jest.useRealTimers();
});

it('keeps both actions visible and disabled inside the card while rebooting', () => {
  const Loading = jest.requireActual('../../src/components/services/manageEquipment/RebootModemLoading').default;
  let screen;
  act(() => { screen = renderer.create(<Loading navigation={{}} />); });
  const actions = screen.root.findByType('Actions').findAllByType('Button');
  expect(actions.map(button => button.props.title)).toEqual(['Reboot Modem', 'Cancel']);
  actions.forEach(button => expect(button.props.disabled).toBe(true));
  expect(actions[1].props.buttonType).toBe('outline');
  expect(screen.root.findByType('Card').findAllByType('Button')).toHaveLength(2);
  expect(screen.root.findByType('Loader').props.label).toBe('Rebooting');
  act(() => screen.unmount());
});
