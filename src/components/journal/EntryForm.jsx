import { useState, useEffect, useRef } from 'react';
import { Check, Smile, Meh, Frown, UploadCloud, XCircle, Loader2, Trash2 } from 'lucide-react';
import { FaRunning, FaBookOpen, FaPrayingHands, FaBriefcase, FaUsers, FaChild, FaHeart, FaTree, FaSun } from 'react-icons/fa'; // Added more icons for common activities
import { marked } from "marked";
import DOMPurify from "dompurify";

// Define mood options with updated colors and lucide-react icons
const moods = [
  { id: 'great', label: 'Epic', icon: <Smile className="text-green-500" size={24} />, color: 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-200' },
  { id: 'good', label: 'Good', icon: <Smile className="text-blue-500" size={24} />, color: 'bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-200' },
  { id: 'okay', label: 'Okay', icon: <Meh className="text-yellow-500" size={24} />, color: 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-200' },
  { id: 'bad', label: 'Bad', icon: <Meh className="text-orange-500" size={24} />, color: 'bg-orange-100 dark:bg-orange-900/30 text-orange-800 dark:text-orange-200' },
  { id: 'awful', label: 'Awful', icon: <Frown className="text-red-500" size={24} />, color: 'bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-200' }
];

// --- API Utility Functions ---
const API_BASE_URL = 'http://localhost:5000/api/custom-activities';

const fetchCustomActivities = async (userEmail) => {
  const response = await fetch(`${API_BASE_URL}/${userEmail}`);
  if (!response.ok) {
    throw new Error('Failed to fetch custom activities');
  }
  return response.json();
};

const addCustomActivityToBackend = async (userEmail, activity) => {
  const response = await fetch(API_BASE_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: userEmail, activity })
  });
  if (!response.ok) {
    throw new Error('Failed to add custom activity to backend');
  }
  return response.json();
};

const deleteCustomActivityFromBackend = async (userEmail, activity) => {
  const response = await fetch(API_BASE_URL, {
    method: 'DELETE',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: userEmail, activity })
  });
  if (!response.ok) {
    throw new Error('Failed to delete custom activity from backend');
  }
  return response.json();
};
// --- End API Utility Functions ---


const EntryForm = ({ onSubmit, initialData = {}, userEmail }) => {
  const [entryData, setEntryData] = useState({
    title: '',
    content: '',
    mood: '',
    activities: [],
    images: [], // Stores File objects for new uploads and URLs for existing images
    micro_goals: [],
    ...initialData
  });

  const [newActivityInput, setNewActivityInput] = useState('');
  const [imagePreviews, setImagePreviews] = useState(initialData.images || []);
  const [microGoalPreview, setMicroGoalPreview] = useState('');
  // State for loading indicator during form submission (especially image upload)
  const [isSubmitting, setIsSubmitting] = useState(false);

  // States for custom activity persistence
  const [persistedCustomActivities, setPersistedCustomActivities] = useState([]);
  const [isLoadingActivities, setIsLoadingActivities] = useState(true);
  const [activityError, setActivityError] = useState(null);

  // Common activities for quick selection (now objects with label and icon)
  const commonActivities = [
    { label: 'Exercise', icon: <FaRunning className="text-red-500" /> },
    { label: 'Reading', icon: <FaBookOpen className="text-blue-500" /> },
    { label: 'Meditation', icon: <FaPrayingHands className="text-purple-500" /> },
    { label: 'Work', icon: <FaBriefcase className="text-yellow-500" /> },
    { label: 'Family time', icon: <FaUsers className="text-green-500" /> },
    { label: 'Friends', icon: <FaChild className="text-pink-500" /> },
    { label: 'Hobbies', icon: <FaHeart className="text-orange-500" /> },
    { label: 'Self-care', icon: <FaSun className="text-indigo-500" /> },
    { label: 'Relaxation', icon: <Smile className="text-teal-500" /> }, // Using Lucide for consistency
    { label: 'Nature', icon: <FaTree className="text-lime-500" /> }
  ];

  // Effect to fetch custom activities from the backend on component mount or userEmail change
  useEffect(() => {
    const loadPersistedActivities = async () => {
      if (!userEmail) {
        setIsLoadingActivities(false);
        return;
      }
      setIsLoadingActivities(true);
      setActivityError(null);
      try {
        const activities = await fetchCustomActivities(userEmail);
        setPersistedCustomActivities(activities);
      } catch (err) {
        console.error('Error loading persisted activities:', err);
        setActivityError('Failed to load your custom activities.');
      } finally {
        setIsLoadingActivities(false);
      }
    };

    loadPersistedActivities();
  }, [userEmail]);

  // Handles changes for text input fields (title, content)
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEntryData(prev => ({ ...prev, [name]: value }));
  };

  // Handles selection of a mood
  const handleMoodSelection = (moodId) => {
    setEntryData(prev => ({ ...prev, mood: moodId }));
  };

  // Toggles an activity in the activities list for the CURRENT entry
  const toggleActivitySelection = (activityLabel) => {
    setEntryData(prev => {
      const currentActivities = prev.activities || [];
      return {
        ...prev,
        activities: currentActivities.includes(activityLabel)
          ? currentActivities.filter(a => a !== activityLabel)
          : [...currentActivities, activityLabel]
      };
    });
  };

  // Adds a custom activity to the list AND persists it to the backend
  const addCustomActivity = async () => {
    const activityToAdd = newActivityInput.trim();
    // Prevent adding if empty, already selected for current entry, or already a persisted activity
    if (!activityToAdd || entryData.activities.includes(activityToAdd) || persistedCustomActivities.includes(activityToAdd)) {
      return;
    }

    setIsLoadingActivities(true);
    setActivityError(null);
    try {
      // Add to the current entry's selected activities
      setEntryData(prev => ({
        ...prev,
        activities: [...(prev.activities || []), activityToAdd]
      }));

      // Persist to backend
      const updatedPersistedActivities = await addCustomActivityToBackend(userEmail, activityToAdd);
      setPersistedCustomActivities(updatedPersistedActivities);
      setNewActivityInput(''); // Clear the input field
    }
  };

  // Adds a new goal to the list
  const addMicroGoal = () => {
    if (microGoalPreview.trim() && !entryData.micro_goals.includes(microGoalPreview.trim())) {
      setEntryData(prev => ({
        ...prev,
        micro_goals: [
          ...(prev.micro_goals || []),
          {
            text: microGoalPreview.trim(),
            is_completed: false
          }
        ]
      }));
      setMicroGoalPreview(''); // Clear the input field
    }
  };

  const removeMicroGoal = (index) => {
    setEntryData(prev => {
      const newMicroGoals = prev.micro_goals.filter((goal, i) => i !== index);
      return { ...prev, micro_goals: newMicroGoals };
    });
  };

  const toggleMicroGoalCompletion = (index) => {
    setEntryData(prev => {
      const newMicroGoals = prev.micro_goals.map((goal, i) => {
        if (i === index) {
          return { ...goal, is_completed: !goal.is_completed };
        }
        return goal;
      });
      return { ...prev, micro_goals: newMicroGoals };
    });
  };


  // Handles image file selection
    } catch (err) {
      console.error('Error adding custom activity:', err);
      setActivityError('Failed to save new activity.');
      // Revert entryData.activities if backend save fails
      setEntryData(prev => ({
        ...prev,
        activities: prev.activities.filter(a => a !== activityToAdd)
      }));
    } finally {
      setIsLoadingActivities(false);
    }
  };

  // Removes a custom activity from the persisted list in the backend
  const removePersistedActivity = async (activityToRemove) => {
    setIsLoadingActivities(true);
    setActivityError(null);
    try {
      // Remove from the current entry's selected activities if it was selected
      setEntryData(prev => ({
        ...prev,
        activities: prev.activities.filter(a => a !== activityToRemove)
      }));

      // Remove from backend
      const updatedPersistedActivities = await deleteCustomActivityFromBackend(userEmail, activityToRemove);
      setPersistedCustomActivities(updatedPersistedActivities);
    } catch (err) {
      console.error('Error deleting custom activity:', err);
      setActivityError('Failed to delete activity.');
    } finally {
      setIsLoadingActivities(false);
    }
  };

  const handleImageFileChange = (e) => {
    const files = Array.from(e.target.files);
    if (files.length > 0) {
      setEntryData(prev => ({
        ...prev,
        images: [...prev.images, ...files]
      }));

      const newPreviews = files.map(file => URL.createObjectURL(file));
      setImagePreviews(prev => [...prev, ...newPreviews]);
    }
  };

  const removeImage = (index) => {
    const imageToRemove = entryData.images[index];

    if (imageToRemove instanceof File) {
      const previewToRemove = imagePreviews[index];
      URL.revokeObjectURL(previewToRemove);
    }

    setEntryData(prev => {
      const newImages = [...prev.images];
      newImages.splice(index, 1);
      return { ...prev, images: newImages };
    });

    setImagePreviews(prev => {
      const newPreviews = [...prev];
      newPreviews.splice(index, 1);
      return newPreviews;
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    const CLOUD_NAME = import.meta.env.VITE_CLOUD_NAME;
    const UPLOAD_PRESET = import.meta.env.VITE_UPLOAD_PRESET;

    const existingImageUrls = entryData.images.filter(image => typeof image === 'string');
    const newImageFiles = entryData.images.filter(image => image instanceof File);

    const uploadedImageUrls = [];
    const uploadPromises = newImageFiles.map(async (image) => {
      const data = new FormData();
      data.append('file', image);
      data.append('upload_preset', UPLOAD_PRESET);

      try {
        const res = await fetch(`https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`, {
          method: 'POST',
          body: data
        });
        const file = await res.json();
        if (file.secure_url) {
          uploadedImageUrls.push(file.secure_url);
        }
      } catch (err) {
        console.error("Image upload failed:", err);
      }
    });

    await Promise.all(uploadPromises);

    const finalEntryData = {
      ...entryData,
      images: [...existingImageUrls, ...uploadedImageUrls],
    };

    onSubmit(finalEntryData);
    setIsSubmitting(false);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8 p-8 bg-white/90 dark:bg-neutral-900/80 backdrop-blur-md rounded-2xl shadow-2xl">
      {/* Title Input */}
      <div>
        <label htmlFor="title" className="block text-sm font-semibold text-neutral-700 dark:text-neutral-300 mb-2">
          Entry Title <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          id="title"
          name="title"
          value={entryData.title}
          onChange={handleInputChange}
          required
          className="w-full px-4 py-2 border border-neutral-300 dark:border-neutral-700 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none bg-neutral-50 dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100 placeholder-neutral-400 dark:placeholder-neutral-500 transition-colors duration-200"
          placeholder="Give your journal entry a title"
        />
      </div>

      {/* Mood Selection */}
      <div>
        <label className="text-sm font-semibold tracking-wide text-neutral-700 dark:text-neutral-300">
          How are you feeling today? <span className="text-red-500">*</span>
        </label>
        <div className="flex flex-wrap gap-3">
          {moods.map((mood) => (
            <button
              key={mood.id}
              type="button"
              onClick={() => handleMoodSelection(mood.id)}
              className={`flex items-center space-x-2 px-4 py-2 rounded-full transition-all duration-200 ease-in-out text-sm font-medium ${entryData.mood === mood.id
                  ? mood.color + ' ring-2 ring-offset-2 ring-primary-500 dark:ring-offset-neutral-900 shadow-md'
                  : 'bg-neutral-100 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300 hover:bg-neutral-200 dark:hover:bg-neutral-700'
                }`}
            >
              <span>{mood.icon}</span>
              <span>{mood.label}</span>
              {entryData.mood === mood.id && <Check className="ml-1 text-primary-600 dark:text-primary-400" size={16} />}
            </button>
          ))}
        </div>
      </div>

      {/* Activities Section - Restored Buttons with Persistence */}
      <div>
        <label className="block text-sm font-semibold text-neutral-700 dark:text-neutral-300 mb-3">
          Activities (optional)
        </label>
        {isLoadingActivities ? (
          <div className="flex items-center text-neutral-500 dark:text-neutral-400">
            <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Loading activities...
          </div>
        ) : activityError ? (
          <div className="text-red-500 text-sm mb-3">{activityError}</div>
        ) : (
          <div className="flex flex-wrap gap-2 mb-3">
            {/* Render Common Activities as buttons */}
            {commonActivities.map(({ label, icon }) => {
              const isSelected = entryData.activities?.includes(label);
              return (
                <button
                  key={label}
                  type="button"
                  onClick={() => toggleActivitySelection(label)}
                  className={`flex items-center gap-2 px-4 py-2 text-sm rounded-full border transition-all duration-200
                    ${isSelected
                      ? 'bg-primary-100/50 text-primary-800 dark:bg-primary-900/30 dark:text-primary-200 ring-2 ring-primary-400 dark:ring-primary-600 border-primary-400 shadow-sm'
                      : 'bg-neutral-100 text-neutral-700 dark:bg-neutral-800 dark:text-neutral-300 hover:bg-neutral-200 dark:hover:bg-neutral-700 border-neutral-300 dark:border-neutral-700'
                    }
                  `}
                >
                  {icon}
                  <span>{label}</span>
                  {isSelected && <span className="ml-1 text-green-500">✅</span>}
                </button>
              );
            })}

            {/* Render Persisted Custom Activities as buttons */}
            {persistedCustomActivities.map(activity => {
              // Ensure it's not a common activity (to avoid duplicates if labels overlap)
              const isCommonActivity = commonActivities.some(ca => ca.label === activity);
              if (isCommonActivity) return null; // Skip if it's already covered by commonActivities

              const isSelected = entryData.activities?.includes(activity);
              return (
                <button
                  key={activity}
                  type="button"
                  onClick={() => toggleActivitySelection(activity)}
                  className={`flex items-center gap-2 px-4 py-2 text-sm rounded-full border transition-all duration-200
                    ${isSelected
                      ? 'bg-primary-100/50 text-primary-800 dark:bg-primary-900/30 dark:text-primary-200 ring-2 ring-primary-400 dark:ring-primary-600 border-primary-400 shadow-sm'
                      : 'bg-neutral-100 text-neutral-700 dark:bg-neutral-800 dark:text-neutral-300 hover:bg-neutral-200 dark:hover:bg-neutral-700 border-neutral-300 dark:border-neutral-700'
                    }
                  `}
                >
                  <span>{activity}</span>
                  {isSelected && <span className="ml-1 text-green-500">✅</span>}
                  {/* Show delete button only for persisted custom activities */}
                  <Trash2
                    size={14}
                    className="ml-2 text-red-500 hover:text-red-700 cursor-pointer"
                    onClick={(e) => {
                      e.stopPropagation(); // Prevent toggling selection when clicking delete
                      removePersistedActivity(activity);
                    }}
                  />
                </button>
              );
            })}
          </div>
        )}

        {/* Custom Activity Input */}
        <div className="flex rounded-lg shadow-sm">
          <input
            type="text"
            value={newActivityInput}
            onChange={(e) => setNewActivityInput(e.target.value)}
            className="flex-1 px-4 py-2 border border-neutral-300 dark:border-neutral-700 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none bg-neutral-50 dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100 placeholder-neutral-400 dark:placeholder-neutral-500 transition-colors duration-200"
            placeholder="Add a new activity (e.g., 'Gardening')"
          />
          <button
            type="button"
            onClick={addCustomActivity}
            disabled={!newActivityInput.trim() || isLoadingActivities}
            className={`px-5 py-2 font-medium text-sm rounded-lg
    text-white bg-primary-600
    hover:bg-primary-700 active:scale-95
    focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2
    dark:focus:ring-offset-neutral-900
    transition-all duration-200
    disabled:opacity-50 disabled:cursor-not-allowed disabled:shadow-none shadow-md`}
          >
            ➕ Add
          </button>
        </div>
      </div>

      {/* micro goals section */}
      <div>
        <label className="block text-sm font-semibold text-neutral-700 dark:text-neutral-300 mb-3">
          Goals (optional)
        </label>

        {/* Goal Input */}
        <div className="flex rounded-lg shadow-sm">
          <input
            type="text"
            value={microGoalPreview}
            onChange={(e) => setMicroGoalPreview(e.target.value)}
            className="flex-1 px-4 py-2 border border-neutral-300 dark:border-neutral-700 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none bg-neutral-50 dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100 placeholder-neutral-400 dark:placeholder-neutral-500 transition-colors duration-200"
            placeholder="Add new Goal (e.g., Sleep before 11 PM, Deploy personal project to Vercel)"
          />
          <button
            type="button"
            onClick={addMicroGoal}
            className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 dark:focus:ring-offset-neutral-900 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={!microGoalPreview.trim()}
          >
           ➕ Add
          </button>
        </div>

        {/* Render micro goals already added */}
        <div className="flex flex-col gap-2 m-3">
          {entryData.micro_goals?.map((goal, index) => (
            <div key={index} className="flex items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <div
                  onClick={() => toggleMicroGoalCompletion(index)}
                  className={`w-4 h-4 cursor-pointer rounded border-2 flex items-center justify-center transition-colors duration-200 ${goal.is_completed
                    ? 'bg-primary-600 border-primary-600 dark:bg-primary-500 dark:border-primary-500'
                    : 'bg-white dark:bg-neutral-700 border-gray-300 dark:border-gray-500 hover:border-primary-400 dark:hover:border-primary-400'
                    }`}
                >
                  {goal.is_completed && <Check strokeWidth={5} className="w-4 h-4 font-bold text-white" />}
                </div>

                <span
                  className={`text-md ${goal.is_completed
                    ? "line-through text-gray-400"
                    : "text-neutral-700 dark:text-neutral-300"
                    }`}

                >
                  {goal.text}
                </span>
              </div>
              <button
                type="button"
                onClick={() => removeMicroGoal(index)}
                className="text-red-500 hover:underline"
              >
                <Trash2 className="w-5 h-5" />
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Image Upload Section */}
      <div>
        <label className="block text-sm font-semibold text-neutral-700 dark:text-neutral-300 mb-3">
          Attach Images (optional)
        </label>
        <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-neutral-300 dark:border-neutral-700 border-dashed rounded-lg border-neutral-300 dark:border-neutral-700 transition-all duration-200 hover:border-primary-500 hover:bg-primary-50 dark:hover:bg-primary-900/10">
          <div className="space-y-1 text-center">
            <UploadCloud className="mx-auto h-12 w-12 text-neutral-400" />
            <div className="flex text-sm text-neutral-600 dark:text-neutral-400">
              <label
                htmlFor="file-upload"
                className="relative cursor-pointer bg-white dark:bg-neutral-900 rounded-md font-medium text-primary-600 hover:text-primary-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-primary-500"
              >
                <span>Upload files</span>
                <input id="file-upload" name="file-upload" type="file" className="sr-only" multiple onChange={handleImageFileChange} accept="image/png, image/jpeg" />
              </label>
              <p className="pl-1">or drag and drop</p>
            </div>
            <p className="text-xs text-neutral-500 dark:text-neutral-500">PNG, JPG up to 5MB each</p>
          </div>
        </div>
        {imagePreviews.length > 0 && (
          <div className="mt-4 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
            {imagePreviews.map((preview, index) => (
              <div key={index} className="relative group">
                <img src={preview} alt={`preview ${index}`} className="h-28 w-full object-cover rounded-md shadow-sm border border-neutral-200 dark:border-neutral-700 transition-transform duration-300 ease-in-out group-hover:scale-[1.02]" />
                <button
                  type="button"
                  onClick={() => removeImage(index)}
                  className="absolute top-1 right-1 bg-red-500/90 text-white rounded-full p-1 backdrop-blur-md shadow-md opacity-0 group-hover:opacity-100 transition-all duration-200 hover:scale-110"
                  aria-label="Remove image"
                >
                  <XCircle size={16} />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Journal Content Textarea */}
      <div>
        <label htmlFor="content" className="block text-sm font-semibold text-neutral-700 dark:text-neutral-300 mb-2">
          Journal Entry <span className="text-red-500">*</span>
        </label>
        <textarea
          id="content"
          name="content"
          value={entryData.content}
          onChange={handleInputChange}
          required
          className="w-full px-4 py-2 border border-neutral-300 dark:border-neutral-700 rounded-lg
      bg-neutral-50 dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100
      placeholder-neutral-400 dark:placeholder-neutral-500
      focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent
      shadow-sm focus:shadow-primary-200/50 dark:focus:shadow-primary-900/30
      min-h-[180px] resize-y transition-all duration-200"
          placeholder="Write your thoughts and experiences here..."
        />

          <div className="mt-4 p-3 border border-neutral-300 dark:border-neutral-700 rounded-md
      bg-neutral-50 dark:bg-neutral-900 text-sm prose dark:prose-invert max-w-none">
        <div dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(marked(entryData.content || "")) }} />
      </div>
      </div>

      {/* Submit Button */}
      <div className="mt-6">
        <button
          type="submit"
          className="w-full flex items-center justify-center gap-2 px-6 py-3 text-base font-semibold rounded-xl
      text-white bg-primary-600 hover:bg-primary-700
      focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500
      dark:focus:ring-offset-neutral-900
      transition-all duration-200 ease-in-out
      disabled:opacity-50 disabled:cursor-not-allowed
      shadow-md hover:shadow-lg active:scale-[0.98]"
          disabled={isSubmitting}
        >
          {isSubmitting ? (
            <>
              <Loader2 className="h-5 w-5 animate-spin" />
                <span className="animate-pulse">
                {initialData.id ? 'Saving...' : 'Creating...'}
                </span>
            </>
          ) : (
            initialData.id ? '💾 Save Changes' : '📝 Create Entry'
          )}
        </button>
      </div>
    </form>
  );
};

export default EntryForm;
