import React, { useState, useEffect } from 'react'
import { cn } from '../../utils/cn'

// Hook для отслеживания размера экрана
export const useBreakpoint = () => {
  const [breakpoint, setBreakpoint] = useState('sm')

  useEffect(() => {
    const updateBreakpoint = () => {
      const width = window.innerWidth
      if (width >= 1536) setBreakpoint('2xl')
      else if (width >= 1280) setBreakpoint('xl')
      else if (width >= 1024) setBreakpoint('lg')
      else if (width >= 768) setBreakpoint('md')
      else setBreakpoint('sm')
    }

    updateBreakpoint()
    window.addEventListener('resize', updateBreakpoint)
    return () => window.removeEventListener('resize', updateBreakpoint)
  }, [])

  return breakpoint
}

// Компонент для адаптивной сетки
export const ResponsiveGrid = ({ 
  children, 
  cols = { sm: 1, md: 2, lg: 3, xl: 4 },
  gap = 6,
  className 
}) => {
  const breakpoint = useBreakpoint()
  
  const getCols = () => {
    if (breakpoint === '2xl') return cols['2xl'] || cols.xl || 4
    if (breakpoint === 'xl') return cols.xl || cols.lg || 3
    if (breakpoint === 'lg') return cols.lg || cols.md || 2
    if (breakpoint === 'md') return cols.md || cols.sm || 2
    return cols.sm || 1
  }

  const gridCols = {
    1: 'grid-cols-1',
    2: 'grid-cols-2',
    3: 'grid-cols-3',
    4: 'grid-cols-4',
    5: 'grid-cols-5',
    6: 'grid-cols-6'
  }

  const gaps = {
    1: 'gap-1',
    2: 'gap-2',
    3: 'gap-3',
    4: 'gap-4',
    5: 'gap-5',
    6: 'gap-6',
    8: 'gap-8',
    10: 'gap-10',
    12: 'gap-12'
  }

  return (
    <div className={cn(
      'grid',
      gridCols[getCols()],
      gaps[gap],
      className
    )}>
      {children}
    </div>
  )
}

// Компонент для адаптивного контейнера
export const ResponsiveContainer = ({ 
  children, 
  maxWidth = '7xl',
  padding = true,
  className 
}) => {
  const maxWidths = {
    'sm': 'max-w-sm',
    'md': 'max-w-md',
    'lg': 'max-w-lg',
    'xl': 'max-w-xl',
    '2xl': 'max-w-2xl',
    '3xl': 'max-w-3xl',
    '4xl': 'max-w-4xl',
    '5xl': 'max-w-5xl',
    '6xl': 'max-w-6xl',
    '7xl': 'max-w-7xl',
    'full': 'max-w-full'
  }

  return (
    <div className={cn(
      'mx-auto',
      maxWidths[maxWidth],
      padding && 'px-4 sm:px-6 lg:px-8',
      className
    )}>
      {children}
    </div>
  )
}

// Компонент для адаптивного текста
export const ResponsiveText = ({ 
  children, 
  size = { sm: 'base', md: 'lg', lg: 'xl' },
  className 
}) => {
  const breakpoint = useBreakpoint()
  
  const getSize = () => {
    if (breakpoint === 'lg' || breakpoint === 'xl' || breakpoint === '2xl') {
      return size.lg || size.md || size.sm || 'base'
    }
    if (breakpoint === 'md') {
      return size.md || size.sm || 'base'
    }
    return size.sm || 'base'
  }

  const textSizes = {
    'xs': 'text-xs',
    'sm': 'text-sm',
    'base': 'text-base',
    'lg': 'text-lg',
    'xl': 'text-xl',
    '2xl': 'text-2xl',
    '3xl': 'text-3xl',
    '4xl': 'text-4xl',
    '5xl': 'text-5xl',
    '6xl': 'text-6xl',
    '7xl': 'text-7xl',
    '8xl': 'text-8xl',
    '9xl': 'text-9xl'
  }

  return (
    <span className={cn(textSizes[getSize()], className)}>
      {children}
    </span>
  )
}

// Компонент для адаптивных отступов
export const ResponsiveSpacing = ({ 
  children, 
  padding = { sm: 4, md: 6, lg: 8 },
  margin = { sm: 4, md: 6, lg: 8 },
  className 
}) => {
  const breakpoint = useBreakpoint()
  
  const getPadding = () => {
    if (breakpoint === 'lg' || breakpoint === 'xl' || breakpoint === '2xl') {
      return padding.lg || padding.md || padding.sm || 4
    }
    if (breakpoint === 'md') {
      return padding.md || padding.sm || 4
    }
    return padding.sm || 4
  }

  const getMargin = () => {
    if (breakpoint === 'lg' || breakpoint === 'xl' || breakpoint === '2xl') {
      return margin.lg || margin.md || margin.sm || 4
    }
    if (breakpoint === 'md') {
      return margin.md || margin.sm || 4
    }
    return margin.sm || 4
  }

  const paddings = {
    1: 'p-1',
    2: 'p-2',
    3: 'p-3',
    4: 'p-4',
    5: 'p-5',
    6: 'p-6',
    8: 'p-8',
    10: 'p-10',
    12: 'p-12',
    16: 'p-16',
    20: 'p-20',
    24: 'p-24'
  }

  const margins = {
    1: 'm-1',
    2: 'm-2',
    3: 'm-3',
    4: 'm-4',
    5: 'm-5',
    6: 'm-6',
    8: 'm-8',
    10: 'm-10',
    12: 'm-12',
    16: 'm-16',
    20: 'm-20',
    24: 'm-24'
  }

  return (
    <div className={cn(
      paddings[getPadding()],
      margins[getMargin()],
      className
    )}>
      {children}
    </div>
  )
}

// Компонент для адаптивного скрытия/показа
export const ResponsiveVisibility = ({ 
  children, 
  show = { sm: true, md: true, lg: true },
  className 
}) => {
  const breakpoint = useBreakpoint()
  
  const shouldShow = () => {
    if (breakpoint === 'lg' || breakpoint === 'xl' || breakpoint === '2xl') {
      return show.lg !== false
    }
    if (breakpoint === 'md') {
      return show.md !== false
    }
    return show.sm !== false
  }

  if (!shouldShow()) {
    return null
  }

  return (
    <div className={className}>
      {children}
    </div>
  )
}

// Компонент для адаптивного изображения
export const ResponsiveImage = ({ 
  src, 
  alt, 
  sizes = { sm: 'w-full', md: 'w-1/2', lg: 'w-1/3' },
  className 
}) => {
  const breakpoint = useBreakpoint()
  
  const getSize = () => {
    if (breakpoint === 'lg' || breakpoint === 'xl' || breakpoint === '2xl') {
      return sizes.lg || sizes.md || sizes.sm || 'w-full'
    }
    if (breakpoint === 'md') {
      return sizes.md || sizes.sm || 'w-full'
    }
    return sizes.sm || 'w-full'
  }

  return (
    <img
      src={src}
      alt={alt}
      className={cn(
        'h-auto object-cover',
        getSize(),
        className
      )}
    />
  )
}

// Компонент для адаптивной навигации
export const ResponsiveNavigation = ({ 
  children, 
  mobileBreakpoint = 'lg',
  className 
}) => {
  const breakpoint = useBreakpoint()
  
  const isMobile = () => {
    const breakpoints = ['sm', 'md', 'lg', 'xl', '2xl']
    const mobileIndex = breakpoints.indexOf(mobileBreakpoint)
    const currentIndex = breakpoints.indexOf(breakpoint)
    return currentIndex < mobileIndex
  }

  return (
    <div className={cn(
      isMobile() ? 'mobile-nav' : 'desktop-nav',
      className
    )}>
      {children}
    </div>
  )
}

// Компонент для адаптивного модального окна
export const ResponsiveModal = ({ 
  children, 
  isOpen, 
  onClose,
  size = { sm: 'full', md: 'lg', lg: 'xl' },
  className 
}) => {
  const breakpoint = useBreakpoint()
  
  const getSize = () => {
    if (breakpoint === 'lg' || breakpoint === 'xl' || breakpoint === '2xl') {
      return size.lg || size.md || size.sm || 'xl'
    }
    if (breakpoint === 'md') {
      return size.md || size.sm || 'lg'
    }
    return size.sm || 'full'
  }

  const modalSizes = {
    'sm': 'max-w-sm',
    'md': 'max-w-md',
    'lg': 'max-w-lg',
    'xl': 'max-w-xl',
    '2xl': 'max-w-2xl',
    '3xl': 'max-w-3xl',
    '4xl': 'max-w-4xl',
    '5xl': 'max-w-5xl',
    '6xl': 'max-w-6xl',
    '7xl': 'max-w-7xl',
    'full': 'max-w-full'
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div 
        className="fixed inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />
      <div className={cn(
        'relative bg-white dark:bg-gray-800 rounded-2xl shadow-2xl',
        modalSizes[getSize()],
        getSize() === 'full' && 'w-full h-full rounded-none',
        className
      )}>
        {children}
      </div>
    </div>
  )
}


