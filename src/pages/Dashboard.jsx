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
      <style jsx>{`
        @keyframes wave {
          0%, 100% { transform: rotate(0deg); }
          10%, 30%, 50%, 70% { transform: rotate(14deg); }
          20%, 40%, 60%, 80% { transform: rotate(-8deg); }
        }
        .wave-animation {
          animation: wave 2.5s ease-in-out infinite;
          transform-origin: 70% 70%;
          display: inline-block;
        }
      `}</style>
      
      <div>
        <h1 className="text-2xl md:text-3xl font-libre-baskerville font-bold text-neutral-900 dark:text-white">
          Welcome, {user.name}
          <span className="ml-2 wave-animation">👋</span>
        </h1>
        <p className="font-lora text-[18px] text-neutral-600 dark:text-neutral-400 mt-1">
          {currentDate}
        </p>
      </div>

      <AffirmationBanner />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="card p-6 bg-gradient-to-br from-primary-500 to-primary-600 text-white">
          <h2 className="font-lora text-xl font-semibold mb-2">
            Your Journal Status
          </h2>
          <div className="flex flex-col space-y-1">
            <div className="flex justify-between">
              <span className="font-lora font-light text-[18px]">
                Total entries:
              </span>
              <span className="font-lora font-semibold text-xl">
                {entries.length}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="font-lora font-light text-[18px]">
                Last 30 days:
              </span>
              <span className="font-lora font-semibold text-xl">
                {recentEntriesCount}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="font-lora font-light text-[18px]">
                Entry today:
              </span>
              <span className="font-lora font-semibold text-xl">
                {hasEntryToday ? "Yes" : "No"}
              </span>
            </div>
          </div>
        </div>

        <MoodTracker />
      </div>

      <MoodTrendChart />

      <Heatmap />

      <RecentEntries />
    </div>
  );
};

export default Dashboard;