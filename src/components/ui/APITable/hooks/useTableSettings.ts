// ========================================
// USE TABLE SETTINGS HOOK
// ========================================

import { useState, useCallback, useEffect } from 'react';
import type { TableSettings, ColumnConfig, UseTableSettingsReturn } from '../types';

const STORAGE_KEY_PREFIX = 'api-table-settings';

export const useTableSettings = (
  tableId: string,
  columns: ColumnConfig[],
  defaultSettings: Partial<TableSettings> = {}
): UseTableSettingsReturn => {
  
  // Generate default settings based on columns
  const generateDefaultSettings = useCallback((): TableSettings => {
    const defaultColumnSettings: TableSettings['columns'] = {};
    
    columns.forEach((col, index) => {
      defaultColumnSettings[col.key] = {
        visible: true,
        width: col.width,
        order: index
      };
    });

    return {
      density: 'middle',
      columns: defaultColumnSettings,
      ...defaultSettings
    };
  }, [columns, defaultSettings]);

  // Load settings from localStorage
  const loadSettings = useCallback((): TableSettings => {
    try {
      const storageKey = `${STORAGE_KEY_PREFIX}-${tableId}`;
      const savedSettings = localStorage.getItem(storageKey);
      
      if (savedSettings) {
        const parsed = JSON.parse(savedSettings) as TableSettings;
        
        // Merge with default settings to handle new columns
        const defaultSettings = generateDefaultSettings();
        
        // Ensure all current columns are present in settings
        const mergedColumns = { ...defaultSettings.columns };
        
        // Update with saved settings
        Object.keys(parsed.columns || {}).forEach(key => {
          if (mergedColumns[key]) {
            mergedColumns[key] = { ...mergedColumns[key], ...parsed.columns[key] };
          }
        });
        
        return {
          ...defaultSettings,
          ...parsed,
          columns: mergedColumns
        };
      }
    } catch (error) {
      console.warn('Failed to load table settings:', error);
    }
    
    return generateDefaultSettings();
  }, [tableId, generateDefaultSettings]);

  // State
  const [settings, setSettings] = useState<TableSettings>(loadSettings);

  // Save settings to localStorage
  const saveSettings = useCallback((newSettings: TableSettings) => {
    try {
      const storageKey = `${STORAGE_KEY_PREFIX}-${tableId}`;
      localStorage.setItem(storageKey, JSON.stringify(newSettings));
    } catch (error) {
      console.warn('Failed to save table settings:', error);
    }
  }, [tableId]);

  // Update column settings
  const updateColumnSettings = useCallback((
    columnKey: string,
    columnSettings: Partial<TableSettings['columns'][string]>
  ) => {
    setSettings(prev => {
      const newSettings = {
        ...prev,
        columns: {
          ...prev.columns,
          [columnKey]: {
            ...prev.columns[columnKey],
            ...columnSettings
          }
        }
      };
      
      saveSettings(newSettings);
      return newSettings;
    });
  }, [saveSettings]);

  // Update table settings
  const updateTableSettings = useCallback((
    newSettings: Partial<TableSettings>
  ) => {
    setSettings(prev => {
      const updatedSettings = {
        ...prev,
        ...newSettings
      };
      
      saveSettings(updatedSettings);
      return updatedSettings;
    });
  }, [saveSettings]);

  // Update settings when columns change
  useEffect(() => {
    const currentColumnKeys = new Set(columns.map(col => col.key));
    const settingsColumnKeys = new Set(Object.keys(settings.columns));
    
    // Check if columns have changed
    const hasNewColumns = columns.some(col => !settingsColumnKeys.has(col.key));
    const hasRemovedColumns = Object.keys(settings.columns).some(key => !currentColumnKeys.has(key));
    
    if (hasNewColumns || hasRemovedColumns) {
      const newSettings = generateDefaultSettings();
      
      // Preserve existing settings for columns that still exist
      Object.keys(settings.columns).forEach(key => {
        if (currentColumnKeys.has(key)) {
          newSettings.columns[key] = { ...newSettings.columns[key], ...settings.columns[key] };
        }
      });
      
      setSettings(newSettings);
      saveSettings(newSettings);
    }
  }, [columns, settings.columns, generateDefaultSettings, saveSettings]);

  return {
    settings,
    updateColumnSettings,
    updateTableSettings
  };
};
