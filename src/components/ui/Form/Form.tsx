import React, { type FormEvent } from 'react';
import './Form.scss';

export interface FormProps {
  title?: string;
  description?: string;
  onSubmit?: (e: FormEvent<HTMLFormElement>) => void;
  onUpdate?: (e: FormEvent<HTMLFormElement>) => void;
  onCancel?: () => void;
  children: React.ReactNode;
  className?: string;
  submitText?: string;
  updateText?: string;
  cancelText?: string;
  showSubmit?: boolean;
  showUpdate?: boolean;
  showCancel?: boolean;
  loading?: boolean;
  disabled?: boolean;
}

const Form: React.FC<FormProps> = ({
  title,
  description,
  onSubmit,
  onUpdate,
  onCancel,
  children,
  className,
  submitText = 'Submit',
  updateText = 'Update',
  cancelText = 'Cancel',
  showSubmit = true,
  showUpdate = false,
  showCancel = false,
  loading = false,
  disabled = false,
}) => {
  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (loading || disabled) return;
    
    if (showUpdate && onUpdate) {
      onUpdate(e);
    } else if (showSubmit && onSubmit) {
      onSubmit(e);
    }
  };

  const hasActions = showSubmit || showUpdate || showCancel;

  return (
    <div className={`form-container ${className || ''}`}>
      {(title || description) && (
        <div className="form-header">
          {title && <h2 className="form-title">{title}</h2>}
          {description && <p className="form-description">{description}</p>}
        </div>
      )}
      
      <form onSubmit={handleSubmit} className="form">
        <div className="form-fields">
          {children}
        </div>
        
        {hasActions && (
          <div className="form-actions">
            {showCancel && onCancel && (
              <button
                type="button"
                onClick={onCancel}
                className="form-btn form-btn-cancel"
                disabled={loading}
              >
                {cancelText}
              </button>
            )}
            
            {showSubmit && !showUpdate && (
              <button
                type="submit"
                className="form-btn form-btn-primary"
                disabled={loading || disabled}
              >
                {loading ? 'Loading...' : submitText}
              </button>
            )}
            
            {showUpdate && (
              <button
                type="submit"
                className="form-btn form-btn-secondary"
                disabled={loading || disabled}
              >
                {loading ? 'Loading...' : updateText}
              </button>
            )}
          </div>
        )}
      </form>
    </div>
  );
};

export default Form;
