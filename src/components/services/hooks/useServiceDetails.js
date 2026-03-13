import { useEffect } from 'react';
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
    console.log("[useServiceDetails] Hook mounted — accountNumber:", accountNumber, "| loading:", loading, "| hasData:", !!data, "| error:", error);
    if (accountNumber) {
      console.log("[useServiceDetails] Dispatching fetchServiceDetailsRequest");
      dispatch(fetchServiceDetailsRequest(accountNumber));
    } else {
      console.warn("[useServiceDetails] No accountNumber provided — skipping API call");
    }
  }, [accountNumber, dispatch]);

  useEffect(() => {
    if (data) {
      console.log("[useServiceDetails] Data received:", JSON.stringify(data, null, 2));
    }
    if (error) {
      console.error("[useServiceDetails] Error state:", error);
    }
  }, [data, error]);

  const refetch = () => {
    if (accountNumber) {
      console.log("[useServiceDetails] Refetch triggered for:", accountNumber);
      dispatch(fetchServiceDetailsRequest(accountNumber));
    }
  };

  return {
    data,
    loading,
    error,
    refetch,
  };
};