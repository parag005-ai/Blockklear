import React from 'react'
import { Routes, Route } from 'react-router-dom'
import Header from './components/Header'
import Dashboard from './pages/Dashboard'
import KYCFlow from './pages/KYCFlow'
import Status from './pages/Status'
import HashViewer from './pages/HashViewer'

function App() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <main className="container mx-auto px-4 py-8">
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/kyc" element={<KYCFlow />} />
          <Route path="/status" element={<Status />} />
          <Route path="/hash" element={<HashViewer />} />
        </Routes>
      </main>
    </div>
  )
}

export default App
