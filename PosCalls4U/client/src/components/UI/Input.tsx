import React, { useState, forwardRef } from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  variant?: 'default' | 'filled' | 'outlined';
  fullWidth?: boolean;
  loading?: boolean;
}

const variantClasses = {
  default: 'input border-neutral-300 focus:border-primary-500 focus:ring-primary-500',
  filled: 'input bg-neutral-100 border-transparent focus:bg-white focus:border-primary-500 focus:ring-primary-500',
  outlined: 'input border-2 border-neutral-300 focus:border-primary-500 focus:ring-primary-500',
};

export const Input = forwardRef<HTMLInputElement, InputProps>(({ 
  label,
  error,
  helperText,
  leftIcon,
  rightIcon,
  variant = 'default',
  fullWidth = false,
  loading = false,
  className = '',
  id,
  ...props
}, ref) => {
  const [isFocused, setIsFocused] = useState(false);
  const hasError = !!error;
  const inputId = id || `input-${Math.random().toString(36).substr(2, 9)}`;

  const inputClasses = `
    ${variantClasses[variant]}
    ${hasError ? 'input-error border-error-300 focus:border-error-500 focus:ring-error-500' : ''}
    ${leftIcon ? 'pl-10' : ''}
    ${rightIcon ? 'pr-10' : ''}
    ${fullWidth ? 'w-full' : ''}
    ${loading ? 'cursor-wait' : ''}
    ${className}
    transition-all duration-200 ease-in-out
    transform 
    focus:scale-[1.02]
  `.trim().replace(/\s+/g, ' ');

  return (
    <div className={`form-group ${fullWidth ? 'w-full' : ''}`}>
      {label && (
        <label
          htmlFor={inputId}
          className={`
            form-label
            transition-colors duration-200
            ${hasError ? 'text-error-700' : isFocused ? 'text-primary-700' : 'text-neutral-700'}
          `.trim().replace(/\s+/g, ' ')}
        >
          {label}
          {props.required && (
            <span className="text-error-500 ml-1" aria-label="required">*</span>
          )}
        </label>
      )}
      
      <div className="relative">
        {leftIcon && (
          <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
            <span className={`
              transition-colors duration-200
              ${hasError ? 'text-error-400' : isFocused ? 'text-primary-500' : 'text-neutral-400'}
            `.trim().replace(/\s+/g, ' ')}>
              {leftIcon}
            </span>
          </div>
        )}
        
        <input
          ref={ref}
          id={inputId}
          className={inputClasses}
          onFocus={(e) => {
            setIsFocused(true);
            props.onFocus?.(e);
          }}
          onBlur={(e) => {
            setIsFocused(false);
            props.onBlur?.(e);
          }}
          aria-invalid={hasError}
          aria-describedby={
            error ? `${inputId}-error` : 
            helperText ? `${inputId}-help` : undefined
          }
          disabled={loading || props.disabled}
          {...props}
        />
        
        {rightIcon && (
          <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
            <span className={`
              transition-colors duration-200
              ${hasError ? 'text-error-400' : isFocused ? 'text-primary-500' : 'text-neutral-400'}
            `.trim().replace(/\s+/g, ' ')}>
              {rightIcon}
            </span>
          </div>
        )}
        
        {loading && (
          <div className="absolute inset-y-0 right-0 flex items-center pr-3">
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary-600"></div>
          </div>
        )}
      </div>
      
      {error && (
        <p
          id={`${inputId}-error`}
          className="form-error animate-fade-in-up"
          role="alert"
          aria-live="polite"
        >
          {error}
        </p>
      )}
      
      {!error && helperText && (
        <p
          id={`${inputId}-help`}
          className="form-help"
        >
          {helperText}
        </p>
      )}
    </div>
  );
});

Input.displayName = 'Input';

export default Input;
