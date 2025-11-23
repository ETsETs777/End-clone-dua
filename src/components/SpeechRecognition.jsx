import React, { useState, useEffect, useRef } from 'react'
import { Mic, MicOff, Volume2, CheckCircle, XCircle, Loader2, Trophy } from 'lucide-react'
import toast from 'react-hot-toast'

const SpeechRecognition = () => {
  const [isListening, setIsListening] = useState(false)
  const [transcript, setTranscript] = useState('')
  const [targetPhrase, setTargetPhrase] = useState('')
  const [score, setScore] = useState(null)
  const [feedback, setFeedback] = useState('')
  const [isSupported, setIsSupported] = useState(true)
  const [attempts, setAttempts] = useState(0)
  const [successCount, setSuccessCount] = useState(0)
  const recognitionRef = useRef(null)

  const practicePhases = [
    { text: 'Hello, how are you?', category: 'Greetings', difficulty: 'Easy' },
    { text: 'What is your name?', category: 'Introductions', difficulty: 'Easy' },
    { text: 'Nice to meet you', category: 'Greetings', difficulty: 'Easy' },
    { text: 'Can you help me please?', category: 'Polite Requests', difficulty: 'Medium' },
    { text: 'Where is the nearest station?', category: 'Asking Directions', difficulty: 'Medium' },
    { text: 'I would like to order coffee', category: 'Ordering', difficulty: 'Medium' },
    { text: 'Could you repeat that please?', category: 'Communication', difficulty: 'Medium' },
    { text: 'What time does it start?', category: 'Time', difficulty: 'Easy' },
    { text: 'How much does it cost?', category: 'Shopping', difficulty: 'Easy' },
    { text: 'I am learning English', category: 'Learning', difficulty: 'Easy' },
    { text: 'The weather is beautiful today', category: 'Small Talk', difficulty: 'Medium' },
    { text: 'I need to practice my pronunciation', category: 'Learning', difficulty: 'Hard' },
    { text: 'Communication is extremely important', category: 'Advanced', difficulty: 'Hard' },
    { text: 'Technology has changed our lives', category: 'Advanced', difficulty: 'Hard' },
  ]

  useEffect(() => {
    // Check if browser supports speech recognition
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition
    
    if (!SpeechRecognition) {
      setIsSupported(false)
      toast.error('Ваш браузер не поддерживает распознавание речи. Попробуйте Chrome.')
      return
    }

    // Initialize speech recognition
    const recognition = new SpeechRecognition()
    recognition.continuous = false
    recognition.interimResults = false
    recognition.lang = 'en-US'

    recognition.onresult = (event) => {
      const result = event.results[0][0].transcript
      setTranscript(result)
      evaluatePronunciation(result)
      setIsListening(false)
    }

    recognition.onerror = (event) => {
      console.error('Speech recognition error:', event.error)
      setIsListening(false)
      
      if (event.error === 'no-speech') {
        toast.error('Речь не распознана. Попробуйте снова.')
      } else if (event.error === 'not-allowed') {
        toast.error('Доступ к микрофону заблокирован. Разрешите доступ в настройках браузера.')
      } else {
        toast.error('Ошибка распознавания речи')
      }
    }

    recognition.onend = () => {
      setIsListening(false)
    }

    recognitionRef.current = recognition

    // Set initial phrase
    if (!targetPhrase) {
      selectNewPhrase()
    }

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop()
      }
    }
  }, [])

  const selectNewPhrase = () => {
    const randomPhrase = practicePhases[Math.floor(Math.random() * practicePhases.length)]
    setTargetPhrase(randomPhrase.text)
    setTranscript('')
    setScore(null)
    setFeedback('')
  }

  const startListening = () => {
    if (!isSupported || !recognitionRef.current) {
      toast.error('Распознавание речи недоступно')
      return
    }

    try {
      setIsListening(true)
      setTranscript('')
      setScore(null)
      setFeedback('')
      recognitionRef.current.start()
      toast('Говорите сейчас...', { icon: '🎤', duration: 2000 })
    } catch (error) {
      console.error('Error starting recognition:', error)
      setIsListening(false)
      toast.error('Не удалось запустить распознавание речи')
    }
  }

  const stopListening = () => {
    if (recognitionRef.current && isListening) {
      recognitionRef.current.stop()
      setIsListening(false)
    }
  }

  const evaluatePronunciation = (spokenText) => {
    setAttempts(prev => prev + 1)
    
    const target = targetPhrase.toLowerCase().trim()
    const spoken = spokenText.toLowerCase().trim()

    // Calculate similarity score (simple word matching)
    const targetWords = target.split(' ')
    const spokenWords = spoken.split(' ')
    
    let matchingWords = 0
    targetWords.forEach(word => {
      if (spokenWords.includes(word)) {
        matchingWords++
      }
    })

    const similarity = Math.round((matchingWords / targetWords.length) * 100)
    setScore(similarity)

    // Generate feedback
    let feedbackText = ''
    if (similarity >= 90) {
      feedbackText = 'Отлично! Ваше произношение превосходно! 🌟'
      setSuccessCount(prev => prev + 1)
      toast.success('Отлично!')
    } else if (similarity >= 70) {
      feedbackText = 'Хорошо! Небольшие неточности, но в целом понятно. 👍'
      toast('Хорошо!', { icon: '👍' })
    } else if (similarity >= 50) {
      feedbackText = 'Неплохо! Продолжайте практиковаться. 💪'
      toast('Продолжайте практиковаться', { icon: '💪' })
    } else {
      feedbackText = 'Нужно больше практики. Попробуйте еще раз! 🎯'
      toast('Попробуйте еще раз', { icon: '🎯' })
    }

    setFeedback(feedbackText)
  }

  const speakPhrase = () => {
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(targetPhrase)
      utterance.lang = 'en-US'
      utterance.rate = 0.8 // Slower rate for learning
      window.speechSynthesis.speak(utterance)
    } else {
      toast.error('Синтез речи не поддерживается в вашем браузере')
    }
  }

  const getDifficultyColor = (difficulty) => {
    switch (difficulty) {
      case 'Easy': return 'text-green-600 bg-green-100'
      case 'Medium': return 'text-yellow-600 bg-yellow-100'
      case 'Hard': return 'text-red-600 bg-red-100'
      default: return 'text-gray-600 bg-gray-100'
    }
  }

  const currentPhrase = practicePhases.find(p => p.text === targetPhrase)
  const accuracy = attempts > 0 ? Math.round((successCount / attempts) * 100) : 0

  if (!isSupported) {
    return (
      <div className="max-w-4xl mx-auto animate-fade-in">
        <div className="card-premium glass-effect-premium text-center">
          <MicOff className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-primary mb-2">
            Распознавание речи недоступно
          </h2>
          <p className="text-secondary">
            Ваш браузер не поддерживает распознавание речи.
            <br />
            Пожалуйста, используйте Google Chrome для этой функции.
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto animate-fade-in space-y-6">
      {/* Header Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="card-premium glass-effect-premium text-center">
          <div className="text-3xl font-bold text-blue-600 dark:text-blue-400">
            {attempts}
          </div>
          <div className="text-sm text-secondary">Попыток</div>
        </div>
        <div className="card-premium glass-effect-premium text-center">
          <div className="text-3xl font-bold text-green-600 dark:text-green-400">
            {successCount}
          </div>
          <div className="text-sm text-secondary">Успешных</div>
        </div>
        <div className="card-premium glass-effect-premium text-center">
          <div className="text-3xl font-bold text-purple-600 dark:text-purple-400">
            {accuracy}%
          </div>
          <div className="text-sm text-secondary">Точность</div>
        </div>
      </div>

      {/* Main Practice Area */}
      <div className="card-premium glass-effect-premium">
        <div className="flex items-center space-x-3 mb-6">
          <div className="w-12 h-12 bg-gradient-to-r from-pink-600 to-red-600 rounded-2xl flex items-center justify-center animate-pulse-slow">
            <Mic className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-primary">Практика произношения</h1>
            <p className="text-sm text-secondary">Повторите фразу используя микрофон</p>
          </div>
        </div>

        {/* Target Phrase */}
        <div className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 p-6 rounded-2xl mb-6 border-2 border-blue-200 dark:border-blue-800">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center space-x-2">
              {currentPhrase && (
                <>
                  <span className={`text-xs font-semibold px-3 py-1 rounded-full ${getDifficultyColor(currentPhrase.difficulty)}`}>
                    {currentPhrase.difficulty}
                  </span>
                  <span className="text-xs font-semibold px-3 py-1 rounded-full text-blue-600 bg-blue-100 dark:bg-blue-900/30">
                    {currentPhrase.category}
                  </span>
                </>
              )}
            </div>
            <button
              onClick={speakPhrase}
              className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105"
            >
              <Volume2 className="w-4 h-4" />
              <span className="text-sm font-medium">Прослушать</span>
            </button>
          </div>
          <p className="text-2xl font-bold text-center text-gray-900 dark:text-white">
            "{targetPhrase}"
          </p>
        </div>

        {/* Microphone Button */}
        <div className="flex justify-center mb-6">
          <button
            onClick={isListening ? stopListening : startListening}
            disabled={!targetPhrase}
            className={`w-32 h-32 rounded-full flex items-center justify-center transition-all duration-300 transform hover:scale-110 shadow-2xl ${
              isListening
                ? 'bg-gradient-to-br from-red-500 to-pink-600 animate-pulse'
                : 'bg-gradient-to-br from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700'
            } disabled:opacity-50 disabled:cursor-not-allowed`}
          >
            {isListening ? (
              <Loader2 className="w-16 h-16 text-white animate-spin" />
            ) : (
              <Mic className="w-16 h-16 text-white" />
            )}
          </button>
        </div>

        <div className="text-center mb-6">
          <p className="text-sm text-secondary">
            {isListening ? 'Говорите сейчас...' : 'Нажмите на микрофон чтобы начать'}
          </p>
        </div>

        {/* Results */}
        {transcript && (
          <div className="space-y-4">
            <div className="bg-gray-50 dark:bg-gray-800/50 p-4 rounded-xl">
              <div className="text-sm text-secondary mb-2">Вы сказали:</div>
              <p className="text-lg font-medium text-primary">"{transcript}"</p>
            </div>

            {score !== null && (
              <div className={`p-4 rounded-xl ${
                score >= 90 ? 'bg-green-50 dark:bg-green-900/20 border-2 border-green-200 dark:border-green-800' :
                score >= 70 ? 'bg-yellow-50 dark:bg-yellow-900/20 border-2 border-yellow-200 dark:border-yellow-800' :
                'bg-red-50 dark:bg-red-900/20 border-2 border-red-200 dark:border-red-800'
              }`}>
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center space-x-2">
                    {score >= 90 ? (
                      <CheckCircle className="w-6 h-6 text-green-600" />
                    ) : score >= 70 ? (
                      <Trophy className="w-6 h-6 text-yellow-600" />
                    ) : (
                      <XCircle className="w-6 h-6 text-red-600" />
                    )}
                    <span className="font-semibold text-primary">Оценка: {score}%</span>
                  </div>
                </div>
                <p className="text-sm text-secondary">{feedback}</p>
              </div>
            )}
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex space-x-4 mt-6">
          <button
            onClick={selectNewPhrase}
            className="flex-1 py-3 px-6 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl font-semibold hover:from-blue-700 hover:to-purple-700 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105"
          >
            Новая фраза
          </button>
        </div>
      </div>

      {/* Tips */}
      <div className="card-premium glass-effect-premium">
        <h3 className="text-lg font-bold text-primary mb-4">💡 Советы для улучшения произношения</h3>
        <ul className="space-y-2 text-sm text-secondary">
          <li className="flex items-start space-x-2">
            <span className="text-blue-600">•</span>
            <span>Говорите четко и не торопитесь</span>
          </li>
          <li className="flex items-start space-x-2">
            <span className="text-blue-600">•</span>
            <span>Находитесь в тихом месте для лучшего распознавания</span>
          </li>
          <li className="flex items-start space-x-2">
            <span className="text-blue-600">•</span>
            <span>Прослушайте фразу несколько раз перед повторением</span>
          </li>
          <li className="flex items-start space-x-2">
            <span className="text-blue-600">•</span>
            <span>Обращайте внимание на интонацию и ударение</span>
          </li>
          <li className="flex items-start space-x-2">
            <span className="text-blue-600">•</span>
            <span>Практикуйтесь регулярно для лучших результатов</span>
          </li>
        </ul>
      </div>
    </div>
  )
}

export default SpeechRecognition


