import { useState } from 'react';
import { OUTAGE_SCENARIOS, CURRENT_OUTAGE_SCENARIO } from '../utils/mockData';

/**
 * Hook to check service outage status
 * Currently uses mock data, will be replaced with real API calls
 * 
 * @returns {object} - { outageData, checking, checkStatus }
 */
export const useOutageStatus = () => {
  const [outageData, setOutageData] = useState(null);
  const [checking, setChecking] = useState(false);
  const [error, setError] = useState(null);

  const checkStatus = async () => {
    try {
      setChecking(true);
      setError(null);
      
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // TODO: Replace with real API call
      // const response = await axios.get('/api/Outage/GetOutages');
      // setOutageData(response.data);
      
      // For now, use mock data based on current scenario
      const scenario = OUTAGE_SCENARIOS[CURRENT_OUTAGE_SCENARIO];
      setOutageData(scenario);
      
    } catch (err) {
      setError(err.message || 'Failed to check service status');
      console.error('Error checking outage status:', err);
      
      // Show error state
      setOutageData({
        hasOutage: false,
        status: "error",
        message: "Unable to check service status. Please try again later.",
        title: "Error",
      });
    } finally {
      setChecking(false);
    }
  };

  const clearOutageData = () => {
    setOutageData(null);
  };

  return {
    outageData,
    checking,
    error,
    checkStatus,
    clearOutageData,
  };
};
