import { useState, useEffect } from 'react';
import { MOCK_SERVICE_DATA } from '../utils/mockData';

/**
 * Hook to fetch service details
 * Currently returns mock data, will be replaced with real API calls
 * 
 * @param {string} accountNumber - User's account number
 * @returns {object} - { data, loading, error, refetch }
 */
export const useServiceDetails = (accountNumber) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchServiceDetails = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // TODO: Replace with real API call
      // const response = await axios.get(
      //   `/api/Plan/GetServiceDetails?accountNumber=${accountNumber}&includeEquipment=true&includeLocation=true`
      // );
      // setData(response.data);
      
      // For now, return mock data
      setData(MOCK_SERVICE_DATA);
      
    } catch (err) {
      setError(err.message || 'Failed to fetch service details');
      console.error('Error fetching service details:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (accountNumber) {
      fetchServiceDetails();
    }
  }, [accountNumber]);

  return {
    data,
    loading,
    error,
    refetch: fetchServiceDetails,
  };
};
