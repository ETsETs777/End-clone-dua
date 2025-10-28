import React from 'react'
import { Routes, Route } from 'react-router-dom'
import Layout from './components/Layout'
import Home from './pages/Home'
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

function App() {
  return (
    <Layout>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/chat" element={<Chat />} />
        <Route path="/vocabulary" element={<Vocabulary />} />
        <Route path="/grammar" element={<Grammar />} />
        <Route path="/exercises" element={<AIExercises />} />
        <Route path="/analyzer" element={<TextAnalyzer />} />
        <Route path="/performance" element={<PerformanceMonitor />} />
        <Route path="/optimizer" element={<PerformanceOptimizer />} />
        <Route path="/security" element={<SecuritySettings />} />
        <Route path="/progress" element={<Progress />} />
        <Route path="/achievements" element={<Achievements />} />
      </Routes>
    </Layout>
  )
}

export default App
