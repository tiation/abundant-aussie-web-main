import React from 'react'
import { motion, HTMLMotionProps } from 'framer-motion'
import { clsx } from 'clsx'

interface TiationCardProps extends HTMLMotionProps<'div'> {
  variant?: 'glass' | 'solid' | 'gradient' | 'neon'
  hover?: boolean
  padding?: 'none' | 'sm' | 'md' | 'lg' | 'xl'
  children: React.ReactNode
}

const TiationCard: React.FC<TiationCardProps> = ({
  variant = 'glass',
  hover = true,
  padding = 'md',
  className,
  children,
  ...props
}) => {
  const baseClasses = [
    'rounded-xl',
    'transition-all duration-300 ease-in-out',
  ]

  const variantClasses = {
    glass: [
      'tiation-glass',
      'backdrop-blur-lg',
      'bg-opacity-80',
    ],
    solid: [
      'bg-tiation-gray',
      'border border-gray-600',
    ],
    gradient: [
      'bg-gradient-to-br from-tiation-gray via-gray-800 to-tiation-dark',
      'border border-gray-600',
    ],
    neon: [
      'tiation-neon-border',
      'bg-tiation-dark',
      'bg-opacity-50',
    ],
  }

  const paddingClasses = {
    none: '',
    sm: 'p-4',
    md: 'p-6',
    lg: 'p-8',
    xl: 'p-12',
  }

  const hoverClasses = hover ? [
    'tiation-card-hover',
    'cursor-pointer',
    'hover:shadow-2xl',
  ] : []

  const cardClasses = clsx(
    baseClasses,
    variantClasses[variant],
    paddingClasses[padding],
    hoverClasses,
    className
  )

  const cardVariants = {
    initial: {
      opacity: 0,
      y: 20,
      scale: 0.95,
    },
    animate: {
      opacity: 1,
      y: 0,
      scale: 1,
    },
    exit: {
      opacity: 0,
      y: -20,
      scale: 0.95,
    },
    hover: hover ? {
      y: -4,
      scale: 1.02,
      transition: {
        duration: 0.2,
        ease: 'easeOut',
      },
    } : {},
  }

  return (
    <motion.div
      className={cardClasses}
      variants={cardVariants}
      initial="initial"
      animate="animate"
      exit="exit"
      whileHover="hover"
      layout
      {...props}
    >
      {children}
    </motion.div>
  )
}

export default TiationCard
