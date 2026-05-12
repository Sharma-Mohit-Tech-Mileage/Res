import React from 'react';
import renderer from 'react-test-renderer';
import { act } from 'react-test-renderer';

const mockUseSelector = jest.fn();

jest.mock('react-redux', () => ({
  useSelector: (...args) => mockUseSelector(...args),
}));

const mockGetPrimaryEmail = jest.fn();

jest.mock('../../src/components/utility/constant', () => ({
  getPrimaryEmail: (...args) => mockGetPrimaryEmail(...args),
}));

import { useUserEmailPrefill } from '../../src/hooks/useUserEmailPrefill';

function HookHarness({ getValues, setValue, fieldName = 'feedbackEmail' }) {
  useUserEmailPrefill(getValues, setValue, fieldName);
  return null;
}

describe('useUserEmailPrefill', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockUseSelector.mockImplementation(selector => selector({ profile: { accountDetails: { a: 1 } } }));
  });

  it('sets lowercased prefill email when field is empty', async () => {
    const getValues = jest.fn(() => '');
    const setValue = jest.fn();
    mockGetPrimaryEmail.mockReturnValue('USER@MAIL.COM ');

    await act(async () => {
      renderer.create(<HookHarness getValues={getValues} setValue={setValue} />);
    });

    expect(getValues).toHaveBeenCalledWith('feedbackEmail');
    expect(setValue).toHaveBeenCalledWith('feedbackEmail', 'user@mail.com', {
      shouldValidate: true,
      shouldDirty: false,
    });
  });

  it('does not set email when field already has value', async () => {
    const getValues = jest.fn(() => 'existing@mail.com');
    const setValue = jest.fn();

    await act(async () => {
      renderer.create(<HookHarness getValues={getValues} setValue={setValue} />);
    });

    expect(setValue).not.toHaveBeenCalled();
  });
});
