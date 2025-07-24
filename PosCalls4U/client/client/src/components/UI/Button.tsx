import React from 'react';
import LoadingSpinner from './LoadingSpinner';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'success' | 'danger' | 'outline';
  size?: 'sm' | 'md' | 'lg';
  loading?: boolean;
  loadingText?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  fullWidth?: boolean;
  rounded?: boolean;
  children: React.ReactNode;
}

const variantClasses = {
  primary: 'btn-primary hover:scale-105 hover:shadow-glow active:scale-95',
  secondary: 'btn-secondary hover:scale-105 active:scale-95',
  success: 'btn-success hover:scale-105 active:scale-95',
  danger: 'btn-danger hover:scale-105 active:scale-95',
  outline: 'btn-outline hover:scale-105 active:scale-95',
};

const sizeClasses = {
  sm: 'btn-sm',
  md: '',
  lg: 'btn-lg',
};

export const Button: React.FC<ButtonProps> = ({
  variant = 'primary',
  size = 'md',
  loading = false,
  loadingText = 'Loading...',
  leftIcon,
  rightIcon,
  fullWidth = false,
  rounded = false,
  children,
  className = '',
  disabled,
  ...props
}) => {
  const isDisabled = disabled || loading;

  return (
    <button
      className={`
        btn
        ${variantClasses[variant]}
        ${sizeClasses[size]}
        ${fullWidth ? 'w-full' : ''}
        ${rounded ? 'rounded-full' : ''}
        ${loading ? 'cursor-wait' : ''}
        ${className}
        transition-all duration-200 ease-in-out
        transform
        focus:ring-2 focus:ring-offset-2
        disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none
      `.trim().replace(/\s+/g, ' ')}
      disabled={isDisabled}
      aria-disabled={isDisabled}
      {...props}
    >
      {loading && (
        <LoadingSpinner
          size="sm"
          color={variant === 'outline' ? 'primary' : 'white'}
          className="mr-2"
        />
      )}
      
      {!loading && leftIcon && (
        <span className="mr-2 flex items-center">{leftIcon}</span>
      )}
      
      <span className="flex items-center">
        {loading ? loadingText : children}
      </span>
      
      {!loading && rightIcon && (
        <span className="ml-2 flex items-center">{rightIcon}</span>
      )}
    </button>
  );
};

export default Button;
