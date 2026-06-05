import { useEffect, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchServiceDetailsRequest } from '../../../redux/actions/servicesActions';
import { 
  selectServiceData, 
  selectServiceLoading, 
  selectServiceError 
} from '../../../redux/selectors/servicesSelectors';

export const useServiceDetails = (accountNumber) => {
  const dispatch = useDispatch();
  const data = useSelector(selectServiceData);
  const loading = useSelector(selectServiceLoading);
  const error = useSelector(selectServiceError);

  useEffect(() => {
    if (accountNumber) {
      dispatch(fetchServiceDetailsRequest(accountNumber));
    }
  }, [accountNumber, dispatch]);

  const refetch = useCallback(() => {
    if (accountNumber) {
      dispatch(fetchServiceDetailsRequest(accountNumber));
    }
  }, [accountNumber, dispatch]);

  return {
    data,
    loading,
    error,
    refetch,
  };
};