// components/calendar/SidePanel.jsx
import { motion, AnimatePresence } from "framer-motion";
import { FiPlus, FiX, FiCalendar } from "react-icons/fi";
import MoodIcon from "../journal/MoodIcon";
import { useNavigate } from "react-router-dom";
import { format } from "date-fns";

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
            className="fixed inset-0 bg-black/30 backdrop-blur-sm z-40"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          />

          {/* Side Panel */}
          <motion.div
            className="fixed top-0 right-0 h-full w-[400px] max-w-full glass-card border-l border-neutral-200/50 dark:border-neutral-700/50 shadow-xl z-50 p-6 flex flex-col backdrop-blur-xl"
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "tween", duration: 0.3 }}
          >
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-gradient-primary rounded-lg flex items-center justify-center">
                  <FiCalendar className="w-4 h-4 text-white" />
                </div>
                <h2 className="text-xl font-bold gradient-text">
                  {format(day.date, "MMMM d, yyyy")}
                </h2>
              </div>
              <button
                onClick={onClose}
                className="p-2 rounded-xl text-neutral-500 hover:text-error-500 hover:bg-error-50 dark:hover:bg-error-900/20 transition-all duration-300 hover:scale-110"
              >
                <FiX size={20} />
              </button>
            </div>

            {/* Date Info */}
            <div className="glass-card p-4 rounded-xl border-gradient mb-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-neutral-500 dark:text-neutral-400">
                    {isToday ? "Today" : format(day.date, "EEEE")}
                  </p>
                  <p className="text-lg font-semibold text-neutral-700 dark:text-neutral-200">
                    {day.entries.length} {day.entries.length === 1 ? "Entry" : "Entries"}
                  </p>
                </div>
                {isToday && (
                  <div className="w-3 h-3 bg-success-500 rounded-full animate-pulse"></div>
                )}
              </div>
            </div>

            {/* Entries List */}
            <div className="flex-1 overflow-y-auto space-y-3">
              {day?.entries?.length > 0 ? (
                day.entries.map((entry) => (
                  <motion.div
                    key={entry.id}
                    className="glass-card p-4 rounded-xl border-gradient hover:shadow-glow transition-all duration-300 cursor-pointer scale-in-hover"
                    onClick={() => navigate(`/journal/${entry.id}`)}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <div className="flex items-center space-x-3">
                      <div className="flex-shrink-0">
                        <MoodIcon mood={entry.mood} size={20} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold text-neutral-700 dark:text-neutral-200 truncate">
                          {entry.title}
                        </h3>
                        <p className="text-sm text-neutral-500 dark:text-neutral-400 truncate">
                          {entry.content?.substring(0, 50)}...
                        </p>
                      </div>
                    </div>
                  </motion.div>
                ))
              ) : (
                <div className="glass-card p-8 rounded-xl border-gradient text-center">
                  <div className="w-12 h-12 bg-neutral-200 dark:bg-neutral-700 rounded-full flex items-center justify-center mx-auto mb-3">
                    <FiCalendar className="w-6 h-6 text-neutral-400" />
                  </div>
                  <p className="text-neutral-500 dark:text-neutral-400 font-medium">
                    No entries for this day
                  </p>
                  <p className="text-sm text-neutral-400 dark:text-neutral-500 mt-1">
                    Start your journaling journey today!
                  </p>
                </div>
              )}
            </div>

            {/* Add New Entry Button */}
            {isToday && (
              <motion.button
                onClick={() => navigate("/journal/new")}
                className="btn btn-primary w-full mt-6 flex items-center justify-center space-x-2 hover:shadow-glow"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <FiPlus size={16} />
                <span>New Journal Entry</span>
              </motion.button>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default SidePanel;
