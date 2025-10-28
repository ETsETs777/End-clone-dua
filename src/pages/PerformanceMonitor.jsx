import React, { useState, useEffect } from 'react'
import { 
  Activity, 
  Zap, 
  Clock, 
  TrendingUp, 
  AlertTriangle,
  CheckCircle,
  BarChart3,
  Cpu,
  HardDrive,
  Wifi,
  Monitor
} from 'lucide-react'
import { PerformanceUtils, ErrorHandler } from '../utils/security'

const PerformanceMonitor = () => {
  const [metrics, setMetrics] = useState({
    loadTime: 0,
    memoryUsage: 0,
    networkLatency: 0,
    renderTime: 0,
    errorCount: 0,
    cacheHitRate: 0,
    activeConnections: 0
  })

  const [isMonitoring, setIsMonitoring] = useState(false)
  const [alerts, setAlerts] = useState([])

  useEffect(() => {
    if (isMonitoring) {
      const interval = setInterval(collectMetrics, 2000)
      return () => clearInterval(interval)
    }
  }, [isMonitoring])

  const collectMetrics = () => {
    // Simulate collecting real metrics
    const newMetrics = {
      loadTime: Math.random() * 2000 + 500, // 500-2500ms
      memoryUsage: Math.random() * 100, // 0-100%
      networkLatency: Math.random() * 200 + 50, // 50-250ms
      renderTime: Math.random() * 100 + 10, // 10-110ms
      errorCount: Math.floor(Math.random() * 5), // 0-4 errors
      cacheHitRate: Math.random() * 100, // 0-100%
      activeConnections: Math.floor(Math.random() * 10) // 0-9 connections
    }

    setMetrics(newMetrics)
    checkAlerts(newMetrics)
  }

  const checkAlerts = (currentMetrics) => {
    const newAlerts = []

    if (currentMetrics.loadTime > 2000) {
      newAlerts.push({
        type: 'warning',
        message: 'Медленная загрузка страницы',
        value: `${Math.round(currentMetrics.loadTime)}ms`
      })
    }

    if (currentMetrics.memoryUsage > 80) {
      newAlerts.push({
        type: 'error',
        message: 'Высокое использование памяти',
        value: `${Math.round(currentMetrics.memoryUsage)}%`
      })
    }

    if (currentMetrics.networkLatency > 200) {
      newAlerts.push({
        type: 'warning',
        message: 'Высокая задержка сети',
        value: `${Math.round(currentMetrics.networkLatency)}ms`
      })
    }

    if (currentMetrics.errorCount > 2) {
      newAlerts.push({
        type: 'error',
        message: 'Много ошибок',
        value: `${currentMetrics.errorCount} ошибок`
      })
    }

    setAlerts(newAlerts)
  }

  const getStatusColor = (value, thresholds) => {
    if (value <= thresholds.good) return 'text-green-600 dark:text-green-400'
    if (value <= thresholds.warning) return 'text-yellow-600 dark:text-yellow-400'
    return 'text-red-600 dark:text-red-400'
  }

  const getStatusIcon = (value, thresholds) => {
    if (value <= thresholds.good) return CheckCircle
    if (value <= thresholds.warning) return AlertTriangle
    return AlertTriangle
  }

  const performanceMetrics = [
    {
      key: 'loadTime',
      label: 'Время загрузки',
      value: `${Math.round(metrics.loadTime)}ms`,
      icon: Clock,
      thresholds: { good: 1000, warning: 2000 },
      color: 'from-blue-500 to-blue-600'
    },
    {
      key: 'memoryUsage',
      label: 'Использование памяти',
      value: `${Math.round(metrics.memoryUsage)}%`,
      icon: HardDrive,
      thresholds: { good: 60, warning: 80 },
      color: 'from-green-500 to-green-600'
    },
    {
      key: 'networkLatency',
      label: 'Задержка сети',
      value: `${Math.round(metrics.networkLatency)}ms`,
      icon: Wifi,
      thresholds: { good: 100, warning: 200 },
      color: 'from-purple-500 to-purple-600'
    },
    {
      key: 'renderTime',
      label: 'Время рендеринга',
      value: `${Math.round(metrics.renderTime)}ms`,
      icon: Monitor,
      thresholds: { good: 50, warning: 100 },
      color: 'from-orange-500 to-orange-600'
    },
    {
      key: 'errorCount',
      label: 'Количество ошибок',
      value: `${metrics.errorCount}`,
      icon: AlertTriangle,
      thresholds: { good: 0, warning: 2 },
      color: 'from-red-500 to-red-600'
    },
    {
      key: 'cacheHitRate',
      label: 'Эффективность кэша',
      value: `${Math.round(metrics.cacheHitRate)}%`,
      icon: Zap,
      thresholds: { good: 80, warning: 60 },
      color: 'from-indigo-500 to-indigo-600'
    }
  ]

  const startMonitoring = () => {
    setIsMonitoring(true)
    PerformanceUtils.monitorWebVitals()
  }

  const stopMonitoring = () => {
    setIsMonitoring(false)
  }

  const clearAlerts = () => {
    setAlerts([])
  }

  return (
    <div className="max-w-6xl mx-auto space-y-6 animate-fade-in">
      {/* Header */}
      <div className="text-center">
        <h1 className="text-3xl font-bold text-primary mb-2">Мониторинг производительности</h1>
        <p className="text-secondary">Отслеживайте производительность приложения в реальном времени</p>
      </div>

      {/* Control Panel */}
      <div className="card-premium">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className={`w-3 h-3 rounded-full ${isMonitoring ? 'bg-green-500 animate-pulse' : 'bg-gray-400'}`}></div>
            <span className="font-semibold text-primary">
              {isMonitoring ? 'Мониторинг активен' : 'Мониторинг остановлен'}
            </span>
          </div>
          
          <div className="flex space-x-3">
            <button
              onClick={startMonitoring}
              disabled={isMonitoring}
              className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
            >
              <Activity className="w-4 h-4" />
              <span>Запустить</span>
            </button>
            
            <button
              onClick={stopMonitoring}
              disabled={!isMonitoring}
              className="btn-secondary disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
            >
              <Clock className="w-4 h-4" />
              <span>Остановить</span>
            </button>
          </div>
        </div>
      </div>

      {/* Performance Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {performanceMetrics.map((metric) => {
          const Icon = metric.icon
          const StatusIcon = getStatusIcon(metrics[metric.key], metric.thresholds)
          const statusColor = getStatusColor(metrics[metric.key], metric.thresholds)
          
          return (
            <div key={metric.key} className="card-premium">
              <div className="flex items-center justify-between mb-4">
                <div className={`flex items-center justify-center w-12 h-12 bg-gradient-to-r ${metric.color} rounded-xl`}>
                  <Icon className="w-6 h-6 text-white" />
                </div>
                <StatusIcon className={`w-6 h-6 ${statusColor}`} />
              </div>
              
              <div>
                <h3 className="text-lg font-semibold text-primary mb-1">{metric.label}</h3>
                <div className="text-2xl font-bold text-primary mb-2">{metric.value}</div>
                
                {/* Progress Bar */}
                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                  <div
                    className={`h-2 rounded-full transition-all duration-500 ${
                      metrics[metric.key] <= metric.thresholds.good
                        ? 'bg-green-500'
                        : metrics[metric.key] <= metric.thresholds.warning
                        ? 'bg-yellow-500'
                        : 'bg-red-500'
                    }`}
                    style={{ 
                      width: `${Math.min((metrics[metric.key] / (metric.thresholds.warning * 1.5)) * 100, 100)}%` 
                    }}
                  ></div>
                </div>
              </div>
            </div>
          )
        })}
      </div>

      {/* Alerts */}
      {alerts.length > 0 && (
        <div className="card-premium">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xl font-semibold text-primary flex items-center space-x-2">
              <AlertTriangle className="w-5 h-5 text-yellow-600 dark:text-yellow-400" />
              <span>Предупреждения</span>
            </h3>
            <button
              onClick={clearAlerts}
              className="btn-secondary text-sm"
            >
              Очистить
            </button>
          </div>
          
          <div className="space-y-3">
            {alerts.map((alert, index) => (
              <div
                key={index}
                className={`p-4 rounded-xl border-l-4 ${
                  alert.type === 'error'
                    ? 'bg-red-50 dark:bg-red-900 border-red-500'
                    : 'bg-yellow-50 dark:bg-yellow-900 border-yellow-500'
                }`}
              >
                <div className="flex items-center space-x-3">
                  <AlertTriangle className={`w-5 h-5 ${
                    alert.type === 'error'
                      ? 'text-red-600 dark:text-red-400'
                      : 'text-yellow-600 dark:text-yellow-400'
                  }`} />
                  <div>
                    <p className="font-semibold text-primary">{alert.message}</p>
                    <p className="text-sm text-secondary">Текущее значение: {alert.value}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Performance Tips */}
      <div className="card bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900 dark:to-indigo-900 border-blue-200 dark:border-blue-700">
        <div className="flex items-start space-x-3">
          <BarChart3 className="w-6 h-6 text-blue-600 dark:text-blue-400 mt-1" />
          <div>
            <h3 className="text-lg font-semibold text-primary mb-2">Рекомендации по оптимизации</h3>
            <ul className="space-y-2 text-secondary">
              <li className="flex items-start space-x-2">
                <Cpu className="w-4 h-4 text-blue-500 mt-1" />
                <span>Используйте ленивую загрузку для изображений и компонентов</span>
              </li>
              <li className="flex items-start space-x-2">
                <Cpu className="w-4 h-4 text-blue-500 mt-1" />
                <span>Кэшируйте часто используемые данные</span>
              </li>
              <li className="flex items-start space-x-2">
                <Cpu className="w-4 h-4 text-blue-500 mt-1" />
                <span>Оптимизируйте размеры изображений</span>
              </li>
              <li className="flex items-start space-x-2">
                <Cpu className="w-4 h-4 text-blue-500 mt-1" />
                <span>Используйте дебаунсинг для частых событий</span>
              </li>
              <li className="flex items-start space-x-2">
                <Cpu className="w-4 h-4 text-blue-500 mt-1" />
                <span>Минимизируйте количество ре-рендеров</span>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* System Information */}
      <div className="card-premium">
        <h3 className="text-xl font-semibold text-primary mb-4 flex items-center space-x-2">
          <Monitor className="w-5 h-5 text-blue-600 dark:text-blue-400" />
          <span>Информация о системе</span>
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h4 className="font-semibold text-primary mb-3">Браузер</h4>
            <div className="space-y-2 text-secondary">
              <div>User Agent: {navigator.userAgent.substring(0, 50)}...</div>
              <div>Язык: {navigator.language}</div>
              <div>Платформа: {navigator.platform}</div>
              <div>Онлайн: {navigator.onLine ? 'Да' : 'Нет'}</div>
            </div>
          </div>
          
          <div>
            <h4 className="font-semibold text-primary mb-3">Производительность</h4>
            <div className="space-y-2 text-secondary">
              <div>Ядер процессора: {navigator.hardwareConcurrency || 'Неизвестно'}</div>
              <div>Память устройства: {navigator.deviceMemory ? `${navigator.deviceMemory}GB` : 'Неизвестно'}</div>
              <div>Соединение: {navigator.connection ? navigator.connection.effectiveType : 'Неизвестно'}</div>
              <div>Время загрузки страницы: {Math.round(performance.timing.loadEventEnd - performance.timing.navigationStart)}ms</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default PerformanceMonitor


