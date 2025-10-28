import React, { useState, useEffect } from 'react'
import { 
  Brain, 
  CheckCircle, 
  XCircle, 
  RotateCcw, 
  Trophy, 
  Target,
  Clock,
  Star,
  Zap,
  BookOpen,
  MessageCircle
} from 'lucide-react'
import gigachatService from '../services/gigachatService'
import { useAuth } from '../contexts/AuthContext'
import { useNotifications } from '../components/NotificationProvider'

const AIExercises = () => {
  const { user, updateUser } = useAuth()
  const { success, error } = useNotifications()
  const [currentExercise, setCurrentExercise] = useState(null)
  const [selectedAnswer, setSelectedAnswer] = useState(null)
  const [showResult, setShowResult] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [exerciseType, setExerciseType] = useState('grammar')
  const [difficulty, setDifficulty] = useState('beginner')
  const [score, setScore] = useState(0)
  const [totalExercises, setTotalExercises] = useState(0)
  const [streak, setStreak] = useState(0)

  const exerciseTypes = [
    { id: 'grammar', label: 'Грамматика', icon: BookOpen, color: 'from-blue-500 to-blue-600' },
    { id: 'vocabulary', label: 'Словарь', icon: Brain, color: 'from-green-500 to-green-600' },
    { id: 'conversation', label: 'Разговор', icon: MessageCircle, color: 'from-purple-500 to-purple-600' }
  ]

  const difficulties = [
    { id: 'beginner', label: 'Начинающий', color: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' },
    { id: 'intermediate', label: 'Средний', color: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200' },
    { id: 'advanced', label: 'Продвинутый', color: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200' }
  ]

  const generateNewExercise = async () => {
    setIsLoading(true)
    try {
      const exercise = await gigachatService.generateExercise(exerciseType, difficulty)
      if (exercise) {
        setCurrentExercise(exercise)
        setSelectedAnswer(null)
        setShowResult(false)
      } else {
        error('Ошибка', 'Не удалось сгенерировать упражнение')
      }
    } catch (err) {
      error('Ошибка', 'Произошла ошибка при загрузке упражнения')
    } finally {
      setIsLoading(false)
    }
  }

  const handleAnswerSelect = (answerIndex) => {
    if (showResult) return
    setSelectedAnswer(answerIndex)
  }

  const checkAnswer = () => {
    if (selectedAnswer === null) return
    
    setShowResult(true)
    const isCorrect = selectedAnswer === currentExercise.correct
    
    if (isCorrect) {
      setScore(prev => prev + 1)
      setStreak(prev => prev + 1)
      success('Правильно!', 'Отличная работа!')
      
      // Начисляем опыт
      if (user) {
        const xpGain = 15
        const newXp = (user.xp || 0) + xpGain
        const newLevel = Math.floor(newXp / 100) + 1
        
        updateUser({
          xp: newXp,
          level: newLevel
        })
      }
    } else {
      setStreak(0)
      error('Неправильно', 'Попробуйте еще раз!')
    }
    
    setTotalExercises(prev => prev + 1)
  }

  const resetExercise = () => {
    setCurrentExercise(null)
    setSelectedAnswer(null)
    setShowResult(false)
    setScore(0)
    setTotalExercises(0)
    setStreak(0)
  }

  useEffect(() => {
    generateNewExercise()
  }, [exerciseType, difficulty])

  return (
    <div className="max-w-4xl mx-auto space-y-6 animate-fade-in">
      {/* Header */}
      <div className="text-center">
        <h1 className="text-3xl font-bold text-primary mb-2">ИИ Упражнения</h1>
        <p className="text-secondary">Практикуйтесь с помощью искусственного интеллекта</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="card text-center">
          <div className="flex justify-center mb-3">
            <div className="w-10 h-10 bg-green-100 dark:bg-green-900 rounded-lg flex items-center justify-center">
              <Target className="w-5 h-5 text-green-600 dark:text-green-400" />
            </div>
          </div>
          <div className="text-2xl font-bold text-primary">{score}</div>
          <div className="text-secondary">Правильных ответов</div>
        </div>
        
        <div className="card text-center">
          <div className="flex justify-center mb-3">
            <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900 rounded-lg flex items-center justify-center">
              <BookOpen className="w-5 h-5 text-blue-600 dark:text-blue-400" />
            </div>
          </div>
          <div className="text-2xl font-bold text-primary">{totalExercises}</div>
          <div className="text-secondary">Всего упражнений</div>
        </div>
        
        <div className="card text-center">
          <div className="flex justify-center mb-3">
            <div className="w-10 h-10 bg-yellow-100 dark:bg-yellow-900 rounded-lg flex items-center justify-center">
              <Zap className="w-5 h-5 text-yellow-600 dark:text-yellow-400" />
            </div>
          </div>
          <div className="text-2xl font-bold text-primary">{streak}</div>
          <div className="text-secondary">Серия правильных</div>
        </div>
        
        <div className="card text-center">
          <div className="flex justify-center mb-3">
            <div className="w-10 h-10 bg-purple-100 dark:bg-purple-900 rounded-lg flex items-center justify-center">
              <Trophy className="w-5 h-5 text-purple-600 dark:text-purple-400" />
            </div>
          </div>
          <div className="text-2xl font-bold text-primary">
            {totalExercises > 0 ? Math.round((score / totalExercises) * 100) : 0}%
          </div>
          <div className="text-secondary">Точность</div>
        </div>
      </div>

      {/* Exercise Type and Difficulty Selection */}
      <div className="card">
        <h3 className="text-lg font-semibold text-primary mb-4">Настройки упражнений</h3>
        
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-primary mb-2">Тип упражнения</label>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              {exerciseTypes.map((type) => {
                const Icon = type.icon
                return (
                  <button
                    key={type.id}
                    onClick={() => setExerciseType(type.id)}
                    className={`p-4 rounded-xl border-2 transition-all duration-200 ${
                      exerciseType === type.id
                        ? `border-blue-500 bg-blue-50 dark:bg-blue-900`
                        : 'border-gray-200 dark:border-gray-700 hover:border-blue-300 dark:hover:border-blue-600'
                    }`}
                  >
                    <div className={`flex items-center justify-center w-12 h-12 bg-gradient-to-r ${type.color} rounded-lg mb-3 mx-auto`}>
                      <Icon className="w-6 h-6 text-white" />
                    </div>
                    <div className="font-medium text-primary">{type.label}</div>
                  </button>
                )
              })}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-primary mb-2">Уровень сложности</label>
            <div className="flex space-x-3">
              {difficulties.map((diff) => (
                <button
                  key={diff.id}
                  onClick={() => setDifficulty(diff.id)}
                  className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
                    difficulty === diff.id
                      ? diff.color
                      : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-600'
                  }`}
                >
                  {diff.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Exercise */}
      {currentExercise && (
        <div className="card-premium">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-semibold text-primary">Упражнение</h3>
            <div className="flex items-center space-x-2 text-sm text-secondary">
              <Clock className="w-4 h-4" />
              <span>Время не ограничено</span>
            </div>
          </div>

          <div className="space-y-6">
            <div className="p-6 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900 dark:to-indigo-900 rounded-xl">
              <h4 className="text-lg font-medium text-primary mb-4">{currentExercise.question}</h4>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {currentExercise.options.map((option, index) => (
                  <button
                    key={index}
                    onClick={() => handleAnswerSelect(index)}
                    disabled={showResult}
                    className={`p-4 rounded-xl border-2 transition-all duration-200 text-left ${
                      selectedAnswer === index
                        ? showResult
                          ? index === currentExercise.correct
                            ? 'border-green-500 bg-green-50 dark:bg-green-900 text-green-800 dark:text-green-200'
                            : 'border-red-500 bg-red-50 dark:bg-red-900 text-red-800 dark:text-red-200'
                          : 'border-blue-500 bg-blue-50 dark:bg-blue-900 text-blue-800 dark:text-blue-200'
                        : showResult && index === currentExercise.correct
                        ? 'border-green-500 bg-green-50 dark:bg-green-900 text-green-800 dark:text-green-200'
                        : 'border-gray-200 dark:border-gray-700 hover:border-blue-300 dark:hover:border-blue-600 hover:bg-gray-50 dark:hover:bg-gray-800'
                    }`}
                  >
                    <div className="flex items-center space-x-3">
                      <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                        selectedAnswer === index
                          ? showResult
                            ? index === currentExercise.correct
                              ? 'border-green-500 bg-green-500'
                              : 'border-red-500 bg-red-500'
                            : 'border-blue-500 bg-blue-500'
                          : showResult && index === currentExercise.correct
                          ? 'border-green-500 bg-green-500'
                          : 'border-gray-300 dark:border-gray-600'
                      }`}>
                        {selectedAnswer === index && (
                          <CheckCircle className="w-4 h-4 text-white" />
                        )}
                        {showResult && index === currentExercise.correct && selectedAnswer !== index && (
                          <CheckCircle className="w-4 h-4 text-white" />
                        )}
                        {showResult && selectedAnswer === index && index !== currentExercise.correct && (
                          <XCircle className="w-4 h-4 text-white" />
                        )}
                      </div>
                      <span className="font-medium">{option}</span>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {showResult && (
              <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-xl">
                <h5 className="font-semibold text-primary mb-2">Объяснение:</h5>
                <p className="text-secondary">{currentExercise.explanation}</p>
              </div>
            )}

            <div className="flex justify-between">
              <button
                onClick={resetExercise}
                className="btn-secondary flex items-center space-x-2"
              >
                <RotateCcw className="w-4 h-4" />
                <span>Сбросить</span>
              </button>

              {!showResult ? (
                <button
                  onClick={checkAnswer}
                  disabled={selectedAnswer === null}
                  className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Проверить ответ
                </button>
              ) : (
                <button
                  onClick={generateNewExercise}
                  disabled={isLoading}
                  className="btn-primary flex items-center space-x-2"
                >
                  {isLoading ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      <span>Загрузка...</span>
                    </>
                  ) : (
                    <>
                      <Star className="w-4 h-4" />
                      <span>Следующее упражнение</span>
                    </>
                  )}
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Tips */}
      <div className="card bg-gradient-to-r from-yellow-50 to-orange-50 dark:from-yellow-900 dark:to-orange-900 border-yellow-200 dark:border-yellow-700">
        <div className="flex items-start space-x-3">
          <Brain className="w-6 h-6 text-yellow-600 dark:text-yellow-400 mt-1" />
          <div>
            <h3 className="text-lg font-semibold text-primary mb-2">Советы для эффективного обучения</h3>
            <ul className="space-y-2 text-secondary">
              <li className="flex items-start space-x-2">
                <Target className="w-4 h-4 text-blue-500 mt-1" />
                <span>Регулярно практикуйтесь для лучших результатов</span>
              </li>
              <li className="flex items-start space-x-2">
                <Target className="w-4 h-4 text-blue-500 mt-1" />
                <span>Внимательно читайте объяснения к неправильным ответам</span>
              </li>
              <li className="flex items-start space-x-2">
                <Target className="w-4 h-4 text-blue-500 mt-1" />
                <span>Начинайте с простых упражнений и постепенно увеличивайте сложность</span>
              </li>
              <li className="flex items-start space-x-2">
                <Target className="w-4 h-4 text-blue-500 mt-1" />
                <span>Используйте разные типы упражнений для комплексного развития</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}

export default AIExercises


