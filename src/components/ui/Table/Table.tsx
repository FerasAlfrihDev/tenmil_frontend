import React, { useState, useCallback, useMemo } from 'react';
import './Table.scss';

export interface TableColumn<T = any> {
  key: string;
  title: string;
  dataIndex?: keyof T;
  render?: (value: any, record: T, index: number) => React.ReactNode;
  width?: number;
  sortable?: boolean;
  filterable?: boolean;
  resizable?: boolean;
}

export interface TableProps<T = any> {
  title?: string;
  columns: TableColumn<T>[];
  dataSource: T[];
  rowKey?: keyof T | ((record: T) => string);
  loading?: boolean;
  pagination?: {
    current: number;
    pageSize: number;
    total: number;
    onChange: (page: number, pageSize: number) => void;
  };
  allowColumnResize?: boolean;
  allowColumnReorder?: boolean;
  allowFiltering?: boolean;
  onRowClick?: (record: T, index: number) => void;
  className?: string;
}

const Table = <T extends Record<string, any>>({
  title,
  columns,
  dataSource,
  rowKey = 'id',
  loading = false,
  pagination,
  allowColumnResize = false,
  allowColumnReorder = false,
  allowFiltering = false,
  onRowClick,
  className,
}: TableProps<T>) => {
  const [columnWidths, setColumnWidths] = useState<Record<string, number>>({});
  const [columnOrder, setColumnOrder] = useState<string[]>(columns.map(col => col.key));
  const [filters, setFilters] = useState<Record<string, string>>({});
  const [sortConfig, setSortConfig] = useState<{
    key: string;
    direction: 'asc' | 'desc';
  } | null>(null);
  const [draggedColumn, setDraggedColumn] = useState<string | null>(null);

  // Get row key function
  const getRowKey = useCallback((record: T, index: number): string => {
    if (typeof rowKey === 'function') {
      return rowKey(record);
    }
    return record[rowKey]?.toString() || index.toString();
  }, [rowKey]);

  // Filter and sort data
  const processedData = useMemo(() => {
    let result = [...dataSource];

    // Apply filters
    if (allowFiltering) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value) {
          const column = columns.find(col => col.key === key);
          if (column) {
            result = result.filter(record => {
              const cellValue = column.dataIndex ? record[column.dataIndex] : record[key];
              return cellValue?.toString().toLowerCase().includes(value.toLowerCase());
            });
          }
        }
      });
    }

    // Apply sorting
    if (sortConfig) {
      result.sort((a, b) => {
        const column = columns.find(col => col.key === sortConfig.key);
        if (!column) return 0;

        const aValue = column.dataIndex ? a[column.dataIndex] : a[sortConfig.key];
        const bValue = column.dataIndex ? b[column.dataIndex] : b[sortConfig.key];

        if (aValue < bValue) return sortConfig.direction === 'asc' ? -1 : 1;
        if (aValue > bValue) return sortConfig.direction === 'asc' ? 1 : -1;
        return 0;
      });
    }

    return result;
  }, [dataSource, filters, sortConfig, columns, allowFiltering]);

  // Handle column resize
  const handleColumnResize = useCallback((columnKey: string, newWidth: number) => {
    setColumnWidths(prev => ({
      ...prev,
      [columnKey]: newWidth,
    }));
  }, []);

  // Handle sorting
  const handleSort = useCallback((columnKey: string) => {
    setSortConfig(prev => {
      if (prev?.key === columnKey) {
        if (prev.direction === 'asc') {
          return { key: columnKey, direction: 'desc' };
        } else {
          return null;
        }
      }
      return { key: columnKey, direction: 'asc' };
    });
  }, []);

  // Handle filter change
  const handleFilterChange = useCallback((columnKey: string, value: string) => {
    setFilters(prev => ({
      ...prev,
      [columnKey]: value,
    }));
  }, []);

  // Handle column drag and drop
  const handleDragStart = useCallback((columnKey: string) => {
    setDraggedColumn(columnKey);
  }, []);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
  }, []);

  const handleDrop = useCallback((targetColumnKey: string) => {
    if (!draggedColumn || draggedColumn === targetColumnKey) return;

    setColumnOrder(prev => {
      const newOrder = [...prev];
      const draggedIndex = newOrder.indexOf(draggedColumn);
      const targetIndex = newOrder.indexOf(targetColumnKey);

      newOrder.splice(draggedIndex, 1);
      newOrder.splice(targetIndex, 0, draggedColumn);

      return newOrder;
    });

    setDraggedColumn(null);
  }, [draggedColumn]);

  // Get ordered columns
  const orderedColumns = useMemo(() => {
    return columnOrder
      .map(key => columns.find(col => col.key === key))
      .filter((col): col is TableColumn<T> => col !== undefined);
  }, [columnOrder, columns]);

  // Render table cell
  const renderCell = useCallback((column: TableColumn<T>, record: T, index: number) => {
    if (column.render) {
      const value = column.dataIndex ? record[column.dataIndex] : record[column.key];
      return column.render(value, record, index);
    }
    const value = column.dataIndex ? record[column.dataIndex] : record[column.key];
    return value?.toString() || '';
  }, []);

  if (loading) {
    return (
      <div className={`table-container ${className || ''}`}>
        {title && <div className="table-title">{title}</div>}
        <div className="table-loading">Loading...</div>
      </div>
    );
  }

  return (
    <div className={`table-container ${className || ''}`}>
      {title && <div className="table-title">{title}</div>}
      
      <div className="table-wrapper">
        <table className="table">
          <thead>
            <tr>
              {orderedColumns.map((column) => (
                <th
                  key={column.key}
                  className={`table-header-cell ${
                    column.sortable ? 'sortable' : ''
                  } ${
                    sortConfig?.key === column.key ? `sorted-${sortConfig.direction}` : ''
                  }`}
                  style={{
                    width: columnWidths[column.key] || column.width,
                    minWidth: 100,
                  }}
                  draggable={allowColumnReorder}
                  onDragStart={() => handleDragStart(column.key)}
                  onDragOver={handleDragOver}
                  onDrop={() => handleDrop(column.key)}
                  onClick={() => column.sortable && handleSort(column.key)}
                >
                  <div className="table-header-content">
                    <span className="table-header-title">{column.title}</span>
                    {column.sortable && (
                      <span className="table-sort-indicator">
                        {sortConfig?.key === column.key ? (
                          sortConfig.direction === 'asc' ? '↑' : '↓'
                        ) : (
                          '↕'
                        )}
                      </span>
                    )}
                  </div>
                  
                  {allowFiltering && column.filterable && (
                    <div className="table-filter">
                      <input
                        type="text"
                        placeholder={`Filter ${column.title}`}
                        value={filters[column.key] || ''}
                        onChange={(e) => handleFilterChange(column.key, e.target.value)}
                        onClick={(e) => e.stopPropagation()}
                        className="table-filter-input"
                      />
                    </div>
                  )}
                  
                  {allowColumnResize && column.resizable !== false && (
                    <div
                      className="table-resize-handle"
                      onMouseDown={(e) => {
                        const startX = e.pageX;
                        const startWidth = columnWidths[column.key] || column.width || 150;
                        
                        const handleMouseMove = (e: MouseEvent) => {
                          const newWidth = Math.max(50, startWidth + (e.pageX - startX));
                          handleColumnResize(column.key, newWidth);
                        };
                        
                        const handleMouseUp = () => {
                          document.removeEventListener('mousemove', handleMouseMove);
                          document.removeEventListener('mouseup', handleMouseUp);
                        };
                        
                        document.addEventListener('mousemove', handleMouseMove);
                        document.addEventListener('mouseup', handleMouseUp);
                      }}
                    />
                  )}
                </th>
              ))}
            </tr>
          </thead>
          
          <tbody>
            {processedData.map((record, index) => (
              <tr
                key={getRowKey(record, index)}
                className={`table-row ${onRowClick ? 'clickable' : ''}`}
                onClick={() => onRowClick?.(record, index)}
              >
                {orderedColumns.map((column) => (
                  <td key={column.key} className="table-cell">
                    {renderCell(column, record, index)}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
        
        {processedData.length === 0 && (
          <div className="table-empty">No data</div>
        )}
      </div>
      
      {pagination && (
        <div className="table-pagination">
          <button
            disabled={pagination.current === 1}
            onClick={() => pagination.onChange(pagination.current - 1, pagination.pageSize)}
            className="pagination-btn"
          >
            Previous
          </button>
          <span className="pagination-info">
            Page {pagination.current} of {Math.ceil(pagination.total / pagination.pageSize)}
          </span>
          <button
            disabled={pagination.current * pagination.pageSize >= pagination.total}
            onClick={() => pagination.onChange(pagination.current + 1, pagination.pageSize)}
            className="pagination-btn"
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
};

export default Table;
