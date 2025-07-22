// components/calendar/SidePanel.jsx
import { motion, AnimatePresence } from 'framer-motion'
import { FiX } from 'react-icons/fi'
import MoodIcon from '../journal/MoodIcon'
import { useNavigate } from 'react-router-dom'

const SidePanel = ({ isOpen, day, onClose }) => {
  const navigate = useNavigate()

  if (!day) return null

  const today = new Date()
  const isToday = day.date.toDateString() === today.toDateString()

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            onClick={onClose}
            className="fixed inset-0 bg-black/30 backdrop-blur-sm z-40"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          />

          {/* Side Panel */}
          <motion.div
            className="fixed top-0 right-0 h-full w-[400px] max-w-full bg-white dark:bg-neutral-900 shadow-xl z-50 p-6 flex flex-col"
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'tween', duration: 0.3 }}
          >
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">Journals</h2>
              <button
                onClick={onClose}
                className="text-red-500 hover:text-red-700"
              >
                <FiX size={24} />
              </button>
            </div>

            {/* Entries List */}
            <div className="flex-1 overflow-y-auto space-y-4">
              {day?.entries?.length > 0 ? (
                day.entries.map((entry) => (
                  <div
                    key={entry.id}
                    className="p-3 rounded-lg border border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800 hover:bg-neutral-100 dark:hover:bg-neutral-700 cursor-pointer"
                    onClick={() => navigate(`/journal/${entry.id}`)}
                  >
                    <div className="flex items-center space-x-2">
                      <MoodIcon mood={entry.mood} size={18} />
                      <span className="font-medium truncate">{entry.title}</span>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-neutral-500 text-sm">No entries</p>
              )}
            </div>

            {/* Only show add button for today */}
            {isToday && (
              <button
                onClick={() => navigate('/journal/new')}
                className="mt-6 px-4 py-2 bg-primary-500 text-white rounded-md hover:bg-primary-600 transition"
              >
                + New Journal
              </button>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}

export default SidePanel
