import { useState, useEffect } from 'react'
import { Outlet, useLocation, useParams } from 'react-router-dom'
import { JournalProvider, useJournal } from '../contexts/JournalContext'
import MobileHeader from '../components/navigation/MobileHeader'
import Sidebar from '../components/navigation/Sidebar'
import QuoteLoader from '../components/loader/QuotesLoader'
import MindChatFloat from '../pages/MindChatFloat'
import PinConfirmModal from '../components/journal/PinConfirmModal'

const MainLayoutContent = () => {
  const location = useLocation();
  const params = useParams();
  const { getEntry, activeEntry, loading } = useJournal();

  const [chatContext, setChatContext] = useState(null);
  const [isChatOpen, setIsChatOpen] = useState(false);

  const isEntryDetailPage = location.pathname.includes('/journal/') && params.id && !location.pathname.endsWith('/edit');
  const isEntryFormPage = location.pathname === '/journal/new' || location.pathname.endsWith('/edit');

  useEffect(() => {
    if (!loading) {
      if (isEntryDetailPage) {
        const entry = getEntry(params.id);
        setChatContext(entry || null);
      } else if (isEntryFormPage) {
        setChatContext(activeEntry);
      } else {
        setChatContext(null);
      }
    }
  }, [location.pathname, params.id, getEntry, activeEntry, loading]);

  if (loading) {
    return <QuoteLoader />;
  }

  return (
    <>
      <PinConfirmModal />
      <div className="min-h-screen flex flex-col md:flex-row bg-gradient-to-br from-neutral-50 via-primary-50 to-secondary-50 dark:from-neutral-900 dark:via-primary-950 dark:to-secondary-950">
        <MobileHeader />
        
        <div className="hidden md:block">
          <Sidebar />
        </div>
        
        <main className="flex-1 p-4 md:p-8 max-w-7xl mx-auto w-full">
          <div className="pt-16 md:pt-0">
            <Outlet />
          </div>
        </main>
      </div>
      
      {/* Floating Chat Button */}
      {(isEntryDetailPage || isEntryFormPage) && (
        <MindChatFloat
          entry={chatContext}
          isOpen={isChatOpen}
          setIsOpen={setIsChatOpen}
          setEntry={setChatContext}
        />
      )}
      
      {/* Background Decorative Elements */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-20 left-20 w-32 h-32 bg-primary-200/20 dark:bg-primary-800/20 rounded-full blur-3xl animate-float"></div>
        <div className="absolute bottom-20 right-20 w-40 h-40 bg-secondary-200/20 dark:bg-secondary-800/20 rounded-full blur-3xl animate-float-delay-2"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-24 h-24 bg-accent-200/20 dark:bg-accent-800/20 rounded-full blur-2xl animate-float-delay-3"></div>
      </div>
    </>
  );
};

const MainLayout = () => {
  return (
    <JournalProvider>
      <MainLayoutContent />
    </JournalProvider>
  )
}

export default MainLayout
