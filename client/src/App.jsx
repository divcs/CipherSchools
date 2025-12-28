import { useEffect, useMemo, useState } from 'react'
import { BrowserRouter, Routes, Route, useNavigate, useLocation } from 'react-router-dom'
import AssignmentList from './components/AssignmentList.jsx'
import Attempt from './components/Attempt.jsx'

function Shell() {
  const navigate = useNavigate()
  const location = useLocation()
  const title = useMemo(() => (location.pathname.startsWith('/attempt') ? 'Attempt Assignment' : 'Assignments'), [location])
  return (
    <div className="app">
      <header className="app__header">
        <h1 className="app__title">CipherSQLStudio</h1>
        <nav className="app__nav">
          <button className="btn" onClick={() => navigate('/')}>Assignments</button>
        </nav>
      </header>
      <main className="app__main" aria-label={title}>
        <Routes>
          <Route path="/" element={<AssignmentList />} />
          <Route path="/attempt/:index" element={<Attempt />} />
        </Routes>
      </main>
    </div>
  )
}

export default function App() {
  return (
    <BrowserRouter>
      <Shell />
    </BrowserRouter>
  )
}
