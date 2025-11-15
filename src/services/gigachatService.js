// GigaChat API Service - Real Integration
import axios from 'axios'

class GigaChatService {
  constructor() {
    // API Configuration from environment variables
    this.clientId = import.meta.env.VITE_GIGACHAT_CLIENT_ID
    this.clientSecret = import.meta.env.VITE_GIGACHAT_CLIENT_SECRET
    this.authToken = import.meta.env.VITE_GIGACHAT_AUTH_TOKEN
    this.scope = import.meta.env.VITE_GIGACHAT_SCOPE || 'GIGACHAT_API_PERS'
    
    // API URLs - use proxy in development to avoid CORS and SSL issues
    const isDev = import.meta.env.DEV
    this.authUrl = isDev ? '/api/auth' : (import.meta.env.VITE_GIGACHAT_AUTH_URL || 'https://ngw.devices.sberbank.ru:9443/api/v2/oauth')
    this.apiUrl = isDev ? '/api/gigachat' : (import.meta.env.VITE_GIGACHAT_API_URL || 'https://gigachat.devices.sberbank.ru/api/v1')
    
    // Token management
    this.accessToken = null
    this.tokenExpiry = null
    
    // Conversation state
    this.conversationHistory = []
    this.userContext = {
      level: 'beginner',
      interests: [],
      learningGoals: [],
      weakAreas: []
    }
    
    // Check if API is configured
    this.isConfigured = !!(this.authToken || (this.clientId && this.clientSecret))
    
    if (!this.isConfigured) {
      console.warn('GigaChat API credentials not configured. Using demo mode.')
    }
  }

  // ==================== OAuth Authentication ====================

  async authenticate() {
    try {
      if (!this.isConfigured) {
        throw new Error('API credentials not configured')
      }

      // Check if token is still valid
      if (this.accessToken && this.tokenExpiry && Date.now() < this.tokenExpiry) {
        return this.accessToken
      }

      console.log('Authenticating with GigaChat API...')

      // Prepare authentication request
      const authData = new URLSearchParams()
      authData.append('scope', this.scope)

      const config = {
        method: 'POST',
        url: this.authUrl,
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          'Accept': 'application/json',
          'RqUID': this.generateRqUID(),
          'Authorization': `Basic ${this.authToken}`
        },
        data: authData
      }

      const response = await axios(config)

      if (response.data && response.data.access_token) {
        this.accessToken = response.data.access_token
        // Set token expiry (usually 30 minutes, subtract 1 minute for safety)
        const expiresIn = (response.data.expires_at || 1800) * 1000
        this.tokenExpiry = Date.now() + expiresIn - 60000
        
        console.log('✅ GigaChat authentication successful')
        return this.accessToken
      } else {
        throw new Error('Invalid authentication response')
      }
    } catch (error) {
      console.error('GigaChat authentication error:', error)
      
      if (error.response) {
        console.error('Response data:', error.response.data)
        console.error('Response status:', error.response.status)
      }
      
      // Fall back to demo mode on auth error
      this.isConfigured = false
      throw new Error('Authentication failed. Using demo mode.')
    }
  }

  // Generate unique request ID
  generateRqUID() {
    return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
  }

  // ==================== Main API Methods ====================

  async sendMessage(message, context = 'english-learning') {
    try {
      // Add message to history
      this.conversationHistory.push({
        role: 'user',
        content: message,
        timestamp: new Date()
      })

      let response

      // Try real API if configured
      if (this.isConfigured) {
        try {
          response = await this.sendToGigaChatAPI(message, context)
        } catch (apiError) {
          console.error('API call failed, falling back to demo mode:', apiError)
          response = await this.simulateGigaChatResponse(message, context)
        }
      } else {
        // Use demo mode
        response = await this.simulateGigaChatResponse(message, context)
      }

      // Add response to history
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

  async sendToGigaChatAPI(message, context) {
    try {
      // Ensure we have a valid token
      await this.authenticate()

      // Prepare system message based on context
      const systemMessage = this.getSystemMessage(context)

      // Prepare messages for API
      const messages = [
        {
          role: 'system',
          content: systemMessage
        },
        // Include conversation history (last 10 messages for context)
        ...this.conversationHistory.slice(-10).map(msg => ({
          role: msg.role,
          content: msg.content
        }))
      ]

      // API request configuration
      const config = {
        method: 'POST',
        url: `${this.apiUrl}/chat/completions`,
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'Authorization': `Bearer ${this.accessToken}`
        },
        data: {
          model: 'GigaChat',
          messages: messages,
          temperature: 0.7,
          top_p: 0.9,
          n: 1,
          stream: false,
          max_tokens: 1024,
          repetition_penalty: 1.1,
          update_interval: 0
        }
      }

      const response = await axios(config)

      if (response.data && response.data.choices && response.data.choices[0]) {
        return response.data.choices[0].message.content
      } else {
        throw new Error('Invalid API response format')
      }
    } catch (error) {
      console.error('GigaChat API request error:', error)
      
      if (error.response) {
        console.error('Response status:', error.response.status)
        console.error('Response data:', error.response.data)
        
        // If token expired, try to re-authenticate
        if (error.response.status === 401) {
          this.accessToken = null
          this.tokenExpiry = null
          throw new Error('Token expired, please retry')
        }
      }
      
      throw error
    }
  }

  getSystemMessage(context) {
    const systemMessages = {
      'english-learning': `You are a professional English language teacher and assistant. Your role is to:
- Help students learn English through conversation
- Explain grammar rules clearly and with examples
- Correct mistakes gently and constructively
- Provide translations between Russian and English
- Suggest better ways to express ideas
- Give pronunciation tips
- Be patient, encouraging, and supportive
- Adapt your level to the student's proficiency

Always respond in a friendly, educational manner. Mix English and Russian when helpful for understanding.`,

      'grammar': `You are an English grammar expert. Focus on:
- Explaining grammar rules clearly
- Providing multiple examples
- Comparing with Russian grammar when useful
- Highlighting common mistakes
- Giving practical exercises
- Being detailed but not overwhelming`,

      'vocabulary': `You are a vocabulary expert. Help students:
- Learn new words with context
- Understand word usage and collocations
- Remember words through associations
- Expand their vocabulary systematically
- Use words in natural sentences`,

      'pronunciation': `You are a pronunciation coach. Help with:
- Breaking down word sounds
- Explaining phonetic patterns
- Comparing with Russian sounds
- Giving practical pronunciation tips
- Building confidence in speaking`,

      'conversation': `You are a friendly conversation partner. Your goals:
- Have natural English conversations
- Gently correct mistakes
- Ask follow-up questions
- Encourage the student to speak more
- Make learning fun and engaging`
    }

    return systemMessages[context] || systemMessages['english-learning']
  }

  // ==================== Demo Mode (Fallback) ====================

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
      'привет': "Hello! I'm your English learning assistant powered by GigaChat AI. I can help you with grammar, vocabulary, pronunciation, and conversation practice. What would you like to work on today?",
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
      'help': "I'm here to help you learn English! I can assist with:\n- Grammar explanations\n- Vocabulary building\n- Translation\n- Pronunciation practice\n- Conversation practice\n- Writing tips\n\nWhat would you like to work on?",
      'помоги': "Я здесь, чтобы помочь! С чем конкретно вам нужна помощь? Грамматика, словарный запас, произношение или разговорная практика?",
    }

    // Поиск подходящего ответа
    for (const [key, response] of Object.entries(responses)) {
      if (message.includes(key)) {
        return response
      }
    }

    // Если сообщение содержит английские слова, отвечаем на английском
    if (/[a-zA-Z]/.test(message)) {
      return `That's interesting! "${message}" - let me help you with that. Could you tell me more about what you'd like to learn or practice in English? I can help with grammar, vocabulary, pronunciation, or conversation.`
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

  // ==================== Grammar Explanation ====================

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

  // ==================== Translation ====================

  async translateText(text, fromLang = 'auto', toLang = 'en') {
    // If API is configured, try to use it for translation
    if (this.isConfigured) {
      try {
        const prompt = `Translate the following text from ${fromLang === 'auto' ? 'detected language' : fromLang} to ${toLang}: "${text}". Provide only the translation without explanations.`
        return await this.sendToGigaChatAPI(prompt, 'translation')
      } catch (error) {
        console.error('Translation API error:', error)
      }
    }

    // Fallback to simple dictionary
    const translations = {
      'привет': 'hello',
      'как дела': 'how are you',
      'спасибо': 'thank you',
      'пожалуйста': 'please / you\'re welcome',
      'извините': 'sorry / excuse me',
      'hello': 'привет',
      'how are you': 'как дела',
      'thank you': 'спасибо',
      'please': 'пожалуйста',
      'sorry': 'извините'
    }

    const lowerText = text.toLowerCase()
    return translations[lowerText] || `Translation of "${text}" would be provided by the translation service.`
  }

  // ==================== Grammar Check ====================

  async checkGrammar(sentence) {
    // Simple grammar check (in real app would use API)
    const suggestions = []
    
    // Check for capital letter at start
    if (sentence[0] !== sentence[0].toUpperCase()) {
      suggestions.push('Start the sentence with a capital letter.')
    }

    // Check for punctuation at end
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

  // ==================== Exercise Generation ====================

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

  // ==================== Text Analysis ====================

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

  // ==================== Utility Methods ====================

  getConversationHistory() {
    return this.conversationHistory
  }

  clearHistory() {
    this.conversationHistory = []
  }

  updateUserContext(context) {
    this.userContext = { ...this.userContext, ...context }
  }

  getUserContext() {
    return this.userContext
  }

  isApiConfigured() {
    return this.isConfigured
  }

  getApiStatus() {
    return {
      configured: this.isConfigured,
      authenticated: !!this.accessToken,
      tokenValid: this.tokenExpiry && Date.now() < this.tokenExpiry,
      mode: this.isConfigured ? 'API' : 'Demo'
    }
  }
}

export default new GigaChatService()
