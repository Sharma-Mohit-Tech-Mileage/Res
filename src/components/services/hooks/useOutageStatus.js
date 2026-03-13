import { useCallback, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  checkOutageStatusRequest,
  clearOutageData
} from '../../../redux/actions/servicesActions';
import {
  selectOutageData,
  selectOutageChecking,
  selectOutageError
} from '../../../redux/selectors/servicesSelectors';

export const useOutageStatus = () => {
  const dispatch = useDispatch();
  const outageData = useSelector(selectOutageData);
  const checking = useSelector(selectOutageChecking);
  const error = useSelector(selectOutageError);

  useEffect(() => {
    if (outageData) {
      console.log("[useOutageStatus] Outage data received:", JSON.stringify(outageData, null, 2));
    }
    if (error) {
      console.error("[useOutageStatus] Error state:", error);
    }
  }, [outageData, error]);

  const checkStatus = useCallback(() => {
    console.log("[useOutageStatus] checkStatus triggered");
    dispatch(checkOutageStatusRequest());
  }, [dispatch]);

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