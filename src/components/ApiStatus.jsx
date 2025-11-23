import React, { useState, useEffect } from 'react'
import { Wifi, WifiOff, AlertCircle, CheckCircle, RefreshCw, Settings } from 'lucide-react'
import gigachatService from '../services/gigachatService'
import toast from 'react-hot-toast'

const ApiStatus = () => {
  const [status, setStatus] = useState(null)
  const [isChecking, setIsChecking] = useState(false)
  const [showDetails, setShowDetails] = useState(false)

  useEffect(() => {
    checkStatus()
  }, [])

  const checkStatus = async () => {
    setIsChecking(true)
    try {
      const apiStatus = gigachatService.getApiStatus()
      setStatus(apiStatus)

      // Try to authenticate if configured but not authenticated
      if (apiStatus.configured && !apiStatus.authenticated) {
        try {
          await gigachatService.authenticate()
          const updatedStatus = gigachatService.getApiStatus()
          setStatus(updatedStatus)
          if (updatedStatus.authenticated) {
            toast.success('✅ Подключено к GigaChat API!')
          }
        } catch (error) {
          toast.error('Ошибка подключения к API. Используется демо-режим.')
        }
      }
    } catch (error) {
      console.error('Status check error:', error)
    } finally {
      setIsChecking(false)
    }
  }

  const getStatusColor = () => {
    if (!status) return 'gray'
    if (status.mode === 'Demo') return 'yellow'
    if (status.authenticated && status.tokenValid) return 'green'
    if (status.configured) return 'yellow'
    return 'red'
  }

  const getStatusIcon = () => {
    const color = getStatusColor()
    const className = "w-5 h-5"

    if (isChecking) {
      return <RefreshCw className={`${className} animate-spin`} />
    }

    switch (color) {
      case 'green':
        return <CheckCircle className={`${className} text-green-600`} />
      case 'yellow':
        return <AlertCircle className={`${className} text-yellow-600`} />
      case 'red':
        return <WifiOff className={`${className} text-red-600`} />
      default:
        return <Wifi className={className} />
    }
  }

  const getStatusText = () => {
    if (!status) return 'Проверка...'
    
    if (status.mode === 'Demo') {
      return 'Демо-режим'
    }
    
    if (status.authenticated && status.tokenValid) {
      return 'Подключено к GigaChat'
    }
    
    if (status.configured) {
      return 'Настроено, требуется авторизация'
    }
    
    return 'Не настроено'
  }

  const getStatusDescription = () => {
    if (!status) return ''
    
    if (status.mode === 'Demo') {
      return 'API не настроен. Используются демо-ответы. Создайте .env файл с учетными данными GigaChat для полноценной работы.'
    }
    
    if (status.authenticated && status.tokenValid) {
      return 'Приложение подключено к настоящему GigaChat API. Все запросы обрабатываются нейросетью.'
    }
    
    if (status.configured) {
      return 'API настроен, но требуется авторизация. Попробуйте обновить статус.'
    }
    
    return 'Необходимо настроить учетные данные API в .env файле.'
  }

  if (!showDetails) {
    return (
      <button
        onClick={() => setShowDetails(true)}
        className="fixed bottom-4 right-4 z-50 flex items-center space-x-2 px-4 py-2 bg-white dark:bg-gray-800 border-2 border-gray-200 dark:border-gray-700 rounded-xl shadow-lg hover:shadow-xl transition-all duration-200"
      >
        {getStatusIcon()}
        <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
          {getStatusText()}
        </span>
      </button>
    )
  }

  return (
    <div className="fixed bottom-4 right-4 z-50 w-96 bg-white dark:bg-gray-800 border-2 border-gray-200 dark:border-gray-700 rounded-2xl shadow-2xl animate-slide-up">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center space-x-2">
          {getStatusIcon()}
          <h3 className="text-lg font-bold text-gray-900 dark:text-white">
            Статус API
          </h3>
        </div>
        <button
          onClick={() => setShowDetails(false)}
          className="text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
        >
          ✕
        </button>
      </div>

      {/* Status Details */}
      <div className="p-4 space-y-4">
        {/* Main Status */}
        <div className={`p-4 rounded-xl ${
          getStatusColor() === 'green' ? 'bg-green-50 dark:bg-green-900/20 border-2 border-green-200 dark:border-green-800' :
          getStatusColor() === 'yellow' ? 'bg-yellow-50 dark:bg-yellow-900/20 border-2 border-yellow-200 dark:border-yellow-800' :
          'bg-red-50 dark:bg-red-900/20 border-2 border-red-200 dark:border-red-800'
        }`}>
          <div className="font-semibold text-gray-900 dark:text-white mb-2">
            {getStatusText()}
          </div>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            {getStatusDescription()}
          </p>
        </div>

        {/* Details */}
        {status && (
          <div className="space-y-2 text-sm">
            <div className="flex justify-between p-2 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
              <span className="text-gray-600 dark:text-gray-400">Режим:</span>
              <span className="font-semibold text-gray-900 dark:text-white">
                {status.mode}
              </span>
            </div>
            <div className="flex justify-between p-2 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
              <span className="text-gray-600 dark:text-gray-400">Настроено:</span>
              <span className={`font-semibold ${status.configured ? 'text-green-600' : 'text-red-600'}`}>
                {status.configured ? 'Да ✓' : 'Нет ✗'}
              </span>
            </div>
            {status.configured && (
              <>
                <div className="flex justify-between p-2 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                  <span className="text-gray-600 dark:text-gray-400">Авторизовано:</span>
                  <span className={`font-semibold ${status.authenticated ? 'text-green-600' : 'text-red-600'}`}>
                    {status.authenticated ? 'Да ✓' : 'Нет ✗'}
                  </span>
                </div>
                {status.authenticated && (
                  <div className="flex justify-between p-2 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                    <span className="text-gray-600 dark:text-gray-400">Токен действителен:</span>
                    <span className={`font-semibold ${status.tokenValid ? 'text-green-600' : 'text-yellow-600'}`}>
                      {status.tokenValid ? 'Да ✓' : 'Истекает'}
                    </span>
                  </div>
                )}
              </>
            )}
          </div>
        )}

        {/* Actions */}
        <div className="flex space-x-2">
          <button
            onClick={checkStatus}
            disabled={isChecking}
            className="flex-1 flex items-center justify-center space-x-2 py-2 px-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <RefreshCw className={`w-4 h-4 ${isChecking ? 'animate-spin' : ''}`} />
            <span>{isChecking ? 'Проверка...' : 'Обновить'}</span>
          </button>
        </div>

        {/* Setup Instructions */}
        {status && !status.configured && (
          <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
            <div className="flex items-start space-x-2">
              <Settings className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
              <div className="text-xs text-gray-600 dark:text-gray-400">
                <p className="font-semibold mb-2">Как настроить API:</p>
                <ol className="list-decimal list-inside space-y-1">
                  <li>Создайте файл <code className="bg-gray-200 dark:bg-gray-700 px-1 rounded">.env</code> в корне проекта</li>
                  <li>Добавьте учетные данные GigaChat</li>
                  <li>Перезапустите сервер разработки</li>
                  <li>Обновите статус</li>
                </ol>
                <p className="mt-2 text-xs">
                  См. <code className="bg-gray-200 dark:bg-gray-700 px-1 rounded">env.example</code> для примера
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default ApiStatus


