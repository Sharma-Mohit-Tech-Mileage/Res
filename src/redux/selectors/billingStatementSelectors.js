import { createSelector } from 'reselect';

// Basic selectors
const getBillingStatementState = state => state.billingStatements;

// Select all statements
export const selectAllStatements = createSelector(
  [getBillingStatementState],
  (billingStatementState) => billingStatementState.statements
);

// Select loading state
export const selectLoading = createSelector(
  [getBillingStatementState],
  (billingStatementState) => billingStatementState.loading
);

// Select error state
export const selectError = createSelector(
  [getBillingStatementState],
  (billingStatementState) => billingStatementState.error
);

// Select downloading state
export const selectDownloading = createSelector(
  [getBillingStatementState],
  (billingStatementState) => billingStatementState.downloading
);

// Select download error
export const selectDownloadError = createSelector(
  [getBillingStatementState],
  (billingStatementState) => billingStatementState.downloadError
);

// Select selected year
export const selectSelectedYear = createSelector(
  [getBillingStatementState],
  (billingStatementState) => billingStatementState.selectedYear
);

// Select sort direction
export const selectSortDirection = createSelector(
  [getBillingStatementState],
  (billingStatementState) => billingStatementState.sortDirection
);

// Select downloaded statement
export const selectDownloadedStatement = createSelector(
  [getBillingStatementState],
  (billingStatementState) => billingStatementState.downloadedStatement
);

// Select statements filtered by selected year and sorted accordingly
export const selectFilteredAndSortedStatements = createSelector(
  [selectAllStatements, selectSelectedYear, selectSortDirection],
  (statements, selectedYear, sortDirection) => {
    // Filter by year
    const filteredStatements = statements.filter(statement => {
      const statementYear = new Date(statement.date).getFullYear().toString();
      return statementYear === selectedYear;
    });
    
    // Sort by date
    return [...filteredStatements].sort((a, b) => {
      const dateA = new Date(a.date);
      const dateB = new Date(b.date);
      
      if (sortDirection === 'asc') {
        return dateA - dateB;
      } else {
        return dateB - dateA;
      }
    });
  }
);