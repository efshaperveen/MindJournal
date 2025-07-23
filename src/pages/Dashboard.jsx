import { useJournal } from "../contexts/JournalContext";
import { useAuth } from "../contexts/AuthContext";
import RecentEntries from "../components/dashboard/RecentEntries";
import MoodTracker from "../components/dashboard/MoodTracker";
import MoodChart from "../components/dashboard/MoodChart";
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
    <div className="space-y-6 animate-fadeIn">
      <div>
        <h1 className="text-2xl md:text-3xl font-bold text-neutral-900 dark:text-white">
          Welcome, {user.name}
        </h1>
        <p className="text-neutral-600 dark:text-neutral-400 mt-1">
          {currentDate}
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="card p-6 bg-gradient-to-br from-primary-500 to-primary-600 text-white">
          <h2 className="text-xl font-semibold mb-2">Your Journall Status</h2>
          <div className="flex flex-col space-y-1">
            <div className="flex justify-between">
              <span>Total entries:</span>
              <span className="font-semibold">{entries.length}</span>
            </div>
            <div className="flex justify-between">
              <span>Last 30 days:</span>
              <span className="font-semibold">{recentEntriesCount}</span>
            </div>
            <div className="flex justify-between">
              <span>Entry today:</span>
              <span className="font-semibold">
                {hasEntryToday ? "Yes" : "No"}
              </span>
            </div>
          </div>
        </div>

        <MoodTracker />
      </div>

      <MoodChart />

      <RecentEntries />
    </div>
  );
};

export default Dashboard;
