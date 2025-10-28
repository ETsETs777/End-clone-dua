import React, { useState, useEffect, useMemo, useCallback } from 'react'
import { 
  Zap, 
  Database, 
  Image, 
  Code, 
  Network, 
  Cpu,
  HardDrive,
  Clock,
  CheckCircle,
  AlertTriangle,
  Settings,
  Play,
  Pause,
  RotateCcw
} from 'lucide-react'
import { PerformanceUtils, CacheManager } from '../utils/security'

const PerformanceOptimizer = () => {
  const [optimizations, setOptimizations] = useState({
    imageCompression: false,
    codeMinification: false,
    caching: false,
    lazyLoading: false,
    bundleSplitting: false,
    compression: false,
    preloading: false,
    serviceWorker: false
  })

  const [performanceMetrics, setPerformanceMetrics] = useState({
    bundleSize: 2.5, // MB
    loadTime: 1200, // ms
    memoryUsage: 45, // %
    cacheHitRate: 0, // %
    imageSize: 1.8, // MB
    networkRequests: 25
  })

  const [isOptimizing, setIsOptimizing] = useState(false)
  const [optimizationHistory, setOptimizationHistory] = useState([])

  const optimizationOptions = [
    {
      id: 'imageCompression',
      title: 'Сжатие изображений',
      description: 'Оптимизация размера изображений без потери качества',
      icon: Image,
      impact: 'high',
      estimatedSavings: '40%',
      color: 'from-blue-500 to-blue-600'
    },
    {
      id: 'codeMinification',
      title: 'Минификация кода',
      description: 'Удаление пробелов и комментариев из JavaScript и CSS',
      icon: Code,
      impact: 'medium',
      estimatedSavings: '25%',
      color: 'from-green-500 to-green-600'
    },
    {
      id: 'caching',
      title: 'Кэширование',
      description: 'Кэширование статических ресурсов и API ответов',
      icon: Database,
      impact: 'high',
      estimatedSavings: '60%',
      color: 'from-purple-500 to-purple-600'
    },
    {
      id: 'lazyLoading',
      title: 'Ленивая загрузка',
      description: 'Загрузка контента по мере необходимости',
      icon: Clock,
      impact: 'medium',
      estimatedSavings: '30%',
      color: 'from-orange-500 to-orange-600'
    },
    {
      id: 'bundleSplitting',
      title: 'Разделение бандла',
      description: 'Разделение кода на более мелкие части',
      icon: Network,
      impact: 'high',
      estimatedSavings: '35%',
      color: 'from-pink-500 to-pink-600'
    },
    {
      id: 'compression',
      title: 'Gzip сжатие',
      description: 'Сжатие текстовых файлов на сервере',
      icon: Zap,
      impact: 'medium',
      estimatedSavings: '50%',
      color: 'from-indigo-500 to-indigo-600'
    },
    {
      id: 'preloading',
      title: 'Предзагрузка',
      description: 'Предзагрузка критически важных ресурсов',
      icon: Play,
      impact: 'low',
      estimatedSavings: '15%',
      color: 'from-teal-500 to-teal-600'
    },
    {
      id: 'serviceWorker',
      title: 'Service Worker',
      description: 'Кэширование и офлайн функциональность',
      icon: Settings,
      impact: 'high',
      estimatedSavings: '70%',
      color: 'from-red-500 to-red-600'
    }
  ]

  const getImpactColor = (impact) => {
    switch (impact) {
      case 'high': return 'text-red-600 dark:text-red-400'
      case 'medium': return 'text-yellow-600 dark:text-yellow-400'
      case 'low': return 'text-green-600 dark:text-green-400'
      default: return 'text-gray-600 dark:text-gray-400'
    }
  }

  const getImpactLabel = (impact) => {
    switch (impact) {
      case 'high': return 'Высокий'
      case 'medium': return 'Средний'
      case 'low': return 'Низкий'
      default: return 'Неизвестно'
    }
  }

  const calculateOptimizationScore = useMemo(() => {
    const enabledCount = Object.values(optimizations).filter(Boolean).length
    const totalCount = Object.keys(optimizations).length
    return Math.round((enabledCount / totalCount) * 100)
  }, [optimizations])

  const calculatePerformanceGain = useMemo(() => {
    let totalGain = 0
    Object.entries(optimizations).forEach(([key, enabled]) => {
      if (enabled) {
        const option = optimizationOptions.find(opt => opt.id === key)
        if (option) {
          const savings = parseFloat(option.estimatedSavings.replace('%', ''))
          totalGain += savings
        }
      }
    })
    return Math.min(totalGain, 100)
  }, [optimizations])

  const toggleOptimization = useCallback((optimizationId) => {
    setOptimizations(prev => ({
      ...prev,
      [optimizationId]: !prev[optimizationId]
    }))
  }, [])

  const runOptimization = async () => {
    setIsOptimizing(true)
    
    // Simulate optimization process
    const steps = [
      'Анализ текущей производительности...',
      'Применение оптимизаций...',
      'Тестирование изменений...',
      'Обновление метрик...'
    ]

    for (let i = 0; i < steps.length; i++) {
      await new Promise(resolve => setTimeout(resolve, 1000))
      console.log(steps[i])
    }

    // Update metrics based on enabled optimizations
    const newMetrics = { ...performanceMetrics }
    
    if (optimizations.imageCompression) {
      newMetrics.imageSize *= 0.6
      newMetrics.loadTime *= 0.8
    }
    
    if (optimizations.codeMinification) {
      newMetrics.bundleSize *= 0.75
      newMetrics.loadTime *= 0.85
    }
    
    if (optimizations.caching) {
      newMetrics.cacheHitRate = 85
      newMetrics.loadTime *= 0.7
    }
    
    if (optimizations.lazyLoading) {
      newMetrics.loadTime *= 0.7
      newMetrics.memoryUsage *= 0.8
    }
    
    if (optimizations.bundleSplitting) {
      newMetrics.bundleSize *= 0.65
      newMetrics.loadTime *= 0.75
    }
    
    if (optimizations.compression) {
      newMetrics.bundleSize *= 0.5
      newMetrics.networkRequests *= 0.6
    }
    
    if (optimizations.preloading) {
      newMetrics.loadTime *= 0.85
    }
    
    if (optimizations.serviceWorker) {
      newMetrics.cacheHitRate = 95
      newMetrics.loadTime *= 0.6
    }

    setPerformanceMetrics(newMetrics)
    
    // Add to history
    const historyEntry = {
      timestamp: new Date().toISOString(),
      optimizations: { ...optimizations },
      metrics: newMetrics,
      score: calculateOptimizationScore
    }
    
    setOptimizationHistory(prev => [historyEntry, ...prev.slice(0, 9)])
    setIsOptimizing(false)
  }

  const resetOptimizations = () => {
    setOptimizations({
      imageCompression: false,
      codeMinification: false,
      caching: false,
      lazyLoading: false,
      bundleSplitting: false,
      compression: false,
      preloading: false,
      serviceWorker: false
    })
    
    setPerformanceMetrics({
      bundleSize: 2.5,
      loadTime: 1200,
      memoryUsage: 45,
      cacheHitRate: 0,
      imageSize: 1.8,
      networkRequests: 25
    })
  }

  const applyLazyLoading = () => {
    PerformanceUtils.lazyLoadImages()
    console.log('Lazy loading applied to images')
  }

  const clearCache = () => {
    CacheManager.clear()
    console.log('Cache cleared')
  }

  return (
    <div className="max-w-6xl mx-auto space-y-6 animate-fade-in">
      {/* Header */}
      <div className="text-center">
        <h1 className="text-3xl font-bold text-primary mb-2">Оптимизатор производительности</h1>
        <p className="text-secondary">Оптимизируйте производительность вашего приложения</p>
      </div>

      {/* Performance Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="card text-center">
          <div className="flex justify-center mb-3">
            <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900 rounded-lg flex items-center justify-center">
              <Cpu className="w-5 h-5 text-blue-600 dark:text-blue-400" />
            </div>
          </div>
          <div className="text-2xl font-bold text-primary">{calculateOptimizationScore}%</div>
          <div className="text-secondary">Уровень оптимизации</div>
        </div>
        
        <div className="card text-center">
          <div className="flex justify-center mb-3">
            <div className="w-10 h-10 bg-green-100 dark:bg-green-900 rounded-lg flex items-center justify-center">
              <Zap className="w-5 h-5 text-green-600 dark:text-green-400" />
            </div>
          </div>
          <div className="text-2xl font-bold text-primary">{calculatePerformanceGain}%</div>
          <div className="text-secondary">Прирост производительности</div>
        </div>
        
        <div className="card text-center">
          <div className="flex justify-center mb-3">
            <div className="w-10 h-10 bg-purple-100 dark:bg-purple-900 rounded-lg flex items-center justify-center">
              <Clock className="w-5 h-5 text-purple-600 dark:text-purple-400" />
            </div>
          </div>
          <div className="text-2xl font-bold text-primary">{Math.round(performanceMetrics.loadTime)}ms</div>
          <div className="text-secondary">Время загрузки</div>
        </div>
        
        <div className="card text-center">
          <div className="flex justify-center mb-3">
            <div className="w-10 h-10 bg-orange-100 dark:bg-orange-900 rounded-lg flex items-center justify-center">
              <HardDrive className="w-5 h-5 text-orange-600 dark:text-orange-400" />
            </div>
          </div>
          <div className="text-2xl font-bold text-primary">{performanceMetrics.bundleSize.toFixed(1)}MB</div>
          <div className="text-secondary">Размер бандла</div>
        </div>
      </div>

      {/* Optimization Options */}
      <div className="card-premium">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-semibold text-primary">Опции оптимизации</h3>
          <div className="flex space-x-3">
            <button
              onClick={resetOptimizations}
              className="btn-secondary flex items-center space-x-2"
            >
              <RotateCcw className="w-4 h-4" />
              <span>Сбросить</span>
            </button>
            
            <button
              onClick={runOptimization}
              disabled={isOptimizing}
              className="btn-primary flex items-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isOptimizing ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>Оптимизация...</span>
                </>
              ) : (
                <>
                  <Zap className="w-4 h-4" />
                  <span>Применить</span>
                </>
              )}
            </button>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {optimizationOptions.map((option) => {
            const Icon = option.icon
            const isEnabled = optimizations[option.id]
            
            return (
              <div
                key={option.id}
                className={`p-4 rounded-xl border-2 transition-all duration-200 cursor-pointer ${
                  isEnabled
                    ? 'border-blue-500 bg-blue-50 dark:bg-blue-900'
                    : 'border-gray-200 dark:border-gray-700 hover:border-blue-300 dark:hover:border-blue-600'
                }`}
                onClick={() => toggleOptimization(option.id)}
              >
                <div className="flex items-start space-x-3">
                  <div className={`flex items-center justify-center w-10 h-10 bg-gradient-to-r ${option.color} rounded-lg`}>
                    <Icon className="w-5 h-5 text-white" />
                  </div>
                  
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-semibold text-primary">{option.title}</h4>
                      <div className="flex items-center space-x-2">
                        <span className={`text-xs font-bold px-2 py-1 rounded-full ${getImpactColor(option.impact)}`}>
                          {getImpactLabel(option.impact)}
                        </span>
                        {isEnabled && <CheckCircle className="w-4 h-4 text-green-500" />}
                      </div>
                    </div>
                    
                    <p className="text-sm text-secondary mb-3">{option.description}</p>
                    
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-green-600 dark:text-green-400">
                        Экономия: {option.estimatedSavings}
                      </span>
                      <div className={`w-3 h-3 rounded-full ${isEnabled ? 'bg-green-500' : 'bg-gray-300 dark:bg-gray-600'}`} />
                    </div>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* Performance Metrics */}
      <div className="card-premium">
        <h3 className="text-xl font-semibold text-primary mb-6">Метрики производительности</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <h4 className="font-semibold text-primary mb-3">Размер ресурсов</h4>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-secondary">Бандл JavaScript</span>
                <span className="font-medium text-primary">{performanceMetrics.bundleSize.toFixed(1)} MB</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-secondary">Изображения</span>
                <span className="font-medium text-primary">{performanceMetrics.imageSize.toFixed(1)} MB</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-secondary">Всего</span>
                <span className="font-medium text-primary">{(performanceMetrics.bundleSize + performanceMetrics.imageSize).toFixed(1)} MB</span>
              </div>
            </div>
          </div>
          
          <div>
            <h4 className="font-semibold text-primary mb-3">Производительность</h4>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-secondary">Время загрузки</span>
                <span className="font-medium text-primary">{Math.round(performanceMetrics.loadTime)} ms</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-secondary">Использование памяти</span>
                <span className="font-medium text-primary">{Math.round(performanceMetrics.memoryUsage)}%</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-secondary">Эффективность кэша</span>
                <span className="font-medium text-primary">{Math.round(performanceMetrics.cacheHitRate)}%</span>
              </div>
            </div>
          </div>
          
          <div>
            <h4 className="font-semibold text-primary mb-3">Сеть</h4>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-secondary">HTTP запросы</span>
                <span className="font-medium text-primary">{performanceMetrics.networkRequests}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-secondary">Статус оптимизации</span>
                <span className={`font-medium ${calculateOptimizationScore >= 70 ? 'text-green-600 dark:text-green-400' : calculateOptimizationScore >= 40 ? 'text-yellow-600 dark:text-yellow-400' : 'text-red-600 dark:text-red-400'}`}>
                  {calculateOptimizationScore >= 70 ? 'Отлично' : calculateOptimizationScore >= 40 ? 'Хорошо' : 'Требует улучшения'}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="card-premium">
        <h3 className="text-xl font-semibold text-primary mb-6">Быстрые действия</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <button
            onClick={applyLazyLoading}
            className="btn-secondary flex items-center justify-center space-x-2"
          >
            <Image className="w-4 h-4" />
            <span>Применить ленивую загрузку</span>
          </button>
          
          <button
            onClick={clearCache}
            className="btn-secondary flex items-center justify-center space-x-2"
          >
            <Database className="w-4 h-4" />
            <span>Очистить кэш</span>
          </button>
          
          <button
            onClick={() => PerformanceUtils.preloadResources([
              { url: '/api/vocabulary', type: 'fetch' },
              { url: '/api/user', type: 'fetch' }
            ])}
            className="btn-secondary flex items-center justify-center space-x-2"
          >
            <Play className="w-4 h-4" />
            <span>Предзагрузить ресурсы</span>
          </button>
        </div>
      </div>

      {/* Optimization History */}
      {optimizationHistory.length > 0 && (
        <div className="card-premium">
          <h3 className="text-xl font-semibold text-primary mb-6">История оптимизаций</h3>
          
          <div className="space-y-3">
            {optimizationHistory.map((entry, index) => (
              <div key={index} className="p-4 bg-gray-50 dark:bg-gray-800 rounded-xl">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-medium text-primary">
                    Оптимизация #{optimizationHistory.length - index}
                  </span>
                  <span className="text-sm text-secondary">
                    {new Date(entry.timestamp).toLocaleString('ru-RU')}
                  </span>
                </div>
                <div className="text-sm text-secondary">
                  Уровень оптимизации: {entry.score}% | 
                  Время загрузки: {Math.round(entry.metrics.loadTime)}ms | 
                  Размер бандла: {entry.metrics.bundleSize.toFixed(1)}MB
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

export default PerformanceOptimizer


