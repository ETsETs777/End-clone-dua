import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import App from './App.jsx'
import NotificationProvider from './components/NotificationProvider.jsx'
import { AuthProvider } from './contexts/AuthContext.jsx'
import ErrorBoundary from './components/ErrorBoundary.jsx'
import * as serviceWorkerRegistration from './utils/serviceWorkerRegistration'
import './index.css'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <ErrorBoundary>
      <BrowserRouter>
        <AuthProvider>
          <NotificationProvider>
            <App />
            <Toaster 
            position="top-right"
            toastOptions={{
              duration: 4000,
              style: {
                background: '#363636',
                color: '#fff',
              },
            }}
          />
          </NotificationProvider>
        </AuthProvider>
      </BrowserRouter>
    </ErrorBoundary>
  </React.StrictMode>,
)

// Register service worker for offline functionality
serviceWorkerRegistration.register({
  onSuccess: () => {
    console.log('✅ App is ready for offline use!')
  },
  onUpdate: (registration) => {
    console.log('🔄 New version available! Please refresh.')
  }
})

// Request persistent storage
serviceWorkerRegistration.requestPersistentStorage()
