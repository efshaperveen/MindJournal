import { useEffect, useState } from "react";
import { useJournal } from "../../contexts/JournalContext";
import { useTheme } from "../../contexts/ThemeContext";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const MoodChart = () => {
  const { entries } = useJournal();
  const { theme } = useTheme();
  const [chartData, setChartData] = useState(null);

  useEffect(() => {
    if (entries.length === 0) return;

    // Calculate mood frequencies
    const moodCounts = {
      great: 0,
      good: 0,
      okay: 0,
      bad: 0,
      awful: 0,
    };

    entries.forEach((entry) => {
      if (entry.mood) {
        moodCounts[entry.mood]++;
      }
    });

    const labels = ["Great", "Good", "Okay", "Bad", "Awful"];
    const data = [
      moodCounts.great,
      moodCounts.good,
      moodCounts.okay,
      moodCounts.bad,
      moodCounts.awful,
    ];

    // Set colors based on theme
    const backgroundColor =
      theme === "dark"
        ? [
            "rgba(34, 197, 94, 0.6)",
            "rgba(59, 130, 246, 0.6)",
            "rgba(234, 179, 8, 0.6)",
            "rgba(249, 115, 22, 0.6)",
            "rgba(239, 68, 68, 0.6)",
          ]
        : [
            "rgba(34, 197, 94, 0.8)",
            "rgba(59, 130, 246, 0.8)",
            "rgba(234, 179, 8, 0.8)",
            "rgba(249, 115, 22, 0.8)",
            "rgba(239, 68, 68, 0.8)",
          ];

    const borderColor =
      theme === "dark"
        ? [
            "rgba(34, 197, 94, 1)",
            "rgba(59, 130, 246, 1)",
            "rgba(234, 179, 8, 1)",
            "rgba(249, 115, 22, 1)",
            "rgba(239, 68, 68, 1)",
          ]
        : [
            "rgba(22, 163, 74, 1)",
            "rgba(37, 99, 235, 1)",
            "rgba(202, 138, 4, 1)",
            "rgba(234, 88, 12, 1)",
            "rgba(220, 38, 38, 1)",
          ];

    setChartData({
      labels,
      datasets: [
        {
          label: "Mood Distribution",
          data,
          backgroundColor,
          borderColor,
          borderWidth: 1,
          borderRadius: 4,
        },
      ],
    });
  }, [entries, theme]);

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
      title: {
        display: true,
        text: "Mood Distribution",
        color: theme === "dark" ? "#e5e5e5" : "#262626",
        font: {
          family: "Lora",
          size: 20,
          weight: "bold",
        },
      },
      tooltip: {
        backgroundColor: theme === "dark" ? "#262626" : "#ffffff",
        titleColor: theme === "dark" ? "#e5e5e5" : "#262626",
        bodyColor: theme === "dark" ? "#e5e5e5" : "#525252",
        borderColor: theme === "dark" ? "#404040" : "#e5e5e5",
        borderWidth: 1,
        padding: 10,
        cornerRadius: 8,
        displayColors: true,
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        grid: {
          color:
            theme === "dark"
              ? "rgba(64, 64, 64, 0.5)"
              : "rgba(229, 229, 229, 0.5)",
        },
        ticks: {
          color: theme === "dark" ? "#a3a3a3" : "#525252",
          stepSize: 1,
          font: {
            family: "Lora",
            size: 14,
          },
        },
      },
      x: {
        grid: {
          display: false,
        },
        ticks: {
          color: theme === "dark" ? "#a3a3a3" : "#525252",
          font: {
            family: "Lora",
            size: 14,
          },
        },
      },
    },
  };

  if (!chartData) {
    return (
      <div className="card p-4 h-[300px] flex items-center justify-center">
        <p className="font-lora text-neutral-500 dark:text-neutral-400">
          Not enough data to display mood chart!
        </p>
      </div>
    );
  }

  return (
    <div className="card p-4 h-[300px]">
      <Bar data={chartData} options={options} />
    </div>
  );
};

export default MoodChart;
