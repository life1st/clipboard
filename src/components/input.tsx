import React, { forwardRef } from 'react';
import classNames from 'classnames';
import Button from './button';

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
  clear?: boolean;
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
  clear = false,
  ...props
}, ref) => {
  const inputClasses = classNames(
    'input',
    `input--${size}`,
    {
      'input--full-width': fullWidth,
      'input--disabled': disabled,
      'input--readonly': readOnly
    },
    className
  );

  const containerClasses = classNames(
    'input-container',
    {
      'input-container--with-clear': clear
    }
  );

  const handleClear = () => {
    if (onChange) {
      const event = {
        target: { value: '' }
      } as React.ChangeEvent<HTMLInputElement>;
      onChange(event);
    }
  };

  const hasValue = value && String(value).trim() !== '';

  return (
    <div className={containerClasses}>
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
      {clear && (
        <Button
          variant="ghost"
          size="sm"
          onClick={handleClear}
          disabled={disabled || !hasValue}
          className="input-clear"
        >
          清空
        </Button>
      )}
    </div>
  );
});

Input.displayName = 'Input';

export default Input; 