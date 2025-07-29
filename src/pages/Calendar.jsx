import { useState, useMemo, Fragment } from "react";
import { useNavigate } from "react-router-dom";
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
import { FiChevronLeft, FiChevronRight, FiPlus } from "react-icons/fi";
import SidePanel from "../components/calendar/SidePanel";

const Calendar = () => {
  const { entries, isLoading } = useJournal();
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

    const entriesByDate = entries.reduce((acc, entry) => {
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
    <div className="relative flex flex-col lg:flex-row gap-4 animate-fadeIn">
      <div
        className={`flex-1 transition-all duration-300 ${
          selectedDay ? "opacity-30 blur-sm pointer-events-none" : ""
        }`}
      >
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl md:text-3xl font-libre-baskerville font-bold text-neutral-900 dark:text-white">
            Calendar
          </h1>
          <div className="flex space-x-2">
            <button
              onClick={prevMonth}
              className="p-2 rounded-full bg-neutral-100 dark:bg-neutral-800 hover:bg-neutral-200 dark:hover:bg-neutral-700"
            >
              <FiChevronLeft size={20} />
            </button>
            <button
              className="px-4 py-2 font-playwrite font-light"
              onClick={() => setCurrentMonth(new Date())}
            >
              {format(currentMonth, "MMMM yyyy")}
            </button>
            <button
              onClick={nextMonth}
              className="p-2 rounded-full bg-neutral-100 dark:bg-neutral-800 hover:bg-neutral-200 dark:hover:bg-neutral-700"
            >
              <FiChevronRight size={20} />
            </button>
          </div>
        </div>

        {/* Grid */}
        <div className="card overflow-hidden rounded-md">
          <div className="grid grid-cols-7 text-center bg-neutral-50 dark:bg-neutral-800 border-b border-neutral-200 dark:border-neutral-700">
            {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
              <div
                key={day}
                className="py-2 font-playwrite-au font-medium text-neutral-600 dark:text-neutral-400"
              >
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
                        ${
                          !day.isCurrentMonth
                            ? "bg-neutral-50 dark:bg-neutral-900"
                            : ""
                        }
                        ${
                          day.isToday
                            ? "bg-primary-50 dark:bg-primary-900/10"
                            : ""
                        }
                        ${
                          isClickable
                            ? "hover:bg-primary-100 dark:hover:bg-primary-900 cursor-pointer"
                            : "cursor-default"
                        }
                        transition-all duration-200 rounded-md`}
                    >
                      <div className="flex justify-between items-start">
                        <div
                          className={`flex items-center justify-center w-8 h-8 rounded-full text-md font-libre-baskerville font-medium
                          ${
                            day.isToday
                              ? "bg-primary-500 text-white"
                              : isClickable
                              ? "text-neutral-700 dark:text-neutral-300"
                              : "text-neutral-400 dark:text-neutral-600"
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
                            className="p-1 rounded-full bg-neutral-200 dark:bg-neutral-700 text-neutral-600 dark:text-neutral-400 hover:bg-neutral-300 dark:hover:bg-neutral-600"
                          >
                            <FiPlus size={14} />
                          </button>
                        )}
                      </div>

                      {day.entries.length > 0 && (
                        <div className="mt-2 flex justify-center">
                          <div className="text-[12px] px-2 py-1 rounded-full bg-primary-500 text-white font-libre-baskerville font-light">
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
