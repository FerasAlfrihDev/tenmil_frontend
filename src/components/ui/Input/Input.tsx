import React, { forwardRef, type InputHTMLAttributes } from 'react';
import './Input.scss';

export interface InputProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'size'> {
  label?: string;
  error?: string;
  helperText?: string;
  size?: 'small' | 'medium' | 'large';
  variant?: 'outlined' | 'filled';
  fullWidth?: boolean;
  required?: boolean;
  startIcon?: React.ReactNode;
  endIcon?: React.ReactNode;
}

const Input = forwardRef<HTMLInputElement, InputProps>(({
  label,
  error,
  helperText,
  size = 'medium',
  variant = 'outlined',
  fullWidth = false,
  required = false,
  startIcon,
  endIcon,
  className,
  disabled,
  ...props
}, ref) => {
  const inputId = props.id || `input-${Math.random().toString(36).substr(2, 9)}`;

  return (
    <div className={`input-wrapper ${fullWidth ? 'full-width' : ''} ${className || ''}`}>
      {label && (
        <label htmlFor={inputId} className="input-label">
          {label}
          {required && <span className="input-required">*</span>}
        </label>
      )}
      
      <div className={`input-container ${size} ${variant} ${error ? 'error' : ''} ${disabled ? 'disabled' : ''}`}>
        {startIcon && <div className="input-icon start-icon">{startIcon}</div>}
        
        <input
          {...props}
          ref={ref}
          id={inputId}
          className="input-field"
          disabled={disabled}
        />
        
        {endIcon && <div className="input-icon end-icon">{endIcon}</div>}
      </div>
      
      {(error || helperText) && (
        <div className={`input-helper ${error ? 'error' : ''}`}>
          {error || helperText}
        </div>
      )}
    </div>
  );
});

Input.displayName = 'Input';

export default Input;
