import { Link } from "react-router-dom";
import { format } from "date-fns";
import { useJournal } from "../../contexts/JournalContext";
import MoodIcon from "../journal/MoodIcon";
import { FiPlus, FiBook } from "react-icons/fi";

const RecentEntries = () => {
  const { entries } = useJournal();

  const recentEntries = entries.slice(0, 6);

  if (entries.length === 0) {
    return (
      <div className="glass-card p-6 rounded-2xl border-gradient">
        <div className="flex items-center space-x-3 mb-4">
          <div className="w-8 h-8 bg-gradient-primary rounded-lg flex items-center justify-center">
            <FiBook className="w-4 h-4 text-white" />
          </div>
          <h2 className="text-lg font-semibold text-neutral-700 dark:text-neutral-200">Recent Entries</h2>
        </div>
        <div className="text-center py-8">
          <div className="w-16 h-16 bg-neutral-200 dark:bg-neutral-700 rounded-full flex items-center justify-center mx-auto mb-4">
            <FiBook className="w-8 h-8 text-neutral-400" />
          </div>
          <p className="text-neutral-500 dark:text-neutral-400 mb-4">
            No journal entries yet.
          </p>
          <Link
            to="/journal/new"
            className="btn btn-primary inline-flex items-center space-x-2"
          >
            <FiPlus size={16} />
            <span>Create your first entry!</span>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="glass-card p-6 rounded-2xl border-gradient">
      {/* Header */}
      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 bg-gradient-primary rounded-lg flex items-center justify-center">
            <FiBook className="w-4 h-4 text-white" />
          </div>
          <h2 className="text-lg font-semibold text-neutral-700 dark:text-neutral-200">Recent Entries</h2>
        </div>
        <Link
          to="/journal"
          className="text-sm text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300 font-medium transition-colors"
        >
          View all
        </Link>
      </div>

      {/* Responsive Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {recentEntries.map((entry) => (
          <EntryCard key={entry.id} entry={entry} />
        ))}
      </div>

      {/* New Entry Button */}
      <div className="mt-6">
        <Link to="/journal/new" className="btn btn-primary w-full flex items-center justify-center space-x-2">
          <FiPlus size={16} />
          <span>New Journal Entry</span>
        </Link>
      </div>
    </div>
  );
};

// Mood-based hover styles
const getMoodHover = (mood) => {
  switch (mood) {
    case "great":
      return "hover:border-success-400 hover:shadow-success-300/40";
    case "good":
      return "hover:border-primary-400 hover:shadow-primary-300/40";
    case "okay":
      return "hover:border-warning-400 hover:shadow-warning-300/40";
    case "bad":
      return "hover:border-accent-400 hover:shadow-accent-300/40";
    case "awful":
      return "hover:border-error-400 hover:shadow-error-300/40";
    default:
      return "hover:border-neutral-400 hover:shadow-neutral-300/40";
  }
};

// Reusable Card Component
const EntryCard = ({ entry }) => {
  return (
    <Link
      to={`/journal/${entry.id}`}
      className={`group rounded-xl border border-neutral-200/50 dark:border-neutral-700/50 p-4 bg-white/50 dark:bg-neutral-800/50 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg ${getMoodHover(
        entry.mood
      )}`}
    >
      {/* Date & Mood */}
      <div className="flex items-center justify-between mb-2">
        <p className="text-xs text-neutral-500 dark:text-neutral-400">
          {format(new Date(entry.createdAt), "PPP")}
        </p>
        <div className="transform transition-transform duration-200 group-hover:scale-110">
          <MoodIcon mood={entry.mood} />
        </div>
      </div>

      {/* Title */}
      <h3 className="font-semibold text-neutral-700 dark:text-neutral-200 text-lg truncate">
        {entry.title || "Untitled Entry"}
      </h3>

      {/* Preview */}
      <p className="text-sm text-neutral-500 dark:text-neutral-400 mt-1 line-clamp-2">
        {entry.content || "No content available"}
      </p>
    </Link>
  );
};

export default RecentEntries;
