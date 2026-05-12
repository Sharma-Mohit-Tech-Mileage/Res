import React from 'react';
import renderer, { act } from 'react-test-renderer';

const mockSendAccessibilityEvent = jest.fn();
const mockSetAccessibilityFocus = jest.fn();
const mockFindNodeHandle = jest.fn(() => 101);

jest.mock('react-native', () => ({
  AccessibilityInfo: {
    sendAccessibilityEvent: (...args) => mockSendAccessibilityEvent(...args),
    setAccessibilityFocus: (...args) => mockSetAccessibilityFocus(...args),
  },
  findNodeHandle: (...args) => mockFindNodeHandle(...args),
  Platform: { OS: 'android' },
}));

import useAccessibilityFocus from '../../src/hooks/useAccessibilityFocus';

function HookHarness({ onReady }) {
  const [ref, setFocus] = useAccessibilityFocus();
  onReady({ ref, setFocus });
  return null;
}

describe('useAccessibilityFocus', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('sends android focus event when ref has a native handle', () => {
    const onReady = jest.fn();
    renderer.create(<HookHarness onReady={onReady} />);

    const { ref, setFocus } = onReady.mock.calls[0][0];
    ref.current = {};

    act(() => {
      setFocus();
    });

    expect(mockFindNodeHandle).toHaveBeenCalled();
    expect(mockSendAccessibilityEvent).toHaveBeenCalledWith(101, 'focus');
    expect(mockSetAccessibilityFocus).not.toHaveBeenCalled();
  });

  it('does nothing when ref is null', () => {
    const onReady = jest.fn();
    renderer.create(<HookHarness onReady={onReady} />);

    const { setFocus } = onReady.mock.calls[0][0];
    act(() => {
      setFocus();
    });

    expect(mockFindNodeHandle).not.toHaveBeenCalled();
    expect(mockSendAccessibilityEvent).not.toHaveBeenCalled();
    expect(mockSetAccessibilityFocus).not.toHaveBeenCalled();
  });
});
