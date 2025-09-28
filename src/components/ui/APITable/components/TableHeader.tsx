// ========================================
// TABLE HEADER COMPONENT
// ========================================

import { useCallback, useState, useRef, useEffect } from 'react';
import { ChevronUp, ChevronDown, ChevronsUpDown, GripVertical, Search, X } from 'lucide-react';
import Checkbox from '../../Checkbox/Checkbox';
import type { ColumnConfig, SortDirection } from '../types';

interface TableHeaderProps<T = any> {
  columns: ColumnConfig<T>[];
  sorting: {
    field: string;
    direction: SortDirection;
  };
  onSort: (field: string, direction: SortDirection) => void;
  selectable?: boolean;
  // selectType?: 'checkbox' | 'radio'; // Only checkbox selection supported
  selectedRowKeys: (string | number)[];
  allRowKeys: (string | number)[];
  onSelectAll: (selected: boolean) => void;
  resizable?: boolean;
  onColumnResize?: (columnKey: string, width: number) => void;
  sticky?: boolean;
  className?: string;
  // Search functionality
  columnFilters?: Record<string, string>;
  onColumnFilter?: (columnKey: string, value: string) => void;
}

const TableHeader = <T extends Record<string, any>>({
  columns,
  sorting,
  onSort,
  selectable = false,
  // selectType = 'checkbox', // Only checkbox selection supported
  selectedRowKeys,
  allRowKeys,
  onSelectAll,
  resizable = false,
  onColumnResize,
  sticky = false,
  className = '',
  columnFilters = {},
  onColumnFilter
}: TableHeaderProps<T>) => {
  // Search state
  const [activeSearchColumn, setActiveSearchColumn] = useState<string | null>(null);
  const [searchValues, setSearchValues] = useState<Record<string, string>>(columnFilters);
  const searchInputRef = useRef<HTMLInputElement>(null);

  // Update search values when columnFilters prop changes
  useEffect(() => {
    setSearchValues(columnFilters);
  }, [columnFilters]);

  // Focus search input when opened
  useEffect(() => {
    if (activeSearchColumn && searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, [activeSearchColumn]);

  // Handle search input change
  const handleSearchChange = useCallback((columnKey: string, value: string) => {
    setSearchValues(prev => ({ ...prev, [columnKey]: value }));
    onColumnFilter?.(columnKey, value);
  }, [onColumnFilter]);

  // Handle search toggle
  const handleSearchToggle = useCallback((columnKey: string) => {
    if (activeSearchColumn === columnKey) {
      setActiveSearchColumn(null);
    } else {
      setActiveSearchColumn(columnKey);
    }
  }, [activeSearchColumn]);

  // Handle search clear
  const handleSearchClear = useCallback((columnKey: string) => {
    setSearchValues(prev => ({ ...prev, [columnKey]: '' }));
    onColumnFilter?.(columnKey, '');
    setActiveSearchColumn(null);
  }, [onColumnFilter]);

  // Handle click outside to close search
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (activeSearchColumn && searchInputRef.current && !searchInputRef.current.contains(event.target as Node)) {
        setActiveSearchColumn(null);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [activeSearchColumn]);

  // Handle column sort
  const handleSort = useCallback((columnKey: string) => {
    const column = columns.find(col => col.key === columnKey);
    if (!column?.sortable) return;

    let newDirection: SortDirection = 'asc';
    
    if (sorting.field === columnKey) {
      if (sorting.direction === 'asc') {
        newDirection = 'desc';
      } else if (sorting.direction === 'desc') {
        newDirection = null; // Clear sorting
      } else {
        newDirection = 'asc';
      }
    }

    onSort(columnKey, newDirection);
  }, [columns, sorting, onSort]);

  // Handle select all
  const handleSelectAll = useCallback((checked: boolean) => {
    onSelectAll(checked);
  }, [onSelectAll]);

  // Get sort icon
  const getSortIcon = useCallback((columnKey: string) => {
    if (sorting.field !== columnKey) {
      return <ChevronsUpDown className="table-header__sort-icon" size={14} />;
    }
    
    if (sorting.direction === 'asc') {
      return <ChevronUp className="table-header__sort-icon table-header__sort-icon--active" size={14} />;
    } else if (sorting.direction === 'desc') {
      return <ChevronDown className="table-header__sort-icon table-header__sort-icon--active" size={14} />;
    }
    
    return <ChevronsUpDown className="table-header__sort-icon" size={14} />;
  }, [sorting]);

  // Handle column resize
  const handleColumnResize = useCallback((columnKey: string, startX: number, startWidth: number) => {
    if (!resizable || !onColumnResize) return;

    const handleMouseMove = (e: MouseEvent) => {
      const newWidth = Math.max(50, startWidth + (e.pageX - startX));
      onColumnResize(columnKey, newWidth);
    };

    const handleMouseUp = () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
      document.body.style.cursor = '';
      document.body.style.userSelect = '';
    };

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
    document.body.style.cursor = 'col-resize';
    document.body.style.userSelect = 'none';
  }, [resizable, onColumnResize]);

  // Calculate selection state
  const isAllSelected = allRowKeys.length > 0 && selectedRowKeys.length === allRowKeys.length;
  const isIndeterminate = selectedRowKeys.length > 0 && selectedRowKeys.length < allRowKeys.length;

  return (
    <thead className={`table-header ${sticky ? 'table-header--sticky' : ''} ${className}`}>
      <tr className="table-header__row">
        {/* Selection column */}
        {selectable && (
          <th className="table-header__cell table-header__cell--selection">
            <Checkbox
              checked={isAllSelected}
              indeterminate={isIndeterminate}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleSelectAll(e.target.checked)}
              aria-label="Select all rows"
            />
          </th>
        )}

        {/* Data columns */}
        {columns.map((column) => {
          const isSortable = column.sortable !== false;
          const isResizable = resizable && column.resizable !== false;
          const isFixed = column.fixed;
          const alignment = column.align || 'left';

          return (
            <th
              key={column.key}
              className={`
                table-header__cell
                table-header__cell--${alignment}
                ${isSortable ? 'table-header__cell--sortable' : ''}
                ${isFixed ? `table-header__cell--fixed-${isFixed}` : ''}
                ${column.headerClassName || ''}
              `.trim()}
              style={{
                width: column.width,
                minWidth: column.minWidth,
                maxWidth: column.maxWidth
              }}
            >
              <div className="table-header__content">
                {/* Column title and sort */}
                <div className="table-header__title-row">
                  <div
                    className={`table-header__title ${isSortable ? 'table-header__title--sortable' : ''}`}
                    onClick={() => isSortable && handleSort(column.key)}
                  >
                    <span className="table-header__text">
                      {column.title}
                    </span>
                    {isSortable && getSortIcon(column.key)}
                  </div>

                  {/* Search functionality */}
                  {column.searchable !== false && onColumnFilter && (
                    <div className="table-header__search">
                      <button
                        className={`table-header__search-btn ${searchValues[column.key] ? 'table-header__search-btn--active' : ''}`}
                        onClick={() => handleSearchToggle(column.key)}
                        title={`Search ${column.title}`}
                      >
                        <Search size={14} />
                      </button>

                      {activeSearchColumn === column.key && (
                        <div className="table-header__search-popup" ref={searchInputRef}>
                          <input
                            type="text"
                            className="table-header__search-input"
                            placeholder={`Search ${column.title}...`}
                            value={searchValues[column.key] || ''}
                            onChange={(e) => handleSearchChange(column.key, e.target.value)}
                            onKeyDown={(e) => {
                              if (e.key === 'Escape') {
                                setActiveSearchColumn(null);
                              }
                            }}
                          />
                          {searchValues[column.key] && (
                            <button
                              className="table-header__search-clear"
                              onClick={() => handleSearchClear(column.key)}
                              title="Clear search"
                            >
                              <X size={12} />
                            </button>
                          )}
                        </div>
                      )}
                    </div>
                  )}
                </div>

                {/* Resize handle */}
                {isResizable && (
                  <div
                    className="table-header__resize-handle"
                    onMouseDown={(e) => {
                      e.preventDefault();
                      const rect = (e.currentTarget.parentElement?.parentElement as HTMLElement)?.getBoundingClientRect();
                      const startWidth = rect?.width || 150;
                      handleColumnResize(column.key, e.pageX, startWidth);
                    }}
                  >
                    <GripVertical size={12} />
                  </div>
                )}
              </div>
            </th>
          );
        })}
      </tr>
    </thead>
  );
};

export default TableHeader;
