import { forwardRef, type InputHTMLAttributes } from 'react';
import './DatePicker.scss';

export interface DatePickerProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'type' | 'size'> {
  label?: string;
  error?: string;
  helperText?: string;
  size?: 'small' | 'medium' | 'large';
  variant?: 'outlined' | 'filled';
  fullWidth?: boolean;
  required?: boolean;
  showTime?: boolean;
}

const DatePicker = forwardRef<HTMLInputElement, DatePickerProps>(({
  label,
  error,
  helperText,
  size = 'medium',
  variant = 'outlined',
  fullWidth = false,
  required = false,
  showTime = false,
  className,
  disabled,
  ...props
}, ref) => {
  const inputId = props.id || `date-picker-${Math.random().toString(36).substr(2, 9)}`;
  const inputType = showTime ? 'datetime-local' : 'date';

  // Format the placeholder based on the type
  const getPlaceholder = () => {
    if (props.placeholder) return props.placeholder;
    return showTime ? 'Select date and time' : 'Select date';
  };

  return (
    <div className={`date-picker-wrapper ${fullWidth ? 'full-width' : ''} ${className || ''}`}>
      {label && (
        <label htmlFor={inputId} className="date-picker-label">
          {label}
          {required && <span className="date-picker-required">*</span>}
        </label>
      )}
      
      <div className={`date-picker-container ${size} ${variant} ${error ? 'error' : ''} ${disabled ? 'disabled' : ''}`}>
        <input
          {...props}
          ref={ref}
          id={inputId}
          type={inputType}
          className="date-picker-field"
          disabled={disabled}
          placeholder={getPlaceholder()}
        />
        
        <div className="date-picker-icon">
          📅
        </div>
      </div>
      
      {(error || helperText) && (
        <div className={`date-picker-helper ${error ? 'error' : ''}`}>
          {error || helperText}
        </div>
      )}
    </div>
  );
});

DatePicker.displayName = 'DatePicker';

export default DatePicker;
