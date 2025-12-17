import { call, put, takeLatest } from 'redux-saga/effects';
import moment from 'moment'; 
import * as types from '../constants/servicesTypes';
import * as actions from '../actions/servicesActions';
import servicesApi from '../../network/apis/services/services.service';

// ========== Service Details Saga ==========
function* fetchServiceDetailsSaga(action) {
  try {
    const { accountNumber } = action.payload;
    
    // Call API
    const response = yield call(servicesApi.fetchServiceDetails, accountNumber);
    
    // Transform API response to match component structure
    const transformedData = transformServiceData(response);
    
    // Dispatch success action
    yield put(actions.fetchServiceDetailsSuccess(transformedData));
  } catch (error) {
    yield put(actions.fetchServiceDetailsFailure(error.message || 'Failed to fetch service details'));
  }
}

// Transform function to convert API response to component format
function transformServiceData(apiResponse) {
  const bundles = apiResponse.product_bundles || [];
  
  let internetData = { hasService: false };
  let videoData = { hasService: false };
  let phoneData = { hasService: false };
  
  bundles.forEach(bundle => {
    // Internet Service
    if (bundle.hsd_services && bundle.hsd_services.length > 0) {
      const hsd = bundle.hsd_services[0];
      internetData = {
        hasService: true,
        planName: hsd.product_name,
        downloadSpeed: hsd.download_speed || 0,
        uploadSpeed: hsd.upload_speed || 0,
        unit: "Mbps"
      };
    }
    
    // Video Service
    if (bundle.video_services && bundle.video_services.length > 0) {
      const video = bundle.video_services[0];
      videoData = {
        hasService: true,
        planName: video.product_name,
        zipCode: null // TODO: Get from user state or Accounts API
      };
    }
    
    // Voice/Phone Service
    if (bundle.voice_services && bundle.voice_services.length > 0) {
      const voice = bundle.voice_services[0];
      phoneData = {
        hasService: true,
        planName: voice.product_name,
        legacyBrand: null // TODO: Get from user state or Accounts API
      };
    }
  });
  
  return {
    internet: internetData,
    video: videoData,
    phone: phoneData
  };
}

// ========== Outage Status Saga ==========
function* checkOutageStatusSaga() {
  try {
    // Call API
    const response = yield call(servicesApi.checkOutageStatus);
    
    // Transform to match component format (same logic as Home screen)
    const transformedOutageData = transformOutageData(response);
    
    // Dispatch success action
    yield put(actions.checkOutageStatusSuccess(transformedOutageData));
  } catch (error) {
    // On error, show error state
    const errorData = {
      hasOutage: false,
      status: "error",
      title: "Error",
      message: "Unable to check service status. Please try again later.",
      lastChecked: new Date().toISOString(),
      affectedServices: []
    };
    
    yield put(actions.checkOutageStatusSuccess(errorData));
  }
}

// Transform outage data - matches Home screen logic
function transformOutageData(apiResponse) {
  // Check if there's an outage (same check as Home screen)
  const hasOutage = apiResponse?.error === false && apiResponse?.outageStatus === true;
  
  if (hasOutage) {
    // Format restore time (same as Home screen)
    const estimatedRestoreTime = apiResponse.restoredBy 
      ? moment(apiResponse.restoredBy).format("LT")
      : "TBD";
    
    // Return OUTAGE message
    return {
      hasOutage: true,
      status: "outage",
      title: "Outage Notification",
      message: `Our systems show that you may be experiencing an outage related to your internet service. We are working to restore service as soon as possible. Estimated Time to Restore: ${estimatedRestoreTime}.`,
      estimatedRestoreTime: estimatedRestoreTime,
      lastChecked: new Date().toISOString(),
      affectedServices: ["internet"]
    };
  } else {
    // Return NO OUTAGE message
    return {
      hasOutage: false,
      status: "operational",
      title: "No Outages Detected",
      message: "Currently, we do not detect an outage in your area. If you are still experiencing issues, please contact us at 877-692-2253. If you prefer, you may sign up or manage your notification settings.",
      lastChecked: new Date().toISOString(),
      affectedServices: []
    };
  }
}

// ========== Watcher Saga ==========
export function* watchServicesActions() {
  yield takeLatest(types.FETCH_SERVICE_DETAILS_REQUEST, fetchServiceDetailsSaga);
  yield takeLatest(types.CHECK_OUTAGE_STATUS_REQUEST, checkOutageStatusSaga);
}

export default watchServicesActions;