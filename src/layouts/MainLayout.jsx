import { useState, useEffect } from 'react'
import { Outlet } from 'react-router-dom'
import { JournalProvider } from '../contexts/JournalContext'
import MobileHeader from '../components/navigation/MobileHeader'
import Sidebar from '../components/navigation/Sidebar'
import QuoteLoader from '../components/loader/QuotesLoader'

const MainLayout = () => {
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
  
  if (isInitialLoading) {
    return <QuoteLoader />
  }

  return (
    <JournalProvider>
      <div className={`min-h-screen flex flex-col md:flex-row bg-neutral-50 dark:bg-neutral-900 transition-all duration-1000 ease-out ${
        showContent ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
      }`}>
        <MobileHeader />
        
        <div className="hidden md:block md:w-64 lg:w-72">
          <Sidebar />
        </div>
        
        <main className="flex-1 p-4 md:p-6 max-w-6xl mx-auto w-full">
          <div className="pt-16 md:pt-0">
            <Outlet />
          </div>
        </main>
      </div>
    </JournalProvider>
  )
}

export default MainLayout
