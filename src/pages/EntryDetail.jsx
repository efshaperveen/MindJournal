import { useParams, useNavigate } from 'react-router-dom'
import { useJournal } from '../contexts/JournalContext'
import { format } from 'date-fns'
import { FiArrowLeft, FiEdit2, FiTrash2 } from 'react-icons/fi'
import MoodIcon, { getMoodColor } from '../components/journal/MoodIcon'

const EntryDetail = () => {
  const { id } = useParams()
  const { getEntry, deleteEntry } = useJournal()
  const navigate = useNavigate()
  
  const entry = getEntry(id)
  
  if (!entry) {
    return (
      <div className="max-w-2xl mx-auto text-center py-12">
        <h1 className="text-2xl font-bold text-neutral-900 dark:text-white mb-4">
          Entry Not Found
        </h1>
        <p className="text-neutral-600 dark:text-neutral-400 mb-6">
          The journal entry you are looking for does not exist or has been deleted.
        </p>
        <button 
          onClick={() => navigate('/journal')}
          className="btn btn-primary"
        >
          Back to Journal
        </button>
      </div>
    )
  }
  
  const formattedDate = format(new Date(entry.createdAt), 'EEEE, MMMM d, yyyy')
  const formattedTime = format(new Date(entry.createdAt), 'h:mm a')
  
  const handleDelete = () => {
    if (window.confirm('Are you sure you want to delete this entry? This action cannot be undone.')) {
      deleteEntry(id)
      navigate('/journal')
    }
  }
  
  return (
    <div className="max-w-2xl mx-auto animate-fadeIn">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <div className="flex items-center">
          <button 
            onClick={() => navigate('/journal')}
            className="mr-4 p-2 rounded-full bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-300 hover:bg-neutral-200 dark:hover:bg-neutral-700 transition-colors"
            aria-label="Back to journal"
          >
            <FiArrowLeft size={18} />
          </button>
          <h1 className="text-2xl font-bold text-neutral-900 dark:text-white truncate">
            {entry.title}
          </h1>
        </div>
        
        <div className="flex space-x-2">
          <button
            onClick={() => navigate(`/journal/${id}/edit`)}
            className="btn btn-outline flex items-center space-x-2"
          >
            <FiEdit2 size={18} />
            <span>Edit</span>
          </button>
          
          <button
            onClick={handleDelete}
            className="btn text-red-600 dark:text-red-400 border border-red-200 dark:border-red-800 hover:bg-red-50 dark:hover:bg-red-900/20"
          >
            <FiTrash2 size={18} />
          </button>
        </div>
      </div>
      
      <div className="card">
        <div className="p-6">
          <div className="flex justify-between items-start mb-6">
            <div>
              <div className="text-neutral-600 dark:text-neutral-400">
                {formattedDate} at {formattedTime}
              </div>
              
              {entry.updatedAt !== entry.createdAt && (
                <div className="text-sm text-neutral-500 dark:text-neutral-500">
                  Edited {format(new Date(entry.updatedAt), 'MMM d, yyyy')}
                </div>
              )}
            </div>
            
            <div className={`flex items-center space-x-2 px-3 py-1 rounded-full ${getMoodColor(entry.mood)}`}>
              <MoodIcon mood={entry.mood} />
              <span className="font-medium capitalize">
                {entry.mood}
              </span>
            </div>
          </div>
          
          {entry.activities && entry.activities.length > 0 && (
            <div className="mb-6">
              <h3 className="text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
                Activities:
              </h3>
              <div className="flex flex-wrap gap-2">
                {entry.activities.map(activity => (
                  <span 
                    key={activity}
                    className="bg-secondary-100 dark:bg-secondary-900/30 text-secondary-800 dark:text-secondary-200 px-3 py-1 text-sm rounded-full"
                  >
                    {activity}
                  </span>
                ))}
              </div>
            </div>
          )}
          
          <div className="prose dark:prose-invert max-w-none">
            <p className="whitespace-pre-line text-neutral-800 dark:text-neutral-200 leading-relaxed">
              {entry.content}
            </p>
          </div>

          {entry.images && entry.images.length > 0 && (
            <div className="mt-6">
              <h3 className="text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
                Attachments:
              </h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                {entry.images.map((image, index) => (
                  <a key={index} href={image} target="_blank" rel="noopener noreferrer">
                    <img 
                      src={image} 
                      alt={`Journal entry image ${index + 1}`}
                      className="rounded-lg object-cover h-40 w-full hover:opacity-90 transition-opacity"
                    />
                  </a>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default EntryDetail