// ========================================
// DATA FORMATTERS
// ========================================

import type { ColumnConfig } from '../types';

// Format date values
export function formatDate(
  value: any, 
  format: 'short' | 'long' | 'iso' | 'relative' | string = 'short'
): string {
  if (!value) return '';
  
  const date = new Date(value);
  if (isNaN(date.getTime())) return value?.toString() || '';

  switch (format) {
    case 'short':
      return date.toLocaleDateString();
    case 'long':
      return date.toLocaleDateString(undefined, {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      });
    case 'iso':
      return date.toISOString();
    case 'relative':
      return formatRelativeTime(date);
    default:
      // Custom format string
      return date.toLocaleDateString(undefined, parseFormatString(format));
  }
}

// Format relative time (e.g., "2 hours ago")
export function formatRelativeTime(date: Date): string {
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffSeconds = Math.floor(diffMs / 1000);
  const diffMinutes = Math.floor(diffSeconds / 60);
  const diffHours = Math.floor(diffMinutes / 60);
  const diffDays = Math.floor(diffHours / 24);
  const diffWeeks = Math.floor(diffDays / 7);
  const diffMonths = Math.floor(diffDays / 30);
  const diffYears = Math.floor(diffDays / 365);

  if (diffSeconds < 60) return 'Just now';
  if (diffMinutes < 60) return `${diffMinutes} minute${diffMinutes !== 1 ? 's' : ''} ago`;
  if (diffHours < 24) return `${diffHours} hour${diffHours !== 1 ? 's' : ''} ago`;
  if (diffDays < 7) return `${diffDays} day${diffDays !== 1 ? 's' : ''} ago`;
  if (diffWeeks < 4) return `${diffWeeks} week${diffWeeks !== 1 ? 's' : ''} ago`;
  if (diffMonths < 12) return `${diffMonths} month${diffMonths !== 1 ? 's' : ''} ago`;
  return `${diffYears} year${diffYears !== 1 ? 's' : ''} ago`;
}

// Parse format string for date formatting
function parseFormatString(format: string): Intl.DateTimeFormatOptions {
  const options: Intl.DateTimeFormatOptions = {};
  
  if (format.includes('YYYY')) options.year = 'numeric';
  if (format.includes('YY')) options.year = '2-digit';
  if (format.includes('MMMM')) options.month = 'long';
  if (format.includes('MMM')) options.month = 'short';
  if (format.includes('MM')) options.month = '2-digit';
  if (format.includes('DD')) options.day = '2-digit';
  if (format.includes('HH')) options.hour = '2-digit';
  if (format.includes('mm')) options.minute = '2-digit';
  if (format.includes('ss')) options.second = '2-digit';
  
  return options;
}

// Format number values
export function formatNumber(
  value: any,
  options: {
    decimals?: number;
    currency?: string;
    percentage?: boolean;
    compact?: boolean;
    locale?: string;
  } = {}
): string {
  if (value === null || value === undefined || value === '') return '';
  
  const numValue = typeof value === 'number' ? value : parseFloat(value);
  if (isNaN(numValue)) return value?.toString() || '';

  const {
    decimals,
    currency,
    percentage = false,
    compact = false,
    locale = 'en-US'
  } = options;

  let formatOptions: Intl.NumberFormatOptions = {};

  if (currency) {
    formatOptions.style = 'currency';
    formatOptions.currency = currency;
  } else if (percentage) {
    formatOptions.style = 'percent';
  }

  if (decimals !== undefined) {
    formatOptions.minimumFractionDigits = decimals;
    formatOptions.maximumFractionDigits = decimals;
  }

  if (compact) {
    formatOptions.notation = 'compact';
    formatOptions.compactDisplay = 'short';
  }

  return new Intl.NumberFormat(locale, formatOptions).format(
    percentage && !currency ? numValue / 100 : numValue
  );
}

// Format boolean values
export function formatBoolean(
  value: any,
  options: {
    trueText?: string;
    falseText?: string;
    nullText?: string;
  } = {}
): string {
  const {
    trueText = 'Yes',
    falseText = 'No',
    nullText = '-'
  } = options;

  if (value === null || value === undefined) return nullText;
  if (typeof value === 'boolean') return value ? trueText : falseText;
  if (typeof value === 'string') {
    const lower = value.toLowerCase();
    if (lower === 'true' || lower === '1' || lower === 'yes') return trueText;
    if (lower === 'false' || lower === '0' || lower === 'no') return falseText;
  }
  if (typeof value === 'number') {
    return value ? trueText : falseText;
  }
  
  return nullText;
}

// Format file size
export function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 Bytes';
  
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

// Format array values
export function formatArray(
  value: any[],
  options: {
    separator?: string;
    maxItems?: number;
    moreText?: string;
  } = {}
): string {
  if (!Array.isArray(value)) return '';
  
  const {
    separator = ', ',
    maxItems = 3,
    moreText = 'more'
  } = options;

  if (value.length <= maxItems) {
    return value.join(separator);
  }

  const visible = value.slice(0, maxItems);
  const remaining = value.length - maxItems;
  
  return `${visible.join(separator)} +${remaining} ${moreText}`;
}

// Format status/badge values
export function formatStatus(
  value: any,
  statusMap: Record<string, { text: string; color?: string; icon?: string }> = {}
): { text: string; color?: string; icon?: string } {
  const key = value?.toString().toLowerCase();
  
  if (statusMap[key]) {
    return statusMap[key];
  }
  
  // Default status formatting
  const defaultStatuses: Record<string, { text: string; color: string }> = {
    'active': { text: 'Active', color: 'success' },
    'inactive': { text: 'Inactive', color: 'error' },
    'pending': { text: 'Pending', color: 'warning' },
    'completed': { text: 'Completed', color: 'success' },
    'cancelled': { text: 'Cancelled', color: 'error' },
    'draft': { text: 'Draft', color: 'info' },
    'published': { text: 'Published', color: 'success' },
  };
  
  return defaultStatuses[key] || { text: value?.toString() || '' };
}

// Format phone numbers
export function formatPhoneNumber(value: string): string {
  if (!value) return '';
  
  // Remove all non-numeric characters
  const cleaned = value.replace(/\D/g, '');
  
  // Format based on length
  if (cleaned.length === 10) {
    return `(${cleaned.slice(0, 3)}) ${cleaned.slice(3, 6)}-${cleaned.slice(6)}`;
  } else if (cleaned.length === 11 && cleaned[0] === '1') {
    return `+1 (${cleaned.slice(1, 4)}) ${cleaned.slice(4, 7)}-${cleaned.slice(7)}`;
  }
  
  return value; // Return original if can't format
}

// Format email addresses (add mailto link)
export function formatEmail(value: string): string {
  if (!value) return '';
  
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (emailRegex.test(value)) {
    return value; // Valid email, can be used with mailto:
  }
  
  return value;
}

// Format URLs
export function formatUrl(value: string): string {
  if (!value) return '';
  
  // Add protocol if missing
  if (!value.startsWith('http://') && !value.startsWith('https://')) {
    return `https://${value}`;
  }
  
  return value;
}

// Generic formatter that applies the appropriate formatting based on column type
export function formatCellValue(
  value: any,
  column: ColumnConfig,
  record?: any
): string {
  if (column.render) {
    // If custom render function exists, use it
    const rendered = column.render(value, record, 0);
    return typeof rendered === 'string' ? rendered : '';
  }

  switch (column.type) {
    case 'date':
      return formatDate(value, column.dateFormat);
    case 'number':
      return formatNumber(value);
    case 'boolean':
      return formatBoolean(value);
    default:
      return value?.toString() || '';
  }
}

// Truncate text with ellipsis
export function truncateText(text: string, maxLength: number = 50): string {
  if (!text || text.length <= maxLength) return text;
  return text.substring(0, maxLength - 3) + '...';
}

// Highlight search terms in text
export function highlightText(text: string, searchTerm: string): string {
  if (!text || !searchTerm) return text;
  
  const regex = new RegExp(`(${searchTerm.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'gi');
  return text.replace(regex, '<mark>$1</mark>');
}

// Format JSON objects for display
export function formatJson(value: any, pretty: boolean = false): string {
  if (value === null || value === undefined) return '';
  
  try {
    if (typeof value === 'object') {
      return JSON.stringify(value, null, pretty ? 2 : 0);
    }
    return value.toString();
  } catch {
    return value?.toString() || '';
  }
}
