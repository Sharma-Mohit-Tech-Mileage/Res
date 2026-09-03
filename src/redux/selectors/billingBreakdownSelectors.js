import { createSelector } from 'reselect';

// Basic selectors
const getBillingBreakdownState = state => state.billingBreakdown;

// Basic selectors
const getBillExplainerState = state => state.billingBreakdown.explainerData;

// Extract breakdown data from serviceDetailGroups with failsafe
export const selectServiceDetailGroups = createSelector(
  [getBillingBreakdownState],
  (billingBreakdownState) => {
    try {
      // Return the serviceDetailGroups array as the breakdown data
      return billingBreakdownState.breakdownData?.serviceDetails?.serviceDetailGroups || [];
    } catch (error) {
      console.warn("Error accessing serviceDetailGroups:", error.message);
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
      console.warn("Error accessing total due:", error.message);
      return 0;
    }
  }
);



export const selectBillExplainerData = createSelector(
  [getBillExplainerState],
  (explainerData) => {
    try {
      // Return the explainer data
      return explainerData || {};
    } catch (error) {
      console.warn("Error accessing bill explainer data:", error.message);
      return {};
    }
  }
);


// For consistent naming, keep the existing selectBillingBreakDownData 
// but make it use the serviceDetailGroups data
export const selectBillingBreakDownData = selectServiceDetailGroups;