import React, { useState, useEffect } from 'react'
import { 
  Shield, 
  Lock, 
  Eye, 
  EyeOff, 
  Key, 
  AlertTriangle,
  CheckCircle,
  Settings,
  User,
  Mail,
  Smartphone,
  Globe,
  Database,
  FileText,
  Zap
} from 'lucide-react'
import { SecurityUtils, ValidationSchemas } from '../utils/security'
import { useAuth } from '../contexts/AuthContext'
import { useNotifications } from '../components/NotificationProvider'

const SecuritySettings = () => {
  const { user, updateUser } = useAuth()
  const { success, error } = useNotifications()
  
  const [securitySettings, setSecuritySettings] = useState({
    twoFactorAuth: false,
    emailNotifications: true,
    loginAlerts: true,
    sessionTimeout: 30,
    passwordExpiry: 90,
    dataEncryption: true,
    auditLogging: true
  })

  const [passwordForm, setPasswordForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  })

  const [showPasswords, setShowPasswords] = useState({
    current: false,
    new: false,
    confirm: false
  })

  const [passwordStrength, setPasswordStrength] = useState(null)
  const [validationErrors, setValidationErrors] = useState({})

  useEffect(() => {
    // Load security settings from localStorage
    const savedSettings = localStorage.getItem('securitySettings')
    if (savedSettings) {
      setSecuritySettings(JSON.parse(savedSettings))
    }
  }, [])

  const handlePasswordChange = (field, value) => {
    setPasswordForm(prev => ({ ...prev, [field]: value }))
    
    if (field === 'newPassword') {
      const strength = SecurityUtils.validatePassword(value)
      setPasswordStrength(strength)
    }
  }

  const validateForm = () => {
    const errors = {}
    
    if (!passwordForm.currentPassword) {
      errors.currentPassword = 'Текущий пароль обязателен'
    }
    
    if (!passwordForm.newPassword) {
      errors.newPassword = 'Новый пароль обязателен'
    } else {
      const passwordError = ValidationSchemas.user.password(passwordForm.newPassword)
      if (passwordError) {
        errors.newPassword = passwordError
      }
    }
    
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      errors.confirmPassword = 'Пароли не совпадают'
    }
    
    setValidationErrors(errors)
    return Object.keys(errors).length === 0
  }

  const handlePasswordUpdate = () => {
    if (!validateForm()) return
    
    // Simulate password update
    setTimeout(() => {
      success('Пароль обновлен', 'Ваш пароль был успешно изменен')
      setPasswordForm({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      })
      setValidationErrors({})
    }, 1000)
  }

  const handleSecuritySettingChange = (setting, value) => {
    const newSettings = { ...securitySettings, [setting]: value }
    setSecuritySettings(newSettings)
    localStorage.setItem('securitySettings', JSON.stringify(newSettings))
    success('Настройка обновлена', 'Параметры безопасности сохранены')
  }

  const generateBackupCodes = () => {
    const codes = Array.from({ length: 10 }, () => SecurityUtils.generateToken(8))
    success('Коды созданы', 'Резервные коды для двухфакторной аутентификации созданы')
    return codes
  }

  const downloadSecurityReport = () => {
    const report = {
      timestamp: new Date().toISOString(),
      user: user?.email,
      settings: securitySettings,
      lastLogin: new Date().toISOString(),
      securityScore: calculateSecurityScore()
    }
    
    const blob = new Blob([JSON.stringify(report, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'security-report.json'
    a.click()
    URL.revokeObjectURL(url)
    
    success('Отчет скачан', 'Отчет о безопасности сохранен')
  }

  const calculateSecurityScore = () => {
    let score = 0
    const maxScore = 100
    
    if (securitySettings.twoFactorAuth) score += 30
    if (securitySettings.dataEncryption) score += 20
    if (securitySettings.auditLogging) score += 15
    if (securitySettings.loginAlerts) score += 10
    if (securitySettings.emailNotifications) score += 10
    if (securitySettings.sessionTimeout <= 30) score += 10
    if (securitySettings.passwordExpiry <= 90) score += 5
    
    return Math.min(score, maxScore)
  }

  const getSecurityScoreColor = (score) => {
    if (score >= 80) return 'text-green-600 dark:text-green-400'
    if (score >= 60) return 'text-yellow-600 dark:text-yellow-400'
    return 'text-red-600 dark:text-red-400'
  }

  const getSecurityScoreLabel = (score) => {
    if (score >= 80) return 'Отлично'
    if (score >= 60) return 'Хорошо'
    if (score >= 40) return 'Удовлетворительно'
    return 'Требует улучшения'
  }

  const securityScore = calculateSecurityScore()

  return (
    <div className="max-w-6xl mx-auto space-y-6 animate-fade-in">
      {/* Header */}
      <div className="text-center">
        <h1 className="text-3xl font-bold text-primary mb-2">Настройки безопасности</h1>
        <p className="text-secondary">Управляйте безопасностью вашего аккаунта</p>
      </div>

      {/* Security Score */}
      <div className="card-premium">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-xl font-semibold text-primary mb-2">Оценка безопасности</h3>
            <div className="flex items-center space-x-4">
              <div className={`text-3xl font-bold ${getSecurityScoreColor(securityScore)}`}>
                {securityScore}/100
              </div>
              <div>
                <div className={`font-semibold ${getSecurityScoreColor(securityScore)}`}>
                  {getSecurityScoreLabel(securityScore)}
                </div>
                <div className="text-sm text-secondary">Общий уровень безопасности</div>
              </div>
            </div>
          </div>
          
          <div className="w-32 h-32 relative">
            <svg className="w-32 h-32 transform -rotate-90">
              <circle
                cx="64"
                cy="64"
                r="56"
                stroke="currentColor"
                strokeWidth="8"
                fill="none"
                className="text-gray-200 dark:text-gray-700"
              />
              <circle
                cx="64"
                cy="64"
                r="56"
                stroke="currentColor"
                strokeWidth="8"
                fill="none"
                strokeDasharray={`${(securityScore / 100) * 352} 352`}
                className={securityScore >= 80 ? 'text-green-500' : securityScore >= 60 ? 'text-yellow-500' : 'text-red-500'}
                strokeLinecap="round"
              />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center">
              <Shield className="w-8 h-8 text-blue-600 dark:text-blue-400" />
            </div>
          </div>
        </div>
      </div>

      {/* Password Management */}
      <div className="card-premium">
        <h3 className="text-xl font-semibold text-primary mb-6 flex items-center space-x-2">
          <Key className="w-5 h-5 text-blue-600 dark:text-blue-400" />
          <span>Управление паролем</span>
        </h3>
        
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-primary mb-1">Текущий пароль</label>
            <div className="relative">
              <input
                type={showPasswords.current ? 'text' : 'password'}
                value={passwordForm.currentPassword}
                onChange={(e) => handlePasswordChange('currentPassword', e.target.value)}
                className={`input-field pr-10 ${validationErrors.currentPassword ? 'border-red-500' : ''}`}
                placeholder="Введите текущий пароль"
              />
              <button
                type="button"
                onClick={() => setShowPasswords(prev => ({ ...prev, current: !prev.current }))}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
              >
                {showPasswords.current ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
            {validationErrors.currentPassword && (
              <p className="text-red-500 text-sm mt-1">{validationErrors.currentPassword}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-primary mb-1">Новый пароль</label>
            <div className="relative">
              <input
                type={showPasswords.new ? 'text' : 'password'}
                value={passwordForm.newPassword}
                onChange={(e) => handlePasswordChange('newPassword', e.target.value)}
                className={`input-field pr-10 ${validationErrors.newPassword ? 'border-red-500' : ''}`}
                placeholder="Введите новый пароль"
              />
              <button
                type="button"
                onClick={() => setShowPasswords(prev => ({ ...prev, new: !prev.new }))}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
              >
                {showPasswords.new ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
            {validationErrors.newPassword && (
              <p className="text-red-500 text-sm mt-1">{validationErrors.newPassword}</p>
            )}
            
            {/* Password Strength Indicator */}
            {passwordStrength && (
              <div className="mt-2">
                <div className="flex items-center space-x-2 mb-2">
                  <span className="text-sm text-secondary">Надежность пароля:</span>
                  <div className="flex space-x-1">
                    {[1, 2, 3, 4, 5].map((level) => (
                      <div
                        key={level}
                        className={`w-2 h-2 rounded-full ${
                          level <= passwordStrength.score
                            ? passwordStrength.score <= 2
                              ? 'bg-red-500'
                              : passwordStrength.score <= 3
                              ? 'bg-yellow-500'
                              : 'bg-green-500'
                            : 'bg-gray-300 dark:bg-gray-600'
                        }`}
                      />
                    ))}
                  </div>
                </div>
                
                <div className="text-xs text-secondary space-y-1">
                  {Object.entries(passwordStrength.strength).map(([key, value]) => (
                    <div key={key} className="flex items-center space-x-2">
                      {value ? (
                        <CheckCircle className="w-3 h-3 text-green-500" />
                      ) : (
                        <AlertTriangle className="w-3 h-3 text-red-500" />
                      )}
                      <span>
                        {key === 'length' && 'Минимум 8 символов'}
                        {key === 'uppercase' && 'Заглавные буквы'}
                        {key === 'lowercase' && 'Строчные буквы'}
                        {key === 'numbers' && 'Цифры'}
                        {key === 'special' && 'Специальные символы'}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-primary mb-1">Подтвердите пароль</label>
            <div className="relative">
              <input
                type={showPasswords.confirm ? 'text' : 'password'}
                value={passwordForm.confirmPassword}
                onChange={(e) => handlePasswordChange('confirmPassword', e.target.value)}
                className={`input-field pr-10 ${validationErrors.confirmPassword ? 'border-red-500' : ''}`}
                placeholder="Подтвердите новый пароль"
              />
              <button
                type="button"
                onClick={() => setShowPasswords(prev => ({ ...prev, confirm: !prev.confirm }))}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
              >
                {showPasswords.confirm ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
            {validationErrors.confirmPassword && (
              <p className="text-red-500 text-sm mt-1">{validationErrors.confirmPassword}</p>
            )}
          </div>

          <button
            onClick={handlePasswordUpdate}
            className="btn-primary w-full"
          >
            Обновить пароль
          </button>
        </div>
      </div>

      {/* Security Settings */}
      <div className="card-premium">
        <h3 className="text-xl font-semibold text-primary mb-6 flex items-center space-x-2">
          <Settings className="w-5 h-5 text-blue-600 dark:text-blue-400" />
          <span>Параметры безопасности</span>
        </h3>
        
        <div className="space-y-6">
          {/* Two-Factor Authentication */}
          <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800 rounded-xl">
            <div className="flex items-center space-x-3">
              <Smartphone className="w-6 h-6 text-blue-600 dark:text-blue-400" />
              <div>
                <h4 className="font-semibold text-primary">Двухфакторная аутентификация</h4>
                <p className="text-sm text-secondary">Дополнительная защита вашего аккаунта</p>
              </div>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={securitySettings.twoFactorAuth}
                onChange={(e) => handleSecuritySettingChange('twoFactorAuth', e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
            </label>
          </div>

          {/* Email Notifications */}
          <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800 rounded-xl">
            <div className="flex items-center space-x-3">
              <Mail className="w-6 h-6 text-green-600 dark:text-green-400" />
              <div>
                <h4 className="font-semibold text-primary">Уведомления по email</h4>
                <p className="text-sm text-secondary">Получайте уведомления о важных событиях</p>
              </div>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={securitySettings.emailNotifications}
                onChange={(e) => handleSecuritySettingChange('emailNotifications', e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
            </label>
          </div>

          {/* Login Alerts */}
          <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800 rounded-xl">
            <div className="flex items-center space-x-3">
              <AlertTriangle className="w-6 h-6 text-yellow-600 dark:text-yellow-400" />
              <div>
                <h4 className="font-semibold text-primary">Оповещения о входе</h4>
                <p className="text-sm text-secondary">Уведомления о новых входах в аккаунт</p>
              </div>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={securitySettings.loginAlerts}
                onChange={(e) => handleSecuritySettingChange('loginAlerts', e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
            </label>
          </div>

          {/* Session Timeout */}
          <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-xl">
            <div className="flex items-center space-x-3 mb-3">
              <Clock className="w-6 h-6 text-purple-600 dark:text-purple-400" />
              <div>
                <h4 className="font-semibold text-primary">Таймаут сессии</h4>
                <p className="text-sm text-secondary">Автоматический выход при неактивности</p>
              </div>
            </div>
            <select
              value={securitySettings.sessionTimeout}
              onChange={(e) => handleSecuritySettingChange('sessionTimeout', parseInt(e.target.value))}
              className="input-field"
            >
              <option value={15}>15 минут</option>
              <option value={30}>30 минут</option>
              <option value={60}>1 час</option>
              <option value={120}>2 часа</option>
              <option value={480}>8 часов</option>
            </select>
          </div>

          {/* Data Encryption */}
          <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800 rounded-xl">
            <div className="flex items-center space-x-3">
              <Database className="w-6 h-6 text-indigo-600 dark:text-indigo-400" />
              <div>
                <h4 className="font-semibold text-primary">Шифрование данных</h4>
                <p className="text-sm text-secondary">Защита персональных данных</p>
              </div>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={securitySettings.dataEncryption}
                onChange={(e) => handleSecuritySettingChange('dataEncryption', e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
            </label>
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="card-premium">
        <h3 className="text-xl font-semibold text-primary mb-6 flex items-center space-x-2">
          <Zap className="w-5 h-5 text-blue-600 dark:text-blue-400" />
          <span>Действия</span>
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <button
            onClick={generateBackupCodes}
            className="btn-secondary flex items-center justify-center space-x-2"
          >
            <Key className="w-4 h-4" />
            <span>Создать резервные коды</span>
          </button>
          
          <button
            onClick={downloadSecurityReport}
            className="btn-secondary flex items-center justify-center space-x-2"
          >
            <FileText className="w-4 h-4" />
            <span>Скачать отчет безопасности</span>
          </button>
        </div>
      </div>
    </div>
  )
}

export default SecuritySettings


