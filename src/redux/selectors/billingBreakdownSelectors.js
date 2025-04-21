import { createSelector } from 'reselect';

// Basic selectors
const getBillingBreakdownState = state => state.combinedReducers.billingBreakdown;

// Extract breakdown data from serviceDetailGroups with failsafe
export const selectServiceDetailGroups = createSelector(
  [getBillingBreakdownState],
  (billingBreakdownState) => {
    try {
      // Return the serviceDetailGroups array as the breakdown data
      return billingBreakdownState.breakdownData?.serviceDetails?.serviceDetailGroups || [];
    } catch (error) {
      console.error("Error accessing serviceDetailGroups:", error.message);
      return [];
    }
  }
);

// Select loading state
export const selectBillingBreakDownLoading = createSelector(
  [getBillingBreakdownState],
  (billingBreakdownState) => billingBreakdownState.loading
);

// Select error state
export const selectBillingBreakDownError = createSelector(
  [getBillingBreakdownState],
  (billingBreakdownState) => billingBreakdownState.error
);

// Select total due
export const selectTotalDue = createSelector(
  [getBillingBreakdownState],
  (billingBreakdownState) => {
    try {
      return billingBreakdownState.data?.statementSummary?.total?.amount || 0;
    } catch (error) {
      console.error("Error accessing total due:", error.message);
      return 0;
    }
  }
);

// For consistent naming, keep the existing selectBillingBreakDownData 
// but make it use the serviceDetailGroups data
export const selectBillingBreakDownData = selectServiceDetailGroups;