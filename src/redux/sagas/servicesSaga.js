import { call, put, takeLatest } from "redux-saga/effects";
import moment from "moment";
import * as types from "../constants/servicesTypes";
import * as actions from "../actions/servicesActions";
import servicesApi from "../../network/apis/services/services.service";
import dataUsageApi from "../../network/apis/services/dataUsageService";

function* fetchServiceDetailsSaga(action) {
  try {
    const { accountNumber } = action.payload;
    console.log("[ServicesSaga] fetchServiceDetails called with accountNumber:", accountNumber);

    const response = yield call(servicesApi.fetchServiceDetails, accountNumber);
    console.log("[ServicesSaga] fetchServiceDetails raw API response:", JSON.stringify(response, null, 2));

    const transformedData = transformServiceData(response);
    console.log("[ServicesSaga] fetchServiceDetails transformed data:", JSON.stringify(transformedData, null, 2));

    yield put(actions.fetchServiceDetailsSuccess(transformedData));
    console.log("[ServicesSaga] fetchServiceDetails SUCCESS dispatched");
  } catch (error) {
    console.error("[ServicesSaga] fetchServiceDetails FAILED:", error?.message, error);
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
    console.log("[ServicesSaga] checkOutageStatus called");
    yield put(actions.clearOutageData());
    const minDelay = new Promise((resolve) => setTimeout(resolve, 5000));

    const [response] = yield Promise.all([
      call(servicesApi.checkOutageStatus),
      minDelay,
    ]);
    console.log("[ServicesSaga] checkOutageStatus raw API response:", JSON.stringify(response, null, 2));

    const transformedOutageData = transformOutageData(response);
    console.log("[ServicesSaga] checkOutageStatus transformed data:", JSON.stringify(transformedOutageData, null, 2));

    yield put(actions.checkOutageStatusSuccess(transformedOutageData));
    console.log("[ServicesSaga] checkOutageStatus SUCCESS dispatched");
  } catch (error) {
    console.error("[ServicesSaga] checkOutageStatus FAILED:", error?.message, error);
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

// ========== Data Usage Sagas ==========

function* fetchCurrentUsageSaga() {
  try {
    console.log("[ServicesSaga] fetchCurrentUsage called");
    const response = yield call(dataUsageApi.getCurrentUsage);
    console.log("[ServicesSaga] fetchCurrentUsage response:", JSON.stringify(response, null, 2));
    yield put(actions.fetchCurrentUsageSuccess(response));
  } catch (error) {
    const status = error?.response?.status;
    console.error("[ServicesSaga] fetchCurrentUsage FAILED:", status, error?.message);
    if (status === 404 || status === 204) {
      yield put(actions.fetchCurrentUsageSuccess(null));
    } else {
      yield put(actions.fetchCurrentUsageFailure(error.message || "Failed to fetch current usage"));
    }
  }
}

function* fetchMonthlyUsageSaga() {
  try {
    console.log("[ServicesSaga] fetchMonthlyUsage called");
    const response = yield call(dataUsageApi.getMonthlyUsage);
    console.log("[ServicesSaga] fetchMonthlyUsage response:", JSON.stringify(response, null, 2));
    yield put(actions.fetchMonthlyUsageSuccess(response));
  } catch (error) {
    const status = error?.response?.status;
    console.error("[ServicesSaga] fetchMonthlyUsage FAILED:", status, error?.message);
    if (status === 404 || status === 204) {
      yield put(actions.fetchMonthlyUsageSuccess([]));
    } else {
      yield put(actions.fetchMonthlyUsageFailure(error.message || "Failed to fetch monthly usage"));
    }
  }
}

function* fetchDailyUsageSaga(action) {
  try {
    const { startDate, endDate } = action.payload;
    console.log("[ServicesSaga] fetchDailyUsage called:", startDate, "→", endDate);
    const response = yield call(dataUsageApi.getDailyUsage, startDate, endDate);
    console.log("[ServicesSaga] fetchDailyUsage response:", JSON.stringify(response, null, 2));
    yield put(actions.fetchDailyUsageSuccess(response || []));
  } catch (error) {
    const status = error?.response?.status;
    console.error("[ServicesSaga] fetchDailyUsage FAILED:", status, error?.message);
    if (status === 404 || status === 204) {
      // No data for this period — treat as empty, not an error
      console.log("[ServicesSaga] No daily data available for this period");
      yield put(actions.fetchDailyUsageSuccess([]));
    } else {
      yield put(actions.fetchDailyUsageFailure(error.message || "Failed to fetch daily usage"));
    }
  }
}

function* fetchUsagePeriodsSaga() {
  try {
    console.log("[ServicesSaga] fetchUsagePeriods called");
    const response = yield call(dataUsageApi.getUsagePeriods);
    console.log("[ServicesSaga] fetchUsagePeriods response:", JSON.stringify(response, null, 2));
    yield put(actions.fetchUsagePeriodsSuccess(response));
  } catch (error) {
    console.error("[ServicesSaga] fetchUsagePeriods FAILED:", error?.message, error);
    yield put(actions.fetchUsagePeriodsFailure(error.message || "Failed to fetch usage periods"));
  }
}

export function* watchServicesActions() {
  yield takeLatest(
    types.FETCH_SERVICE_DETAILS_REQUEST,
    fetchServiceDetailsSaga
  );
  yield takeLatest(types.CHECK_OUTAGE_STATUS_REQUEST, checkOutageStatusSaga);

  // Data Usage watchers
  yield takeLatest(types.FETCH_CURRENT_USAGE_REQUEST, fetchCurrentUsageSaga);
  yield takeLatest(types.FETCH_MONTHLY_USAGE_REQUEST, fetchMonthlyUsageSaga);
  yield takeLatest(types.FETCH_DAILY_USAGE_REQUEST, fetchDailyUsageSaga);
  yield takeLatest(types.FETCH_USAGE_PERIODS_REQUEST, fetchUsagePeriodsSaga);
}

export default watchServicesActions;
