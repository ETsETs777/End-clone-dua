import React from 'react'
import { cn } from '../../utils/cn'

const Card = React.forwardRef(({
  children,
  className,
  variant = 'default',
  hover = true,
  ...props
}, ref) => {
  const baseClasses = 'card'
  
  const variants = {
    default: 'bg-white dark:bg-secondary-800 shadow-md hover:shadow-lg transition-all duration-300',
    elevated: 'bg-white dark:bg-secondary-800 shadow-xl hover:shadow-2xl transition-all duration-300 hover:-translate-y-1',
    outlined: 'bg-white dark:bg-secondary-800 border-2 border-primary-300 dark:border-primary-600 shadow-md hover:shadow-lg transition-all duration-300',
    filled: 'bg-secondary-50 dark:bg-secondary-700 shadow-md hover:shadow-lg transition-all duration-300',
    glass: 'bg-white/80 dark:bg-secondary-800/80 backdrop-blur-xl border border-white/20 dark:border-secondary-700/20 shadow-2xl hover:shadow-3xl transition-all duration-300',
    duolingo: 'bg-white dark:bg-secondary-800 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 border border-secondary-200 dark:border-secondary-700',
  }

  return (
    <div
      ref={ref}
      className={cn(
        baseClasses,
        variants[variant],
        hover && 'hover:scale-105',
        className
      )}
      {...props}
    >
      {children}
    </div>
  )
})

Card.displayName = 'Card'

const CardHeader = React.forwardRef(({
  children,
  className,
  ...props
}, ref) => (
  <div
    ref={ref}
    className={cn('card-header', className)}
    {...props}
  >
    {children}
  </div>
))

CardHeader.displayName = 'CardHeader'

const CardBody = React.forwardRef(({
  children,
  className,
  ...props
}, ref) => (
  <div
    ref={ref}
    className={cn('card-body', className)}
    {...props}
  >
    {children}
  </div>
))

CardBody.displayName = 'CardBody'

const CardFooter = React.forwardRef(({
  children,
  className,
  ...props
}, ref) => (
  <div
    ref={ref}
    className={cn('card-footer', className)}
    {...props}
  >
    {children}
  </div>
))

CardFooter.displayName = 'CardFooter'

export { Card, CardHeader, CardBody, CardFooter }
