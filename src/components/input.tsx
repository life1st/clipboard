import React, { forwardRef } from 'react';

export interface InputProps {
  type?: 'text' | 'password' | 'email' | 'number' | 'url' | 'tel';
  value?: string | number;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
  disabled?: boolean;
  readOnly?: boolean;
  required?: boolean;
  name?: string;
  id?: string;
  className?: string;
  size?: 'sm' | 'md' | 'lg';
  fullWidth?: boolean;
  autoFocus?: boolean;
  maxLength?: number;
  min?: number;
  max?: number;
  step?: number;
  pattern?: string;
}

const Input = forwardRef<HTMLInputElement, InputProps>(({
  type = 'text',
  value,
  onChange,
  placeholder,
  disabled = false,
  readOnly = false,
  required = false,
  name,
  id,
  className = '',
  size = 'md',
  fullWidth = true,
  autoFocus = false,
  maxLength,
  min,
  max,
  step,
  pattern,
  ...props
}, ref) => {
  const inputClasses = [
    'input',
    `input--${size}`,
    fullWidth ? 'input--full-width' : '',
    disabled ? 'input--disabled' : '',
    readOnly ? 'input--readonly' : '',
    className
  ].filter(Boolean).join(' ');

  return (
    <input
      ref={ref}
      type={type}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      disabled={disabled}
      readOnly={readOnly}
      required={required}
      name={name}
      id={id}
      className={inputClasses}
      autoFocus={autoFocus}
      maxLength={maxLength}
      min={min}
      max={max}
      step={step}
      pattern={pattern}
      {...props}
    />
  );
});

Input.displayName = 'Input';

export default Input; 