import React from 'react'
import { cn } from '../../utils/cn'

const Badge = React.forwardRef(({
  children,
  variant = 'default',
  size = 'md',
  className,
  ...props
}, ref) => {
  const baseClasses = 'inline-flex items-center font-medium rounded-full'
  
  const variants = {
    default: 'bg-secondary-100 text-secondary-800 dark:bg-secondary-800 dark:text-secondary-200',
    primary: 'bg-primary-100 text-primary-800 dark:bg-primary-800 dark:text-primary-200',
    success: 'bg-accent-success-100 text-accent-success-800 dark:bg-accent-success-800 dark:text-accent-success-200',
    warning: 'bg-accent-warning-100 text-accent-warning-800 dark:bg-accent-warning-800 dark:text-accent-warning-200',
    error: 'bg-accent-error-100 text-accent-error-800 dark:bg-accent-error-800 dark:text-accent-error-200',
    info: 'bg-primary-100 text-primary-800 dark:bg-primary-800 dark:text-primary-200',
    purple: 'bg-accent-purple-100 text-accent-purple-800 dark:bg-accent-purple-800 dark:text-accent-purple-200',
    green: 'bg-accent-success-100 text-accent-success-800 dark:bg-accent-success-800 dark:text-accent-success-200',
    orange: 'bg-accent-warning-100 text-accent-warning-800 dark:bg-accent-warning-800 dark:text-accent-warning-200',
  }
  
  const sizes = {
    sm: 'px-2 py-1 text-xs',
    md: 'px-3 py-1 text-sm',
    lg: 'px-4 py-2 text-base',
  }

  return (
    <span
      ref={ref}
      className={cn(
        baseClasses,
        variants[variant],
        sizes[size],
        className
      )}
      {...props}
    >
      {children}
    </span>
  )
})

Badge.displayName = 'Badge'

export default Badge
