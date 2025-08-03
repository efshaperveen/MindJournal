import { Link, useLocation } from "react-router-dom";
import { format } from "date-fns";
import { FiEdit2, FiTrash2, FiShield, FiUnlock } from "react-icons/fi";
import { useJournal } from "../../contexts/JournalContext";
import MoodIcon from "./MoodIcon";
import { Goal } from "lucide-react";

const EntryCard = ({ entry, onDelete, viewMode }) => {
  const { id, title, content, mood, createdAt, images, micro_goals } = entry;
  const { privateEntryIds, togglePrivacy, requestPinToLock } = useJournal();
  const location = useLocation();
  const isPrivate = privateEntryIds.includes(id);
  const fromVault = location.pathname === '/private-vault';

  const formattedDate = format(new Date(createdAt), "PPP");
  const truncatedContent =
    content.length > 150 ? `${content.substring(0, 150)}...` : content;

  return (
    <div className="ccard overflow-hidden hover:shadow-lg rounded-2xl border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-900 transition-all duration-300">
      <div className="p-4">
        <div className="flex justify-between items-start mb-3">
          <h3 className="font-libre-baskerville font-medium text-lg text-neutral-800 dark:text-white leading-tight">
            {title}
          </h3>
          <MoodIcon mood={mood} size={24} />
        </div>

        <p className="text-xs font-libre-baskerville uppercase tracking-wide text-neutral-400 dark:text-neutral-500 mb-3">
          {formattedDate}
        </p>

        {images?.length > 0 && (
          <p className="text-sm text-neutral-500 dark:text-neutral-400 mb-1">
            📎 {images.length} attachment{images.length > 1 ? "s" : ""}
          </p>
        )}

        {micro_goals?.length > 0 && (
          <p className="text-sm font-libre-baskerville text-neutral-500 dark:text-neutral-400 mb-3">
            <span className="flex items-center gap-2">
              <Goal className="h-4 w-4" />
              {micro_goals.length} Goal{micro_goals.length > 1 ? "s" : ""}
            </span>
          </p>
        )}

        {viewMode === "grid" && (
          <p className="text-[18px] font-lora text-neutral-700 dark:text-neutral-200 leading-relaxed mb-4 whitespace-pre-line">
            {truncatedContent}
          </p>
        )}

        <div className="flex justify-between items-center pt-2 border-t border-neutral-200 dark:border-neutral-700">
          <Link
            to={`/journal/${id}`}
            state={{ from: fromVault ? '/private-vault' : '/journal' }}
            className="text-[14px] font-libre-baskerville font-medium text-primary-600 dark:text-primary-400 hover:text-primary-600 hover:underline transition-colors duration-200 flex items-center space-x-1"
          >
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M9 5l7 7-7 7"
              />
            </svg>
            <span>Read more</span>
          </Link>

          <div className="flex items-center justify-end gap-2 pt-2">
            <button
              onClick={() => (isPrivate ? togglePrivacy(id) : requestPinToLock(id))}
              className="group p-2 rounded-md text-neutral-600 dark:text-neutral-400 hover:bg-primary-50 dark:hover:bg-neutral-700 hover:text-primary-600 dark:hover:text-primary-400 transition-colors duration-200"
              aria-label={isPrivate ? 'Make public' : 'Move to vault'}
            >
              {isPrivate ? (
                <FiUnlock size={16} className="group-hover:scale-110 transition-transform duration-200" />
              ) : (
                <FiShield size={16} className="group-hover:scale-110 transition-transform duration-200" />
              )}
            </button>

            <Link
              to={`/journal/${id}/edit`}
              state={{ from: fromVault ? '/private-vault' : '/journal' }}
              className="group p-2 rounded-md text-neutral-600 dark:text-neutral-400 hover:bg-primary-50 dark:hover:bg-neutral-700 hover:text-primary-600 dark:hover:text-primary-400 transition-colors duration-200"
              aria-label="Edit entry"
            >
              <FiEdit2
                size={16}
                className="group-hover:scale-110 transition-transform duration-200"
              />
            </Link>

            <button
              onClick={() => onDelete(id)}
              className="group p-2 rounded-md text-neutral-600 dark:text-neutral-400 hover:bg-primary-50 dark:hover:bg-neutral-700 hover:text-primary-600 dark:hover:text-primary-400 transition-colors duration-200"
              aria-label="Delete entry"
            >
              <FiTrash2
                size={16}
                className="group-hover:scale-110 transition-transform duration-200"
              />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EntryCard;
