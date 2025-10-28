import React, { useState } from 'react'
import { 
  Search, 
  Plus, 
  BookOpen, 
  Volume2, 
  Star, 
  Trash2,
  Filter,
  ChevronDown,
  Zap,
  Target,
  Award
} from 'lucide-react'
import toast from 'react-hot-toast'
import { useAuth } from '../contexts/AuthContext'
import { useNotifications } from '../components/NotificationProvider'

const Vocabulary = () => {
  const { user, updateUser } = useAuth()
  const { success } = useNotifications()
  const [words, setWords] = useState([
    {
      id: 1,
      english: 'Hello',
      russian: 'Привет',
      pronunciation: '/həˈloʊ/',
      example: 'Hello, how are you?',
      translation: 'Привет, как дела?',
      difficulty: 'easy',
      learned: false,
      addedDate: new Date('2024-01-15')
    },
    {
      id: 2,
      english: 'Beautiful',
      russian: 'Красивый',
      pronunciation: '/ˈbjuːtɪfəl/',
      example: 'She has beautiful eyes.',
      translation: 'У неё красивые глаза.',
      difficulty: 'medium',
      learned: true,
      addedDate: new Date('2024-01-14')
    },
    {
      id: 3,
      english: 'Sophisticated',
      russian: 'Изысканный',
      pronunciation: '/səˈfɪstɪkeɪtɪd/',
      example: 'This is a sophisticated solution.',
      translation: 'Это изысканное решение.',
      difficulty: 'hard',
      learned: false,
      addedDate: new Date('2024-01-13')
    }
  ])

  const [searchTerm, setSearchTerm] = useState('')
  const [filterDifficulty, setFilterDifficulty] = useState('all')
  const [showAddForm, setShowAddForm] = useState(false)
  const [newWord, setNewWord] = useState({
    english: '',
    russian: '',
    pronunciation: '',
    example: '',
    translation: '',
    difficulty: 'medium'
  })

  const difficulties = {
    easy: { label: 'Легкий', color: 'bg-green-100 text-green-800' },
    medium: { label: 'Средний', color: 'bg-yellow-100 text-yellow-800' },
    hard: { label: 'Сложный', color: 'bg-red-100 text-red-800' }
  }

  const filteredWords = words.filter(word => {
    const matchesSearch = word.english.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         word.russian.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesDifficulty = filterDifficulty === 'all' || word.difficulty === filterDifficulty
    return matchesSearch && matchesDifficulty
  })

  const handleAddWord = () => {
    if (!newWord.english || !newWord.russian) {
      toast.error('Заполните обязательные поля')
      return
    }

    const word = {
      id: Date.now(),
      ...newWord,
      learned: false,
      addedDate: new Date()
    }

    setWords(prev => [word, ...prev])
    
    // Геймификация - начисляем опыт за добавление слова
    if (user) {
      const xpGain = 5
      const newXp = (user.xp || 0) + xpGain
      const newLevel = Math.floor(newXp / 100) + 1
      
      updateUser({
        xp: newXp,
        level: newLevel,
        wordsLearned: (user.wordsLearned || 0) + 1
      })
      
      success(`+${xpGain} XP`, 'Слово добавлено в словарь!')
    }
    
    setNewWord({
      english: '',
      russian: '',
      pronunciation: '',
      example: '',
      translation: '',
      difficulty: 'medium'
    })
    setShowAddForm(false)
  }

  const toggleLearned = (id) => {
    setWords(prev => prev.map(word => {
      if (word.id === id) {
        const isLearning = !word.learned
        
        // Геймификация - начисляем опыт за изучение слова
        if (user && isLearning) {
          const xpGain = 10
          const newXp = (user.xp || 0) + xpGain
          const newLevel = Math.floor(newXp / 100) + 1
          
          updateUser({
            xp: newXp,
            level: newLevel
          })
          
          success(`+${xpGain} XP`, 'Слово изучено!')
        }
        
        return { ...word, learned: isLearning }
      }
      return word
    }))
  }

  const deleteWord = (id) => {
    setWords(prev => prev.filter(word => word.id !== id))
    toast.success('Слово удалено')
  }

  const playPronunciation = (word) => {
    // В реальном приложении здесь будет интеграция с API произношения
    toast.success(`Произношение: ${word.pronunciation}`)
  }

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Мой словарь</h1>
          <p className="text-gray-600 mt-2">Изучайте и повторяйте английские слова</p>
        </div>
        <button
          onClick={() => setShowAddForm(true)}
          className="btn-primary flex items-center space-x-2"
        >
          <Plus className="w-5 h-5" />
          <span>Добавить слово</span>
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="card text-center">
          <div className="text-2xl font-bold text-blue-600">{words.length}</div>
          <div className="text-gray-600">Всего слов</div>
        </div>
        <div className="card text-center">
          <div className="text-2xl font-bold text-green-600">
            {words.filter(w => w.learned).length}
          </div>
          <div className="text-gray-600">Изучено</div>
        </div>
        <div className="card text-center">
          <div className="text-2xl font-bold text-yellow-600">
            {words.filter(w => w.difficulty === 'easy').length}
          </div>
          <div className="text-gray-600">Легких</div>
        </div>
        <div className="card text-center">
          <div className="text-2xl font-bold text-red-600">
            {words.filter(w => w.difficulty === 'hard').length}
          </div>
          <div className="text-gray-600">Сложных</div>
        </div>
      </div>

      {/* Search and Filter */}
      <div className="card">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Поиск по словам..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="input-field pl-10"
            />
          </div>
          <div className="flex items-center space-x-2">
            <Filter className="w-5 h-5 text-gray-400" />
            <select
              value={filterDifficulty}
              onChange={(e) => setFilterDifficulty(e.target.value)}
              className="input-field w-40"
            >
              <option value="all">Все уровни</option>
              <option value="easy">Легкий</option>
              <option value="medium">Средний</option>
              <option value="hard">Сложный</option>
            </select>
          </div>
        </div>
      </div>

      {/* Add Word Form */}
      {showAddForm && (
        <div className="card">
          <h3 className="text-xl font-semibold mb-4">Добавить новое слово</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Английское слово *
              </label>
              <input
                type="text"
                value={newWord.english}
                onChange={(e) => setNewWord(prev => ({ ...prev, english: e.target.value }))}
                className="input-field"
                placeholder="Beautiful"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Русский перевод *
              </label>
              <input
                type="text"
                value={newWord.russian}
                onChange={(e) => setNewWord(prev => ({ ...prev, russian: e.target.value }))}
                className="input-field"
                placeholder="Красивый"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Произношение
              </label>
              <input
                type="text"
                value={newWord.pronunciation}
                onChange={(e) => setNewWord(prev => ({ ...prev, pronunciation: e.target.value }))}
                className="input-field"
                placeholder="/ˈbjuːtɪfəl/"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Уровень сложности
              </label>
              <select
                value={newWord.difficulty}
                onChange={(e) => setNewWord(prev => ({ ...prev, difficulty: e.target.value }))}
                className="input-field"
              >
                <option value="easy">Легкий</option>
                <option value="medium">Средний</option>
                <option value="hard">Сложный</option>
              </select>
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Пример предложения
              </label>
              <input
                type="text"
                value={newWord.example}
                onChange={(e) => setNewWord(prev => ({ ...prev, example: e.target.value }))}
                className="input-field"
                placeholder="She has beautiful eyes."
              />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Перевод примера
              </label>
              <input
                type="text"
                value={newWord.translation}
                onChange={(e) => setNewWord(prev => ({ ...prev, translation: e.target.value }))}
                className="input-field"
                placeholder="У неё красивые глаза."
              />
            </div>
          </div>
          <div className="flex justify-end space-x-3 mt-6">
            <button
              onClick={() => setShowAddForm(false)}
              className="btn-secondary"
            >
              Отмена
            </button>
            <button
              onClick={handleAddWord}
              className="btn-primary"
            >
              Добавить слово
            </button>
          </div>
        </div>
      )}

      {/* Words List */}
      <div className="space-y-4">
        {filteredWords.map((word) => (
          <div key={word.id} className="card">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center space-x-3 mb-2">
                  <h3 className="text-xl font-semibold text-gray-900">{word.english}</h3>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${difficulties[word.difficulty].color}`}>
                    {difficulties[word.difficulty].label}
                  </span>
                  {word.learned && (
                    <Star className="w-5 h-5 text-yellow-500 fill-current" />
                  )}
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <p className="text-gray-600 mb-1">Перевод:</p>
                    <p className="font-medium">{word.russian}</p>
                  </div>
                  <div>
                    <p className="text-gray-600 mb-1">Произношение:</p>
                    <div className="flex items-center space-x-2">
                      <p className="font-medium">{word.pronunciation}</p>
                      <button
                        onClick={() => playPronunciation(word)}
                        className="p-1 hover:bg-gray-100 rounded"
                      >
                        <Volume2 className="w-4 h-4 text-gray-500" />
                      </button>
                    </div>
                  </div>
                </div>
                
                {word.example && (
                  <div className="mt-4 p-3 bg-gray-50 rounded-lg">
                    <p className="text-gray-600 mb-1">Пример:</p>
                    <p className="font-medium italic">"{word.example}"</p>
                    {word.translation && (
                      <p className="text-gray-600 mt-1">"{word.translation}"</p>
                    )}
                  </div>
                )}
              </div>
              
              <div className="flex items-center space-x-2 ml-4">
                <button
                  onClick={() => toggleLearned(word.id)}
                  className={`p-2 rounded-lg transition-colors ${
                    word.learned 
                      ? 'bg-yellow-100 text-yellow-600 hover:bg-yellow-200' 
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                  title={word.learned ? 'Отметить как не изученное' : 'Отметить как изученное'}
                >
                  <Star className={`w-5 h-5 ${word.learned ? 'fill-current' : ''}`} />
                </button>
                <button
                  onClick={() => deleteWord(word.id)}
                  className="p-2 bg-red-100 text-red-600 hover:bg-red-200 rounded-lg transition-colors"
                  title="Удалить слово"
                >
                  <Trash2 className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>
        ))}
        
        {filteredWords.length === 0 && (
          <div className="card text-center py-12">
            <BookOpen className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Слова не найдены</h3>
            <p className="text-gray-600 mb-4">
              {searchTerm ? 'Попробуйте изменить поисковый запрос' : 'Добавьте свои первые слова в словарь'}
            </p>
            <button
              onClick={() => setShowAddForm(true)}
              className="btn-primary"
            >
              Добавить слово
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

export default Vocabulary
