import React from 'react';
import LoadingSpinner from './LoadingSpinner';

interface LoadingOverlayProps {
  isVisible: boolean;
  message?: string;
  spinnerSize?: 'sm' | 'md' | 'lg' | 'xl';
  backdrop?: 'light' | 'dark' | 'transparent';
  className?: string;
}

const backdropClasses = {
  light: 'bg-white bg-opacity-75 backdrop-blur-sm',
  dark: 'bg-black bg-opacity-50 backdrop-blur-sm',
  transparent: 'bg-transparent',
};

export const LoadingOverlay: React.FC<LoadingOverlayProps> = ({
  isVisible,
  message = 'Loading...',
  spinnerSize = 'lg',
  backdrop = 'light',
  className = '',
}) => {
  if (!isVisible) return null;

  return (
    <div
      className={`fixed inset-0 z-50 flex items-center justify-center ${backdropClasses[backdrop]} ${className}`}
      role="dialog"
      aria-modal="true"
      aria-labelledby="loading-message"
      aria-live="assertive"
    >
      <div className="flex flex-col items-center space-y-4 p-6 bg-white rounded-lg shadow-lg border border-neutral-100 animate-fade-in">
        <LoadingSpinner size={spinnerSize} color="primary" label="Loading content" />
        {message && (
          <p
            id="loading-message"
            className="text-lg font-medium text-neutral-700 text-center"
          >
            {message}
          </p>
        )}
      </div>
    </div>
  );
};

export default LoadingOverlay;
