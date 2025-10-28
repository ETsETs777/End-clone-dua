import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import {
  MessageCircle,
  PlayCircle,
  BookOpen,
  FileText,
  TrendingUp,
  Target,
  Clock,
  Award,
  Star,
  Zap,
  Brain,
  Bookmark,
  BarChart3,
  Trophy,
  ChevronRight,
  Flame,
  Calendar,
  Users,
  Globe,
  CheckCircle,
  ArrowUp,
  ArrowDown,
  Activity
} from 'lucide-react'
import { Card } from './ui/Card'
import { Button } from './ui/Button'
import { Badge } from './ui/Badge'
import { Progress } from './ui/Progress'
import { AnimateOnScroll, InteractiveCard, AnimatedCounter, AnimatedBackground } from './ui/Animations'
import { ResponsiveContainer, ResponsiveSpacing } from './ui/Responsive'
import { useAuth } from '../contexts/AuthContext'

const DuolingoDashboard = () => {
  const { user, isAuthenticated } = useAuth()
  const [currentStreak, setCurrentStreak] = useState(7)
  const [weeklyGoal, setWeeklyGoal] = useState(5)
  const [wordsLearned, setWordsLearned] = useState(247)
  const [timeSpent, setTimeSpent] = useState(42) // minutes
  const [level, setLevel] = useState(12)
  const [xp, setXp] = useState(1840)
  const [nextLevelXp, setNextLevelXp] = useState(2000)

  const quickActions = [
    {
      id: 'chat',
      title: 'Чат с ИИ',
      description: 'Персональный помощник',
      icon: MessageCircle,
      color: 'from-primary-500 to-primary-600',
      path: '/chat',
      badge: 'new'
    },
    {
      id: 'exercises',
      title: 'Упражнения',
      description: 'Практика с ИИ',
      icon: PlayCircle,
      color: 'from-accent-success-500 to-accent-success-600',
      path: '/exercises',
      badge: null
    },
    {
      id: 'vocabulary',
      title: 'Словарь',
      description: 'Изучение слов',
      icon: Bookmark,
      color: 'from-accent-warning-500 to-accent-warning-600',
      path: '/vocabulary',
      badge: null
    },
    {
      id: 'analyzer',
      title: 'Анализ текста',
      description: 'Проверка сложности',
      icon: FileText,
      color: 'from-accent-purple-500 to-accent-purple-600',
      path: '/analyzer',
      badge: null
    }
  ]

  const achievements = [
    {
      id: 'streak_7',
      title: '7-дневная серия',
      description: 'Занимайтесь 7 дней подряд',
      icon: Flame,
      progress: 100,
      completed: true,
      xp: 50
    },
    {
      id: 'words_100',
      title: '100 слов изучено',
      description: 'Изучите 100 новых слов',
      icon: BookOpen,
      progress: 75,
      completed: false,
      xp: 100
    },
    {
      id: 'grammar_master',
      title: 'Мастер грамматики',
      description: 'Завершите 10 уроков грамматики',
      icon: Award,
      progress: 40,
      completed: false,
      xp: 200
    }
  ]

  const weeklyStats = [
    { day: 'Пн', xp: 120, completed: true },
    { day: 'Вт', xp: 80, completed: true },
    { day: 'Ср', xp: 150, completed: true },
    { day: 'Чт', xp: 90, completed: true },
    { day: 'Пт', xp: 200, completed: true },
    { day: 'Сб', xp: 60, completed: true },
    { day: 'Вс', xp: 0, completed: false }
  ]

  const recommendations = [
    {
      id: 'weak_grammar',
      title: 'Слабое место: Present Perfect',
      description: 'Практикуйте Present Perfect с помощью упражнений',
      action: 'Начать упражнения',
      path: '/exercises',
      type: 'improvement'
    },
    {
      id: 'new_words',
      title: 'Новые слова для изучения',
      description: '5 новых слов ждут изучения в вашем словаре',
      action: 'Открыть словарь',
      path: '/vocabulary',
      type: 'learning'
    },
    {
      id: 'daily_goal',
      title: 'Достигните дневной цели',
      description: 'Осталось 20 XP до дневной цели',
      action: 'Продолжить обучение',
      path: '/chat',
      type: 'motivation'
    }
  ]

  const xpProgress = (xp / nextLevelXp) * 100

  return (
    <div className="space-y-8">
      {/* Welcome Section */}
      <AnimatedBackground className="bg-gradient-to-r from-primary-500 via-primary-600 to-accent-success-500 rounded-3xl p-8 text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-black/10"></div>
        <div className="relative z-10">
          <AnimateOnScroll animation="fade-in-up" delay={0.1}>
            <h1 className="text-4xl font-bold mb-2">
              {isAuthenticated ? `Привет, ${user?.name}!` : 'Добро пожаловать!'}
            </h1>
            <p className="text-xl opacity-90 mb-6">
              {isAuthenticated 
                ? 'Готовы продолжить изучение английского?' 
                : 'Начните изучать английский с помощью ИИ'
              }
            </p>
          </AnimateOnScroll>
          
          <AnimateOnScroll animation="fade-in-up" delay={0.2}>
            <div className="flex items-center space-x-6">
              <div className="flex items-center space-x-2">
                <Flame className="w-6 h-6 text-orange-400" />
                <span className="text-2xl font-bold">{currentStreak}</span>
                <span className="text-lg">дней подряд</span>
              </div>
              <div className="flex items-center space-x-2">
                <Target className="w-6 h-6 text-yellow-400" />
                <span className="text-2xl font-bold">{weeklyGoal}</span>
                <span className="text-lg">уроков в неделю</span>
              </div>
            </div>
          </AnimateOnScroll>
        </div>
      </AnimatedBackground>

      {/* Quick Actions */}
      <div>
        <AnimateOnScroll animation="fade-in-down">
          <h2 className="text-2xl font-bold text-primary mb-6">Быстрый доступ</h2>
        </AnimateOnScroll>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {quickActions.map((action, index) => {
            const Icon = action.icon
            return (
              <AnimateOnScroll animation="fade-in-up" delay={0.1 * index} key={action.id}>
                <Link to={action.path}>
                  <InteractiveCard className="bg-card-glass p-6 text-center group cursor-pointer">
                    <div className={`w-16 h-16 bg-gradient-to-r ${action.color} rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg group-hover:shadow-xl transition-all duration-300 group-hover:scale-110`}>
                      <Icon className="w-8 h-8 text-white" />
                    </div>
                    <h3 className="text-lg font-semibold text-primary mb-2 group-hover:text-primary-600 transition-colors">
                      {action.title}
                    </h3>
                    <p className="text-sm text-secondary-600 dark:text-secondary-400 mb-3">
                      {action.description}
                    </p>
                    {action.badge && (
                      <Badge variant="success" size="sm" className="mb-3">
                        {action.badge}
                      </Badge>
                    )}
                    <div className="flex items-center justify-center text-primary-600 group-hover:text-primary-700 transition-colors">
                      <span className="text-sm font-medium">Начать</span>
                      <ChevronRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
                    </div>
                  </InteractiveCard>
                </Link>
              </AnimateOnScroll>
            )
          })}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Progress Stats */}
        <div className="lg:col-span-2">
          <AnimateOnScroll animation="fade-in-left">
            <Card className="p-6">
              <h3 className="text-xl font-bold text-primary mb-6">Ваш прогресс</h3>
              
              {/* Level Progress */}
              <div className="mb-8">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    <div className="w-12 h-12 bg-gradient-to-r from-primary-500 to-primary-600 rounded-xl flex items-center justify-center text-white font-bold text-lg">
                      {level}
                    </div>
                    <div>
                      <h4 className="font-semibold text-lg">Уровень {level}</h4>
                      <p className="text-sm text-secondary-600 dark:text-secondary-400">
                        {xp} / {nextLevelXp} XP
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-bold text-primary">{xp}</div>
                    <div className="text-sm text-secondary-600 dark:text-secondary-400">XP</div>
                  </div>
                </div>
                <Progress value={xpProgress} className="h-3" />
              </div>

              {/* Weekly Stats */}
              <div className="mb-8">
                <h4 className="font-semibold text-lg mb-4">Активность за неделю</h4>
                <div className="grid grid-cols-7 gap-2">
                  {weeklyStats.map((day, index) => (
                    <div key={day.day} className="text-center">
                      <div className={`w-8 h-8 rounded-lg flex items-center justify-center text-xs font-medium mb-1 ${
                        day.completed 
                          ? 'bg-accent-success-100 text-accent-success-700 dark:bg-accent-success-900 dark:text-accent-success-300' 
                          : 'bg-secondary-100 text-secondary-500 dark:bg-secondary-800 dark:text-secondary-400'
                      }`}>
                        {day.xp}
                      </div>
                      <div className="text-xs text-secondary-600 dark:text-secondary-400">{day.day}</div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Stats Grid */}
              <div className="grid grid-cols-3 gap-4">
                <div className="text-center p-4 bg-primary-50 dark:bg-primary-900/20 rounded-xl">
                  <BookOpen className="w-8 h-8 text-primary-600 mx-auto mb-2" />
                  <div className="text-2xl font-bold text-primary">{wordsLearned}</div>
                  <div className="text-sm text-secondary-600 dark:text-secondary-400">Слов изучено</div>
                </div>
                <div className="text-center p-4 bg-accent-success-50 dark:bg-accent-success-900/20 rounded-xl">
                  <Clock className="w-8 h-8 text-accent-success-600 mx-auto mb-2" />
                  <div className="text-2xl font-bold text-accent-success-600">{timeSpent}</div>
                  <div className="text-sm text-secondary-600 dark:text-secondary-400">Минут изучения</div>
                </div>
                <div className="text-center p-4 bg-accent-warning-50 dark:bg-accent-warning-900/20 rounded-xl">
                  <Trophy className="w-8 h-8 text-accent-warning-600 mx-auto mb-2" />
                  <div className="text-2xl font-bold text-accent-warning-600">12</div>
                  <div className="text-sm text-secondary-600 dark:text-secondary-400">Достижений</div>
                </div>
              </div>
            </Card>
          </AnimateOnScroll>
        </div>

        {/* Achievements & Recommendations */}
        <div className="space-y-6">
          {/* Achievements */}
          <AnimateOnScroll animation="fade-in-right">
            <Card className="p-6">
              <h3 className="text-xl font-bold text-primary mb-4">Достижения</h3>
              <div className="space-y-4">
                {achievements.map((achievement, index) => {
                  const Icon = achievement.icon
                  return (
                    <div key={achievement.id} className="flex items-center space-x-3 p-3 rounded-xl bg-secondary-50 dark:bg-secondary-800/50">
                      <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                        achievement.completed 
                          ? 'bg-accent-success-100 text-accent-success-600 dark:bg-accent-success-900 dark:text-accent-success-300' 
                          : 'bg-secondary-200 text-secondary-500 dark:bg-secondary-700 dark:text-secondary-400'
                      }`}>
                        <Icon className="w-5 h-5" />
                      </div>
                      <div className="flex-1">
                        <div className="font-medium text-sm">{achievement.title}</div>
                        <div className="text-xs text-secondary-600 dark:text-secondary-400 mb-2">
                          {achievement.description}
                        </div>
                        <Progress value={achievement.progress} className="h-2" />
                      </div>
                      <div className="text-right">
                        <div className="text-xs font-bold text-primary">+{achievement.xp} XP</div>
                      </div>
                    </div>
                  )
                })}
              </div>
            </Card>
          </AnimateOnScroll>

          {/* Recommendations */}
          <AnimateOnScroll animation="fade-in-right" delay={0.2}>
            <Card className="p-6">
              <h3 className="text-xl font-bold text-primary mb-4">Рекомендации</h3>
              <div className="space-y-4">
                {recommendations.map((rec, index) => (
                  <div key={rec.id} className="p-4 rounded-xl border border-secondary-200 dark:border-secondary-700 hover:border-primary-300 dark:hover:border-primary-600 transition-colors">
                    <div className="flex items-start space-x-3">
                      <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                        rec.type === 'improvement' ? 'bg-accent-warning-100 text-accent-warning-600' :
                        rec.type === 'learning' ? 'bg-primary-100 text-primary-600' :
                        'bg-accent-success-100 text-accent-success-600'
                      }`}>
                        {rec.type === 'improvement' ? <TrendingUp className="w-4 h-4" /> :
                         rec.type === 'learning' ? <BookOpen className="w-4 h-4" /> :
                         <Target className="w-4 h-4" />}
                      </div>
                      <div className="flex-1">
                        <h4 className="font-medium text-sm mb-1">{rec.title}</h4>
                        <p className="text-xs text-secondary-600 dark:text-secondary-400 mb-3">
                          {rec.description}
                        </p>
                        <Button variant="ghost" size="sm" asChild>
                          <Link to={rec.path}>{rec.action}</Link>
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </AnimateOnScroll>
        </div>
      </div>
    </div>
  )
}

export default DuolingoDashboard
