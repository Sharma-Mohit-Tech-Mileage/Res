import ProfileReducer from '../../../src/redux/reducers/ProfileReducer';
import {
  LOGOUT,
  SAVE_ACP_USER_ACCOUNT_DETAILS,
  SAVE_EMAIL_SELECTION,
  SAVE_NOTIFICATION_DATA,
  SAVE_PAPERLESS_DETAILS,
  SAVE_PUSH_NOTIFICATIONS,
  SAVE_SMS_SELECTION,
  SAVE_USER_ACCOUNT_SERVICE,
  SAVE_USER_LIST,
  SET_PAPERLESS_STATUS,
  USER_PROFILE_DETAILS,
} from '../../../src/redux/constants';

describe('ProfileReducer', () => {
  it('returns initial state', () => {
    const state = ProfileReducer(undefined, { type: '@@INIT' });
    expect(state).toEqual({
      isLoading: false,
      profileDetails: {},
      userList: [],
      smsSubscription: [],
      paperlessStatus: false,
      paperLessInfo: {},
      pushNotifications: [],
      paperlessStatusAcp: false,
      userNotifData: {},
      accountDetails: {},
      erro: '',
    });
  });

  it('handles profile and list related actions', () => {
    let state = ProfileReducer(undefined, { type: USER_PROFILE_DETAILS, payload: { name: 'A' } });
    expect(state.profileDetails).toEqual({ name: 'A' });

    state = ProfileReducer(state, { type: SAVE_USER_LIST, payload: [{ id: 1 }] });
    expect(state.userList).toEqual([{ id: 1 }]);

    state = ProfileReducer(state, { type: SAVE_SMS_SELECTION, payload: ['sms'] });
    expect(state.smsSubscription).toEqual(['sms']);

    state = ProfileReducer(state, { type: SAVE_USER_ACCOUNT_SERVICE, payload: { internet: true } });
    expect(state.services).toEqual({ internet: true });
  });

  it('handles paperless, notifications and account details actions', () => {
    let state = ProfileReducer(undefined, { type: SAVE_EMAIL_SELECTION, payload: true });
    expect(state.paperlessStatus).toBe(true);

    state = ProfileReducer(state, { type: SAVE_PAPERLESS_DETAILS, payload: { plan: 'paperless' } });
    expect(state.paperLessInfo).toEqual({ plan: 'paperless' });

    state = ProfileReducer(state, { type: SAVE_NOTIFICATION_DATA, payload: { email: true } });
    expect(state.userNotifData).toEqual({ email: true });

    state = ProfileReducer(state, { type: SAVE_PUSH_NOTIFICATIONS, payload: ['push'] });
    expect(state.pushNotifications).toEqual(['push']);

    state = ProfileReducer(state, { type: SET_PAPERLESS_STATUS, payload: true });
    expect(state.paperlessStatusAcp).toBe(true);

    state = ProfileReducer(state, {
      type: SAVE_ACP_USER_ACCOUNT_DETAILS,
      payload: { accountId: 'acp-1' },
    });
    expect(state.accountDetails).toEqual({ accountId: 'acp-1' });
  });

  it('handles LOGOUT with current reducer behavior', () => {
    const state = ProfileReducer(undefined, { type: LOGOUT });
    expect(state).toEqual({
      initialState: {
        isLoading: false,
        profileDetails: {},
        userList: [],
        smsSubscription: [],
        paperlessStatus: false,
        paperLessInfo: {},
        pushNotifications: [],
        paperlessStatusAcp: false,
        userNotifData: {},
        accountDetails: {},
        erro: '',
      },
    });
  });
});
