import { useCallback } from 'react';
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

  const checkStatus = useCallback(() => {
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