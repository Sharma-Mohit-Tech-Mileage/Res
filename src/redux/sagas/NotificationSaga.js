import { all, call, put, takeLatest } from "redux-saga/effects";
import {
  UPDATE_PRIMARY_AND_PAPERLESS_REQUEST, ADD_PRIMARY_EMAIL_REQUEST
} from "../constants/notificationConstants";

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

    // if (details.isNewPrimary) {
    //   message = "Primary email has been set up successfully. ";
    //   if (details.paperless) {
    //     message += "Paperless billing has been enabled. ";
    //   }
    //   message += "Changes may take up to 24 hours to reflect.";
    // } else if (details.isPrimaryUpdate) {
    //   message = "Primary email has been updated successfully. ";
    //   if (details.paperless !== undefined) {
    //     message += "Your paperless billing preference has been saved.";
    //   }
    // } else if (details.paperlessOnly) {
    //   message = "Your paperless billing preference has been updated successfully.";
    // }

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

  console.log("Combined action payload:", { newEmail, oldEmail, paperlessBilling, account });

  try {
    yield put(setLoading());
    let result;

    // Case 1: No primary email exists – add new primary.
    if (!oldEmail) {
      console.log("No primary email exists – adding new primary:", newEmail);
      result = yield call(addPrimaryEmail, { newEmail, oldEmail: "" });
      if (paperlessBilling === true) {
        console.log("Enrolling new email in paperless:", newEmail);
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
      console.log("Updating primary email from", oldEmail, "to", newEmail);
      result = yield call(updatePrimaryEmail, { newEmail, oldEmail });
      if (paperlessBilling === true) {
        console.log("Enrolling new email in paperless:", newEmail);
        yield call(enrollPaperless, { account, emailAddress: newEmail });
      } else if (paperlessBilling === false) {
        console.log("Paperless toggle off – unenrolling email:", newEmail);
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
      console.log("No change in primary email; updating paperless status for:", newEmail);
      if (paperlessBilling === true) {
        console.log("Enrolling existing primary email in paperless:", newEmail);
        yield call(enrollPaperless, { account, emailAddress: newEmail });
      } else if (paperlessBilling === false) {
        console.log("Unenrolling existing primary email from paperless:", newEmail);
        yield call(unenrollPaperless, { account, emailAddress: newEmail });
      }

      if (navigation) {
        const config = getNavigationConfig("Primary", true, {
          paperlessOnly: true
        });
        navigation.navigate(config.screen, config.params);
      }
      
    }
    console.log('end of try block result:', result);
    yield put(updatePrimaryAndPaperlessSuccess(result));
  } catch (error) {
    console.error("Combined update failed:", error);
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
    console.log("No primary email exists – adding new primary:", newEmail);
    result = yield call(addPrimaryEmail, { newEmail, oldEmail: "" });
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