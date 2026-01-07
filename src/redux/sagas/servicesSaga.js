import { call, put, takeLatest } from "redux-saga/effects";
import moment from "moment";
import * as types from "../constants/servicesTypes";
import * as actions from "../actions/servicesActions";
import servicesApi from "../../network/apis/services/services.service";

function* fetchServiceDetailsSaga(action) {
  try {
    const { accountNumber } = action.payload;

    const response = yield call(servicesApi.fetchServiceDetails, accountNumber);

    const transformedData = transformServiceData(response);

    yield put(actions.fetchServiceDetailsSuccess(transformedData));
  } catch (error) {
    yield put(
      actions.fetchServiceDetailsFailure(
        error.message || "Failed to fetch service details"
      )
    );
  }
}

function transformServiceData(apiResponse) {
  const bundles = apiResponse.product_bundles || [];

  let internetData = { hasService: false };
  let videoData = { hasService: false };
  let phoneData = { hasService: false };

  bundles.forEach((bundle) => {
    if (bundle.hsd_services && bundle.hsd_services.length > 0) {
      const hsd = bundle.hsd_services[0];
      internetData = {
        hasService: true,
        planName: hsd.product_name,
        downloadSpeed: hsd.download_speed || 0,
        uploadSpeed: hsd.upload_speed || 0,
        unit: "Mbps",
      };
    }

    if (bundle.video_services && bundle.video_services.length > 0) {
      const video = bundle.video_services[0];
      videoData = {
        hasService: true,
        planName: video.product_name,
        zipCode: null, // TODO: Get from user state or Accounts API
      };
    }

    if (bundle.voice_services && bundle.voice_services.length > 0) {
      const voice = bundle.voice_services[0];
      phoneData = {
        hasService: true,
        planName: voice.product_name,
        legacyBrand: null, // TODO: Get from user state or Accounts API
      };
    }
  });

  return {
    internet: internetData,
    video: videoData,
    phone: phoneData,
  };
}

function* checkOutageStatusSaga() {
  try {
    yield put(actions.clearOutageData());
    const minDelay = new Promise((resolve) => setTimeout(resolve, 5000));

    const [response] = yield Promise.all([
      call(servicesApi.checkOutageStatus),
      minDelay,
    ]);

    const transformedOutageData = transformOutageData(response);
    yield put(actions.checkOutageStatusSuccess(transformedOutageData));
  } catch (error) {
    const minDelay = new Promise((resolve) => setTimeout(resolve, 5000));
    yield minDelay;

    const errorData = {
      hasOutage: false,
      status: "error",
      title: "Error",
      message: "Unable to check service status.\n\nPlease try again later.",
      lastChecked: new Date().toISOString(),
      affectedServices: [],
    };

    yield put(actions.checkOutageStatusSuccess(errorData));
  }
}

function transformOutageData(apiResponse) {
  const hasOutage =
    apiResponse?.error === false && apiResponse?.outageStatus === true;

  if (hasOutage) {
    const estimatedRestoreTime = apiResponse.restoredBy
      ? moment(apiResponse.restoredBy).format("LT")
      : "TBD";

    return {
      hasOutage: true,
      status: "outage",
      title: "Outage Notification",
      message: `Our systems show that you may be experiencing an outage related to your internet service.\n\nWe are working to restore service as soon as possible.\n\nEstimated Time to Restore: ${estimatedRestoreTime}.`,
      estimatedRestoreTime: estimatedRestoreTime,
      lastChecked: new Date().toISOString(),
      affectedServices: ["internet"],
    };
  } else {
    return {
      hasOutage: false,
      status: "operational",
      title: "No Outages Detected",
      message:
        "Currently, we do not detect an outage in your area. If you are still experiencing issues, please contact us at 877-692-2253.\n\nIf you prefer, you may sign up or manage your notification settings.",
      lastChecked: new Date().toISOString(),
      affectedServices: [],
      splitKey: [
        {
          text: "877-692-2253",
          action: "call",
          value: "8776922253",
        },
        {
          text: "sign up or manage your notification settings",
          action: "navigate",
          tab: "account", 
          screen: "Notifications", 
        },
      ],
    };
  }
}

export function* watchServicesActions() {
  yield takeLatest(
    types.FETCH_SERVICE_DETAILS_REQUEST,
    fetchServiceDetailsSaga
  );
  yield takeLatest(types.CHECK_OUTAGE_STATUS_REQUEST, checkOutageStatusSaga);
}

export default watchServicesActions;
