// ========================================
// USE API TABLE HOOK
// ========================================

import { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import { apiService } from '../../../../services/api';
import type { 
  APIResponse, 
  TableState, 
  UseAPITableOptions, 
  UseAPITableReturn,
  ColumnConfig,
  FilterConfig,
  QueryParams
} from '../types';

const DEFAULT_PAGE_SIZE = 25;
const DEFAULT_DEBOUNCE_MS = 300;

export const useAPITable = <T = any>(
  endpoint: string,
  _columns: ColumnConfig<T>[],
  _filters: FilterConfig[] = [],
  options: UseAPITableOptions = {}
): UseAPITableReturn<T> => {
  const {
    defaultPageSize = DEFAULT_PAGE_SIZE,
    defaultSort,
    refreshInterval,
    debounceMs = DEFAULT_DEBOUNCE_MS
  } = options;

  // State
  const [state, setState] = useState<TableState<T>>({
    data: [],
    loading: false,
    error: null,
    pagination: {
      current: 1,
      pageSize: defaultPageSize,
      total: 0,
      showSizeChanger: true,
      showQuickJumper: true,
      showTotal: true,
      pageSizeOptions: [10, 25, 50, 100]
    },
    sorting: {
      field: defaultSort?.replace(/^-/, '') || '',
      direction: defaultSort?.startsWith('-') ? 'desc' : 'asc'
    },
    filters: {},
    searchQuery: '',
    columnFilters: {},
    selectedRowKeys: [],
    selectedRows: []
  });

  // Refs for debouncing and cleanup
  const debounceTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const refreshIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const abortControllerRef = useRef<AbortController | null>(null);
  const isMountedRef = useRef<boolean>(true);

  // Build query parameters
  const buildQueryParams = useCallback((
    pagination = state.pagination,
    sorting = state.sorting,
    filters = state.filters,
    searchQuery = state.searchQuery,
    columnFilters = state.columnFilters
  ): QueryParams => {
    const params: QueryParams = {
      page: pagination.current,
      pageSize: pagination.pageSize
    };

    // Add sorting
    if (sorting.field && sorting.direction) {
      const prefix = sorting.direction === 'desc' ? '-' : '';
      params.ordering = `${prefix}${sorting.field}`;
    }

    // Add search
    if (searchQuery.trim()) {
      params.search = searchQuery.trim();
    }

    // Add filters
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== null && value !== undefined && value !== '') {
        if (Array.isArray(value)) {
          if (value.length > 0) {
            params[key] = value.join(',');
          }
        } else {
          params[key] = value;
        }
      }
    });

    // Add column filters (using Django field lookup syntax)
    Object.entries(columnFilters).forEach(([columnKey, searchValue]) => {
      if (searchValue && searchValue.trim()) {
        // Use Django's icontains lookup for case-insensitive partial matching
        params[`${columnKey}__icontains`] = searchValue.trim();
      }
    });

    return params;
  }, [state.pagination, state.sorting, state.filters, state.searchQuery, state.columnFilters]);

  // Fetch data
  const fetchData = useCallback(async (
    pagination = state.pagination,
    sorting = state.sorting,
    filters = state.filters,
    searchQuery = state.searchQuery,
    columnFilters = state.columnFilters,
    showLoading = true
  ) => {
    try {
      // Cancel previous request
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }

      // Create new abort controller
      abortControllerRef.current = new AbortController();

      if (showLoading) {
        setState(prev => ({ ...prev, loading: true, error: null }));
      }

      const params = buildQueryParams(pagination, sorting, filters, searchQuery, columnFilters);
      
      const response = await apiService.get<APIResponse<T>>(endpoint, {
        params,
        signal: abortControllerRef.current.signal
      });

      const { data, pagination: paginationData } = response.data;

      setState(prev => ({
        ...prev,
        data,
        loading: false,
        error: null,
        pagination: {
          ...prev.pagination,
          current: paginationData.current_page,
          total: paginationData.total_items,
          pageSize: paginationData.page_size
        }
      }));

    } catch (error: any) {
      // Don't update state if request was aborted
      if (error.name === 'AbortError') {
        return;
      }

      console.error('API Table fetch error:', error);
      
      setState(prev => ({
        ...prev,
        loading: false,
        error: error.response?.data?.message || error.message || 'Failed to load data'
      }));
    }
  }, [endpoint, buildQueryParams, state.pagination, state.sorting, state.filters, state.searchQuery, state.columnFilters]);

  // Debounced fetch for search and filters
  const debouncedFetch = useCallback((
    pagination = state.pagination,
    sorting = state.sorting,
    filters = state.filters,
    searchQuery = state.searchQuery,
    columnFilters = state.columnFilters
  ) => {
    if (debounceTimeoutRef.current) {
      clearTimeout(debounceTimeoutRef.current);
    }

    debounceTimeoutRef.current = setTimeout(() => {
      fetchData(pagination, sorting, filters, searchQuery, columnFilters);
    }, debounceMs);
  }, [fetchData, debounceMs, state.pagination, state.sorting, state.filters, state.searchQuery, state.columnFilters]);

  // Actions
  const actions = useMemo(() => ({
    setPagination: (newPagination: Partial<TableState<T>['pagination']>) => {
      setState(prev => {
        const updatedPagination = { ...prev.pagination, ...newPagination };
        // Reset to first page if page size changes
        if (newPagination.pageSize && newPagination.pageSize !== prev.pagination.pageSize) {
          updatedPagination.current = 1;
        }
        
        // Fetch immediately for pagination changes
        fetchData(updatedPagination, prev.sorting, prev.filters, prev.searchQuery, prev.columnFilters);
        
        return {
          ...prev,
          pagination: updatedPagination
        };
      });
    },

    setSorting: (newSorting: TableState<T>['sorting']) => {
      setState(prev => {
        const updatedPagination = { ...prev.pagination, current: 1 }; // Reset to first page
        
        // Fetch immediately for sorting changes
        fetchData(updatedPagination, newSorting, prev.filters, prev.searchQuery, prev.columnFilters);
        
        return {
          ...prev,
          sorting: newSorting,
          pagination: updatedPagination
        };
      });
    },

    setFilters: (newFilters: TableState<T>['filters']) => {
      setState(prev => {
        const updatedPagination = { ...prev.pagination, current: 1 }; // Reset to first page
        
        // Use debounced fetch for filter changes
        debouncedFetch(updatedPagination, prev.sorting, newFilters, prev.searchQuery, prev.columnFilters);
        
        return {
          ...prev,
          filters: newFilters,
          pagination: updatedPagination
        };
      });
    },

    setSearch: (query: string) => {
      setState(prev => {
        const updatedPagination = { ...prev.pagination, current: 1 }; // Reset to first page
        
        // Use debounced fetch for search changes
        debouncedFetch(updatedPagination, prev.sorting, prev.filters, query, prev.columnFilters);
        
        return {
          ...prev,
          searchQuery: query,
          pagination: updatedPagination
        };
      });
    },

    setColumnFilters: (columnKey: string, value: string) => {
      setState(prev => {
        const updatedColumnFilters = { ...prev.columnFilters, [columnKey]: value };
        const updatedPagination = { ...prev.pagination, current: 1 }; // Reset to first page
        
        // Use debounced fetch for column filter changes
        debouncedFetch(updatedPagination, prev.sorting, prev.filters, prev.searchQuery, updatedColumnFilters);
        
        return {
          ...prev,
          columnFilters: updatedColumnFilters,
          pagination: updatedPagination
        };
      });
    },

    setSelectedRows: (rows: T[], keys: (string | number)[]) => {
      setState(prev => ({
        ...prev,
        selectedRows: rows,
        selectedRowKeys: keys
      }));
    },

    refresh: () => {
      fetchData(state.pagination, state.sorting, state.filters, state.searchQuery, state.columnFilters, true);
    },

    resetFilters: () => {
      setState(prev => {
        const updatedPagination = { ...prev.pagination, current: 1 };
        const emptyFilters = {};
        const emptySearch = '';
        const emptyColumnFilters = {};
        
        // Fetch immediately for reset
        fetchData(updatedPagination, prev.sorting, emptyFilters, emptySearch, emptyColumnFilters);
        
        return {
          ...prev,
          filters: emptyFilters,
          searchQuery: emptySearch,
          columnFilters: emptyColumnFilters,
          pagination: updatedPagination
        };
      });
    }
  }), [fetchData, debouncedFetch, state.pagination, state.sorting, state.filters, state.searchQuery, state.columnFilters]);

  // Initial fetch
  useEffect(() => {
    isMountedRef.current = true;
    fetchData();
  }, []); // Only run on mount - empty dependency array to prevent infinite loop

  // Auto-refresh interval
  useEffect(() => {
    if (refreshInterval && refreshInterval > 0) {
      refreshIntervalRef.current = setInterval(() => {
        fetchData(state.pagination, state.sorting, state.filters, state.searchQuery, state.columnFilters, false);
      }, refreshInterval);

      return () => {
        if (refreshIntervalRef.current) {
          clearInterval(refreshIntervalRef.current);
        }
      };
    }
  }, [refreshInterval, fetchData, state.pagination, state.sorting, state.filters, state.searchQuery, state.columnFilters]);

  // Cleanup
  useEffect(() => {
    return () => {
      isMountedRef.current = false;
      
      if (debounceTimeoutRef.current) {
        clearTimeout(debounceTimeoutRef.current);
      }
      if (refreshIntervalRef.current) {
        clearInterval(refreshIntervalRef.current);
      }
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, []);

  return {
    state,
    actions,
    loading: state.loading,
    error: state.error
  };
};
