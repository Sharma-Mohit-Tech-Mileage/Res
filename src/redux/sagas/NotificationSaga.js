import { all, call, put, takeLatest } from "redux-saga/effects";
import {
  UPDATE_PRIMARY_AND_PAPERLESS_REQUEST,
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
        navigation.navigate("EmailNotifications", {
          updateSuccess: true,
          updatedType: "Primary",
          successMessage:
            "Primary email added. You are now enrolled in paperless billing. Changes may take up to 24 hours to reflect.",
        });
      }
    }
    // Case 2: Primary email exists and new email is different – update primary.
    else if (oldEmail && newEmail !== oldEmail) {
      console.log("Updating primary email from", oldEmail, "to", newEmail);
      result = yield call(updatePrimaryEmail, { newEmail, oldEmail });
      if (paperlessBilling === true) {
        console.log("Unenrolling old email from paperless:", oldEmail);
        //yield call(unenrollPaperless, { account, emailAddress: oldEmail });
        console.log("Enrolling new email in paperless:", newEmail);
        yield call(enrollPaperless, { account, emailAddress: newEmail });
      } else if (paperlessBilling === false) {
        console.log("Paperless toggle off – unenrolling old email:", oldEmail);
        yield call(unenrollPaperless, { account, emailAddress: newEmail });
      }
      if (navigation) {
        navigation.navigate("EmailNotifications", {
          updateSuccess: true,
          updatedType: "Primary",
          successMessage: "Primary email updated. Your paperless billing preference has been saved.",
        });
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
        navigation.navigate("EmailNotifications", {
          updateSuccess: true,
          updatedType: "Primary",
          successMessage: "Your paperless billing preference has been updated.",
        });
      }
    }
    yield put(updatePrimaryAndPaperlessSuccess(result));
  } catch (error) {
    console.error("Combined update failed:", error);
    yield put(updatePrimaryAndPaperlessFailure(error.message || "Update failed"));
    if (navigation) {
      navigation.navigate("EmailNotifications", {
        updateFailed: true,
        updatedType: "Primary",
        failureMessage: error.message || "We couldn’t update your settings. Please try again later.",
      });
    }
  } finally {
    yield put(clearLoading());
  }
}

export default function* NotificationSagas() {
  yield all([
    takeLatest(UPDATE_PRIMARY_AND_PAPERLESS_REQUEST, handleUpdatePrimaryAndPaperless),
  ]);
}