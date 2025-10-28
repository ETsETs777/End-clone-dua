import React from 'react'
import { useAuth } from '../contexts/AuthContext'
import { Star, Trophy, Target, Zap } from 'lucide-react'

const UserProgress = () => {
  const { user, isAuthenticated } = useAuth()

  if (!isAuthenticated || !user) return null

  const getLevelProgress = () => {
    const currentLevelXp = user.level * 100
    const nextLevelXp = (user.level + 1) * 100
    const progress = ((user.xp % 100) / 100) * 100
    return { progress, currentLevelXp, nextLevelXp }
  }

  const { progress } = getLevelProgress()

  return (
    <div className="p-4 border-t border-gray-200 dark:border-gray-700">
      <div className="space-y-4">
        {/* User Info */}
        <div className="flex items-center space-x-3">
          <img 
            src={user.avatar} 
            alt={user.name}
            className="w-10 h-10 rounded-full border-2 border-blue-500"
          />
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-primary truncate">{user.name}</p>
            <p className="text-xs text-secondary">Уровень {user.level}</p>
          </div>
        </div>

        {/* Level Progress */}
        <div className="space-y-2">
          <div className="flex justify-between text-xs text-secondary">
            <span>Прогресс</span>
            <span>{user.xp} XP</span>
          </div>
          <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
            <div 
              className="bg-gradient-to-r from-blue-500 to-purple-500 h-2 rounded-full transition-all duration-500"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 gap-2">
          <div className="text-center p-2 bg-gray-50 dark:bg-gray-700 rounded-lg">
            <div className="flex items-center justify-center mb-1">
              <Zap className="w-4 h-4 text-yellow-500" />
            </div>
            <div className="text-xs font-medium text-primary">{user.streak}</div>
            <div className="text-xs text-secondary">дней</div>
          </div>
          <div className="text-center p-2 bg-gray-50 dark:bg-gray-700 rounded-lg">
            <div className="flex items-center justify-center mb-1">
              <Trophy className="w-4 h-4 text-purple-500" />
            </div>
            <div className="text-xs font-medium text-primary">{user.level}</div>
            <div className="text-xs text-secondary">уровень</div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="space-y-2">
          <button className="w-full text-left px-3 py-2 text-sm text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900 rounded-lg transition-colors flex items-center space-x-2">
            <Target className="w-4 h-4" />
            <span>Мои цели</span>
          </button>
          <button className="w-full text-left px-3 py-2 text-sm text-green-600 dark:text-green-400 hover:bg-green-50 dark:hover:bg-green-900 rounded-lg transition-colors flex items-center space-x-2">
            <Star className="w-4 h-4" />
            <span>Достижения</span>
          </button>
        </div>
      </div>
    </div>
  )
}

export default UserProgress


