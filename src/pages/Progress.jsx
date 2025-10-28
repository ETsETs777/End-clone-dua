import React, { useState, useEffect } from 'react'
import { 
  TrendingUp, 
  Calendar, 
  Target, 
  Award, 
  Clock,
  BookOpen,
  MessageCircle,
  BarChart3,
  PieChart,
  Activity
} from 'lucide-react'

const Progress = () => {
  const [timeRange, setTimeRange] = useState('week')
  const [stats, setStats] = useState({
    totalStudyTime: 0,
    wordsLearned: 0,
    grammarLessonsCompleted: 0,
    chatMessages: 0,
    streak: 0,
    level: 1,
    xp: 0,
    nextLevelXp: 100
  })

  // Имитация данных прогресса
  useEffect(() => {
    const mockStats = {
      week: {
        totalStudyTime: 420, // минуты
        wordsLearned: 15,
        grammarLessonsCompleted: 3,
        chatMessages: 25,
        streak: 5,
        level: 1,
        xp: 75,
        nextLevelXp: 100
      },
      month: {
        totalStudyTime: 1680,
        wordsLearned: 60,
        grammarLessonsCompleted: 12,
        chatMessages: 100,
        streak: 5,
        level: 2,
        xp: 150,
        nextLevelXp: 200
      },
      year: {
        totalStudyTime: 20160,
        wordsLearned: 720,
        grammarLessonsCompleted: 144,
        chatMessages: 1200,
        streak: 5,
        level: 5,
        xp: 450,
        nextLevelXp: 500
      }
    }
    setStats(mockStats[timeRange])
  }, [timeRange])

  const achievements = [
    {
      id: 1,
      title: 'Первые шаги',
      description: 'Изучите первое слово',
      icon: BookOpen,
      unlocked: true,
      progress: 100
    },
    {
      id: 2,
      title: 'Грамматик',
      description: 'Завершите 10 уроков грамматики',
      icon: Award,
      unlocked: stats.grammarLessonsCompleted >= 10,
      progress: Math.min((stats.grammarLessonsCompleted / 10) * 100, 100)
    },
    {
      id: 3,
      title: 'Словарный запас',
      description: 'Изучите 100 слов',
      icon: Target,
      unlocked: stats.wordsLearned >= 100,
      progress: Math.min((stats.wordsLearned / 100) * 100, 100)
    },
    {
      id: 4,
      title: 'Общительный',
      description: 'Отправьте 50 сообщений в чате',
      icon: MessageCircle,
      unlocked: stats.chatMessages >= 50,
      progress: Math.min((stats.chatMessages / 50) * 100, 100)
    },
    {
      id: 5,
      title: 'Трудолюбивый',
      description: 'Изучайте язык 7 дней подряд',
      icon: Calendar,
      unlocked: stats.streak >= 7,
      progress: Math.min((stats.streak / 7) * 100, 100)
    }
  ]

  const weeklyData = [
    { day: 'Пн', minutes: 45 },
    { day: 'Вт', minutes: 60 },
    { day: 'Ср', minutes: 30 },
    { day: 'Чт', minutes: 75 },
    { day: 'Пт', minutes: 90 },
    { day: 'Сб', minutes: 55 },
    { day: 'Вс', minutes: 65 }
  ]

  const maxMinutes = Math.max(...weeklyData.map(d => d.minutes))

  const formatTime = (minutes) => {
    const hours = Math.floor(minutes / 60)
    const mins = minutes % 60
    return hours > 0 ? `${hours}ч ${mins}м` : `${mins}м`
  }

  const getLevelProgress = () => {
    return (stats.xp / stats.nextLevelXp) * 100
  }

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Мой прогресс</h1>
          <p className="text-gray-600 mt-2">Отслеживайте свои достижения в изучении английского</p>
        </div>
        
        <div className="flex items-center space-x-3">
          <select
            value={timeRange}
            onChange={(e) => setTimeRange(e.target.value)}
            className="input-field w-32"
          >
            <option value="week">Неделя</option>
            <option value="month">Месяц</option>
            <option value="year">Год</option>
          </select>
        </div>
      </div>

      {/* Level Progress */}
      <div className="card bg-gradient-to-r from-blue-600 to-purple-600 text-white">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-2xl font-bold">Уровень {stats.level}</h2>
            <p className="opacity-90">Продолжайте изучать английский!</p>
          </div>
          <div className="text-right">
            <div className="text-3xl font-bold">{stats.xp} XP</div>
            <div className="text-sm opacity-90">до следующего уровня</div>
          </div>
        </div>
        <div className="w-full bg-white bg-opacity-20 rounded-full h-3">
          <div 
            className="bg-white h-3 rounded-full transition-all duration-500"
            style={{ width: `${getLevelProgress()}%` }}
          ></div>
        </div>
        <div className="flex justify-between text-sm mt-2 opacity-90">
          <span>{stats.xp} XP</span>
          <span>{stats.nextLevelXp} XP</span>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="card text-center">
          <div className="flex justify-center mb-3">
            <div className="flex items-center justify-center w-12 h-12 bg-blue-100 rounded-lg">
              <Clock className="w-6 h-6 text-blue-600" />
            </div>
          </div>
          <div className="text-2xl font-bold text-gray-900 mb-1">{formatTime(stats.totalStudyTime)}</div>
          <div className="text-gray-600">Время изучения</div>
        </div>

        <div className="card text-center">
          <div className="flex justify-center mb-3">
            <div className="flex items-center justify-center w-12 h-12 bg-green-100 rounded-lg">
              <BookOpen className="w-6 h-6 text-green-600" />
            </div>
          </div>
          <div className="text-2xl font-bold text-gray-900 mb-1">{stats.wordsLearned}</div>
          <div className="text-gray-600">Слов изучено</div>
        </div>

        <div className="card text-center">
          <div className="flex justify-center mb-3">
            <div className="flex items-center justify-center w-12 h-12 bg-purple-100 rounded-lg">
              <Award className="w-6 h-6 text-purple-600" />
            </div>
          </div>
          <div className="text-2xl font-bold text-gray-900 mb-1">{stats.grammarLessonsCompleted}</div>
          <div className="text-gray-600">Уроков грамматики</div>
        </div>

        <div className="card text-center">
          <div className="flex justify-center mb-3">
            <div className="flex items-center justify-center w-12 h-12 bg-orange-100 rounded-lg">
              <MessageCircle className="w-6 h-6 text-orange-600" />
            </div>
          </div>
          <div className="text-2xl font-bold text-gray-900 mb-1">{stats.chatMessages}</div>
          <div className="text-gray-600">Сообщений в чате</div>
        </div>
      </div>

      {/* Study Time Chart */}
      <div className="card">
        <h3 className="text-xl font-semibold mb-6">Активность по дням недели</h3>
        <div className="space-y-4">
          {weeklyData.map((data, index) => (
            <div key={index} className="flex items-center space-x-4">
              <div className="w-8 text-sm font-medium text-gray-600">{data.day}</div>
              <div className="flex-1 bg-gray-200 rounded-full h-3">
                <div 
                  className="bg-gradient-to-r from-blue-500 to-purple-500 h-3 rounded-full transition-all duration-500"
                  style={{ width: `${(data.minutes / maxMinutes) * 100}%` }}
                ></div>
              </div>
              <div className="w-16 text-sm text-gray-600 text-right">{data.minutes}м</div>
            </div>
          ))}
        </div>
      </div>

      {/* Achievements */}
      <div className="card">
        <h3 className="text-xl font-semibold mb-6">Достижения</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {achievements.map((achievement) => {
            const Icon = achievement.icon
            return (
              <div 
                key={achievement.id} 
                className={`p-4 rounded-lg border-2 transition-all ${
                  achievement.unlocked 
                    ? 'border-yellow-300 bg-yellow-50' 
                    : 'border-gray-200 bg-gray-50'
                }`}
              >
                <div className="flex items-center space-x-3 mb-3">
                  <div className={`flex items-center justify-center w-10 h-10 rounded-lg ${
                    achievement.unlocked ? 'bg-yellow-100' : 'bg-gray-100'
                  }`}>
                    <Icon className={`w-5 h-5 ${
                      achievement.unlocked ? 'text-yellow-600' : 'text-gray-400'
                    }`} />
                  </div>
                  <div className="flex-1">
                    <h4 className={`font-semibold ${
                      achievement.unlocked ? 'text-yellow-800' : 'text-gray-600'
                    }`}>
                      {achievement.title}
                    </h4>
                    <p className="text-sm text-gray-500">{achievement.description}</p>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Прогресс</span>
                    <span className="font-medium">{Math.round(achievement.progress)}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className={`h-2 rounded-full transition-all duration-500 ${
                        achievement.unlocked 
                          ? 'bg-gradient-to-r from-yellow-400 to-yellow-500' 
                          : 'bg-gradient-to-r from-blue-400 to-blue-500'
                      }`}
                      style={{ width: `${achievement.progress}%` }}
                    ></div>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* Streak */}
      <div className="card bg-gradient-to-r from-orange-50 to-red-50 border-orange-200">
        <div className="flex items-center space-x-4">
          <div className="flex items-center justify-center w-16 h-16 bg-orange-100 rounded-full">
            <Activity className="w-8 h-8 text-orange-600" />
          </div>
          <div className="flex-1">
            <h3 className="text-xl font-semibold text-gray-900 mb-1">Серия дней</h3>
            <p className="text-gray-600 mb-2">Изучайте английский каждый день для поддержания серии!</p>
            <div className="flex items-center space-x-2">
              <div className="text-3xl font-bold text-orange-600">{stats.streak}</div>
              <div className="text-gray-600">дней подряд</div>
            </div>
          </div>
          <div className="text-right">
            <div className="text-sm text-gray-600">Лучшая серия</div>
            <div className="text-2xl font-bold text-orange-600">7 дней</div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Progress
