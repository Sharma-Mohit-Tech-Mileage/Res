import { LOGOUT, LOG_ERROR, LOG_INFO, SAVE_USER_INFO } from '../../../src/redux/constants';
import { logError, logInfo, logoutApp, saveUserInfo } from '../../../src/redux/actions/UserAction';

describe('UserAction', () => {
  it('creates saveUserInfo action', () => {
    const payload = { id: 'u1' };
    expect(saveUserInfo(payload)).toEqual({
      type: SAVE_USER_INFO,
      payload,
    });
  });

  it('creates logout action', () => {
    expect(logoutApp()).toEqual({ type: LOGOUT });
  });

  it('creates logInfo action', () => {
    const payload = { message: 'ok' };
    expect(logInfo(payload)).toEqual({
      type: LOG_INFO,
      payload,
    });
  });

  it('creates logError action', () => {
    const payload = { message: 'fail' };
    expect(logError(payload)).toEqual({
      type: LOG_ERROR,
      payload,
    });
  });
});
