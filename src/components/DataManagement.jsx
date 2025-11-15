import React, { useState, useRef } from 'react'
import { Download, Upload, Trash2, FileText, AlertTriangle, CheckCircle, Database } from 'lucide-react'
import toast from 'react-hot-toast'
import progressService from '../services/progressService'
import { useAuth } from '../contexts/AuthContext'

const DataManagement = () => {
  const { user } = useAuth()
  const [isExporting, setIsExporting] = useState(false)
  const [isImporting, setIsImporting] = useState(false)
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)
  const fileInputRef = useRef(null)

  const exportData = async () => {
    try {
      setIsExporting(true)
      
      // Gather all data
      const data = progressService.exportAllData()
      
      // Add user data
      const exportData = {
        ...data,
        user: user,
        appVersion: '1.0.0',
        exportedBy: user?.name || 'Anonymous',
        exportDate: new Date().toISOString()
      }

      // Convert to JSON
      const jsonString = JSON.stringify(exportData, null, 2)
      const blob = new Blob([jsonString], { type: 'application/json' })
      
      // Create download link
      const url = URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.href = url
      
      // Generate filename with date
      const date = new Date().toISOString().split('T')[0]
      link.download = `english-learning-backup-${date}.json`
      
      // Trigger download
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      URL.revokeObjectURL(url)

      toast.success('Данные успешно экспортированы!', { icon: '✅', duration: 3000 })
    } catch (error) {
      console.error('Export error:', error)
      toast.error('Ошибка при экспорте данных')
    } finally {
      setIsExporting(false)
    }
  }

  const importData = async (file) => {
    try {
      setIsImporting(true)

      // Read file
      const text = await file.text()
      const data = JSON.parse(text)

      // Validate data structure
      if (!data.version || !data.exportDate) {
        throw new Error('Invalid backup file format')
      }

      // Confirm import
      const confirmed = window.confirm(
        `Импортировать данные из резервной копии?\n\n` +
        `Дата экспорта: ${new Date(data.exportDate).toLocaleString()}\n` +
        `Экспортировано: ${data.exportedBy}\n\n` +
        `ВНИМАНИЕ: Это перезапишет все текущие данные!`
      )

      if (!confirmed) {
        setIsImporting(false)
        return
      }

      // Import data
      const success = progressService.importData(data)
      
      if (success) {
        toast.success('Данные успешно импортированы!', { icon: '✅', duration: 3000 })
        
        // Reload page to apply changes
        setTimeout(() => {
          window.location.reload()
        }, 1500)
      } else {
        throw new Error('Import failed')
      }
    } catch (error) {
      console.error('Import error:', error)
      toast.error('Ошибка при импорте данных. Проверьте формат файла.')
    } finally {
      setIsImporting(false)
    }
  }

  const handleFileSelect = (event) => {
    const file = event.target.files?.[0]
    if (file) {
      if (file.type === 'application/json' || file.name.endsWith('.json')) {
        importData(file)
      } else {
        toast.error('Пожалуйста, выберите JSON файл')
      }
    }
    // Reset input
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  const deleteAllData = () => {
    try {
      // Double confirmation
      const confirmed = window.confirm(
        'Вы уверены, что хотите удалить ВСЕ данные?\n\n' +
        'Это действие НЕОБРАТИМО!\n' +
        'Рекомендуем сначала экспортировать данные.'
      )

      if (!confirmed) return

      const doubleConfirmed = window.confirm(
        'ПОСЛЕДНЕЕ ПРЕДУПРЕЖДЕНИЕ!\n\n' +
        'Все ваши данные будут удалены навсегда:\n' +
        '- Прогресс обучения\n' +
        '- Словарь\n' +
        '- Достижения\n' +
        '- Статистика\n\n' +
        'Продолжить?'
      )

      if (!doubleConfirmed) return

      // Delete all data
      progressService.resetAllData()
      localStorage.clear()
      
      toast.success('Все данные удалены', { icon: '🗑️' })
      
      // Reload page
      setTimeout(() => {
        window.location.reload()
      }, 1500)
    } catch (error) {
      console.error('Delete error:', error)
      toast.error('Ошибка при удалении данных')
    }
  }

  const getDataStats = () => {
    const progress = progressService.getProgress()
    const vocabulary = progressService.getVocabulary()
    const achievements = progressService.getAchievements()
    const stats = progressService.getStatistics()

    return {
      totalWords: vocabulary.length,
      masteredWords: vocabulary.filter(w => w.mastered).length,
      totalXP: progress.xp,
      level: progress.level,
      streak: progress.streak,
      achievements: achievements.filter(a => a.unlocked).length,
      studyTime: progress.studyTime,
      exercises: progress.exercisesCompleted
    }
  }

  const stats = getDataStats()

  return (
    <div className="max-w-4xl mx-auto animate-fade-in space-y-6">
      {/* Header */}
      <div className="card-premium glass-effect-premium">
        <div className="flex items-center space-x-3 mb-4">
          <div className="w-12 h-12 bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl flex items-center justify-center">
            <Database className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-primary">Управление данными</h1>
            <p className="text-sm text-secondary">Экспорт, импорт и управление вашими данными</p>
          </div>
        </div>
      </div>

      {/* Data Overview */}
      <div className="card-premium glass-effect-premium">
        <h2 className="text-xl font-bold text-primary mb-4">Обзор данных</h2>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div className="text-center p-4 bg-blue-50 dark:bg-blue-900/20 rounded-xl">
            <div className="text-3xl font-bold text-blue-600">{stats.totalWords}</div>
            <div className="text-xs text-secondary mt-1">Слов в словаре</div>
          </div>
          <div className="text-center p-4 bg-green-50 dark:bg-green-900/20 rounded-xl">
            <div className="text-3xl font-bold text-green-600">{stats.totalXP}</div>
            <div className="text-xs text-secondary mt-1">Опыта</div>
          </div>
          <div className="text-center p-4 bg-purple-50 dark:bg-purple-900/20 rounded-xl">
            <div className="text-3xl font-bold text-purple-600">{stats.streak}</div>
            <div className="text-xs text-secondary mt-1">Дней подряд</div>
          </div>
          <div className="text-center p-4 bg-orange-50 dark:bg-orange-900/20 rounded-xl">
            <div className="text-3xl font-bold text-orange-600">{stats.achievements}</div>
            <div className="text-xs text-secondary mt-1">Достижений</div>
          </div>
        </div>
      </div>

      {/* Export Section */}
      <div className="card-premium glass-effect-premium">
        <div className="flex items-center space-x-3 mb-4">
          <Download className="w-6 h-6 text-green-600" />
          <h2 className="text-xl font-bold text-primary">Экспорт данных</h2>
        </div>
        
        <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-xl mb-4">
          <div className="flex items-start space-x-3">
            <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
            <div className="text-sm text-secondary">
              <p className="mb-2">Экспорт включает:</p>
              <ul className="list-disc list-inside space-y-1 text-xs">
                <li>Весь прогресс обучения</li>
                <li>Личный словарь ({stats.totalWords} слов)</li>
                <li>Все достижения ({stats.achievements} разблокировано)</li>
                <li>Статистику занятий ({stats.studyTime} минут)</li>
                <li>Настройки и предпочтения</li>
              </ul>
            </div>
          </div>
        </div>

        <button
          onClick={exportData}
          disabled={isExporting}
          className="w-full py-3 px-6 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-xl font-semibold hover:from-green-700 hover:to-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105 disabled:transform-none flex items-center justify-center space-x-2"
        >
          <Download className="w-5 h-5" />
          <span>{isExporting ? 'Экспорт...' : 'Экспортировать данные'}</span>
        </button>
      </div>

      {/* Import Section */}
      <div className="card-premium glass-effect-premium">
        <div className="flex items-center space-x-3 mb-4">
          <Upload className="w-6 h-6 text-blue-600" />
          <h2 className="text-xl font-bold text-primary">Импорт данных</h2>
        </div>

        <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-xl mb-4">
          <div className="flex items-start space-x-3">
            <FileText className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
            <div className="text-sm text-secondary">
              <p className="mb-2">Импортируйте ранее экспортированные данные:</p>
              <ul className="list-disc list-inside space-y-1 text-xs">
                <li>Выберите JSON файл резервной копии</li>
                <li>Все текущие данные будут заменены</li>
                <li>Рекомендуем сначала экспортировать текущие данные</li>
                <li>После импорта страница автоматически обновится</li>
              </ul>
            </div>
          </div>
        </div>

        <input
          ref={fileInputRef}
          type="file"
          accept=".json"
          onChange={handleFileSelect}
          className="hidden"
        />

        <button
          onClick={() => fileInputRef.current?.click()}
          disabled={isImporting}
          className="w-full py-3 px-6 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl font-semibold hover:from-blue-700 hover:to-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105 disabled:transform-none flex items-center justify-center space-x-2"
        >
          <Upload className="w-5 h-5" />
          <span>{isImporting ? 'Импорт...' : 'Импортировать данные'}</span>
        </button>
      </div>

      {/* Danger Zone */}
      <div className="card-premium glass-effect-premium border-2 border-red-200 dark:border-red-800">
        <div className="flex items-center space-x-3 mb-4">
          <AlertTriangle className="w-6 h-6 text-red-600" />
          <h2 className="text-xl font-bold text-red-600">Опасная зона</h2>
        </div>

        <div className="bg-red-50 dark:bg-red-900/20 p-4 rounded-xl mb-4">
          <div className="flex items-start space-x-3">
            <AlertTriangle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
            <div className="text-sm text-secondary">
              <p className="font-semibold mb-2 text-red-600">Удаление всех данных</p>
              <ul className="list-disc list-inside space-y-1 text-xs">
                <li>Это действие НЕОБРАТИМО</li>
                <li>Будут удалены ВСЕ ваши данные</li>
                <li>Сначала экспортируйте данные для резервной копии</li>
                <li>После удаления страница обновится</li>
              </ul>
            </div>
          </div>
        </div>

        {!showDeleteConfirm ? (
          <button
            onClick={() => setShowDeleteConfirm(true)}
            className="w-full py-3 px-6 bg-red-600 text-white rounded-xl font-semibold hover:bg-red-700 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105 flex items-center justify-center space-x-2"
          >
            <Trash2 className="w-5 h-5" />
            <span>Удалить все данные</span>
          </button>
        ) : (
          <div className="space-y-3">
            <p className="text-center font-semibold text-red-600">
              Вы уверены? Это действие необратимо!
            </p>
            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={() => setShowDeleteConfirm(false)}
                className="py-3 px-6 bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-white rounded-xl font-semibold hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
              >
                Отмена
              </button>
              <button
                onClick={deleteAllData}
                className="py-3 px-6 bg-red-600 text-white rounded-xl font-semibold hover:bg-red-700 transition-colors flex items-center justify-center space-x-2"
              >
                <Trash2 className="w-5 h-5" />
                <span>Да, удалить</span>
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Privacy Note */}
      <div className="card-premium glass-effect-premium bg-gray-50 dark:bg-gray-800/50">
        <h3 className="text-sm font-semibold text-primary mb-2">🔒 Конфиденциальность</h3>
        <p className="text-xs text-secondary">
          Все ваши данные хранятся локально в браузере и никуда не отправляются. 
          Экспортированные файлы содержат только ваши данные и могут быть безопасно хранены на вашем устройстве.
        </p>
      </div>
    </div>
  )
}

export default DataManagement


