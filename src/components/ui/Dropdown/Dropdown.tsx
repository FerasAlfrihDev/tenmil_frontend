import React, { useState, useRef, useEffect, forwardRef } from 'react';
import './Dropdown.scss';

export interface DropdownOption {
  value: string | number;
  label: string;
  disabled?: boolean;
}

export interface DropdownProps {
  label?: string;
  error?: string;
  helperText?: string;
  options: DropdownOption[];
  value?: string | number;
  defaultValue?: string | number;
  onChange?: (value: string | number) => void;
  placeholder?: string;
  disabled?: boolean;
  required?: boolean;
  fullWidth?: boolean;
  searchable?: boolean;
  variant?: 'outlined' | 'filled';
  size?: 'small' | 'medium' | 'large';
  className?: string;
}

const Dropdown = forwardRef<HTMLDivElement, DropdownProps>(({
  label,
  error,
  helperText,
  options,
  value,
  defaultValue,
  onChange,
  placeholder = 'Select an option',
  disabled = false,
  required = false,
  fullWidth = false,
  searchable = false,
  variant = 'outlined',
  size = 'medium',
  className,
}, ref) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedValue, setSelectedValue] = useState(value || defaultValue || '');
  const dropdownRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);

  const dropdownId = `dropdown-${Math.random().toString(36).substr(2, 9)}`;

  useEffect(() => {
    if (value !== undefined) {
      setSelectedValue(value);
    }
  }, [value]);

  // Filter options based on search term
  const filteredOptions = searchable
    ? options.filter(option =>
        option.label.toLowerCase().includes(searchTerm.toLowerCase())
      )
    : options;

  // Get selected option label
  const selectedOption = options.find(option => option.value === selectedValue);
  const displayText = selectedOption ? selectedOption.label : placeholder;

  // Handle option selection
  const handleSelect = (optionValue: string | number) => {
    setSelectedValue(optionValue);
    setIsOpen(false);
    setSearchTerm('');
    onChange?.(optionValue);
  };

  // Handle click outside to close
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
        setSearchTerm('');
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Focus search input when opened
  useEffect(() => {
    if (isOpen && searchable && searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, [isOpen, searchable]);

  // Handle keyboard navigation
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (disabled) return;

    switch (e.key) {
      case 'Enter':
      case ' ':
        if (!isOpen) {
          setIsOpen(true);
        }
        break;
      case 'Escape':
        setIsOpen(false);
        setSearchTerm('');
        break;
      case 'ArrowDown':
        e.preventDefault();
        if (!isOpen) {
          setIsOpen(true);
        }
        break;
      case 'ArrowUp':
        e.preventDefault();
        if (isOpen) {
          setIsOpen(false);
        }
        break;
    }
  };

  return (
    <div className={`dropdown-wrapper ${fullWidth ? 'full-width' : ''} ${className || ''}`}>
      {label && (
        <label htmlFor={dropdownId} className="dropdown-label">
          {label}
          {required && <span className="dropdown-required">*</span>}
        </label>
      )}
      
      <div
        ref={ref}
        className={`dropdown-container ${size} ${variant} ${error ? 'error' : ''} ${disabled ? 'disabled' : ''} ${isOpen ? 'open' : ''}`}
      >
        <div
          ref={dropdownRef}
          className="dropdown-trigger"
          onClick={() => !disabled && setIsOpen(!isOpen)}
          onKeyDown={handleKeyDown}
          tabIndex={disabled ? -1 : 0}
          role="button"
          aria-haspopup="listbox"
          aria-expanded={isOpen}
          aria-labelledby={label ? `${dropdownId}-label` : undefined}
        >
          <span className={`dropdown-text ${!selectedOption ? 'placeholder' : ''}`}>
            {displayText}
          </span>
          <div className={`dropdown-arrow ${isOpen ? 'open' : ''}`}>
            ↓
          </div>
        </div>

        {isOpen && (
          <div className="dropdown-menu">
            {searchable && (
              <div className="dropdown-search">
                <input
                  ref={searchInputRef}
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Search..."
                  className="dropdown-search-input"
                />
              </div>
            )}
            
            <div className="dropdown-options">
              {filteredOptions.length === 0 ? (
                <div className="dropdown-option no-options">
                  No options found
                </div>
              ) : (
                filteredOptions.map((option) => (
                  <div
                    key={option.value}
                    className={`dropdown-option ${
                      option.value === selectedValue ? 'selected' : ''
                    } ${option.disabled ? 'disabled' : ''}`}
                    onClick={() => !option.disabled && handleSelect(option.value)}
                    role="option"
                    aria-selected={option.value === selectedValue}
                  >
                    {option.label}
                  </div>
                ))
              )}
            </div>
          </div>
        )}
      </div>
      
      {(error || helperText) && (
        <div className={`dropdown-helper ${error ? 'error' : ''}`}>
          {error || helperText}
        </div>
      )}
    </div>
  );
});

Dropdown.displayName = 'Dropdown';

export default Dropdown;
