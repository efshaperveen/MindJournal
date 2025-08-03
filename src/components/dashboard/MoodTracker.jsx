import { useState, useMemo, useRef, useEffect } from "react";
import { useJournal } from "../../contexts/JournalContext";
import { FiSmile, FiMeh, FiFrown, FiPlus } from "react-icons/fi";
import { format, subDays, isToday } from "date-fns";
import { useNavigate } from "react-router-dom";
import { getMoodColor } from "../journal/MoodIcon";

const MoodTracker = () => {
  const { entries, privateEntryIds } = useJournal();
  const navigate = useNavigate();
  const [activeMoodPopoverId, setActiveMoodPopoverId] = useState(null);
  const [currentMoodIndices, setCurrentMoodIndices] = useState({});

  const hoverTimeoutRef = useRef(null);
  const slideshowIntervalsRef = useRef({});

  const days = useMemo(
    () =>
      Array.from({ length: 7 }, (_, i) => {
        const date = subDays(new Date(), i);
        const id = format(date, "yyyy-MM-dd");
        return {
          id,
          date,
          day: format(date, "EEE"),
          formattedDate: format(date, "MMM d"),
        };
      }).reverse(),
    []
  );

  const dayEntries = useMemo(() => {
    const publicEntries = entries.filter(entry => !privateEntryIds.includes(entry.id));

    return days.map((day) => {
      const dayStart = new Date(day.date);
      dayStart.setHours(0, 0, 0, 0);

      const dayEnd = new Date(day.date);
      dayEnd.setHours(23, 59, 59, 999);

      const entriesForDay = publicEntries
        .filter((entry) => {
          const entryDate = new Date(entry.createdAt);
          return entryDate >= dayStart && entryDate <= dayEnd;
        })
        .sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));

      return {
        ...day,
        entries: entriesForDay,
        hasEntry: entriesForDay.length > 0,
        latestMood:
          entriesForDay.length > 0
            ? entriesForDay[entriesForDay.length - 1].mood
            : null,
        allMoods: entriesForDay.map((entry) => ({
          mood: entry.mood,
          id: entry.id,
        })),
        additionalMoodCount: Math.max(0, entriesForDay.length - 1),
      };
    });
  }, [entries, days]);

  useEffect(() => {
    Object.values(slideshowIntervalsRef.current).forEach(clearInterval);
    slideshowIntervalsRef.current = {};

    dayEntries.forEach((dayInfo) => {
      if (
        dayInfo.additionalMoodCount > 0 &&
        activeMoodPopoverId !== dayInfo.id
      ) {
        const intervalId = setInterval(() => {
          setCurrentMoodIndices((prevIndices) => {
            const currentIdx = prevIndices[dayInfo.id] || 0;
            const nextIdx = (currentIdx + 1) % dayInfo.allMoods.length;
            return {
              ...prevIndices,
              [dayInfo.id]: nextIdx,
            };
          });
        }, 3000); // Changed to 3 seconds (3000ms) for slower transition
        slideshowIntervalsRef.current[dayInfo.id] = intervalId;
      }
    });

    return () => {
      Object.values(slideshowIntervalsRef.current).forEach(clearInterval);
    };
  }, [dayEntries, activeMoodPopoverId]);

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

  const handleViewEntry = (dayInfo, entryId = null) => {
    if (entryId) {
      navigate(`/journal/${entryId}`);
    } else if (dayInfo.entries.length > 0) {
      navigate(`/journal/${dayInfo.entries[dayInfo.entries.length - 1].id}`);
    } else if (isToday(dayInfo.date)) {
      navigate("/journal/new");
    }
  };

  const handleMouseEnter = (dayId) => {
    if (hoverTimeoutRef.current) {
      clearTimeout(hoverTimeoutRef.current);
    }
    setActiveMoodPopoverId(dayId);
  };

  const handleMouseLeave = () => {
    hoverTimeoutRef.current = setTimeout(() => {
      setActiveMoodPopoverId(null);
    }, 150);
  };

  const hasEntryToday = entries.some((entry) =>
    isToday(new Date(entry.createdAt))
  );

  return (
    <div className="card">
      <div className="px-4 pt-4 pb-2">
        <h2 className="font-lora text-xl font-semibold">Mood Tracker</h2>
        <p className="font-lora font-medium text-md text-neutral-500 dark:text-neutral-400">
          Last 7 days
        </p>
      </div>

      <div className="p-4 grid grid-cols-7 gap-1">
        {dayEntries.map((dayInfo) => {
          let displayMood = dayInfo.latestMood;
          if (dayInfo.additionalMoodCount > 0) {
            const currentIdx = currentMoodIndices[dayInfo.id] || 0;
            displayMood =
              dayInfo.allMoods[currentIdx]?.mood || dayInfo.latestMood;
          }

          return (
            <div
              key={dayInfo.id}
              className="flex flex-col items-center relative"
              onMouseEnter={() =>
                dayInfo.additionalMoodCount > 0 && handleMouseEnter(dayInfo.id)
              }
              onMouseLeave={handleMouseLeave}
              onClick={() => {
                if (isToday(dayInfo.date) && !dayInfo.hasEntry) {
                  handleCreateEntry();
                  setActiveMoodPopoverId(null);
                } else if (dayInfo.hasEntry) {
                  if (dayInfo.additionalMoodCount > 0) {
                    if (activeMoodPopoverId === dayInfo.id) {
                      setActiveMoodPopoverId(null);
                    } else {
                      setActiveMoodPopoverId(dayInfo.id);
                    }
                  } else {
                    handleViewEntry(dayInfo, dayInfo.entries[0]?.id || null);
                  }
                }
              }}
            >
              <div className="font-libre-baskerville font-medium text-sm text-neutral-600 dark:text-neutral-400">
                {dayInfo.day}
              </div>

              <button
                // Removed transition-all and kept transition-colors for background changes
                className={`w-10 h-10 mt-1 rounded-full flex items-center justify-center transition-colors relative ${
                  dayInfo.hasEntry
                    ? getMoodColor(displayMood) + " cursor-pointer"
                    : "bg-neutral-100 dark:bg-neutral-800 hover:bg-neutral-200 dark:hover:bg-neutral-700 cursor-pointer"
                }`}
              >
                {dayInfo.hasEntry ? (
                  <>
                    {/* Wrapper div for icon fade transition */}
                    <div
                      key={displayMood}
                      className="transition-opacity duration-500 ease-in-out"
                    >
                      {getMoodIcon(displayMood)}
                    </div>
                    {dayInfo.additionalMoodCount > 0 && (
                      <span className="absolute -top-1 -right-1 bg-neutral-600 text-white text-[10px] rounded-full w-4 h-4 flex items-center justify-center">
                        +{dayInfo.additionalMoodCount}
                      </span>
                    )}
                  </>
                ) : (
                  isToday(dayInfo.date) && (
                    <FiPlus className="text-neutral-500" />
                  )
                )}
              </button>

              <div className="font-libre-baskerville text-xs mt-1 text-neutral-500 dark:text-neutral-400">
                {dayInfo.formattedDate}
              </div>

              {/* Moods Popover */}
              {activeMoodPopoverId === dayInfo.id &&
                dayInfo.hasEntry &&
                dayInfo.additionalMoodCount > 0 && (
                  <div
                    className="absolute z-10 top-full mt-2 bg-white dark:bg-neutral-800 p-2 rounded-lg shadow-lg border border-neutral-200 dark:border-neutral-700 flex flex-wrap gap-1 justify-center min-w-[120px]"
                    onClick={(e) => e.stopPropagation()}
                    onMouseEnter={() => handleMouseEnter(dayInfo.id)}
                    onMouseLeave={handleMouseLeave}
                  >
                    {dayInfo.allMoods.map((moodEntry, index) => (
                      <button
                        key={`${dayInfo.id}-${moodEntry.id || index}`}
                        className={`p-1 rounded-full transform transition-transform duration-150 ease-out hover:scale-125 ${getMoodColor(
                          moodEntry.mood,
                          true
                        )}`}
                        onClick={(e) => {
                          e.stopPropagation();
                          handleViewEntry(dayInfo, moodEntry.id);
                          setActiveMoodPopoverId(null);
                          if (hoverTimeoutRef.current) {
                            clearTimeout(hoverTimeoutRef.current);
                          }
                        }}
                        title={`View entry: ${moodEntry.mood}`}
                      >
                        {getMoodIcon(moodEntry.mood, 20)}
                      </button>
                    ))}
                  </div>
                )}
            </div>
          );
        })}
      </div>

      {/* Conditional button for adding entries */}
      <div className="p-4 pt-2 border-t border-neutral-200 dark:border-neutral-700 mt-2">
        <button
          onClick={handleCreateEntry}
          className="font-lora font-light btn btn-outline w-full flex items-center justify-center space-x-2"
        >
          <FiPlus size={18} />
          <span>
            {hasEntryToday ? "Add more entries" : "Add today's entry"}
          </span>
        </button>
      </div>
    </div>
  );
};

export default MoodTracker;
