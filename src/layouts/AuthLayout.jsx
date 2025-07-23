import { useState, useEffect } from 'react'
import { Outlet, Navigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import ThemeToggle from '../components/common/ThemeToggle'
import QuoteLoader from '../components/loader/QuotesLoader'

const AuthLayout = () => {
  const { user } = useAuth()
  const [isInitialLoading, setIsInitialLoading] = useState(true)
  const [showContent, setShowContent] = useState(false)
  
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsInitialLoading(false)
      setTimeout(() => {
        setShowContent(true)
      }, 100)
    }, 2000)
    
    return () => clearTimeout(timer)
  }, [])
  
  // Redirect to dashboard if user is already logged in
  if (user) {
    return <Navigate to="/" replace />
  }
  
  if (isInitialLoading) {
    return <QuoteLoader />
  }
  
  return (
    <div className={`min-h-screen flex flex-col transition-all duration-1000 ease-out ${
      showContent ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
    }`}>
      <header className="p-4 flex justify-end">
        <ThemeToggle />
      </header>
      
      <main className="flex-1 flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          <Outlet />
        </div>
      </main>
      
      <footer className="py-4 text-center text-neutral-500 dark:text-neutral-400 text-sm">
        © {new Date().getFullYear()} MindJournal. All rights reserved.
      </footer>
    </div>
  )
}

export default AuthLayout
