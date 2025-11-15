import React, { useState, useEffect } from 'react'
import { Eye, Type, MousePointer, Volume2, Keyboard, Check } from 'lucide-react'
import toast from 'react-hot-toast'

const AccessibilitySettings = () => {
  const [settings, setSettings] = useState({
    fontSize: 'medium',
    reducedMotion: false,
    highContrast: false,
    largerClickTargets: false,
    screenReaderMode: false,
    keyboardNavigation: true
  })

  useEffect(() => {
    // Load saved settings
    const saved = localStorage.getItem('accessibility_settings')
    if (saved) {
      const parsed = JSON.parse(saved)
      setSettings(parsed)
      applySettings(parsed)
    }
  }, [])

  const applySettings = (newSettings) => {
    const root = document.documentElement

    // Font size
    const fontSizes = { small: '14px', medium: '16px', large: '18px', xlarge: '20px' }
    root.style.fontSize = fontSizes[newSettings.fontSize] || '16px'

    // Reduced motion
    if (newSettings.reducedMotion) {
      root.style.setProperty('--animation-duration', '0.01ms')
    } else {
      root.style.removeProperty('--animation-duration')
    }

    // High contrast
    if (newSettings.highContrast) {
      root.classList.add('high-contrast')
    } else {
      root.classList.remove('high-contrast')
    }

    // Larger click targets
    if (newSettings.largerClickTargets) {
      root.classList.add('large-targets')
    } else {
      root.classList.remove('large-targets')
    }
  }

  const updateSetting = (key, value) => {
    const newSettings = { ...settings, [key]: value }
    setSettings(newSettings)
    applySettings(newSettings)
    localStorage.setItem('accessibility_settings', JSON.stringify(newSettings))
    toast.success('Настройки доступности обновлены')
  }

  const resetSettings = () => {
    const defaultSettings = {
      fontSize: 'medium',
      reducedMotion: false,
      highContrast: false,
      largerClickTargets: false,
      screenReaderMode: false,
      keyboardNavigation: true
    }
    setSettings(defaultSettings)
    applySettings(defaultSettings)
    localStorage.removeItem('accessibility_settings')
    toast.success('Настройки сброшены')
  }

  return (
    <div className="max-w-4xl mx-auto animate-fade-in">
      <div className="card-premium glass-effect-premium">
        <div className="flex items-center space-x-3 mb-6">
          <div className="w-12 h-12 bg-gradient-to-r from-purple-600 to-pink-600 rounded-2xl flex items-center justify-center">
            <Eye className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-primary">Настройки доступности</h1>
            <p className="text-sm text-secondary">Настройте приложение для комфортного использования</p>
          </div>
        </div>

        <div className="space-y-6">
          {/* Font Size */}
          <div className="setting-group">
            <div className="flex items-center space-x-3 mb-3">
              <Type className="w-5 h-5 text-blue-600 dark:text-blue-400" />
              <h3 className="font-semibold text-primary">Размер шрифта</h3>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {['small', 'medium', 'large', 'xlarge'].map((size) => (
                <button
                  key={size}
                  onClick={() => updateSetting('fontSize', size)}
                  className={`p-4 rounded-xl border-2 transition-all duration-200 ${
                    settings.fontSize === size
                      ? 'border-blue-600 bg-blue-50 dark:bg-blue-900/20'
                      : 'border-gray-200 dark:border-gray-700 hover:border-blue-400'
                  }`}
                >
                  <div className="flex items-center justify-center space-x-2">
                    {settings.fontSize === size && (
                      <Check className="w-4 h-4 text-blue-600" />
                    )}
                    <span className="font-medium text-primary capitalize">
                      {size === 'xlarge' ? 'X-Large' : size}
                    </span>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Reduced Motion */}
          <div className="setting-group">
            <div className="flex items-center justify-between p-4 rounded-xl bg-gray-50 dark:bg-gray-800/50">
              <div className="flex items-center space-x-3">
                <MousePointer className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                <div>
                  <h3 className="font-semibold text-primary">Уменьшить анимацию</h3>
                  <p className="text-sm text-secondary">Отключает анимации и эффекты</p>
                </div>
              </div>
              <button
                onClick={() => updateSetting('reducedMotion', !settings.reducedMotion)}
                className={`relative w-14 h-8 rounded-full transition-colors duration-200 ${
                  settings.reducedMotion ? 'bg-blue-600' : 'bg-gray-300 dark:bg-gray-600'
                }`}
              >
                <span
                  className={`absolute top-1 left-1 w-6 h-6 bg-white rounded-full transition-transform duration-200 ${
                    settings.reducedMotion ? 'transform translate-x-6' : ''
                  }`}
                />
              </button>
            </div>
          </div>

          {/* High Contrast */}
          <div className="setting-group">
            <div className="flex items-center justify-between p-4 rounded-xl bg-gray-50 dark:bg-gray-800/50">
              <div className="flex items-center space-x-3">
                <Eye className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
                <div>
                  <h3 className="font-semibold text-primary">Высокая контрастность</h3>
                  <p className="text-sm text-secondary">Усиливает контраст текста и элементов</p>
                </div>
              </div>
              <button
                onClick={() => updateSetting('highContrast', !settings.highContrast)}
                className={`relative w-14 h-8 rounded-full transition-colors duration-200 ${
                  settings.highContrast ? 'bg-blue-600' : 'bg-gray-300 dark:bg-gray-600'
                }`}
              >
                <span
                  className={`absolute top-1 left-1 w-6 h-6 bg-white rounded-full transition-transform duration-200 ${
                    settings.highContrast ? 'transform translate-x-6' : ''
                  }`}
                />
              </button>
            </div>
          </div>

          {/* Larger Click Targets */}
          <div className="setting-group">
            <div className="flex items-center justify-between p-4 rounded-xl bg-gray-50 dark:bg-gray-800/50">
              <div className="flex items-center space-x-3">
                <MousePointer className="w-5 h-5 text-green-600 dark:text-green-400" />
                <div>
                  <h3 className="font-semibold text-primary">Увеличить кнопки</h3>
                  <p className="text-sm text-secondary">Делает кнопки и элементы управления больше</p>
                </div>
              </div>
              <button
                onClick={() => updateSetting('largerClickTargets', !settings.largerClickTargets)}
                className={`relative w-14 h-8 rounded-full transition-colors duration-200 ${
                  settings.largerClickTargets ? 'bg-blue-600' : 'bg-gray-300 dark:bg-gray-600'
                }`}
              >
                <span
                  className={`absolute top-1 left-1 w-6 h-6 bg-white rounded-full transition-transform duration-200 ${
                    settings.largerClickTargets ? 'transform translate-x-6' : ''
                  }`}
                />
              </button>
            </div>
          </div>

          {/* Keyboard Navigation */}
          <div className="setting-group">
            <div className="flex items-center justify-between p-4 rounded-xl bg-gray-50 dark:bg-gray-800/50">
              <div className="flex items-center space-x-3">
                <Keyboard className="w-5 h-5 text-orange-600 dark:text-orange-400" />
                <div>
                  <h3 className="font-semibold text-primary">Навигация с клавиатуры</h3>
                  <p className="text-sm text-secondary">Alt + буква для быстрой навигации</p>
                </div>
              </div>
              <button
                onClick={() => updateSetting('keyboardNavigation', !settings.keyboardNavigation)}
                className={`relative w-14 h-8 rounded-full transition-colors duration-200 ${
                  settings.keyboardNavigation ? 'bg-blue-600' : 'bg-gray-300 dark:bg-gray-600'
                }`}
              >
                <span
                  className={`absolute top-1 left-1 w-6 h-6 bg-white rounded-full transition-transform duration-200 ${
                    settings.keyboardNavigation ? 'transform translate-x-6' : ''
                  }`}
                />
              </button>
            </div>
          </div>

          {/* Screen Reader Mode */}
          <div className="setting-group">
            <div className="flex items-center justify-between p-4 rounded-xl bg-gray-50 dark:bg-gray-800/50">
              <div className="flex items-center space-x-3">
                <Volume2 className="w-5 h-5 text-red-600 dark:text-red-400" />
                <div>
                  <h3 className="font-semibold text-primary">Режим экранного диктора</h3>
                  <p className="text-sm text-secondary">Оптимизация для программ чтения с экрана</p>
                </div>
              </div>
              <button
                onClick={() => updateSetting('screenReaderMode', !settings.screenReaderMode)}
                className={`relative w-14 h-8 rounded-full transition-colors duration-200 ${
                  settings.screenReaderMode ? 'bg-blue-600' : 'bg-gray-300 dark:bg-gray-600'
                }`}
              >
                <span
                  className={`absolute top-1 left-1 w-6 h-6 bg-white rounded-full transition-transform duration-200 ${
                    settings.screenReaderMode ? 'transform translate-x-6' : ''
                  }`}
                />
              </button>
            </div>
          </div>

          {/* Reset Button */}
          <div className="pt-6 border-t border-gray-200 dark:border-gray-700">
            <button
              onClick={resetSettings}
              className="w-full py-3 px-6 bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white rounded-xl font-semibold hover:bg-gray-200 dark:hover:bg-gray-600 transition-all duration-200 shadow-lg hover:shadow-xl"
            >
              Сбросить все настройки
            </button>
          </div>
        </div>
      </div>

      {/* Keyboard Shortcuts Info */}
      <div className="mt-6 card-premium glass-effect-premium">
        <h3 className="text-lg font-bold text-primary mb-4 flex items-center space-x-2">
          <Keyboard className="w-5 h-5" />
          <span>Горячие клавиши</span>
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
          <div className="flex justify-between p-3 bg-gray-50 dark:bg-gray-800/50 rounded-lg">
            <span className="text-secondary">Главная</span>
            <kbd className="kbd">Alt + H</kbd>
          </div>
          <div className="flex justify-between p-3 bg-gray-50 dark:bg-gray-800/50 rounded-lg">
            <span className="text-secondary">Чат</span>
            <kbd className="kbd">Alt + C</kbd>
          </div>
          <div className="flex justify-between p-3 bg-gray-50 dark:bg-gray-800/50 rounded-lg">
            <span className="text-secondary">Словарь</span>
            <kbd className="kbd">Alt + V</kbd>
          </div>
          <div className="flex justify-between p-3 bg-gray-50 dark:bg-gray-800/50 rounded-lg">
            <span className="text-secondary">Грамматика</span>
            <kbd className="kbd">Alt + G</kbd>
          </div>
          <div className="flex justify-between p-3 bg-gray-50 dark:bg-gray-800/50 rounded-lg">
            <span className="text-secondary">Упражнения</span>
            <kbd className="kbd">Alt + E</kbd>
          </div>
          <div className="flex justify-between p-3 bg-gray-50 dark:bg-gray-800/50 rounded-lg">
            <span className="text-secondary">Прогресс</span>
            <kbd className="kbd">Alt + P</kbd>
          </div>
        </div>
      </div>
    </div>
  )
}

export default AccessibilitySettings


