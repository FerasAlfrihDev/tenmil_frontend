// ========================================
// API TABLE COMPONENT
// ========================================

import { useCallback, useMemo, useState, useEffect } from 'react';
import { TableHeader, TableBody, TableFilters as TableFiltersComponent, TablePagination, TableToolbar } from './components/index';
import { useAPITable, useTableSettings, useTableExport, useUrlSync } from './hooks';
import type { APITableProps, BulkAction, ExportOptions, TableFilters, TableSettings } from './types';
import './APITable.scss';

const APITable = <T extends Record<string, unknown> = Record<string, unknown>>({
  endpoint,
  columns,
  defaultPageSize = 25,
  defaultSort,
  filters = [],
  primaryAction,
  secondaryActions = [],
  exportable = false,
  selectable = false,
  // selectType = 'checkbox', // Only checkbox selection supported
  rowKey = 'id',
  onRowClick,
  onSelectionChange,
  onDataChange,
  refreshInterval,
  showRefreshButton = true,
  showColumnSettings = false,
  showDensitySettings = false,
  size = 'middle',
  bordered = false,
  striped = false,
  hover = true,
  sticky = false,
  maxHeight,
  emptyText = 'No data available',
  className = '',
  style,
  rowClassName,
  expandable,
  summary,
}: APITableProps<T>) => {
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
    columns
  );

  const { exportData, isExporting, exportError } = useTableExport();

  // URL sync (optional)
  useUrlSync(state, (newState) => {
    if (newState.pagination) actions.setPagination(newState.pagination);
    if (newState.sorting && newState.sorting.field) {
      actions.setSorting({
        field: newState.sorting.field,
        direction: newState.sorting.direction || 'asc'
      });
    }
    if (newState.filters) actions.setFilters(newState.filters);
    if (newState.searchQuery !== undefined) actions.setSearch(newState.searchQuery);
  });

  // Local state for expanded rows
  const [expandedRowKeys, setExpandedRowKeys] = useState<(string | number)[]>([]);

  // Get row key function
  const getRowKey = useCallback((record: T, index: number): string => {
    if (typeof rowKey === 'function') {
      return rowKey(record);
    }
    return record[rowKey as keyof T]?.toString() || index.toString();
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
  const handleFilterChange = useCallback((newFilters: TableFilters) => {
    actions.setFilters(newFilters);
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
  const handleSettingsChange = useCallback((newSettings: Partial<TableSettings>) => {
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
        onClick: (selectedRows: T[], selectedKeys: (string | number)[]) => {
          console.log('Delete selected:', selectedRows, selectedKeys);
          // Implement delete logic here
        },
      },
      {
        key: 'export',
        label: 'Export Selected',
        icon: '⬇️',
        onClick: (selectedRows: T[], selectedKeys: (string | number)[]) => {
          console.log('Export selected:', selectedRows, selectedKeys);
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
      {filters.length > 0 && (
        <TableFiltersComponent
          filters={filters}
          values={state.filters}
          onChange={handleFilterChange}
          onReset={actions.resetFilters}
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
        primaryAction={primaryAction}
        secondaryActions={secondaryActions}
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
            selectedRowKeys={state.selectedRowKeys}
            allRowKeys={allRowKeys}
            onSelectAll={handleSelectAll}
            resizable={showColumnSettings}
            onColumnResize={handleColumnResize}
            sticky={sticky}
            columnFilters={state.columnFilters}
            onColumnFilter={actions.setColumnFilters}
            className="api-table__header"
          />
          
          <TableBody
            data={state.data}
            columns={visibleColumns}
            loading={loading}
            selectable={selectable}
            selectedRowKeys={state.selectedRowKeys}
            onRowSelect={handleRowSelect}
            onRowClick={onRowClick}
            rowKey={rowKey}
            rowClassName={rowClassName}
            expandable={expandable}
            expandedRowKeys={expandedRowKeys}
            onRowExpand={handleRowExpand}
            emptyText={emptyText}
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
        showPageNumbers={false}
        className="api-table__pagination"
      />
    </div>
  );
};

export default APITable;
