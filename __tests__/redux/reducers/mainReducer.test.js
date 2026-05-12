import { combinedReducers } from '../../../src/redux/reducers/MainReducer';
import { LOGOUT, SAVE_USER_INFO } from '../../../src/redux/constants';

describe('combinedReducers', () => {
  it('builds full root state from undefined', () => {
    const state = combinedReducers(undefined, { type: '@@INIT' });
    expect(state).toHaveProperty('user');
    expect(state).toHaveProperty('home');
    expect(state).toHaveProperty('profile');
    expect(state).toHaveProperty('billingStatements');
    expect(state).toHaveProperty('paymentHistory');
    expect(state).toHaveProperty('services');
  });

  it('resets state on LOGOUT', () => {
    const populated = combinedReducers(undefined, {
      type: SAVE_USER_INFO,
      payload: { userInfo: { id: 'u1' } },
    });
    expect(populated.user.userData).toEqual({ userInfo: { id: 'u1' } });

    const loggedOut = combinedReducers(populated, { type: LOGOUT });
    expect(loggedOut).toHaveProperty('user');
    expect(loggedOut.user).toBeDefined();
  });
});
