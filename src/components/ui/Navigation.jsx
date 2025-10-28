import React, { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { cn } from '../../utils/cn'
import {
  ChevronDown,
  ChevronRight,
  Home,
  MessageCircle,
  BookOpen,
  GraduationCap,
  Brain,
  FileText,
  Activity,
  Zap,
  Shield,
  BarChart3,
  Trophy,
  Settings,
  User,
  LogOut,
  Bell,
  Search,
  Menu,
  X
} from 'lucide-react'

const Navigation = ({ 
  isOpen, 
  onClose, 
  className,
  variant = 'sidebar' // sidebar, topbar, mobile
}) => {
  const location = useLocation()
  const [expandedItems, setExpandedItems] = useState([])

  const navigationItems = [
    {
      id: 'main',
      label: 'Основное',
      items: [
        { path: '/', icon: Home, label: 'Главная' },
        { path: '/chat', icon: MessageCircle, label: 'Чат с ИИ' },
        { path: '/vocabulary', icon: BookOpen, label: 'Словарь' },
        { path: '/grammar', icon: GraduationCap, label: 'Грамматика' },
      ]
    },
    {
      id: 'ai',
      label: 'ИИ Функции',
      items: [
        { path: '/exercises', icon: Brain, label: 'ИИ Упражнения' },
        { path: '/analyzer', icon: FileText, label: 'Анализатор текста' },
      ]
    },
    {
      id: 'tools',
      label: 'Инструменты',
      items: [
        { path: '/performance', icon: Activity, label: 'Производительность' },
        { path: '/optimizer', icon: Zap, label: 'Оптимизатор' },
        { path: '/security', icon: Shield, label: 'Безопасность' },
      ]
    },
    {
      id: 'progress',
      label: 'Прогресс',
      items: [
        { path: '/progress', icon: BarChart3, label: 'Статистика' },
        { path: '/achievements', icon: Trophy, label: 'Достижения' },
      ]
    }
  ]

  const toggleExpanded = (itemId) => {
    setExpandedItems(prev => 
      prev.includes(itemId) 
        ? prev.filter(id => id !== itemId)
        : [...prev, itemId]
    )
  }

  const isActive = (path) => location.pathname === path

  const renderNavItem = (item, level = 0) => {
    const Icon = item.icon
    const active = isActive(item.path)
    
    return (
      <Link
        key={item.path}
        to={item.path}
        className={cn(
          'flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-200',
          'hover:bg-primary-50 dark:hover:bg-primary-900/20',
          'group relative',
          level > 0 && 'ml-6',
          active && 'bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300',
          !active && 'text-secondary-600 dark:text-secondary-400 hover:text-primary-600 dark:hover:text-primary-400'
        )}
        onClick={variant === 'mobile' ? onClose : undefined}
      >
        <Icon className={cn(
          'w-5 h-5 transition-colors',
          active && 'text-primary-600 dark:text-primary-400',
          !active && 'text-secondary-500 dark:text-secondary-500 group-hover:text-primary-500'
        )} />
        <span className="font-medium">{item.label}</span>
        {active && (
          <div className="absolute right-2 w-2 h-2 bg-primary-500 rounded-full" />
        )}
      </Link>
    )
  }

  const renderNavGroup = (group) => {
    const isExpanded = expandedItems.includes(group.id)
    
    return (
      <div key={group.id} className="mb-6">
        <button
          onClick={() => toggleExpanded(group.id)}
          className={cn(
            'flex items-center justify-between w-full px-4 py-2 mb-2',
            'text-sm font-semibold text-secondary-500 dark:text-secondary-400',
            'hover:text-primary-600 dark:hover:text-primary-400 transition-colors'
          )}
        >
          <span>{group.label}</span>
          {isExpanded ? (
            <ChevronDown className="w-4 h-4" />
          ) : (
            <ChevronRight className="w-4 h-4" />
          )}
        </button>
        
        {isExpanded && (
          <div className="space-y-1 animate-slide-down">
            {group.items.map(item => renderNavItem(item))}
          </div>
        )}
      </div>
    )
  }

  if (variant === 'mobile') {
    return (
      <div className={cn(
        'fixed inset-0 z-50 bg-black/50 backdrop-blur-sm',
        isOpen ? 'block' : 'hidden'
      )}>
        <div className={cn(
          'fixed left-0 top-0 h-full w-80 bg-white dark:bg-secondary-900',
          'shadow-2xl transform transition-transform duration-300',
          isOpen ? 'translate-x-0' : '-translate-x-full',
          className
        )}>
          <div className="flex items-center justify-between p-6 border-b border-secondary-200 dark:border-secondary-700">
            <h2 className="text-xl font-bold text-primary">Навигация</h2>
            <button
              onClick={onClose}
              className="p-2 rounded-lg hover:bg-secondary-100 dark:hover:bg-secondary-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
          
          <div className="p-6 overflow-y-auto h-full">
            {navigationItems.map(renderNavGroup)}
          </div>
        </div>
      </div>
    )
  }

  if (variant === 'topbar') {
    return (
      <nav className={cn('flex items-center space-x-1', className)}>
        {navigationItems.map(group => 
          group.items.map(item => renderNavItem(item))
        )}
      </nav>
    )
  }

  // Sidebar variant (default)
  return (
    <nav className={cn(
      'w-80 bg-white/90 dark:bg-secondary-900/90 backdrop-blur-xl',
      'shadow-2xl border-r border-secondary-200/50 dark:border-secondary-700/50',
      'h-full overflow-y-auto',
      className
    )}>
      <div className="p-6">
        <div className="mb-8">
          <h2 className="text-xl font-bold text-primary mb-2">Навигация</h2>
          <div className="w-16 h-1 bg-gradient-to-r from-primary-500 to-accent-purple-500 rounded-full"></div>
        </div>
        
        <div className="space-y-6">
          {navigationItems.map(renderNavGroup)}
        </div>
      </div>
    </nav>
  )
}

export default Navigation


