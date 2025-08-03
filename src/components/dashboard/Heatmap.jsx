import { useState, useMemo } from "react";
import {
  format,
  subDays,
  startOfWeek,
  endOfWeek,
  startOfMonth,
  endOfMonth,
  startOfYear,
  endOfYear,
  eachDayOfInterval,
} from "date-fns";
import {
  FiCalendar,
  FiChevronDown,
  FiTrendingUp,
  FiChevronLeft,
  FiChevronRight,
} from "react-icons/fi";
import { Tooltip } from "react-tooltip";
import { useJournal } from "../../contexts/JournalContext";

const Heatmap = () => {
  const [filter, setFilter] = useState("month");
  const [showFilterDropdown, setShowFilterDropdown] = useState(false);
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth());
  const [selectedWeek, setSelectedWeek] = useState(0);

  const { entries } = useJournal();

  const moodIntensity = {
    great: 5,
    good: 4,
    okay: 3,
    bad: 2,
    awful: 1,
  };

  const aggregateMoods = (moods) => {
    if (!moods || moods.length === 0) return null;
    const total = moods.reduce((sum, mood) => sum + moodIntensity[mood], 0);
    const avg = total / moods.length;
    if (avg >= 4.5) return "great";
    if (avg >= 3.5) return "good";
    if (avg >= 2.5) return "okay";
    if (avg >= 1.5) return "bad";
    return "awful";
  };

  const processJournalData = () => {
    const data = {};
    entries.forEach((entry) => {
      const dateString = format(new Date(entry.createdAt), "yyyy-MM-dd");
      if (!data[dateString]) {
        data[dateString] = { moods: [], entries: [], entryCount: 0 };
      }
      if (entry.mood) {
        data[dateString].moods.push(entry.mood);
        data[dateString].entries.push(entry);
        data[dateString].entryCount++;
      }
    });
    Object.values(data).forEach((d) => {
      d.aggregatedMood = aggregateMoods(d.moods);
    });
    return data;
  };

  const journalData = processJournalData();

  const getMoodColor = (mood) => {
    switch (mood) {
      case "great":
        return "bg-emerald-500 dark:bg-emerald-400";
      case "good":
        return "bg-blue-500 dark:bg-blue-400";
      case "okay":
        return "bg-slate-400 dark:bg-slate-500";
      case "bad":
        return "bg-amber-500 dark:bg-amber-400";
      case "awful":
        return "bg-rose-500 dark:bg-rose-400";
      default:
        return "bg-gray-200 dark:bg-gray-700";
    }
  };

  const getMoodLabel = (mood) => {
    switch (mood) {
      case "great":
        return "Great";
      case "good":
        return "Good";
      case "okay":
        return "Okay";
      case "bad":
        return "Bad";
      case "awful":
        return "Awful";
      default:
        return "No Entry";
    }
  };

  const getDateRange = () => {
    const today = new Date();
    if (filter === "week") {
      const start = startOfWeek(subDays(today, selectedWeek * 7));
      return { start, end: endOfWeek(start) };
    }
    if (filter === "month") {
      const start = new Date(selectedYear, selectedMonth, 1);
      return { start, end: endOfMonth(start) };
    }
    if (filter === "year") {
      return {
        start: startOfYear(new Date(selectedYear, 0, 1)),
        end: endOfYear(new Date(selectedYear, 11, 31)),
      };
    }
    return { start: startOfMonth(today), end: today };
  };

  const calendarData = useMemo(() => {
    const { start, end } = getDateRange();
    const days = eachDayOfInterval({ start, end });
    return days.map((day) => {
      const dateString = format(day, "yyyy-MM-dd");
      const moodData = journalData[dateString];
      return {
        date: day,
        dateString,
        mood: moodData?.aggregatedMood || null,
        hasData: !!moodData,
        entries: moodData?.entries || [],
        moods: moodData?.moods || [],
      };
    });
  }, [filter, selectedYear, selectedMonth, selectedWeek, journalData]);

  const weeksData = useMemo(() => {
    const weeks = [];
    let currentWeek = [];
    calendarData.forEach((day, i) => {
      currentWeek.push(day);
      if ((i + 1) % 7 === 0 || i === calendarData.length - 1) {
        weeks.push(currentWeek);
        currentWeek = [];
      }
    });
    return weeks;
  }, [calendarData]);

  const getCellSize = () => {
    if (filter === "week") return "w-8 h-8 sm:w-10 sm:h-10";
    if (filter === "month") return "w-5 h-5 sm:w-6 sm:h-6";
    if (filter === "year") return "w-2 h-2 sm:w-3 sm:h-3";
    return "w-5 h-5";
  };

  const moodStats = useMemo(() => {
    const stats = { great: 0, good: 0, okay: 0, bad: 0, awful: 0, total: 0 };
    calendarData.forEach((day) => {
      if (day.mood) {
        stats[day.mood]++;
        stats.total++;
      }
    });
    return stats;
  }, [calendarData]);

  const navigatePrevious = () => {
    if (filter === "week") setSelectedWeek((prev) => prev + 1);
    if (filter === "month") {
      if (selectedMonth === 0) {
        setSelectedMonth(11);
        setSelectedYear((y) => y - 1);
      } else setSelectedMonth((m) => m - 1);
    }
    if (filter === "year") setSelectedYear((y) => y - 1);
  };

  const navigateNext = () => {
    if (filter === "week") setSelectedWeek((prev) => Math.max(0, prev - 1));
    if (filter === "month") {
      if (selectedMonth === 11) {
        setSelectedMonth(0);
        setSelectedYear((y) => y + 1);
      } else setSelectedMonth((m) => m + 1);
    }
    if (filter === "year") setSelectedYear((y) => y + 1);
  };

  const getCurrentSelection = () => {
    if (filter === "week")
      return `Week of ${format(subDays(new Date(), selectedWeek * 7), "MMM d, yyyy")}`;
    if (filter === "month")
      return `${format(new Date(selectedYear, selectedMonth), "MMMM yyyy")}`;
    if (filter === "year") return `${selectedYear}`;
    return "Current";
  };

  return (
    <div className="w-full p-6 bg-white dark:bg-neutral-800 rounded-lg shadow-sm border border-neutral-200 dark:border-neutral-700 animate-fadeIn">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 gap-4">
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-primary-100 dark:bg-primary-800 text-primary-900 dark:text-primary-100 rounded-lg">
            <FiTrendingUp size={20} />
          </div>
          <div>
            <h2 className="text-xl font-lora font-semibold text-neutral-900 dark:text-white">
              Mood Heatmap
            </h2>
            <p className="text-neutral-600 dark:text-neutral-400 text-sm">
              Visualize your emotional patterns over time
            </p>
          </div>
        </div>
        {/* Filter & Navigation */}
        <div className="flex items-center space-x-3">
          <div className="relative">
            <button
              onClick={() => setShowFilterDropdown(!showFilterDropdown)}
              className="flex items-center space-x-2 px-3 py-2 text-sm bg-neutral-50 dark:bg-neutral-700 text-neutral-700 dark:text-neutral-300 rounded-lg hover:bg-neutral-100 dark:hover:bg-neutral-600 border"
            >
              <FiCalendar size={14} />
              <span>{filter.charAt(0).toUpperCase() + filter.slice(1)}</span>
              <FiChevronDown
                size={14}
                className={`transition-transform ${showFilterDropdown ? "rotate-180" : ""}`}
              />
            </button>
            {showFilterDropdown && (
              <div className="absolute right-0 top-full mt-1 bg-white dark:bg-neutral-800 border rounded-lg shadow-lg z-10">
                {["week", "month", "year"].map((option) => (
                  <button
                    key={option}
                    onClick={() => {
                      setFilter(option);
                      setShowFilterDropdown(false);
                    }}
                    className={`block w-full px-3 py-2 text-sm hover:bg-neutral-50 dark:hover:bg-neutral-700 ${
                      filter === option ? "text-green-600 font-medium" : ""
                    }`}
                  >
                    {option.charAt(0).toUpperCase() + option.slice(1)}
                  </button>
                ))}
              </div>
            )}
          </div>
          <button onClick={navigatePrevious} className="p-2 rounded-lg hover:bg-neutral-100 dark:hover:bg-neutral-700">
            <FiChevronLeft size={16} />
          </button>
          <div className="px-3 py-1 bg-neutral-50 dark:bg-neutral-700 rounded-lg text-sm font-medium">
            {getCurrentSelection()}
          </div>
          <button
            onClick={navigateNext}
            disabled={filter === "week" && selectedWeek === 0}
            className="p-2 rounded-lg hover:bg-neutral-100 dark:hover:bg-neutral-700 disabled:opacity-50"
          >
            <FiChevronRight size={16} />
          </button>
        </div>
      </div>

      {/* Mood Stats */}
      <div className="grid grid-cols-5 gap-3 mb-6">
        {["great", "good", "okay", "bad", "awful"].map((mood) => (
          <div
            key={mood}
            className="rounded-lg p-3 border border-neutral-200 dark:border-neutral-700"
          >
            <div className="flex items-center space-x-2 mb-1">
              <div className={`w-2 h-2 rounded-full ${getMoodColor(mood)}`}></div>
              <span className="text-xs text-neutral-600 dark:text-neutral-400">
                {getMoodLabel(mood)}
              </span>
            </div>
            <div className="text-lg font-bold text-neutral-900 dark:text-white">
              {moodStats[mood]}
            </div>
            <div className="text-xs text-neutral-500 dark:text-neutral-400">
              {moodStats.total > 0
                ? Math.round((moodStats[mood] / moodStats.total) * 100)
                : 0}
              %
            </div>
          </div>
        ))}
      </div>

      {/* Heatmap */}
      <div className="flex justify-center">
        <div className="grid grid-flow-col gap-1 auto-cols-max">
          {weeksData.map((week, i) => (
            <div key={i} className="grid grid-flow-row gap-1 auto-rows-max">
              {week.map((day) => {
                const tooltipContent = day.hasData
                  ? `<div><strong>${format(day.date, "MMM d, yyyy")}</strong><br/>Mood: ${getMoodLabel(
                      day.mood
                    )}<br/>Entries: ${day.moods.join(", ")}</div>`
                  : `<div>${format(day.date, "MMM d, yyyy")}<br/>No Entry</div>`;

                return (
                  <div
                    key={day.dateString}
                    data-tooltip-id={`tooltip-${day.dateString}`}
                    data-tooltip-html={tooltipContent}
                    className={`${getCellSize()} rounded-sm transition-all duration-200 hover:scale-110 cursor-pointer ${getMoodColor(
                      day.mood
                    )}`}
                  >
                    <Tooltip id={`tooltip-${day.dateString}`} className="max-w-xs text-sm" />
                  </div>
                );
              })}
            </div>
          ))}
        </div>
      </div>

      {/* Color Legend */}
      <div className="flex justify-center mt-4 space-x-4">
        {[
          { label: "Great", color: "bg-emerald-500 dark:bg-emerald-400" },
          { label: "Good", color: "bg-blue-500 dark:bg-blue-400" },
          { label: "Okay", color: "bg-slate-400 dark:bg-slate-500" },
          { label: "Bad", color: "bg-amber-500 dark:bg-amber-400" },
          { label: "Awful", color: "bg-rose-500 dark:bg-rose-400" },
        ].map((item) => (
          <div key={item.label} className="flex items-center space-x-2">
            <div className={`w-4 h-4 rounded-sm ${item.color}`} />
            <span className="text-sm text-neutral-700 dark:text-neutral-300">{item.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Heatmap;
