// ========================================
// TABLE FILTERS COMPONENT
// ========================================

import React, { useCallback, useMemo, useState } from 'react';
import { Filter, X, ChevronDown } from 'lucide-react';
import Input from '../../Input/Input';
import Dropdown from '../../Dropdown/Dropdown';
import DatePicker from '../../DatePicker/DatePicker';
import Switch from '../../Switch/Switch';
import type { FilterConfig, TableFilters as TableFiltersState } from '../types';

interface TableFiltersProps {
  filters: FilterConfig[];
  values: TableFiltersState;
  onChange: (filters: TableFiltersState) => void;
  onReset: () => void;
  className?: string;
}

const TableFilters: React.FC<TableFiltersProps> = ({
  filters,
  values,
  onChange,
  onReset,
  className = ''
}) => {
  const [showAdvanced, setShowAdvanced] = useState(false);

  // Handle filter change
  const handleFilterChange = useCallback((field: string, value: any) => {
    const newFilters = { ...values };
    
    if (value === null || value === undefined || value === '') {
      delete newFilters[field];
    } else {
      newFilters[field] = value;
    }
    
    onChange(newFilters);
  }, [values, onChange]);

  // Check if any filters are active
  const hasActiveFilters = useMemo(() => {
    return Object.keys(values).length > 0;
  }, [values]);

  // Count active filters
  const activeFilterCount = useMemo(() => {
    return Object.keys(values).length;
  }, [values]);

  // Render filter input based on type
  const renderFilterInput = useCallback((filter: FilterConfig) => {
    const currentValue = values[filter.field];

    switch (filter.type) {
      case 'text':
        return (
          <Input
            placeholder={filter.placeholder || `Filter by ${filter.label || filter.field}`}
            value={currentValue || ''}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleFilterChange(filter.field, e.target.value)}
            size="small"
            className="table-filters__input"
          />
        );

      case 'select':
        return (
          <Dropdown
            options={filter.options || []}
            value={currentValue}
            onChange={(value: string | number) => handleFilterChange(filter.field, value)}
            placeholder={filter.placeholder || `Select ${filter.label || filter.field}`}
            searchable={filter.searchable}
            size="small"
            className="table-filters__dropdown"
          />
        );

      case 'multiselect':
        // For multiselect, we'll use a simple implementation
        // In a real app, you might want a more sophisticated multiselect component
        return (
          <Dropdown
            options={filter.options || []}
            value={Array.isArray(currentValue) ? currentValue[0] : currentValue}
            onChange={(value: string | number) => {
              // Simple implementation - just store single value for now
              // You could extend this to handle multiple selections
              handleFilterChange(filter.field, value);
            }}
            placeholder={filter.placeholder || `Select ${filter.label || filter.field}`}
            searchable={filter.searchable}
            size="small"
            className="table-filters__dropdown"
          />
        );

      case 'boolean':
        return (
          <div className="table-filters__boolean">
            <Switch
              checked={currentValue === true}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleFilterChange(filter.field, e.target.checked ? true : null)}
              size="small"
            />
            <span className="table-filters__boolean-label">
              {filter.label || filter.field}
            </span>
          </div>
        );

      case 'date':
        return (
          <DatePicker
            value={currentValue}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleFilterChange(filter.field, e.target.value)}
            placeholder={filter.placeholder || `Select ${filter.label || filter.field}`}
            size="small"
            className="table-filters__date"
          />
        );

      case 'daterange':
        // For date range, we'll store as an object with start and end
        const dateRange = currentValue || {};
        return (
          <div className="table-filters__date-range">
            <DatePicker
              value={dateRange.start}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleFilterChange(filter.field, { ...dateRange, start: e.target.value })}
              placeholder="Start date"
              size="small"
              className="table-filters__date table-filters__date--start"
            />
            <span className="table-filters__date-separator">to</span>
            <DatePicker
              value={dateRange.end}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleFilterChange(filter.field, { ...dateRange, end: e.target.value })}
              placeholder="End date"
              size="small"
              className="table-filters__date table-filters__date--end"
            />
          </div>
        );

      case 'number':
        const numberConfig = filter.numberFormat || {};
        return (
          <Input
            type="number"
            placeholder={filter.placeholder || `Filter by ${filter.label || filter.field}`}
            value={currentValue || ''}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
              const value = e.target.value;
              handleFilterChange(filter.field, value ? Number(value) : null);
            }}
            min={numberConfig.min}
            max={numberConfig.max}
            step={numberConfig.step}
            size="small"
            className="table-filters__input"
          />
        );

      default:
        return null;
    }
  }, [values, handleFilterChange]);

  // Separate basic and advanced filters
  const basicFilters = useMemo(() => filters.slice(0, 3), [filters]);
  const advancedFilters = useMemo(() => filters.slice(3), [filters]);

  return (
    <div className={`table-filters ${className}`}>
      <div className="table-filters__main">

        {/* Basic filters */}
        {basicFilters.length > 0 && (
          <div className="table-filters__basic">
            {basicFilters.map((filter) => (
              <div key={filter.field} className="table-filters__item">
                <label className="table-filters__label">
                  {filter.label || filter.field}
                </label>
                {renderFilterInput(filter)}
              </div>
            ))}
          </div>
        )}

        {/* Filter controls */}
        <div className="table-filters__controls">
          {/* Advanced filters toggle */}
          {advancedFilters.length > 0 && (
            <button
              className={`table-filters__toggle ${showAdvanced ? 'table-filters__toggle--active' : ''}`}
              onClick={() => setShowAdvanced(!showAdvanced)}
            >
              <Filter size={16} />
              <span>Advanced</span>
              <ChevronDown 
                size={14} 
                className={`table-filters__toggle-icon ${showAdvanced ? 'table-filters__toggle-icon--rotated' : ''}`}
              />
            </button>
          )}

          {/* Active filter count */}
          {activeFilterCount > 0 && (
            <span className="table-filters__count">
              {activeFilterCount} filter{activeFilterCount !== 1 ? 's' : ''} active
            </span>
          )}

          {/* Reset button */}
          {hasActiveFilters && (
            <button
              className="table-filters__reset"
              onClick={onReset}
              title="Clear all filters"
            >
              <X size={16} />
              <span>Clear</span>
            </button>
          )}
        </div>
      </div>

      {/* Advanced filters */}
      {showAdvanced && advancedFilters.length > 0 && (
        <div className="table-filters__advanced">
          <div className="table-filters__advanced-content">
            {advancedFilters.map((filter) => (
              <div key={filter.field} className="table-filters__item">
                <label className="table-filters__label">
                  {filter.label || filter.field}
                </label>
                {renderFilterInput(filter)}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default TableFilters;
