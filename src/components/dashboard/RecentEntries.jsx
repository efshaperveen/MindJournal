import { Link } from "react-router-dom";
import { useJournal } from "../../contexts/JournalContext";
import { format } from "date-fns";
import MoodIcon from "../journal/MoodIcon";

const RecentEntries = () => {
  const { entries, privateEntryIds } = useJournal();

  // Get the 5 most recent public entries
  const recentEntries = entries
    .filter(entry => !privateEntryIds.includes(entry.id))
    .slice(0, 5);

  if (entries.filter(entry => !privateEntryIds.includes(entry.id)).length === 0) {
    return (
      <div className="card p-4">
        <h2 className="text-lg font-medium mb-4">Recent Entries</h2>
        <div className="text-center py-8">
          <p className="font-lora text-[16px] text-neutral-500 dark:text-neutral-400 mb-4">
            No journal entries yet.
          </p>
          <Link
            to="/journal/new"
            className="btn btn-primary inline-block font-lora text-[15px]"
          >
            Create your first entry!
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="card">
      <div className="flex justify-between items-center px-4 pt-4 pb-2">
        <h2 className="text-lg text-xl font-lora font-semibold">
          Recent Entries
        </h2>
        <Link
          to="/journal"
          className="font-lora font-medium text-sm text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300"
        >
          View all
        </Link>
      </div>

      <div className="divide-y divide-neutral-200 dark:divide-neutral-700">
        {recentEntries.map((entry) => (
          <Link
            key={entry.id}
            to={`/journal/${entry.id}`}
            className="block px-4 py-3 hover:bg-neutral-50 dark:hover:bg-neutral-700 transition-colors"
          >
            <div className="flex justify-between">
              <h3 className="font-libre-baskerville font-medium text-neutral-800 dark:text-neutral-100 mb-1 truncate pr-4">
                {entry.title}
              </h3>
              <MoodIcon mood={entry.mood} />
            </div>
            <p className="font-lora text-sm text-neutral-500 dark:text-neutral-300 mb-1">
              {format(new Date(entry.createdAt), "PPP")}
            </p>
            <p className="font-lora font-medium text-neutral-600 dark:text-neutral-200 text-sm line-clamp-1">
              {entry.content}
            </p>
          </Link>
        ))}
      </div>

      {entries.length > 0 && (
        <div className="p-4 border-t border-neutral-200 dark:border-neutral-700">
          <Link
            to="/journal/new"
            className="font-lora font-light btn btn-primary w-full"
          >
            New Journal Entry
          </Link>
        </div>
      )}
    </div>
  );
};

export default RecentEntries;
