import React, { useState, useEffect } from 'react'
import { Trophy, Flame, Gift, Star, Target, Award, TrendingUp, Zap, Crown, Medal } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import toast from 'react-hot-toast'
import progressService from '../services/progressService'
import { useAuth } from '../contexts/AuthContext'

const GamificationSystem = () => {
  const { user, addXP, updateStreak } = useAuth()
  const [dailyChallenges, setDailyChallenges] = useState([])
  const [currentStreak, setCurrentStreak] = useState(0)
  const [totalXP, setTotalXP] = useState(0)
  const [level, setLevel] = useState(1)
  const [rewards, setRewards] = useState([])
  const [showRewardAnimation, setShowRewardAnimation] = useState(false)
  const [earnedReward, setEarnedReward] = useState(null)

  useEffect(() => {
    loadGamificationData()
    generateDailyChallenges()
  }, [])

  const loadGamificationData = () => {
    const progress = progressService.getProgress()
    setTotalXP(progress.xp)
    setCurrentStreak(progress.streak)
    setLevel(calculateLevel(progress.xp))
    
    const savedRewards = JSON.parse(localStorage.getItem('earned_rewards') || '[]')
    setRewards(savedRewards)
  }

  const calculateLevel = (xp) => {
    return Math.floor(xp / 100) + 1
  }

  const generateDailyChallenges = () => {
    const today = new Date().toDateString()
    const savedChallenges = JSON.parse(localStorage.getItem('daily_challenges') || '{}')
    
    // Check if challenges are for today
    if (savedChallenges.date === today) {
      setDailyChallenges(savedChallenges.challenges)
      return
    }

    // Generate new challenges
    const allChallenges = [
      { id: 1, title: 'Выучите 5 новых слов', xp: 50, icon: '📚', type: 'vocabulary', target: 5, current: 0 },
      { id: 2, title: 'Пообщайтесь с AI 10 минут', xp: 30, icon: '💬', type: 'chat', target: 10, current: 0 },
      { id: 3, title: 'Выполните 3 упражнения', xp: 40, icon: '✏️', type: 'exercises', target: 3, current: 0 },
      { id: 4, title: 'Практикуйте произношение 5 раз', xp: 35, icon: '🎤', type: 'pronunciation', target: 5, current: 0 },
      { id: 5, title: 'Изучите 2 правила грамматики', xp: 45, icon: '📖', type: 'grammar', target: 2, current: 0 },
      { id: 6, title: 'Прочитайте текст и ответьте на вопросы', xp: 40, icon: '📝', type: 'reading', target: 1, current: 0 },
      { id: 7, title: 'Переведите 10 предложений', xp: 35, icon: '🌐', type: 'translation', target: 10, current: 0 },
    ]

    // Select 3 random challenges
    const shuffled = allChallenges.sort(() => 0.5 - Math.random())
    const selected = shuffled.slice(0, 3)

    const challengesData = {
      date: today,
      challenges: selected
    }

    localStorage.setItem('daily_challenges', JSON.stringify(challengesData))
    setDailyChallenges(selected)
  }

  const completechallenge = (challengeId) => {
    const challenge = dailyChallenges.find(c => c.id === challengeId)
    if (!challenge || challenge.current >= challenge.target) return

    const updatedChallenges = dailyChallenges.map(c => {
      if (c.id === challengeId) {
        const newCurrent = c.current + 1
        const isCompleted = newCurrent >= c.target

        if (isCompleted && newCurrent === c.target) {
          // Award XP
          addXP(c.xp)
          progressService.addXP(c.xp)
          
          // Show reward animation
          showReward(c)
          
          toast.success(`Задание выполнено! +${c.xp} XP`, { icon: '🎉', duration: 3000 })
        }

        return { ...c, current: newCurrent, completed: isCompleted }
      }
      return c
    })

    setDailyChallenges(updatedChallenges)
    
    // Save to localStorage
    const today = new Date().toDateString()
    localStorage.setItem('daily_challenges', JSON.stringify({
      date: today,
      challenges: updatedChallenges
    }))
  }

  const showReward = (challenge) => {
    const reward = {
      title: challenge.title,
      xp: challenge.xp,
      icon: challenge.icon
    }
    setEarnedReward(reward)
    setShowRewardAnimation(true)

    // Add to earned rewards
    const newRewards = [...rewards, { ...reward, earnedAt: new Date().toISOString() }]
    setRewards(newRewards)
    localStorage.setItem('earned_rewards', JSON.stringify(newRewards))

    // Hide animation after 3 seconds
    setTimeout(() => {
      setShowRewardAnimation(false)
    }, 3000)
  }

  const getStreakBonus = () => {
    if (currentStreak >= 30) return { text: 'Легенда! 🏆', bonus: 100 }
    if (currentStreak >= 14) return { text: 'Чемпион! 👑', bonus: 50 }
    if (currentStreak >= 7) return { text: 'Мастер! 💪', bonus: 25 }
    if (currentStreak >= 3) return { text: 'Отличное начало! ⭐', bonus: 10 }
    return { text: 'Продолжайте! 🎯', bonus: 0 }
  }

  const getLevelProgress = () => {
    const xpForNextLevel = level * 100
    const xpInCurrentLevel = totalXP % 100
    return Math.round((xpInCurrentLevel / 100) * 100)
  }

  const streakBonus = getStreakBonus()
  const levelProgress = getLevelProgress()

  return (
    <div className="max-w-6xl mx-auto animate-fade-in space-y-6">
      {/* Reward Animation */}
      <AnimatePresence>
        {showRewardAnimation && earnedReward && (
          <motion.div
            initial={{ opacity: 0, scale: 0.5, y: 50 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.5, y: -50 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm"
          >
            <motion.div
              initial={{ rotate: -10 }}
              animate={{ rotate: [0, 10, -10, 0] }}
              transition={{ duration: 0.5, repeat: 2 }}
              className="bg-white dark:bg-gray-800 rounded-3xl p-8 shadow-2xl max-w-md"
            >
              <div className="text-center">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ duration: 0.5, repeat: 3 }}
                  className="text-8xl mb-4"
                >
                  {earnedReward.icon}
                </motion.div>
                <h2 className="text-3xl font-bold text-primary mb-2">
                  Задание выполнено!
                </h2>
                <p className="text-lg text-secondary mb-4">{earnedReward.title}</p>
                <div className="flex items-center justify-center space-x-2 text-2xl font-bold text-yellow-600">
                  <Star className="w-8 h-8 fill-yellow-600" />
                  <span>+{earnedReward.xp} XP</span>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="card-premium glass-effect-premium relative overflow-hidden">
          <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-yellow-400/20 to-orange-500/20 rounded-full blur-2xl"></div>
          <div className="relative">
            <div className="flex items-center justify-between mb-2">
              <Crown className="w-8 h-8 text-yellow-600" />
              <span className="text-xs font-semibold text-secondary">Уровень</span>
            </div>
            <div className="text-3xl font-bold text-primary mb-1">{level}</div>
            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
              <div
                className="bg-gradient-to-r from-yellow-500 to-orange-500 h-2 rounded-full transition-all duration-500"
                style={{ width: `${levelProgress}%` }}
              />
            </div>
            <div className="text-xs text-secondary mt-1">{levelProgress}% до уровня {level + 1}</div>
          </div>
        </div>

        <div className="card-premium glass-effect-premium relative overflow-hidden">
          <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-blue-400/20 to-purple-500/20 rounded-full blur-2xl"></div>
          <div className="relative">
            <div className="flex items-center justify-between mb-2">
              <Star className="w-8 h-8 text-blue-600 fill-blue-600" />
              <span className="text-xs font-semibold text-secondary">Опыт</span>
            </div>
            <div className="text-3xl font-bold text-primary">{totalXP}</div>
            <div className="text-xs text-secondary">Общий XP</div>
          </div>
        </div>

        <div className="card-premium glass-effect-premium relative overflow-hidden">
          <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-red-400/20 to-orange-500/20 rounded-full blur-2xl"></div>
          <div className="relative">
            <div className="flex items-center justify-between mb-2">
              <Flame className="w-8 h-8 text-orange-600" />
              <span className="text-xs font-semibold text-secondary">Серия</span>
            </div>
            <div className="text-3xl font-bold text-primary">{currentStreak}</div>
            <div className="text-xs text-secondary">{streakBonus.text}</div>
          </div>
        </div>

        <div className="card-premium glass-effect-premium relative overflow-hidden">
          <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-green-400/20 to-emerald-500/20 rounded-full blur-2xl"></div>
          <div className="relative">
            <div className="flex items-center justify-between mb-2">
              <Trophy className="w-8 h-8 text-green-600" />
              <span className="text-xs font-semibold text-secondary">Награды</span>
            </div>
            <div className="text-3xl font-bold text-primary">{rewards.length}</div>
            <div className="text-xs text-secondary">Получено</div>
          </div>
        </div>
      </div>

      {/* Daily Challenges */}
      <div className="card-premium glass-effect-premium">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl flex items-center justify-center">
              <Target className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-primary">Ежедневные задания</h2>
              <p className="text-sm text-secondary">Выполните все задания для бонуса</p>
            </div>
          </div>
          <button
            onClick={generateDailyChallenges}
            className="px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl text-sm font-semibold hover:from-blue-700 hover:to-purple-700 transition-all duration-200 shadow-lg hover:shadow-xl"
          >
            Обновить
          </button>
        </div>

        <div className="space-y-4">
          {dailyChallenges.map((challenge) => {
            const progress = Math.round((challenge.current / challenge.target) * 100)
            const isCompleted = challenge.current >= challenge.target

            return (
              <div
                key={challenge.id}
                className={`p-4 rounded-xl border-2 transition-all duration-300 ${
                  isCompleted
                    ? 'bg-green-50 dark:bg-green-900/20 border-green-500'
                    : 'bg-gray-50 dark:bg-gray-800/50 border-gray-200 dark:border-gray-700 hover:border-blue-400'
                }`}
              >
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center space-x-3">
                    <span className="text-3xl">{challenge.icon}</span>
                    <div>
                      <h3 className="font-semibold text-primary">{challenge.title}</h3>
                      <p className="text-xs text-secondary">
                        {challenge.current} / {challenge.target} выполнено
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="flex items-center space-x-1 text-yellow-600 font-bold">
                      <Star className="w-4 h-4 fill-yellow-600" />
                      <span>{challenge.xp} XP</span>
                    </div>
                    {!isCompleted && (
                      <button
                        onClick={() => completechallenge(challenge.id)}
                        className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-semibold hover:bg-blue-700 transition-colors"
                      >
                        +1
                      </button>
                    )}
                    {isCompleted && (
                      <div className="flex items-center space-x-1 text-green-600 font-semibold">
                        <Award className="w-5 h-5" />
                        <span>Готово</span>
                      </div>
                    )}
                  </div>
                </div>
                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                  <div
                    className={`h-2 rounded-full transition-all duration-500 ${
                      isCompleted
                        ? 'bg-gradient-to-r from-green-500 to-emerald-500'
                        : 'bg-gradient-to-r from-blue-500 to-purple-500'
                    }`}
                    style={{ width: `${Math.min(progress, 100)}%` }}
                  />
                </div>
              </div>
            )
          })}
        </div>

        {dailyChallenges.every(c => c.completed) && (
          <div className="mt-6 p-4 bg-gradient-to-r from-yellow-50 to-orange-50 dark:from-yellow-900/20 dark:to-orange-900/20 rounded-xl border-2 border-yellow-400">
            <div className="flex items-center space-x-3">
              <Trophy className="w-8 h-8 text-yellow-600" />
              <div>
                <h3 className="font-bold text-primary">Все задания выполнены!</h3>
                <p className="text-sm text-secondary">Отличная работа! Возвращайтесь завтра за новыми заданиями.</p>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Streak Calendar */}
      <div className="card-premium glass-effect-premium">
        <div className="flex items-center space-x-3 mb-6">
          <div className="w-12 h-12 bg-gradient-to-r from-orange-600 to-red-600 rounded-2xl flex items-center justify-center">
            <Flame className="w-6 h-6 text-white" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-primary">Серия активности</h2>
            <p className="text-sm text-secondary">Занимайтесь каждый день чтобы не потерять серию</p>
          </div>
        </div>

        <div className="bg-gradient-to-r from-orange-50 to-red-50 dark:from-orange-900/20 dark:to-red-900/20 p-6 rounded-2xl">
          <div className="text-center mb-4">
            <div className="text-6xl font-bold text-orange-600 mb-2">{currentStreak}</div>
            <div className="text-lg text-secondary">дней подряд</div>
          </div>

          <div className="grid grid-cols-7 gap-2">
            {[...Array(7)].map((_, i) => {
              const dayIndex = 6 - i
              const isActive = dayIndex < currentStreak
              return (
                <div
                  key={i}
                  className={`aspect-square rounded-lg flex items-center justify-center transition-all duration-200 ${
                    isActive
                      ? 'bg-gradient-to-br from-orange-500 to-red-500 text-white shadow-lg'
                      : 'bg-gray-200 dark:bg-gray-700 text-gray-400'
                  }`}
                >
                  {isActive ? <Flame className="w-4 h-4" /> : <div className="w-4 h-4" />}
                </div>
              )
            })}
          </div>

          {currentStreak > 0 && (
            <div className="mt-4 text-center text-sm text-secondary">
              {streakBonus.bonus > 0 && (
                <span className="text-orange-600 font-semibold">
                  Бонус за серию: +{streakBonus.bonus} XP в день!
                </span>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Recent Rewards */}
      {rewards.length > 0 && (
        <div className="card-premium glass-effect-premium">
          <div className="flex items-center space-x-3 mb-6">
            <div className="w-12 h-12 bg-gradient-to-r from-pink-600 to-purple-600 rounded-2xl flex items-center justify-center">
              <Gift className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-primary">Последние награды</h2>
              <p className="text-sm text-secondary">Ваши достижения</p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {rewards.slice(-6).reverse().map((reward, index) => (
              <div
                key={index}
                className="p-4 bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 rounded-xl border-2 border-purple-200 dark:border-purple-800"
              >
                <div className="text-4xl mb-2">{reward.icon}</div>
                <h3 className="font-semibold text-primary text-sm mb-1">{reward.title}</h3>
                <div className="flex items-center space-x-1 text-xs text-yellow-600 font-bold">
                  <Star className="w-3 h-3 fill-yellow-600" />
                  <span>+{reward.xp} XP</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Leaderboard Preview */}
      <div className="card-premium glass-effect-premium">
        <div className="flex items-center space-x-3 mb-6">
          <div className="w-12 h-12 bg-gradient-to-r from-indigo-600 to-blue-600 rounded-2xl flex items-center justify-center">
            <TrendingUp className="w-6 h-6 text-white" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-primary">Лидерборд</h2>
            <p className="text-sm text-secondary">Топ учеников (скоро)</p>
          </div>
        </div>

        <div className="text-center py-8 text-secondary">
          <Medal className="w-16 h-16 mx-auto mb-4 text-gray-400" />
          <p>Система рейтингов появится в следующем обновлении</p>
        </div>
      </div>
    </div>
  )
}

export default GamificationSystem


