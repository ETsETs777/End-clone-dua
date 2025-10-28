import React, { useState, useEffect, useRef } from 'react'
import { cn } from '../../utils/cn'

// Компонент для анимированного появления элементов
export const AnimateOnScroll = ({ 
  children, 
  animation = 'fadeIn', 
  delay = 0, 
  duration = 500,
  threshold = 0.1,
  className 
}) => {
  const [isVisible, setIsVisible] = useState(false)
  const elementRef = useRef(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setTimeout(() => {
            setIsVisible(true)
          }, delay)
        }
      },
      { threshold }
    )

    if (elementRef.current) {
      observer.observe(elementRef.current)
    }

    return () => {
      if (elementRef.current) {
        observer.unobserve(elementRef.current)
      }
    }
  }, [delay, threshold])

  const animations = {
    fadeIn: 'animate-fade-in',
    slideUp: 'animate-slide-up',
    slideDown: 'animate-slide-down',
    slideLeft: 'animate-slide-left',
    slideRight: 'animate-slide-right',
    scaleIn: 'animate-scale-in',
    bounce: 'animate-bounce-gentle',
    float: 'animate-float',
    glow: 'animate-glow',
    wiggle: 'animate-wiggle',
    shimmer: 'animate-shimmer'
  }

  return (
    <div
      ref={elementRef}
      className={cn(
        'transition-all duration-500',
        isVisible ? animations[animation] : 'opacity-0',
        className
      )}
      style={{ 
        transitionDuration: `${duration}ms`,
        animationDelay: `${delay}ms`
      }}
    >
      {children}
    </div>
  )
}

// Компонент для интерактивных карточек с hover-эффектами
export const InteractiveCard = ({ 
  children, 
  variant = 'default',
  hoverEffect = 'lift',
  className,
  onClick,
  ...props 
}) => {
  const [isHovered, setIsHovered] = useState(false)

  const variants = {
    default: 'bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700',
    elevated: 'bg-white dark:bg-gray-800 shadow-lg dark:shadow-xl',
    glass: 'bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl border border-white/20 dark:border-gray-700/20',
    gradient: 'bg-gradient-to-br from-white to-gray-50 dark:from-gray-800 dark:to-gray-900',
  }

  const hoverEffects = {
    lift: 'hover:scale-105 hover:-translate-y-2',
    glow: 'hover:shadow-glow hover:shadow-glow-lg',
    rotate: 'hover:rotate-1',
    bounce: 'hover:animate-bounce-gentle',
    float: 'hover:animate-float',
    wiggle: 'hover:animate-wiggle'
  }

  return (
    <div
      className={cn(
        'rounded-2xl transition-all duration-300 cursor-pointer',
        variants[variant],
        hoverEffects[hoverEffect],
        isHovered && 'shadow-xl dark:shadow-2xl',
        className
      )}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={onClick}
      {...props}
    >
      {children}
    </div>
  )
}

// Компонент для анимированных кнопок
export const AnimatedButton = ({ 
  children, 
  variant = 'primary',
  size = 'md',
  animation = 'scale',
  loading = false,
  className,
  ...props 
}) => {
  const [isPressed, setIsPressed] = useState(false)

  const animations = {
    scale: 'hover:scale-105 active:scale-95',
    bounce: 'hover:animate-bounce-gentle',
    glow: 'hover:animate-glow',
    wiggle: 'hover:animate-wiggle',
    float: 'hover:animate-float'
  }

  const variants = {
    primary: 'bg-gradient-to-r from-blue-500 to-purple-500 text-white shadow-lg hover:shadow-xl',
    secondary: 'bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-gray-100 hover:bg-gray-200 dark:hover:bg-gray-600',
    success: 'bg-gradient-to-r from-green-500 to-emerald-500 text-white shadow-lg hover:shadow-xl',
    warning: 'bg-gradient-to-r from-orange-500 to-red-500 text-white shadow-lg hover:shadow-xl',
    ghost: 'bg-transparent hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-300'
  }

  const sizes = {
    sm: 'px-4 py-2 text-sm',
    md: 'px-6 py-3 text-base',
    lg: 'px-8 py-4 text-lg',
    xl: 'px-10 py-5 text-xl'
  }

  return (
    <button
      className={cn(
        'inline-flex items-center justify-center font-medium rounded-xl transition-all duration-200',
        'focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2',
        variants[variant],
        sizes[size],
        animations[animation],
        isPressed && 'scale-95',
        loading && 'opacity-50 cursor-not-allowed',
        className
      )}
      onMouseDown={() => setIsPressed(true)}
      onMouseUp={() => setIsPressed(false)}
      onMouseLeave={() => setIsPressed(false)}
      disabled={loading}
      {...props}
    >
      {loading && (
        <svg className="animate-spin -ml-1 mr-2 h-4 w-4" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
        </svg>
      )}
      {children}
    </button>
  )
}

// Компонент для анимированного прогресс-бара
export const AnimatedProgress = ({ 
  value = 0, 
  max = 100, 
  variant = 'default',
  showLabel = true,
  animated = true,
  className 
}) => {
  const [displayValue, setDisplayValue] = useState(0)

  useEffect(() => {
    if (animated) {
      const timer = setTimeout(() => {
        setDisplayValue(value)
      }, 100)
      return () => clearTimeout(timer)
    } else {
      setDisplayValue(value)
    }
  }, [value, animated])

  const percentage = Math.min(Math.max((displayValue / max) * 100, 0), 100)

  const variants = {
    default: 'bg-gradient-to-r from-blue-500 to-purple-500',
    success: 'bg-gradient-to-r from-green-500 to-emerald-500',
    warning: 'bg-gradient-to-r from-orange-500 to-red-500',
    error: 'bg-gradient-to-r from-red-500 to-pink-500',
    info: 'bg-gradient-to-r from-cyan-500 to-blue-500'
  }

  return (
    <div className={cn('w-full', className)}>
      {showLabel && (
        <div className="flex justify-between text-sm text-gray-600 dark:text-gray-400 mb-2">
          <span>Progress</span>
          <span>{Math.round(percentage)}%</span>
        </div>
      )}
      <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3 overflow-hidden">
        <div
          className={cn(
            'h-full transition-all duration-1000 ease-out',
            variants[variant]
          )}
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  )
}

// Компонент для анимированных иконок
export const AnimatedIcon = ({ 
  icon: Icon, 
  animation = 'none',
  size = 'md',
  className,
  ...props 
}) => {
  const animations = {
    none: '',
    spin: 'animate-spin',
    bounce: 'animate-bounce',
    pulse: 'animate-pulse',
    ping: 'animate-ping',
    wiggle: 'animate-wiggle',
    float: 'animate-float',
    glow: 'animate-glow'
  }

  const sizes = {
    sm: 'w-4 h-4',
    md: 'w-5 h-5',
    lg: 'w-6 h-6',
    xl: 'w-8 h-8'
  }

  return (
    <Icon
      className={cn(
        animations[animation],
        sizes[size],
        className
      )}
      {...props}
    />
  )
}

// Компонент для анимированного текста
export const AnimatedText = ({ 
  children, 
  animation = 'fadeIn',
  delay = 0,
  duration = 500,
  className 
}) => {
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(true)
    }, delay)
    return () => clearTimeout(timer)
  }, [delay])

  const animations = {
    fadeIn: 'animate-fade-in',
    slideUp: 'animate-slide-up',
    slideDown: 'animate-slide-down',
    slideLeft: 'animate-slide-left',
    slideRight: 'animate-slide-right',
    scaleIn: 'animate-scale-in',
    bounce: 'animate-bounce-gentle',
    typewriter: 'animate-typewriter'
  }

  return (
    <span
      className={cn(
        'transition-all duration-500',
        isVisible ? animations[animation] : 'opacity-0',
        className
      )}
      style={{ 
        transitionDuration: `${duration}ms`,
        animationDelay: `${delay}ms`
      }}
    >
      {children}
    </span>
  )
}

// Компонент для анимированного счетчика
export const AnimatedCounter = ({ 
  value = 0, 
  duration = 1000,
  className 
}) => {
  const [count, setCount] = useState(0)

  useEffect(() => {
    let startTime = null
    const startValue = count
    const endValue = value

    const animate = (currentTime) => {
      if (startTime === null) startTime = currentTime
      const progress = Math.min((currentTime - startTime) / duration, 1)
      
      const easeOutQuart = 1 - Math.pow(1 - progress, 4)
      const currentCount = Math.floor(startValue + (endValue - startValue) * easeOutQuart)
      
      setCount(currentCount)
      
      if (progress < 1) {
        requestAnimationFrame(animate)
      }
    }

    requestAnimationFrame(animate)
  }, [value, duration])

  return (
    <span className={className}>
      {count}
    </span>
  )
}

// Компонент для анимированного фона
export const AnimatedBackground = ({ 
  children, 
  variant = 'particles',
  className 
}) => {
  const variants = {
    particles: 'relative overflow-hidden',
    gradient: 'bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900',
    waves: 'relative overflow-hidden',
    grid: 'relative overflow-hidden'
  }

  return (
    <div className={cn(variants[variant], className)}>
      {variant === 'particles' && (
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-1/4 w-32 h-32 bg-blue-500 rounded-full blur-3xl animate-pulse-slow" />
          <div className="absolute bottom-0 right-1/4 w-24 h-24 bg-purple-500 rounded-full blur-3xl animate-pulse-slow" />
          <div className="absolute top-1/2 left-1/2 w-20 h-20 bg-pink-500 rounded-full blur-3xl animate-pulse-slow" />
        </div>
      )}
      {variant === 'waves' && (
        <div className="absolute inset-0 opacity-5">
          <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 animate-pulse-slow" />
        </div>
      )}
      {variant === 'grid' && (
        <div className="absolute inset-0 opacity-5">
          <div className="absolute inset-0 bg-grid-pattern animate-pulse-slow" />
        </div>
      )}
      <div className="relative z-10">
        {children}
      </div>
    </div>
  )
}


