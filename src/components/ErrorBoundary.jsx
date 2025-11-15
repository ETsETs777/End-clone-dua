import React from 'react'
import { AlertTriangle, RefreshCw, Home } from 'lucide-react'
import { Link } from 'react-router-dom'

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null
    }
  }

  static getDerivedStateFromError(error) {
    return { hasError: true }
  }

  componentDidCatch(error, errorInfo) {
    console.error('Error caught by boundary:', error, errorInfo)
    this.setState({
      error,
      errorInfo
    })

    // Log to error reporting service in production
    if (import.meta.env.PROD) {
      // Example: logErrorToService(error, errorInfo)
    }
  }

  handleReset = () => {
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null
    })
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 flex items-center justify-center p-4">
          <div className="max-w-2xl w-full bg-white dark:bg-gray-800 rounded-3xl shadow-2xl p-8 animate-fade-in">
            <div className="text-center">
              <div className="flex justify-center mb-6">
                <div className="w-20 h-20 bg-gradient-to-br from-red-500 to-orange-500 rounded-full flex items-center justify-center animate-bounce-gentle">
                  <AlertTriangle className="w-10 h-10 text-white" />
                </div>
              </div>

              <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
                Упс! Что-то пошло не так
              </h1>

              <p className="text-lg text-gray-600 dark:text-gray-300 mb-8">
                Произошла непредвиденная ошибка. Не волнуйтесь, это не ваша вина!
              </p>

              {import.meta.env.DEV && this.state.error && (
                <div className="mb-8 text-left">
                  <details className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl p-4">
                    <summary className="cursor-pointer font-semibold text-red-800 dark:text-red-400 mb-2">
                      Детали ошибки (только для разработчиков)
                    </summary>
                    <div className="mt-4 space-y-2">
                      <div className="bg-gray-900 text-green-400 p-4 rounded-lg overflow-x-auto">
                        <p className="font-mono text-sm whitespace-pre-wrap">
                          {this.state.error.toString()}
                        </p>
                      </div>
                      {this.state.errorInfo && (
                        <div className="bg-gray-900 text-yellow-400 p-4 rounded-lg overflow-x-auto">
                          <p className="font-mono text-xs whitespace-pre-wrap">
                            {this.state.errorInfo.componentStack}
                          </p>
                        </div>
                      )}
                    </div>
                  </details>
                </div>
              )}

              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <button
                  onClick={this.handleReset}
                  className="flex items-center justify-center space-x-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl font-semibold hover:from-blue-700 hover:to-purple-700 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105"
                >
                  <RefreshCw className="w-5 h-5" />
                  <span>Попробовать снова</span>
                </button>

                <Link
                  to="/"
                  className="flex items-center justify-center space-x-2 px-6 py-3 bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white rounded-xl font-semibold hover:bg-gray-200 dark:hover:bg-gray-600 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105"
                >
                  <Home className="w-5 h-5" />
                  <span>На главную</span>
                </Link>
              </div>

              <div className="mt-8 text-sm text-gray-500 dark:text-gray-400">
                Если проблема повторяется, пожалуйста, обратитесь в поддержку
              </div>
            </div>
          </div>
        </div>
      )
    }

    return this.props.children
  }
}

export default ErrorBoundary


