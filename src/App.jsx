import React from 'react'
import { Routes, Route } from 'react-router-dom'
import ImprovedLayout from './components/ImprovedLayout'
import NewHome from './pages/NewHome'
import Chat from './pages/Chat'
import Vocabulary from './pages/Vocabulary'
import Grammar from './pages/Grammar'
import Progress from './pages/Progress'
import Achievements from './pages/Achievements'
import AIExercises from './pages/AIExercises'
import TextAnalyzer from './pages/TextAnalyzer'
import PerformanceMonitor from './pages/PerformanceMonitor'
import PerformanceOptimizer from './pages/PerformanceOptimizer'
import SecuritySettings from './pages/SecuritySettings'
import AccessibilitySettings from './components/AccessibilitySettings'
import SpeechRecognition from './components/SpeechRecognition'
import GamificationSystem from './components/GamificationSystem'
import DataManagement from './components/DataManagement'

function App() {
  return (
    <ImprovedLayout>
      <Routes>
        <Route path="/" element={<NewHome />} />
        <Route path="/chat" element={<Chat />} />
        <Route path="/vocabulary" element={<Vocabulary />} />
        <Route path="/grammar" element={<Grammar />} />
        <Route path="/exercises" element={<AIExercises />} />
        <Route path="/analyzer" element={<TextAnalyzer />} />
        <Route path="/performance" element={<PerformanceMonitor />} />
        <Route path="/optimizer" element={<PerformanceOptimizer />} />
        <Route path="/security" element={<SecuritySettings />} />
        <Route path="/accessibility" element={<AccessibilitySettings />} />
        <Route path="/pronunciation" element={<SpeechRecognition />} />
        <Route path="/gamification" element={<GamificationSystem />} />
        <Route path="/data-management" element={<DataManagement />} />
        <Route path="/progress" element={<Progress />} />
        <Route path="/achievements" element={<Achievements />} />
      </Routes>
    </ImprovedLayout>
  )
}

export default App
