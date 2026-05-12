import userReducer from '../../../src/redux/reducers/UserReducer';
import { GET_USER_ACCOUNT_DETAILS, LOGOUT, SAVE_USER_INFO } from '../../../src/redux/constants';

describe('userReducer', () => {
  it('returns initial state', () => {
    const state = userReducer(undefined, { type: '@@INIT' });
    expect(state).toEqual({ isLoading: false, userData: {}, erro: '' });
  });

  it('handles SAVE_USER_INFO', () => {
    const payload = { userInfo: { id: '1' } };
    const state = userReducer(undefined, { type: SAVE_USER_INFO, payload });
    expect(state).toEqual({ isLoading: false, userData: payload });
  });

  it('handles GET_USER_ACCOUNT_DETAILS', () => {
    const payload = { accounts: [] };
    const state = userReducer(undefined, { type: GET_USER_ACCOUNT_DETAILS, payload });
    expect(state).toEqual({ isLoading: false, accountDetails: payload });
  });

  it('handles LOGOUT with current reducer behavior', () => {
    const state = userReducer(undefined, { type: LOGOUT });
    expect(state).toEqual({ initialState: { isLoading: false, userData: {}, erro: '' } });
  });
});
