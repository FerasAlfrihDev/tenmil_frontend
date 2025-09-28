// ========================================
// TABLE BODY COMPONENT
// ========================================

import React, { useCallback, useMemo } from 'react';
import { ChevronRight, ChevronDown } from 'lucide-react';
import Checkbox from '../../Checkbox/Checkbox';
// import Radio from '../../Radio/Radio'; // Radio component requires options array
import type { ColumnConfig } from '../types';

interface TableBodyProps<T = any> {
  data: T[];
  columns: ColumnConfig<T>[];
  loading?: boolean;
  selectable?: boolean;
  // selectType?: 'checkbox' | 'radio'; // Currently only checkbox is supported
  selectedRowKeys: (string | number)[];
  onRowSelect: (rowKey: string | number, selected: boolean) => void;
  onRowClick?: (record: T, index: number) => void;
  rowKey: keyof T | ((record: T) => string);
  rowClassName?: string | ((record: T, index: number) => string);
  expandable?: {
    expandedRowRender: (record: T, index: number) => React.ReactNode;
    expandRowByClick?: boolean;
    expandIcon?: (props: { expanded: boolean; onExpand: () => void; record: T }) => React.ReactNode;
  };
  expandedRowKeys: (string | number)[];
  onRowExpand: (rowKey: string | number, expanded: boolean) => void;
  emptyText?: string;
  className?: string;
}

const TableBody = <T extends Record<string, any>>({
  data,
  columns,
  loading = false,
  selectable = false,
  // selectType = 'checkbox', // Currently only checkbox is supported
  selectedRowKeys,
  onRowSelect,
  onRowClick,
  rowKey,
  rowClassName,
  expandable,
  expandedRowKeys,
  onRowExpand,
  emptyText = 'No data available',
  className = ''
}: TableBodyProps<T>) => {

  // Get row key function
  const getRowKey = useCallback((record: T, index: number): string => {
    if (typeof rowKey === 'function') {
      return rowKey(record);
    }
    return record[rowKey]?.toString() || index.toString();
  }, [rowKey]);

  // Get row class name
  const getRowClassName = useCallback((record: T, index: number): string => {
    let classes = 'table-body__row';
    
    if (onRowClick) {
      classes += ' table-body__row--clickable';
    }
    
    if (typeof rowClassName === 'function') {
      classes += ` ${rowClassName(record, index)}`;
    } else if (rowClassName) {
      classes += ` ${rowClassName}`;
    }
    
    const key = getRowKey(record, index);
    if (selectedRowKeys.includes(key)) {
      classes += ' table-body__row--selected';
    }
    
    if (expandedRowKeys.includes(key)) {
      classes += ' table-body__row--expanded';
    }
    
    return classes.trim();
  }, [onRowClick, rowClassName, getRowKey, selectedRowKeys, expandedRowKeys]);

  // Handle row selection
  const handleRowSelect = useCallback((record: T, index: number, selected: boolean) => {
    const key = getRowKey(record, index);
    onRowSelect(key, selected);
  }, [getRowKey, onRowSelect]);

  // Handle row click
  const handleRowClick = useCallback((record: T, index: number, event: React.MouseEvent) => {
    // Don't trigger row click if clicking on interactive elements
    const target = event.target as HTMLElement;
    if (target.closest('.table-body__selection, .table-body__expand, input, button, a')) {
      return;
    }

    if (expandable?.expandRowByClick) {
      const key = getRowKey(record, index);
      const isExpanded = expandedRowKeys.includes(key);
      onRowExpand(key, !isExpanded);
    }

    onRowClick?.(record, index);
  }, [expandable, getRowKey, expandedRowKeys, onRowExpand, onRowClick]);

  // Handle row expansion
  const handleRowExpand = useCallback((record: T, index: number) => {
    const key = getRowKey(record, index);
    const isExpanded = expandedRowKeys.includes(key);
    onRowExpand(key, !isExpanded);
  }, [getRowKey, expandedRowKeys, onRowExpand]);

  // Render cell content
  const renderCell = useCallback((column: ColumnConfig<T>, record: T, index: number) => {
    let value: any;

    if (column.dataIndex) {
      if (Array.isArray(column.dataIndex)) {
        // Handle nested properties
        value = column.dataIndex.reduce((obj, key) => obj?.[key], record);
      } else {
        value = record[column.dataIndex];
      }
    } else {
      value = record[column.key];
    }

    // Use custom render function if provided
    if (column.render) {
      return column.render(value, record, index);
    }

    // Handle different data types
    if (value === null || value === undefined) {
      return '-';
    }

    switch (column.type) {
      case 'boolean':
        return value ? 'Yes' : 'No';
      
      case 'date':
        if (value instanceof Date) {
          return value.toLocaleDateString();
        }
        if (typeof value === 'string') {
          return new Date(value).toLocaleDateString();
        }
        return value;
      
      case 'datetime':
        if (value instanceof Date) {
          return value.toLocaleString();
        }
        if (typeof value === 'string') {
          return new Date(value).toLocaleString();
        }
        return value;
      
      case 'currency':
        if (typeof value === 'number') {
          return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD'
          }).format(value);
        }
        return value;
      
      case 'percentage':
        if (typeof value === 'number') {
          return `${(value * 100).toFixed(2)}%`;
        }
        return value;
      
      case 'number':
        if (typeof value === 'number') {
          return value.toLocaleString();
        }
        return value;
      
      default:
        return String(value);
    }
  }, []);

  // Render expand icon
  const renderExpandIcon = useCallback((record: T, index: number) => {
    const key = getRowKey(record, index);
    const isExpanded = expandedRowKeys.includes(key);

    if (expandable?.expandIcon) {
      return expandable.expandIcon({
        expanded: isExpanded,
        onExpand: () => handleRowExpand(record, index),
        record
      });
    }

    return (
      <button
        className="table-body__expand-btn"
        onClick={() => handleRowExpand(record, index)}
        aria-label={isExpanded ? 'Collapse row' : 'Expand row'}
      >
        {isExpanded ? (
          <ChevronDown size={16} />
        ) : (
          <ChevronRight size={16} />
        )}
      </button>
    );
  }, [expandable, getRowKey, expandedRowKeys, handleRowExpand]);

  // Loading skeleton rows
  const loadingRows = useMemo(() => {
    if (!loading) return null;

    return Array.from({ length: 5 }, (_, index) => (
      <tr key={`loading-${index}`} className="table-body__row table-body__row--loading">
        {selectable && (
          <td className="table-body__cell table-body__cell--selection">
            <div className="table-body__skeleton table-body__skeleton--checkbox" />
          </td>
        )}
        {expandable && (
          <td className="table-body__cell table-body__cell--expand">
            <div className="table-body__skeleton table-body__skeleton--expand" />
          </td>
        )}
        {columns.map((column) => (
          <td key={column.key} className="table-body__cell">
            <div className="table-body__skeleton" />
          </td>
        ))}
      </tr>
    ));
  }, [loading, selectable, expandable, columns]);

  // Empty state
  if (!loading && data.length === 0) {
    const colSpan = columns.length + (selectable ? 1 : 0) + (expandable ? 1 : 0);
    
    return (
      <tbody className={`table-body ${className}`}>
        <tr className="table-body__row table-body__row--empty">
          <td className="table-body__cell table-body__cell--empty" colSpan={colSpan}>
            <div className="table-body__empty">
              <span className="table-body__empty-text">{emptyText}</span>
            </div>
          </td>
        </tr>
      </tbody>
    );
  }

  return (
    <tbody className={`table-body ${className}`}>
      {loading && loadingRows}
      
      {!loading && data.map((record, index) => {
        const key = getRowKey(record, index);
        const isSelected = selectedRowKeys.includes(key);
        const isExpanded = expandedRowKeys.includes(key);

        return (
          <React.Fragment key={key}>
            {/* Main row */}
            <tr
              className={getRowClassName(record, index)}
              onClick={(e) => handleRowClick(record, index, e)}
            >
              {/* Selection column */}
              {selectable && (
                <td className="table-body__cell table-body__cell--selection">
                  <Checkbox
                    checked={isSelected}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleRowSelect(record, index, e.target.checked)}
                  />
                </td>
              )}

              {/* Expand column */}
              {expandable && (
                <td className="table-body__cell table-body__cell--expand">
                  {renderExpandIcon(record, index)}
                </td>
              )}

              {/* Data columns */}
              {columns.map((column) => {
                const alignment = column.align || 'left';
                const isFixed = column.fixed;

                return (
                  <td
                    key={column.key}
                    className={`
                      table-body__cell
                      table-body__cell--${alignment}
                      ${isFixed ? `table-body__cell--fixed-${isFixed}` : ''}
                      ${column.className || ''}
                    `.trim()}
                    style={{
                      width: column.width,
                      minWidth: column.minWidth,
                      maxWidth: column.maxWidth
                    }}
                  >
                    <div className={`table-body__content ${column.ellipsis ? 'table-body__content--ellipsis' : ''}`}>
                      {renderCell(column, record, index)}
                    </div>
                  </td>
                );
              })}
            </tr>

            {/* Expanded row */}
            {expandable && isExpanded && (
              <tr className="table-body__row table-body__row--expanded-content">
                <td
                  className="table-body__cell table-body__cell--expanded-content"
                  colSpan={columns.length + (selectable ? 1 : 0) + 1}
                >
                  <div className="table-body__expanded-content">
                    {expandable.expandedRowRender(record, index)}
                  </div>
                </td>
              </tr>
            )}
          </React.Fragment>
        );
      })}
    </tbody>
  );
};

export default TableBody;
