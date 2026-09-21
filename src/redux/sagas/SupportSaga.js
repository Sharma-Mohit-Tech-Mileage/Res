// Support-desk sagas. Split out of ProfileSaga so feedback stops living inside profile/account concerns.
import { takeLatest, call } from "redux-saga/effects";
import { SAVE_USER_FEEDBACK } from "../constants";
import { submitFeedback } from "../../network/apis/support/feedback.service";

function* saveUserFeedback(action) {
  try {
    yield call(submitFeedback, action.payload);
    action.navigation.navigate("ThumbsUp", { updateSuccess: true });
  } catch (error) {
    action.navigation.navigate("Feedback", { updateFailed: true });
  }
}

export default function* SupportSagas() {
  yield takeLatest(SAVE_USER_FEEDBACK, saveUserFeedback);
}
