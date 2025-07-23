import * as React from 'react';
import { cn } from '../../utils/cn';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outlined' | 'text';
  size?: 'sm' | 'md' | 'lg';
  loading?: boolean;
}

const buttonVariants = {
  primary: 'bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-500',
  secondary: 'bg-gray-600 text-white hover:bg-gray-700 focus:ring-gray-500',
  outlined: 'border border-gray-300 text-gray-700 bg-white hover:bg-gray-50 focus:ring-indigo-500',
  text: 'text-gray-700 hover:bg-gray-50 focus:ring-indigo-500',
};

const buttonSizes = {
  sm: 'px-2 py-1 text-sm',
  md: 'px-4 py-2 text-md',
  lg: 'px-6 py-3 text-lg',
};

/**
 * A customizable button component
 */
export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ variant = 'primary', size = 'md', loading, className, children, ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={cn(
          'inline-flex items-center justify-center rounded shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2',
          buttonVariants[variant],
          buttonSizes[size],
          loading && 'opacity-50 cursor-not-allowed',
          className
        )}
        disabled={loading}
        {...props}
      >
        {loading && (
          <svg
            className="animate-spin h-5 w-5 mr-3 ..."
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8v1.5a6.499 6.499 0 00-6.47 7.5H4z"
            />
          </svg>
        )}
        {children}
      </button>
    );
  }
);

Button.displayName = 'Button';

