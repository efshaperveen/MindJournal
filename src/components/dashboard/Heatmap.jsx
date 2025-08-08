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

  const moodIntensity = { great: 5, good: 4, okay: 3, bad: 2, awful: 1 };

  const aggregateMoods = (moods) => {
    if (!moods.length) return null;
    const avg =
      moods.reduce((sum, mood) => sum + moodIntensity[mood], 0) / moods.length;
    if (avg >= 4.5) return "great";
    if (avg >= 3.5) return "good";
    if (avg >= 2.5) return "okay";
    if (avg >= 1.5) return "bad";
    return "awful";
  };

  const journalData = useMemo(() => {
    const data = {};
    entries.forEach((entry) => {
      const dateString = format(new Date(entry.createdAt), "yyyy-MM-dd");
      if (!data[dateString]) data[dateString] = { moods: [], entries: [] };
      if (entry.mood) data[dateString].moods.push(entry.mood);
      data[dateString].entries.push(entry);
    });
    Object.values(data).forEach(
      (d) => (d.aggregatedMood = aggregateMoods(d.moods))
    );
    return data;
  }, [entries]);

  const getMoodColor = (mood) => {
    switch (mood) {
      case "great":
        return "bg-emerald-500/80";
      case "good":
        return "bg-blue-500/80";
      case "okay":
        return "bg-slate-400/80";
      case "bad":
        return "bg-amber-500/80";
      case "awful":
        return "bg-rose-500/80";
      default:
        return "bg-gray-200/50";
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
    return eachDayOfInterval({ start, end }).map((day) => {
      const dateString = format(day, "yyyy-MM-dd");
      const moodData = journalData[dateString];
      return {
        date: day,
        dateString,
        mood: moodData?.aggregatedMood || null,
        entries: moodData?.entries || [],
        moods: moodData?.moods || [],
      };
    });
  }, [filter, selectedYear, selectedMonth, selectedWeek, journalData]);

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
    if (filter === "month")
      selectedMonth === 0
        ? (setSelectedMonth(11), setSelectedYear((y) => y - 1))
        : setSelectedMonth((m) => m - 1);
    if (filter === "year") setSelectedYear((y) => y - 1);
  };

  const navigateNext = () => {
    if (filter === "week") setSelectedWeek((prev) => Math.max(0, prev - 1));
    if (filter === "month")
      selectedMonth === 11
        ? (setSelectedMonth(0), setSelectedYear((y) => y + 1))
        : setSelectedMonth((m) => m + 1);
    if (filter === "year") setSelectedYear((y) => y + 1);
  };

  const getCurrentSelection = () => {
    if (filter === "week")
      return `Week of ${format(
        subDays(new Date(), selectedWeek * 7),
        "MMM d, yyyy"
      )}`;
    if (filter === "month")
      return `${format(new Date(selectedYear, selectedMonth), "MMMM yyyy")}`;
    if (filter === "year") return `${selectedYear}`;
    return "Current";
  };

  return (
    <div className="w-full p-6 bg-white/40 dark:bg-neutral-800/40 backdrop-blur-md rounded-2xl shadow-lg border border-white/20 dark:border-neutral-700/30 transition-all duration-300 hover:shadow-xl hover:scale-[1.01]">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-6 gap-4">
        <div className="flex items-start sm:items-center gap-3">
          <div className="p-3 bg-gradient-to-br from-green-200/60 to-green-400/60 dark:from-green-700/50 dark:to-green-900/50 text-green-900 dark:text-green-100 rounded-xl shadow-inner">
            <FiTrendingUp size={20} />
          </div>
          <div>
            <h2 className="text-xl sm:text-2xl font-semibold text-neutral-900 dark:text-white">
              Mood Heatmap
            </h2>
            <p className="text-neutral-600 dark:text-neutral-400 text-sm sm:text-base">
              Visualize your emotional patterns over time
            </p>
          </div>
        </div>

        {/* Filter & Navigation */}
        <div className="flex flex-wrap justify-between sm:justify-end items-center gap-2">
          <div className="relative">
            <button
              onClick={() => setShowFilterDropdown(!showFilterDropdown)}
              className="flex items-center space-x-2 px-3 py-2 text-sm bg-white/50 dark:bg-neutral-700/50 backdrop-blur-sm border border-white/20 dark:border-neutral-600 rounded-xl hover:scale-105 transition-transform shadow-sm"
            >
              <FiCalendar size={14} />
              <span>{filter.charAt(0).toUpperCase() + filter.slice(1)}</span>
              <FiChevronDown
                size={14}
                className={`transition-transform ${
                  showFilterDropdown ? "rotate-180" : ""
                }`}
              />
            </button>
            {showFilterDropdown && (
              <div className="absolute right-0 top-full mt-1 bg-white/80 dark:bg-neutral-800/80 backdrop-blur-sm border border-white/20 dark:border-neutral-700 rounded-xl shadow-lg z-10">
                {["week", "month", "year"].map((option) => (
                  <button
                    key={option}
                    onClick={() => {
                      setFilter(option);
                      setShowFilterDropdown(false);
                    }}
                    className={`block w-full px-3 py-2 text-sm hover:bg-white/40 dark:hover:bg-neutral-700/40 transition ${
                      filter === option ? "text-green-600 font-medium" : ""
                    }`}
                  >
                    {option.charAt(0).toUpperCase() + option.slice(1)}
                  </button>
                ))}
              </div>
            )}
          </div>
          <button
            onClick={navigatePrevious}
            className="p-2 rounded-xl bg-white/40 dark:bg-neutral-700/40 hover:scale-105 transition shadow-sm"
          >
            <FiChevronLeft size={16} />
          </button>
          <div className="px-3 py-1 bg-white/50 dark:bg-neutral-700/50 backdrop-blur-sm rounded-xl text-xs sm:text-sm font-medium border border-white/20">
            {getCurrentSelection()}
          </div>
          <button
            onClick={navigateNext}
            disabled={filter === "week" && selectedWeek === 0}
            className="p-2 rounded-xl bg-white/40 dark:bg-neutral-700/40 hover:scale-105 transition shadow-sm disabled:opacity-50"
          >
            <FiChevronRight size={16} />
          </button>
        </div>
      </div>

      {/* Mood Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 mb-6">
        {["great", "good", "okay", "bad", "awful"].map((mood) => (
          <div
            key={mood}
            className="rounded-2xl p-3 border border-white/20 dark:border-neutral-700/30 bg-white/40 dark:bg-neutral-800/40 backdrop-blur-sm hover:scale-105 hover:shadow-lg transition"
          >
            <div className="flex items-center space-x-2 mb-1">
              <div className={`w-3 h-3 rounded-full ${getMoodColor(mood)}`} />
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

      {/* Responsive Heatmap */}
      <div className="w-full">
        <div
          className="grid"
          style={{
            gap: filter === "year" ? "4px" : filter === "week" ? "3px" : "4px",
            gridTemplateColumns:
              filter === "year"
                ? "repeat(auto-fit, minmax(10px, 1fr))"
                : filter === "month"
                ? "repeat(auto-fit, minmax(16px, 1fr))"
                : "repeat(auto-fit, minmax(20px, 1fr))",
          }}
        >
          {calendarData.map((day) => {
            const tooltipContent = day.mood
              ? `<div><strong>${format(
                  day.date,
                  "MMM d, yyyy"
                )}</strong><br/>Mood: ${getMoodLabel(
                  day.mood
                )}<br/>Entries: ${day.moods.join(", ")}</div>`
              : `<div>${format(day.date, "MMM d, yyyy")}<br/>No Entry</div>`;

            return (
              <div key={day.dateString} className="relative aspect-square">
                <div
                  data-tooltip-id={`tooltip-${day.dateString}`}
                  data-tooltip-html={tooltipContent}
                  className={`absolute inset-0 rounded-sm cursor-pointer transition-transform hover:scale-110 ${getMoodColor(
                    day.mood
                  )}`}
                >
                  <Tooltip
                    id={`tooltip-${day.dateString}`}
                    className="max-w-xs text-sm z-50"
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Color Legend */}
      <div className="flex flex-wrap justify-center mt-4 gap-4">
        {[
          { label: "Great", color: "bg-emerald-500/80" },
          { label: "Good", color: "bg-blue-500/80" },
          { label: "Okay", color: "bg-slate-400/80" },
          { label: "Bad", color: "bg-amber-500/80" },
          { label: "Awful", color: "bg-rose-500/80" },
        ].map((item) => (
          <div key={item.label} className="flex items-center space-x-2">
            <div className={`w-4 h-4 rounded-sm ${item.color}`} />
            <span className="text-sm text-neutral-700 dark:text-neutral-300">
              {item.label}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Heatmap;
