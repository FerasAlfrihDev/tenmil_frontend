// ========================================
// API TABLE TYPES
// ========================================

import type { ReactNode } from 'react';

// ========================================
// API Response Types
// ========================================

export interface APIResponse<T = any> {
  data: T[];
  meta_data: {
    success: boolean;
    total: number;
    status_code: number;
  };
  pagination: {
    current_page: number;
    total_pages: number;
    total_items: number;
    page_size: number;
    has_next: boolean;
    has_previous: boolean;
    next_page: number | null;
    previous_page: number | null;
  };
}

// ========================================
// Table Configuration Types
// ========================================

export type ColumnType = 'text' | 'number' | 'date' | 'datetime' | 'boolean' | 'currency' | 'percentage' | 'custom';

export type FilterType = 'text' | 'select' | 'multiselect' | 'date' | 'daterange' | 'number' | 'numberrange' | 'boolean';

export type SortDirection = 'asc' | 'desc' | null;

export interface ColumnConfig<T = any> {
  key: string;
  title: string;
  dataIndex?: keyof T | string[];
  type?: ColumnType;
  width?: number;
  minWidth?: number;
  maxWidth?: number;
  sortable?: boolean;
  filterable?: boolean;
  searchable?: boolean;
  resizable?: boolean;
  fixed?: 'left' | 'right';
  align?: 'left' | 'center' | 'right';
  ellipsis?: boolean;
  render?: (value: any, record: T, index: number) => ReactNode;
  sorter?: boolean | ((a: T, b: T) => number);
  defaultSortOrder?: 'asc' | 'desc';
  className?: string;
  headerClassName?: string;
  dateFormat?: string;
}

export interface FilterOption {
  label: string;
  value: string | number;
  disabled?: boolean;
}

export interface FilterConfig {
  field: string;
  type: FilterType;
  label?: string;
  placeholder?: string;
  options?: FilterOption[];
  multiple?: boolean;
  searchable?: boolean;
  dateFormat?: string;
  numberFormat?: {
    min?: number;
    max?: number;
    step?: number;
  };
}

// ========================================
// Table State Types
// ========================================

export interface TablePagination {
  current: number;
  pageSize: number;
  total: number;
  showSizeChanger?: boolean;
  showQuickJumper?: boolean;
  showTotal?: boolean;
  pageSizeOptions?: number[];
}

export interface TableSorting {
  field: string;
  direction: SortDirection;
}

export interface TableFilters {
  [key: string]: any;
}

export interface TableSelection<T = any> {
  selectedRowKeys: (string | number)[];
  selectedRows: T[];
}

export interface TableState<T = any> {
  data: T[];
  loading: boolean;
  error: string | null;
  pagination: TablePagination;
  sorting: TableSorting;
  filters: TableFilters;
  searchQuery: string;
  columnFilters: Record<string, string>; // Column-specific search filters
  selectedRowKeys: (string | number)[];
  selectedRows: T[];
}

// ========================================
// Component Props Types
// ========================================

export interface BulkAction<T = any> {
  key: string;
  label: string;
  icon?: ReactNode;
  danger?: boolean;
  disabled?: boolean;
  onClick: (selectedRows: T[], selectedKeys: (string | number)[]) => void;
  confirm?: {
    title: string;
    content: string;
  };
}

export interface ActionButton {
  key: string;
  label: string;
  icon?: ReactNode;
  type?: 'primary' | 'secondary' | 'danger';
  disabled?: boolean;
  loading?: boolean;
  onClick: () => void;
  tooltip?: string;
}

export interface ExportOptions {
  format: 'csv' | 'excel' | 'json';
  filename?: string;
  selectedOnly?: boolean;
  visibleColumnsOnly?: boolean;
  includeHeaders?: boolean;
}

export interface TableSettings {
  density: 'compact' | 'middle' | 'comfortable';
  columns: {
    [key: string]: {
      visible: boolean;
      width?: number;
      order: number;
    };
  };
}

export interface APITableProps<T = any> {
  // Core props
  endpoint: string;
  columns: ColumnConfig<T>[];
  title?: string;
  
  // Pagination
  defaultPageSize?: number;
  pageSizeOptions?: number[];
  
  // Sorting
  defaultSort?: string;
  
  // Filtering
  filters?: FilterConfig[];
  
  // Action Buttons
  primaryAction?: ActionButton;
  secondaryActions?: ActionButton[];
  
  // Selection
  selectable?: boolean;
  rowSelection?: {
    type: 'checkbox' | 'radio';
  };
  rowKey?: keyof T | ((record: T) => string);
  
  // Export
  exportable?: boolean;
  exportConfig?: {
    enabled: boolean;
    formats?: ('csv' | 'excel' | 'json')[];
  };
  
  // Refresh
  refreshInterval?: number;
  showRefreshButton?: boolean;
  
  // Customization
  showColumnSettings?: boolean;
  showDensitySettings?: boolean;
  size?: 'small' | 'middle' | 'large';
  bordered?: boolean;
  striped?: boolean;
  hover?: boolean;
  sticky?: boolean;
  maxHeight?: number;
  
  // Content
  emptyText?: string;
  loadingText?: string;
  
  // Styling
  className?: string;
  style?: React.CSSProperties;
  rowClassName?: string | ((record: T, index: number) => string);
  
  // Expandable rows
  expandable?: {
    expandedRowRender: (record: T, index: number) => ReactNode;
    expandRowByClick?: boolean;
    expandIcon?: (props: { expanded: boolean; onExpand: () => void; record: T }) => ReactNode;
  };
  
  // Summary
  summary?: (data: T[]) => ReactNode;
  
  // Bulk Actions
  bulkActions?: BulkAction<T>[];
  
  // Request Configuration
  requestConfig?: {
    transform?: (response: any) => any;
  };
  
  // Callbacks
  onRowClick?: (record: T, index?: number) => void;
  onSelectionChange?: (selectedRows: T[], selectedKeys: (string | number)[]) => void;
  onDataChange?: (data: T[]) => void;
  onError?: (error: Error) => void;
  
  // Localization
  locale?: {
    emptyText?: string;
    filterConfirm?: string;
    filterReset?: string;
    selectAll?: string;
    selectInvert?: string;
    sortTitle?: string;
  };
}

// ========================================
// Hook Types
// ========================================

export interface UseAPITableOptions {
  defaultPageSize?: number;
  defaultSort?: string;
  refreshInterval?: number;
  debounceMs?: number;
}

export interface UseAPITableReturn<T = any> {
  state: TableState<T>;
  actions: {
    setPagination: (pagination: Partial<TablePagination>) => void;
    setSorting: (sorting: TableSorting) => void;
    setFilters: (filters: TableFilters) => void;
    setSearch: (query: string) => void;
    setColumnFilters: (columnKey: string, value: string) => void;
    setSelectedRows: (rows: T[], keys: (string | number)[]) => void;
    refresh: () => void;
    resetFilters: () => void;
  };
  loading: boolean;
  error: string | null;
}

export interface UseTableExportReturn {
  exportData: (options: ExportOptions, data: any[], columns: ColumnConfig[]) => Promise<void>;
  isExporting: boolean;
  exportError: string | null;
}

export interface UseTableSettingsReturn {
  settings: TableSettings;
  updateColumnSettings: (columnKey: string, settings: Partial<TableSettings['columns'][string]>) => void;
  updateTableSettings: (settings: Partial<TableSettings>) => void;
}

// ========================================
// Utility Types
// ========================================

export type TableSize = 'small' | 'middle' | 'large';
export type TableDensity = 'compact' | 'middle' | 'comfortable';

export interface QueryParams {
  page?: number;
  pageSize?: number;
  ordering?: string;
  search?: string;
  [key: string]: any;
}
