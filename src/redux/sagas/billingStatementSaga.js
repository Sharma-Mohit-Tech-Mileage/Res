import { call, put, takeLatest, select } from 'redux-saga/effects';
import * as types from '../constants/billingStatementTypes';
import * as actions from '../actions/billingStatementActions';
import billingStatementApi from '../../network/apis/account/billings.service';
import { selectAllStatements } from '../selectors/billingStatementSelectors';

function* fetchBillingStatementsSaga() {
  try {
    // Call API
    const statements = yield call(billingStatementApi.fetchBillingStatements);

    // Check if statements is a valid array before proceeding
    if (!Array.isArray(statements) || statements.length === 0) {
      yield put(actions.fetchBillingStatementsSuccess([])); // Dispatch empty array
      return;
    }

    // Transform data if needed before dispatching success action
    const transformedStatements = statements.map(statement => ({
      id: statement.statement_id,
      accountNumber: statement.account_number,
      date: statement.cycle_date,
      expirationDate: statement.statement_id_expiration
    }));

    // Dispatch success action with transformed data
    yield put(actions.fetchBillingStatementsSuccess(transformedStatements));
  } catch (error) {
    // Dispatch error action only for actual API failures
    yield put(actions.fetchBillingStatementsFailure(error.message || 'Failed to fetch statements'));
  }
}

function* downloadStatementSaga(action) {
  try {
    const { statementId } = action.payload;
    
    // Get statement details from state to access account number
    const statements = yield select(selectAllStatements);
    const statement = statements.find(s => s.id === statementId);
    
    if (!statement) {
      throw new Error('Statement not found');
    }
    
    // Call API to get statement blob
    const responseData = yield call(
      billingStatementApi.downloadStatement,
      statementId
    );

    if (responseData.fileBinary) {
      const base64Data = responseData.fileBinary;
      // Dispatch success action with base64 data
      yield put(actions.downloadStatementSuccess({ fileBinary: base64Data }));
    } else {
      throw new Error('File binary data is missing');
    }
  } catch (error) {
    console.warn('Error downloading statement:', error);
    // Dispatch error action
    yield put(actions.downloadStatementFailure(error.message || 'Failed to download statement'));
  }
}

// Watcher Saga: Watch for billing statement actions
export function* watchBillingStatementActions() {
  yield takeLatest(types.FETCH_BILLING_STATEMENTS_REQUEST, fetchBillingStatementsSaga);
  yield takeLatest(types.DOWNLOAD_STATEMENT_REQUEST, downloadStatementSaga);
}

export default watchBillingStatementActions;