import { call, put, takeLatest, select } from 'redux-saga/effects';
import * as types from '../constants/paymentHistoryTypes';
import * as actions from '../actions/paymentHistoryActions';
import paymentHistoryApi from '../../network/apis/account/payments.service';
import { selectAllPayments } from '../selectors/paymentHistorySelectors';

function* fetchPaymentHistorySaga() {
  try {
    // Call API
    const payments = yield call(paymentHistoryApi.fetchPaymentHistory);
    console.log('Fetched payment history:', payments);

    // Check if payments is a valid array before proceeding
    if (!Array.isArray(payments) || payments.length === 0) {
      yield put(actions.fetchPaymentHistorySuccess([])); // Dispatch empty array
      return;
    }

    // Dispatch success action with data
    yield put(actions.fetchPaymentHistorySuccess(payments));
  } catch (error) {
    console.error('Error in fetchPaymentHistorySaga:', error);
    // Dispatch error action
    yield put(actions.fetchPaymentHistoryFailure(error.message || 'Failed to fetch payment history'));
  }
}

function* downloadPaymentReceiptSaga(action) {
  try {
    const { paymentId } = action.payload;
    
    // Get payment details from state (if needed)
    const payments = yield select(selectAllPayments);
    const payment = payments.find(p => p.extTransactionId === paymentId);
    
    if (!payment) {
      throw new Error('Payment not found');
    }
    
    // Call API to get receipt data
    const responseData = yield call(
      paymentHistoryApi.downloadPaymentReceipt,
      paymentId
    );

    if (responseData.fileBinary) {
      // Dispatch success action with receipt data
      yield put(actions.downloadPaymentReceiptSuccess({ fileBinary: responseData.fileBinary }));
    } else {
      throw new Error('Receipt data is missing');
    }
  } catch (error) {
    console.log('Error downloading payment receipt:', error);
    // Dispatch error action
    yield put(actions.downloadPaymentReceiptFailure(error.message || 'Failed to download receipt'));
  }
}

// Watcher Saga: Watch for payment history actions
export function* watchPaymentHistoryActions() {
  yield takeLatest(types.FETCH_PAYMENT_HISTORY_REQUEST, fetchPaymentHistorySaga);
  yield takeLatest(types.DOWNLOAD_PAYMENT_RECEIPT_REQUEST, downloadPaymentReceiptSaga);
}

export default watchPaymentHistoryActions;