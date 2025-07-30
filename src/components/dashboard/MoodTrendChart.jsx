import React, { useState, useMemo, useEffect } from "react";
import { useJournal } from "../../contexts/JournalContext";
import MoodIcon from "../journal/MoodIcon"; // Import the MoodIcon component
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Area, // Import Area for the filled chart
  // Removed Defs and Stop from here as they are not direct named exports
} from "recharts";
import {
  format,
  parseISO,
  startOfDay,
  endOfDay,
  startOfMonth,
  endOfMonth,
  startOfYear,
  endOfYear,
  getHours,
  addDays,
  addMonths,
  addYears,
  eachHourOfInterval,
  eachDayOfInterval,
  eachMonthOfInterval,
} from "date-fns";

// Mood to number mapping
const moodToNumeric = {
  awful: 1,
  bad: 2,
  okay: 3,
  good: 4,
  great: 5,
};

// Custom Tooltip Component for Recharts
const CustomTooltip = ({ active, payload, label, currentView }) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload; // The entire data object for the point
    let formattedLabel = label;

    // Adjust label formatting based on view for the tooltip
    if (currentView === "day") {
      formattedLabel = `Hour ${label}:00`;
    } else if (currentView === "year") {
      formattedLabel = format(parseISO(data.originalDate), "MMMM yyyy");
    }

    // Reverse map numeric mood back to string for display
    const numericToMood = Object.fromEntries(
      Object.entries(moodToNumeric).map(([k, v]) => [v, k])
    );

    // Get the mood string, rounding the average mood to the nearest integer
    const roundedAverageMood = Math.round(data.averageMood);
    const moodString = numericToMood[roundedAverageMood] || "N/A";

    return (
      <div className="bg-white dark:bg-neutral-800 p-3 rounded-lg shadow-lg border border-neutral-200 dark:border-neutral-700 text-sm">
        <p className="font-semibold text-neutral-900 dark:text-white">
          {formattedLabel}
        </p>
        <p className="text-neutral-700 dark:text-neutral-300 flex items-center gap-2">
          {/* FIX: Wrap the text and the conditional rendering in a fragment */}
          <>
            Mood:
            {/* Render MoodIcon based on the rounded average mood, wrapped in parentheses */}
            {moodString !== "N/A" ? (
              <span className="flex items-center gap-1">
                <MoodIcon mood={moodString} size={18} />
                <span className={`text-${moodString} font-semibold`}>
                  {moodString}
                </span>
              </span>
            ) : (
              <span className="text-neutral-500">N/A</span>
            )}
          </>
        </p>
        {data.entryCount > 0 && (
          <p className="text-neutral-600 dark:text-neutral-400">
            Entries: {data.entryCount}
          </p>
        )}
      </div>
    );
  }
  return null;
};

const MoodTrendChart = () => {
  const { entries } = useJournal(); // Access journal entries from context
  const [currentView, setCurrentView] = useState("month"); // State for selected view (day, month, year)
  const [currentDateRange, setCurrentDateRange] = useState(new Date()); // State for the date context of the chart

  // Memoized function to process journal entries into chart-friendly data
  const processedMoodData = useMemo(() => {
    // Return empty array if no entries exist
    if (!entries || entries.length === 0) return [];

    // Map raw entries to include parsed dates and numeric mood values
    const filteredEntries = entries.map((entry) => ({
      ...entry,
      createdAt: parseISO(entry.createdAt), // Convert ISO string to Date object
      numericMood: moodToNumeric[entry.mood] || 0, // Map mood string to numeric value
    }));

    let startDate, endDate, getGroupKey, intervalGenerator, formatNameForChart;

    // Determine date range, grouping logic, interval generation, and label formatting based on currentView
    switch (currentView) {
      case "day":
        startDate = startOfDay(currentDateRange);
        endDate = endOfDay(currentDateRange);
        getGroupKey = (date) => getHours(date); // Group by hour (0-23)
        intervalGenerator = () =>
          eachHourOfInterval({ start: startDate, end: endDate }); // Generate all 24 hours
        formatNameForChart = (date) => getHours(date); // X-axis label is just the hour number
        break;
      case "month":
        startDate = startOfMonth(currentDateRange);
        endDate = endOfMonth(currentDateRange);
        getGroupKey = (date) => format(date, "yyyy-MM-dd"); // Group by full date string (e.g., '2025-07-29')
        intervalGenerator = () =>
          eachDayOfInterval({ start: startDate, end: endDate }); // Generate all days in the month
        formatNameForChart = (date) => format(date, "dd"); // X-axis label is just the day number (e.g., '29')
        break;
      case "year":
        startDate = startOfYear(currentDateRange);
        endDate = endOfYear(currentDateRange);
        getGroupKey = (date) => format(date, "yyyy-MM"); // Group by year-month string (e.g., '2025-07')
        intervalGenerator = () =>
          eachMonthOfInterval({ start: startDate, end: endDate }); // Generate all 12 months
        formatNameForChart = (date) => format(date, "MMM"); // X-axis label is abbreviated month (e.g., 'Jul')
        break;
      default:
        return []; // Should not happen, but a safe fallback
    }

    // Aggregate mood data: sum of numeric moods and count of entries for each group
    const aggregatedMoods = {};
    filteredEntries
      .filter((e) => e.createdAt >= startDate && e.createdAt <= endDate)
      .forEach((entry) => {
        const key = getGroupKey(entry.createdAt);
        if (!aggregatedMoods[key]) aggregatedMoods[key] = { sum: 0, count: 0 };
        aggregatedMoods[key].sum += entry.numericMood;
        aggregatedMoods[key].count++;
      });

    // Create final data array for the chart, filling in null for periods with no entries
    return intervalGenerator().map((date) => {
      const key = getGroupKey(date);
      return {
        name: formatNameForChart(date), // Label for the X-axis
        originalDate: date.toISOString(), // Full date for tooltip or other uses
        averageMood: aggregatedMoods[key]
          ? aggregatedMoods[key].sum / aggregatedMoods[key].count
          : null, // Calculate average, or null if no data
        entryCount: aggregatedMoods[key]?.count || 0,
      };
    });
  }, [entries, currentView, currentDateRange]);
  // Function to navigate the date range (previous/next day/month/year)
  const navigateDateRange = (direction) => {
    if (currentView === "day")
      setCurrentDateRange((prev) => addDays(prev, direction));
    else if (currentView === "month")
      setCurrentDateRange((prev) => addMonths(prev, direction));
    else if (currentView === "year")
      setCurrentDateRange((prev) => addYears(prev, direction));
  };

  // Function to generate the chart title based on current view and date range
  const getChartTitle = () => {
    switch (currentView) {
      case "day":
        return `Mood Trend: ${format(currentDateRange, "EEEE, MMMM d, yyyy")}`;
      case "month":
        return `Mood Trend: ${format(currentDateRange, "MMMM yyyy")}`;
      case "year":
        return `Mood Trend: ${format(currentDateRange, "yyyy")}`;
      default:
        return "Mood Trend";
    }
  };

  // Formatter for Y-axis ticks (converts numeric mood back to string labels)
  const formatYAxisTick = (tick) => {
    const reverseMap = Object.fromEntries(
      Object.entries(moodToNumeric).map(([k, v]) => [v, k])
    );
    return (
      reverseMap[tick]?.charAt(0).toUpperCase() + reverseMap[tick]?.slice(1) ||
      ""
    );
  };

  // Determines the X-axis interval strategy for Recharts to prevent label overlap
  const getXAxisInterval = () => {
    if (currentView === "day") {
      return processedMoodData.length > 12 ? "preserveStart" : 0;
    }
    if (currentView === "month") {
      return processedMoodData.length > 15 ? "preserveStart" : 0;
    }
    if (currentView === "year") {
      return "equidistant";
    }
    return 0;
  };

  return (
    <div className="card p-4 md:p-6 bg-white dark:bg-neutral-800 shadow rounded-lg space-y-4">
      {/* Top section: Chart Title and View Selector (Dropdown/Buttons) */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-4">
        {/* Chart Title - Always on the left */}
        <h2 className="text-lg sm:text-xl font-libre-baskerville font-semibold text-neutral-900 dark:text-white">
          {getChartTitle()}
        </h2>

        {/* Right side: View selector (Dropdown on small, Buttons on medium+) */}
        <div className="flex items-center justify-between sm:justify-end gap-2 w-full sm:w-auto">
          {/* Dropdown for small screens (hidden on sm breakpoint and up) */}
          <select
            value={currentView}
            onChange={(e) => {
              setCurrentView(e.target.value);
              setCurrentDateRange(new Date());
            }}
            className="block sm:hidden w-full max-w-[150px] px-3 py-2 text-sm rounded-md border border-neutral-300 dark:border-neutral-600 bg-neutral-50 dark:bg-neutral-700 text-neutral-900 dark:text-neutral-200 focus:ring-primary-500 focus:border-primary-500 cursor-pointer"
          >
            {["day", "month", "year"].map((view) => (
              <option key={view} value={view}>
                {view.charAt(0).toUpperCase() + view.slice(1)} View
              </option>
            ))}
          </select>

          {/* Buttons for medium and larger screens (hidden on screens smaller than sm breakpoint) */}
          <div className="hidden sm:flex space-x-2">
            {["day", "month", "year"].map((view) => (
              <button
                key={view}
                onClick={() => {
                  setCurrentView(view);
                  setCurrentDateRange(new Date()); // Reset to current period
                }}
                className={`px-3 py-1.5 sm:px-4 sm:py-2 text-xs sm:text-sm rounded-md font-lora font-bold transition
                  ${
                    currentView === view
                      ? "bg-primary-500 text-white shadow"
                      : "bg-neutral-100 dark:bg-neutral-700 text-neutral-700 dark:text-neutral-200 hover:bg-neutral-200 dark:hover:bg-neutral-600"
                  }
                `}
              >
                {view.charAt(0).toUpperCase() + view.slice(1)}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Date Navigation below title on small, right-aligned on larger screens */}
      <div className="flex items-center justify-between gap-2 mb-2 text-sm sm:text-base">
        <button
          onClick={() => navigateDateRange(-1)}
          className="p-2 rounded-full bg-neutral-100 dark:bg-neutral-700 text-neutral-700 dark:text-neutral-200 hover:bg-neutral-200 dark:hover:bg-neutral-600"
          aria-label="Previous"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-4 w-4 sm:h-5 sm:w-5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15 19l-7-7 7-7"
            />
          </svg>
        </button>

        <span className="text-neutral-700 dark:text-neutral-300 font-libre-baskerville font-medium whitespace-nowrap">
          {currentView === "day"
            ? format(currentDateRange, "MMM d, yyyy")
            : currentView === "month"
            ? format(currentDateRange, "MMMM yyyy")
            : format(currentDateRange, "yyyy")}
        </span>

        <button
          onClick={() => navigateDateRange(1)}
          className="p-2 rounded-full bg-neutral-100 dark:bg-neutral-700 text-neutral-700 dark:text-neutral-200 hover:bg-neutral-200 dark:hover:bg-neutral-600"
          aria-label="Next"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-4 w-4 sm:h-5 sm:w-5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 5l7 7-7 7"
            />
          </svg>
        </button>
      </div>

      {/* Chart Area or No Data Message */}
      {processedMoodData.length === 0 ||
      processedMoodData.every((d) => d.averageMood === null) ? (
        <div className="h-64 flex items-center justify-center bg-neutral-50 dark:bg-neutral-700 rounded-md text-neutral-500 dark:text-neutral-400">
          <p className="font-libre-baskerville text-center text-sm sm:text-base">
            No journal entries available for this period.
          </p>
        </div>
      ) : (
        <div className="relative" style={{ paddingTop: "50%" }}>
          {" "}
          {/* Aspect Ratio Box (2:1) */}
          <ResponsiveContainer
            width="100%"
            height="100%"
            className="absolute inset-0"
          >
            <LineChart
              data={processedMoodData}
              margin={{ top: 5, right: 20, left: 10, bottom: 5 }}
            >
              {/* Define gradients for the line and area */}
              <defs>
                <linearGradient
                  id="lineGradient"
                  x1="0%"
                  y1="0%"
                  x2="100%"
                  y2="0%"
                >
                  <stop offset="0%" stopColor="#8884d8" stopOpacity={1} />{" "}
                  {/* Changed Stop to stop */}
                  <stop
                    offset="100%"
                    stopColor="#82ca9d"
                    stopOpacity={1}
                  />{" "}
                  {/* Changed Stop to stop */}
                </linearGradient>
                <linearGradient
                  id="areaGradient"
                  x1="0"
                  y1="0"
                  x2="0"
                  y2="100%"
                >
                  <stop offset="5%" stopColor="#8884d8" stopOpacity={0.8} />
                  <stop offset="95%" stopColor="#8884d8" stopOpacity={0} />
                </linearGradient>
              </defs>

              <CartesianGrid
                strokeDasharray="3 3"
                stroke="#e0e0e0"
                className="dark:stroke-neutral-600"
              />
              <XAxis
                dataKey="name"
                stroke="#6b7280"
                tickLine={false}
                axisLine={false}
                interval={getXAxisInterval()}
                minTickGap={5}
                className="text-xs font-lora sm:text-sm dark:text-neutral-300"
              />
              <YAxis
                domain={[0.8, 5.2]}
                ticks={[1, 2, 3, 4, 5]}
                tickFormatter={formatYAxisTick}
                stroke="#6b7280"
                tickLine={false}
                axisLine={false}
                className="text-xs font-lora sm:text-sm dark:text-neutral-300"
                width={80}
              />
              <Tooltip
                cursor={{ strokeDasharray: "3 3" }}
                content={<CustomTooltip currentView={currentView} />}
              />

              {/* Area component for the filled background */}
              <Area
                type="monotone"
                dataKey="averageMood"
                stroke="url(#lineGradient)"
                fill="url(#areaGradient)"
                strokeWidth={2}
                connectNulls={false}
              />

              {/* Line component on top of the area */}
              <Line
                type="monotone"
                dataKey="averageMood"
                stroke="url(#lineGradient)"
                strokeWidth={3}
                activeDot={{
                  r: 7,
                  fill: "#fff",
                  stroke: "#8884d8",
                  strokeWidth: 2,
                }}
                dot={{ r: 4, fill: "#8884d8", stroke: "#fff", strokeWidth: 1 }}
                connectNulls={false}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  );
};

export default MoodTrendChart;
