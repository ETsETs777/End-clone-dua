import React, { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { cn } from '../../utils/cn'
import {
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
  User,
  ChevronDown,
  ChevronRight,
  Search,
  Settings,
  HelpCircle,
  Bell,
  Star,
  Target,
  Clock,
  Award,
  TrendingUp,
  Bookmark,
  PlayCircle,
  X
} from 'lucide-react'

const DuolingoNavigation = ({ 
  isOpen, 
  onClose, 
  className,
  variant = 'sidebar' // sidebar, topbar, mobile
}) => {
  const location = useLocation()
  const [expandedGroups, setExpandedGroups] = useState(['learning', 'tools', 'progress'])

  const navigationStructure = [
    {
      id: 'dashboard',
      label: 'Главная',
      icon: Home,
      path: '/',
      badge: null,
      description: 'Обзор прогресса и быстрый доступ'
    },
    {
      id: 'learning',
      label: 'Обучение',
      icon: GraduationCap,
      path: null,
      badge: null,
      description: 'Основные инструменты обучения',
      children: [
        {
          id: 'chat',
          label: 'Чат с ИИ',
          icon: MessageCircle,
          path: '/chat',
          badge: 'new',
          description: 'Персональный помощник по английскому'
        },
        {
          id: 'exercises',
          label: 'Упражнения',
          icon: PlayCircle,
          path: '/exercises',
          badge: null,
          description: 'Интерактивные упражнения с ИИ'
        },
        {
          id: 'grammar',
          label: 'Грамматика',
          icon: BookOpen,
          path: '/grammar',
          badge: null,
          description: 'Уроки и правила грамматики'
        },
        {
          id: 'pronunciation',
          label: 'Произношение',
          icon: Brain,
          path: '/pronunciation',
          badge: 'new',
          description: 'Практика произношения с AI'
        }
      ]
    },
    {
      id: 'tools',
      label: 'Инструменты',
      icon: Settings,
      path: null,
      badge: null,
      description: 'Вспомогательные инструменты',
      children: [
        {
          id: 'vocabulary',
          label: 'Словарь',
          icon: Bookmark,
          path: '/vocabulary',
          badge: null,
          description: 'Персональный словарь слов'
        },
        {
          id: 'analyzer',
          label: 'Анализатор текста',
          icon: FileText,
          path: '/analyzer',
          badge: null,
          description: 'Анализ сложности текста'
        },
        {
          id: 'optimizer',
          label: 'Оптимизатор',
          icon: Zap,
          path: '/optimizer',
          badge: null,
          description: 'Оптимизация производительности'
        },
        {
          id: 'security',
          label: 'Безопасность',
          icon: Shield,
          path: '/security',
          badge: null,
          description: 'Настройки безопасности'
        },
        {
          id: 'accessibility',
          label: 'Доступность',
          icon: Settings,
          path: '/accessibility',
          badge: null,
          description: 'Настройки доступности'
        },
        {
          id: 'data',
          label: 'Управление данными',
          icon: Settings,
          path: '/data-management',
          badge: null,
          description: 'Экспорт и импорт данных'
        }
      ]
    },
    {
      id: 'progress',
      label: 'Прогресс',
      icon: TrendingUp,
      path: null,
      badge: null,
      description: 'Отслеживание достижений',
      children: [
        {
          id: 'statistics',
          label: 'Статистика',
          icon: BarChart3,
          path: '/progress',
          badge: null,
          description: 'Детальная статистика обучения'
        },
        {
          id: 'performance',
          label: 'Производительность',
          icon: Activity,
          path: '/performance',
          badge: null,
          description: 'Мониторинг производительности'
        },
        {
          id: 'achievements',
          label: 'Достижения',
          icon: Trophy,
          path: '/achievements',
          badge: '3',
          description: 'Ваши награды и достижения'
        },
        {
          id: 'gamification',
          label: 'Геймификация',
          icon: Target,
          path: '/gamification',
          badge: 'new',
          description: 'Задания, серии и награды'
        }
      ]
    },
    {
      id: 'profile',
      label: 'Профиль',
      icon: User,
      path: '/profile',
      badge: null,
      description: 'Настройки профиля и аккаунта'
    }
  ]

  const toggleGroup = (groupId) => {
    setExpandedGroups(prev => 
      prev.includes(groupId) 
        ? prev.filter(id => id !== groupId)
        : [...prev, groupId]
    )
  }

  const isActive = (path) => {
    if (!path) return false
    return location.pathname === path
  }

  const isGroupActive = (group) => {
    if (group.path) return isActive(group.path)
    return group.children?.some(child => isActive(child.path)) || false
  }

  const renderNavItem = (item, level = 0) => {
    const Icon = item.icon
    const active = isActive(item.path)
    const isGroup = !!item.children
    
    if (isGroup) {
      const groupActive = isGroupActive(item)
      const isExpanded = expandedGroups.includes(item.id)
      
      return (
        <div key={item.id} className="mb-2">
          <button
            onClick={() => toggleGroup(item.id)}
            className={cn(
              'w-full flex items-center justify-between px-4 py-3 rounded-xl transition-all duration-200 group',
              'hover:bg-primary-50 dark:hover:bg-primary-900/20',
              groupActive && 'bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300',
              !groupActive && 'text-secondary-600 dark:text-secondary-400 hover:text-primary-600 dark:hover:text-primary-400'
            )}
          >
            <div className="flex items-center space-x-3">
              <Icon className={cn(
                'w-5 h-5 transition-colors',
                groupActive && 'text-primary-600 dark:text-primary-400',
                !groupActive && 'text-secondary-500 dark:text-secondary-500 group-hover:text-primary-500'
              )} />
              <div className="text-left">
                <div className="font-semibold text-sm">{item.label}</div>
                <div className="text-xs text-secondary-500 dark:text-secondary-400">
                  {item.description}
                </div>
              </div>
            </div>
            {isExpanded ? (
              <ChevronDown className="w-4 h-4 text-secondary-400" />
            ) : (
              <ChevronRight className="w-4 h-4 text-secondary-400" />
            )}
          </button>
          
          {isExpanded && (
            <div className="ml-6 mt-2 space-y-1 animate-slide-down">
              {item.children.map(child => renderNavItem(child, level + 1))}
            </div>
          )}
        </div>
      )
    }

    return (
      <Link
        key={item.id}
        to={item.path}
        className={cn(
          'flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-200 group relative',
          'hover:bg-primary-50 dark:hover:bg-primary-900/20',
          level > 0 && 'ml-4',
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
        <div className="flex-1">
          <div className="flex items-center justify-between">
            <span className="font-medium text-sm">{item.label}</span>
            {item.badge && (
              <span className={cn(
                'px-2 py-1 text-xs font-bold rounded-full',
                item.badge === 'new' 
                  ? 'bg-accent-success-100 text-accent-success-700 dark:bg-accent-success-900 dark:text-accent-success-300'
                  : 'bg-primary-100 text-primary-700 dark:bg-primary-900 dark:text-primary-300'
              )}>
                {item.badge}
              </span>
            )}
          </div>
          <div className="text-xs text-secondary-500 dark:text-secondary-400 mt-1">
            {item.description}
          </div>
        </div>
        {active && (
          <div className="absolute right-2 w-2 h-2 bg-primary-500 rounded-full" />
        )}
      </Link>
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
            <h2 className="text-xl font-bold text-primary">English Assistant</h2>
            <button
              onClick={onClose}
              className="p-2 rounded-lg hover:bg-secondary-100 dark:hover:bg-secondary-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
          
          <div className="p-6 overflow-y-auto h-full">
            {navigationStructure.map(item => renderNavItem(item))}
          </div>
        </div>
      </div>
    )
  }

  if (variant === 'topbar') {
    return (
      <nav className={cn('flex items-center space-x-1', className)}>
        {navigationStructure.map(group => 
          group.children ? 
            group.children.map(item => renderNavItem(item)) :
            renderNavItem(group)
        )}
      </nav>
    )
  }

  // Sidebar variant (default)
  return (
    <nav className={cn(
      'w-80 bg-white/95 dark:bg-secondary-900/95 backdrop-blur-xl',
      'shadow-2xl border-r border-secondary-200/50 dark:border-secondary-700/50',
      'h-full overflow-y-auto',
      className
    )}>
      <div className="p-6">
        <div className="mb-8">
          <div className="flex items-center space-x-3 mb-4">
            <div className="w-10 h-10 bg-gradient-to-br from-primary-500 to-primary-600 rounded-xl flex items-center justify-center shadow-lg">
              <GraduationCap className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-primary">English Assistant</h2>
              <p className="text-xs text-secondary-500">Powered by GigaChat AI</p>
            </div>
          </div>
          <div className="w-16 h-1 bg-gradient-to-r from-primary-500 to-accent-success-500 rounded-full"></div>
        </div>
        
        <div className="space-y-2">
          {navigationStructure.map(item => renderNavItem(item))}
        </div>
      </div>
    </nav>
  )
}

export default DuolingoNavigation


