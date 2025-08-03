import { useState, useMemo, Fragment } from "react";
import { useNavigate } from "react-router-dom";
import { useJournal } from "../contexts/JournalContext";
import {
  format, startOfMonth, endOfMonth, startOfWeek, endOfWeek,
  addDays, isToday, isSameMonth, parseISO, addMonths, subMonths,
} from 'date-fns';
import { motion } from 'framer-motion';

import { FiChevronLeft, FiChevronRight, FiPlus } from 'react-icons/fi';
import SidePanel from '../components/calendar/SidePanel';          

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
  subMonths
} from "date-fns";

import { FiChevronLeft, FiChevronRight, FiPlus } from "react-icons/fi";
import SidePanel from "../components/calendar/SidePanel";
main

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
      <div className="p-6 animate-fadeIn">
        {/* Skeleton UI as before */}
        <p className="text-center text-neutral-600 dark:text-neutral-300">
          Loading...
        </p>
      </div>
    );
  }

  return (
 ui-fix
    <motion.div
  className="relative flex flex-col lg:flex-row gap-4"
  initial={{ opacity: 0, y: 20 }}
  animate={{ opacity: 1, y: 0 }}
  transition={{ duration: 0.5, ease: 'easeOut'}}
  >
      <div className={`flex-1 transition-all duration-300 bg-neutral-50 dark:bg-neutral-900 rounded-xl shadow-inner p-4 ${selectedDay ? 'opacity-30 blur-sm pointer-events-none' : ''}`}>
        {/* Header */}
         <motion.div
      className="flex justify-between items-center mb-6"
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
    >
          <h1 className="text-2xl md:text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-primary-500 to-indigo-500">Calendar</h1>
          <div className="flex space-x-2">
             <motion.button
          onClick={prevMonth}
          className="p-2 rounded-full bg-gradient-to-tr from-neutral-100 to-neutral-200 dark:from-neutral-800 dark:to-neutral-700 hover:shadow-md active:scale-90 transition"
          whileTap={{ scale: 0.9 }}
        >
              <FiChevronLeft size={20} />
            </motion.button>
             <motion.button
          onClick={() => setCurrentMonth(new Date())}
          className="px-4 py-2 font-medium rounded-md border border-primary-500 text-primary-600 dark:text-primary-400 bg-white dark:bg-neutral-800 hover:bg-primary-50 dark:hover:bg-neutral-700 shadow-sm transition"
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
        >
              {format(currentMonth, 'MMMM yyyy')}
          </motion.button>
            <motion.button
          onClick={nextMonth}
          className="p-2 rounded-full bg-gradient-to-tr from-neutral-100 to-neutral-200 dark:from-neutral-800 dark:to-neutral-700 hover:shadow-md active:scale-90 transition"
          whileTap={{ scale: 0.9 }}
        >

              <FiChevronRight size={20} />
            </motion.button>
          </div>
        </motion.div>

        {/* Grid */}
 ui-fix
        <div className="card overflow-hidden rounded-md shadow-sm">
          <div className="grid grid-cols-7 text-center bg-gradient-to-r from-neutral-50 to-neutral-100 dark:from-neutral-800 dark:to-neutral-700 border-b border-neutral-200 dark:border-neutral-700">
            {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
              <div key={day} className="py-2 font-semibold text-neutral-700 dark:text-neutral-300 border-r last:border-r-0 border-neutral-200 dark:border-neutral-700 hover:bg-neutral-100 dark:hover:bg-neutral-700 transition-colors duration-200 cursor-default">

                {day}
              </div>
            ))}
          </div>

          <div className="grid grid-cols-7 border-b border-neutral-200 dark:border-neutral-700">
            {calendarDays.map((week, weekIndex) => (
              <Fragment key={weekIndex}>
                {week.map((day, dayIndex) => {
                  const isPastOrToday = day.date <= new Date();
                  const isClickable =
                    (day.entries.length > 0 || day.isToday) && isPastOrToday;

                  return (
                    <div
                      key={dayIndex}
                      onClick={
                        isClickable ? () => handleDayClick(day) : undefined
                      }
                      className={`group relative min-h-[100px] p-2 border-r border-neutral-200 dark:border-neutral-700 last:border-r-0
ui-fix
                        ${!day.isCurrentMonth ? 'bg-neutral-50 dark:bg-neutral-900 text-neutral-400 dark:text-neutral-600' : 'bg-gradient-to-br from-white to-neutral-50 dark:from-neutral-800 dark:to-neutral-900'}
                        ${day.isToday ? 'bg-primary-50 dark:bg-primary-900/10 border-2 border-primary-500' : ''}
                        ${isClickable ? 'hover:-translate-y-1 hover:shadow-md hover:bg-primary-100 dark:hover:bg-primary-900 cursor-pointer' : 'cursor-default'}
                        transition-all duration-200 rounded-md`}
                    >
                      <div className="flex justify-between items-start">
                        <div className={`flex items-center justify-center w-8 h-8 rounded-full text-sm font-semibold shadow-inner
                          ${day.isToday ? 'bg-primary-500 text-white' :
                          isClickable ? 'text-neutral-700 dark:text-neutral-300' :
                          'text-neutral-400 dark:text-neutral-600'}`}>
                          {format(day.date, 'd')}
                        </div>

                        {day.isToday && !day.entries.length && (
                        <motion.button
                         onClick={(e) => {
                          e.stopPropagation();
                          navigate('/journal/new');
                         }}
                        className="p-2 rounded-full bg-neutral-200 dark:bg-neutral-700 text-neutral-600 dark:text-neutral-400 hover:bg-primary-500 hover:text-white dark:hover:bg-primary-500 shadow-sm transition-all"
                         whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.95 }}

                          >
                        <FiPlus size={14} />
                        </motion.button>
                        )}
                      </div>

                      {day.entries.length > 0 && (
                        <div className="mt-2 flex justify-center">
 ui-fix
                          <div className="text-xs px-3 py-1 rounded-full bg-gradient-to-r from-primary-500 to-primary-600 text-white font-semibold shadow-sm hover:brightness-110 transition-all duration-200">
                            {day.entries.length} {day.entries.length === 1 ? 'Entry' : 'Entries'}

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
   </motion.div>
  );
};

export default Calendar;
