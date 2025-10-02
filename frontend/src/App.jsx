import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.scss'
import Landing from './pages/Landing'
import AuthPanel from './components/AuthPanel'
import { Route, Routes } from 'react-router-dom'

function App() {

  return (
    <div className="page">
      <Routes>
        <Route path='/' element={<Landing />} />
        <Route path='/admin/login' element={<AuthPanel />} />
      </Routes>
    </div>
  )
}

export default App
