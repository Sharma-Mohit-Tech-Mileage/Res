import {
  all,
  call,
  put,
  select,
  takeLatest,
  takeLeading,
  takeEvery,
  cancelled,
} from "redux-saga/effects";
import {
  updateEmailList,
  getPrimaryEmail,
} from "../../components/utility/constant";
import {
  fetchACPUserAccountDetails,
  isPaperlessEnabled,
  getProfileDetails,
  updateProfileSecurity,
  fetchUserList,
  fetchSmsSubscription,
  fetchBillingStatus,
  postProfileInfo,
  postTextNotifictionInfo,
  fetchPaperLessDetails,
  postEmailNotification,
  putEmailNotification,
  postTermsAndConditionsv2,
  postPushNotifications,
  unsubscribPaperLess,
  fetchPushNotifications,
  handleSubmitFeedback,
  resendEmailVerification,
  logError,
  logInfo,
  addUserAction,
  removeUser,
  editUserAction,
  fetchAllSvEmails,
  addSVEmailNoFlags,
  updateSVEmails,
  manageSVEmails,
} from "../../network/apis/account/profile.service";
import * as appLogger from "../../utils/logger";
import {
  FETCH_ACP_USER_ACCOUNT_DETAILS,
  FETCH_PROFILE_DETAILS,
  FETCH_USER_LIST,
  FETCH_SMS_SELECTION,
  UPDATE_PROFILE_REQUEST,
  UPDATE_PROFILE_SECURITY,
  UPDATE_TEXT_NOTIFICATION,
  FETCH_EMIAL_SELECTION,
  FETCH_PAPERLESS,
  UPDATE_EMAIL_NOTIFICATION,
  UPDATE_TERMS_AND_CONDITIONS,
  UPDATE_PUSH_NOTIFICATIONS,
  UNSUBSCRIBE_PAPERLESS,
  FETCH_PUSH_NOTIFICATIONS,
  UPDATE_PUSH_NOTIFICATIONS_V2,
  SAVE_USER_FEEDBACK,
  UPDATE_EXISTING_EMAIL_NOTIFICATION,
  RESEND_EMAIL_VERIFICTION,
  LOG_ERROR,
  LOG_INFO,
  ADD_NEW_USER,
  DELETE_USER,
  EDIT_USER,
  ALLSVEMAILASSOCIATED,
  ADD_SV_EMAIL_NO_FLAGS_REQUEST,
  DELETE_SV_EMAIL_REQUEST,
  UPDATE_SV_EMAILS_REQUEST,
  MANAGE_EMAIL_REQUEST,
  UPDATE_EMAIL_ASSOCIATIONS,
  GET_PAPERLESS_STATUS,
} from "../constants";
import {
  saveACPUserAccountDetails,
  fetchProfileSuccess,
  fetchUserListSuccess,
  saveSMSSelection,
  saveEmailBillings,
  saveSvEmailAssociation,
  savePaperlessDetails,
  savePushNotifications,
  setPaperlessStatus,
  setLoading,
  clearLoading,
} from "../actions/ProfileActionSuite";

function* getProfileUsers(action) {
  try {
    const response = yield call(fetchUserList);
    yield put(fetchUserListSuccess(response));
  } catch (error) {
    appLogger.logError("API Error Response:", error);
  }
}

function* fetchProfileDetails(action) {
  try {
    const response = yield call(getProfileDetails);
    yield put(fetchProfileSuccess(response));
  } catch (error) {
    appLogger.logError("API Error Response:", error);
  }
}

function* fetchSMSSubs(action) {
  try {
    const response = yield call(fetchSmsSubscription);
    yield put(saveSMSSelection(response));
  } catch (error) {
    appLogger.logError("API Error Response:", error);
  }
}

function* fetchPaperlessBills(action) {
  try {
    const billingStatusResponse = yield call(fetchBillingStatus);
    yield put(saveEmailBillings(billingStatusResponse));
  } catch (error) {
    appLogger.logError("Fetch Billing Status API Error:", error);
  }
}

function* fetchPaperlessDetails(action) {
  try {
    const paperlessDetailsResponse = yield call(fetchPaperLessDetails);
    yield put(savePaperlessDetails(paperlessDetailsResponse));
  } catch (error) {
    appLogger.logError("Fetch Paperless Details API Error:", error);
  }
}

function* getPushNotifications(action) {
  try {
    const response = yield call(fetchPushNotifications, action.payload);
    yield put(savePushNotifications(response));
  } catch (error) {}
}

function* updateNewEmail(action) {
  try {
    const response = yield call(postEmailNotification, action.payload);
    try {
      if (action.isEmailChanged === true) {
        yield call(postProfileInfo, action.ProfilePayLoad);
      }
    } catch (secondError) {
      if (action.navigation !== null) {
        action.navigation.navigate("EmailNotifications", {
          updateFailed: true,
          updatedType: "Email",
        });
      }
    }
    yield put({ type: FETCH_ACP_USER_ACCOUNT_DETAILS, payload: { force: true } });
    if (action.navigation !== null) {
      action.navigation.navigate("Notifications", {
        updateSuccess: true,
        updatedType: "Email",
      });
    }
  } catch (error) {
    if (action.navigation !== null) {
      action.navigation.navigate("EmailNotifications", {
        updateFailed: true,
        updatedType: "Email",
      });
    }
  }
}

function* updateProfile(action) {
  try {
    yield call(postProfileInfo, action.payload);
    yield put({ type: FETCH_ACP_USER_ACCOUNT_DETAILS, payload: { force: true } });
    action.navigation.navigate("ProfileSettings", { updateSuccess: true });
  } catch (error) {
    action.navigation.navigate("ProfileSettingsEdit", { updateFailed: true });
    appLogger.logError("API Error Response:", error, action.payload);
  }
}

function* saveUserFeedBack(action) {
  try {
    const response = yield call(handleSubmitFeedback, action.payload);
    action.navigation.navigate("ThumbsUp", { updateSuccess: true });
  } catch (error) {
    action.navigation.navigate("Feedback", { updateFailed: true });
  }
}

function* handleUpdateProfileSecurity(action) {
  try {
    yield call(updateProfileSecurity, action.payload);
    action.navigation.navigate("PasswordSecurity", { updateSuccess: true });
  } catch (error) {
    action.navigation.navigate("PasswordSecurityEdit", { updateFailed: true });
    appLogger.logError("API Error Response:", error, action.payload);
  }
}

function* updateTextNotification(action) {
  let message =
    "Your text notification preferences have been successfully updated to enable marketing messages.";
  try {
    const response = yield call(postTextNotifictionInfo, action.payload);
    if (action.navigation !== null) {
      action.navigation.navigate("TextNotifications", {
        updateSuccess: true,
        updatedType: "Text",
        successMessage: message,
        additionalData: action.payload,
      });
    }
  } catch (error) {
    message =
      "Something went wrong. Please try again. If the problem persists, contact support.";
    if (action.navigation !== null) {
      action.navigation.navigate("TextNotifications", {
        updateFailed: true,
        failureMessage: message,
        updatedType: "Text",
        additionalData: action.payload,
      });
    }
  }
}

function* updateEmailNotification(action) {
  try {
    const response = yield call(putEmailNotification, action.payload);
    try {
      if (action.isEmailChanged === true) {
        yield call(postProfileInfo, action.ProfilePayLoad);
      }
    } catch (secondError) {
      if (action.navigation !== null) {
        action.navigation.navigate("EmailNotifications", {
          updateFailed: true,
          updatedType: "Email",
        });
      }
    }
    yield put({ type: FETCH_ACP_USER_ACCOUNT_DETAILS, payload: { force: true } });
    if (action.navigation !== null) {
      action.navigation.navigate("Notifications", {
        updateSuccess: true,
        updatedType: "Email",
      });
    }
  } catch (error) {
    if (action.navigation !== null) {
      action.navigation.navigate("EmailNotifications", {
        updateFailed: true,
        updatedType: "Email",
      });
    }
  }
}

function* updateTermsAndConditions(action) {
  try {
    yield call(postTermsAndConditionsv2, action.payload);
    if (action.navigation !== null) {
      action.navigation.navigate("EntryPushNotifications");
    }
  } catch (error) {
    if (action.navigation !== null) {
      action.navigation.navigate("Terms", { updateFailed: true });
    }
  }
}

function* unsubscribPaperLessSaga(action) {
  try {
    const response = yield call(unsubscribPaperLess, action.payload);
    yield put({ type: FETCH_ACP_USER_ACCOUNT_DETAILS, payload: { force: true } });
    action.navigation.navigate("Notifications", {
      updateSuccess: true,
      updatedType: "Email",
    });
  } catch (error) {
    action.navigation.navigate("EmailNotifications", {
      updateFailed: true,
      updatedType: "Email",
    });
  }
}

function* updatePushNotifications(action) {
  try {
    yield call(postPushNotifications, action.payload);
    if (action.navigation !== null) {
      action.navigation.navigate("EntryTextNotifications");
    }
  } catch (error) {
    if (action.navigation !== null) {
      action.navigation.navigate("EntryPushNotifications", {
        updateFailed: true,
      });
    }
  }
}
function* updatePushNotificationsV2(action) {
  let message =
    "Your InApp notification preferences have been successfully updated to enable marketing messages.";
  try {
    yield call(postPushNotifications, action.payload);
    if (action.navigation !== null) {
      action.navigation.navigate("InAppNotifications", {
        updateSuccess: true,
        updatedType: "App",
        successMessage: message,
        additionalData: action.payload,
      });
    }
  } catch (error) {
    message =
      "Something went wrong. Please try again. If the problem persists, contact support.";
    if (action.navigation !== null) {
      action.navigation.navigate("InAppNotifications", {
        updateFailed: true,
        updatedType: "App",
        failureMessage: message,
        additionalData: action.payload,
      });
    }
  }
}

function* resentVerifiction(action) {
  const { navigation } = action;

  try {
    yield call(resendEmailVerification);

    const successMessage =
      "Verification email resent successfully. Please check your inbox.";

    if (navigation) {
      navigation.navigate("EmailNotifications", {
        updateSuccess: true,
        updatedType: "Verification",
        successMessage,
      });
    }
  } catch (error) {
    appLogger.logError("Error in resentVerifiction:", error);

    const failureMessage =
      "Failed to resend verification email. Please try again later.";

    if (navigation) {
      navigation.navigate("EmailNotifications", {
        updateFailed: true,
        updatedType: "Verification",
        failureMessage,
      });
    }
  }
}

function* logErrorSaga(action) {
  try {
    yield call(logError, action.payload);
  } catch (error) {
    appLogger.logError("API Error Response failed ============", error);
  }
}

function* logInfoSaga(action) {
  try {
    const response = yield call(logInfo, action.payload);
  } catch (error) {
    appLogger.logError("API Error Response:", error);
  }
}

// Add,Edit and delete User

function* addUser(action) {
  try {
    const response = yield call(addUserAction, action.payload);
    if (response) {
      action.navigation(true, "");
    }
  } catch (error) {
    if (error?.response) {
      action.navigation(false, error?.response.data);
    } else {
      action.navigation(false, "");
    }
    appLogger.logError("Error:", error);
  }
}

function* editUser(action) {
  try {
    yield call(editUserAction, action.payload);
    action.navigation(true);
  } catch (error) {
    action.navigation(false);
    appLogger.logError("Error", error.response.data);
  }
}

function* deleteUser(action) {
  try {
    yield call(removeUser, action.payload);
    action.navigation(true);
  } catch (error) {
    action.navigation(false);
    appLogger.logError("API Error Response:", error, action.payload); // Log the error response
  }
}
function* fetchSvEmails(action) {
  try {
    const response = yield call(fetchAllSvEmails);
    yield put(saveSvEmailAssociation(response));
  } catch (error) {
    appLogger.logError(
      "fetchAllSvEmails API Error Response:",
      error,
      action.payload
    ); // Log the error response
  }
}

function* handleAddSVEmailNoFlagsRequest(action) {
  try {
    const response = yield call(addSVEmailNoFlags, action.payload.email);
    if (action.navigation) action.navigation.navigate("SuccessScreen");
  } catch (error) {
    if (action.navigation) action.navigation.navigate("ErrorScreen");
  }
}

function* handleDeleteSVEmailRequest(action) {
  const { navigation } = action;
  const email = action.payload.email;
  const updatedList = updateEmailList([email], "delete");
  try {
    yield call(manageSVEmails, updatedList);

    const successMessage = `Email address (${email}) was deleted successfully.`;

    if (navigation) {
      navigation.navigate("EmailNotifications", {
        updateSuccess: true,
        updatedType: "Email",
        successMessage,
      });
    }
  } catch (error) {
    const failureMessage = `Failed to delete email address (${email}).`;

    if (navigation) {
      navigation.navigate("EmailNotifications", {
        updateFailed: true,
        updatedType: "Email",
        failureMessage,
      });
    }
  }
}

function* handleUpdateSVEmailsRequest(action) {
  try {
    const response = yield call(updateSVEmails, action.payload.emailList);
    // Navigate on success, if needed
    if (action.navigation) action.navigation.navigate("SuccessScreen");
  } catch (error) {
    // Handle navigation on failure
    if (navigation)
      navigation.navigate("AddEmailNotification", {
        updateFailed: true,
        updatedType: "Email",
      });
  }
}

function* handleManageEmailRequest(action) {
  const { email, isPaperless, isMarketing, newEmail } = action.payload;
  const { navigation } = action;
  try {
    let paperlessResponse = null;
    let marketingResponse = null;
    let successMessage = "";

    if (!isPaperless && !isMarketing) {
      const noFlagEmail = updateEmailList([email], null);
      yield call(manageSVEmails, noFlagEmail);
    } else if (isPaperless && isMarketing) {
      const offMarketing = updateEmailList([email], "add");
      [paperlessResponse, marketingResponse] = yield all([
        call(newEmail ? postEmailNotification : putEmailNotification, email),
        call(manageSVEmails, offMarketing),
      ]);
    } else {
      if (isPaperless) {
        paperlessResponse = yield call(
          newEmail ? postEmailNotification : putEmailNotification,
          email
        );
      }

      if (isMarketing) {
        const offMarketing = updateEmailList([email], "add");
        marketingResponse = yield call(manageSVEmails, offMarketing);
      }
    }
    successMessage = `Email address (${email}) was added successfully.`;
    if (paperlessResponse) {
      successMessage +=
        " Please note that changes to paperless billing status may take up to 24 hours to reflect.";
    }

    if (navigation) {
      navigation.navigate("EmailNotifications", {
        updateSuccess: true,
        updatedType: "Email",
        successMessage,
      });
    }
  } catch (error) {
    appLogger.logError("Error in handleManageEmailRequest:", error);
    if (navigation) {
      navigation.navigate("AddEmailNotification", {
        updateFailed: true,
        updatedType: "Email",
      });
    }
  }
}

function* handleUpdateEmailAssociations(action) {
  const { paperlessEmail, marketingEmails } = action.payload;
  const { navigation } = action;
  const updatedList = updateEmailList(marketingEmails, "Update");
  try {
    let paperlessResponse = null;
    let marketingResponse = null;
    let successMessage = "";

    if (paperlessEmail && marketingEmails && marketingEmails.length > 0) {
      [paperlessResponse, marketingResponse] = yield all([
        call(unsubscribPaperLess),
        call(manageSVEmails, updatedList),
      ]);
      successMessage =
        "Email updated for both paperless billing and marketing. ";
    } else {
      if (paperlessEmail) {
        paperlessResponse = yield call(unsubscribPaperLess);
        successMessage =
          "Your paperless email preferences have been successfully updated. ";
      }

      if (marketingEmails && marketingEmails.length > 0) {
        marketingResponse = yield call(manageSVEmails, updatedList);
        successMessage +=
          "Your marketing email preferences have been successfully updated.";
      }
    }

    if (paperlessResponse) {
      successMessage +=
        "Please note that changes to paperless billing status may take up to 24 hours to reflect.";
    }

    if (paperlessResponse || marketingResponse) {
      if (navigation) {
        navigation.navigate("EmailNotifications", {
          updateSuccess: true,
          updatedType: "Email",
          successMessage,
        });
      }
    }
  } catch (error) {
    appLogger.logError("Error in handleUpdateEmailAssociations:", error);

    if (navigation) {
      navigation.navigate("EmailNotifications", {
        updateFailed: true,
        updatedType: "Email",
      });
    }
  }
}

export function* checkPaperlessSaga(action) {
  const controller = new AbortController();
  try {
    yield put(setLoading(true));
    const status = yield call(
      isPaperlessEnabled,
      action.payload.email,
      controller.signal
    );
    yield put(setPaperlessStatus(status));
  } catch (error) {
    appLogger.logError("Error fetching ACP user isPaperlessEnabled:", error);
  } finally {
    if (yield cancelled()) controller.abort();
    yield put(clearLoading());
  }
}

const ACCOUNT_DETAILS_FRESHNESS_WINDOW_MS = 60_000;

// Tracked separately so a screen-focus fetch can never cancel a force-refresh.
let inFlightForceController = null;
let inFlightNonForceController = null;

function* fetchACPUserAccountDetailsSaga(action) {
  const force = action?.payload?.force === true;

  if (inFlightForceController) {
    return;
  }

  if (inFlightNonForceController) {
    if (force) {
      const previousNonForceController = inFlightNonForceController;
      inFlightNonForceController = null;
      previousNonForceController.abort();
    } else {
      return;
    }
  }

  if (!force) {
    const lastFetchedAt = yield select(
      (state) => state.profile?.accountDetailsFetchedAt
    );
    if (
      lastFetchedAt &&
      Date.now() - lastFetchedAt < ACCOUNT_DETAILS_FRESHNESS_WINDOW_MS
    ) {
      return;
    }
  }

  const controller = new AbortController();
  if (force) {
    inFlightForceController = controller;
  } else {
    inFlightNonForceController = controller;
  }

  yield put(setLoading(true));
  try {
    const accountData = yield call(
      fetchACPUserAccountDetails,
      controller.signal,
      force
    );

    if (!accountData) {
      return;
    }

    yield put(saveACPUserAccountDetails(accountData));

    const email = getPrimaryEmail(accountData);

    if (!email) {
      return; // Exit if no email found
    }

    const paperlessStatus = yield call(
      isPaperlessEnabled,
      email,
      controller.signal
    );

    yield put(setPaperlessStatus(paperlessStatus));
  } catch (error) {
    const isCancelled =
      error?.name === "CanceledError" ||
      error?.code === "ERR_CANCELED" ||
      error?.message === "canceled";
    if (!isCancelled) {
      appLogger.logError("Error in account/paperless fetch:", error);
    }
  } finally {
    if (force && inFlightForceController === controller) {
      inFlightForceController = null;
    }
    if (!force && inFlightNonForceController === controller) {
      inFlightNonForceController = null;
    }
    yield put(clearLoading());

    if (yield cancelled()) {
      controller.abort();
    }
  }
}

function* ProfileSagas() {
  yield takeLatest(FETCH_PROFILE_DETAILS, fetchProfileDetails);
  yield takeLatest(FETCH_USER_LIST, getProfileUsers);
  yield takeLatest(FETCH_SMS_SELECTION, fetchSMSSubs);
  yield takeLatest(FETCH_EMIAL_SELECTION, fetchPaperlessBills);
  yield takeLatest(FETCH_PAPERLESS, fetchPaperlessDetails);
  yield takeLatest(FETCH_PUSH_NOTIFICATIONS, getPushNotifications);
  yield takeLatest(UPDATE_PROFILE_REQUEST, updateProfile);
  yield takeLatest(UPDATE_PROFILE_SECURITY, handleUpdateProfileSecurity);
  yield takeLatest(UPDATE_TEXT_NOTIFICATION, updateTextNotification);
  yield takeLatest(UPDATE_EMAIL_NOTIFICATION, updateEmailNotification);
  yield takeLatest(UPDATE_TERMS_AND_CONDITIONS, updateTermsAndConditions);
  yield takeLatest(UPDATE_PUSH_NOTIFICATIONS, updatePushNotifications);
  yield takeLatest(UPDATE_PUSH_NOTIFICATIONS_V2, updatePushNotificationsV2);
  yield takeLatest(UNSUBSCRIBE_PAPERLESS, unsubscribPaperLessSaga);
  yield takeLatest(SAVE_USER_FEEDBACK, saveUserFeedBack);
  yield takeLatest(UPDATE_EXISTING_EMAIL_NOTIFICATION, updateNewEmail);
  yield takeLatest(RESEND_EMAIL_VERIFICTION, resentVerifiction);
  yield takeLatest(ADD_NEW_USER, addUser);
  yield takeLatest(DELETE_USER, deleteUser);
  yield takeLatest(EDIT_USER, editUser);
  yield takeLatest(LOG_ERROR, logErrorSaga);
  yield takeLatest(LOG_INFO, logInfoSaga);
  yield takeLatest(ALLSVEMAILASSOCIATED, fetchSvEmails);
  yield takeLatest(
    ADD_SV_EMAIL_NO_FLAGS_REQUEST,
    handleAddSVEmailNoFlagsRequest
  );
  yield takeLatest(DELETE_SV_EMAIL_REQUEST, handleDeleteSVEmailRequest);
  yield takeLatest(UPDATE_SV_EMAILS_REQUEST, handleUpdateSVEmailsRequest);
  yield takeLatest(MANAGE_EMAIL_REQUEST, handleManageEmailRequest);
  yield takeLatest(UPDATE_EMAIL_ASSOCIATIONS, handleUpdateEmailAssociations);
  yield takeLeading(GET_PAPERLESS_STATUS, checkPaperlessSaga);
  yield takeEvery(
    FETCH_ACP_USER_ACCOUNT_DETAILS,
    fetchACPUserAccountDetailsSaga
  );
}
export default ProfileSagas;
