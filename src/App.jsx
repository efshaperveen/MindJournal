import { useEffect } from 'react'
import { Toaster } from 'react-hot-toast'
import { Navigate, Route, Routes } from 'react-router-dom'
import { useAuth } from './contexts/AuthContext'
import { useTheme } from './contexts/ThemeContext'


// Layouts
import AuthLayout from './layouts/AuthLayout'
import MainLayout from './layouts/MainLayout'

// Pages
import Calendar from './pages/Calendar'
import Contact from './pages/Contact'
import CreateEntry from './pages/CreateEntry'
import Dashboard from './pages/Dashboard'
import EditEntry from './pages/EditEntry'
import EntryDetail from './pages/EntryDetail'
import ForgotPassword from './pages/ForgotPassword'
import GratitudePage from './pages/GratitudePage'
import Journal from './pages/Journal'
import Login from './pages/Login'
import MindChat from './pages/MindChat'
import NotFound from './pages/NotFound'
import PrivateVault from './pages/PrivateVault'
import Register from './pages/Register'
import ResetPassword from './pages/ResetPassword'
import Settings from './pages/Settings'
import Stats from './pages/Stats'

const ProtectedRoute = ({ children }) => {
  const { user } = useAuth()

  if (!user) {
    return <Navigate to="/login" replace />
  }

  return children
}

function App() {
  const { theme } = useTheme()

  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }
  }, [theme])

  return (
    <>
      <Toaster position="top-center" reverseOrder={false} />
      <Routes>
        {/* Auth routes */}
        <Route path="/" element={<AuthLayout />}>
          <Route path="login" element={<Login />} />
          <Route path="register" element={<Register />} />
          <Route path="forgot-password" element={<ForgotPassword />} />
          <Route path="reset-password" element={<ResetPassword />} />
        </Route>

        {/* Protected routes */}
        <Route path="/" element={
          <ProtectedRoute>
            <MainLayout />
          </ProtectedRoute>
        }>
          <Route index element={<Dashboard />} />
          <Route path="journal" element={<Journal />} />
          <Route path="journal/new" element={<CreateEntry />} />
          <Route path="journal/:id" element={<EntryDetail />} />
          <Route path="journal/:id/edit" element={<EditEntry />} />
          <Route path="calendar" element={<Calendar />} />
          <Route path="stats" element={<Stats />} />
          <Route path="settings" element={<Settings />} />
          <Route path="private-vault" element={<PrivateVault />} />
          <Route path='mindchat' element={<MindChat />} />
          <Route path="/gratitude" element={<GratitudePage />} />
          <Route path="/contact" element={<Contact />} />
        </Route>

        {/* 404 route */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </>
  )
}

export default App
