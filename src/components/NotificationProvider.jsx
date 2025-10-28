import React, { createContext, useContext, useState, useCallback } from 'react'
import Notification from './Notification'

const NotificationContext = createContext()

export const useNotifications = () => {
  const context = useContext(NotificationContext)
  if (!context) {
    throw new Error('useNotifications must be used within a NotificationProvider')
  }
  return context
}

export const NotificationProvider = ({ children }) => {
  const [notifications, setNotifications] = useState([])

  const addNotification = useCallback((notification) => {
    const id = Date.now() + Math.random()
    const newNotification = {
      id,
      type: 'info',
      duration: 5000,
      ...notification
    }
    
    setNotifications(prev => [...prev, newNotification])
    return id
  }, [])

  const removeNotification = useCallback((id) => {
    setNotifications(prev => prev.filter(notification => notification.id !== id))
  }, [])

  const clearAll = useCallback(() => {
    setNotifications([])
  }, [])

  // Удобные методы для разных типов уведомлений
  const success = useCallback((title, message, duration) => {
    return addNotification({ type: 'success', title, message, duration })
  }, [addNotification])

  const error = useCallback((title, message, duration) => {
    return addNotification({ type: 'error', title, message, duration })
  }, [addNotification])

  const warning = useCallback((title, message, duration) => {
    return addNotification({ type: 'warning', title, message, duration })
  }, [addNotification])

  const info = useCallback((title, message, duration) => {
    return addNotification({ type: 'info', title, message, duration })
  }, [addNotification])

  const value = {
    notifications,
    addNotification,
    removeNotification,
    clearAll,
    success,
    error,
    warning,
    info
  }

  return (
    <NotificationContext.Provider value={value}>
      {children}
      
      {/* Notification Container */}
      <div className="fixed top-4 right-4 z-50 space-y-2">
        {notifications.map(notification => (
          <Notification
            key={notification.id}
            {...notification}
            onClose={removeNotification}
          />
        ))}
      </div>
    </NotificationContext.Provider>
  )
}

export default NotificationProvider

