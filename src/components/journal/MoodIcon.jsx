import { FiSmile, FiMeh, FiFrown } from 'react-icons/fi'


const MoodIcon = ({ mood, size = 16 }) => {
  switch (mood) {
    case 'great':
      return <FiSmile size={size} className="text-green-500" />
    case 'good':
      return <FiSmile size={size} className="text-blue-500" />
    case 'okay':
      return <FiMeh size={size} className="text-yellow-500" />
    case 'bad':
      return <FiMeh size={size} className="text-orange-500" />
    case 'awful':
      return <FiFrown size={size} className="text-red-500" />
    default:
      return null
  }
}

export const getMoodColor = (mood) => {
  switch (mood) {
    case 'great':
      return 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-200'
    case 'good':
      return 'bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-200'
    case 'okay':
      return 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-200'
    case 'bad':
      return 'bg-orange-100 dark:bg-orange-900/30 text-orange-800 dark:text-orange-200'
    case 'awful':
      return 'bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-200'
    default:
      return 'bg-neutral-100 dark:bg-neutral-800 text-neutral-800 dark:text-neutral-200'
  }
}

export default MoodIcon