// ========================================
// API TABLE COMPONENT
// ========================================

import React, { useCallback, useMemo, useState, useEffect } from 'react';
import { TableHeader, TableBody, TableFilters, TablePagination, TableToolbar } from './components';
import { useAPITable, useTableSettings, useTableExport, useUrlSync } from './hooks';
import type { APITableProps, BulkAction, ExportOptions } from './types';

const APITable: React.FC<APITableProps> = ({
  endpoint,
  columns,
  defaultPageSize = 25,
  defaultSort,
  filters = [],
  searchable = false,
  searchPlaceholder = 'Search...',
  exportable = false,
  selectable = false,
  selectType = 'checkbox',
  rowKey = 'id',
  onRowClick,
  onSelectionChange,
  onDataChange,
  refreshInterval,
  showRefreshButton = true,
  showColumnSettings = false,
  showDensitySettings = false,
  size = 'middle',
  bordered = true,
  striped = false,
  hover = true,
  sticky = false,
  virtualScroll = false,
  maxHeight,
  emptyText = 'No data available',
  loadingText = 'Loading...',
  className = '',
  style,
  rowClassName,
  expandable,
  summary,
  locale,
}) => {
  // Generate unique table ID for settings persistence
  const tableId = useMemo(() => {
    return `api-table-${endpoint.replace(/[^a-zA-Z0-9]/g, '-')}`;
  }, [endpoint]);

  // Initialize hooks
  const { state, actions, loading, error } = useAPITable(endpoint, columns, filters, {
    defaultPageSize,
    defaultSort,
    refreshInterval,
  });

  const { settings, updateColumnSettings, updateTableSettings } = useTableSettings(
    tableId,
    columns,
    { pageSize: defaultPageSize }
  );

  const { exportData, isExporting, exportError } = useTableExport();

  // URL sync (optional)
  useUrlSync(state, (newState) => {
    if (newState.pagination) actions.setPagination(newState.pagination);
    if (newState.sorting) actions.setSorting(newState.sorting);
    if (newState.filters) actions.setFilters(newState.filters);
    if (newState.searchQuery !== undefined) actions.setSearch(newState.searchQuery);
  });

  // Local state for expanded rows
  const [expandedRowKeys, setExpandedRowKeys] = useState<(string | number)[]>([]);

  // Get row key function
  const getRowKey = useCallback((record: any, index: number): string => {
    if (typeof rowKey === 'function') {
      return rowKey(record);
    }
    return record[rowKey] || index.toString();
  }, [rowKey]);

  // Get all row keys for selection
  const allRowKeys = useMemo(() => {
    return state.data.map((record, index) => getRowKey(record, index));
  }, [state.data, getRowKey]);

  // Filter visible columns based on settings
  const visibleColumns = useMemo(() => {
    return columns
      .filter(col => settings.columns[col.key]?.visible !== false)
      .sort((a, b) => {
        const orderA = settings.columns[a.key]?.order ?? columns.findIndex(c => c.key === a.key);
        const orderB = settings.columns[b.key]?.order ?? columns.findIndex(c => c.key === b.key);
        return orderA - orderB;
      });
  }, [columns, settings.columns]);

  // Handle pagination change
  const handlePaginationChange = useCallback((page: number, pageSize: number) => {
    actions.setPagination({ current: page, pageSize });
  }, [actions]);

  // Handle sorting change
  const handleSortChange = useCallback((field: string, direction: 'asc' | 'desc' | null) => {
    actions.setSorting({ field, direction });
  }, [actions]);

  // Handle filter change
  const handleFilterChange = useCallback((newFilters: Record<string, any>) => {
    actions.setFilters(newFilters);
  }, [actions]);

  // Handle search change
  const handleSearchChange = useCallback((query: string) => {
    actions.setSearch(query);
  }, [actions]);

  // Handle row selection
  const handleRowSelect = useCallback((rowKey: string | number, selected: boolean) => {
    const currentKeys = [...state.selectedRowKeys];
    const currentRows = [...state.selectedRows];
    
    if (selected) {
      if (!currentKeys.includes(rowKey)) {
        const record = state.data.find((item, index) => getRowKey(item, index) === rowKey);
        if (record) {
          currentKeys.push(rowKey);
          currentRows.push(record);
        }
      }
    } else {
      const keyIndex = currentKeys.indexOf(rowKey);
      if (keyIndex > -1) {
        currentKeys.splice(keyIndex, 1);
        currentRows.splice(keyIndex, 1);
      }
    }
    
    actions.setSelectedRows(currentRows, currentKeys);
    onSelectionChange?.(currentRows, currentKeys);
  }, [state.selectedRowKeys, state.selectedRows, state.data, getRowKey, actions, onSelectionChange]);

  // Handle select all
  const handleSelectAll = useCallback((selected: boolean) => {
    if (selected) {
      const allRows = [...state.data];
      const allKeys = [...allRowKeys];
      actions.setSelectedRows(allRows, allKeys);
      onSelectionChange?.(allRows, allKeys);
    } else {
      actions.setSelectedRows([], []);
      onSelectionChange?.([], []);
    }
  }, [state.data, allRowKeys, actions, onSelectionChange]);

  // Handle row expansion
  const handleRowExpand = useCallback((rowKey: string | number, expanded: boolean) => {
    setExpandedRowKeys(prev => {
      if (expanded) {
        return [...prev, rowKey];
      } else {
        return prev.filter(key => key !== rowKey);
      }
    });
  }, []);

  // Handle export
  const handleExport = useCallback((options: ExportOptions) => {
    const dataToExport = options.selectedOnly && state.selectedRows.length > 0 
      ? state.selectedRows 
      : state.data;
    
    const columnsToExport = options.visibleColumnsOnly ? visibleColumns : columns;
    
    exportData(options, dataToExport, columnsToExport);
  }, [state.selectedRows, state.data, visibleColumns, columns, exportData]);

  // Handle column resize
  const handleColumnResize = useCallback((columnKey: string, width: number) => {
    updateColumnSettings(columnKey, { width });
  }, [updateColumnSettings]);

  // Handle settings change
  const handleSettingsChange = useCallback((newSettings: any) => {
    updateTableSettings(newSettings);
  }, [updateTableSettings]);

  // Notify parent of data changes
  useEffect(() => {
    onDataChange?.(state.data);
  }, [state.data, onDataChange]);

  // Generate table classes
  const tableClasses = useMemo(() => {
    const classes = ['api-table'];
    
    if (className) classes.push(className);
    if (size) classes.push(`api-table--${size}`);
    if (settings.density) classes.push(`api-table--${settings.density}`);
    if (bordered) classes.push('api-table--bordered');
    if (striped) classes.push('api-table--striped');
    if (hover) classes.push('api-table--hover');
    if (sticky) classes.push('api-table--sticky');
    if (loading) classes.push('api-table--loading');
    if (error) classes.push('api-table--error');
    
    return classes.join(' ');
  }, [className, size, settings.density, bordered, striped, hover, sticky, loading, error]);

  // Bulk actions (example implementation)
  const bulkActions: BulkAction[] = useMemo(() => {
    if (!selectable || state.selectedRows.length === 0) return [];
    
    return [
      {
        key: 'delete',
        label: 'Delete Selected',
        icon: '🗑️',
        danger: true,
        onClick: (selectedRows, selectedKeys) => {
          console.log('Delete selected:', selectedRows, selectedKeys);
          // Implement delete logic here
        },
      },
      {
        key: 'export',
        label: 'Export Selected',
        icon: '⬇️',
        onClick: (selectedRows, selectedKeys) => {
          handleExport({
            format: 'csv',
            selectedOnly: true,
            filename: 'selected-items',
          });
        },
      },
    ];
  }, [selectable, state.selectedRows.length, handleExport]);

  return (
    <div className={tableClasses} style={style}>
      {/* Error display */}
      {error && (
        <div className="api-table__error">
          <span className="api-table__error-text">{error}</span>
          <button 
            className="api-table__error-retry"
            onClick={actions.refresh}
          >
            Retry
          </button>
        </div>
      )}

      {/* Export error display */}
      {exportError && (
        <div className="api-table__export-error">
          <span className="api-table__export-error-text">{exportError}</span>
        </div>
      )}

      {/* Filters */}
      {(searchable || filters.length > 0) && (
        <TableFilters
          filters={filters}
          values={state.filters}
          onChange={handleFilterChange}
          onReset={actions.resetFilters}
          searchable={searchable}
          searchValue={state.searchQuery}
          searchPlaceholder={searchPlaceholder}
          onSearchChange={handleSearchChange}
          className="api-table__filters"
        />
      )}

      {/* Toolbar */}
      <TableToolbar
        selectedCount={state.selectedRows.length}
        totalCount={state.data.length}
        bulkActions={bulkActions}
        exportable={exportable}
        onExport={handleExport}
        onRefresh={actions.refresh}
        showRefreshButton={showRefreshButton}
        showColumnSettings={showColumnSettings}
        showDensitySettings={showDensitySettings}
        settings={settings}
        onSettingsChange={handleSettingsChange}
        columns={columns}
        loading={loading || isExporting}
        className="api-table__toolbar"
      />

      {/* Table container */}
      <div 
        className="api-table__container"
        style={{ maxHeight }}
      >
        <table className="api-table__table">
          <TableHeader
            columns={visibleColumns}
            sorting={state.sorting}
            onSort={handleSortChange}
            selectable={selectable}
            selectType={selectType}
            selectedRowKeys={state.selectedRowKeys}
            allRowKeys={allRowKeys}
            onSelectAll={handleSelectAll}
            resizable={showColumnSettings}
            onColumnResize={handleColumnResize}
            sticky={sticky}
            className="api-table__header"
          />
          
          <TableBody
            data={state.data}
            columns={visibleColumns}
            loading={loading}
            selectable={selectable}
            selectType={selectType}
            selectedRowKeys={state.selectedRowKeys}
            onRowSelect={handleRowSelect}
            onRowClick={onRowClick}
            rowKey={rowKey}
            rowClassName={rowClassName}
            expandable={expandable}
            expandedRowKeys={expandedRowKeys}
            onRowExpand={handleRowExpand}
            emptyText={emptyText}
            virtualScroll={virtualScroll}
            className="api-table__body"
          />
        </table>
      </div>

      {/* Summary */}
      {summary && (
        <div className="api-table__summary">
          {summary(state.data)}
        </div>
      )}

      {/* Pagination */}
      <TablePagination
        pagination={state.pagination}
        onChange={handlePaginationChange}
        showSizeChanger={state.pagination.showSizeChanger}
        showQuickJumper={state.pagination.showQuickJumper}
        showTotal={true}
        className="api-table__pagination"
      />
    </div>
  );
};

export default APITable;
