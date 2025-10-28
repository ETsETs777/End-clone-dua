import React, { useEffect, useRef, useState } from 'react'
import { cn } from '../../utils/cn'

// Hook для управления фокусом
export const useFocusManagement = () => {
  const focusableElements = useRef([])
  const currentIndex = useRef(-1)

  const updateFocusableElements = (container) => {
    if (!container) return

    const elements = container.querySelectorAll(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    )
    focusableElements.current = Array.from(elements)
  }

  const focusNext = () => {
    if (focusableElements.current.length === 0) return
    
    currentIndex.current = (currentIndex.current + 1) % focusableElements.current.length
    focusableElements.current[currentIndex.current]?.focus()
  }

  const focusPrevious = () => {
    if (focusableElements.current.length === 0) return
    
    currentIndex.current = currentIndex.current <= 0 
      ? focusableElements.current.length - 1 
      : currentIndex.current - 1
    focusableElements.current[currentIndex.current]?.focus()
  }

  const focusFirst = () => {
    if (focusableElements.current.length === 0) return
    
    currentIndex.current = 0
    focusableElements.current[0]?.focus()
  }

  const focusLast = () => {
    if (focusableElements.current.length === 0) return
    
    currentIndex.current = focusableElements.current.length - 1
    focusableElements.current[currentIndex.current]?.focus()
  }

  return {
    updateFocusableElements,
    focusNext,
    focusPrevious,
    focusFirst,
    focusLast
  }
}

// Компонент для скрытого текста для скрин-ридеров
export const ScreenReaderOnly = ({ children, className }) => (
  <span className={cn('sr-only', className)}>
    {children}
  </span>
)

// Компонент для ARIA live regions
export const LiveRegion = ({ 
  children, 
  level = 'polite',
  className 
}) => {
  const levels = {
    polite: 'aria-live="polite"',
    assertive: 'aria-live="assertive"',
    off: 'aria-live="off"'
  }

  return (
    <div 
      className={cn('sr-only', className)}
      {...levels[level]}
      role="status"
    >
      {children}
    </div>
  )
}

// Компонент для доступных кнопок
export const AccessibleButton = ({ 
  children, 
  onClick,
  disabled = false,
  loading = false,
  ariaLabel,
  ariaDescribedBy,
  className,
  ...props 
}) => {
  const [announcement, setAnnouncement] = useState('')

  const handleClick = () => {
    if (disabled || loading) return
    
    setAnnouncement('Кнопка нажата')
    onClick?.()
    
    // Очищаем объявление через короткое время
    setTimeout(() => setAnnouncement(''), 1000)
  }

  return (
    <>
      <button
        onClick={handleClick}
        disabled={disabled || loading}
        aria-label={ariaLabel}
        aria-describedby={ariaDescribedBy}
        aria-disabled={disabled || loading}
        className={cn(
          'focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2',
          'transition-all duration-200',
          disabled && 'opacity-50 cursor-not-allowed',
          loading && 'cursor-wait',
          className
        )}
        {...props}
      >
        {children}
      </button>
      
      <LiveRegion level="polite">
        {announcement}
      </LiveRegion>
    </>
  )
}

// Компонент для доступных форм
export const AccessibleForm = ({ 
  children, 
  onSubmit,
  className,
  ...props 
}) => {
  const [errors, setErrors] = useState({})
  const [announcements, setAnnouncements] = useState('')

  const handleSubmit = (e) => {
    e.preventDefault()
    
    // Валидация формы
    const formData = new FormData(e.target)
    const newErrors = {}
    
    // Проверяем обязательные поля
    const requiredFields = e.target.querySelectorAll('[required]')
    requiredFields.forEach(field => {
      if (!field.value.trim()) {
        newErrors[field.name] = 'Это поле обязательно для заполнения'
      }
    })
    
    setErrors(newErrors)
    
    if (Object.keys(newErrors).length === 0) {
      setAnnouncements('Форма успешно отправлена')
      onSubmit?.(e)
    } else {
      setAnnouncements('Пожалуйста, исправьте ошибки в форме')
    }
    
    // Очищаем объявления
    setTimeout(() => setAnnouncements(''), 3000)
  }

  return (
    <>
      <form 
        onSubmit={handleSubmit}
        className={cn('space-y-4', className)}
        noValidate
        {...props}
      >
        {children}
      </form>
      
      <LiveRegion level="assertive">
        {announcements}
      </LiveRegion>
    </>
  )
}

// Компонент для доступных полей ввода
export const AccessibleInput = ({ 
  label,
  error,
  helpText,
  required = false,
  className,
  ...props 
}) => {
  const id = props.id || `input-${Math.random().toString(36).substr(2, 9)}`
  const errorId = `${id}-error`
  const helpId = `${id}-help`

  return (
    <div className={cn('space-y-2', className)}>
      <label 
        htmlFor={id}
        className="block text-sm font-medium text-gray-700 dark:text-gray-300"
      >
        {label}
        {required && (
          <span className="text-red-500 ml-1" aria-label="обязательное поле">
            *
          </span>
        )}
      </label>
      
      <input
        id={id}
        aria-describedby={cn(
          error && errorId,
          helpText && helpId
        )}
        aria-invalid={error ? 'true' : 'false'}
        aria-required={required}
        className={cn(
          'w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500',
          error 
            ? 'border-red-500 focus:ring-red-500' 
            : 'border-gray-300 dark:border-gray-600 focus:ring-blue-500',
          'bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100'
        )}
        {...props}
      />
      
      {helpText && (
        <p id={helpId} className="text-sm text-gray-500 dark:text-gray-400">
          {helpText}
        </p>
      )}
      
      {error && (
        <p 
          id={errorId} 
          className="text-sm text-red-600 dark:text-red-400"
          role="alert"
        >
          {error}
        </p>
      )}
    </div>
  )
}

// Компонент для доступной навигации
export const AccessibleNavigation = ({ 
  children, 
  label = 'Основная навигация',
  className 
}) => {
  const { updateFocusableElements, focusNext, focusPrevious } = useFocusManagement()
  const navRef = useRef(null)

  useEffect(() => {
    if (navRef.current) {
      updateFocusableElements(navRef.current)
    }
  }, [updateFocusableElements])

  const handleKeyDown = (e) => {
    switch (e.key) {
      case 'ArrowDown':
      case 'ArrowRight':
        e.preventDefault()
        focusNext()
        break
      case 'ArrowUp':
      case 'ArrowLeft':
        e.preventDefault()
        focusPrevious()
        break
      case 'Home':
        e.preventDefault()
        updateFocusableElements(navRef.current)
        break
      case 'End':
        e.preventDefault()
        updateFocusableElements(navRef.current)
        break
    }
  }

  return (
    <nav
      ref={navRef}
      aria-label={label}
      onKeyDown={handleKeyDown}
      className={cn('focus:outline-none', className)}
    >
      {children}
    </nav>
  )
}

// Компонент для доступных модальных окон
export const AccessibleModal = ({ 
  children, 
  isOpen, 
  onClose,
  title,
  className 
}) => {
  const modalRef = useRef(null)
  const previousActiveElement = useRef(null)

  useEffect(() => {
    if (isOpen) {
      // Сохраняем текущий активный элемент
      previousActiveElement.current = document.activeElement
      
      // Фокусируемся на модальном окне
      setTimeout(() => {
        modalRef.current?.focus()
      }, 100)
      
      // Блокируем скролл body
      document.body.style.overflow = 'hidden'
    } else {
      // Восстанавливаем скролл
      document.body.style.overflow = 'unset'
      
      // Возвращаем фокус на предыдущий элемент
      previousActiveElement.current?.focus()
    }

    return () => {
      document.body.style.overflow = 'unset'
    }
  }, [isOpen])

  const handleKeyDown = (e) => {
    if (e.key === 'Escape') {
      onClose()
    }
  }

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose()
    }
  }

  if (!isOpen) return null

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      onClick={handleBackdropClick}
    >
      <div 
        className="fixed inset-0 bg-black/50 backdrop-blur-sm"
        aria-hidden="true"
      />
      
      <div
        ref={modalRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={title ? 'modal-title' : undefined}
        tabIndex={-1}
        onKeyDown={handleKeyDown}
        className={cn(
          'relative bg-white dark:bg-gray-800 rounded-2xl shadow-2xl max-w-lg w-full',
          'focus:outline-none',
          className
        )}
      >
        {title && (
          <h2 id="modal-title" className="sr-only">
            {title}
          </h2>
        )}
        {children}
      </div>
    </div>
  )
}

// Компонент для доступных уведомлений
export const AccessibleNotification = ({ 
  children, 
  type = 'info',
  isVisible = true,
  onClose,
  className 
}) => {
  const [announcement, setAnnouncement] = useState('')

  useEffect(() => {
    if (isVisible) {
      const message = type === 'error' ? 'Ошибка' : 
                     type === 'success' ? 'Успех' : 
                     type === 'warning' ? 'Предупреждение' : 'Информация'
      setAnnouncement(`${message}: ${children}`)
    }
  }, [isVisible, type, children])

  const types = {
    info: 'bg-blue-50 dark:bg-blue-900/20 text-blue-800 dark:text-blue-200 border-blue-200 dark:border-blue-800',
    success: 'bg-green-50 dark:bg-green-900/20 text-green-800 dark:text-green-200 border-green-200 dark:border-green-800',
    warning: 'bg-yellow-50 dark:bg-yellow-900/20 text-yellow-800 dark:text-yellow-200 border-yellow-200 dark:border-yellow-800',
    error: 'bg-red-50 dark:bg-red-900/20 text-red-800 dark:text-red-200 border-red-200 dark:border-red-800'
  }

  if (!isVisible) return null

  return (
    <>
      <div
        role="alert"
        aria-live="polite"
        className={cn(
          'p-4 rounded-lg border',
          types[type],
          className
        )}
      >
        {children}
        {onClose && (
          <button
            onClick={onClose}
            aria-label="Закрыть уведомление"
            className="ml-4 text-current opacity-70 hover:opacity-100"
          >
            ×
          </button>
        )}
      </div>
      
      <LiveRegion level="polite">
        {announcement}
      </LiveRegion>
    </>
  )
}

// Компонент для доступных таблиц
export const AccessibleTable = ({ 
  children, 
  caption,
  className 
}) => {
  return (
    <div className="overflow-x-auto">
      <table 
        className={cn('min-w-full divide-y divide-gray-200 dark:divide-gray-700', className)}
        role="table"
      >
        {caption && (
          <caption className="sr-only">
            {caption}
          </caption>
        )}
        {children}
      </table>
    </div>
  )
}

// Hook для проверки контрастности цветов
export const useColorContrast = (foreground, background) => {
  const getLuminance = (color) => {
    const rgb = color.match(/\d+/g)
    if (!rgb) return 0
    
    const [r, g, b] = rgb.map(c => {
      c = parseInt(c) / 255
      return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4)
    })
    
    return 0.2126 * r + 0.7152 * g + 0.0722 * b
  }

  const foregroundLuminance = getLuminance(foreground)
  const backgroundLuminance = getLuminance(background)
  
  const contrast = (Math.max(foregroundLuminance, backgroundLuminance) + 0.05) / 
                  (Math.min(foregroundLuminance, backgroundLuminance) + 0.05)
  
  return {
    contrast,
    meetsAA: contrast >= 4.5,
    meetsAAA: contrast >= 7
  }
}


