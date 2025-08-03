// components/calendar/SidePanel.jsx
import { motion, AnimatePresence } from "framer-motion";
import { FiPlus, FiX } from "react-icons/fi";
import MoodIcon from "../journal/MoodIcon";
import { useNavigate } from "react-router-dom";

const SidePanel = ({ isOpen, day, onClose }) => {
  const navigate = useNavigate();

  if (!day) return null;

  const today = new Date();
  const isToday = day.date.toDateString() === today.toDateString();

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            onClick={onClose}
            className="fixed inset-0 bg-black/40 backdrop-blur-md z-40 shadow-[0_0_40px_rgba(0,0,0,0.4)]"
            initial={{ opacity: 0, backdropFilter: "blur(0px)"}}
            animate={{ opacity: 1, backdropFilter: "blur(8px)", transition: { duration: 0.3, ease: 'easeOut' }  }}
            exit={{ opacity: 0, backdropFilter: "blur(0px)", transition: { duration: 0.2, ease: 'easeIn' } }}
          />

          {/* Side Panel */}
          <motion.div
 ui-futuristic-enhancements
            className="fixed top-0 right-0 h-full w-[400px] max-w-full bg-white dark:bg-neutral-900 shadow-2xl border-l border-neutral-200 dark:border-neutral-800 z-50 p-6 flex flex-col"
            initial={{ x: '100%', opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: '100%', opacity: 0 }}
            transition={{ type: 'spring', stiffness: 300, damping: 30}}
          >
            <motion.div
             className="flex justify-between items-center mb-4"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            >
              <h2 className="text-xl font-bold">Journals</h2>

              <button
                onClick={onClose}
                className="text-red-500 hover:text-red-600 active:scale-95 transition-transform duration-150"
              >
                <FiX size={24} />
              </button>
            </motion.div>

            {/* Entries List */}
 ui-futuristic-enhancements
            <motion.div className="flex-1 overflow-y-auto space-y-4">
  {day?.entries?.length > 0 ? (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={{
        visible: { transition: { staggerChildren: 0.1 } },
        hidden: {},
      }}
    >
      {day.entries.map((entry) => (
        <motion.div
          key={entry.id}
          className="p-3 rounded-lg border border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800 hover:shadow-md hover:-translate-y-1 dark:hover:bg-neutral-700 cursor-pointer transition-all duration-200"
          onClick={() => navigate(`/journal/${entry.id}`)}
          variants={{
            hidden: { opacity: 0, y: 10 },
            visible: { opacity: 1, y: 0 },
          }}
        >
          <div className="flex items-center space-x-2">
            <MoodIcon mood={entry.mood} size={18} />
            <span className="font-medium truncate">{entry.title}</span>
          </div>
        </motion.div>
      ))}
    </motion.div>
  ) : (
    <motion.p
      className="text-neutral-500 text-sm"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      No entries
    </motion.p>
  )}
</motion.div>

{/* Only show add button for today */}
{isToday && (
  <motion.button
    onClick={() => navigate('/journal/new')}
    className="mt-6 px-4 py-2 bg-primary-500 text-white rounded-md hover:bg-primary-600 hover:shadow-lg transition-all duration-200"
    whileHover={{ scale: 1.05 }}
    whileTap={{ scale: 0.95 }}
  >
    + New Journal
  </motion.button>
)}


          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default SidePanel;
