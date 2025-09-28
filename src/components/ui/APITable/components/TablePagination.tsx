// ========================================
// TABLE PAGINATION COMPONENT
// ========================================

import React, { useCallback, useMemo } from 'react';
import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from 'lucide-react';
import Dropdown from '../../Dropdown/Dropdown';
import type { TablePagination as TablePaginationState } from '../types';

interface TablePaginationProps {
  pagination: TablePaginationState;
  onChange: (page: number, pageSize: number) => void;
  showSizeChanger?: boolean;
  showQuickJumper?: boolean;
  showTotal?: boolean;
  showPageNumbers?: boolean;
  className?: string;
}

const TablePagination: React.FC<TablePaginationProps> = ({
  pagination,
  onChange,
  showSizeChanger = true,
  showQuickJumper = true,
  showTotal = true,
  showPageNumbers = false,
  className = ''
}) => {
  const {
    current,
    pageSize,
    total,
    pageSizeOptions = [10, 25, 50, 100]
  } = pagination;

  const totalPages = Math.ceil(total / pageSize);
  const startItem = (current - 1) * pageSize + 1;
  const endItem = Math.min(current * pageSize, total);

  // Handle page change
  const handlePageChange = useCallback((newPage: number) => {
    if (newPage >= 1 && newPage <= totalPages && newPage !== current) {
      onChange(newPage, pageSize);
    }
  }, [current, totalPages, pageSize, onChange]);

  // Handle page size change
  const handlePageSizeChange = useCallback((newPageSize: string | number) => {
    const size = Number(newPageSize);
    if (size !== pageSize) {
      onChange(1, size); // Reset to first page when changing page size
    }
  }, [pageSize, onChange]);

  // Generate page numbers to display
  const pageNumbers = useMemo(() => {
    const pages: (number | string)[] = [];
    const maxVisible = 7; // Maximum number of page buttons to show

    if (totalPages <= maxVisible) {
      // Show all pages if total is small
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      // Always show first page
      pages.push(1);

      if (current <= 4) {
        // Near the beginning
        for (let i = 2; i <= 5; i++) {
          pages.push(i);
        }
        pages.push('...');
        pages.push(totalPages);
      } else if (current >= totalPages - 3) {
        // Near the end
        pages.push('...');
        for (let i = totalPages - 4; i <= totalPages; i++) {
          pages.push(i);
        }
      } else {
        // In the middle
        pages.push('...');
        for (let i = current - 1; i <= current + 1; i++) {
          pages.push(i);
        }
        pages.push('...');
        pages.push(totalPages);
      }
    }

    return pages;
  }, [current, totalPages]);

  // Page size options for dropdown
  const pageSizeDropdownOptions = useMemo(() => {
    return pageSizeOptions.map(size => ({
      value: size,
      label: `${size} / page`
    }));
  }, [pageSizeOptions]);

  if (total === 0) {
    return null;
  }

  return (
    <div className={`table-pagination ${className}`}>
      {/* Total info */}
      {showTotal && (
        <div className="table-pagination__info">
          <span className="table-pagination__total">
            Showing {startItem.toLocaleString()} to {endItem.toLocaleString()} of {total.toLocaleString()} entries
          </span>
        </div>
      )}

      {/* Page size selector */}
      {showSizeChanger && (
        <div className="table-pagination__size-changer">
          <Dropdown
            options={pageSizeDropdownOptions}
            value={pageSize}
            onChange={handlePageSizeChange}
            size="small"
            className="table-pagination__size-dropdown"
          />
        </div>
      )}

      {/* Pagination controls */}
      <div className="table-pagination__controls">
        {/* First page */}
        <span
          className={`table-pagination__nav table-pagination__nav--first ${current === 1 ? 'table-pagination__nav--disabled' : ''}`}
          onClick={() => current !== 1 && handlePageChange(1)}
          role="button"
          tabIndex={current === 1 ? -1 : 0}
          aria-label="First page"
          onKeyDown={(e) => {
            if ((e.key === 'Enter' || e.key === ' ') && current !== 1) {
              e.preventDefault();
              handlePageChange(1);
            }
          }}
        >
          <ChevronsLeft size={16} />
        </span>

        {/* Previous page */}
        <span
          className={`table-pagination__nav table-pagination__nav--prev ${current === 1 ? 'table-pagination__nav--disabled' : ''}`}
          onClick={() => current !== 1 && handlePageChange(current - 1)}
          role="button"
          tabIndex={current === 1 ? -1 : 0}
          aria-label="Previous page"
          onKeyDown={(e) => {
            if ((e.key === 'Enter' || e.key === ' ') && current !== 1) {
              e.preventDefault();
              handlePageChange(current - 1);
            }
          }}
        >
          <ChevronLeft size={16} />
        </span>

        {/* Page numbers */}
        {showPageNumbers && (
          <div className="table-pagination__pages">
            {pageNumbers.map((page, index) => {
              if (page === '...') {
                return (
                  <span key={`ellipsis-${index}`} className="table-pagination__ellipsis">
                    ...
                  </span>
                );
              }

              const pageNum = page as number;
              return (
                <button
                  key={pageNum}
                  className={`
                    table-pagination__btn 
                    table-pagination__btn--page 
                    ${pageNum === current ? 'table-pagination__btn--active' : ''}
                  `}
                  onClick={() => handlePageChange(pageNum)}
                  aria-label={`Page ${pageNum}`}
                  aria-current={pageNum === current ? 'page' : undefined}
                >
                  {pageNum}
                </button>
              );
            })}
          </div>
        )}

        {/* Next page */}
        <span
          className={`table-pagination__nav table-pagination__nav--next ${current === totalPages ? 'table-pagination__nav--disabled' : ''}`}
          onClick={() => current !== totalPages && handlePageChange(current + 1)}
          role="button"
          tabIndex={current === totalPages ? -1 : 0}
          aria-label="Next page"
          onKeyDown={(e) => {
            if ((e.key === 'Enter' || e.key === ' ') && current !== totalPages) {
              e.preventDefault();
              handlePageChange(current + 1);
            }
          }}
        >
          <ChevronRight size={16} />
        </span>

        {/* Last page */}
        <span
          className={`table-pagination__nav table-pagination__nav--last ${current === totalPages ? 'table-pagination__nav--disabled' : ''}`}
          onClick={() => current !== totalPages && handlePageChange(totalPages)}
          role="button"
          tabIndex={current === totalPages ? -1 : 0}
          aria-label="Last page"
          onKeyDown={(e) => {
            if ((e.key === 'Enter' || e.key === ' ') && current !== totalPages) {
              e.preventDefault();
              handlePageChange(totalPages);
            }
          }}
        >
          <ChevronsRight size={16} />
        </span>
      </div>

      {/* Quick jumper */}
      {showQuickJumper && totalPages > 1 && (
        <div className="table-pagination__jumper">
          <span className="table-pagination__jumper-label">Go to:</span>
          <input
            type="number"
            min={1}
            max={totalPages}
            className="table-pagination__jumper-input"
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                const value = parseInt((e.target as HTMLInputElement).value, 10);
                if (value >= 1 && value <= totalPages) {
                  handlePageChange(value);
                  (e.target as HTMLInputElement).value = '';
                }
              }
            }}
            placeholder="Page"
          />
        </div>
      )}
    </div>
  );
};

export default TablePagination;
