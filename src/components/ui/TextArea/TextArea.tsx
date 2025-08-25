import { forwardRef, type TextareaHTMLAttributes } from 'react';
import './TextArea.scss';

export interface TextAreaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
  helperText?: string;
  variant?: 'outlined' | 'filled';
  fullWidth?: boolean;
  required?: boolean;
  resize?: 'none' | 'vertical' | 'horizontal' | 'both';
  minRows?: number;
  maxRows?: number;
}

const TextArea = forwardRef<HTMLTextAreaElement, TextAreaProps>(({
  label,
  error,
  helperText,
  variant = 'outlined',
  fullWidth = false,
  required = false,
  resize = 'vertical',
  minRows = 3,
  maxRows,
  className,
  disabled,
  ...props
}, ref) => {
  const textareaId = props.id || `textarea-${Math.random().toString(36).substr(2, 9)}`;

  const getRows = () => {
    if (props.rows) return props.rows;
    return minRows;
  };

  return (
    <div className={`textarea-wrapper ${fullWidth ? 'full-width' : ''} ${className || ''}`}>
      {label && (
        <label htmlFor={textareaId} className="textarea-label">
          {label}
          {required && <span className="textarea-required">*</span>}
        </label>
      )}
      
      <div className={`textarea-container ${variant} ${error ? 'error' : ''} ${disabled ? 'disabled' : ''}`}>
        <textarea
          {...props}
          ref={ref}
          id={textareaId}
          className="textarea-field"
          disabled={disabled}
          rows={getRows()}
          style={{
            resize,
            maxHeight: maxRows ? `${maxRows * 1.5}em` : undefined,
            ...props.style,
          }}
        />
      </div>
      
      {(error || helperText) && (
        <div className={`textarea-helper ${error ? 'error' : ''}`}>
          {error || helperText}
        </div>
      )}
    </div>
  );
});

TextArea.displayName = 'TextArea';

export default TextArea;
