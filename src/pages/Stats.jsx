import { useState, useMemo } from "react";
import { useJournal } from "../contexts/JournalContext";
import { useTheme } from "../contexts/ThemeContext";
import { Pie, Bar } from "react-chartjs-2";
import {
  format,
  startOfWeek,
  endOfWeek,
  startOfMonth,
  endOfMonth,
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
  LineElement
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
      return entries; // 'all' time range
    }

    return entries.filter((entry) => parseISO(entry.createdAt) >= startDate);
  }, [entries, timeRange]);

  // Mood distribution
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
      "rgba(34, 197, 94, 0.8)", // green for great
      "rgba(59, 130, 246, 0.8)", // blue for good
      "rgba(234, 179, 8, 0.8)", // yellow for okay
      "rgba(249, 115, 22, 0.8)", // orange for bad
      "rgba(239, 68, 68, 0.8)", // red for awful
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
          borderWidth: 1,
        },
      ],
    };
  }, [filteredEntries]);

  // Activity distribution
  const activityData = useMemo(() => {
    if (filteredEntries.length === 0) return null;

    // Count activity occurrences
    const activityCounts = {};

    filteredEntries.forEach((entry) => {
      if (entry.activities && entry.activities.length) {
        entry.activities.forEach((activity) => {
          if (!activityCounts[activity]) {
            activityCounts[activity] = 0;
          }
          activityCounts[activity]++;
        });
      }
    });

    // Sort activities by frequency and take top 10
    const sortedActivities = Object.entries(activityCounts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 10);

    const labels = sortedActivities.map(([activity]) => activity);
    const data = sortedActivities.map(([, count]) => count);

    return {
      labels,
      datasets: [
        {
          label: "Activity Frequency",
          data,
          backgroundColor: "rgba(139, 92, 246, 0.7)",
          borderColor: "rgba(109, 40, 217, 1)",
          borderWidth: 1,
          borderRadius: 4,
        },
      ],
    };
  }, [filteredEntries]);

  const pieOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "right",
        labels: {
          color: theme === "dark" ? "#e5e5e5" : "#262626",
          font: {
            size: 14,
            family: "Lora",
          },
        },
      },
      title: {
        display: true,
        text: "Mood Distribution",
        color: theme === "dark" ? "#e5e5e5" : "#262626",
        font: {
          family: "Libre Baskerville",
          size: 18,
          weight: "bold",
        },
      },
      tooltip: {
        bodyFont: {
          family: "Lora",
          size: 13,
        },
        titleFont: {
          family: "Lora",
          size: 13,
          weight: "bold",
        },
      },
    },
  };

  const barOptions = {
    responsive: true,
    maintainAspectRatio: false,
    indexAxis: "y",
    plugins: {
      legend: {
        display: false,
      },
      title: {
        display: true,
        text: "Top Activities",
        color: theme === "dark" ? "#e5e5e5" : "#262626",
        font: {
          family: "Libre Baskerville",
          size: 18,
          weight: "bold",
        },
      },
      tooltip: {
        bodyFont: {
          family: "Lora",
          size: 13,
        },
        titleFont: {
          family: "Lora",
          size: 13,
          weight: "bold",
        },
      },
    },
    scales: {
      y: {
        ticks: {
          color: theme === "dark" ? "#a3a3a3" : "#525252",
          font: {
            family: "Lora",
            size: 14,
          },
        },
        grid: {
          display: false,
        },
      },
      x: {
        beginAtZero: true,
        ticks: {
          color: theme === "dark" ? "#a3a3a3" : "#525252",
          precision: 0,
          font: {
            family: "Lora",
            size: 14,
          },
        },
        grid: {
          color:
            theme === "dark"
              ? "rgba(64, 64, 64, 0.5)"
              : "rgba(229, 229, 229, 0.5)",
        },
      },
    },
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
 ui-futuristic-enhancements
        <h1 className="text-2xl md:text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-primary-500 to-indigo-500">
          Insights
        </h1>
        
        <div className="inline-flex rounded-md shadow-sm border border-neutral-300 dark:border-neutral-700 overflow-hidden" role="group">
          <button
            onClick={() => setTimeRange('week')}
            className={`px-4 py-2 text-sm font-medium transition-all duration-200 ${
              timeRange === 'week'
                ? 'bg-primary-600 text-white shadow-inner'
                : 'bg-white dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-700'
            } rounded-l-md border-r border-neutral-300 dark:border-neutral-700`}

          >
            This Week
          </button>
          <button
ui-futuristic-enhancements
            onClick={() => setTimeRange('month')}
            className={`px-4 py-2 text-sm font-medium transition-all duration-200 ${
              timeRange === 'month'
                ? 'bg-primary-600 text-white  shadow-inner'
                : 'bg-white dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-700'
            } border-r border-neutral-300 dark:border-neutral-700`}

          >
            This Month
          </button>
          <button
 ui-futuristic-enhancements
            onClick={() => setTimeRange('all')}
            className={`px-4 py-2 text-sm font-medium transition-all duration-200 ${
              timeRange === 'all'
                ? 'bg-primary-600 text-white shadow-inner'
                : 'bg-white dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-700'

            }`}
          >
            All Time
          </button>
        </div>
      </div>

      {filteredEntries.length === 0 ? (
 ui-futuristic-enhancements
        <div className="card p-8 text-center bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-700 rounded-xl shadow-sm">
          <h2 className="text-lg font-semibold text-neutral-800 dark:text-white mb-2">
            No data available

          </h2>
          <p className="font-lora text-neutral-600 dark:text-neutral-400">
            There are no journal entries for the selected time period.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="card p-4 h-[300px] bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-700 rounded-xl shadow-md hover:shadow-lg transition-shadow duration-300">
            {moodData && <Pie data={moodData} options={pieOptions} />}
          </div>
 ui-futuristic-enhancements
          
          <div className="card p-4 h-[300px] bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-700 rounded-xl shadow-md hover:shadow-lg transition-shadow duration-300">

            {activityData ? (
              <Bar data={activityData} options={barOptions} />
            ) : (
              <div className="h-full flex items-center justify-center">
                <p className="text-neutral-500 dark:text-neutral-400">
                  No activity data available
                </p>
              </div>
            )}
          </div>

          <div className="card p-6 lg:col-span-2">
 ui-futuristic-enhancements
            <h2 className="text-lg font-semibold text-neutral-800 dark:text-white mb-4">Journal Stats</h2>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="p-4 bg-primary-50 dark:bg-primary-900/20 rounded-lg shadow-sm hover:shadow-md transition-shadow duration-300">
                <div className="text-sm text-neutral-600 dark:text-neutral-400">Total Entries</div>
                <div className="text-3xl font-bold text-primary-700 dark:text-primary-400">{filteredEntries.length}</div>
              </div>
              
              <div className="p-4 bg-secondary-50 dark:bg-secondary-900/20 rounded-lg shadow-sm hover:shadow-md transition-shadow duration-300">
                <div className="text-sm text-neutral-600 dark:text-neutral-400">Average Mood</div>
                <div className="text-3xl font-bold text-secondary-700 dark:text-secondary-400">
                  {filteredEntries.some(e => e.mood) 

                    ? (() => {
                        const moodScore = {
                          great: 5,
                          good: 4,
                          okay: 3,
                          bad: 2,
                          awful: 1,
                        };
                        const entriesWithMood = filteredEntries.filter(
                          (e) => e.mood
                        );
                        const average =
                          entriesWithMood.reduce(
                            (sum, entry) => sum + moodScore[entry.mood],
                            0
                          ) / entriesWithMood.length;

                        if (average >= 4.5) return "Great";
                        if (average >= 3.5) return "Good";
                        if (average >= 2.5) return "Okay";
                        if (average >= 1.5) return "Bad";
                        return "Awful";
                      })()
                    : "N/A"}
                </div>
              </div>
 ui-futuristic-enhancements
              
              <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg shadow-sm hover:shadow-md transition-shadow duration-300">
                <div className="text-sm text-neutral-600 dark:text-neutral-400">Most Common Mood</div>
                <div className="text-3xl font-bold text-green-700 dark:text-green-400">
                  {filteredEntries.some(e => e.mood)

                    ? (() => {
                        const moodCounts = filteredEntries.reduce(
                          (acc, entry) => {
                            if (entry.mood) {
                              acc[entry.mood] = (acc[entry.mood] || 0) + 1;
                            }
                            return acc;
                          },
                          {}
                        );

                        return (
                          Object.entries(moodCounts)
                            .sort((a, b) => b[1] - a[1])[0][0]
                            .charAt(0)
                            .toUpperCase() +
                          Object.entries(moodCounts)
                            .sort((a, b) => b[1] - a[1])[0][0]
                            .slice(1)
                        );
                      })()
                    : "N/A"}
                </div>
              </div>
ui-futuristic-enhancements
              
              <div className="p-4 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg shadow-sm hover:shadow-md transition-shadow duration-300">
                <div className="text-sm text-neutral-600 dark:text-neutral-400">Most Active Day</div>
                <div className="text-3xl font-bold text-yellow-700 dark:text-yellow-400">

                  {filteredEntries.length > 0
                    ? (() => {
                        const dayCounts = filteredEntries.reduce(
                          (acc, entry) => {
                            const day = format(
                              parseISO(entry.createdAt),
                              "EEEE"
                            );
                            acc[day] = (acc[day] || 0) + 1;
                            return acc;
                          },
                          {}
                        );

                        return Object.entries(dayCounts).sort(
                          (a, b) => b[1] - a[1]
                        )[0][0];
                      })()
                    : "N/A"}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Stats;
