import { useState, useMemo } from "react";
import { useJournal } from "../contexts/JournalContext";
import { useTheme } from "../contexts/ThemeContext";
import ChartDataLabels from "chartjs-plugin-datalabels";
import { Pie, Bar } from "react-chartjs-2";
import {
  format,
  startOfWeek,
  startOfMonth,
  parseISO,
} from "date-fns";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  PointElement,
  LineElement,
} from "chart.js";
import { FiBarChart2, FiPieChart, FiTrendingUp, FiCalendar } from "react-icons/fi";

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  PointElement,
  LineElement,
  ChartDataLabels
);

const Stats = () => {
  const { entries } = useJournal();
  const { theme } = useTheme();
  const [timeRange, setTimeRange] = useState("month");

  const filteredEntries = useMemo(() => {
    if (entries.length === 0) return [];

    const now = new Date();
    let startDate;

    if (timeRange === "week") {
      startDate = startOfWeek(now, { weekStartsOn: 0 });
    } else if (timeRange === "month") {
      startDate = startOfMonth(now);
    } else {
      return entries;
    }

    return entries.filter((entry) => parseISO(entry.createdAt) >= startDate);
  }, [entries, timeRange]);

  const moodData = useMemo(() => {
    if (filteredEntries.length === 0) return null;

    const moodCounts = {
      great: 0,
      good: 0,
      okay: 0,
      bad: 0,
      awful: 0,
    };

    filteredEntries.forEach((entry) => {
      if (entry.mood) {
        moodCounts[entry.mood]++;
      }
    });

    const backgroundColor = [
      "rgba(34, 197, 94, 0.8)",
      "rgba(59, 130, 246, 0.8)",
      "rgba(234, 179, 8, 0.8)",
      "rgba(249, 115, 22, 0.8)",
      "rgba(239, 68, 68, 0.8)",
    ];

    const borderColor = [
      "rgba(22, 163, 74, 1)",
      "rgba(37, 99, 235, 1)",
      "rgba(202, 138, 4, 1)",
      "rgba(234, 88, 12, 1)",
      "rgba(220, 38, 38, 1)",
    ];

    return {
      labels: ["Great", "Good", "Okay", "Bad", "Awful"],
      datasets: [
        {
          data: [
            moodCounts.great,
            moodCounts.good,
            moodCounts.okay,
            moodCounts.bad,
            moodCounts.awful,
          ],
          backgroundColor,
          borderColor,
          borderWidth: 2,
        },
      ],
    };
  }, [filteredEntries]);

  const weeklyData = useMemo(() => {
    if (filteredEntries.length === 0) return null;

    const weekDays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
    const dayCounts = [0, 0, 0, 0, 0, 0, 0];

    filteredEntries.forEach((entry) => {
      const day = parseISO(entry.createdAt).getDay();
      dayCounts[day]++;
    });

    return {
      labels: weekDays,
      datasets: [
        {
          label: "Entries",
          data: dayCounts,
          backgroundColor: "rgba(14, 165, 233, 0.8)",
          borderColor: "rgba(14, 165, 233, 1)",
          borderWidth: 2,
          borderRadius: 8,
          borderSkipped: false,
        },
      ],
    };
  }, [filteredEntries]);

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "bottom",
        labels: {
          color: theme === "dark" ? "#e5e5e5" : "#404040",
          padding: 20,
          usePointStyle: true,
        },
      },
      datalabels: {
        color: theme === "dark" ? "#ffffff" : "#000000",
        font: {
          weight: "bold",
        },
        formatter: (value) => {
          return value > 0 ? value : "";
        },
      },
    },
  };

  const barOptions = {
    ...chartOptions,
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          color: theme === "dark" ? "#e5e5e5" : "#404040",
        },
        grid: {
          color:
            theme === "dark"
              ? "rgba(255, 255, 255, 0.1)"
              : "rgba(0, 0, 0, 0.1)",
        },
      },
      x: {
        ticks: {
          color: theme === "dark" ? "#e5e5e5" : "#404040",
        },
        grid: {
          color:
            theme === "dark"
              ? "rgba(255, 255, 255, 0.1)"
              : "rgba(0, 0, 0, 0.1)",
        },
      },
    },
  };

  const getTimeRangeLabel = () => {
    switch (timeRange) {
      case "week":
        return "This Week";
      case "month":
        return "This Month";
      case "all":
        return "All Time";
      default:
        return "This Month";
    }
  };

  return (
    <div className="min-h-screen space-y-6 animate-fade-in">
      {/* Header */}
      <div className="glass-card p-6 rounded-2xl border-gradient">
        <div className="flex items-center space-x-3 mb-4">
          <div className="w-10 h-10 bg-gradient-primary rounded-xl flex items-center justify-center">
            <FiBarChart2 className="w-5 h-5 text-white" />
          </div>
          <h1 className="text-2xl md:text-3xl font-bold gradient-text">
            Insights & Analytics
          </h1>
        </div>
        <p className="text-neutral-600 dark:text-neutral-300">
          Discover patterns and trends in your journaling journey
        </p>
      </div>

      {/* Time Range Selector */}
      <div className="glass-card p-4 rounded-xl border-gradient">
        <div className="flex items-center space-x-3 mb-4">
          <div className="w-8 h-8 bg-gradient-secondary rounded-lg flex items-center justify-center">
            <FiCalendar className="w-4 h-4 text-white" />
          </div>
          <h2 className="text-lg font-semibold text-neutral-700 dark:text-neutral-200">
            Time Range
          </h2>
        </div>
        <div className="flex space-x-2">
          {["week", "month", "all"].map((range) => (
            <button
              key={range}
              onClick={() => setTimeRange(range)}
              className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
                timeRange === range
                  ? "bg-gradient-primary text-white shadow-glow"
                  : "bg-white/50 dark:bg-neutral-800/50 text-neutral-700 dark:text-neutral-200 hover:bg-primary-50 dark:hover:bg-primary-900/20"
              }`}
            >
              {range.charAt(0).toUpperCase() + range.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="glass-card p-4 rounded-xl border-gradient text-center">
          <div className="w-12 h-12 bg-gradient-success rounded-xl flex items-center justify-center mx-auto mb-3">
            <FiTrendingUp className="w-6 h-6 text-white" />
          </div>
          <div className="text-2xl font-bold text-neutral-700 dark:text-neutral-200">
            {filteredEntries.length}
          </div>
          <div className="text-sm text-neutral-500 dark:text-neutral-400">
            Total Entries
          </div>
        </div>

        <div className="glass-card p-4 rounded-xl border-gradient text-center">
          <div className="w-12 h-12 bg-gradient-secondary rounded-xl flex items-center justify-center mx-auto mb-3">
            <FiPieChart className="w-6 h-6 text-white" />
          </div>
          <div className="text-2xl font-bold text-neutral-700 dark:text-neutral-200">
            {filteredEntries.filter((entry) => entry.mood).length}
          </div>
          <div className="text-sm text-neutral-500 dark:text-neutral-400">
            Mood Entries
          </div>
        </div>

        <div className="glass-card p-4 rounded-xl border-gradient text-center">
          <div className="w-12 h-12 bg-gradient-accent rounded-xl flex items-center justify-center mx-auto mb-3">
            <FiBarChart2 className="w-6 h-6 text-white" />
          </div>
          <div className="text-2xl font-bold text-neutral-700 dark:text-neutral-200">
            {getTimeRangeLabel()}
          </div>
          <div className="text-sm text-neutral-500 dark:text-neutral-400">
            Time Period
          </div>
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Mood Distribution */}
        <div className="glass-card p-6 rounded-2xl border-gradient">
          <div className="flex items-center space-x-3 mb-4">
            <div className="w-8 h-8 bg-gradient-success rounded-lg flex items-center justify-center">
              <FiPieChart className="w-4 h-4 text-white" />
            </div>
            <h2 className="text-lg font-semibold text-neutral-700 dark:text-neutral-200">
              Mood Distribution
            </h2>
          </div>
          {moodData ? (
            <div className="h-64">
              <Pie data={moodData} options={chartOptions} />
            </div>
          ) : (
            <div className="h-64 flex items-center justify-center text-neutral-500 dark:text-neutral-400">
              No mood data available
            </div>
          )}
        </div>

        {/* Weekly Activity */}
        <div className="glass-card p-6 rounded-2xl border-gradient">
          <div className="flex items-center space-x-3 mb-4">
            <div className="w-8 h-8 bg-gradient-primary rounded-lg flex items-center justify-center">
              <FiBarChart2 className="w-4 h-4 text-white" />
            </div>
            <h2 className="text-lg font-semibold text-neutral-700 dark:text-neutral-200">
              Weekly Activity
            </h2>
          </div>
          {weeklyData ? (
            <div className="h-64">
              <Bar data={weeklyData} options={barOptions} />
            </div>
          ) : (
            <div className="h-64 flex items-center justify-center text-neutral-500 dark:text-neutral-400">
              No activity data available
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Stats;
