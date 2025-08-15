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
      <style>{`
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
          </div>
          
          {/* Floating Stats Cards */}
          <div className="mt-6 md:mt-0 flex space-x-4">
            <div className="glass-card p-4 rounded-xl text-center scale-in-hover">
              <div className="text-2xl font-bold gradient-text">{entries.length}</div>
              <div className="text-xs text-neutral-500 dark:text-neutral-400">Total Entries</div>
            </div>
            <div className="glass-card p-4 rounded-xl text-center scale-in-hover">
              <div className="text-2xl font-bold gradient-text">{recentEntriesCount}</div>
              <div className="text-xs text-neutral-500 dark:text-neutral-400">This Month</div>
            </div>
          </div>
        </div>
      </div>

      {/* Affirmation Banner with Enhanced Styling */}
      <div className="slide-in-up">
        <AffirmationBanner />
      </div>

      {/* Main Dashboard Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Journal Status Card */}
        <div className="lg:col-span-1">
          <div className="glass-card p-6 rounded-2xl h-full border-gradient hover:shadow-glow transition-all duration-500">
            <div className="flex items-center mb-4">
              <div className="w-10 h-10 bg-gradient-primary rounded-xl flex items-center justify-center mr-3">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <h2 className="text-xl font-bold gradient-text">Journal Status</h2>
            </div>
            
            <div className="space-y-4">
              <div className="flex items-center justify-between p-3 bg-white/50 dark:bg-neutral-800/50 rounded-xl">
                <div className="flex items-center">
                  <div className="w-3 h-3 bg-primary-500 rounded-full mr-3"></div>
                  <span className="font-medium text-neutral-700 dark:text-neutral-300">Total Entries</span>
                </div>
                <span className="font-bold text-lg text-primary-600 dark:text-primary-400">{entries.length}</span>
              </div>
              
              <div className="flex items-center justify-between p-3 bg-white/50 dark:bg-neutral-800/50 rounded-xl">
                <div className="flex items-center">
                  <div className="w-3 h-3 bg-secondary-500 rounded-full mr-3"></div>
                  <span className="font-medium text-neutral-700 dark:text-neutral-300">Last 30 Days</span>
                </div>
                <span className="font-bold text-lg text-secondary-600 dark:text-secondary-400">{recentEntriesCount}</span>
              </div>
              
              <div className="flex items-center justify-between p-3 bg-white/50 dark:bg-neutral-800/50 rounded-xl">
                <div className="flex items-center">
                  <div className={`w-3 h-3 rounded-full mr-3 ${hasEntryToday ? 'bg-success-500' : 'bg-warning-500'}`}></div>
                  <span className="font-medium text-neutral-700 dark:text-neutral-300">Today's Entry</span>
                </div>
                <span className={`font-bold text-lg ${hasEntryToday ? 'text-success-600 dark:text-success-400' : 'text-warning-600 dark:text-warning-400'}`}>
                  {hasEntryToday ? "✓ Done" : "Pending"}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Mood Tracker */}
        <div className="lg:col-span-2">
          <div className="slide-in-right">
            <MoodTracker />
          </div>
        </div>
      </div>

      {/* Mood Trend Chart */}
      <div className="slide-in-up">
        <MoodTrendChart />
      </div>

      {/* Heatmap and Recent Entries Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="slide-in-left">
          <Heatmap />
        </div>
        <div className="slide-in-right">
          <RecentEntries />
        </div>
      </div>


    </div>
  );
};

export default Dashboard;