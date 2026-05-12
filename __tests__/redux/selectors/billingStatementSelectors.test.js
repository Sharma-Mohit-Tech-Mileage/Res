import {
  selectAllStatements,
  selectLoading,
  selectError,
  selectDownloading,
  selectDownloadError,
  selectSelectedYear,
  selectSortDirection,
  selectDownloadedStatement,
  selectFilteredAndSortedStatements,
  selectBillingBreakDownData,
  selectBillingBreakDownLoading,
  selectBillingBreakDownError,
} from '../../../src/redux/selectors/billingStatementSelectors';

describe('billingStatementSelectors', () => {
  const state = {
    billingStatements: {
      statements: [
        { id: '1', date: '2024-02-01T12:00:00.000Z' },
        { id: '2', date: '2024-01-01T12:00:00.000Z' },
        { id: '3', date: '2023-12-01T12:00:00.000Z' },
      ],
      loading: true,
      error: 'err',
      downloading: false,
      downloadError: null,
      selectedYear: '2024',
      sortDirection: 'asc',
      downloadedStatement: { id: '2' },
      billingBreakdown: { total: 100 },
    },
  };

  it('returns base selector values', () => {
    expect(selectAllStatements(state)).toHaveLength(3);
    expect(selectLoading(state)).toBe(true);
    expect(selectError(state)).toBe('err');
    expect(selectDownloading(state)).toBe(false);
    expect(selectDownloadError(state)).toBeNull();
    expect(selectSelectedYear(state)).toBe('2024');
    expect(selectSortDirection(state)).toBe('asc');
    expect(selectDownloadedStatement(state)).toEqual({ id: '2' });
    expect(selectBillingBreakDownData(state)).toEqual({ total: 100 });
    expect(selectBillingBreakDownLoading(state)).toBe(true);
    expect(selectBillingBreakDownError(state)).toBe('err');
  });

  it('filters and sorts statements by selected year asc', () => {
    const data = selectFilteredAndSortedStatements(state);
    expect(data.map(item => item.id)).toEqual(['2', '1']);
  });

  it('sorts statements desc when requested', () => {
    const descState = {
      billingStatements: {
        ...state.billingStatements,
        sortDirection: 'desc',
      },
    };
    const data = selectFilteredAndSortedStatements(descState);
    expect(data.map(item => item.id)).toEqual(['1', '2']);
  });
});
