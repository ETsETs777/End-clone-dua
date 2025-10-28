import React from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { 
  Star, 
  Trophy, 
  Target, 
  Zap, 
  MessageCircle, 
  BookOpen, 
  GraduationCap,
  BarChart3,
  TrendingUp,
  Calendar,
  Award,
  Brain,
  Sparkles
} from 'lucide-react'

const TopWidgets = () => {
  const { user, isAuthenticated } = useAuth()

  if (!isAuthenticated || !user) {
    return (
      <div className="mb-6">
        <div className="bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 rounded-2xl p-6 text-white shadow-2xl animate-fade-in">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="flex items-center justify-center w-16 h-16 bg-white/20 rounded-2xl backdrop-blur-sm">
                <Brain className="w-8 h-8 text-white" />
              </div>
              <div>
                <h3 className="text-2xl font-bold mb-2">Добро пожаловать в English Assistant!</h3>
                <p className="text-blue-100 text-lg">Начните изучение английского языка с ИИ</p>
              </div>
            </div>
            <Link 
              to="/chat" 
              className="bg-white text-blue-600 px-6 py-3 rounded-xl font-semibold text-lg hover:bg-gray-100 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105 flex items-center space-x-2"
            >
              <Sparkles className="w-5 h-5" />
              <span>Начать обучение</span>
            </Link>
          </div>
        </div>
      </div>
    )
  }

  const getLevelProgress = () => {
    const currentLevelXp = user.level * 100
    const nextLevelXp = (user.level + 1) * 100
    const progress = ((user.xp % 100) / 100) * 100
    return { progress, currentLevelXp, nextLevelXp }
  }

  const { progress } = getLevelProgress()

  return (
    <div className="mb-8 space-y-6">
      {/* Main User Widget */}
      <div className="bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 rounded-3xl p-8 text-white shadow-2xl animate-fade-in relative overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 right-0 w-40 h-40 bg-white rounded-full transform translate-x-20 -translate-y-20 animate-pulse-slow"></div>
          <div className="absolute bottom-0 left-0 w-32 h-32 bg-white rounded-full transform -translate-x-16 translate-y-16 animate-pulse-slow"></div>
        </div>
        
        <div className="relative z-10">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-6">
              <img
                src={user.avatar}
                alt={user.name}
                className="w-20 h-20 rounded-3xl border-4 border-white/30 shadow-2xl"
              />
              <div>
                <h3 className="text-3xl font-bold mb-2">Привет, {user.name}!</h3>
                <p className="text-blue-100 text-xl mb-4">Продолжайте изучение английского</p>
                <div className="flex items-center space-x-6">
                  <div className="flex items-center space-x-2">
                    <Trophy className="w-5 h-5" />
                    <span className="text-lg font-semibold">Уровень {user.level}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Zap className="w-5 h-5" />
                    <span className="text-lg font-semibold">{user.xp} XP</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Calendar className="w-5 h-5" />
                    <span className="text-lg font-semibold">{user.streak || 0} дней</span>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Quick Action Buttons */}
            <div className="flex flex-col space-y-4">
              <Link 
                to="/chat" 
                className="bg-white/20 backdrop-blur-sm text-white px-8 py-4 rounded-2xl font-bold text-lg hover:bg-white/30 transition-all duration-300 shadow-xl hover:shadow-2xl transform hover:scale-105 flex items-center space-x-3"
              >
                <MessageCircle className="w-6 h-6" />
                <span>Чат с ИИ</span>
              </Link>
              
              <Link 
                to="/exercises" 
                className="bg-white/20 backdrop-blur-sm text-white px-8 py-4 rounded-2xl font-bold text-lg hover:bg-white/30 transition-all duration-300 shadow-xl hover:shadow-2xl transform hover:scale-105 flex items-center space-x-3"
              >
                <Brain className="w-6 h-6" />
                <span>Упражнения</span>
              </Link>
              
              <Link 
                to="/vocabulary" 
                className="bg-white/20 backdrop-blur-sm text-white px-8 py-4 rounded-2xl font-bold text-lg hover:bg-white/30 transition-all duration-300 shadow-xl hover:shadow-2xl transform hover:scale-105 flex items-center space-x-3"
              >
                <BookOpen className="w-6 h-6" />
                <span>Словарь</span>
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {/* Progress Widget */}
        <div className="bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900 dark:to-emerald-900 rounded-3xl shadow-xl dark:shadow-2xl border border-green-200 dark:border-green-700 p-6 animate-slide-up hover:scale-110 transition-all duration-500 hover:shadow-2xl">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-green-100 dark:bg-green-800 rounded-2xl flex items-center justify-center shadow-lg">
                <TrendingUp className="w-6 h-6 text-green-600 dark:text-green-400" />
              </div>
              <span className="font-bold text-gray-900 dark:text-gray-100 text-lg">Прогресс</span>
            </div>
            <span className="text-2xl font-bold text-green-600 dark:text-green-400">{Math.round(progress)}%</span>
          </div>
          <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-4 mb-3">
            <div
              className="bg-gradient-to-r from-green-500 to-emerald-500 h-4 rounded-full transition-all duration-500 shadow-sm"
              style={{ width: `${progress}%` }}
            />
          </div>
          <p className="text-sm text-gray-600 dark:text-gray-400 font-medium">
            {100 - (user.xp % 100)} XP до следующего уровня
          </p>
        </div>

        {/* Quick Actions Widget */}
        <div className="bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900 dark:to-indigo-900 rounded-3xl shadow-xl dark:shadow-2xl border border-blue-200 dark:border-blue-700 p-6 animate-slide-up hover:scale-110 transition-all duration-500 hover:shadow-2xl">
          <div className="flex items-center space-x-3 mb-4">
            <div className="w-12 h-12 bg-blue-100 dark:bg-blue-800 rounded-2xl flex items-center justify-center shadow-lg">
              <Sparkles className="w-6 h-6 text-blue-600 dark:text-blue-400" />
            </div>
            <span className="font-bold text-gray-900 dark:text-gray-100 text-lg">Быстрые действия</span>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <Link to="/chat" className="bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 text-sm flex items-center justify-center space-x-2 py-3 rounded-xl hover:bg-blue-100 dark:hover:bg-blue-800 transition-colors font-medium">
              <MessageCircle className="w-4 h-4" />
              <span>Чат</span>
            </Link>
            <Link to="/vocabulary" className="bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 text-sm flex items-center justify-center space-x-2 py-3 rounded-xl hover:bg-blue-100 dark:hover:bg-blue-800 transition-colors font-medium">
              <BookOpen className="w-4 h-4" />
              <span>Словарь</span>
            </Link>
            <Link to="/achievements" className="bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 text-sm flex items-center justify-center space-x-2 py-3 rounded-xl hover:bg-blue-100 dark:hover:bg-blue-800 transition-colors font-medium">
              <Trophy className="w-4 h-4" />
              <span>Достижения</span>
            </Link>
            <Link to="/progress" className="bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 text-sm flex items-center justify-center space-x-2 py-3 rounded-xl hover:bg-blue-100 dark:hover:bg-blue-800 transition-colors font-medium">
              <BarChart3 className="w-4 h-4" />
              <span>Прогресс</span>
            </Link>
          </div>
        </div>

        {/* Achievements Widget */}
        <div className="bg-gradient-to-br from-yellow-50 to-orange-50 dark:from-yellow-900 dark:to-orange-900 rounded-3xl shadow-xl dark:shadow-2xl border border-yellow-200 dark:border-yellow-700 p-6 animate-slide-up hover:scale-110 transition-all duration-500 hover:shadow-2xl">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-yellow-100 dark:bg-yellow-800 rounded-2xl flex items-center justify-center shadow-lg">
                <Award className="w-6 h-6 text-yellow-600 dark:text-yellow-400" />
              </div>
              <span className="font-bold text-gray-900 dark:text-gray-100 text-lg">Достижения</span>
            </div>
            <span className="text-2xl font-bold text-yellow-600 dark:text-yellow-400">
              {user.achievements?.length || 0}
            </span>
          </div>
          <div className="space-y-3">
            <div className="flex justify-between text-sm text-gray-600 dark:text-gray-400 font-medium">
              <span>Разблокировано</span>
              <span>{user.achievements?.length || 0}</span>
            </div>
            <div className="flex justify-between text-sm text-gray-600 dark:text-gray-400 font-medium">
              <span>Осталось</span>
              <span>{6 - (user.achievements?.length || 0)}</span>
            </div>
          </div>
          <Link to="/achievements" className="bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 text-sm w-full mt-4 flex items-center justify-center space-x-2 py-3 rounded-xl hover:bg-yellow-100 dark:hover:bg-yellow-800 transition-colors font-medium">
            <Trophy className="w-4 h-4" />
            <span>Посмотреть все</span>
          </Link>
        </div>

        {/* Study Streak Widget */}
        <div className="bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-900 dark:to-pink-900 rounded-3xl shadow-xl dark:shadow-2xl border border-purple-200 dark:border-purple-700 p-6 animate-slide-up hover:scale-110 transition-all duration-500 hover:shadow-2xl">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-purple-100 dark:bg-purple-800 rounded-2xl flex items-center justify-center shadow-lg">
                <Calendar className="w-6 h-6 text-purple-600 dark:text-purple-400" />
              </div>
              <span className="font-bold text-gray-900 dark:text-gray-100 text-lg">Серия дней</span>
            </div>
            <span className="text-2xl font-bold text-purple-600 dark:text-purple-400">
              {user.streak || 0}
            </span>
          </div>
          <div className="text-center">
            <div className="text-4xl font-bold text-purple-600 dark:text-purple-400 mb-2">
              {user.streak || 0}
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400 font-medium">дней подряд</div>
          </div>
          <div className="mt-4 text-xs text-gray-600 dark:text-gray-400 text-center font-medium">
            Изучайте каждый день для поддержания серии!
          </div>
        </div>
      </div>
    </div>
  )
}

export default TopWidgets
