import React from 'react';

interface LoadingSkeletonProps {
  variant?: 'text' | 'circular' | 'rectangular' | 'rounded';
  width?: string | number;
  height?: string | number;
  lines?: number;
  className?: string;
}

export const LoadingSkeleton: React.FC<LoadingSkeletonProps> = ({
  variant = 'text',
  width = '100%',
  height,
  lines = 1,
  className = '',
}) => {
  const baseClasses = 'animate-pulse bg-neutral-200';
  
  const getVariantClasses = () => {
    switch (variant) {
      case 'circular':
        return 'rounded-full';
      case 'rectangular':
        return '';
      case 'rounded':
        return 'rounded-lg';
      case 'text':
      default:
        return 'rounded';
    }
  };

  const getDefaultHeight = () => {
    if (height) return height;
    switch (variant) {
      case 'circular':
        return '40px';
      case 'text':
        return '20px';
      default:
        return '40px';
    }
  };

  const style = {
    width: typeof width === 'number' ? `${width}px` : width,
    height: typeof getDefaultHeight() === 'number' ? `${getDefaultHeight()}px` : getDefaultHeight(),
  };

  if (variant === 'text' && lines > 1) {
    return (
      <div className={`space-y-2 ${className}`} role="status" aria-label="Loading content">
        {Array.from({ length: lines }).map((_, index) => (
          <div
            key={index}
            className={`${baseClasses} ${getVariantClasses()}`}
            style={{
              ...style,
              width: index === lines - 1 ? '75%' : style.width, // Last line shorter
            }}
          />
        ))}
        <span className="sr-only">Loading...</span>
      </div>
    );
  }

  return (
    <div
      className={`${baseClasses} ${getVariantClasses()} ${className}`}
      style={style}
      role="status"
      aria-label="Loading content"
    >
      <span className="sr-only">Loading...</span>
    </div>
  );
};
