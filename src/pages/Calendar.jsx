import { useState, useMemo, Fragment } from "react";
import { useNavigate } from "react-router-dom";
import {motion} from "framer-motion";
import { useJournal } from "../contexts/JournalContext";
import {
  format,
  startOfMonth,
  endOfMonth,
  startOfWeek,
  endOfWeek,
  addDays,
  isToday,
  isSameMonth,
  parseISO,
  addMonths,
  subMonths,
} from "date-fns";
import { FiChevronLeft, FiChevronRight, FiPlus, FiCalendar } from "react-icons/fi";
import SidePanel from "../components/calendar/SidePanel";

const Calendar = () => {
  const { entries, isLoading, privateEntryIds } = useJournal();
  const navigate = useNavigate();
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectedDay, setSelectedDay] = useState(null);

  const nextMonth = () => setCurrentMonth(addMonths(currentMonth, 1));
  const prevMonth = () => setCurrentMonth(subMonths(currentMonth, 1));

  const calendarDays = useMemo(() => {
    if (isLoading || !entries) return [];

    const monthStart = startOfMonth(currentMonth);
    const monthEnd = endOfMonth(monthStart);
    const startDate = startOfWeek(monthStart);
    const endDate = endOfWeek(monthEnd);

    const rows = [];
    let days = [];
    let day = startDate;

    const publicEntries = entries.filter(entry => !privateEntryIds.includes(entry.id));

    const entriesByDate = publicEntries.reduce((acc, entry) => {
      const date = parseISO(entry.createdAt);
      const dateStr = format(date, "yyyy-MM-dd");
      if (!acc[dateStr]) acc[dateStr] = [];
      acc[dateStr].push(entry);
      return acc;
    }, {});

    while (day <= endDate) {
      for (let i = 0; i < 7; i++) {
        const dateStr = format(day, "yyyy-MM-dd");
        const dayEntries = entriesByDate[dateStr] || [];

        days.push({
          date: day,
          isCurrentMonth: isSameMonth(day, monthStart),
          isToday: isToday(day),
          entries: dayEntries,
        });

        day = addDays(day, 1);
      }
      rows.push(days);
      days = [];
    }

    return rows;
  }, [currentMonth, entries, isLoading]);

  const handleDayClick = (day) => {
    const today = new Date();
    const isPastOrToday = day.date <= today;

    if (!isPastOrToday) return;
    if (day.entries.length > 0 || day.isToday) {
      setSelectedDay(day);
    }
  };

  if (isLoading) {
    return (
      <div className="p-6 animate-fade-in">
        <div className="glass-card p-8 rounded-2xl border-gradient text-center">
          <div className="loading-spinner mx-auto mb-4"></div>
          <p className="text-neutral-600 dark:text-neutral-300">
            Loading calendar...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-h-screen space-y-6 animate-fade-in">
      {/* Header Section */}
      <div className="glass-card p-6 rounded-2xl border-gradient">
        <div className="flex items-center space-x-3 mb-4">
          <div className="w-10 h-10 bg-gradient-primary rounded-xl flex items-center justify-center">
            <FiCalendar className="w-5 h-5 text-white" />
          </div>
          <h1 className="text-2xl md:text-3xl font-bold gradient-text">
            Calendar View
          </h1>
        </div>
        
        <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
          <p className="text-neutral-600 dark:text-neutral-300">
            Track your journaling journey and view your entries by date
          </p>
          
          <div className="flex items-center space-x-2">
            <motion.button
              whileTap={{ scale: 0.9 }}
              whileHover={{ scale: 1.05 }}
              transition={{ duration: 0.2 }}
              onClick={prevMonth}
              className="btn btn-outline p-2 rounded-xl hover:shadow-glow"
            >
              <FiChevronLeft size={20} />
            </motion.button>
            
            <motion.button
              whileHover={{ scale: 1.05 }}
              transition={{ type: "spring", stiffness: 300 }}
              className="px-6 py-2 text-lg font-semibold gradient-text hover:shadow-glow transition-all duration-300"
              onClick={() => setCurrentMonth(new Date())}
            >
              {format(currentMonth, "MMMM yyyy")}
            </motion.button>
            
            <motion.button
              whileTap={{ scale: 0.9 }}
              whileHover={{ scale: 1.05 }}
              transition={{ duration: 0.2 }}
              onClick={nextMonth}
              className="btn btn-outline p-2 rounded-xl hover:shadow-glow"
            >
              <FiChevronRight size={20} />
            </motion.button>
            
            <motion.button
              whileTap={{ scale: 0.95 }}
              whileHover={{ scale: 1.05 }}
              transition={{ duration: 0.2 }}
              onClick={() => setCurrentMonth(new Date())}
              className="btn btn-primary px-4 py-2 rounded-xl"
            >
              Today
            </motion.button>
          </div>
        </div>
      </div>

      {/* Calendar Grid */}
      <div className="glass-card p-6 rounded-2xl border-gradient ">
        <div className="overflow-hidden rounded-xl bg-white/50 dark:bg-neutral-800/50 backdrop-blur-md shadow-soft">
          {/* Day Headers */}
          <div className="grid grid-cols-7 border-b border-neutral-200/50 dark:border-neutral-700/50">
            {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
              <div
                key={day}
                className="py-4 font-semibold text-neutral-600 dark:text-neutral-300 uppercase text-sm tracking-wide text-center"
              >
                {day}
              </div>
            ))}
          </div>

          {/* Calendar Days */}
          <div className="grid grid-cols-7 h-fit">
            {calendarDays.map((week, weekIndex) => (
              <Fragment key={weekIndex}>
                {week.map((day, dayIndex) => {
                  const isPastOrToday = day.date <= new Date();
                  const isClickable = (day.entries.length > 0 || day.isToday) && isPastOrToday;

                  return (
                    <div
                      key={dayIndex}
                      onClick={
                        isClickable ? () => handleDayClick(day) : undefined
                      }
                      className={`group relative h-[50px] p-3 border-r border-b border-neutral-200/50 dark:border-neutral-700/50 last:border-r-0
                        ${
                          !day.isCurrentMonth
                            ? "bg-neutral-100/50 dark:bg-neutral-900/50 text-neutral-400"
                            : "bg-white/30 dark:bg-neutral-800/30"
                        }
                        ${
                          day.isToday
                            ? "ring-2 ring-primary-400/50 bg-primary-500/10 animate-pulse-glow"
                            : ""
                        }
                        ${isClickable ? "cursor-pointer hover:ring-2 hover:ring-primary-400/50 hover:shadow-glow hover:bg-white/50 dark:hover:bg-neutral-700/50" : "cursor-default"}

                        transition-all duration-300 hover:scale-[1.02]`}
                    >
                      <div className="flex justify-between items-start">
                        <div
                          className={`flex items-center justify-center w-8 h-8 rounded-full text-sm font-semibold transition-all duration-200
                             ${
                            day.isToday
                              ? "bg-gradient-primary text-white shadow-glow"
                              : isClickable
                              ? "text-neutral-700 dark:text-neutral-200 group-hover:bg-primary-500/20 group-hover:text-primary-700 dark:group-hover:text-primary-200"
                              : "text-neutral-500 dark:text-neutral-400"
                          }`}
                        >
                          {format(day.date, "d")}
                        </div>

                        {day.isToday && !day.entries.length && (
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              navigate("/journal/new");
                            }}
                            className="p-1.5 rounded-full bg-gradient-secondary text-white hover:shadow-glow-purple transition-all duration-300 hover:scale-110"
                          >
                            <FiPlus size={12} />
                          </button>
                        )}
                      </div>

                      {day.entries.length > 0 && (
                        <div className="mt-2 flex justify-center">
                          <div className="text-xs px-2 py-1 rounded-full bg-gradient-secondary text-white font-medium shadow-soft group-hover:scale-105 group-hover:shadow-glow-purple transition-all duration-300">
                            {day.entries.length}{" "}
                            {day.entries.length === 1 ? "Entry" : "Entries"}
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </Fragment>
            ))}
          </div>
        </div>
      </div>

      {/* Side Panel */}
      <SidePanel
        isOpen={!!selectedDay}
        day={selectedDay}
        onClose={() => setSelectedDay(null)}
      />
    </div>
  );
};

export default Calendar;
