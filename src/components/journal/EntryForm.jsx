import { useState, useEffect } from 'react';
import { Check, Smile, Meh, Frown, UploadCloud, XCircle, Loader2, Trash2 } from 'lucide-react'; // Added Trash2 icon

// Define mood options with updated colors and lucide-react icons
const moods = [
  { id: 'great', label: 'Great', icon: <Smile className="text-green-500" size={24} />, color: 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-200' },
  { id: 'good', label: 'Good', icon: <Smile className="text-blue-500" size={24} />, color: 'bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-200' },
  { id: 'okay', label: 'Okay', icon: <Meh className="text-yellow-500" size={24} />, color: 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-200' },
  { id: 'bad', label: 'Bad', icon: <Meh className="text-orange-500" size={24} />, color: 'bg-orange-100 dark:bg-orange-900/30 text-orange-800 dark:text-orange-200' },
  { id: 'awful', label: 'Awful', icon: <Frown className="text-red-500" size={24} />, color: 'bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-200' }
];

// --- API Utility Functions (Placeholder - you might put these in a separate file like `api.js`) ---
// NOTE: Replace 'YOUR_BACKEND_URL' with the actual URL of your Express backend (e.g., 'http://localhost:5000')
const API_BASE_URL = 'http://localhost:5000/api/custom-activities'; // Assuming your backend runs on port 5000

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
  return response.json(); // Should return the updated list of activities
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
  return response.json(); // Should return the updated list of activities
};
// --- End API Utility Functions ---


// JournalEntryForm component for creating or editing journal entries
// Added `userEmail` prop to link activities to a specific user
const EntryForm = ({ onSubmit, initialData = {}, userEmail }) => {
  // State to manage all form data
  console.log('EntryForm rendered. Current userEmail:', userEmail); // Debug log 1
  const [entryData, setEntryData] = useState({
    title: '',
    content: '',
    mood: '',
    activities: [],
    images: [], // Stores File objects for new uploads and URLs for existing images
    ...initialData
  });

  // State for custom activity input
  const [newActivityInput, setNewActivityInput] = useState('');
  // State to store image preview URLs (for display)
  const [imagePreviews, setImagePreviews] = useState(initialData.images || []);
  // State for loading indicator during form submission (especially image upload)
  const [isSubmitting, setIsSubmitting] = useState(false);

  // NEW: State to store custom activities fetched from the backend
  const [persistedCustomActivities, setPersistedCustomActivities] = useState([]);
  // NEW: State for loading custom activities
  const [isLoadingActivities, setIsLoadingActivities] = useState(true);
  // NEW: State for error fetching/adding/deleting custom activities
  const [activityError, setActivityError] = useState(null);

  // Common activities for quick selection (these are not user-specific)
  const commonActivities = [
    'Exercise', 'Reading', 'Meditation', 'Work', 'Family time',
    'Friends', 'Hobbies', 'Self-care', 'Relaxation', 'Nature'
  ];

  // NEW: Effect to fetch custom activities from the backend on component mount
  useEffect(() => {
    console.log('useEffect for activities triggered. userEmail:', userEmail); // Debug log 2
    const loadPersistedActivities = async () => {
      if (!userEmail) {
        // If no userEmail, we can't fetch user-specific activities
        console.warn('No userEmail provided, skipping custom activity fetch.'); // Debug log 3
        setIsLoadingActivities(false);
        return;
      }
      setIsLoadingActivities(true);
      setActivityError(null);
      try {
        const activities = await fetchCustomActivities(userEmail);
        setPersistedCustomActivities(activities);
        console.log('Fetched persisted activities:', activities); // Debug log 4
      } catch (err) {
        console.error('Error loading persisted activities:', err);
        setActivityError('Failed to load your custom activities.');
      } finally {
        setIsLoadingActivities(false);
      }
    };

    loadPersistedActivities();
  }, [userEmail]); // Re-run when userEmail changes

  // Combine common and persisted custom activities for display
  // Use a Set to ensure uniqueness and then convert back to Array
  const allAvailableActivities = Array.from(new Set([
    ...commonActivities,
    ...(persistedCustomActivities || [])
  ]));
  console.log('All available activities for display:', allAvailableActivities); // Debug log 5


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
  const toggleActivitySelection = (activity) => {
    setEntryData(prev => {
      const currentActivities = prev.activities || [];
      return {
        ...prev,
        activities: currentActivities.includes(activity)
          ? currentActivities.filter(a => a !== activity)
          : [...currentActivities, activity]
      };
    });
  };

  // NEW: Adds a custom activity to the list AND persists it to the backend
  const addCustomActivity = async () => {
    const activityToAdd = newActivityInput.trim();
    if (!activityToAdd || entryData.activities.includes(activityToAdd)) {
      return; // Don't add if empty or already selected for current entry
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
    } catch (err) {
      console.error('Error adding custom activity:', err);
      setActivityError('Failed to save new activity.');
      // OPTIONAL: Revert entryData.activities if backend save fails
      setEntryData(prev => ({
        ...prev,
        activities: prev.activities.filter(a => a !== activityToAdd)
      }));
    } finally {
      setIsLoadingActivities(false);
    }
  };

  // NEW: Removes a custom activity from the persisted list in the backend
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
      // OPTIONAL: Revert entryData.activities if backend delete fails
    } finally {
      setIsLoadingActivities(false);
    }
  };


  // Handles image file selection
  const handleImageFileChange = (e) => {
    const files = Array.from(e.target.files);
    if (files.length > 0) {
      setEntryData(prev => ({
        ...prev,
        images: [...prev.images, ...files] // Add File objects to images array
      }));

      // Create object URLs for immediate preview
      const newPreviews = files.map(file => URL.createObjectURL(file));
      setImagePreviews(prev => [...prev, ...newPreviews]);
    }
  };

  // Removes an image from the form data and revokes its preview URL
  const removeImage = (index) => {
    const imageToRemove = entryData.images[index];

    // If it's a File object, revoke its URL to prevent memory leaks
    if (imageToRemove instanceof File) {
      const previewToRemove = imagePreviews[index];
      URL.revokeObjectURL(previewToRemove);
    }

    setEntryData(prev => {
      const newImages = [...prev.images];
      newImages.splice(index, 1); // Remove the image file/URL
      return { ...prev, images: newImages };
    });

    setImagePreviews(prev => {
      const newPreviews = [...prev];
      newPreviews.splice(index, 1); // Remove the preview URL
      return newPreviews;
    });
  };

  // Handles form submission, including image upload to Cloudinary
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true); // Set loading state

    // Cloudinary credentials 
    const CLOUD_NAME = import.meta.env.VITE_CLOUD_NAME;
    const UPLOAD_PRESET = import.meta.env.VITE_UPLOAD_PRESET;

    // Separate existing image URLs from new image files
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
        // Implement user-friendly error feedback here (e.g., a toast notification)
      }
    });

    await Promise.all(uploadPromises); // Wait for all new images to upload

    // Prepare the final data to be submitted
    const finalEntryData = {
      ...entryData,
      images: [...existingImageUrls, ...uploadedImageUrls], // Combine existing and new uploaded URLs
    };

    onSubmit(finalEntryData); // Call the onSubmit prop with the final data
    setIsSubmitting(false); // Reset loading state
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8 p-6 bg-white dark:bg-neutral-900 rounded-lg shadow-xl font-inter">
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
        <label className="block text-sm font-semibold text-neutral-700 dark:text-neutral-300 mb-3">
          How are you feeling today? <span className="text-red-500">*</span>
        </label>
        <div className="flex flex-wrap gap-3">
          {moods.map((mood) => (
            <button
              key={mood.id}
              type="button"
              onClick={() => handleMoodSelection(mood.id)}
              className={`flex items-center space-x-2 px-4 py-2 rounded-full transition-all duration-200 ease-in-out text-sm font-medium ${
                entryData.mood === mood.id
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

      {/* Activities Section */}
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
            {allAvailableActivities.map(activity => (
              <button
                key={activity}
                type="button"
                onClick={() => toggleActivitySelection(activity)}
                className={`px-3 py-1.5 text-sm rounded-full transition-all duration-200 ${
                  entryData.activities?.includes(activity)
                    ? 'bg-primary-100 text-primary-800 dark:bg-primary-900/30 dark:text-primary-200 ring-1 ring-primary-400'
                    : 'bg-neutral-100 text-neutral-700 dark:bg-neutral-800 dark:text-neutral-300 hover:bg-neutral-200 dark:hover:bg-neutral-700'
                } flex items-center`}
              >
                {activity}
                {/* Show delete button only for persisted custom activities */}
                {persistedCustomActivities.includes(activity) && (
                  <Trash2
                    size={14}
                    className="ml-2 text-red-500 hover:text-red-700 cursor-pointer"
                    onClick={(e) => {
                      e.stopPropagation(); // Prevent toggling selection when clicking delete
                      removePersistedActivity(activity);
                    }}
                  />
                )}
              </button>
            ))}
          </div>
        )}

        {/* Custom Activity Input */}
        <div className="flex rounded-lg shadow-sm">
          <input
            type="text"
            value={newActivityInput}
            onChange={(e) => setNewActivityInput(e.target.value)}
            className="flex-1 px-4 py-2 border border-neutral-300 dark:border-neutral-700 rounded-l-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none bg-neutral-50 dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100 placeholder-neutral-400 dark:placeholder-neutral-500 transition-colors duration-200"
            placeholder="Add a new activity (e.g., 'Gardening')"
          />
          <button
            type="button"
            onClick={addCustomActivity}
            className="px-4 py-2 bg-primary-600 text-white rounded-r-lg hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 dark:focus:ring-offset-neutral-900 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={!newActivityInput.trim() || isLoadingActivities}
          >
            Add
          </button>
        </div>
      </div>

      {/* Image Upload Section */}
      <div>
        <label className="block text-sm font-semibold text-neutral-700 dark:text-neutral-300 mb-3">
          Attach Images (optional)
        </label>
        <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-neutral-300 dark:border-neutral-700 border-dashed rounded-lg">
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
                <img src={preview} alt={`preview ${index}`} className="h-28 w-full object-cover rounded-md shadow-sm border border-neutral-200 dark:border-neutral-700" />
                <button
                  type="button"
                  onClick={() => removeImage(index)}
                  className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-center"
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
          className="w-full px-4 py-2 border border-neutral-300 dark:border-neutral-700 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none bg-neutral-50 dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100 placeholder-neutral-400 dark:placeholder-neutral-500 min-h-[180px] transition-colors duration-200 resize-y"
          placeholder="Write your thoughts and experiences here..."
        />
      </div>

      {/* Submit Button */}
      <div>
        <button
          type="submit"
          className="w-full flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-lg shadow-sm text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 dark:focus:ring-offset-neutral-900 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
          disabled={isSubmitting}
        >
          {isSubmitting ? (
            <>
              <Loader2 className="mr-2 h-5 w-5 animate-spin" />
              {initialData.id ? 'Saving...' : 'Creating...'}
            </>
          ) : (
            initialData.id ? 'Save Changes' : 'Create Entry'
          )}
        </button>
      </div>
    </form>
  );
};

export default EntryForm;
