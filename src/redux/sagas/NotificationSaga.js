import { all, call, put, takeLatest } from "redux-saga/effects";
import {
  UPDATE_PRIMARY_AND_PAPERLESS_REQUEST, ADD_PRIMARY_EMAIL_REQUEST
} from "../constants/notificationConstants";
import { FETCH_ACP_USER_ACCOUNT_DETAILS, GET_PAPERLESS_STATUS } from "../constants";

import {
  setLoading,
  clearLoading,
  updatePrimaryAndPaperlessSuccess,
  updatePrimaryAndPaperlessFailure,
} from "../actions/NotificationActionSuite";

import {
  addPrimaryEmail,
  updatePrimaryEmail,
  enrollPaperless,
  unenrollPaperless,
} from "../../network/notification/notification.service";

const getNavigationConfig = (type, isSuccess, details = {}) => {
  const baseConfig = {
    screen: "EmailNotifications",
    params: {
      updatedType: "Primary",
      updateSuccess: isSuccess,
      updateFailed: !isSuccess,
    }
  };

  if (isSuccess) {
    let message = "Your email notification preferences have been updated. Changes may take up to 24 hours to reflect.";

    baseConfig.params.successMessage = message;
  } else {
    baseConfig.params.failureMessage =
      "Something went wrong. Please try again. If the problem persists, contact support.";
  }

  return baseConfig;
};

function* handleUpdatePrimaryAndPaperless(action) {
  const { newEmail, oldEmail, paperlessBilling, account } = action.payload;
  const { navigation } = action;
  // Force-refresh account cache only when the email changed; paperless-only toggle leaves account details untouched.
  const accountDetailsChanged = !oldEmail || newEmail !== oldEmail;

  try {
    yield put(setLoading());
    let result;

    // Case 1: No primary email exists – add new primary.
    if (!oldEmail) {
      result = yield call(addPrimaryEmail, { newEmail, oldEmail: "" });
      if (paperlessBilling === true) {
        yield call(enrollPaperless, { account, emailAddress: newEmail });
      }

      if (navigation) {
        const config = getNavigationConfig("Primary", true, {
          isNewPrimary: true,
          paperless: paperlessBilling
        });
        navigation.navigate(config.screen, config.params);
      }
    }
    // Case 2: Primary email exists and new email is different – update primary.
    else if (oldEmail && newEmail !== oldEmail) {
      result = yield call(updatePrimaryEmail, { newEmail, oldEmail });
      if (paperlessBilling === true) {
        yield call(enrollPaperless, { account, emailAddress: newEmail });
      } else if (paperlessBilling === false) {
        yield call(unenrollPaperless, { account, emailAddress: newEmail });
      }

      if (navigation) {
        const config = getNavigationConfig("Primary", true, {
          isPrimaryUpdate: true,
          paperless: paperlessBilling
        });
        navigation.navigate(config.screen, config.params);
      }
     
    }
    // Case 3: Email unchanged – update paperless status.
    else if (oldEmail && newEmail === oldEmail) {
      if (paperlessBilling === true) {
        yield call(enrollPaperless, { account, emailAddress: newEmail });
      } else if (paperlessBilling === false) {
        yield call(unenrollPaperless, { account, emailAddress: newEmail });
      }

      if (navigation) {
        const config = getNavigationConfig("Primary", true, {
          paperlessOnly: true
        });
        navigation.navigate(config.screen, config.params);
      }
      
    }
    if (accountDetailsChanged) {
      console.log("[AcctCache][Resi] paperless flow: email changed → account fetch force=true");
      yield put({
        type: FETCH_ACP_USER_ACCOUNT_DETAILS,
        payload: { force: true },
      });
    } else {
      console.log("[AcctCache][Resi] paperless flow: paperless-only toggle → GET_PAPERLESS_STATUS, no account force-fetch");
      // Paperless-only toggle: account details unchanged, so refresh just the paperless badge (ungated by account freshness).
      yield put({ type: GET_PAPERLESS_STATUS, payload: { email: newEmail } });
    }
    yield put(updatePrimaryAndPaperlessSuccess(result));
  } catch (error) {
    console.warn("Combined update failed:", error);
    yield put(updatePrimaryAndPaperlessFailure(error.message || "Update failed"));

    if (navigation) {
      const config = getNavigationConfig("Primary", false, {
        error: error.message
      });
      navigation.navigate(config.screen, config.params);
    }
  } finally {
    yield put(clearLoading());
  }
}
function* handleAddPrimaryAndEmail(action) {
  const { newEmail, oldEmail } = action.payload;
  const { navigation } = action;

  try {
    let result;
    result = yield call(addPrimaryEmail, { newEmail, oldEmail: "" });
    yield put({
      type: FETCH_ACP_USER_ACCOUNT_DETAILS,
      payload: { force: true },
    });
    navigation.navigate('MyTab');
  } catch (error) {
    navigation.navigate('EntryEmailNotifications', { updateFailed: true });
  }
}

export default function* NotificationSagas() {
  yield all([
    takeLatest(UPDATE_PRIMARY_AND_PAPERLESS_REQUEST, handleUpdatePrimaryAndPaperless),
    takeLatest(ADD_PRIMARY_EMAIL_REQUEST, handleAddPrimaryAndEmail),
  ]);
}