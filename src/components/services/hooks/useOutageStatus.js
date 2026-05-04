import { useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  checkOutageStatusRequest,
  clearOutageData
} from '../../../redux/actions/servicesActions';
import {
  selectOutageData,
  selectOutageCheckingDashboard,
  selectOutageCheckingServices,
  selectOutageError
} from '../../../redux/selectors/servicesSelectors';

// `source` is 'dashboard' or 'services'. Each caller reads only its own spinner flag,
// so a fetch triggered by the dashboard does not light up the services spinner.
// The result (`outageData`) is shared, so a fresh fetch from either screen benefits both.
export const useOutageStatus = (source = 'services') => {
  const dispatch = useDispatch();
  const outageData = useSelector(selectOutageData);
  const checking = useSelector(
    source === 'dashboard' ? selectOutageCheckingDashboard : selectOutageCheckingServices
  );
  const error = useSelector(selectOutageError);

  const checkStatus = useCallback(() => {
    dispatch(checkOutageStatusRequest(source));
  }, [dispatch, source]);

  const clearOutageDataCallback = useCallback(() => {
    dispatch(clearOutageData());
  }, [dispatch]);

  return {
    outageData,
    checking,
    error,
    checkStatus,
    clearOutageData: clearOutageDataCallback,
  };
};