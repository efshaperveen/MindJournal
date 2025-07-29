import { useState } from "react";
import { useJournal } from "../../contexts/JournalContext";
import { FiSmile, FiMeh, FiFrown, FiPlus } from "react-icons/fi";
import { format, subDays, isToday } from "date-fns";
import { useNavigate } from "react-router-dom";
import { getMoodColor } from "../journal/MoodIcon";

const MoodTracker = () => {
  const { entries } = useJournal();
  const navigate = useNavigate();
  const [selectedDate, setSelectedDate] = useState(null);

  // Get the last 7 days
  const days = Array.from({ length: 7 }, (_, i) => {
    const date = subDays(new Date(), i);
    return {
      date,
      day: format(date, "EEE"),
      formattedDate: format(date, "MMM d"),
    };
  }).reverse();

  // Get entries for each day
  const dayEntries = days.map((day) => {
    const dayStart = new Date(day.date);
    dayStart.setHours(0, 0, 0, 0);

    const dayEnd = new Date(day.date);
    dayEnd.setHours(23, 59, 59, 999);

    const entriesForDay = entries.filter((entry) => {
      const entryDate = new Date(entry.createdAt);
      return entryDate >= dayStart && entryDate <= dayEnd;
    });

    return {
      ...day,
      entries: entriesForDay,
      hasEntry: entriesForDay.length > 0,
      mood: entriesForDay.length > 0 ? entriesForDay[0].mood : null,
    };
  });

  const getMoodIcon = (mood, size = 20) => {
    switch (mood) {
      case "great":
      case "good":
        return (
          <FiSmile
            size={size}
            className={mood === "great" ? "text-green-500" : "text-blue-500"}
          />
        );
      case "okay":
        return <FiMeh size={size} className="text-yellow-500" />;
      case "bad":
      case "awful":
        return (
          <FiFrown
            size={size}
            className={mood === "bad" ? "text-orange-500" : "text-red-500"}
          />
        );
      default:
        return null;
    }
  };

  const handleCreateEntry = () => {
    navigate("/journal/new");
  };

  const handleViewEntry = (dayInfo) => {
    if (dayInfo.entries.length > 0) {
      navigate(`/journal/${dayInfo.entries[0].id}`);
    } else if (isToday(dayInfo.date)) {
      navigate("/journal/new");
    }
  };

  return (
    <div className="card">
      <div className="px-4 pt-4 pb-2">
        <h2 className="font-lora text-xl font-semibold mb-1">Mood Tracker</h2>
        <p className="font-playwrite-au font-medium text-sm text-neutral-500 dark:text-neutral-400">
          Last 7 days
        </p>
      </div>

      <div className="p-4 grid grid-cols-7 gap-1">
        {dayEntries.map((dayInfo) => (
          <div
            key={dayInfo.formattedDate}
            className="flex flex-col items-center"
            onClick={() => handleViewEntry(dayInfo)}
          >
            <div className="font-playwrite font-medium text-sm text-neutral-600 dark:text-neutral-400">
              {dayInfo.day}
            </div>

            <button
              className={`w-10 h-10 mt-1 rounded-full flex items-center justify-center transition-colors ${
                dayInfo.hasEntry
                  ? getMoodColor(dayInfo.mood) + " cursor-pointer"
                  : "bg-neutral-100 dark:bg-neutral-800 hover:bg-neutral-200 dark:hover:bg-neutral-700 cursor-pointer"
              }`}
              onMouseEnter={() => setSelectedDate(dayInfo.formattedDate)}
              onMouseLeave={() => setSelectedDate(null)}
            >
              {dayInfo.hasEntry
                ? getMoodIcon(dayInfo.mood)
                : isToday(dayInfo.date) && (
                    <FiPlus className="text-neutral-500" />
                  )}
            </button>

            <div className=" font-libre-baskerville text-xs mt-1 text-neutral-500 dark:text-neutral-400">
              {dayInfo.formattedDate}
            </div>
          </div>
        ))}
      </div>

      {!entries.some((entry) => isToday(new Date(entry.createdAt))) && (
        <div className="p-4 pt-2 border-t border-neutral-200 dark:border-neutral-700 mt-2">
          <button
            onClick={handleCreateEntry}
            className="btn btn-outline w-full flex items-center justify-center space-x-2"
          >
            <FiPlus size={18} />
            <span className="font-lora font-light">Add today's entry</span>
          </button>
        </div>
      )}
    </div>
  );
};

export default MoodTracker;
