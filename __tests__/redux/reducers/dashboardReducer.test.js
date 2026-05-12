import dashboardReducer from '../../../src/redux/reducers/DashboardReducer';
import {
  GET_ACCOUNT_INFO,
  GET_INTERNET_SPEED,
  LOGOUT,
  POST_INTERNET_SPEED,
  UPDATE_ACCOUNT_INFO,
  UPDATE_INTERNET_SPEED,
  UPDATE_WALK_THROUGH_STEP,
} from '../../../src/redux/constants';

describe('dashboardReducer', () => {
  it('returns initial state', () => {
    const state = dashboardReducer(undefined, { type: '@@INIT' });
    expect(state).toEqual({
      isLoading: false,
      speed: {},
      accountInfo: {},
      erro: '',
      walkThroughStep: null,
    });
  });

  it('handles GET/POST/UPDATE internet speed', () => {
    let state = dashboardReducer(undefined, { type: GET_INTERNET_SPEED });
    expect(state.isLoading).toBe(true);

    state = dashboardReducer(state, {
      type: POST_INTERNET_SPEED,
      payload: { download: 200 },
    });
    expect(state.isLoading).toBe(false);
    expect(state.speed).toEqual({ download: 200 });

    state = dashboardReducer(state, {
      type: UPDATE_INTERNET_SPEED,
      payload: { download: 300 },
    });
    expect(state.speed).toEqual({ download: 300 });
  });

  it('handles account info and walkthrough actions', () => {
    let state = dashboardReducer(undefined, { type: GET_ACCOUNT_INFO });
    expect(state.isLoading).toBe(true);

    state = dashboardReducer(state, {
      type: UPDATE_ACCOUNT_INFO,
      payload: { accountId: 'a1' },
    });
    expect(state.isLoading).toBe(false);
    expect(state.accountInfo).toEqual({ accountId: 'a1' });

    state = dashboardReducer(state, {
      type: UPDATE_WALK_THROUGH_STEP,
      payload: { step: 3 },
    });
    expect(state.walkThroughStep).toEqual({ step: 3 });
  });

  it('handles LOGOUT with current reducer behavior', () => {
    const state = dashboardReducer(undefined, { type: LOGOUT });
    expect(state).toEqual({
      initialState: {
        isLoading: false,
        speed: {},
        accountInfo: {},
        erro: '',
        walkThroughStep: null,
      },
    });
  });
});
