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
      <div className={`min-h-screen flex flex-col md:flex-row bg-neutral-50 dark:bg-neutral-900`}>
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
      {(isEntryDetailPage || isEntryFormPage) && (
      <MindChatFloat
        entry={chatContext}
        isOpen={isChatOpen}
        setIsOpen={setIsChatOpen}
        setEntry={setChatContext}
      />
      )}
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
