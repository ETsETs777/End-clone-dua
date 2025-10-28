import React, { useState } from 'react'
import { 
  BookOpen, 
  Play, 
  CheckCircle, 
  ArrowRight, 
  Clock, 
  Star,
  Target,
  Brain,
  Zap,
  Award,
  ChevronRight,
  ChevronDown
} from 'lucide-react'
import gigachatService from '../services/gigachatService'
import { useAuth } from '../contexts/AuthContext'
import { useNotifications } from '../components/NotificationProvider'

const Grammar = () => {
  const { user, updateUser } = useAuth()
  const { success, error } = useNotifications()
  const [selectedLesson, setSelectedLesson] = useState(null)
  const [expandedLessons, setExpandedLessons] = useState({})
  const [completedLessons, setCompletedLessons] = useState(new Set())

  const grammarLessons = [
    {
      id: 'present-simple',
      title: 'Present Simple',
      description: 'Настоящее простое время',
      difficulty: 'beginner',
      duration: '15 мин',
      topics: [
        'Образование Present Simple',
        'Употребление Present Simple',
        'Отрицательные предложения',
        'Вопросы в Present Simple',
        'Наречия времени'
      ],
      examples: [
        'I work every day. (Я работаю каждый день)',
        'She likes coffee. (Она любит кофе)',
        'They don\'t play football. (Они не играют в футбол)',
        'Do you speak English? (Ты говоришь по-английски?)'
      ],
      exercises: [
        {
          question: 'Choose the correct form: I ___ English every day.',
          options: ['study', 'studies', 'studying', 'studied'],
          correct: 0,
          explanation: 'Present Simple uses base form of verb for "I"'
        },
        {
          question: 'Complete: She ___ to school by bus.',
          options: ['go', 'goes', 'going', 'went'],
          correct: 1,
          explanation: 'Present Simple uses base form + s for 3rd person singular'
        }
      ]
    },
    {
      id: 'past-simple',
      title: 'Past Simple',
      description: 'Прошедшее простое время',
      difficulty: 'beginner',
      duration: '20 мин',
      topics: [
        'Образование Past Simple',
        'Правильные и неправильные глаголы',
        'Употребление Past Simple',
        'Отрицательные предложения',
        'Вопросы в Past Simple'
      ],
      examples: [
        'I worked yesterday. (Я работал вчера)',
        'She went to school. (Она пошла в школу)',
        'They didn\'t play football. (Они не играли в футбол)',
        'Did you see the movie? (Ты видел фильм?)'
      ],
      exercises: [
        {
          question: 'Choose the correct form: I ___ to the cinema yesterday.',
          options: ['go', 'goes', 'went', 'going'],
          correct: 2,
          explanation: 'Past Simple uses past tense form "went"'
        }
      ]
    },
    {
      id: 'present-perfect',
      title: 'Present Perfect',
      description: 'Настоящее совершенное время',
      difficulty: 'intermediate',
      duration: '25 мин',
      topics: [
        'Образование Present Perfect',
        'Употребление Present Perfect',
        'Слова-маркеры',
        'Present Perfect vs Past Simple',
        'Отрицательные предложения и вопросы'
      ],
      examples: [
        'I have worked here for 5 years. (Я работаю здесь 5 лет)',
        'She has visited London. (Она была в Лондоне)',
        'They haven\'t finished yet. (Они еще не закончили)',
        'Have you ever been to Paris? (Ты когда-нибудь был в Париже?)'
      ],
      exercises: [
        {
          question: 'Choose: I ___ here for 5 years.',
          options: ['work', 'worked', 'have worked', 'am working'],
          correct: 2,
          explanation: 'Present Perfect for duration with "for"'
        }
      ]
    },
    {
      id: 'future-simple',
      title: 'Future Simple',
      description: 'Будущее простое время',
      difficulty: 'beginner',
      duration: '18 мин',
      topics: [
        'Образование Future Simple',
        'Употребление Future Simple',
        'Will vs Going to',
        'Отрицательные предложения',
        'Вопросы в Future Simple'
      ],
      examples: [
        'I will work tomorrow. (Я буду работать завтра)',
        'She will study English. (Она будет изучать английский)',
        'They won\'t come. (Они не придут)',
        'Will you help me? (Ты поможешь мне?)'
      ],
      exercises: [
        {
          question: 'Choose: I ___ help you tomorrow.',
          options: ['will', 'am going to', 'am', 'do'],
          correct: 0,
          explanation: 'Future Simple uses "will" + base verb'
        }
      ]
    },
    {
      id: 'articles',
      title: 'Артикли',
      description: 'Определенный и неопределенный артикли',
      difficulty: 'intermediate',
      duration: '22 мин',
      topics: [
        'Неопределенный артикль a/an',
        'Определенный артикль the',
        'Отсутствие артикля',
        'Артикли с географическими названиями',
        'Артикли с абстрактными понятиями'
      ],
      examples: [
        'A cat is sleeping. (Кот спит)',
        'The cat is sleeping. (Этот кот спит)',
        'I like music. (Я люблю музыку)',
        'The United States (Соединенные Штаты)'
      ],
      exercises: [
        {
          question: 'Choose: I have ___ cat.',
          options: ['a', 'an', 'the', 'no article'],
          correct: 0,
          explanation: 'Use "a" before consonant sounds'
        }
      ]
    },
    {
      id: 'conditionals',
      title: 'Условные предложения',
      description: 'Условные предложения первого типа',
      difficulty: 'intermediate',
      duration: '30 мин',
      topics: [
        'Структура условных предложений',
        'First Conditional',
        'Second Conditional',
        'Third Conditional',
        'Mixed Conditionals'
      ],
      examples: [
        'If it rains, I will stay home. (Если пойдет дождь, я останусь дома)',
        'If I were you, I would study more. (Если бы я был тобой, я бы больше учился)',
        'If I had studied, I would have passed. (Если бы я учился, я бы сдал)'
      ],
      exercises: [
        {
          question: 'Complete: If it ___ tomorrow, we will cancel the trip.',
          options: ['rains', 'will rain', 'rained', 'would rain'],
          correct: 0,
          explanation: 'First Conditional uses Present Simple in if-clause'
        }
      ]
    }
  ]

  const getDifficultyColor = (difficulty) => {
    switch (difficulty) {
      case 'beginner': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
      case 'intermediate': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
      case 'advanced': return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200'
    }
  }

  const getDifficultyLabel = (difficulty) => {
    switch (difficulty) {
      case 'beginner': return 'Начинающий'
      case 'intermediate': return 'Средний'
      case 'advanced': return 'Продвинутый'
      default: return 'Неизвестно'
    }
  }

  const toggleLesson = (lessonId) => {
    setExpandedLessons(prev => ({
      ...prev,
      [lessonId]: !prev[lessonId]
    }))
  }

  const startLesson = (lesson) => {
    setSelectedLesson(lesson)
  }

  const completeLesson = (lessonId) => {
    setCompletedLessons(prev => new Set([...prev, lessonId]))
    
    // Начисляем опыт
    if (user) {
      const xpGain = 25
      const newXp = (user.xp || 0) + xpGain
      const newLevel = Math.floor(newXp / 100) + 1
      
      updateUser({
        xp: newXp,
        level: newLevel,
        grammarLessonsCompleted: (user.grammarLessonsCompleted || 0) + 1
      })
      
      success(`+${xpGain} XP`, 'Урок завершен!')
    }
    
    setSelectedLesson(null)
  }

  const LessonDetail = ({ lesson }) => (
    <div className="card-premium">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-primary">{lesson.title}</h2>
        <button
          onClick={() => setSelectedLesson(null)}
          className="p-2 rounded-lg bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
        >
          ✕
        </button>
      </div>

      <div className="space-y-6">
        {/* Lesson Info */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-4 bg-blue-50 dark:bg-blue-900 rounded-xl">
            <div className="flex items-center space-x-2 mb-2">
              <Clock className="w-4 h-4 text-blue-600 dark:text-blue-400" />
              <span className="font-semibold text-primary">Длительность</span>
            </div>
            <div className="text-lg font-bold text-blue-600 dark:text-blue-400">{lesson.duration}</div>
          </div>
          
          <div className="p-4 bg-green-50 dark:bg-green-900 rounded-xl">
            <div className="flex items-center space-x-2 mb-2">
              <Target className="w-4 h-4 text-green-600 dark:text-green-400" />
              <span className="font-semibold text-primary">Уровень</span>
            </div>
            <div className={`text-sm font-bold px-2 py-1 rounded-full ${getDifficultyColor(lesson.difficulty)}`}>
              {getDifficultyLabel(lesson.difficulty)}
            </div>
          </div>
          
          <div className="p-4 bg-purple-50 dark:bg-purple-900 rounded-xl">
            <div className="flex items-center space-x-2 mb-2">
              <BookOpen className="w-4 h-4 text-purple-600 dark:text-purple-400" />
              <span className="font-semibold text-primary">Темы</span>
            </div>
            <div className="text-lg font-bold text-purple-600 dark:text-purple-400">{lesson.topics.length}</div>
          </div>
        </div>

        {/* Topics */}
        <div>
          <h3 className="text-lg font-semibold text-primary mb-3">Темы урока:</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
            {lesson.topics.map((topic, index) => (
              <div key={index} className="flex items-center space-x-2 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                <CheckCircle className="w-4 h-4 text-green-500" />
                <span className="text-secondary">{topic}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Examples */}
        <div>
          <h3 className="text-lg font-semibold text-primary mb-3">Примеры:</h3>
          <div className="space-y-3">
            {lesson.examples.map((example, index) => (
              <div key={index} className="p-4 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900 dark:to-indigo-900 rounded-xl">
                <p className="text-primary font-medium">{example}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Exercises */}
        <div>
          <h3 className="text-lg font-semibold text-primary mb-3">Упражнения:</h3>
          <div className="space-y-4">
            {lesson.exercises.map((exercise, index) => (
              <div key={index} className="p-4 bg-gray-50 dark:bg-gray-800 rounded-xl">
                <p className="font-medium text-primary mb-3">{exercise.question}</p>
                <div className="grid grid-cols-2 gap-2 mb-3">
                  {exercise.options.map((option, optionIndex) => (
                    <div
                      key={optionIndex}
                      className={`p-2 rounded-lg text-center ${
                        optionIndex === exercise.correct
                          ? 'bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200'
                          : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
                      }`}
                    >
                      {option}
                    </div>
                  ))}
                </div>
                <p className="text-sm text-secondary">{exercise.explanation}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Complete Button */}
        <div className="flex justify-center">
          <button
            onClick={() => completeLesson(lesson.id)}
            className="btn-primary flex items-center space-x-2 px-8 py-3 text-lg"
          >
            <Award className="w-5 h-5" />
            <span>Завершить урок</span>
          </button>
        </div>
      </div>
    </div>
  )

  return (
    <div className="max-w-6xl mx-auto space-y-6 animate-fade-in">
      {/* Header */}
      <div className="text-center">
        <h1 className="text-3xl font-bold text-primary mb-2">Грамматика английского языка</h1>
        <p className="text-secondary">Изучайте грамматические правила с подробными объяснениями и примерами</p>
      </div>

      {/* Progress Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="card text-center">
          <div className="flex justify-center mb-3">
            <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900 rounded-lg flex items-center justify-center">
              <BookOpen className="w-5 h-5 text-blue-600 dark:text-blue-400" />
            </div>
          </div>
          <div className="text-2xl font-bold text-primary">{grammarLessons.length}</div>
          <div className="text-secondary">Всего уроков</div>
        </div>
        
        <div className="card text-center">
          <div className="flex justify-center mb-3">
            <div className="w-10 h-10 bg-green-100 dark:bg-green-900 rounded-lg flex items-center justify-center">
              <CheckCircle className="w-5 h-5 text-green-600 dark:text-green-400" />
            </div>
          </div>
          <div className="text-2xl font-bold text-primary">{completedLessons.size}</div>
          <div className="text-secondary">Завершено</div>
        </div>
        
        <div className="card text-center">
          <div className="flex justify-center mb-3">
            <div className="w-10 h-10 bg-yellow-100 dark:bg-yellow-900 rounded-lg flex items-center justify-center">
              <Star className="w-5 h-5 text-yellow-600 dark:text-yellow-400" />
            </div>
          </div>
          <div className="text-2xl font-bold text-primary">
            {grammarLessons.length > 0 ? Math.round((completedLessons.size / grammarLessons.length) * 100) : 0}%
          </div>
          <div className="text-secondary">Прогресс</div>
        </div>
        
        <div className="card text-center">
          <div className="flex justify-center mb-3">
            <div className="w-10 h-10 bg-purple-100 dark:bg-purple-900 rounded-lg flex items-center justify-center">
              <Zap className="w-5 h-5 text-purple-600 dark:text-purple-400" />
            </div>
          </div>
          <div className="text-2xl font-bold text-primary">{user?.level || 1}</div>
          <div className="text-secondary">Ваш уровень</div>
        </div>
      </div>

      {/* Lessons List */}
      {selectedLesson ? (
        <LessonDetail lesson={selectedLesson} />
      ) : (
        <div className="space-y-4">
          {grammarLessons.map((lesson) => (
            <div key={lesson.id} className="card-premium">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                    completedLessons.has(lesson.id)
                      ? 'bg-green-100 dark:bg-green-900'
                      : 'bg-blue-100 dark:bg-blue-900'
                  }`}>
                    {completedLessons.has(lesson.id) ? (
                      <CheckCircle className="w-6 h-6 text-green-600 dark:text-green-400" />
                    ) : (
                      <BookOpen className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                    )}
                  </div>
                  
                  <div>
                    <h3 className="text-xl font-semibold text-primary">{lesson.title}</h3>
                    <p className="text-secondary">{lesson.description}</p>
                    <div className="flex items-center space-x-4 mt-2">
                      <div className={`text-xs font-bold px-2 py-1 rounded-full ${getDifficultyColor(lesson.difficulty)}`}>
                        {getDifficultyLabel(lesson.difficulty)}
                      </div>
                      <div className="flex items-center space-x-1 text-sm text-secondary">
                        <Clock className="w-4 h-4" />
                        <span>{lesson.duration}</span>
                      </div>
                      <div className="flex items-center space-x-1 text-sm text-secondary">
                        <Target className="w-4 h-4" />
                        <span>{lesson.topics.length} тем</span>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center space-x-3">
                  <button
                    onClick={() => toggleLesson(lesson.id)}
                    className="p-2 rounded-lg bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                  >
                    {expandedLessons[lesson.id] ? (
                      <ChevronDown className="w-5 h-5 text-gray-600 dark:text-gray-300" />
                    ) : (
                      <ChevronRight className="w-5 h-5 text-gray-600 dark:text-gray-300" />
                    )}
                  </button>
                  
                  <button
                    onClick={() => startLesson(lesson)}
                    className="btn-primary flex items-center space-x-2"
                  >
                    <Play className="w-4 h-4" />
                    <span>Начать урок</span>
                  </button>
                </div>
              </div>
              
              {expandedLessons[lesson.id] && (
                <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <h4 className="font-semibold text-primary mb-3">Темы урока:</h4>
                      <ul className="space-y-2">
                        {lesson.topics.map((topic, index) => (
                          <li key={index} className="flex items-center space-x-2 text-secondary">
                            <CheckCircle className="w-4 h-4 text-green-500" />
                            <span>{topic}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                    
                    <div>
                      <h4 className="font-semibold text-primary mb-3">Примеры:</h4>
                      <div className="space-y-2">
                        {lesson.examples.slice(0, 3).map((example, index) => (
                          <div key={index} className="p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                            <p className="text-sm text-primary">{example}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Tips */}
      <div className="card bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900 dark:to-indigo-900 border-blue-200 dark:border-blue-700">
        <div className="flex items-start space-x-3">
          <Brain className="w-6 h-6 text-blue-600 dark:text-blue-400 mt-1" />
          <div>
            <h3 className="text-lg font-semibold text-primary mb-2">Советы по изучению грамматики</h3>
            <ul className="space-y-2 text-secondary">
              <li className="flex items-start space-x-2">
                <Zap className="w-4 h-4 text-blue-500 mt-1" />
                <span>Изучайте правила постепенно, не пытайтесь выучить все сразу</span>
              </li>
              <li className="flex items-start space-x-2">
                <Zap className="w-4 h-4 text-blue-500 mt-1" />
                <span>Практикуйтесь с примерами и упражнениями</span>
              </li>
              <li className="flex items-start space-x-2">
                <Zap className="w-4 h-4 text-blue-500 mt-1" />
                <span>Используйте изученную грамматику в разговорной речи</span>
              </li>
              <li className="flex items-start space-x-2">
                <Zap className="w-4 h-4 text-blue-500 mt-1" />
                <span>Повторяйте пройденный материал регулярно</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Grammar