import { forwardRef, type InputHTMLAttributes } from 'react';
import './Checkbox.scss';

export interface CheckboxOption {
  value: string;
  label: string;
  disabled?: boolean;
}

export interface CheckboxProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'type' | 'size'> {
  label?: string;
  error?: string;
  helperText?: string;
  options?: CheckboxOption[];
  size?: 'small' | 'medium' | 'large';
  color?: 'primary' | 'secondary' | 'success';
  orientation?: 'horizontal' | 'vertical';
  required?: boolean;
  indeterminate?: boolean;
}

const Checkbox = forwardRef<HTMLInputElement, CheckboxProps>(({
  label,
  error,
  helperText,
  options,
  size = 'medium',
  color = 'primary',
  orientation = 'vertical',
  required = false,
  indeterminate = false,
  className,
  disabled,
  ...props
}, ref) => {
  const checkboxId = props.id || `checkbox-${Math.random().toString(36).substr(2, 9)}`;

  // Single checkbox mode
  if (!options) {
    return (
      <div className={`checkbox-wrapper single ${className || ''}`}>
        <label htmlFor={checkboxId} className={`checkbox-item ${size} ${color} ${disabled ? 'disabled' : ''}`}>
          <input
            {...props}
            ref={ref}
            id={checkboxId}
            type="checkbox"
            disabled={disabled}
            className="checkbox-input"
          />
          
          <div className={`checkbox-indicator ${indeterminate ? 'indeterminate' : ''}`}>
            <div className="checkbox-check">
              {indeterminate ? '—' : '✓'}
            </div>
          </div>
          
          {label && (
            <span className="checkbox-label">
              {label}
              {required && <span className="checkbox-required">*</span>}
            </span>
          )}
        </label>
        
        {(error || helperText) && (
          <div className={`checkbox-helper ${error ? 'error' : ''}`}>
            {error || helperText}
          </div>
        )}
      </div>
    );
  }

  // Multiple checkboxes mode
  const checkboxGroupId = `checkbox-group-${Math.random().toString(36).substr(2, 9)}`;

  return (
    <div className={`checkbox-wrapper group ${className || ''}`}>
      {label && (
        <div className="checkbox-group-label">
          {label}
          {required && <span className="checkbox-required">*</span>}
        </div>
      )}
      
      <div 
        className={`checkbox-group ${orientation} ${size} ${color} ${disabled ? 'disabled' : ''}`}
        role="group"
        aria-labelledby={label ? `${checkboxGroupId}-label` : undefined}
      >
        {options.map((option, index) => {
          const optionId = `${checkboxGroupId}-option-${index}`;
          const isDisabled = disabled || option.disabled;

          return (
            <label key={option.value} htmlFor={optionId} className="checkbox-item">
              <input
                {...props}
                ref={index === 0 ? ref : undefined}
                id={optionId}
                type="checkbox"
                value={option.value}
                disabled={isDisabled}
                className="checkbox-input"
              />
              
              <div className="checkbox-indicator">
                <div className="checkbox-check">✓</div>
              </div>
              
              <span className="checkbox-label">{option.label}</span>
            </label>
          );
        })}
      </div>
      
      {(error || helperText) && (
        <div className={`checkbox-helper ${error ? 'error' : ''}`}>
          {error || helperText}
        </div>
      )}
    </div>
  );
});

Checkbox.displayName = 'Checkbox';

export default Checkbox;
