import React from 'react'
import { cn } from '../../utils/cn'

// Компонент логотипа
export const Logo = ({ 
  size = 'md',
  variant = 'default',
  className 
}) => {
  const sizes = {
    sm: 'w-8 h-8',
    md: 'w-12 h-12',
    lg: 'w-16 h-16',
    xl: 'w-20 h-20'
  }

  const variants = {
    default: 'bg-gradient-to-br from-blue-600 via-purple-600 to-indigo-600',
    white: 'bg-white',
    dark: 'bg-gray-800',
    transparent: 'bg-transparent'
  }

  return (
    <div className={cn(
      'flex items-center justify-center rounded-xl shadow-lg',
      sizes[size],
      variants[variant],
      className
    )}>
      <svg
        className="w-1/2 h-1/2 text-white"
        viewBox="0 0 24 24"
        fill="currentColor"
      >
        <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
      </svg>
    </div>
  )
}

// Компонент для брендовых цветов
export const BrandColors = () => (
  <div className="grid grid-cols-4 gap-4 p-6 bg-white dark:bg-gray-800 rounded-lg">
    <div className="text-center">
      <div className="w-16 h-16 bg-blue-500 rounded-lg mx-auto mb-2"></div>
      <p className="text-sm font-medium">Primary Blue</p>
      <p className="text-xs text-gray-500">#3B82F6</p>
    </div>
    <div className="text-center">
      <div className="w-16 h-16 bg-purple-500 rounded-lg mx-auto mb-2"></div>
      <p className="text-sm font-medium">Accent Purple</p>
      <p className="text-xs text-gray-500">#A855F7</p>
    </div>
    <div className="text-center">
      <div className="w-16 h-16 bg-green-500 rounded-lg mx-auto mb-2"></div>
      <p className="text-sm font-medium">Success Green</p>
      <p className="text-xs text-gray-500">#22C55E</p>
    </div>
    <div className="text-center">
      <div className="w-16 h-16 bg-orange-500 rounded-lg mx-auto mb-2"></div>
      <p className="text-sm font-medium">Warning Orange</p>
      <p className="text-xs text-gray-500">#F97316</p>
    </div>
  </div>
)


