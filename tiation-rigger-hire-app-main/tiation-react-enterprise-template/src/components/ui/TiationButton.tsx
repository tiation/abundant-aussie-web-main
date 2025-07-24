import React from 'react'
import { motion, HTMLMotionProps } from 'framer-motion'
import { clsx } from 'clsx'

interface TiationButtonProps extends Omit<HTMLMotionProps<'button'>, 'size'> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger'
  size?: 'sm' | 'md' | 'lg' | 'xl'
  loading?: boolean
  leftIcon?: React.ReactNode
  rightIcon?: React.ReactNode
  children: React.ReactNode
}

const TiationButton: React.FC<TiationButtonProps> = ({
  variant = 'primary',
  size = 'md',
  loading = false,
  leftIcon,
  rightIcon,
  className,
  children,
  disabled,
  ...props
}) => {
  const baseClasses = [
    'inline-flex items-center justify-center font-semibold rounded-lg',
    'transition-all duration-300 ease-in-out',
    'focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-tiation-dark',
    'disabled:opacity-50 disabled:cursor-not-allowed',
    'tiation-mobile-touch',
    'relative overflow-hidden',
  ]

  const variantClasses = {
    primary: [
      'bg-gradient-to-r from-tiation-cyan to-tiation-magenta',
      'text-black font-bold',
      'hover:shadow-neon-gradient hover:scale-105',
      'focus:ring-tiation-cyan',
      'active:scale-95',
    ],
    secondary: [
      'bg-transparent border-2 border-tiation-cyan',
      'text-tiation-cyan',
      'hover:bg-tiation-cyan hover:text-black hover:shadow-neon-cyan',
      'focus:ring-tiation-cyan',
    ],
    ghost: [
      'bg-transparent',
      'text-gray-300 hover:text-white',
      'hover:bg-white hover:bg-opacity-10',
      'focus:ring-gray-400',
    ],
    danger: [
      'bg-gradient-to-r from-red-500 to-pink-500',
      'text-white',
      'hover:from-red-600 hover:to-pink-600 hover:shadow-lg',
      'focus:ring-red-500',
    ],
  }

  const sizeClasses = {
    sm: 'px-3 py-2 text-sm',
    md: 'px-4 py-3 text-base',
    lg: 'px-6 py-4 text-lg',
    xl: 'px-8 py-5 text-xl',
  }

  const buttonClasses = clsx(
    baseClasses,
    variantClasses[variant],
    sizeClasses[size],
    className
  )

  const iconSize = {
    sm: 'w-4 h-4',
    md: 'w-5 h-5',
    lg: 'w-6 h-6',
    xl: 'w-7 h-7',
  }

  const LoadingSpinner = () => (
    <motion.div
      className={clsx('animate-spin rounded-full border-2 border-current border-t-transparent', iconSize[size])}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    />
  )

  return (
    <motion.button
      className={buttonClasses}
      disabled={disabled || loading}
      whileTap={{ scale: 0.95 }}
      whileHover={{ scale: disabled || loading ? 1 : 1.02 }}
      {...props}
    >
      {/* Loading overlay effect */}
      {loading && (
        <motion.div
          className="absolute inset-0 bg-current opacity-10"
          initial={{ x: '-100%' }}
          animate={{ x: '100%' }}
          transition={{ repeat: Infinity, duration: 1.5, ease: 'linear' }}
        />
      )}
      
      {/* Left icon or loading spinner */}
      {loading ? (
        <LoadingSpinner />
      ) : leftIcon ? (
        <span className={clsx('mr-2', iconSize[size])}>{leftIcon}</span>
      ) : null}
      
      {/* Button content */}
      <span className={loading ? 'opacity-70' : ''}>{children}</span>
      
      {/* Right icon */}
      {!loading && rightIcon && (
        <span className={clsx('ml-2', iconSize[size])}>{rightIcon}</span>
      )}
    </motion.button>
  )
}

export default TiationButton
