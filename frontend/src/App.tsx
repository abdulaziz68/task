import React from 'react'
import Header from './components/Header'

function App() {
  return (
    <div className="min-h-screen bg-primary text-white">
      <Header />
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold mb-4">Engineering Project Manager</h1>
        <p className="text-gray-300">نظام إدارة المشاريع الهندسية</p>
      </div>
    </div>
  )
}

export default App
