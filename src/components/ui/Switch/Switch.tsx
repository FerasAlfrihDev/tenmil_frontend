import { forwardRef, type InputHTMLAttributes } from 'react';
import './Switch.scss';

export interface SwitchProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'type' | 'size'> {
  label?: string;
  error?: string;
  helperText?: string;
  size?: 'small' | 'medium' | 'large';
  color?: 'primary' | 'secondary' | 'success';
  labelPosition?: 'left' | 'right';
}

const Switch = forwardRef<HTMLInputElement, SwitchProps>(({
  label,
  error,
  helperText,
  size = 'medium',
  color = 'primary',
  labelPosition = 'right',
  className,
  disabled,
  ...props
}, ref) => {
  const switchId = props.id || `switch-${Math.random().toString(36).substr(2, 9)}`;

  const switchElement = (
    <div className={`switch-container ${size} ${color} ${disabled ? 'disabled' : ''}`}>
      <input
        {...props}
        ref={ref}
        id={switchId}
        type="checkbox"
        className="switch-input"
        disabled={disabled}
      />
      <label htmlFor={switchId} className="switch-toggle" />
    </div>
  );

  const labelElement = label && (
    <label htmlFor={switchId} className="switch-label">
      {label}
    </label>
  );

  return (
    <div className={`switch-wrapper ${className || ''}`}>
      <div className="switch-control">
        {labelPosition === 'left' && labelElement}
        {switchElement}
        {labelPosition === 'right' && labelElement}
      </div>
      
      {(error || helperText) && (
        <div className={`switch-helper ${error ? 'error' : ''}`}>
          {error || helperText}
        </div>
      )}
    </div>
  );
});

Switch.displayName = 'Switch';

export default Switch;
