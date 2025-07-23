import React, { forwardRef, useState } from 'react'
import { motion } from 'framer-motion'
import { clsx } from 'clsx'
import { Eye, EyeOff, AlertCircle, CheckCircle } from 'lucide-react'

export interface TiationInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string
  error?: string
  success?: boolean
  variant?: 'default' | 'glass' | 'neon'
  icon?: React.ReactNode
  rightIcon?: React.ReactNode
  helperText?: string
  showPasswordToggle?: boolean
}

const TiationInput = forwardRef<HTMLInputElement, TiationInputProps>(
  (
    {
      label,
      error,
      success,
      variant = 'default',
      icon,
      rightIcon,
      helperText,
      showPasswordToggle,
      type,
      className,
      disabled,
      ...props
    },
    ref
  ) => {
    const [showPassword, setShowPassword] = useState(false)
    const [isFocused, setIsFocused] = useState(false)

    const inputType = type === 'password' && showPassword ? 'text' : type

    const baseInputClasses = [
      'w-full',
      'px-4 py-3',
      'rounded-lg',
      'text-white',
      'placeholder-gray-400',
      'transition-all duration-200 ease-in-out',
      'focus:outline-none',
      'focus:ring-2',
      'disabled:opacity-50',
      'disabled:cursor-not-allowed',
    ]

    const variantClasses = {
      default: [
        'bg-tiation-dark',
        'border border-gray-600',
        'focus:border-tiation-primary',
        'focus:ring-tiation-primary/20',
      ],
      glass: [
        'tiation-glass',
        'backdrop-blur-lg',
        'bg-opacity-80',
        'border border-white/20',
        'focus:border-tiation-accent',
        'focus:ring-tiation-accent/20',
      ],
      neon: [
        'bg-tiation-dark/50',
        'tiation-neon-border',
        'focus:shadow-tiation-neon',
        'focus:ring-tiation-accent/30',
      ],
    }

    const errorClasses = error ? [
      'border-red-500',
      'focus:border-red-500',
      'focus:ring-red-500/20',
    ] : []

    const successClasses = success ? [
      'border-green-500',
      'focus:border-green-500',
      'focus:ring-green-500/20',
    ] : []

    const inputClasses = clsx(
      baseInputClasses,
      variantClasses[variant],
      errorClasses,
      successClasses,
      icon && 'pl-12',
      (rightIcon || showPasswordToggle || error || success) && 'pr-12',
      className
    )

    const labelClasses = clsx(
      'block text-sm font-medium text-gray-300 mb-2',
      error && 'text-red-400',
      success && 'text-green-400',
      disabled && 'opacity-50'
    )

    const helperTextClasses = clsx(
      'text-xs mt-2',
      error ? 'text-red-400' : success ? 'text-green-400' : 'text-gray-500'
    )

    const renderRightIcon = () => {
      if (showPasswordToggle && type === 'password') {
        return (
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="text-gray-400 hover:text-white transition-colors"
            tabIndex={-1}
          >
            {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
          </button>
        )
      }

      if (error) {
        return <AlertCircle className="text-red-500" size={20} />
      }

      if (success) {
        return <CheckCircle className="text-green-500" size={20} />
      }

      return rightIcon
    }

    const inputVariants = {
      initial: { opacity: 0, y: 10 },
      animate: { opacity: 1, y: 0 },
      focused: { scale: 1.01 },
    }

    return (
      <motion.div
        className="relative"
        variants={inputVariants}
        initial="initial"
        animate="animate"
        whileFocus="focused"
      >
        {label && (
          <label className={labelClasses}>
            {label}
          </label>
        )}
        
        <div className="relative">
          {icon && (
            <div className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400">
              {icon}
            </div>
          )}
          
          <input
            ref={ref}
            type={inputType}
            className={inputClasses}
            disabled={disabled}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            {...props}
          />
          
          {(rightIcon || showPasswordToggle || error || success) && (
            <div className="absolute right-4 top-1/2 transform -translate-y-1/2">
              {renderRightIcon()}
            </div>
          )}
        </div>
        
        {(error || helperText) && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className={helperTextClasses}
          >
            {error || helperText}
          </motion.div>
        )}
      </motion.div>
    )
  }
)

TiationInput.displayName = 'TiationInput'

export default TiationInput
