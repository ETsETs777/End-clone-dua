// Security utilities and validation
export const SecurityUtils = {
  // Sanitize user input to prevent XSS
  sanitizeInput: (input) => {
    if (typeof input !== 'string') return input
    
    return input
      .replace(/[<>]/g, '') // Remove potential HTML tags
      .replace(/javascript:/gi, '') // Remove javascript: protocol
      .replace(/on\w+=/gi, '') // Remove event handlers
      .trim()
  },

  // Validate email format
  validateEmail: (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return emailRegex.test(email)
  },

  // Validate password strength
  validatePassword: (password) => {
    const minLength = 8
    const hasUpperCase = /[A-Z]/.test(password)
    const hasLowerCase = /[a-z]/.test(password)
    const hasNumbers = /\d/.test(password)
    const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password)

    return {
      isValid: password.length >= minLength && hasUpperCase && hasLowerCase && hasNumbers,
      strength: {
        length: password.length >= minLength,
        uppercase: hasUpperCase,
        lowercase: hasLowerCase,
        numbers: hasNumbers,
        special: hasSpecialChar
      },
      score: [password.length >= minLength, hasUpperCase, hasLowerCase, hasNumbers, hasSpecialChar]
        .filter(Boolean).length
    }
  },

  // Rate limiting simulation
  rateLimit: {
    requests: new Map(),
    
    checkLimit: (identifier, maxRequests = 10, windowMs = 60000) => {
      const now = Date.now()
      const windowStart = now - windowMs
      
      if (!this.rateLimit.requests.has(identifier)) {
        this.rateLimit.requests.set(identifier, [])
      }
      
      const requests = this.rateLimit.requests.get(identifier)
      const recentRequests = requests.filter(time => time > windowStart)
      
      if (recentRequests.length >= maxRequests) {
        return false
      }
      
      recentRequests.push(now)
      this.rateLimit.requests.set(identifier, recentRequests)
      return true
    }
  },

  // Generate secure random token
  generateToken: (length = 32) => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
    let result = ''
    for (let i = 0; i < length; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length))
    }
    return result
  },

  // Encrypt sensitive data (simple base64 encoding for demo)
  encrypt: (data) => {
    return btoa(JSON.stringify(data))
  },

  // Decrypt sensitive data
  decrypt: (encryptedData) => {
    try {
      return JSON.parse(atob(encryptedData))
    } catch (error) {
      console.error('Decryption error:', error)
      return null
    }
  }
}

// Performance monitoring utilities
export const PerformanceUtils = {
  // Measure function execution time
  measureTime: (fn, label = 'Function') => {
    const start = performance.now()
    const result = fn()
    const end = performance.now()
    console.log(`${label} execution time: ${end - start}ms`)
    return result
  },

  // Debounce function calls
  debounce: (func, wait) => {
    let timeout
    return function executedFunction(...args) {
      const later = () => {
        clearTimeout(timeout)
        func(...args)
      }
      clearTimeout(timeout)
      timeout = setTimeout(later, wait)
    }
  },

  // Throttle function calls
  throttle: (func, limit) => {
    let inThrottle
    return function executedFunction(...args) {
      if (!inThrottle) {
        func.apply(this, args)
        inThrottle = true
        setTimeout(() => inThrottle = false, limit)
      }
    }
  },

  // Lazy load images
  lazyLoadImages: () => {
    const images = document.querySelectorAll('img[data-src]')
    const imageObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const img = entry.target
          img.src = img.dataset.src
          img.classList.remove('lazy')
          imageObserver.unobserve(img)
        }
      })
    })

    images.forEach(img => imageObserver.observe(img))
  },

  // Preload critical resources
  preloadResources: (resources) => {
    resources.forEach(resource => {
      const link = document.createElement('link')
      link.rel = 'preload'
      link.href = resource.url
      link.as = resource.type || 'script'
      if (resource.crossorigin) {
        link.crossOrigin = 'anonymous'
      }
      document.head.appendChild(link)
    })
  },

  // Monitor Core Web Vitals
  monitorWebVitals: () => {
    // Largest Contentful Paint (LCP)
    new PerformanceObserver((entryList) => {
      const entries = entryList.getEntries()
      const lastEntry = entries[entries.length - 1]
      console.log('LCP:', lastEntry.startTime)
    }).observe({ entryTypes: ['largest-contentful-paint'] })

    // First Input Delay (FID)
    new PerformanceObserver((entryList) => {
      const entries = entryList.getEntries()
      entries.forEach(entry => {
        console.log('FID:', entry.processingStart - entry.startTime)
      })
    }).observe({ entryTypes: ['first-input'] })

    // Cumulative Layout Shift (CLS)
    let clsValue = 0
    new PerformanceObserver((entryList) => {
      const entries = entryList.getEntries()
      entries.forEach(entry => {
        if (!entry.hadRecentInput) {
          clsValue += entry.value
        }
      })
      console.log('CLS:', clsValue)
    }).observe({ entryTypes: ['layout-shift'] })
  }
}

// Error handling and logging
export const ErrorHandler = {
  // Global error handler
  handleError: (error, context = 'Unknown') => {
    console.error(`Error in ${context}:`, error)
    
    // In production, send to error tracking service
    if (import.meta.env.PROD) {
      // Example: send to Sentry, LogRocket, etc.
      console.log('Sending error to tracking service:', {
        error: error.message,
        stack: error.stack,
        context,
        timestamp: new Date().toISOString(),
        userAgent: navigator.userAgent,
        url: window.location.href
      })
    }
  },

  // Async error wrapper
  asyncHandler: (fn) => {
    return async (...args) => {
      try {
        return await fn(...args)
      } catch (error) {
        ErrorHandler.handleError(error, fn.name)
        throw error
      }
    }
  },

  // Retry mechanism
  retry: async (fn, maxAttempts = 3, delay = 1000) => {
    for (let attempt = 1; attempt <= maxAttempts; attempt++) {
      try {
        return await fn()
      } catch (error) {
        if (attempt === maxAttempts) {
          throw error
        }
        await new Promise(resolve => setTimeout(resolve, delay * attempt))
      }
    }
  }
}

// Data validation schemas
export const ValidationSchemas = {
  user: {
    name: (value) => {
      if (!value || value.trim().length < 2) {
        return 'Имя должно содержать минимум 2 символа'
      }
      if (value.length > 50) {
        return 'Имя не должно превышать 50 символов'
      }
      return null
    },
    
    email: (value) => {
      if (!value) {
        return 'Email обязателен'
      }
      if (!SecurityUtils.validateEmail(value)) {
        return 'Неверный формат email'
      }
      return null
    },
    
    password: (value) => {
      if (!value) {
        return 'Пароль обязателен'
      }
      const validation = SecurityUtils.validatePassword(value)
      if (!validation.isValid) {
        return 'Пароль должен содержать минимум 8 символов, включая заглавные и строчные буквы, цифры'
      }
      return null
    }
  },

  vocabulary: {
    english: (value) => {
      if (!value || value.trim().length === 0) {
        return 'Английское слово обязательно'
      }
      if (value.length > 100) {
        return 'Слово не должно превышать 100 символов'
      }
      return null
    },
    
    russian: (value) => {
      if (!value || value.trim().length === 0) {
        return 'Русский перевод обязателен'
      }
      if (value.length > 100) {
        return 'Перевод не должен превышать 100 символов'
      }
      return null
    }
  },

  chat: {
    message: (value) => {
      if (!value || value.trim().length === 0) {
        return 'Сообщение не может быть пустым'
      }
      if (value.length > 1000) {
        return 'Сообщение не должно превышать 1000 символов'
      }
      return null
    }
  }
}

// Cache management
export const CacheManager = {
  // Simple in-memory cache
  cache: new Map(),
  
  set: (key, value, ttl = 300000) => { // 5 minutes default TTL
    const expiry = Date.now() + ttl
    CacheManager.cache.set(key, { value, expiry })
  },
  
  get: (key) => {
    const item = CacheManager.cache.get(key)
    if (!item) return null
    
    if (Date.now() > item.expiry) {
      CacheManager.cache.delete(key)
      return null
    }
    
    return item.value
  },
  
  clear: () => {
    CacheManager.cache.clear()
  },
  
  // Cache with localStorage
  setPersistent: (key, value) => {
    try {
      localStorage.setItem(key, JSON.stringify({
        value,
        timestamp: Date.now()
      }))
    } catch (error) {
      console.error('Failed to save to localStorage:', error)
    }
  },
  
  getPersistent: (key, maxAge = 86400000) => { // 24 hours default
    try {
      const item = localStorage.getItem(key)
      if (!item) return null
      
      const data = JSON.parse(item)
      if (Date.now() - data.timestamp > maxAge) {
        localStorage.removeItem(key)
        return null
      }
      
      return data.value
    } catch (error) {
      console.error('Failed to read from localStorage:', error)
      return null
    }
  }
}

export default {
  SecurityUtils,
  PerformanceUtils,
  ErrorHandler,
  ValidationSchemas,
  CacheManager
}


