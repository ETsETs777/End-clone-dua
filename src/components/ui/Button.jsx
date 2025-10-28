import React from 'react'
import { cn } from '../../utils/cn'

const Button = React.forwardRef(({
  children,
  variant = 'primary',
  size = 'md',
  className,
  disabled = false,
  loading = false,
  leftIcon,
  rightIcon,
  asChild = false,
  ...props
}, ref) => {
  const baseClasses = 'btn'
  
      const variants = {
        primary: 'bg-gradient-to-r from-primary-500 to-primary-600 text-white shadow-md hover:shadow-lg hover:scale-105',
        secondary: 'bg-secondary-200 text-secondary-800 shadow-md hover:bg-secondary-300 hover:shadow-lg hover:scale-105 dark:bg-secondary-700 dark:text-secondary-100 dark:hover:bg-secondary-600',
        ghost: 'bg-transparent text-secondary-600 hover:bg-secondary-100 dark:hover:bg-secondary-800',
        success: 'bg-gradient-to-r from-accent-success-500 to-accent-success-600 text-white shadow-md hover:shadow-lg hover:scale-105',
        warning: 'bg-gradient-to-r from-accent-warning-500 to-accent-warning-600 text-white shadow-md hover:shadow-lg hover:scale-105',
        error: 'bg-gradient-to-r from-accent-error-500 to-accent-error-600 text-white shadow-md hover:shadow-lg hover:scale-105',
        info: 'bg-gradient-to-r from-primary-500 to-primary-600 text-white shadow-md hover:shadow-lg hover:scale-105',
      }
  
  const sizes = {
    sm: 'btn-sm',
    md: '',
    lg: 'btn-lg',
    xl: 'btn-xl',
  }

  const buttonClasses = cn(
    baseClasses,
    variants[variant],
    sizes[size],
    disabled && 'opacity-50 cursor-not-allowed',
    loading && 'cursor-wait',
    className
  )

  if (asChild) {
    return React.cloneElement(children, {
      className: cn(buttonClasses, children.props.className),
      ref,
      ...props
    })
  }

  return (
    <button
      ref={ref}
      className={buttonClasses}
      disabled={disabled || loading}
      {...props}
    >
      {loading && (
        <svg
          className="animate-spin -ml-1 mr-2 h-4 w-4"
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
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
          />
        </svg>
      )}
      {leftIcon && !loading && (
        <span className="mr-2">{leftIcon}</span>
      )}
      {children}
      {rightIcon && !loading && (
        <span className="ml-2">{rightIcon}</span>
      )}
    </button>
  )
})

Button.displayName = 'Button'

export default Button
