// ========================================
// TABLE ACTIONS COMPONENT
// ========================================

import React from 'react';
import type { ActionButton } from '../types';

interface TableActionsProps {
  primaryAction?: ActionButton;
  secondaryActions?: ActionButton[];
  className?: string;
}

const TableActions: React.FC<TableActionsProps> = ({
  primaryAction,
  secondaryActions = [],
  className = ''
}) => {
  // Don't render if no actions
  if (!primaryAction && secondaryActions.length === 0) {
    return null;
  }

  return (
    <div className={`table-actions ${className}`}>
      {/* Primary Action - Left Side */}
      {primaryAction && (
        <div className="table-actions__primary">
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
        </div>
      )}

      {/* Secondary Actions - Right Side */}
      {secondaryActions.length > 0 && (
        <div className="table-actions__secondary">
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
        </div>
      )}
    </div>
  );
};

export default TableActions;
