// ========================================
// USE URL SYNC HOOK
// ========================================

import { useEffect, useCallback, useRef } from 'react';
import { useSearchParams } from 'react-router-dom';
import type { TableState } from '../types';

interface UrlSyncState {
  pagination?: {
    current?: number;
    pageSize?: number;
  };
  sorting?: {
    field?: string;
    direction?: 'asc' | 'desc' | null;
  };
  filters?: Record<string, any>;
  searchQuery?: string;
}

export const useUrlSync = <T = any>(
  state: TableState<T>,
  onStateChange: (newState: UrlSyncState) => void,
  options: {
    enabled?: boolean;
    debounceMs?: number;
    syncPagination?: boolean;
    syncSorting?: boolean;
    syncFilters?: boolean;
    syncSearch?: boolean;
  } = {}
) => {
  const {
    enabled = true,
    debounceMs = 300,
    syncPagination = true,
    syncSorting = true,
    syncFilters = true,
    syncSearch = true
  } = options;

  const [searchParams, setSearchParams] = useSearchParams();
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const isInitializedRef = useRef(false);

  // Parse URL parameters to state
  const parseUrlToState = useCallback((): UrlSyncState => {
    const urlState: UrlSyncState = {};

    if (syncPagination) {
      const page = searchParams.get('page');
      const pageSize = searchParams.get('pageSize');
      
      if (page || pageSize) {
        urlState.pagination = {};
        if (page) urlState.pagination.current = parseInt(page, 10);
        if (pageSize) urlState.pagination.pageSize = parseInt(pageSize, 10);
      }
    }

    if (syncSorting) {
      const sortField = searchParams.get('sortField');
      const sortDirection = searchParams.get('sortDirection');
      
      if (sortField || sortDirection) {
        urlState.sorting = {};
        if (sortField) urlState.sorting.field = sortField;
        if (sortDirection && (sortDirection === 'asc' || sortDirection === 'desc')) {
          urlState.sorting.direction = sortDirection;
        }
      }
    }

    if (syncSearch) {
      const search = searchParams.get('search');
      if (search) {
        urlState.searchQuery = search;
      }
    }

    if (syncFilters) {
      const filters: Record<string, any> = {};
      
      // Parse filter parameters (any param that starts with 'filter_')
      searchParams.forEach((value, key) => {
        if (key.startsWith('filter_')) {
          const filterKey = key.substring(7); // Remove 'filter_' prefix
          
          // Try to parse as JSON for complex values
          try {
            filters[filterKey] = JSON.parse(value);
          } catch {
            // If not JSON, use as string
            filters[filterKey] = value;
          }
        }
      });
      
      if (Object.keys(filters).length > 0) {
        urlState.filters = filters;
      }
    }

    return urlState;
  }, [searchParams, syncPagination, syncSorting, syncFilters, syncSearch]);

  // Convert state to URL parameters
  const stateToUrlParams = useCallback((currentState: TableState<T>): URLSearchParams => {
    const params = new URLSearchParams(searchParams);

    if (syncPagination) {
      if (currentState.pagination.current > 1) {
        params.set('page', currentState.pagination.current.toString());
      } else {
        params.delete('page');
      }
      
      if (currentState.pagination.pageSize !== 25) { // Default page size
        params.set('pageSize', currentState.pagination.pageSize.toString());
      } else {
        params.delete('pageSize');
      }
    }

    if (syncSorting) {
      if (currentState.sorting.field) {
        params.set('sortField', currentState.sorting.field);
        if (currentState.sorting.direction) {
          params.set('sortDirection', currentState.sorting.direction);
        } else {
          params.delete('sortDirection');
        }
      } else {
        params.delete('sortField');
        params.delete('sortDirection');
      }
    }

    if (syncSearch) {
      if (currentState.searchQuery) {
        params.set('search', currentState.searchQuery);
      } else {
        params.delete('search');
      }
    }

    if (syncFilters) {
      // Remove existing filter parameters
      for (const key of Array.from(params.keys())) {
        if (key.startsWith('filter_')) {
          params.delete(key);
        }
      }
      
      // Add current filters
      Object.entries(currentState.filters).forEach(([key, value]) => {
        if (value !== null && value !== undefined && value !== '') {
          const paramKey = `filter_${key}`;
          
          if (typeof value === 'object') {
            params.set(paramKey, JSON.stringify(value));
          } else {
            params.set(paramKey, String(value));
          }
        }
      });
    }

    return params;
  }, [searchParams, syncPagination, syncSorting, syncFilters, syncSearch]);

  // Update URL when state changes (debounced)
  const updateUrl = useCallback((newState: TableState<T>) => {
    if (!enabled) return;

    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    timeoutRef.current = setTimeout(() => {
      const newParams = stateToUrlParams(newState);
      const currentParamsString = searchParams.toString();
      const newParamsString = newParams.toString();
      
      // Only update if parameters have actually changed
      if (currentParamsString !== newParamsString) {
        setSearchParams(newParams, { replace: true });
      }
    }, debounceMs);
  }, [enabled, debounceMs, stateToUrlParams, searchParams, setSearchParams]);

  // Initialize state from URL on mount
  useEffect(() => {
    if (!enabled || isInitializedRef.current) return;

    const urlState = parseUrlToState();
    
    if (Object.keys(urlState).length > 0) {
      onStateChange(urlState);
    }
    
    isInitializedRef.current = true;
  }, [enabled, parseUrlToState, onStateChange]);

  // Update URL when state changes
  useEffect(() => {
    if (!enabled || !isInitializedRef.current) return;
    
    updateUrl(state);
  }, [
    enabled,
    state.pagination.current,
    state.pagination.pageSize,
    state.sorting.field,
    state.sorting.direction,
    state.filters,
    state.searchQuery,
    updateUrl
  ]);

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);
};
