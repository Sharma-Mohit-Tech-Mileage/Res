import {
  GET_ACCOUNT_INFO,
  GET_INTERNET_SPEED,
  POST_INTERNET_SPEED,
  UPDATE_ACCOUNT_INFO,
  UPDATE_INTERNET_SPEED,
  UPDATE_WALK_THROUGH_STEP,
} from '../../../src/redux/constants';
import {
  getAccountInfo,
  getCurrentSpeed,
  postCurrentSpeed,
  updateAccountInfo,
  updateCurrentSpeed,
  updateWalkThroughStep,
} from '../../../src/redux/actions/DashboardAction';

describe('DashboardAction', () => {
  it('creates getCurrentSpeed action', () => {
    expect(getCurrentSpeed('a1')).toEqual({ type: GET_INTERNET_SPEED, payload: 'a1' });
  });

  it('creates postCurrentSpeed action', () => {
    expect(postCurrentSpeed({ d: 10 })).toEqual({ type: POST_INTERNET_SPEED, payload: { d: 10 } });
  });

  it('creates updateCurrentSpeed action', () => {
    expect(updateCurrentSpeed({ up: true })).toEqual({ type: UPDATE_INTERNET_SPEED, payload: { up: true } });
  });

  it('creates getAccountInfo action', () => {
    expect(getAccountInfo('a2')).toEqual({ type: GET_ACCOUNT_INFO, payload: 'a2' });
  });

  it('creates updateAccountInfo action', () => {
    expect(updateAccountInfo({ ok: 1 })).toEqual({ type: UPDATE_ACCOUNT_INFO, payload: { ok: 1 } });
  });

  it('creates updateWalkThroughStep action', () => {
    expect(updateWalkThroughStep({ step: 2 })).toEqual({ type: UPDATE_WALK_THROUGH_STEP, payload: { step: 2 } });
  });
});
