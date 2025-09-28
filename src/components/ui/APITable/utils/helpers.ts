// ========================================
// UTILITY HELPERS
// ========================================

import type { ColumnConfig, FilterConfig } from '../types';

// Generate unique ID for table instances
export function generateTableId(endpoint: string): string {
  return `api-table-${endpoint.replace(/[^a-zA-Z0-9]/g, '-').toLowerCase()}`;
}

// Deep clone object
export function deepClone<T>(obj: T): T {
  if (obj === null || typeof obj !== 'object') return obj;
  if (obj instanceof Date) return new Date(obj.getTime()) as any;
  if (obj instanceof Array) return obj.map(item => deepClone(item)) as any;
  if (typeof obj === 'object') {
    const cloned = {} as any;
    Object.keys(obj).forEach(key => {
      cloned[key] = deepClone((obj as any)[key]);
    });
    return cloned;
  }
  return obj;
}

// Debounce function
export function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number,
  immediate: boolean = false
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout | null = null;
  
  return function executedFunction(...args: Parameters<T>) {
    const later = () => {
      timeout = null;
      if (!immediate) func(...args);
    };
    
    const callNow = immediate && !timeout;
    
    if (timeout) clearTimeout(timeout);
    timeout = setTimeout(later, wait);
    
    if (callNow) func(...args);
  };
}

// Throttle function
export function throttle<T extends (...args: any[]) => any>(
  func: T,
  limit: number
): (...args: Parameters<T>) => void {
  let inThrottle: boolean;
  
  return function executedFunction(...args: Parameters<T>) {
    if (!inThrottle) {
      func(...args);
      inThrottle = true;
      setTimeout(() => inThrottle = false, limit);
    }
  };
}

// Get nested object property by path
export function getNestedValue(obj: any, path: string): any {
  return path.split('.').reduce((current, key) => current?.[key], obj);
}

// Set nested object property by path
export function setNestedValue(obj: any, path: string, value: any): void {
  const keys = path.split('.');
  const lastKey = keys.pop()!;
  const target = keys.reduce((current, key) => {
    if (!(key in current)) current[key] = {};
    return current[key];
  }, obj);
  target[lastKey] = value;
}

// Compare two objects for equality (shallow)
export function shallowEqual(obj1: any, obj2: any): boolean {
  const keys1 = Object.keys(obj1);
  const keys2 = Object.keys(obj2);
  
  if (keys1.length !== keys2.length) return false;
  
  return keys1.every(key => obj1[key] === obj2[key]);
}

// Compare two objects for equality (deep)
export function deepEqual(obj1: any, obj2: any): boolean {
  if (obj1 === obj2) return true;
  
  if (obj1 == null || obj2 == null) return obj1 === obj2;
  
  if (typeof obj1 !== typeof obj2) return false;
  
  if (typeof obj1 !== 'object') return obj1 === obj2;
  
  if (Array.isArray(obj1) !== Array.isArray(obj2)) return false;
  
  const keys1 = Object.keys(obj1);
  const keys2 = Object.keys(obj2);
  
  if (keys1.length !== keys2.length) return false;
  
  return keys1.every(key => deepEqual(obj1[key], obj2[key]));
}

// Merge objects deeply
export function deepMerge<T extends Record<string, any>>(target: T, ...sources: Partial<T>[]): T {
  if (!sources.length) return target;
  const source = sources.shift();
  
  if (isObject(target) && isObject(source)) {
    for (const key in source) {
      if (isObject(source[key])) {
        if (!target[key]) Object.assign(target, { [key]: {} });
        deepMerge(target[key], source[key] as Partial<T[Extract<keyof T, string>]>);
      } else {
        Object.assign(target, { [key]: source[key] });
      }
    }
  }
  
  return deepMerge(target, ...sources);
}

// Check if value is an object
function isObject(item: any): boolean {
  return item && typeof item === 'object' && !Array.isArray(item);
}

// Sort array of objects by multiple fields
export function multiSort<T>(
  array: T[],
  sortFields: Array<{ field: string; direction: 'asc' | 'desc' }>
): T[] {
  return [...array].sort((a, b) => {
    for (const { field, direction } of sortFields) {
      const aVal = getNestedValue(a, field);
      const bVal = getNestedValue(b, field);
      
      let comparison = 0;
      
      if (aVal < bVal) comparison = -1;
      else if (aVal > bVal) comparison = 1;
      
      if (comparison !== 0) {
        return direction === 'desc' ? -comparison : comparison;
      }
    }
    return 0;
  });
}

// Filter array of objects by multiple criteria
export function multiFilter<T>(
  array: T[],
  filters: Record<string, any>,
  filterConfigs: FilterConfig[]
): T[] {
  return array.filter(item => {
    return Object.entries(filters).every(([field, value]) => {
      if (value === null || value === undefined || value === '') return true;
      
      const config = filterConfigs.find(f => f.field === field);
      const itemValue = getNestedValue(item, field);
      
      if (!config) return true;
      
      switch (config.type) {
        case 'text':
          return String(itemValue).toLowerCase().includes(String(value).toLowerCase());
        
        case 'select':
          return itemValue === value;
        
        case 'multiselect':
          return Array.isArray(value) ? value.includes(itemValue) : itemValue === value;
        
        case 'boolean':
          return Boolean(itemValue) === Boolean(value);
        
        case 'date':
          return new Date(itemValue).toDateString() === new Date(value).toDateString();
        
        case 'daterange':
          const itemDate = new Date(itemValue);
          const startDate = new Date(value.start);
          const endDate = new Date(value.end);
          return itemDate >= startDate && itemDate <= endDate;
        
        case 'number':
          return Number(itemValue) === Number(value);
        
        case 'numberrange':
          const itemNum = Number(itemValue);
          const min = value.min !== undefined ? Number(value.min) : -Infinity;
          const max = value.max !== undefined ? Number(value.max) : Infinity;
          return itemNum >= min && itemNum <= max;
        
        default:
          return true;
      }
    });
  });
}

// Search array of objects by query string
export function searchData<T>(
  array: T[],
  query: string,
  searchableFields: string[]
): T[] {
  if (!query.trim()) return array;
  
  const lowerQuery = query.toLowerCase();
  
  return array.filter(item =>
    searchableFields.some(field => {
      const value = getNestedValue(item, field);
      return String(value).toLowerCase().includes(lowerQuery);
    })
  );
}

// Paginate array
export function paginateData<T>(
  array: T[],
  page: number,
  pageSize: number
): { data: T[]; total: number; totalPages: number } {
  const total = array.length;
  const totalPages = Math.ceil(total / pageSize);
  const startIndex = (page - 1) * pageSize;
  const endIndex = startIndex + pageSize;
  const data = array.slice(startIndex, endIndex);
  
  return { data, total, totalPages };
}

// Generate column key if not provided
export function generateColumnKey(title: string, index: number): string {
  return title.toLowerCase().replace(/[^a-z0-9]/g, '_') || `column_${index}`;
}

// Normalize column configuration
export function normalizeColumns(columns: ColumnConfig[]): ColumnConfig[] {
  return columns.map((column, index) => ({
    ...column,
    key: column.key || generateColumnKey(column.title, index),
    sortable: column.sortable !== false,
    resizable: column.resizable !== false,
    align: column.align || 'left',
    ellipsis: column.ellipsis !== false,
  }));
}

// Get visible columns based on settings
export function getVisibleColumns(
  columns: ColumnConfig[],
  columnSettings: Record<string, { visible: boolean; order: number }>
): ColumnConfig[] {
  return columns
    .filter(col => columnSettings[col.key]?.visible !== false)
    .sort((a, b) => {
      const orderA = columnSettings[a.key]?.order ?? columns.findIndex(c => c.key === a.key);
      const orderB = columnSettings[b.key]?.order ?? columns.findIndex(c => c.key === b.key);
      return orderA - orderB;
    });
}

// Calculate table statistics
export function calculateTableStats(data: any[]): {
  totalRows: number;
  totalColumns: number;
  memoryUsage: number;
} {
  const totalRows = data.length;
  const totalColumns = data.length > 0 ? Object.keys(data[0]).length : 0;
  
  // Rough memory usage calculation (in bytes)
  const memoryUsage = JSON.stringify(data).length * 2; // UTF-16 encoding
  
  return { totalRows, totalColumns, memoryUsage };
}

// Format memory usage for display
export function formatMemoryUsage(bytes: number): string {
  const units = ['B', 'KB', 'MB', 'GB'];
  let size = bytes;
  let unitIndex = 0;
  
  while (size >= 1024 && unitIndex < units.length - 1) {
    size /= 1024;
    unitIndex++;
  }
  
  return `${size.toFixed(1)} ${units[unitIndex]}`;
}

// Generate CSV content from data
export function generateCSV(
  data: any[],
  columns: ColumnConfig[],
  includeHeaders: boolean = true
): string {
  const rows: string[] = [];
  
  // Add headers
  if (includeHeaders) {
    const headers = columns.map(col => `"${col.title}"`).join(',');
    rows.push(headers);
  }
  
  // Add data rows
  data.forEach(row => {
    const values = columns.map(col => {
      let value = getNestedValue(row, col.key);
      
      // Handle null/undefined
      if (value === null || value === undefined) {
        value = '';
      }
      // Handle objects/arrays
      else if (typeof value === 'object') {
        value = JSON.stringify(value);
      }
      // Handle strings with quotes
      else if (typeof value === 'string') {
        value = `"${value.replace(/"/g, '""')}"`;
      }
      
      return value;
    }).join(',');
    
    rows.push(values);
  });
  
  return rows.join('\n');
}

// Download file helper
export function downloadFile(content: string, filename: string, mimeType: string): void {
  const blob = new Blob([content], { type: mimeType });
  const url = URL.createObjectURL(blob);
  
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  link.style.display = 'none';
  
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  
  URL.revokeObjectURL(url);
}

// Local storage helpers
export function saveToLocalStorage(key: string, data: any): boolean {
  try {
    localStorage.setItem(key, JSON.stringify(data));
    return true;
  } catch (error) {
    console.warn('Failed to save to localStorage:', error);
    return false;
  }
}

export function loadFromLocalStorage<T>(key: string, defaultValue: T): T {
  try {
    const stored = localStorage.getItem(key);
    return stored ? JSON.parse(stored) : defaultValue;
  } catch (error) {
    console.warn('Failed to load from localStorage:', error);
    return defaultValue;
  }
}

export function removeFromLocalStorage(key: string): boolean {
  try {
    localStorage.removeItem(key);
    return true;
  } catch (error) {
    console.warn('Failed to remove from localStorage:', error);
    return false;
  }
}

// URL parameter helpers
export function buildQueryString(params: Record<string, any>): string {
  const searchParams = new URLSearchParams();
  
  Object.entries(params).forEach(([key, value]) => {
    if (value !== null && value !== undefined && value !== '') {
      if (Array.isArray(value)) {
        searchParams.set(key, value.join(','));
      } else if (typeof value === 'object') {
        searchParams.set(key, JSON.stringify(value));
      } else {
        searchParams.set(key, String(value));
      }
    }
  });
  
  return searchParams.toString();
}

export function parseQueryString(queryString: string): Record<string, any> {
  const params: Record<string, any> = {};
  const searchParams = new URLSearchParams(queryString);
  
  searchParams.forEach((value, key) => {
    // Try to parse as JSON first
    try {
      params[key] = JSON.parse(value);
    } catch {
      // If not JSON, check if it's a comma-separated list
      if (value.includes(',')) {
        params[key] = value.split(',');
      } else {
        params[key] = value;
      }
    }
  });
  
  return params;
}

// Performance measurement helpers
export function measurePerformance<T>(
  name: string,
  fn: () => T
): { result: T; duration: number } {
  const start = performance.now();
  const result = fn();
  const duration = performance.now() - start;
  
  console.log(`[Performance] ${name}: ${duration.toFixed(2)}ms`);
  
  return { result, duration };
}

export function measureAsyncPerformance<T>(
  name: string,
  fn: () => Promise<T>
): Promise<{ result: T; duration: number }> {
  const start = performance.now();
  
  return fn().then(result => {
    const duration = performance.now() - start;
    console.log(`[Performance] ${name}: ${duration.toFixed(2)}ms`);
    return { result, duration };
  });
}
