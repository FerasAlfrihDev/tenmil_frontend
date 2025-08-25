import { forwardRef, type InputHTMLAttributes } from 'react';
import './Radio.scss';

export interface RadioOption {
  value: string;
  label: string;
  disabled?: boolean;
}

export interface RadioProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'type' | 'size'> {
  label?: string;
  error?: string;
  helperText?: string;
  options: RadioOption[];
  size?: 'small' | 'medium' | 'large';
  color?: 'primary' | 'secondary';
  orientation?: 'horizontal' | 'vertical';
  required?: boolean;
}

const Radio = forwardRef<HTMLInputElement, RadioProps>(({
  label,
  error,
  helperText,
  options,
  size = 'medium',
  color = 'primary',
  orientation = 'vertical',
  required = false,
  className,
  disabled,
  name,
  value,
  onChange,
  ...props
}, ref) => {
  const radioGroupId = `radio-group-${Math.random().toString(36).substr(2, 9)}`;
  const radioName = name || radioGroupId;

  return (
    <div className={`radio-wrapper ${className || ''}`}>
      {label && (
        <div className="radio-group-label">
          {label}
          {required && <span className="radio-required">*</span>}
        </div>
      )}
      
      <div 
        className={`radio-group ${orientation} ${size} ${color} ${disabled ? 'disabled' : ''}`}
        role="radiogroup"
        aria-labelledby={label ? `${radioGroupId}-label` : undefined}
      >
        {options.map((option, index) => {
          const optionId = `${radioGroupId}-option-${index}`;
          const isChecked = value === option.value;
          const isDisabled = disabled || option.disabled;

          return (
            <label key={option.value} htmlFor={optionId} className="radio-item">
              <input
                {...props}
                ref={index === 0 ? ref : undefined}
                id={optionId}
                type="radio"
                name={radioName}
                value={option.value}
                checked={isChecked}
                disabled={isDisabled}
                onChange={onChange}
                className="radio-input"
              />
              
              <div className="radio-indicator">
                <div className="radio-dot" />
              </div>
              
              <span className="radio-label">{option.label}</span>
            </label>
          );
        })}
      </div>
      
      {(error || helperText) && (
        <div className={`radio-helper ${error ? 'error' : ''}`}>
          {error || helperText}
        </div>
      )}
    </div>
  );
});

Radio.displayName = 'Radio';

export default Radio;
