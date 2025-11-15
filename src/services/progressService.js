// Progress Tracking Service with localStorage persistence

class ProgressService {
  constructor() {
    this.storageKey = 'english_learning_progress'
    this.vocabularyKey = 'english_vocabulary'
    this.achievementsKey = 'english_achievements'
    this.statisticsKey = 'english_statistics'
  }

  // ==================== Progress Management ====================

  getProgress() {
    try {
      const saved = localStorage.getItem(this.storageKey)
      return saved ? JSON.parse(saved) : this.getDefaultProgress()
    } catch (error) {
      console.error('Error loading progress:', error)
      return this.getDefaultProgress()
    }
  }

  getDefaultProgress() {
    return {
      level: 'Beginner',
      xp: 0,
      totalWords: 0,
      lessonsCompleted: 0,
      streak: 0,
      lastActive: null,
      studyTime: 0, // in minutes
      exercisesCompleted: 0,
      correctAnswers: 0,
      totalAnswers: 0,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }
  }

  saveProgress(progress) {
    try {
      const updatedProgress = {
        ...progress,
        updatedAt: new Date().toISOString()
      }
      localStorage.setItem(this.storageKey, JSON.stringify(updatedProgress))
      return true
    } catch (error) {
      console.error('Error saving progress:', error)
      return false
    }
  }

  updateProgress(updates) {
    const current = this.getProgress()
    const updated = { ...current, ...updates }
    return this.saveProgress(updated)
  }

  addXP(amount) {
    const progress = this.getProgress()
    const newXP = progress.xp + amount
    const newLevel = this.calculateLevel(newXP)
    
    this.updateProgress({
      xp: newXP,
      level: newLevel
    })

    return { newXP, newLevel, leveledUp: newLevel !== progress.level }
  }

  calculateLevel(xp) {
    if (xp < 100) return 'Beginner'
    if (xp < 500) return 'Elementary'
    if (xp < 1000) return 'Pre-Intermediate'
    if (xp < 2000) return 'Intermediate'
    if (xp < 3500) return 'Upper-Intermediate'
    if (xp < 5000) return 'Advanced'
    return 'Proficient'
  }

  getLevelProgress(xp) {
    const levels = [
      { name: 'Beginner', min: 0, max: 100 },
      { name: 'Elementary', min: 100, max: 500 },
      { name: 'Pre-Intermediate', min: 500, max: 1000 },
      { name: 'Intermediate', min: 1000, max: 2000 },
      { name: 'Upper-Intermediate', min: 2000, max: 3500 },
      { name: 'Advanced', min: 3500, max: 5000 },
      { name: 'Proficient', min: 5000, max: Infinity }
    ]

    const currentLevel = levels.find(l => xp >= l.min && xp < l.max)
    if (!currentLevel) return { progress: 100, nextLevel: null }

    const progress = currentLevel.max === Infinity
      ? 100
      : Math.round(((xp - currentLevel.min) / (currentLevel.max - currentLevel.min)) * 100)

    const nextLevelIndex = levels.findIndex(l => l.name === currentLevel.name) + 1
    const nextLevel = nextLevelIndex < levels.length ? levels[nextLevelIndex].name : null

    return { 
      progress, 
      nextLevel,
      currentLevel: currentLevel.name,
      xpToNext: currentLevel.max === Infinity ? 0 : currentLevel.max - xp
    }
  }

  // ==================== Vocabulary Management ====================

  getVocabulary() {
    try {
      const saved = localStorage.getItem(this.vocabularyKey)
      return saved ? JSON.parse(saved) : []
    } catch (error) {
      console.error('Error loading vocabulary:', error)
      return []
    }
  }

  saveVocabulary(vocabulary) {
    try {
      localStorage.setItem(this.vocabularyKey, JSON.stringify(vocabulary))
      return true
    } catch (error) {
      console.error('Error saving vocabulary:', error)
      return false
    }
  }

  addWord(word) {
    const vocabulary = this.getVocabulary()
    const newWord = {
      id: Date.now(),
      word: word.word,
      translation: word.translation,
      example: word.example || '',
      category: word.category || 'General',
      mastered: false,
      reviewCount: 0,
      lastReviewed: null,
      addedAt: new Date().toISOString()
    }

    vocabulary.push(newWord)
    this.saveVocabulary(vocabulary)
    
    // Update progress
    const progress = this.getProgress()
    this.updateProgress({ totalWords: progress.totalWords + 1 })
    
    return newWord
  }

  updateWord(id, updates) {
    const vocabulary = this.getVocabulary()
    const index = vocabulary.findIndex(w => w.id === id)
    if (index !== -1) {
      vocabulary[index] = { ...vocabulary[index], ...updates }
      this.saveVocabulary(vocabulary)
      return true
    }
    return false
  }

  deleteWord(id) {
    const vocabulary = this.getVocabulary()
    const filtered = vocabulary.filter(w => w.id !== id)
    this.saveVocabulary(filtered)
    
    const progress = this.getProgress()
    this.updateProgress({ totalWords: Math.max(0, progress.totalWords - 1) })
  }

  markWordAsReviewed(id) {
    const vocabulary = this.getVocabulary()
    const word = vocabulary.find(w => w.id === id)
    if (word) {
      word.reviewCount = (word.reviewCount || 0) + 1
      word.lastReviewed = new Date().toISOString()
      if (word.reviewCount >= 5) {
        word.mastered = true
      }
      this.saveVocabulary(vocabulary)
      return word
    }
    return null
  }

  // ==================== Achievements ====================

  getAchievements() {
    try {
      const saved = localStorage.getItem(this.achievementsKey)
      return saved ? JSON.parse(saved) : this.getDefaultAchievements()
    } catch (error) {
      console.error('Error loading achievements:', error)
      return this.getDefaultAchievements()
    }
  }

  getDefaultAchievements() {
    return [
      { id: 'first_word', name: 'Первое слово', description: 'Добавьте свое первое слово', unlocked: false, icon: '📝', xp: 10 },
      { id: 'word_collector_10', name: 'Коллекционер слов', description: 'Выучите 10 слов', unlocked: false, icon: '📚', xp: 25 },
      { id: 'word_collector_50', name: 'Словарный запас', description: 'Выучите 50 слов', unlocked: false, icon: '📖', xp: 50 },
      { id: 'word_collector_100', name: 'Мастер слов', description: 'Выучите 100 слов', unlocked: false, icon: '🎓', xp: 100 },
      { id: 'streak_3', name: 'Три дня подряд', description: 'Занимайтесь 3 дня подряд', unlocked: false, icon: '🔥', xp: 20 },
      { id: 'streak_7', name: 'Неделя силы', description: 'Занимайтесь 7 дней подряд', unlocked: false, icon: '💪', xp: 50 },
      { id: 'streak_30', name: 'Месяц упорства', description: 'Занимайтесь 30 дней подряд', unlocked: false, icon: '🏆', xp: 200 },
      { id: 'exercises_10', name: 'Начинающий', description: 'Выполните 10 упражнений', unlocked: false, icon: '✏️', xp: 15 },
      { id: 'exercises_50', name: 'Практикующий', description: 'Выполните 50 упражнений', unlocked: false, icon: '✍️', xp: 75 },
      { id: 'accuracy_80', name: 'Меткий стрелок', description: 'Достигните точности 80%', unlocked: false, icon: '🎯', xp: 50 },
      { id: 'accuracy_95', name: 'Снайпер', description: 'Достигните точности 95%', unlocked: false, icon: '🎖️', xp: 100 },
      { id: 'chat_master', name: 'Болтун', description: 'Отправьте 100 сообщений в чат', unlocked: false, icon: '💬', xp: 30 },
      { id: 'early_bird', name: 'Ранняя птичка', description: 'Занимайтесь до 8 утра', unlocked: false, icon: '🌅', xp: 25 },
      { id: 'night_owl', name: 'Ночная сова', description: 'Занимайтесь после 23:00', unlocked: false, icon: '🦉', xp: 25 },
    ]
  }

  saveAchievements(achievements) {
    try {
      localStorage.setItem(this.achievementsKey, JSON.stringify(achievements))
      return true
    } catch (error) {
      console.error('Error saving achievements:', error)
      return false
    }
  }

  unlockAchievement(achievementId) {
    const achievements = this.getAchievements()
    const achievement = achievements.find(a => a.id === achievementId)
    
    if (achievement && !achievement.unlocked) {
      achievement.unlocked = true
      achievement.unlockedAt = new Date().toISOString()
      this.saveAchievements(achievements)
      
      // Add XP reward
      this.addXP(achievement.xp)
      
      return achievement
    }
    return null
  }

  checkAchievements() {
    const progress = this.getProgress()
    const vocabulary = this.getVocabulary()
    const newlyUnlocked = []

    // Word-based achievements
    if (vocabulary.length >= 1) {
      const unlocked = this.unlockAchievement('first_word')
      if (unlocked) newlyUnlocked.push(unlocked)
    }
    if (vocabulary.length >= 10) {
      const unlocked = this.unlockAchievement('word_collector_10')
      if (unlocked) newlyUnlocked.push(unlocked)
    }
    if (vocabulary.length >= 50) {
      const unlocked = this.unlockAchievement('word_collector_50')
      if (unlocked) newlyUnlocked.push(unlocked)
    }
    if (vocabulary.length >= 100) {
      const unlocked = this.unlockAchievement('word_collector_100')
      if (unlocked) newlyUnlocked.push(unlocked)
    }

    // Streak-based achievements
    if (progress.streak >= 3) {
      const unlocked = this.unlockAchievement('streak_3')
      if (unlocked) newlyUnlocked.push(unlocked)
    }
    if (progress.streak >= 7) {
      const unlocked = this.unlockAchievement('streak_7')
      if (unlocked) newlyUnlocked.push(unlocked)
    }
    if (progress.streak >= 30) {
      const unlocked = this.unlockAchievement('streak_30')
      if (unlocked) newlyUnlocked.push(unlocked)
    }

    // Exercise-based achievements
    if (progress.exercisesCompleted >= 10) {
      const unlocked = this.unlockAchievement('exercises_10')
      if (unlocked) newlyUnlocked.push(unlocked)
    }
    if (progress.exercisesCompleted >= 50) {
      const unlocked = this.unlockAchievement('exercises_50')
      if (unlocked) newlyUnlocked.push(unlocked)
    }

    // Accuracy-based achievements
    if (progress.totalAnswers >= 20) {
      const accuracy = (progress.correctAnswers / progress.totalAnswers) * 100
      if (accuracy >= 80) {
        const unlocked = this.unlockAchievement('accuracy_80')
        if (unlocked) newlyUnlocked.push(unlocked)
      }
      if (accuracy >= 95) {
        const unlocked = this.unlockAchievement('accuracy_95')
        if (unlocked) newlyUnlocked.push(unlocked)
      }
    }

    // Time-based achievements
    const hour = new Date().getHours()
    if (hour < 8) {
      const unlocked = this.unlockAchievement('early_bird')
      if (unlocked) newlyUnlocked.push(unlocked)
    }
    if (hour >= 23) {
      const unlocked = this.unlockAchievement('night_owl')
      if (unlocked) newlyUnlocked.push(unlocked)
    }

    return newlyUnlocked
  }

  // ==================== Statistics ====================

  getStatistics() {
    try {
      const saved = localStorage.getItem(this.statisticsKey)
      return saved ? JSON.parse(saved) : this.getDefaultStatistics()
    } catch (error) {
      console.error('Error loading statistics:', error)
      return this.getDefaultStatistics()
    }
  }

  getDefaultStatistics() {
    return {
      dailyActivity: [],
      weeklyGoal: 7, // days per week
      dailyGoalMinutes: 15,
      categoriesStudied: {},
      topicsMastered: [],
      studySessions: []
    }
  }

  saveStatistics(stats) {
    try {
      localStorage.setItem(this.statisticsKey, JSON.stringify(stats))
      return true
    } catch (error) {
      console.error('Error saving statistics:', error)
      return false
    }
  }

  recordStudySession(durationMinutes, activity) {
    const stats = this.getStatistics()
    const today = new Date().toDateString()
    
    // Add to study sessions
    stats.studySessions.push({
      date: new Date().toISOString(),
      duration: durationMinutes,
      activity: activity
    })

    // Keep only last 100 sessions
    if (stats.studySessions.length > 100) {
      stats.studySessions = stats.studySessions.slice(-100)
    }

    // Update daily activity
    const todayActivity = stats.dailyActivity.find(d => d.date === today)
    if (todayActivity) {
      todayActivity.minutes += durationMinutes
      todayActivity.activities.push(activity)
    } else {
      stats.dailyActivity.push({
        date: today,
        minutes: durationMinutes,
        activities: [activity]
      })
    }

    // Keep only last 90 days
    if (stats.dailyActivity.length > 90) {
      stats.dailyActivity = stats.dailyActivity.slice(-90)
    }

    this.saveStatistics(stats)

    // Update progress
    const progress = this.getProgress()
    this.updateProgress({
      studyTime: progress.studyTime + durationMinutes,
      lastActive: new Date().toISOString()
    })
  }

  getWeeklyProgress() {
    const stats = this.getStatistics()
    const today = new Date()
    const weekAgo = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000)
    
    const weeklyActivity = stats.dailyActivity.filter(d => {
      const date = new Date(d.date)
      return date >= weekAgo && date <= today
    })

    const totalMinutes = weeklyActivity.reduce((sum, d) => sum + d.minutes, 0)
    const daysActive = weeklyActivity.length

    return {
      totalMinutes,
      daysActive,
      goalDays: stats.weeklyGoal,
      goalProgress: Math.round((daysActive / stats.weeklyGoal) * 100),
      averageMinutesPerDay: daysActive > 0 ? Math.round(totalMinutes / daysActive) : 0
    }
  }

  // ==================== Export/Import ====================

  exportAllData() {
    return {
      progress: this.getProgress(),
      vocabulary: this.getVocabulary(),
      achievements: this.getAchievements(),
      statistics: this.getStatistics(),
      exportDate: new Date().toISOString(),
      version: '1.0'
    }
  }

  importData(data) {
    try {
      if (data.progress) this.saveProgress(data.progress)
      if (data.vocabulary) this.saveVocabulary(data.vocabulary)
      if (data.achievements) this.saveAchievements(data.achievements)
      if (data.statistics) this.saveStatistics(data.statistics)
      return true
    } catch (error) {
      console.error('Error importing data:', error)
      return false
    }
  }

  resetAllData() {
    localStorage.removeItem(this.storageKey)
    localStorage.removeItem(this.vocabularyKey)
    localStorage.removeItem(this.achievementsKey)
    localStorage.removeItem(this.statisticsKey)
    return true
  }
}

export default new ProgressService()


