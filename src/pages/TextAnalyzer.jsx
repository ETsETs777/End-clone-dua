import React, { useState } from 'react'
import { 
  FileText, 
  Brain, 
  CheckCircle, 
  AlertCircle, 
  Target,
  TrendingUp,
  BookOpen,
  MessageCircle,
  Zap,
  Star
} from 'lucide-react'
import gigachatService from '../services/gigachatService'
import { useAuth } from '../contexts/AuthContext'
import { useNotifications } from '../components/NotificationProvider'

const TextAnalyzer = () => {
  const { user, updateUser } = useAuth()
  const { success, error } = useNotifications()
  const [text, setText] = useState('')
  const [analysis, setAnalysis] = useState(null)
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [suggestions, setSuggestions] = useState([])

  const analyzeText = async () => {
    if (!text.trim()) {
      error('Ошибка', 'Введите текст для анализа')
      return
    }

    setIsAnalyzing(true)
    try {
      // Анализ сложности текста
      const complexity = gigachatService.analyzeTextComplexity(text)
      
      // Проверка грамматики
      const grammarCheck = await gigachatService.checkGrammar(text)
      
      // Генерация предложений по улучшению
      const improvementSuggestions = generateSuggestions(complexity, grammarCheck)
      
      setAnalysis({
        complexity,
        grammarCheck,
        suggestions: improvementSuggestions,
        wordCount: text.split(' ').length,
        characterCount: text.length
      })

      // Начисляем опыт за анализ
      if (user) {
        const xpGain = 10
        const newXp = (user.xp || 0) + xpGain
        const newLevel = Math.floor(newXp / 100) + 1
        
        updateUser({
          xp: newXp,
          level: newLevel
        })
        
        success('+10 XP', 'Текст проанализирован!')
      }
    } catch (err) {
      error('Ошибка', 'Не удалось проанализировать текст')
    } finally {
      setIsAnalyzing(false)
    }
  }

  const generateSuggestions = (complexity, grammarCheck) => {
    const suggestions = []
    
    if (complexity.level === 'beginner') {
      suggestions.push({
        type: 'level',
        icon: TrendingUp,
        title: 'Повысить сложность',
        description: 'Попробуйте использовать более сложные предложения и слова',
        color: 'text-blue-600 dark:text-blue-400'
      })
    }
    
    if (complexity.avgWordsPerSentence < 8) {
      suggestions.push({
        type: 'sentence',
        icon: MessageCircle,
        title: 'Увеличить длину предложений',
        description: 'Добавьте больше деталей и описаний',
        color: 'text-green-600 dark:text-green-400'
      })
    }
    
    if (complexity.complexityRatio < 10) {
      suggestions.push({
        type: 'vocabulary',
        icon: BookOpen,
        title: 'Расширить словарь',
        description: 'Используйте более разнообразные и сложные слова',
        color: 'text-purple-600 dark:text-purple-400'
      })
    }
    
    if (grammarCheck.suggestions.length > 0) {
      suggestions.push({
        type: 'grammar',
        icon: CheckCircle,
        title: 'Исправить грамматику',
        description: grammarCheck.suggestions.join(', '),
        color: 'text-red-600 dark:text-red-400'
      })
    }

    return suggestions
  }

  const getLevelColor = (level) => {
    switch (level) {
      case 'beginner': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
      case 'intermediate': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
      case 'advanced': return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200'
    }
  }

  const getLevelLabel = (level) => {
    switch (level) {
      case 'beginner': return 'Начинающий'
      case 'intermediate': return 'Средний'
      case 'advanced': return 'Продвинутый'
      default: return 'Неизвестно'
    }
  }

  return (
    <div className="max-w-6xl mx-auto space-y-6 animate-fade-in">
      {/* Header */}
      <div className="text-center">
        <h1 className="text-3xl font-bold text-primary mb-2">Анализатор текста</h1>
        <p className="text-secondary">Анализируйте сложность и качество вашего английского текста</p>
      </div>

      {/* Input Section */}
      <div className="card-premium">
        <h3 className="text-xl font-semibold text-primary mb-4 flex items-center space-x-2">
          <FileText className="w-6 h-6 text-blue-600 dark:text-blue-400" />
          <span>Введите текст для анализа</span>
        </h3>
        
        <div className="space-y-4">
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Введите ваш английский текст здесь... Например: 'Hello, my name is John. I am a student and I like to study English.'"
            className="w-full h-40 px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent outline-none resize-none bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 shadow-sm hover:shadow-md transition-all duration-200"
          />
          
          <div className="flex justify-between items-center">
            <div className="text-sm text-secondary">
              {text.length} символов • {text.split(' ').filter(word => word.length > 0).length} слов
            </div>
            
            <button
              onClick={analyzeText}
              disabled={!text.trim() || isAnalyzing}
              className="btn-primary flex items-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isAnalyzing ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>Анализ...</span>
                </>
              ) : (
                <>
                  <Brain className="w-4 h-4" />
                  <span>Анализировать</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Analysis Results */}
      {analysis && (
        <div className="space-y-6">
          {/* Complexity Analysis */}
          <div className="card-premium">
            <h3 className="text-xl font-semibold text-primary mb-4 flex items-center space-x-2">
              <Target className="w-6 h-6 text-green-600 dark:text-green-400" />
              <span>Анализ сложности</span>
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="text-center p-4 bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900 dark:to-indigo-900 rounded-xl">
                <div className="text-2xl font-bold text-primary mb-1">{analysis.wordCount}</div>
                <div className="text-sm text-secondary">Слов</div>
              </div>
              
              <div className="text-center p-4 bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900 dark:to-emerald-900 rounded-xl">
                <div className="text-2xl font-bold text-primary mb-1">{analysis.complexity.avgWordsPerSentence}</div>
                <div className="text-sm text-secondary">Слов в предложении</div>
              </div>
              
              <div className="text-center p-4 bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-900 dark:to-pink-900 rounded-xl">
                <div className="text-2xl font-bold text-primary mb-1">{analysis.complexity.complexityRatio}%</div>
                <div className="text-sm text-secondary">Сложных слов</div>
              </div>
              
              <div className="text-center p-4 bg-gradient-to-br from-yellow-50 to-orange-50 dark:from-yellow-900 dark:to-orange-900 rounded-xl">
                <div className={`text-lg font-bold px-3 py-1 rounded-full ${getLevelColor(analysis.complexity.level)}`}>
                  {getLevelLabel(analysis.complexity.level)}
                </div>
                <div className="text-sm text-secondary mt-1">Уровень сложности</div>
              </div>
            </div>
          </div>

          {/* Grammar Check */}
          <div className="card-premium">
            <h3 className="text-xl font-semibold text-primary mb-4 flex items-center space-x-2">
              <CheckCircle className="w-6 h-6 text-blue-600 dark:text-blue-400" />
              <span>Проверка грамматики</span>
            </h3>
            
            <div className="space-y-4">
              <div className={`p-4 rounded-xl flex items-center space-x-3 ${
                analysis.grammarCheck.isCorrect 
                  ? 'bg-green-50 dark:bg-green-900 border border-green-200 dark:border-green-700' 
                  : 'bg-red-50 dark:bg-red-900 border border-red-200 dark:border-red-700'
              }`}>
                {analysis.grammarCheck.isCorrect ? (
                  <CheckCircle className="w-6 h-6 text-green-600 dark:text-green-400" />
                ) : (
                  <AlertCircle className="w-6 h-6 text-red-600 dark:text-red-400" />
                )}
                <div>
                  <div className="font-semibold text-primary">
                    {analysis.grammarCheck.isCorrect ? 'Грамматика корректна!' : 'Найдены ошибки'}
                  </div>
                  {!analysis.grammarCheck.isCorrect && (
                    <div className="text-sm text-secondary mt-1">
                      {analysis.grammarCheck.suggestions.join(', ')}
                    </div>
                  )}
                </div>
              </div>
              
              {!analysis.grammarCheck.isCorrect && (
                <div className="p-4 bg-blue-50 dark:bg-blue-900 rounded-xl">
                  <h4 className="font-semibold text-primary mb-2">Исправленный вариант:</h4>
                  <p className="text-secondary">{analysis.grammarCheck.correctedSentence}</p>
                </div>
              )}
            </div>
          </div>

          {/* Suggestions */}
          {analysis.suggestions.length > 0 && (
            <div className="card-premium">
              <h3 className="text-xl font-semibold text-primary mb-4 flex items-center space-x-2">
                <Star className="w-6 h-6 text-yellow-600 dark:text-yellow-400" />
                <span>Рекомендации по улучшению</span>
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {analysis.suggestions.map((suggestion, index) => {
                  const Icon = suggestion.icon
                  return (
                    <div key={index} className="p-4 bg-gray-50 dark:bg-gray-800 rounded-xl">
                      <div className="flex items-start space-x-3">
                        <Icon className={`w-5 h-5 mt-1 ${suggestion.color}`} />
                        <div>
                          <h4 className="font-semibold text-primary mb-1">{suggestion.title}</h4>
                          <p className="text-sm text-secondary">{suggestion.description}</p>
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Tips */}
      <div className="card bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900 dark:to-indigo-900 border-blue-200 dark:border-blue-700">
        <div className="flex items-start space-x-3">
          <Brain className="w-6 h-6 text-blue-600 dark:text-blue-400 mt-1" />
          <div>
            <h3 className="text-lg font-semibold text-primary mb-2">Советы по написанию</h3>
            <ul className="space-y-2 text-secondary">
              <li className="flex items-start space-x-2">
                <Zap className="w-4 h-4 text-blue-500 mt-1" />
                <span>Используйте разнообразную лексику для повышения уровня</span>
              </li>
              <li className="flex items-start space-x-2">
                <Zap className="w-4 h-4 text-blue-500 mt-1" />
                <span>Стремитесь к предложениям длиной 10-15 слов</span>
              </li>
              <li className="flex items-start space-x-2">
                <Zap className="w-4 h-4 text-blue-500 mt-1" />
                <span>Включайте сложные слова для продвинутого уровня</span>
              </li>
              <li className="flex items-start space-x-2">
                <Zap className="w-4 h-4 text-blue-500 mt-1" />
                <span>Проверяйте грамматику перед отправкой</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}

export default TextAnalyzer


