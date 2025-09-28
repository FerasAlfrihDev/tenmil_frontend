// ========================================
// TABLE TOOLBAR COMPONENT
// ========================================

import { useCallback, useState } from 'react';
import { 
  RefreshCw, 
  Download, 
  Columns, 
  MoreVertical,
  Eye,
  EyeOff
} from 'lucide-react';
import Dropdown from '../../Dropdown/Dropdown';
import type { BulkAction, ExportOptions, TableSettings, ColumnConfig, ActionButton } from '../types';

interface TableToolbarProps<T = any> {
  selectedCount: number;
  totalCount: number;
  bulkActions: BulkAction<T>[];
  exportable?: boolean;
  onExport: (options: ExportOptions) => void;
  onRefresh: () => void;
  showRefreshButton?: boolean;
  showColumnSettings?: boolean;
  showDensitySettings?: boolean;
  settings: TableSettings;
  onSettingsChange: (settings: Partial<TableSettings>) => void;
  columns: ColumnConfig<T>[];
  loading?: boolean;
  className?: string;
  // Action Buttons
  primaryAction?: ActionButton;
  secondaryActions?: ActionButton[];
}

const TableToolbar = <T extends Record<string, any>>({
  selectedCount,
  totalCount,
  bulkActions,
  exportable = false,
  onExport,
  onRefresh,
  showRefreshButton = true,
  showColumnSettings = false,
  showDensitySettings = false,
  settings,
  onSettingsChange,
  columns,
  loading = false,
  className = '',
  primaryAction,
  secondaryActions = []
}: TableToolbarProps<T>) => {
  const [showColumnPanel, setShowColumnPanel] = useState(false);
  const [showMoreMenu, setShowMoreMenu] = useState(false);

  // Handle export
  const handleExport = useCallback((format: 'csv' | 'excel' | 'json') => {
    onExport({
      format,
      selectedOnly: selectedCount > 0,
      visibleColumnsOnly: true,
      includeHeaders: true
    });
    setShowMoreMenu(false);
  }, [onExport, selectedCount]);

  // Handle density change
  const handleDensityChange = useCallback((density: string | number) => {
    onSettingsChange({ density: density as TableSettings['density'] });
  }, [onSettingsChange]);

  // Handle column visibility toggle
  const handleColumnVisibilityToggle = useCallback((columnKey: string) => {
    const currentVisibility = settings.columns[columnKey]?.visible !== false;
    onSettingsChange({
      columns: {
        ...settings.columns,
        [columnKey]: {
          ...settings.columns[columnKey],
          visible: !currentVisibility
        }
      }
    });
  }, [settings.columns, onSettingsChange]);

  // Handle column reorder
  const handleColumnReorder = useCallback((fromIndex: number, toIndex: number) => {
    const newColumns = { ...settings.columns };
    const columnKeys = Object.keys(newColumns).sort((a, b) => 
      (newColumns[a].order || 0) - (newColumns[b].order || 0)
    );
    
    const [movedKey] = columnKeys.splice(fromIndex, 1);
    columnKeys.splice(toIndex, 0, movedKey);
    
    columnKeys.forEach((key, index) => {
      newColumns[key] = { ...newColumns[key], order: index };
    });
    
    onSettingsChange({ columns: newColumns });
  }, [settings.columns, onSettingsChange]);

  // Density options
  const densityOptions = [
    { value: 'compact', label: 'Compact' },
    { value: 'middle', label: 'Middle' },
    { value: 'comfortable', label: 'Comfortable' }
  ];

  // Export options
  const exportOptions = [
    { value: 'csv', label: 'Export as CSV' },
    { value: 'excel', label: 'Export as Excel' },
    { value: 'json', label: 'Export as JSON' }
  ];

  return (
    <div className={`table-toolbar ${className}`}>
      {/* Left section - Primary action, selection info and bulk actions */}
      <div className="table-toolbar__left">
        {/* Primary Action Button */}
        {primaryAction && (
          <button
            className={`
              btn--${primaryAction.type || 'primary'}
              ${primaryAction.loading ? 'btn--loading' : ''}
            `.trim()}
            onClick={primaryAction.onClick}
            disabled={primaryAction.disabled || primaryAction.loading}
            title={primaryAction.tooltip || primaryAction.label}
          >
            {primaryAction.loading ? (
              <div className="btn__spinner" />
            ) : (
              primaryAction.icon && (
                <span className="btn__icon btn__icon--left">{primaryAction.icon}</span>
              )
            )}
            <span className="btn__text">{primaryAction.label}</span>
          </button>
        )}

        {selectedCount > 0 && (
          <div className="table-toolbar__selection">
            <span className="table-toolbar__selection-count">
              {selectedCount} of {totalCount} selected
            </span>
            
            {bulkActions.length > 0 && (
              <div className="table-toolbar__bulk-actions">
                {bulkActions.map((action) => (
                  <button
                    key={action.key}
                    className={`
                      table-toolbar__bulk-action 
                      ${action.danger ? 'table-toolbar__bulk-action--danger' : ''}
                    `}
                    onClick={() => action.onClick([], [])} // Note: selectedRows and keys should be passed from parent
                    disabled={action.disabled}
                    title={action.label}
                  >
                    {action.icon && <span className="table-toolbar__action-icon">{action.icon}</span>}
                    <span>{action.label}</span>
                  </button>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Right section - Secondary actions and settings */}
      <div className="table-toolbar__right">
        {/* Secondary Action Buttons */}
        {secondaryActions.map((action) => (
          <button
            key={action.key}
            className={`
              btn--${action.type || 'secondary'}
              ${action.loading ? 'btn--loading' : ''}
            `.trim()}
            onClick={action.onClick}
            disabled={action.disabled || action.loading}
            title={action.tooltip || action.label}
          >
            {action.loading ? (
              <div className="btn__spinner" />
            ) : (
              action.icon && (
                <span className="btn__icon btn__icon--left">{action.icon}</span>
              )
            )}
            <span className="btn__text">{action.label}</span>
          </button>
        ))}

        {/* Density settings */}
        {showDensitySettings && (
          <div className="table-toolbar__density">
            <Dropdown
              options={densityOptions}
              value={settings.density}
              onChange={handleDensityChange}
              placeholder="Density"
              size="small"
              className="table-toolbar__density-dropdown"
            />
          </div>
        )}

        {/* Column settings */}
        {showColumnSettings && (
          <div className="table-toolbar__columns">
            <button
              className="table-toolbar__btn"
              onClick={() => setShowColumnPanel(!showColumnPanel)}
              title="Column settings"
            >
              <Columns size={16} />
              <span>Columns</span>
            </button>
            
            {showColumnPanel && (
              <div className="table-toolbar__column-panel">
                <div className="table-toolbar__column-panel-header">
                  <h4>Column Settings</h4>
                  <button
                    className="table-toolbar__panel-close"
                    onClick={() => setShowColumnPanel(false)}
                  >
                    ×
                  </button>
                </div>
                
                <div className="table-toolbar__column-list">
                  {columns.map((column, index) => {
                    const isVisible = settings.columns[column.key]?.visible !== false;
                    
                    return (
                      <div key={column.key} className="table-toolbar__column-item">
                        <div className="table-toolbar__column-info">
                          <button
                            className="table-toolbar__column-visibility"
                            onClick={() => handleColumnVisibilityToggle(column.key)}
                          >
                            {isVisible ? <Eye size={14} /> : <EyeOff size={14} />}
                          </button>
                          
                          <span className={`table-toolbar__column-title ${!isVisible ? 'table-toolbar__column-title--hidden' : ''}`}>
                            {column.title}
                          </span>
                        </div>
                        
                        <div className="table-toolbar__column-actions">
                          <button
                            className="table-toolbar__column-move"
                            onClick={() => handleColumnReorder(index, Math.max(0, index - 1))}
                            disabled={index === 0}
                            title="Move up"
                          >
                            ↑
                          </button>
                          <button
                            className="table-toolbar__column-move"
                            onClick={() => handleColumnReorder(index, Math.min(columns.length - 1, index + 1))}
                            disabled={index === columns.length - 1}
                            title="Move down"
                          >
                            ↓
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        )}

        {/* More options */}
        <div className="table-toolbar__more">
          <button
            className="table-toolbar__btn table-toolbar__btn--icon-only"
            onClick={() => setShowMoreMenu(!showMoreMenu)}
            title="More options"
          >
            <MoreVertical size={16} />
          </button>
          
          {showMoreMenu && (
            <div className="table-toolbar__more-menu">
              {/* Refresh option */}
              {showRefreshButton && (
                <button
                  className={`table-toolbar__menu-item ${loading ? 'table-toolbar__menu-item--loading' : ''}`}
                  onClick={() => {
                    onRefresh();
                    setShowMoreMenu(false);
                  }}
                  disabled={loading}
                >
                  <RefreshCw size={16} className={loading ? 'table-toolbar__loading-icon' : ''} />
                  <span>Refresh</span>
                </button>
              )}
              
              {/* Export options */}
              {exportable && (
                <>
                  {showRefreshButton && <div className="table-toolbar__menu-divider" />}
                  {exportOptions.map((option) => (
                    <button
                      key={option.value}
                      className="table-toolbar__menu-item"
                      onClick={() => {
                        handleExport(option.value as any);
                        setShowMoreMenu(false);
                      }}
                    >
                      <Download size={16} />
                      <span>{option.label}</span>
                    </button>
                  ))}
                </>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TableToolbar;