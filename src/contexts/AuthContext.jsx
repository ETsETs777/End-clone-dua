import React, { createContext, useContext, useState, useEffect } from 'react'
import toast from 'react-hot-toast'

const AuthContext = createContext()

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  // Load user from localStorage on mount
  useEffect(() => {
    const loadUser = () => {
      try {
        const savedUser = localStorage.getItem('auth_user')
        if (savedUser) {
          const userData = JSON.parse(savedUser)
          setUser(userData)
          setIsAuthenticated(true)
        }
      } catch (error) {
        console.error('Error loading user:', error)
        localStorage.removeItem('auth_user')
      } finally {
        setIsLoading(false)
      }
    }

    loadUser()
  }, [])

  // Save user to localStorage whenever it changes
  useEffect(() => {
    if (user) {
      localStorage.setItem('auth_user', JSON.stringify(user))
    } else {
      localStorage.removeItem('auth_user')
    }
  }, [user])

  const login = async (email, password) => {
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000))

      // Demo credentials
      if (email === 'demo@example.com' || email.length > 3) {
        const userData = {
          id: Date.now(),
          name: email.split('@')[0],
          email: email,
          avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(email.split('@')[0])}&background=3b82f6&color=fff&size=128`,
          level: 'Beginner',
          xp: 0,
          streak: 0,
          joinedAt: new Date().toISOString()
        }

        setUser(userData)
        setIsAuthenticated(true)
        toast.success(`Добро пожаловать, ${userData.name}!`)
        return { success: true, user: userData }
      } else {
        throw new Error('Неверный email или пароль')
      }
    } catch (error) {
      toast.error(error.message)
      return { success: false, error: error.message }
    }
  }

  const register = async (name, email, password) => {
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000))

      if (name.length < 2) {
        throw new Error('Имя должно быть не менее 2 символов')
      }

      if (email.length < 5 || !email.includes('@')) {
        throw new Error('Введите корректный email')
      }

      if (password.length < 6) {
        throw new Error('Пароль должен быть не менее 6 символов')
      }

      const userData = {
        id: Date.now(),
        name: name,
        email: email,
        avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=3b82f6&color=fff&size=128`,
        level: 'Beginner',
        xp: 0,
        streak: 0,
        joinedAt: new Date().toISOString()
      }

      setUser(userData)
      setIsAuthenticated(true)
      toast.success(`Аккаунт создан! Добро пожаловать, ${name}!`)
      return { success: true, user: userData }
    } catch (error) {
      toast.error(error.message)
      return { success: false, error: error.message }
    }
  }

  const logout = () => {
    setUser(null)
    setIsAuthenticated(false)
    localStorage.removeItem('auth_user')
    toast.success('Вы успешно вышли из системы')
  }

  const updateUser = (updates) => {
    setUser(prev => ({ ...prev, ...updates }))
  }

  const addXP = (amount) => {
    setUser(prev => ({
      ...prev,
      xp: (prev?.xp || 0) + amount
    }))
    toast.success(`+${amount} XP!`, { icon: '⭐' })
  }

  const updateStreak = () => {
    const lastActive = localStorage.getItem('last_active_date')
    const today = new Date().toDateString()
    
    if (lastActive !== today) {
      const yesterday = new Date()
      yesterday.setDate(yesterday.getDate() - 1)
      
      if (lastActive === yesterday.toDateString()) {
        // Continue streak
        setUser(prev => ({
          ...prev,
          streak: (prev?.streak || 0) + 1
        }))
        toast.success('Серия продолжается! 🔥', { duration: 3000 })
      } else if (lastActive) {
        // Reset streak
        setUser(prev => ({
          ...prev,
          streak: 1
        }))
        toast('Новая серия началась!', { icon: '🔄' })
      } else {
        // First streak
        setUser(prev => ({
          ...prev,
          streak: 1
        }))
      }
      
      localStorage.setItem('last_active_date', today)
    }
  }

  const value = {
    user,
    isAuthenticated,
    isLoading,
    login,
    register,
    logout,
    updateUser,
    addXP,
    updateStreak
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export default AuthContext


