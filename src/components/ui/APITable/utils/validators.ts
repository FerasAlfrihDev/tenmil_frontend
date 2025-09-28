// ========================================
// DATA VALIDATORS
// ========================================

import type { ColumnConfig, FilterConfig } from '../types';

// Validate column configuration
export function validateColumns(columns: ColumnConfig[]): string[] {
  const errors: string[] = [];
  const keys = new Set<string>();

  columns.forEach((column, index) => {
    // Check for required fields
    if (!column.key) {
      errors.push(`Column at index ${index} is missing required 'key' property`);
    }
    
    if (!column.title) {
      errors.push(`Column at index ${index} is missing required 'title' property`);
    }

    // Check for duplicate keys
    if (column.key) {
      if (keys.has(column.key)) {
        errors.push(`Duplicate column key '${column.key}' found`);
      }
      keys.add(column.key);
    }

    // Validate column type
    if (column.type && !['text', 'number', 'date', 'boolean', 'select', 'custom'].includes(column.type)) {
      errors.push(`Invalid column type '${column.type}' for column '${column.key}'`);
    }

    // Validate width values
    if (column.width && typeof column.width === 'number' && column.width < 0) {
      errors.push(`Invalid width value for column '${column.key}': must be positive`);
    }

    if (column.minWidth && column.minWidth < 0) {
      errors.push(`Invalid minWidth value for column '${column.key}': must be positive`);
    }

    if (column.maxWidth && column.maxWidth < 0) {
      errors.push(`Invalid maxWidth value for column '${column.key}': must be positive`);
    }

    // Validate min/max width relationship
    if (column.minWidth && column.maxWidth && column.minWidth > column.maxWidth) {
      errors.push(`Column '${column.key}': minWidth cannot be greater than maxWidth`);
    }

    // Validate fixed position
    if (column.fixed && !['left', 'right'].includes(column.fixed)) {
      errors.push(`Invalid fixed position '${column.fixed}' for column '${column.key}': must be 'left' or 'right'`);
    }

    // Validate align
    if (column.align && !['left', 'center', 'right'].includes(column.align)) {
      errors.push(`Invalid align value '${column.align}' for column '${column.key}': must be 'left', 'center', or 'right'`);
    }
  });

  return errors;
}

// Validate filter configuration
export function validateFilters(filters: FilterConfig[]): string[] {
  const errors: string[] = [];
  const fields = new Set<string>();

  filters.forEach((filter, index) => {
    // Check for required fields
    if (!filter.field) {
      errors.push(`Filter at index ${index} is missing required 'field' property`);
    }

    if (!filter.type) {
      errors.push(`Filter at index ${index} is missing required 'type' property`);
    }

    // Check for duplicate fields
    if (filter.field) {
      if (fields.has(filter.field)) {
        errors.push(`Duplicate filter field '${filter.field}' found`);
      }
      fields.add(filter.field);
    }

    // Validate filter type
    const validTypes = ['text', 'select', 'multiselect', 'boolean', 'date', 'daterange', 'number', 'numberrange'];
    if (filter.type && !validTypes.includes(filter.type)) {
      errors.push(`Invalid filter type '${filter.type}' for filter '${filter.field}'`);
    }

    // Validate options for select/multiselect
    if (['select', 'multiselect'].includes(filter.type) && !filter.options) {
      errors.push(`Filter '${filter.field}' of type '${filter.type}' requires 'options' property`);
    }

    // Validate options format
    if (filter.options) {
      if (!Array.isArray(filter.options)) {
        errors.push(`Filter '${filter.field}': options must be an array`);
      } else {
        filter.options.forEach((option, optionIndex) => {
          if (!option || typeof option !== 'object' || !('label' in option) || !('value' in option)) {
            errors.push(`Filter '${filter.field}': option at index ${optionIndex} must have 'label' and 'value' properties`);
          }
        });
      }
    }
  });

  return errors;
}

// Validate API endpoint URL
export function validateEndpoint(endpoint: string): string[] {
  const errors: string[] = [];

  if (!endpoint) {
    errors.push('Endpoint is required');
    return errors;
  }

  if (typeof endpoint !== 'string') {
    errors.push('Endpoint must be a string');
    return errors;
  }

  // Check if it's a valid URL path or full URL
  try {
    // Try as full URL first
    new URL(endpoint);
  } catch {
    // If not a full URL, check if it's a valid path
    if (!endpoint.startsWith('/')) {
      errors.push('Endpoint must be a valid URL or start with "/"');
    }
  }

  return errors;
}

// Validate pagination parameters
export function validatePagination(page: number, pageSize: number): string[] {
  const errors: string[] = [];

  if (!Number.isInteger(page) || page < 1) {
    errors.push('Page must be a positive integer');
  }

  if (!Number.isInteger(pageSize) || pageSize < 1) {
    errors.push('Page size must be a positive integer');
  }

  if (pageSize > 1000) {
    errors.push('Page size cannot exceed 1000 items');
  }

  return errors;
}

// Validate sort parameters
export function validateSort(field: string, direction: string, columns: ColumnConfig[]): string[] {
  const errors: string[] = [];

  if (!field) {
    errors.push('Sort field is required');
    return errors;
  }

  if (!['asc', 'desc'].includes(direction)) {
    errors.push('Sort direction must be "asc" or "desc"');
  }

  // Check if field exists in columns and is sortable
  const column = columns.find(col => col.key === field);
  if (!column) {
    errors.push(`Sort field '${field}' not found in columns`);
  } else if (column.sortable === false) {
    errors.push(`Column '${field}' is not sortable`);
  }

  return errors;
}

// Validate filter values
export function validateFilterValues(
  filters: Record<string, any>,
  filterConfigs: FilterConfig[]
): string[] {
  const errors: string[] = [];

  Object.entries(filters).forEach(([field, value]) => {
    const config = filterConfigs.find(f => f.field === field);
    
    if (!config) {
      errors.push(`Unknown filter field '${field}'`);
      return;
    }

    // Skip validation for empty values
    if (value === null || value === undefined || value === '') {
      return;
    }

    switch (config.type) {
      case 'text':
        if (typeof value !== 'string') {
          errors.push(`Filter '${field}': value must be a string`);
        }
        break;

      case 'number':
        if (typeof value !== 'number' && !Number.isFinite(Number(value))) {
          errors.push(`Filter '${field}': value must be a number`);
        }
        break;

      case 'boolean':
        if (typeof value !== 'boolean' && !['true', 'false', '1', '0'].includes(String(value))) {
          errors.push(`Filter '${field}': value must be a boolean`);
        }
        break;

      case 'date':
        if (!isValidDate(value)) {
          errors.push(`Filter '${field}': value must be a valid date`);
        }
        break;

      case 'daterange':
        if (typeof value !== 'object' || !value.start || !value.end) {
          errors.push(`Filter '${field}': value must be an object with 'start' and 'end' properties`);
        } else if (!isValidDate(value.start) || !isValidDate(value.end)) {
          errors.push(`Filter '${field}': start and end must be valid dates`);
        } else if (new Date(value.start) > new Date(value.end)) {
          errors.push(`Filter '${field}': start date cannot be after end date`);
        }
        break;

      case 'numberrange':
        if (typeof value !== 'object') {
          errors.push(`Filter '${field}': value must be an object`);
        } else {
          if (value.min !== undefined && !Number.isFinite(Number(value.min))) {
            errors.push(`Filter '${field}': min value must be a number`);
          }
          if (value.max !== undefined && !Number.isFinite(Number(value.max))) {
            errors.push(`Filter '${field}': max value must be a number`);
          }
          if (value.min !== undefined && value.max !== undefined && Number(value.min) > Number(value.max)) {
            errors.push(`Filter '${field}': min value cannot be greater than max value`);
          }
        }
        break;

      case 'select':
        if (config.options && !config.options.some(opt => opt.value === value)) {
          errors.push(`Filter '${field}': value '${value}' is not in the allowed options`);
        }
        break;

      case 'multiselect':
        if (!Array.isArray(value)) {
          errors.push(`Filter '${field}': value must be an array`);
        } else if (config.options) {
          const validValues = config.options.map(opt => opt.value);
          const invalidValues = value.filter(v => !validValues.includes(v));
          if (invalidValues.length > 0) {
            errors.push(`Filter '${field}': invalid values: ${invalidValues.join(', ')}`);
          }
        }
        break;
    }
  });

  return errors;
}

// Helper function to validate date strings
function isValidDate(value: any): boolean {
  if (!value) return false;
  const date = new Date(value);
  return !isNaN(date.getTime());
}

// Validate row key function or property
export function validateRowKey(rowKey: string | ((record: any) => string), data: any[]): string[] {
  const errors: string[] = [];

  if (!rowKey) {
    errors.push('Row key is required');
    return errors;
  }

  if (typeof rowKey === 'string') {
    // Check if the property exists in data
    if (data.length > 0 && !(rowKey in data[0])) {
      errors.push(`Row key property '${rowKey}' not found in data`);
    }
  } else if (typeof rowKey !== 'function') {
    errors.push('Row key must be a string property name or function');
  }

  return errors;
}

// Validate export options
export function validateExportOptions(options: any): string[] {
  const errors: string[] = [];

  if (!options || typeof options !== 'object') {
    errors.push('Export options must be an object');
    return errors;
  }

  if (!options.format) {
    errors.push('Export format is required');
  } else if (!['csv', 'excel', 'json'].includes(options.format)) {
    errors.push('Export format must be "csv", "excel", or "json"');
  }

  if (options.filename && typeof options.filename !== 'string') {
    errors.push('Filename must be a string');
  }

  return errors;
}

// Comprehensive validation function
export function validateAPITableProps(props: any): string[] {
  const errors: string[] = [];

  // Validate required props
  if (!props.endpoint) {
    errors.push('Endpoint is required');
  } else {
    errors.push(...validateEndpoint(props.endpoint));
  }

  if (!props.columns || !Array.isArray(props.columns)) {
    errors.push('Columns array is required');
  } else {
    errors.push(...validateColumns(props.columns));
  }

  // Validate optional props
  if (props.filters) {
    if (!Array.isArray(props.filters)) {
      errors.push('Filters must be an array');
    } else {
      errors.push(...validateFilters(props.filters));
    }
  }

  if (props.defaultPageSize && (!Number.isInteger(props.defaultPageSize) || props.defaultPageSize < 1)) {
    errors.push('Default page size must be a positive integer');
  }

  // selectType validation removed - only checkbox selection is supported

  if (props.size && !['small', 'middle', 'large'].includes(props.size)) {
    errors.push('Size must be "small", "middle", or "large"');
  }

  return errors;
}
