import { useJournal } from "../contexts/JournalContext";
import { useAuth } from "../contexts/AuthContext";
import RecentEntries from "../components/dashboard/RecentEntries";
import MoodTracker from "../components/dashboard/MoodTracker";
//import MoodChart from "../components/dashboard/MoodChart";
import MoodTrendChart from "../components/dashboard/MoodTrendChart";
import AffirmationBanner from "../components/dashboard/AffirmationBanner";
import Heatmap from "../components/dashboard/Heatmap";
import { format } from "date-fns";

const Dashboard = () => {
  const { entries } = useJournal();
  const { user } = useAuth();

  // Get current date
  const currentDate = format(new Date(), "EEEE, MMMM d, yyyy");

  // Count entries in the last 30 days
  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

  const recentEntriesCount = entries.filter(
    (entry) => new Date(entry.createdAt) >= thirtyDaysAgo
  ).length;

  // Check if user created an entry today
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const hasEntryToday = entries.some((entry) => {
    const entryDate = new Date(entry.createdAt);
    entryDate.setHours(0, 0, 0, 0);
    return entryDate.getTime() === today.getTime();
  });

  return (
    <div className="calming-bg min-h-screen space-y-6 animate-fadeIn">
      <div>
        <h1 className="flex items-center gap-2 text-2xl md:text-3xl font-libre-baskerville font-bold text-neutral-900 dark:text-white">
          Welcome, {user.name}
          <span
            className="inline-block animate-wave origin-[70%_70%] hover:scale-110 transition-transform duration-300"
            role="img"
            aria-label="waving hand"
          >
            👋
          </span>
        </h1>
        <p className="font-lora text-[18px] text-neutral-600 dark:text-neutral-400 mt-1">
          {currentDate}
        </p>
      </div>

      <AffirmationBanner />
<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
  <div
  className="
  relative p-6 rounded-2xl backdrop-blur-md
  bg-gradient-to-br
  from-primary-100/90 via-primary-50/90 to-primary-100/90
  shadow-md border border-primary-200/50
  transition-transform duration-300
  hover:scale-[1.02] hover:shadow-lg
"

  >
    <h2 className="font-lora text-xl font-semibold mb-4 text-neutral-900 dark:text-neutral-800">
      Your Journal Status
    </h2>

    <div className="flex flex-col space-y-3">
      <div className="flex justify-between items-center">
        <span className="font-lora font-light text-[18px] text-neutral-700">
          Total entries:
        </span>
        <span className="font-lora font-semibold text-xl text-neutral-900">
          {entries.length}
        </span>
      </div>

      <div className="flex justify-between items-center">
        <span className="font-lora font-light text-[18px] text-neutral-700">
          Last 30 days:
        </span>
        <span className="font-lora font-semibold text-xl text-neutral-900">
          {recentEntriesCount}
        </span>
      </div>

      <div className="flex justify-between items-center">
        <span className="font-lora font-light text-[18px] text-neutral-700">
          Entry today:
        </span>
        <span
          className={`font-lora font-semibold text-xl ${
            hasEntryToday ? "text-green-700" : "text-red-500"
          }`}
        >
          {hasEntryToday ? "Yes" : "No"}
        </span>
      </div>
    </div>

    {/* Gentle white highlight overlay */}
    <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-white/40 to-transparent pointer-events-none" />
  </div>

  <MoodTracker />
</div>





      <MoodTrendChart />

      <Heatmap />

      <RecentEntries />

      {/* Wave animation style */}
      <style jsx>{`
        @keyframes wave {
          0% { transform: rotate(0deg); }
          10% { transform: rotate(14deg); }
          20% { transform: rotate(-8deg); }
          30% { transform: rotate(14deg); }
          40% { transform: rotate(-4deg); }
          50% { transform: rotate(10deg); }
          60% { transform: rotate(0deg); }
          100% { transform: rotate(0deg); }
        }
        .animate-wave {
          animation: wave 2s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
};

export default Dashboard;
