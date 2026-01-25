import { useState } from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import './App.css'
import { Header } from './components/Header'
import { Home } from './pages/Home'
import { Login } from './pages/Login'
import { Register } from './pages/Register'
import { Profile } from './pages/Profile'
import { AdminUsers } from './pages/AdminUsers'
import type { User } from './services/api'

function App() {
  const [user, setUser] = useState<User | null>(null)

  const handleLogout = () => {
    setUser(null)
  }

  const handleLoginSuccess = (userData: User) => {
    setUser(userData)
  }

  const handleRegisterSuccess = (userData: User) => {
    setUser(userData)
  }

  return (
    <BrowserRouter>
      <Header isAuthenticated={user !== null} onLogout={handleLogout} />
      <main className="main-container">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route
            path="/login"
            element={
              user ? (
                <Navigate to="/" replace />
              ) : (
                <Login onLoginSuccess={handleLoginSuccess} />
              )
            }
          />
          <Route
            path="/register"
            element={
              user ? (
                <Navigate to="/" replace />
              ) : (
                <Register onRegisterSuccess={handleRegisterSuccess} />
              )
            }
          />
          <Route path="/profile" element={<Profile user={user} />} />
          <Route path="/admin" element={<AdminUsers user={user} />} />
        </Routes>
      </main>
    </BrowserRouter>
  )
}

export default App
