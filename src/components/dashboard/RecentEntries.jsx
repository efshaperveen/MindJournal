import { Link } from "react-router-dom";
import { useJournal } from "../../contexts/JournalContext";
import { format } from "date-fns";
import MoodIcon from "../journal/MoodIcon";


const RecentEntries = () => {
  const { entries, privateEntryIds } = useJournal();
  const publicEntries = entries.filter(
    (entry) => !privateEntryIds.includes(entry.id)
  );
  const recentEntries = publicEntries.slice(0, 6);

  if (publicEntries.length === 0) {
    return (
      <div className="relative overflow-hidden bg-gradient-to-br from-neutral-50/80 via-white to-neutral-100/80 dark:from-neutral-900/80 dark:via-neutral-800 dark:to-neutral-850/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-neutral-200/50 dark:border-neutral-700/30">
        {/* Glassmorphism overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-white/5 dark:from-black/10 dark:to-black/5 backdrop-blur-sm rounded-2xl" />
        
        {/* Header with icon */}
        <div className="relative z-10 flex items-center gap-3 mb-6">
          <div className="w-8 h-8 bg-gradient-to-br from-primary-400 to-primary-600 rounded-lg flex items-center justify-center shadow-sm">
            <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 24 24">
              <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-5 14H7v-2h7v2zm3-4H7v-2h10v2zm0-4H7V7h10v2z"/>
            </svg>
          </div>
          <h2 className="text-xl font-lora font-semibold bg-gradient-to-r from-neutral-800 via-neutral-900 to-neutral-800 dark:from-neutral-100 dark:via-neutral-50 dark:to-neutral-100 bg-clip-text text-transparent">
            Recent Entries
          </h2>
        </div>

        {/* Empty state */}
        <div className="relative z-10 text-center py-12">
          <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-neutral-200 to-neutral-300 dark:from-neutral-700 dark:to-neutral-600 rounded-2xl flex items-center justify-center">
            <svg className="w-8 h-8 text-neutral-400 dark:text-neutral-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
            </svg>
          </div>
          <p className="font-lora text-neutral-500 dark:text-neutral-400 mb-6 text-lg">
            No journal entries yet.
          </p>
          <Link
            to="/journal/new"
            className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-primary-500 to-primary-600 hover:from-primary-600 hover:to-primary-700 text-white font-medium rounded-xl shadow-lg hover:shadow-xl transform transition-all duration-300 hover:scale-105 hover:-translate-y-1 font-lora"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Create your first entry!
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="relative overflow-hidden bg-gradient-to-br from-neutral-50/80 via-white to-neutral-100/80 dark:from-neutral-900/80 dark:via-neutral-800 dark:to-neutral-850/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-neutral-200/50 dark:border-neutral-700/30 group">
      {/* Glassmorphism overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-white/5 dark:from-black/10 dark:to-black/5 backdrop-blur-sm rounded-2xl" />
      
      {/* Animated background on hover */}
      <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700 bg-gradient-to-r from-primary-50/20 via-transparent to-primary-100/20 dark:from-primary-900/10 dark:via-transparent dark:to-primary-800/10 rounded-2xl" />

      {/* Header */}
      <div className="relative z-10 flex justify-between items-center mb-6">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-gradient-to-br from-primary-400 to-primary-600 rounded-lg flex items-center justify-center shadow-sm transform transition-transform duration-300 group-hover:scale-110 group-hover:rotate-6 group-hover:text-primary-500">
            <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 24 24">
              <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-5 14H7v-2h7v2zm3-4H7v-2h10v2zm0-4H7V7h10v2z"/>
            </svg>
          </div>
          <h2 className="text-xl font-lora font-semibold bg-gradient-to-r from-neutral-800 via-neutral-900 to-neutral-800 dark:from-neutral-100 dark:via-neutral-50 dark:to-neutral-100 bg-clip-text text-transparent">
            Recent Entries
          </h2>
        </div>
        <Link
          to="/journal"
          className="inline-flex items-center gap-1 font-lora font-medium text-sm text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300 px-3 py-1.5 rounded-lg bg-primary-50/50 dark:bg-primary-900/20 hover:bg-primary-100/70 dark:hover:bg-primary-900/40 transition-all duration-200 hover:scale-105"
        >
          View all
          <svg className="w-3 h-3 transform transition-transform duration-200 group-hover:translate-x-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </Link>
      </div>

      {/* Responsive Grid */}
      <div className="relative z-10 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mb-6">
        {recentEntries.map((entry, index) => (
          <EntryCard key={entry.id} entry={entry} index={index} />
        ))}
      </div>

      {/* New Entry Button */}
      <div className="relative z-10">
        <Link 
          to="/journal/new" 
          className="w-full inline-flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-primary-500 to-primary-600 hover:from-primary-600 hover:to-primary-700 text-white font-medium rounded-xl shadow-lg hover:shadow-xl transform transition-all duration-300 hover:scale-[1.02] hover:-translate-y-1 font-lora group/btn"
        >
          <svg className="w-4 h-4 transform transition-transform duration-200 group-hover/btn:rotate-90 group-hover/btn:scale-110" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          New Journal Entry
        </Link>
      </div>

      {/* Corner decorations */}
      <div className="absolute top-3 left-3 w-2 h-2 bg-primary-200/50 dark:bg-primary-700/30 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      <div className="absolute bottom-3 right-3 w-2 h-2 bg-primary-200/50 dark:bg-primary-700/30 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300 delay-100" />
    </div>
  );
};


// Enhanced mood-based hover styles with more modern effects
const getMoodHover = (mood) => {
  switch (mood) {
    case "great":
      return "hover:border-emerald-400/60 hover:shadow-emerald-200/40 dark:hover:shadow-emerald-900/20 hover:bg-emerald-50/30 dark:hover:bg-emerald-950/20";
    case "good":
      return "hover:border-blue-400/60 hover:shadow-blue-200/40 dark:hover:shadow-blue-900/20 hover:bg-blue-50/30 dark:hover:bg-blue-950/20";
    case "okay":
      return "hover:border-slate-400/60 hover:shadow-slate-200/40 dark:hover:shadow-slate-900/20 hover:bg-slate-50/30 dark:hover:bg-slate-950/20";
    case "bad":
      return "hover:border-amber-400/60 hover:shadow-amber-200/40 dark:hover:shadow-amber-900/20 hover:bg-amber-50/30 dark:hover:bg-amber-950/20";
    case "awful":
      return "hover:border-rose-400/60 hover:shadow-rose-200/40 dark:hover:shadow-rose-900/20 hover:bg-rose-50/30 dark:hover:bg-rose-950/20";
    default:
      return "hover:border-neutral-400/60 hover:shadow-neutral-200/40 dark:hover:shadow-neutral-900/20 hover:bg-neutral-50/30 dark:hover:bg-neutral-950/20";
  }
};


// Enhanced Entry Card Component
const EntryCard = ({ entry, index }) => {
  return (
    <Link
      to={`/journal/${entry.id}`}
      className={`
        group/card relative overflow-hidden
        rounded-xl border border-neutral-200/60 dark:border-neutral-700/40 
        p-4 bg-gradient-to-br from-white/80 to-neutral-50/60 
        dark:from-neutral-800/80 dark:to-neutral-850/60 
        backdrop-blur-sm shadow-sm 
        transition-all duration-300 
       transform transition-all duration-300
  hover:scale-125 hover:rotate-12 hover:text-primary-600 dark:hover:text-primary-400
        ${getMoodHover(entry.mood)}
      `}
      style={{ 
        animationDelay: `${index * 100}ms`,
      }}
    >
      {/* Card glassmorphism overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent dark:from-black/5 dark:to-transparent backdrop-blur-sm rounded-xl opacity-0 group-hover/card:opacity-100 transition-opacity duration-300" />
      
      {/* Mood indicator line */}
      <div className={`absolute top-0 left-0 right-0 h-0.5 ${getMoodColor(entry.mood)} transform scale-x-0 group-hover/card:scale-x-100 transition-transform duration-500 origin-left`} />

      {/* Date & Mood */}
      <div className="relative z-10 flex items-center justify-between mb-3">
        <p className="text-xs text-neutral-500 dark:text-neutral-400 font-medium bg-neutral-100/50 dark:bg-neutral-700/30 px-2 py-1 rounded-md backdrop-blur-sm">
          {format(new Date(entry.createdAt), "MMM d, yyyy")}
        </p>
        <div className="transform transition-all duration-300 group-hover/card:scale-125 group-hover/card:rotate-12 group-hover/card:text-primary-600 dark:group-hover/card:text-primary-400">
          <MoodIcon mood={entry.mood} />
        </div>
      </div>

      {/* Title */}
      <h3 className="relative z-10 font-libre-baskerville text-neutral-800 dark:text-neutral-100 font-medium text-base mb-2 truncate group-hover/card:text-neutral-900 dark:group-hover/card:text-white transition-colors duration-200">
        {entry.title || "Untitled Entry"}
      </h3>

      {/* Preview */}
      <p className="relative z-10 font-lora text-sm text-neutral-600 dark:text-neutral-300 line-clamp-2 leading-relaxed group-hover/card:text-neutral-700 dark:group-hover/card:text-neutral-200 transition-colors duration-200">
        {entry.content || "No content available"}
      </p>

      {/* Subtle corner accent */}
      <div className="absolute bottom-2 right-2 w-1 h-1 bg-primary-300/60 dark:bg-primary-600/40 rounded-full opacity-0 group-hover/card:opacity-100 transition-opacity duration-300 delay-100" />
    </Link>
  );
};


// Helper function for mood colors
const getMoodColor = (mood) => {
  switch (mood) {
    case "great":
      return "bg-gradient-to-r from-emerald-400 to-emerald-500";
    case "good":
      return "bg-gradient-to-r from-blue-400 to-blue-500";
    case "okay":
      return "bg-gradient-to-r from-slate-400 to-slate-500";
    case "bad":
      return "bg-gradient-to-r from-amber-400 to-amber-500";
    case "awful":
      return "bg-gradient-to-r from-rose-400 to-rose-500";
    default:
      return "bg-gradient-to-r from-neutral-400 to-neutral-500";
  }
};

export default RecentEntries;

/* 
Ensure these CSS animations are added globally:

@keyframes fade-in-up {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.animate-fade-in-up {
  animation: fade-in-up 0.6s ease-out forwards;
}
*/
