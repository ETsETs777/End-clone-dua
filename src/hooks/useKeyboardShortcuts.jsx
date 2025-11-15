import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'

const useKeyboardShortcuts = (enabled = true) => {
  const navigate = useNavigate()

  useEffect(() => {
    if (!enabled) return

    const handleKeyPress = (e) => {
      // Check if user is typing in an input/textarea
      const isTyping = ['INPUT', 'TEXTAREA'].includes(e.target.tagName)
      
      // Ctrl/Cmd + K - Quick search (can be implemented later)
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault()
        toast('Quick search coming soon! 🔍', { icon: '⌨️' })
      }

      // Alt + H - Home
      if (e.altKey && e.key === 'h' && !isTyping) {
        e.preventDefault()
        navigate('/')
        toast('Navigated to Home', { icon: '🏠', duration: 1500 })
      }

      // Alt + C - Chat
      if (e.altKey && e.key === 'c' && !isTyping) {
        e.preventDefault()
        navigate('/chat')
        toast('Navigated to Chat', { icon: '💬', duration: 1500 })
      }

      // Alt + V - Vocabulary
      if (e.altKey && e.key === 'v' && !isTyping) {
        e.preventDefault()
        navigate('/vocabulary')
        toast('Navigated to Vocabulary', { icon: '📚', duration: 1500 })
      }

      // Alt + G - Grammar
      if (e.altKey && e.key === 'g' && !isTyping) {
        e.preventDefault()
        navigate('/grammar')
        toast('Navigated to Grammar', { icon: '📖', duration: 1500 })
      }

      // Alt + E - Exercises
      if (e.altKey && e.key === 'e' && !isTyping) {
        e.preventDefault()
        navigate('/exercises')
        toast('Navigated to Exercises', { icon: '✏️', duration: 1500 })
      }

      // Alt + P - Progress
      if (e.altKey && e.key === 'p' && !isTyping) {
        e.preventDefault()
        navigate('/progress')
        toast('Navigated to Progress', { icon: '📊', duration: 1500 })
      }

      // Alt + A - Achievements
      if (e.altKey && e.key === 'a' && !isTyping) {
        e.preventDefault()
        navigate('/achievements')
        toast('Navigated to Achievements', { icon: '🏆', duration: 1500 })
      }

      // Alt + ? - Show keyboard shortcuts
      if (e.altKey && e.key === '?' && !isTyping) {
        e.preventDefault()
        showShortcutsHelp()
      }

      // Escape - Close modals/dialogs (handled by components usually)
      if (e.key === 'Escape') {
        // Components should handle this individually
      }
    }

    const showShortcutsHelp = () => {
      const shortcuts = [
        { keys: 'Alt + H', action: 'Home' },
        { keys: 'Alt + C', action: 'Chat' },
        { keys: 'Alt + V', action: 'Vocabulary' },
        { keys: 'Alt + G', action: 'Grammar' },
        { keys: 'Alt + E', action: 'Exercises' },
        { keys: 'Alt + P', action: 'Progress' },
        { keys: 'Alt + A', action: 'Achievements' },
        { keys: 'Ctrl/Cmd + K', action: 'Quick Search' },
        { keys: 'Esc', action: 'Close Modal' },
      ]

      const helpText = shortcuts.map(s => `${s.keys}: ${s.action}`).join('\n')
      
      toast(
        (t) => (
          <div className="space-y-2">
            <div className="font-bold text-lg flex items-center space-x-2">
              <span>⌨️</span>
              <span>Keyboard Shortcuts</span>
            </div>
            <div className="text-sm space-y-1 font-mono">
              {shortcuts.map((s, i) => (
                <div key={i} className="flex justify-between space-x-4">
                  <span className="text-blue-600 dark:text-blue-400 font-semibold">{s.keys}</span>
                  <span className="text-gray-700 dark:text-gray-300">{s.action}</span>
                </div>
              ))}
            </div>
            <button
              onClick={() => toast.dismiss(t.id)}
              className="mt-2 w-full py-2 px-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Got it!
            </button>
          </div>
        ),
        { duration: Infinity, position: 'top-center' }
      )
    }

    window.addEventListener('keydown', handleKeyPress)

    return () => {
      window.removeEventListener('keydown', handleKeyPress)
    }
  }, [enabled, navigate])

  return null
}

export default useKeyboardShortcuts


