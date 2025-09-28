// ========================================
// USE TABLE EXPORT HOOK
// ========================================

import { useState, useCallback } from 'react';
import type { ExportOptions, ColumnConfig, UseTableExportReturn } from '../types';

export const useTableExport = (): UseTableExportReturn => {
  const [isExporting, setIsExporting] = useState(false);
  const [exportError, setExportError] = useState<string | null>(null);

  // Convert data to CSV format
  const convertToCSV = useCallback((data: any[], columns: ColumnConfig[]): string => {
    if (data.length === 0) return '';

    // Create header row
    const headers = columns.map(col => `"${col.title}"`).join(',');
    
    // Create data rows
    const rows = data.map(record => {
      return columns.map(col => {
        let value = '';
        
        if (col.dataIndex) {
          if (Array.isArray(col.dataIndex)) {
            // Handle nested properties
            value = col.dataIndex.reduce((obj, key) => obj?.[key], record);
          } else {
            value = record[col.dataIndex];
          }
        } else {
          value = record[col.key];
        }

        // Handle different data types
        if (value === null || value === undefined) {
          return '""';
        }
        
        if (typeof value === 'boolean') {
          return value ? '"Yes"' : '"No"';
        }
        
        if (typeof value === 'object' && value !== null) {
          // Handle dates
          if (Object.prototype.toString.call(value) === '[object Date]' || (typeof (value as any)?.toISOString === 'function')) {
            return `"${(value as Date).toISOString()}"`;
          }
          // Handle other objects
          return `"${JSON.stringify(value)}"`;
        }
        
        // Escape quotes and wrap in quotes
        const stringValue = String(value).replace(/"/g, '""');
        return `"${stringValue}"`;
      }).join(',');
    });

    return [headers, ...rows].join('\n');
  }, []);

  // Convert data to JSON format
  const convertToJSON = useCallback((data: any[], columns: ColumnConfig[]): string => {
    const processedData = data.map(record => {
      const processedRecord: any = {};
      
      columns.forEach(col => {
        let value;
        
        if (col.dataIndex) {
          if (Array.isArray(col.dataIndex)) {
            // Handle nested properties
            value = col.dataIndex.reduce((obj, key) => obj?.[key], record);
          } else {
            value = record[col.dataIndex];
          }
        } else {
          value = record[col.key];
        }
        
        processedRecord[col.key] = value;
      });
      
      return processedRecord;
    });

    return JSON.stringify(processedData, null, 2);
  }, []);

  // Download file
  const downloadFile = useCallback((content: string, filename: string, mimeType: string) => {
    const blob = new Blob([content], { type: mimeType });
    const url = URL.createObjectURL(blob);
    
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    URL.revokeObjectURL(url);
  }, []);

  // Generate filename with timestamp
  const generateFilename = useCallback((baseFilename: string, format: string): string => {
    const timestamp = new Date().toISOString().slice(0, 19).replace(/:/g, '-');
    const cleanFilename = baseFilename.replace(/[^a-zA-Z0-9-_]/g, '-');
    return `${cleanFilename}-${timestamp}.${format}`;
  }, []);

  // Main export function
  const exportData = useCallback(async (
    options: ExportOptions,
    data: any[],
    columns: ColumnConfig[]
  ): Promise<void> => {
    try {
      setIsExporting(true);
      setExportError(null);

      if (data.length === 0) {
        throw new Error('No data to export');
      }

      const { format, filename = 'table-export' } = options;
      
      let content: string;
      let mimeType: string;
      let fileExtension: string;

      switch (format) {
        case 'csv':
          content = convertToCSV(data, columns);
          mimeType = 'text/csv;charset=utf-8;';
          fileExtension = 'csv';
          break;
          
        case 'json':
          content = convertToJSON(data, columns);
          mimeType = 'application/json;charset=utf-8;';
          fileExtension = 'json';
          break;
          
        case 'excel':
          // For Excel, we'll use CSV format with Excel-specific headers
          content = convertToCSV(data, columns);
          mimeType = 'application/vnd.ms-excel;charset=utf-8;';
          fileExtension = 'csv'; // Excel can open CSV files
          break;
          
        default:
          throw new Error(`Unsupported export format: ${format}`);
      }

      const finalFilename = generateFilename(filename, fileExtension);
      downloadFile(content, finalFilename, mimeType);

    } catch (error: any) {
      console.error('Export error:', error);
      setExportError(error.message || 'Failed to export data');
    } finally {
      setIsExporting(false);
    }
  }, [convertToCSV, convertToJSON, downloadFile, generateFilename]);

  return {
    exportData,
    isExporting,
    exportError
  };
};
