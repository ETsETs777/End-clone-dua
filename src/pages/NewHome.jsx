import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import {
  Brain, MessageCircle, BookOpen, Target, Trophy, Flame, Star,
  TrendingUp, Zap, Award, Clock, CheckCircle, ArrowRight,
  PlayCircle, Mic, FileText, BarChart3, Calendar, Users,
  Sparkles, Rocket, Heart, Coffee, Sun, Moon
} from 'lucide-react'
import { useAuth } from '../contexts/AuthContext'
import progressService from '../services/progressService'

const NewHome = () => {
  const { user, isAuthenticated, updateStreak } = useAuth()
  const [progress, setProgress] = useState(null)
  const [achievements, setAchievements] = useState([])
  const [greeting, setGreeting] = useState('')
  const [dailyGoal, setDailyGoal] = useState({ current: 0, target: 15 })
  const [weeklyStats, setWeeklyStats] = useState(null)

  useEffect(() => {
    loadData()
    setGreetingMessage()
    if (isAuthenticated) {
      updateStreak()
    }
  }, [isAuthenticated])

  const loadData = () => {
    const prog = progressService.getProgress()
    const ach = progressService.getAchievements()
    const weekly = progressService.getWeeklyProgress()
    
    setProgress(prog)
    setAchievements(ach.filter(a => a.unlocked).slice(0, 6))
    setWeeklyStats(weekly)
    
    // Calculate daily goal
    const todayMinutes = Math.min(prog.studyTime % 1440, dailyGoal.target)
    setDailyGoal({ current: todayMinutes, target: 15 })
  }

  const setGreetingMessage = () => {
    const hour = new Date().getHours()
    if (hour < 6) setGreeting('Доброй ночи')
    else if (hour < 12) setGreeting('Доброе утро')
    else if (hour < 18) setGreeting('Добрый день')
    else setGreeting('Добрый вечер')
  }

  const quickActions = [
    {
      id: 1,
      title: 'Чат с AI',
      description: 'Практикуйте английский в диалоге',
      icon: MessageCircle,
      color: 'from-blue-500 to-cyan-500',
      path: '/chat',
      badge: 'Популярно'
    },
    {
      id: 2,
      title: 'Упражнения',
      description: 'Интерактивные задания',
      icon: PlayCircle,
      color: 'from-green-500 to-emerald-500',
      path: '/exercises',
      badge: 'Новое'
    },
    {
      id: 3,
      title: 'Произношение',
      description: 'Практика с AI распознаванием',
      icon: Mic,
      color: 'from-purple-500 to-pink-500',
      path: '/pronunciation',
      badge: null
    },
    {
      id: 4,
      title: 'Словарь',
      description: 'Ваши сохраненные слова',
      icon: BookOpen,
      color: 'from-orange-500 to-red-500',
      path: '/vocabulary',
      badge: null
    }
  ]

  const learningPaths = [
    {
      title: 'Начинающий',
      level: 'A1-A2',
      lessons: 24,
      progress: 45,
      icon: Rocket,
      color: 'text-green-600',
      bg: 'bg-green-50 dark:bg-green-900/20'
    },
    {
      title: 'Средний',
      level: 'B1-B2',
      lessons: 36,
      progress: 20,
      icon: Target,
      color: 'text-blue-600',
      bg: 'bg-blue-50 dark:bg-blue-900/20'
    },
    {
      title: 'Продвинутый',
      level: 'C1-C2',
      lessons: 48,
      progress: 0,
      icon: Trophy,
      color: 'text-purple-600',
      bg: 'bg-purple-50 dark:bg-purple-900/20'
    }
  ]

  const todayTasks = [
    { id: 1, title: 'Выучить 5 новых слов', completed: true, xp: 50 },
    { id: 2, title: 'Пообщаться с AI 10 минут', completed: true, xp: 30 },
    { id: 3, title: 'Выполнить 3 упражнения', completed: false, xp: 40 },
    { id: 4, title: 'Практиковать произношение', completed: false, xp: 35 }
  ]

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  }

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { type: 'spring', stiffness: 100 }
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {/* Hero Section */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-12"
        >
          <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 p-8 md:p-12 shadow-2xl">
            <div className="absolute top-0 right-0 -mt-4 -mr-4 w-64 h-64 bg-white/10 rounded-full blur-3xl"></div>
            <div className="absolute bottom-0 left-0 -mb-4 -ml-4 w-64 h-64 bg-white/10 rounded-full blur-3xl"></div>
            
            <div className="relative z-10">
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-16 h-16 bg-white/20 backdrop-blur-xl rounded-2xl flex items-center justify-center">
                  <Brain className="w-8 h-8 text-white" />
                </div>
                <div>
                  <h1 className="text-4xl md:text-5xl font-bold text-white mb-2">
                    {greeting}!
                  </h1>
                  <p className="text-xl text-white/90">
                    {isAuthenticated ? `Рады видеть вас, ${user?.name}` : 'Добро пожаловать в English Assistant'}
                  </p>
                </div>
              </div>

              {/* Progress Bar */}
              {isAuthenticated && progress && (
                <div className="mt-8 bg-white/10 backdrop-blur-xl rounded-2xl p-6">
                  <div className="flex justify-between items-center mb-3">
                    <span className="text-white font-semibold">Дневная цель</span>
                    <span className="text-white/90">{dailyGoal.current} / {dailyGoal.target} минут</span>
                  </div>
                  <div className="w-full bg-white/20 rounded-full h-4 overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${(dailyGoal.current / dailyGoal.target) * 100}%` }}
                      transition={{ duration: 1, ease: 'easeOut' }}
                      className="h-full bg-gradient-to-r from-yellow-400 to-orange-400 rounded-full flex items-center justify-end pr-2"
                    >
                      {dailyGoal.current >= dailyGoal.target && (
                        <CheckCircle className="w-4 h-4 text-white" />
                      )}
                    </motion.div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </motion.div>

        {/* Stats Grid */}
        {isAuthenticated && progress && (
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12"
          >
            <motion.div variants={itemVariants} className="relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-orange-500 to-red-500 opacity-10 rounded-2xl"></div>
              <div className="relative bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-xl border border-gray-200 dark:border-gray-700">
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-red-500 rounded-xl flex items-center justify-center">
                    <Flame className="w-6 h-6 text-white" />
                  </div>
                  <span className="text-3xl">🔥</span>
                </div>
                <h3 className="text-gray-600 dark:text-gray-400 text-sm font-medium mb-1">Серия</h3>
                <p className="text-3xl font-bold text-gray-900 dark:text-white">{progress.streak} дней</p>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">Не прерывайте серию!</p>
              </div>
            </motion.div>

            <motion.div variants={itemVariants} className="relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-blue-500 to-cyan-500 opacity-10 rounded-2xl"></div>
              <div className="relative bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-xl border border-gray-200 dark:border-gray-700">
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-xl flex items-center justify-center">
                    <Star className="w-6 h-6 text-white" />
                  </div>
                  <span className="text-3xl">⭐</span>
                </div>
                <h3 className="text-gray-600 dark:text-gray-400 text-sm font-medium mb-1">Опыт (XP)</h3>
                <p className="text-3xl font-bold text-gray-900 dark:text-white">{progress.xp}</p>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">Уровень: {progress.level}</p>
              </div>
            </motion.div>

            <motion.div variants={itemVariants} className="relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-green-500 to-emerald-500 opacity-10 rounded-2xl"></div>
              <div className="relative bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-xl border border-gray-200 dark:border-gray-700">
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-emerald-500 rounded-xl flex items-center justify-center">
                    <BookOpen className="w-6 h-6 text-white" />
                  </div>
                  <span className="text-3xl">📚</span>
                </div>
                <h3 className="text-gray-600 dark:text-gray-400 text-sm font-medium mb-1">Слов выучено</h3>
                <p className="text-3xl font-bold text-gray-900 dark:text-white">{progress.totalWords}</p>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">Продолжайте учить!</p>
              </div>
            </motion.div>

            <motion.div variants={itemVariants} className="relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-purple-500 to-pink-500 opacity-10 rounded-2xl"></div>
              <div className="relative bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-xl border border-gray-200 dark:border-gray-700">
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center">
                    <Trophy className="w-6 h-6 text-white" />
                  </div>
                  <span className="text-3xl">🏆</span>
                </div>
                <h3 className="text-gray-600 dark:text-gray-400 text-sm font-medium mb-1">Достижения</h3>
                <p className="text-3xl font-bold text-gray-900 dark:text-white">{achievements.length}</p>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">Разблокировано</p>
              </div>
            </motion.div>
          </motion.div>
        )}

        {/* Quick Actions */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="mb-12"
        >
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 flex items-center">
            <Zap className="w-6 h-6 mr-2 text-yellow-500" />
            Быстрые действия
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {quickActions.map((action) => {
              const Icon = action.icon
              return (
                <motion.div key={action.id} variants={itemVariants}>
                  <Link to={action.path}>
                    <div className="group relative overflow-hidden bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-xl border border-gray-200 dark:border-gray-700 hover:shadow-2xl transition-all duration-300 hover:-translate-y-1">
                      <div className={`absolute inset-0 bg-gradient-to-br ${action.color} opacity-0 group-hover:opacity-10 transition-opacity duration-300`}></div>
                      
                      {action.badge && (
                        <span className="absolute top-4 right-4 px-2 py-1 bg-gradient-to-r from-yellow-400 to-orange-400 text-white text-xs font-bold rounded-full">
                          {action.badge}
                        </span>
                      )}
                      
                      <div className={`w-14 h-14 bg-gradient-to-br ${action.color} rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300`}>
                        <Icon className="w-7 h-7 text-white" />
                      </div>
                      
                      <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">
                        {action.title}
                      </h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                        {action.description}
                      </p>
                      
                      <div className="flex items-center text-sm font-semibold text-blue-600 dark:text-blue-400 group-hover:text-blue-700 dark:group-hover:text-blue-300">
                        Начать
                        <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform duration-300" />
                      </div>
                    </div>
                  </Link>
                </motion.div>
              )
            })}
          </div>
        </motion.div>

        {/* Today's Tasks */}
        {isAuthenticated && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="mb-12"
          >
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 flex items-center">
              <Target className="w-6 h-6 mr-2 text-blue-500" />
              Задания на сегодня
            </h2>
            <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-xl border border-gray-200 dark:border-gray-700">
              <div className="space-y-4">
                {todayTasks.map((task) => (
                  <div key={task.id} className={`flex items-center justify-between p-4 rounded-xl ${task.completed ? 'bg-green-50 dark:bg-green-900/20' : 'bg-gray-50 dark:bg-gray-700/50'}`}>
                    <div className="flex items-center space-x-4">
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center ${task.completed ? 'bg-green-500' : 'bg-gray-300 dark:bg-gray-600'}`}>
                        {task.completed ? (
                          <CheckCircle className="w-6 h-6 text-white" />
                        ) : (
                          <div className="w-4 h-4 rounded-full border-2 border-gray-500"></div>
                        )}
                      </div>
                      <div>
                        <h3 className={`font-semibold ${task.completed ? 'text-gray-500 line-through' : 'text-gray-900 dark:text-white'}`}>
                          {task.title}
                        </h3>
                        <p className="text-xs text-gray-500 dark:text-gray-400">+{task.xp} XP</p>
                      </div>
                    </div>
                    {!task.completed && (
                      <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-semibold">
                        Начать
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        )}

        {/* Learning Paths */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 flex items-center">
            <TrendingUp className="w-6 h-6 mr-2 text-purple-500" />
            Пути обучения
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {learningPaths.map((path, index) => {
              const Icon = path.icon
              return (
                <div key={index} className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-xl border border-gray-200 dark:border-gray-700 hover:shadow-2xl transition-all duration-300 hover:-translate-y-1">
                  <div className={`w-14 h-14 ${path.bg} rounded-xl flex items-center justify-center mb-4`}>
                    <Icon className={`w-7 h-7 ${path.color}`} />
                  </div>
                  
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-1">
                    {path.title}
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                    Уровень {path.level} • {path.lessons} уроков
                  </p>
                  
                  <div className="mb-4">
                    <div className="flex justify-between text-sm mb-2">
                      <span className="text-gray-600 dark:text-gray-400">Прогресс</span>
                      <span className="font-semibold text-gray-900 dark:text-white">{path.progress}%</span>
                    </div>
                    <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                      <div 
                        className={`h-2 rounded-full bg-gradient-to-r ${path.color === 'text-green-600' ? 'from-green-500 to-emerald-500' : path.color === 'text-blue-600' ? 'from-blue-500 to-cyan-500' : 'from-purple-500 to-pink-500'}`}
                        style={{ width: `${path.progress}%` }}
                      ></div>
                    </div>
                  </div>
                  
                  <button className="w-full py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl hover:from-blue-700 hover:to-purple-700 transition-all duration-300 font-semibold">
                    Продолжить
                  </button>
                </div>
              )
            })}
          </div>
        </motion.div>

      </div>
    </div>
  )
}

export default NewHome

