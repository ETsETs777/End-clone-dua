// GigaChat API Service
// Расширенный сервис для работы с GigaChat API

class GigaChatService {
  constructor() {
    this.apiKey = import.meta.env.VITE_GIGACHAT_API_KEY || 'demo-key-for-development'
    this.baseUrl = 'https://gigachat.devices.sberbank.ru/api/v1'
    this.conversationHistory = []
    this.userContext = {
      level: 'beginner',
      interests: [],
      learningGoals: [],
      weakAreas: []
    }
  }

  // Метод для отправки сообщения в GigaChat
  async sendMessage(message, context = 'english-learning') {
    try {
      // Добавляем сообщение в историю
      this.conversationHistory.push({
        role: 'user',
        content: message,
        timestamp: new Date()
      })

      // В реальном проекте здесь будет настоящий API вызов
      const response = await this.simulateGigaChatResponse(message, context)
      
      // Добавляем ответ в историю
      this.conversationHistory.push({
        role: 'assistant',
        content: response,
        timestamp: new Date()
      })

      return response
    } catch (error) {
      console.error('GigaChat API Error:', error)
      throw new Error('Ошибка при обращении к GigaChat API')
    }
  }

  // Улучшенная имитация ответа GigaChat
  async simulateGigaChatResponse(message, context) {
    // Имитация задержки API
    await new Promise(resolve => setTimeout(resolve, 800 + Math.random() * 1200))

    const lowerMessage = message.toLowerCase()

    // Контекстные ответы для изучения английского
    if (context === 'english-learning') {
      return this.getAdvancedEnglishLearningResponse(lowerMessage)
    }

    // Общие ответы
    return this.getGeneralResponse(lowerMessage)
  }

  getAdvancedEnglishLearningResponse(message) {
    const responses = {
      // Приветствие
      'привет': "Hello! I'm your English learning assistant. I can help you with grammar, vocabulary, pronunciation, and conversation practice. What would you like to work on today?",
      'hello': "Hello! Great to see you practicing English! I'm here to help you improve your language skills. What specific area would you like to focus on?",
      
      // Перевод
      'переведи': "I'd be happy to help you translate! Please tell me what you'd like to translate from Russian to English or vice versa. I can also explain the nuances and context.",
      'translate': "Sure! What would you like me to translate for you? I can provide both literal and contextual translations.",
      
      // Грамматика
      'грамматика': "Let's work on grammar! I can help you with tenses, articles, prepositions, conditionals, and more. What specific grammar topic interests you?",
      'grammar': "Grammar is the foundation of English! I can explain rules, provide examples, and help you practice. What grammar concept would you like to explore?",
      
      // Словарь
      'слова': "Great! Let's expand your vocabulary. I can explain word meanings, usage, synonyms, antonyms, and help you remember new words through context and examples.",
      'vocabulary': "Vocabulary building is essential for fluency! I can help you learn new words, understand their usage, and practice them in sentences.",
      
      // Произношение
      'произношение': "Pronunciation is key to clear communication! I can help you with phonetic transcriptions, stress patterns, and common pronunciation mistakes.",
      'pronunciation': "I can help with pronunciation! Tell me which words you'd like to practice, and I'll provide phonetic guidance.",
      
      // Практика
      'практика': "Practice makes perfect! Let's have a conversation in English. We can discuss various topics, practice different tenses, or work on specific skills.",
      'practice': "Excellent! Let's practice English together. What would you like to talk about? We can work on conversation, writing, or specific language skills.",
      
      // Времена
      'present simple': "Present Simple is used for habits, facts, and general truths. Structure: Subject + base verb (+s for 3rd person). Examples: 'I work every day', 'She likes coffee', 'Water boils at 100°C'.",
      'past simple': "Past Simple describes completed actions in the past. Structure: Subject + past tense verb. Examples: 'I worked yesterday', 'She went to school', 'They studied hard'.",
      'future simple': "Future Simple expresses future actions. Structure: Subject + will + base verb. Examples: 'I will work tomorrow', 'She will study English', 'They will travel next year'.",
      'present perfect': "Present Perfect connects past and present. Structure: Subject + have/has + past participle. Examples: 'I have worked here for 5 years', 'She has visited London'.",
      
      // Благодарность
      'спасибо': "You're welcome! In English, we say 'Thank you' and the response is 'You're welcome', 'My pleasure', or 'No problem'.",
      'thank you': "You're very welcome! I'm here to help you learn English. Feel free to ask me anything!",
      
      // Прощание
      'пока': "Goodbye! Keep practicing English every day. Remember: consistency is key to language learning. See you soon!",
      'goodbye': "Goodbye! Don't forget to practice regularly. Every conversation helps you improve. Take care!",
      
      // Специальные запросы
      'как дела': "I'm doing great, thank you for asking! How are you doing? In English, we often say 'How are you?' or 'How's it going?'",
      'как тебя зовут': "My name is GigaChat Assistant! I'm your English learning companion. What's your name?",
      'помоги': "I'm here to help! What specific aspect of English would you like assistance with? Grammar, vocabulary, pronunciation, or conversation?",
      'объясни': "I'd be happy to explain! What would you like me to clarify? A grammar rule, word meaning, or something else?",
      'пример': "Sure! I can provide examples. What concept would you like me to illustrate with examples?",
      'упражнение': "Great idea! Let's do some exercises. What type of practice would you like? Grammar exercises, vocabulary practice, or conversation practice?"
    }

    // Поиск подходящего ответа
    for (const [key, response] of Object.entries(responses)) {
      if (message.includes(key)) {
        return response
      }
    }

    // Если сообщение содержит английские слова, отвечаем на английском
    if (/[a-zA-Z]/.test(message)) {
      return `That's interesting! "${message}" - let me help you with that. Could you tell me more about what you'd like to learn or practice in English? I can help with grammar, vocabulary, or conversation.`
    }

    // Общий ответ на русском
    return `Интересно! "${message}" - давайте разберём это. Расскажите подробнее, что именно вы хотели бы изучить или попрактиковать в английском языке? Я могу помочь с грамматикой, словарём, произношением или разговорной практикой.`
  }

  getGeneralResponse(message) {
    const generalResponses = [
      "That's a great question! Let me help you with that.",
      "I understand what you're asking. Here's what I think...",
      "Interesting point! Let me explain this to you.",
      "Good question! This is how it works...",
      "I'd be happy to help you understand this better."
    ]

    return generalResponses[Math.floor(Math.random() * generalResponses.length)]
  }

  // Метод для получения объяснения грамматического правила
  async explainGrammar(rule) {
    const grammarRules = {
      'present simple': {
        usage: 'Used for habits, facts, and general truths',
        formation: 'Subject + base verb (+s for 3rd person singular)',
        examples: [
          'I work every day',
          'She likes coffee',
          'They play football'
        ],
        negative: 'Subject + do/does + not + base verb',
        questions: 'Do/Does + subject + base verb?'
      },
      'past simple': {
        usage: 'Used for completed actions in the past',
        formation: 'Subject + past tense verb',
        examples: [
          'I worked yesterday',
          'She went to school',
          'They played football'
        ],
        negative: 'Subject + did + not + base verb',
        questions: 'Did + subject + base verb?'
      },
      'present perfect': {
        usage: 'Used for actions that started in the past and continue to the present',
        formation: 'Subject + have/has + past participle',
        examples: [
          'I have worked here for 5 years',
          'She has visited London',
          'They have studied English'
        ],
        negative: 'Subject + have/has + not + past participle',
        questions: 'Have/Has + subject + past participle?'
      }
    }

    const ruleData = grammarRules[rule.toLowerCase()]
    if (ruleData) {
      return `Here's how ${rule} works:

Usage: ${ruleData.usage}
Formation: ${ruleData.formation}

Examples:
${ruleData.examples.map(ex => `• ${ex}`).join('\n')}

Negative: ${ruleData.negative}
Questions: ${ruleData.questions}`
    }

    return `I'd be happy to explain ${rule}! Could you be more specific about what aspect you'd like to understand?`
  }

  // Метод для перевода текста
  async translateText(text, fromLang = 'auto', toLang = 'en') {
    // В реальном проекте здесь будет интеграция с переводческим API
    const translations = {
      'привет': 'hello',
      'как дела': 'how are you',
      'спасибо': 'thank you',
      'пожалуйста': 'please',
      'извините': 'sorry',
      'hello': 'привет',
      'how are you': 'как дела',
      'thank you': 'спасибо',
      'please': 'пожалуйста',
      'sorry': 'извините'
    }

    const lowerText = text.toLowerCase()
    return translations[lowerText] || `Translation of "${text}" would be provided by the translation service.`
  }

  // Метод для проверки правильности предложения
  async checkGrammar(sentence) {
    // Простая проверка грамматики (в реальном проекте будет более сложная логика)
    const suggestions = []
    
    // Проверка на заглавную букву в начале
    if (sentence[0] !== sentence[0].toUpperCase()) {
      suggestions.push('Start the sentence with a capital letter.')
    }

    // Проверка на точку в конце
    if (!sentence.endsWith('.') && !sentence.endsWith('!') && !sentence.endsWith('?')) {
      suggestions.push('End the sentence with proper punctuation.')
    }

    return {
      isCorrect: suggestions.length === 0,
      suggestions: suggestions,
      correctedSentence: suggestions.length > 0 ? 
        sentence.charAt(0).toUpperCase() + sentence.slice(1) + '.' : 
        sentence
    }
  }

  // Новые методы для расширенной функциональности

  // Получение истории разговора
  getConversationHistory() {
    return this.conversationHistory
  }

  // Очистка истории
  clearHistory() {
    this.conversationHistory = []
  }

  // Обновление контекста пользователя
  updateUserContext(context) {
    this.userContext = { ...this.userContext, ...context }
  }

  // Получение контекста пользователя
  getUserContext() {
    return this.userContext
  }

  // Генерация упражнений
  async generateExercise(type, level = 'beginner') {
    const exercises = {
      grammar: {
        beginner: [
          {
            question: "Choose the correct form: I ___ English every day.",
            options: ["study", "studies", "studying", "studied"],
            correct: 0,
            explanation: "Present Simple uses base form of verb for 'I'"
          },
          {
            question: "Complete: She ___ to school yesterday.",
            options: ["go", "goes", "went", "going"],
            correct: 2,
            explanation: "Past Simple uses past tense form 'went'"
          }
        ],
        intermediate: [
          {
            question: "Choose: I ___ here for 5 years.",
            options: ["work", "worked", "have worked", "am working"],
            correct: 2,
            explanation: "Present Perfect for duration with 'for'"
          }
        ]
      },
      vocabulary: {
        beginner: [
          {
            question: "What is the opposite of 'big'?",
            options: ["large", "small", "huge", "enormous"],
            correct: 1,
            explanation: "Small is the opposite of big"
          }
        ]
      }
    }

    const exerciseType = exercises[type]?.[level]
    if (exerciseType) {
      return exerciseType[Math.floor(Math.random() * exerciseType.length)]
    }

    return null
  }

  // Анализ текста на сложность
  analyzeTextComplexity(text) {
    const words = text.split(' ')
    const sentences = text.split(/[.!?]+/).filter(s => s.trim())
    
    const avgWordsPerSentence = words.length / sentences.length
    const complexWords = words.filter(word => word.length > 6).length
    const complexityRatio = complexWords / words.length

    let level = 'beginner'
    if (avgWordsPerSentence > 15 || complexityRatio > 0.3) {
      level = 'advanced'
    } else if (avgWordsPerSentence > 10 || complexityRatio > 0.15) {
      level = 'intermediate'
    }

    return {
      level,
      avgWordsPerSentence: Math.round(avgWordsPerSentence),
      complexityRatio: Math.round(complexityRatio * 100),
      wordCount: words.length,
      sentenceCount: sentences.length
    }
  }
}

export default new GigaChatService()