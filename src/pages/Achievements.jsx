import React, { useState, useEffect } from 'react'
import { Trophy, Star, Target, Calendar, MessageCircle, BookOpen, Award, Zap } from 'lucide-react'
import { useAuth } from '../contexts/AuthContext'
import { useNotifications } from '../components/NotificationProvider'

const Achievements = () => {
  const { user, updateUser } = useAuth()
  const { success } = useNotifications()
  const [achievements, setAchievements] = useState([])
  const [newAchievements, setNewAchievements] = useState([])

  // Определяем достижения
  const allAchievements = [
    {
      id: 'first_word',
      title: 'Первое слово',
      description: 'Добавьте первое слово в словарь',
      icon: BookOpen,
      condition: (user) => user?.wordsLearned >= 1,
      reward: { xp: 10, type: 'xp' },
      category: 'vocabulary',
      rarity: 'common'
    },
    {
      id: 'vocabulary_master',
      title: 'Мастер словаря',
      description: 'Изучите 50 слов',
      icon: BookOpen,
      condition: (user) => user?.wordsLearned >= 50,
      reward: { xp: 100, type: 'xp' },
      category: 'vocabulary',
      rarity: 'rare'
    },
    {
      id: 'grammar_expert',
      title: 'Эксперт грамматики',
      description: 'Завершите 10 уроков грамматики',
      icon: Award,
      condition: (user) => user?.grammarLessonsCompleted >= 10,
      reward: { xp: 150, type: 'xp' },
      category: 'grammar',
      rarity: 'rare'
    },
    {
      id: 'chat_enthusiast',
      title: 'Энтузиаст чата',
      description: 'Отправьте 25 сообщений в чате',
      icon: MessageCircle,
      condition: (user) => user?.chatMessages >= 25,
      reward: { xp: 75, type: 'xp' },
      category: 'chat',
      rarity: 'uncommon'
    },
    {
      id: 'streak_master',
      title: 'Мастер серий',
      description: 'Изучайте язык 7 дней подряд',
      icon: Calendar,
      condition: (user) => user?.streak >= 7,
      reward: { xp: 200, type: 'xp' },
      category: 'streak',
      rarity: 'epic'
    },
    {
      id: 'level_up',
      title: 'Повышение уровня',
      description: 'Достигните 5 уровня',
      icon: Trophy,
      condition: (user) => user?.level >= 5,
      reward: { xp: 300, type: 'xp' },
      category: 'level',
      rarity: 'legendary'
    }
  ]

  // Проверяем достижения
  useEffect(() => {
    if (!user) return

    const userAchievements = user.achievements || []
    const unlockedAchievements = allAchievements.filter(achievement => 
      achievement.condition(user) && !userAchievements.includes(achievement.id)
    )

    if (unlockedAchievements.length > 0) {
      // Добавляем новые достижения
      const newAchievementIds = unlockedAchievements.map(a => a.id)
      const updatedAchievements = [...userAchievements, ...newAchievementIds]
      
      // Начисляем награды
      let totalXp = 0
      unlockedAchievements.forEach(achievement => {
        if (achievement.reward.type === 'xp') {
          totalXp += achievement.reward.xp
        }
      })

      // Обновляем пользователя
      updateUser({
        achievements: updatedAchievements,
        xp: user.xp + totalXp,
        level: Math.floor((user.xp + totalXp) / 100) + 1
      })

      // Показываем уведомления
      unlockedAchievements.forEach(achievement => {
        success(
          `🎉 Достижение разблокировано!`, 
          achievement.title
        )
      })

      setNewAchievements(unlockedAchievements)
    }

    setAchievements(allAchievements)
  }, [user, updateUser, success])

  const getRarityColor = (rarity) => {
    switch (rarity) {
      case 'common': return 'border-gray-300 bg-gray-50 dark:bg-gray-800'
      case 'uncommon': return 'border-green-300 bg-green-50 dark:bg-green-900'
      case 'rare': return 'border-blue-300 bg-blue-50 dark:bg-blue-900'
      case 'epic': return 'border-purple-300 bg-purple-50 dark:bg-purple-900'
      case 'legendary': return 'border-yellow-300 bg-yellow-50 dark:bg-yellow-900'
      default: return 'border-gray-300 bg-gray-50 dark:bg-gray-800'
    }
  }

  const getRarityText = (rarity) => {
    switch (rarity) {
      case 'common': return 'Обычное'
      case 'uncommon': return 'Необычное'
      case 'rare': return 'Редкое'
      case 'epic': return 'Эпическое'
      case 'legendary': return 'Легендарное'
      default: return 'Обычное'
    }
  }

  return (
    <div className="max-w-6xl mx-auto space-y-6 animate-fade-in">
      {/* Header */}
      <div className="text-center">
        <h1 className="text-3xl font-bold text-primary mb-2">Достижения</h1>
        <p className="text-secondary">Отслеживайте свой прогресс и получайте награды</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="card text-center">
          <div className="text-2xl font-bold text-blue-600">
            {user?.achievements?.length || 0}
          </div>
          <div className="text-secondary">Разблокировано</div>
        </div>
        <div className="card text-center">
          <div className="text-2xl font-bold text-green-600">
            {achievements.length - (user?.achievements?.length || 0)}
          </div>
          <div className="text-secondary">Осталось</div>
        </div>
        <div className="card text-center">
          <div className="text-2xl font-bold text-purple-600">
            {user?.level || 1}
          </div>
          <div className="text-secondary">Уровень</div>
        </div>
        <div className="card text-center">
          <div className="text-2xl font-bold text-yellow-600">
            {user?.xp || 0}
          </div>
          <div className="text-secondary">Опыт</div>
        </div>
      </div>

      {/* New Achievements */}
      {newAchievements.length > 0 && (
        <div className="card bg-gradient-to-r from-yellow-50 to-orange-50 dark:from-yellow-900 dark:to-orange-900 border-yellow-200 dark:border-yellow-700">
          <h3 className="text-lg font-semibold text-primary mb-4 flex items-center space-x-2">
            <Trophy className="w-5 h-5 text-yellow-500" />
            <span>Новые достижения!</span>
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {newAchievements.map(achievement => {
              const Icon = achievement.icon
              return (
                <div key={achievement.id} className="flex items-center space-x-3 p-3 bg-white dark:bg-gray-800 rounded-lg">
                  <div className="flex items-center justify-center w-10 h-10 bg-yellow-100 dark:bg-yellow-900 rounded-lg">
                    <Icon className="w-5 h-5 text-yellow-600 dark:text-yellow-400" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-primary">{achievement.title}</h4>
                    <p className="text-sm text-secondary">{achievement.description}</p>
                    <p className="text-xs text-yellow-600 dark:text-yellow-400">
                      +{achievement.reward.xp} XP
                    </p>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      )}

      {/* All Achievements */}
      <div className="space-y-4">
        <h3 className="text-xl font-semibold text-primary">Все достижения</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {achievements.map(achievement => {
            const Icon = achievement.icon
            const isUnlocked = user?.achievements?.includes(achievement.id)
            
            return (
              <div 
                key={achievement.id} 
                className={`card border-2 transition-all duration-300 ${
                  isUnlocked 
                    ? getRarityColor(achievement.rarity)
                    : 'border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 opacity-60'
                }`}
              >
                <div className="flex items-start space-x-3">
                  <div className={`flex items-center justify-center w-10 h-10 rounded-lg ${
                    isUnlocked 
                      ? 'bg-blue-100 dark:bg-blue-900' 
                      : 'bg-gray-100 dark:bg-gray-700'
                  }`}>
                    <Icon className={`w-5 h-5 ${
                      isUnlocked 
                        ? 'text-blue-600 dark:text-blue-400' 
                        : 'text-gray-400 dark:text-gray-500'
                    }`} />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-1">
                      <h4 className={`font-semibold ${
                        isUnlocked ? 'text-primary' : 'text-gray-500 dark:text-gray-400'
                      }`}>
                        {achievement.title}
                      </h4>
                      <span className={`text-xs px-2 py-1 rounded-full ${
                        isUnlocked 
                          ? 'bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-400'
                          : 'bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-400'
                      }`}>
                        {getRarityText(achievement.rarity)}
                      </span>
                    </div>
                    <p className={`text-sm mb-2 ${
                      isUnlocked ? 'text-secondary' : 'text-gray-400 dark:text-gray-500'
                    }`}>
                      {achievement.description}
                    </p>
                    <div className="flex items-center justify-between">
                      <span className={`text-xs font-medium ${
                        isUnlocked ? 'text-green-600 dark:text-green-400' : 'text-gray-400 dark:text-gray-500'
                      }`}>
                        {isUnlocked ? '✓ Разблокировано' : '🔒 Заблокировано'}
                      </span>
                      <span className={`text-xs font-medium ${
                        isUnlocked ? 'text-yellow-600 dark:text-yellow-400' : 'text-gray-400 dark:text-gray-500'
                      }`}>
                        +{achievement.reward.xp} XP
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}

export default Achievements


