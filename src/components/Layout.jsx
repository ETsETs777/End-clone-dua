import React, { useState, useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'
import useKeyboardShortcuts from '../hooks/useKeyboardShortcuts.jsx'
import ApiStatus from './ApiStatus'
import { 
  Brain,
  Sun,
  Moon,
  User,
  LogOut,
  LogIn,
  Menu,
  Bell,
  Search,
  MessageCircle, 
  BookOpen, 
  Brain as BrainIcon,
  X
} from 'lucide-react'
import { useAuth } from '../contexts/AuthContext'
import AuthModal from './AuthModal'
import UserProgress from './UserProgress'
import TopWidgets from './TopWidgets'
import DuolingoNavigation from './ui/DuolingoNavigation'
import Button from './ui/Button'
import Badge from './ui/Badge'
import { ResponsiveContainer, ResponsiveVisibility, ResponsiveSpacing, useBreakpoint } from './ui/Responsive'

const Layout = ({ children }) => {
  const location = useLocation()
  const [isDarkMode, setIsDarkMode] = useState(false)
  const [showAuthModal, setShowAuthModal] = useState(false)
  const [showUserMenu, setShowUserMenu] = useState(false)
  const [showMobileNav, setShowMobileNav] = useState(false)
  const { user, logout, isAuthenticated } = useAuth()
  
  // Enable keyboard shortcuts
  useKeyboardShortcuts(true)

  useEffect(() => {
    const savedTheme = localStorage.getItem('theme')
    if (savedTheme === 'dark') {
      setIsDarkMode(true)
      document.documentElement.classList.add('dark')
      document.documentElement.setAttribute('data-theme', 'dark')
    } else {
      setIsDarkMode(false)
      document.documentElement.classList.remove('dark')
      document.documentElement.setAttribute('data-theme', 'light')
    }
  }, [])

  const toggleTheme = () => {
    setIsDarkMode(prevMode => {
      const newMode = !prevMode
      if (newMode) {
        document.documentElement.classList.add('dark')
        document.documentElement.setAttribute('data-theme', 'dark')
        localStorage.setItem('theme', 'dark')
      } else {
        document.documentElement.classList.remove('dark')
        document.documentElement.setAttribute('data-theme', 'light')
        localStorage.setItem('theme', 'light')
      }
      return newMode
    })
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 transition-colors duration-500">
      {/* Header */}
      <header className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl shadow-2xl border-b border-gray-200/50 dark:border-gray-700/50 transition-all duration-500 sticky top-0 z-50">
        <ResponsiveContainer maxWidth="7xl" padding={true}>
          <div className="flex justify-between items-center h-16 md:h-20 lg:h-24">
            {/* Logo Section */}
            <div className="flex items-center space-x-6">
              {/* Mobile Menu Button */}
              <button
                onClick={() => setShowMobileNav(true)}
                className="lg:hidden p-2 rounded-xl bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 transition-all duration-200"
              >
                <Menu className="w-6 h-6 text-gray-600 dark:text-gray-300" />
              </button>
              
              <div className="flex items-center justify-center w-16 h-16 bg-gradient-to-br from-blue-600 via-purple-600 to-indigo-600 rounded-3xl shadow-2xl animate-pulse-slow">
                <Brain className="w-8 h-8 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent">
                  English Assistant
                </h1>
                <p className="text-sm text-gray-600 dark:text-gray-400 font-medium">
                  Powered by GigaChat AI
                </p>
              </div>
            </div>
            
                {/* Desktop Navigation */}
                <ResponsiveVisibility show={{ sm: false, md: false, lg: true }}>
                  <div className="flex items-center space-x-4">
                    <DuolingoNavigation variant="topbar" />
                  </div>
                </ResponsiveVisibility>

            {/* Top Action Buttons */}
            <div className="flex items-center space-x-2 md:space-x-4">
              {/* Quick Action Buttons */}
              <ResponsiveVisibility show={{ sm: false, md: true, lg: true }}>
                <div className="flex items-center space-x-2 md:space-x-3">
                  <Button
                    variant="primary"
                    size="sm"
                    leftIcon={<MessageCircle className="w-4 h-4" />}
                    asChild
                  >
                    <Link to="/chat">Чат с ИИ</Link>
                  </Button>
                  
                  <Button
                    variant="success"
                    size="sm"
                    leftIcon={<BrainIcon className="w-4 h-4" />}
                    asChild
                  >
                    <Link to="/exercises">Упражнения</Link>
                  </Button>
                  
                  <Button
                    variant="warning"
                    size="sm"
                    leftIcon={<BookOpen className="w-4 h-4" />}
                    asChild
                  >
                    <Link to="/vocabulary">Словарь</Link>
                  </Button>
                </div>
              </ResponsiveVisibility>

              {/* Notifications */}
              <button className="relative p-3 rounded-2xl bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 transition-all duration-200">
                <Bell className="w-5 h-5 text-gray-600 dark:text-gray-300" />
                <Badge variant="error" size="sm" className="absolute -top-1 -right-1">
                  3
                </Badge>
              </button>

              {/* User Section */}
              <div className="flex items-center space-x-4 pl-4 border-l border-gray-200 dark:border-gray-700">
                <div className="text-sm text-gray-600 dark:text-gray-300 font-medium">
                  {isAuthenticated ? `Привет, ${user?.name}!` : 'Добро пожаловать!'}
                </div>

                {/* Theme Toggle */}
                <button
                  onClick={toggleTheme}
                  className="p-3 rounded-2xl bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-300 dark:hover:bg-gray-600 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-110"
                  title={isDarkMode ? 'Переключить на светлую тему' : 'Переключить на темную тему'}
                >
                  {isDarkMode ? (
                    <Sun className="w-6 h-6 text-yellow-500" />
                  ) : (
                    <Moon className="w-6 h-6 text-gray-600 dark:text-gray-300" />
                  )}
                </button>

                {/* User Menu */}
                <div className="relative">
                  {isAuthenticated ? (
                    <>
                      <button
                        onClick={() => setShowUserMenu(!showUserMenu)}
                        className="flex items-center space-x-3 p-3 rounded-2xl bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-300 dark:hover:bg-gray-600 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-110"
                      >
                        <img
                          src={user?.avatar}
                          alt={user?.name}
                          className="w-8 h-8 rounded-xl border-2 border-white dark:border-gray-600"
                        />
                        <User className="w-5 h-5 text-gray-600 dark:text-gray-300" />
                      </button>

                      {/* User Dropdown */}
                      {showUserMenu && (
                        <div className="absolute right-0 mt-3 w-64 bg-white/95 dark:bg-gray-800/95 backdrop-blur-xl rounded-3xl shadow-2xl border border-gray-200/50 dark:border-gray-700/50 py-4 z-50 animate-slide-down">
                          <div className="px-6 py-4 border-b border-gray-200/50 dark:border-gray-700/50">
                            <p className="text-lg font-bold text-primary">{user?.name}</p>
                            <p className="text-sm text-secondary">{user?.email}</p>
                          </div>
                          <button
                            onClick={() => {
                              logout()
                              setShowUserMenu(false)
                            }}
                            className="w-full text-left px-6 py-4 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 flex items-center space-x-3 transition-all duration-200"
                          >
                            <LogOut className="w-5 h-5" />
                            <span className="font-medium">Выйти</span>
                          </button>
                        </div>
                      )}
                    </>
                  ) : (
                    <Button
                      variant="primary"
                      size="sm"
                      leftIcon={<LogIn className="w-4 h-4" />}
                      onClick={() => setShowAuthModal(true)}
                    >
                      Войти
                    </Button>
                  )}
                </div>
              </div>
            </div>
          </div>
        </ResponsiveContainer>
      </header>

      <div className="flex">
        {/* Desktop Sidebar */}
        <div className="hidden lg:block">
          <DuolingoNavigation variant="sidebar" />
        </div>

        {/* Mobile Navigation */}
        <DuolingoNavigation 
          variant="mobile" 
          isOpen={showMobileNav} 
          onClose={() => setShowMobileNav(false)} 
        />

        {/* Main Content */}
        <main className="flex-1">
          <ResponsiveContainer maxWidth="7xl" padding={true}>
            <ResponsiveSpacing padding={{ sm: 4, md: 6, lg: 8 }}>
              <TopWidgets />
              {children}
            </ResponsiveSpacing>
          </ResponsiveContainer>
        </main>
      </div>

      {/* Auth Modal */}
      <AuthModal
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
      />

      {/* API Status Indicator */}
      <ApiStatus />
    </div>
  )
}

export default Layout