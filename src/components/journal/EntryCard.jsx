import { Link } from 'react-router-dom'
import { format } from 'date-fns'
import { FiEdit2, FiTrash2 } from 'react-icons/fi'
import MoodIcon from './MoodIcon'

const EntryCard = ({ entry, onDelete }) => {
  const { id, title, content, mood, createdAt, images } = entry
  
  const formattedDate = format(new Date(createdAt), 'PPP')
  
  const truncatedContent = content.length > 150 
    ? `${content.substring(0, 150)}...` 
    : content

  return (
    <div className="card overflow-hidden hover:shadow-md transition-shadow duration-200">
      <div className="p-4">
        <div className="flex justify-between items-start mb-2">
          <h3 className="font-medium text-lg text-neutral-800 dark:text-white">{title}</h3>
          <MoodIcon mood={mood} size={20} />
        </div>

        <p className="text-sm text-neutral-500 dark:text-neutral-400 mb-1">
          {formattedDate}
        </p>

        {/* Show number of image attachments if they exist */}
        {images && images.length > 0 && (
          <p className="text-sm text-neutral-500 dark:text-neutral-400 mb-3">
            📎 {images.length} attachment{images.length > 1 ? 's' : ''}
          </p>
        )}

        <p className="text-neutral-700 dark:text-neutral-300 mb-4 whitespace-pre-line">
          {truncatedContent}
        </p>

        <div className="flex justify-between items-center pt-2 border-t border-neutral-200 dark:border-neutral-700">
          <Link 
            to={`/journal/${id}`}
            className="text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300 text-sm font-medium"
          >
            Read more
          </Link>

          <div className="flex space-x-2">
            <Link
              to={`/journal/${id}/edit`}
              className="p-1.5 rounded-full text-neutral-600 hover:text-primary-600 dark:text-neutral-400 dark:hover:text-primary-400 hover:bg-neutral-100 dark:hover:bg-neutral-700"
              aria-label="Edit entry"
            >
              <FiEdit2 size={16} />
            </Link>

            <button
              onClick={() => onDelete(id)}
              className="p-1.5 rounded-full text-neutral-600 hover:text-red-600 dark:text-neutral-400 dark:hover:text-red-400 hover:bg-neutral-100 dark:hover:bg-neutral-700"
              aria-label="Delete entry"
            >
              <FiTrash2 size={16} />
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default EntryCard
