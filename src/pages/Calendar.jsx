import { useState, useMemo, Fragment } from 'react';
import { useNavigate } from 'react-router-dom';
import { useJournal } from '../contexts/JournalContext';
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
} from 'date-fns';
import { FiChevronLeft, FiChevronRight, FiPlus } from 'react-icons/fi';
import SidePanel from '../components/calendar/SidePanel';

const Calendar = () => {
  // Assuming useJournal provides an isLoading state
  const { entries, isLoading } = useJournal();
  const navigate = useNavigate();
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectedDay, setSelectedDay] = useState(null);

  const nextMonth = () => setCurrentMonth(addMonths(currentMonth, 1));
  const prevMonth = () => setCurrentMonth(subMonths(currentMonth, 1));

  const calendarDays = useMemo(() => {
    // Return an empty array if data is still loading or not available
    if (isLoading || !entries) {
      return [];
    }

    const monthStart = startOfMonth(currentMonth);
    const monthEnd = endOfMonth(monthStart);
    const startDate = startOfWeek(monthStart);
    const endDate = endOfWeek(monthEnd);

    const rows = [];
    let days = [];
    let day = startDate;

    // Optimize entry lookup by creating a map of entries by date
    const entriesByDate = entries.reduce((acc, entry) => {
      const date = parseISO(entry.createdAt);
      const dateStr = format(date, 'yyyy-MM-dd');
      if (!acc[dateStr]) acc[dateStr] = [];
      acc[dateStr].push(entry);
      return acc;
    }, {});

    while (day <= endDate) {
      for (let i = 0; i < 7; i++) {
        const dateStr = format(day, 'yyyy-MM-dd');
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
  }, [currentMonth, entries, isLoading]); // Add isLoading to dependencies

  const handleDayClick = (day) => {
    const today = new Date();
    const isPastOrToday = day.date <= today;

    // Prevent clicks on future dates
    if (!isPastOrToday) return;

    // Set selectedDay only if there are entries or it's today
    if (day.entries.length > 0 || day.isToday) {
      setSelectedDay(day);
    }
  };

  // --- Loading State/Skeleton UI ---
  if (isLoading) {
    return (
      <div className="relative animate-fadeIn p-6">
        <div className="flex justify-between items-center mb-6">
          <div className="h-8 bg-neutral-200 dark:bg-neutral-700 rounded w-1/4 animate-pulse"></div>
          <div className="flex space-x-2">
            <div className="h-10 w-10 bg-neutral-200 dark:bg-neutral-700 rounded-full animate-pulse"></div>
            <div className="h-10 w-32 bg-neutral-200 dark:bg-neutral-700 rounded animate-pulse"></div>
            <div className="h-10 w-10 bg-neutral-200 dark:bg-neutral-700 rounded-full animate-pulse"></div>
          </div>
        </div>
        <div className="card overflow-hidden h-[500px] bg-neutral-100 dark:bg-neutral-800 rounded-lg animate-pulse">
          <div className="grid grid-cols-7 text-center bg-neutral-50 dark:bg-neutral-800 border-b border-neutral-200 dark:border-neutral-700">
            {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
              <div key={day} className="py-2 h-10 bg-neutral-100 dark:bg-neutral-700 m-1 rounded"></div>
            ))}
          </div>
          <div className="grid grid-cols-7 gap-1 p-2">
            {Array.from({ length: 42 }).map((_, i) => (
              <div key={i} className="min-h-[100px] bg-neutral-100 dark:bg-neutral-700 rounded animate-pulse"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="relative animate-fadeIn">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl md:text-3xl font-bold text-neutral-900 dark:text-white">
          Calendar
        </h1>

        <div className="flex space-x-2">
          {/* Previous Month Button with improved aria-label */}
          <button
            onClick={prevMonth}
            className="p-2 rounded-full bg-neutral-100 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300 hover:bg-neutral-200 dark:hover:bg-neutral-700"
            aria-label={`Go to ${format(subMonths(currentMonth, 1), 'MMMM yyyy')}`}
          >
            <FiChevronLeft size={20} />
          </button>

          {/* Current Month Display and "Go to Today" Button */}
          <button
            className="px-4 py-2 font-medium"
            onClick={() => setCurrentMonth(new Date())}
            aria-label={`Current month: ${format(currentMonth, 'MMMM yyyy')}. Click to go to today.`}
          >
            {format(currentMonth, 'MMMM yyyy')}
          </button>

          {/* Next Month Button with improved aria-label */}
          <button
            onClick={nextMonth}
            className="p-2 rounded-full bg-neutral-100 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300 hover:bg-neutral-200 dark:hover:bg-neutral-700"
            aria-label={`Go to ${format(addMonths(currentMonth, 1), 'MMMM yyyy')}`}
          >
            <FiChevronRight size={20} />
          </button>
        </div>
      </div>

      <div
        className={`card overflow-hidden transition-all duration-300 ${
          selectedDay ? 'opacity-30 blur-sm pointer-events-none' : ''
        }`}
      >
        <div className="grid grid-cols-7 text-center bg-neutral-50 dark:bg-neutral-800 border-b border-neutral-200 dark:border-neutral-700">
          {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
            <div
              key={day}
              className="py-2 font-medium text-neutral-600 dark:text-neutral-400"
            >
              {day}
            </div>
          ))}
        </div>

        <div className="grid grid-cols-7 border-b border-neutral-200 dark:border-neutral-700 last:border-b-0">
          {calendarDays.map((week, weekIndex) => (
            <Fragment key={weekIndex}>
              {week.map((day, dayIndex) => {
                const today = new Date();
                const isPastOrToday = day.date <= today;
                // A day is clickable if it's today OR it's a past/present day with entries
                const isClickable = (day.entries.length > 0 || isToday(day)) && isPastOrToday;

                return (
                  <div
                    key={dayIndex}
                    // Apply onClick only if the day is clickable
                    onClick={isClickable ? () => handleDayClick(day) : undefined}
                    className={`group relative min-h-[100px] p-2 border-r border-neutral-200 dark:border-neutral-700 last:border-r-0
                      ${!day.isCurrentMonth ? 'bg-neutral-50 dark:bg-neutral-850' : ''}
                      ${day.isToday ? 'bg-primary-50 dark:bg-primary-900/10' : ''}
                      ${
                        isClickable
                          ? 'hover:bg-primary-100 dark:hover:bg-primary-900 cursor-pointer' // Styles for clickable days
                          : 'cursor-default' // Default cursor for non-clickable days
                      }
                      transition-all duration-200 rounded-md
                    `}
                  >
                    <div className="flex justify-between items-start">
                      {/* Day Number Styling */}
                      <div
                        className={`flex items-center justify-center w-8 h-8 rounded-full text-sm font-medium
                          ${day.isToday ? 'bg-primary-500 text-white' : // Today's date
                            isClickable ? 'text-neutral-700 dark:text-neutral-300' : // Clickable (has entries, not today)
                            'text-neutral-400 dark:text-neutral-600'} // Non-clickable (future or no entries)
                        `}
                      >
                        {format(day.date, 'd')}
                      </div>

                      {/* "Create Entry" Button for Today (if no entries exist) */}
                      {day.isCurrentMonth &&
                        day.isToday &&
                        !day.entries.length && (
                          <button
                            onClick={(e) => {
                              e.stopPropagation(); // Prevent the parent div's onClick from firing
                              navigate('/journal/new'); // Navigate to journal creation page
                            }}
                            className="p-1 rounded-full bg-neutral-200 dark:bg-neutral-700 text-neutral-600 dark:text-neutral-400 hover:bg-neutral-300 dark:hover:bg-neutral-600"
                            aria-label="Create a new journal entry for today"
                          >
                            <FiPlus size={14} />
                          </button>
                        )}
                    </div>

                    {/* Entry Count Badge */}
                    {day.entries.length > 0 && (
                      <div className="mt-2 flex justify-center">
                        <div className="text-xs px-2 py-1 rounded-full bg-primary-500 text-white font-medium">
                          {day.entries.length}{' '}
                          {day.entries.length === 1 ? 'Entry' : 'Entries'}
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

      {/* Side panel for selected day details */}
      <SidePanel
        isOpen={!!selectedDay}
        day={selectedDay}
        onClose={() => setSelectedDay(null)}
      />
    </div>
  );
};

export default Calendar;