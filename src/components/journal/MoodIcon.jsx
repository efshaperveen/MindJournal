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

// Modified getMoodColor to accept an isPopover parameter
export const getMoodColor = (mood, isPopover = false) => {
  // Base text color classes (these will be common for both main and popover moods)
  let textColorClass = '';
  switch (mood) {
    case 'great':
      textColorClass = 'text-green-500 dark:text-green-300'; // Adjusted for better dark mode visibility
      break;
    case 'good':
      textColorClass = 'text-blue-500 dark:text-blue-300';
      break;
    case 'okay':
      textColorClass = 'text-yellow-500 dark:text-yellow-300';
      break;
    case 'bad':
      textColorClass = 'text-orange-500 dark:text-orange-300';
      break;
    case 'awful':
      textColorClass = 'text-red-500 dark:text-red-300';
      break;
    default:
      return 'text-neutral-500 dark:text-neutral-400'; // Fallback for no mood
  }

  if (isPopover) {
    // For popover moods, we want subtle backgrounds and a hover effect
    // We'll use a very light background that changes on hover
    // Note: The MoodIcon component already applies the primary text color (e.g., text-green-500).
    // So, here we primarily control the background and hover.
    return `bg-opacity-0 hover:bg-opacity-10 transition-colors duration-150 ${textColorClass}`;
    // You could also use 'bg-neutral-100 dark:bg-neutral-700' for a consistent background if preferred,
    // but bg-opacity-0 with hover effect is usually cleaner.
  } else {
    // Original logic for the main mood circles (solid background)
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
}

export default MoodIcon