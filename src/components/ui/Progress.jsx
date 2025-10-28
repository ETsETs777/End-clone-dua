import React from 'react'
import { cn } from '../../utils/cn'

const Progress = React.forwardRef(({
  value = 0,
  max = 100,
  size = 'md',
  variant = 'default',
  showValue = false,
  className,
  ...props
}, ref) => {
  const percentage = Math.min(Math.max((value / max) * 100, 0), 100)

  const sizes = {
    sm: 'h-2',
    md: 'h-3',
    lg: 'h-4',
    xl: 'h-6'
  }

  const variants = {
    default: 'bg-primary-500',
    success: 'bg-accent-success-500',
    warning: 'bg-accent-warning-500',
    error: 'bg-accent-error-500',
    info: 'bg-primary-500',
    purple: 'bg-accent-purple-500'
  }

  return (
    <div className={cn('w-full', className)} {...props}>
      <div className={cn(
        'w-full bg-secondary-200 dark:bg-secondary-700 rounded-full overflow-hidden',
        sizes[size]
      )}>
        <div
          ref={ref}
          className={cn(
            'h-full rounded-full transition-all duration-500 ease-out',
            variants[variant]
          )}
          style={{ width: `${percentage}%` }}
        />
      </div>
      {showValue && (
        <div className="flex justify-between text-sm text-secondary-600 dark:text-secondary-400 mt-1">
          <span>{value}</span>
          <span>{max}</span>
        </div>
      )}
    </div>
  )
})

Progress.displayName = 'Progress'

export { Progress }