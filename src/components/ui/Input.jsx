import React from 'react'
import { cn } from '../../utils/cn'

const Input = React.forwardRef(({
  className,
  type = 'text',
  variant = 'default',
  size = 'md',
  error,
  leftIcon,
  rightIcon,
  ...props
}, ref) => {
  const baseClasses = 'input'
  
  const variants = {
    default: '',
    filled: 'bg-secondary-50 dark:bg-secondary-800',
    outlined: 'border-2 border-primary-300 dark:border-primary-600',
    ghost: 'border-transparent bg-transparent',
  }
  
  const sizes = {
    sm: 'px-3 py-2 text-sm',
    md: 'px-4 py-3 text-base',
    lg: 'px-5 py-4 text-lg',
  }

  return (
    <div className="relative">
      {leftIcon && (
        <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-secondary-500 dark:text-secondary-400">
          {leftIcon}
        </div>
      )}
      <input
        type={type}
        className={cn(
          baseClasses,
          variants[variant],
          sizes[size],
          leftIcon && 'pl-10',
          rightIcon && 'pr-10',
          error && 'border-error-500 focus:border-error-500 focus:ring-error-500',
          className
        )}
        ref={ref}
        {...props}
      />
      {rightIcon && (
        <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-secondary-500 dark:text-secondary-400">
          {rightIcon}
        </div>
      )}
      {error && (
        <p className="mt-1 text-sm text-error-600 dark:text-error-400">
          {error}
        </p>
      )}
    </div>
  )
})

Input.displayName = 'Input'

export { Input }
export default Input


