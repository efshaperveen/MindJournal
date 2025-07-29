import { useState, useEffect, useRef } from "react";
import {
  Check,
  Smile,
  Meh,
  Frown,
  UploadCloud,
  XCircle,
  Loader2,
} from "lucide-react"; // Switched to lucide-react for different icons
import {
  FaRunning,
  FaBookOpen,
  FaPrayingHands,
  FaBriefcase,
  FaUsers,
} from "react-icons/fa";
import { marked } from "marked";
import DOMPurify from "dompurify";
import { FiPlus, FiFilter, FiX } from "react-icons/fi";

// Define mood options with updated colors and lucide-react icons
const moods = [
  {
    id: "great",
    label: "Epic",
    icon: <Smile className="text-green-500" size={24} />,
    color:
      "bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-200",
  },
  {
    id: "good",
    label: "Good",
    icon: <Smile className="text-blue-500" size={24} />,
    color: "bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-200",
  },
  {
    id: "okay",
    label: "Okay",
    icon: <Meh className="text-yellow-500" size={24} />,
    color:
      "bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-200",
  },
  {
    id: "bad",
    label: "Bad",
    icon: <Meh className="text-orange-500" size={24} />,
    color:
      "bg-orange-100 dark:bg-orange-900/30 text-orange-800 dark:text-orange-200",
  },
  {
    id: "awful",
    label: "Awful",
    icon: <Frown className="text-red-500" size={24} />,
    color: "bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-200",
  },
];

// JournalEntryForm component for creating or editing journal entries
const EntryForm = ({ onSubmit, initialData = {} }) => {
  // State to manage all form data
  const [entryData, setEntryData] = useState({
    title: "",
    content: "",
    mood: "",
    activities: [],
    images: [], // Stores File objects for new uploads and URLs for existing images
    ...initialData,
  });

  // State for custom activity input
  const [newActivityInput, setNewActivityInput] = useState("");
  // State to store image preview URLs (for display)
  const [imagePreviews, setImagePreviews] = useState(initialData.images || []);
  // State for loading indicator during form submission (especially image upload)
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Common activities for quick selection

  const commonActivities = [
    { label: "Exercise", icon: <FaRunning className="text-red-500" /> },
    { label: "Reading", icon: <FaBookOpen className="text-blue-500" /> },
    {
      label: "Meditation",
      icon: <FaPrayingHands className="text-purple-500" />,
    },
    { label: "Work", icon: <FaBriefcase className="text-yellow-500" /> },
    { label: "Family", icon: <FaUsers className="text-green-500" /> },
  ];

  // Handles changes for text input fields (title, content)
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEntryData((prev) => ({ ...prev, [name]: value }));
  };

  // Handles selection of a mood
  const handleMoodSelection = (moodId) => {
    setEntryData((prev) => ({ ...prev, mood: moodId }));
  };

  // Toggles an activity in the activities list
  const toggleActivitySelection = (activity) => {
    setEntryData((prev) => {
      const currentActivities = prev.activities || [];
      return {
        ...prev,
        activities: currentActivities.includes(activity)
          ? currentActivities.filter((a) => a !== activity)
          : [...currentActivities, activity],
      };
    });
  };

  // Adds a custom activity to the list
  const addCustomActivity = () => {
    if (
      newActivityInput.trim() &&
      !entryData.activities.includes(newActivityInput.trim())
    ) {
      setEntryData((prev) => ({
        ...prev,
        activities: [...(prev.activities || []), newActivityInput.trim()],
      }));
      setNewActivityInput(""); // Clear the input field
    }
  };

  // Handles image file selection
  const handleImageFileChange = (e) => {
    const files = Array.from(e.target.files);
    if (files.length > 0) {
      setEntryData((prev) => ({
        ...prev,
        images: [...prev.images, ...files], // Add File objects to images array
      }));

      // Create object URLs for immediate preview
      const newPreviews = files.map((file) => URL.createObjectURL(file));
      setImagePreviews((prev) => [...prev, ...newPreviews]);
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

    setEntryData((prev) => {
      const newImages = [...prev.images];
      newImages.splice(index, 1); // Remove the image file/URL
      return { ...prev, images: newImages };
    });

    setImagePreviews((prev) => {
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
    const existingImageUrls = entryData.images.filter(
      (image) => typeof image === "string"
    );
    const newImageFiles = entryData.images.filter(
      (image) => image instanceof File
    );

    const uploadedImageUrls = [];
    const uploadPromises = newImageFiles.map(async (image) => {
      const data = new FormData();
      data.append("file", image);
      data.append("upload_preset", UPLOAD_PRESET);

      try {
        const res = await fetch(
          `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`,
          {
            method: "POST",
            body: data,
          }
        );
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
    <form
      onSubmit={handleSubmit}
      className="space-y-8 p-8 bg-white/90 dark:bg-neutral-900/80 backdrop-blur-md rounded-2xl shadow-2xl"
    >
      {/* Title Input */}
      <div>
        <label
          htmlFor="title"
          className="block text-[16px] font-libre-baskerville font-semibold text-neutral-700 dark:text-neutral-300 mb-2"
        >
          Entry Title <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          id="title"
          name="title"
          value={entryData.title}
          onChange={handleInputChange}
          required
          className="font-lora font-light text-[16px] w-full px-4 py-2 border border-neutral-300 dark:border-neutral-700 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none bg-neutral-50 dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100 placeholder-neutral-400 dark:placeholder-neutral-500 transition-colors duration-200"
          placeholder="Give your journal entry a title"
        />
      </div>

      {/* Mood Selection */}
      <div>
        <label className="text-[16px] font-libre-baskerville font-semibold tracking-wide text-neutral-700 dark:text-neutral-300">
          How are you feeling today? <span className="text-red-500">*</span>
        </label>
        <div className="flex flex-wrap gap-3 mt-3">
          {moods.map((mood) => (
            <button
              key={mood.id}
              type="button"
              onClick={() => handleMoodSelection(mood.id)}
              className={`flex items-center space-x-2 px-4 py-2 rounded-full transition-all duration-200 ease-in-out text-[15px] font-lora font-light ${
                entryData.mood === mood.id
                  ? mood.color +
                    " ring-2 ring-offset-2 ring-primary-500 dark:ring-offset-neutral-900 shadow-md"
                  : "bg-neutral-100 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300 hover:bg-neutral-200 dark:hover:bg-neutral-700"
              }`}
            >
              <span>{mood.icon}</span>
              <span>{mood.label}</span>
              {entryData.mood === mood.id && (
                <Check
                  className="ml-1 text-primary-600 dark:text-primary-400"
                  size={16}
                />
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Activities Section */}
      <div>
        <label className="block text-[14px] font-libre-baskerville font-semibold text-neutral-700 dark:text-neutral-300 mb-3">
          Activities (optional)
        </label>
        <div className="flex flex-wrap gap-3 mb-3">
          {commonActivities.map(({ label, icon }) => {
            const isSelected = entryData.activities?.includes(label); // ✅ Define it here

            return (
              <button
                key={label}
                type="button"
                onClick={() => toggleActivitySelection(label)}
                className={`flex items-center gap-2 px-4 py-2 text-sm rounded-full border transition-all duration-200
            ${
              isSelected
                ? "bg-primary-100/50 text-primary-800 dark:bg-primary-900/30 dark:text-primary-200 ring-2 ring-primary-400 dark:ring-primary-600 border-primary-400 shadow-sm"
                : "bg-neutral-100 text-neutral-700 dark:bg-neutral-800 dark:text-neutral-300 hover:bg-neutral-200 dark:hover:bg-neutral-700 border-neutral-300 dark:border-neutral-700"
            }
          `}
              >
                {icon}
                <span className="font-lora font-light text-[15px] ">
                  {label}
                </span>
                {isSelected && <span className="ml-1 text-green-500">✅</span>}
              </button>
            );
          })}

          {/* Render custom activities already added */}

          {entryData.activities
            ?.filter((a) => !commonActivities.includes(a))
            .map((activity) => (
              <button
                key={activity}
                type="button"
                onClick={() => toggleActivitySelection(activity)}
                className="bg-primary-100 text-primary-800 dark:bg-primary-900/30 dark:text-primary-200 px-3 py-1.5 text-sm rounded-full ring-1 ring-primary-400"
              >
                {activity}
              </button>
            ))}
        </div>

        {/* Custom Activity Input */}
        <div className="flex rounded-lg shadow-sm">
          <input
            type="text"
            value={newActivityInput}
            onChange={(e) => setNewActivityInput(e.target.value)}
            className="font-lora font-light text-[15px] flex-1 px-4 py-2 border border-neutral-300 dark:border-neutral-700 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none bg-neutral-50 dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100 placeholder-neutral-400 dark:placeholder-neutral-500 transition-colors duration-200"
            placeholder="Add a new activity (e.g., 'Gardening')"
          />
          <button
            type="button"
            onClick={addCustomActivity}
            disabled={!newActivityInput.trim()}
            className={`px-5 py-2 font-lora font-semibold text-[15px] flex items-center ml-2 space-x-1 rounded-lg 
    text-white bg-primary-600 
    hover:bg-primary-700 active:scale-95 
    focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 
    dark:focus:ring-offset-neutral-900 
    transition-all duration-200 
    disabled:opacity-50 disabled:cursor-not-allowed disabled:shadow-none shadow-md`}
          >
            {" "}
            <FiPlus size={15} /> <span>Add</span>
          </button>
        </div>
      </div>

      {/* Image Upload Section */}
      <div>
        <label className="block text-[14px] font-libre-baskerville font-semibold text-neutral-700 dark:text-neutral-300 mb-3">
          Attach Images (optional)
        </label>
        <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-neutral-300 dark:border-neutral-700 border-dashed rounded-lg border-neutral-300 dark:border-neutral-700 transition-all duration-200 hover:border-primary-500 hover:bg-primary-50 dark:hover:bg-primary-900/10">
          <div className="space-y-1 text-center">
            <UploadCloud className="mx-auto h-12 w-12 text-neutral-400" />
            <div className="flex text-sm text-neutral-600 dark:text-neutral-400">
              <label
                htmlFor="file-upload"
                className="relative cursor-pointer bg-white dark:bg-neutral-900 rounded-md font-libre-baskerville font-semibold text-[13px] text-primary-600 hover:text-primary-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-primary-500"
              >
                <span>Upload files</span>
                <input
                  id="file-upload"
                  name="file-upload"
                  type="file"
                  className="sr-only"
                  multiple
                  onChange={handleImageFileChange}
                  accept="image/png, image/jpeg"
                />
              </label>
              <p className="pl-1 font-libre-baskerville text-[13px]">
                or drag and drop
              </p>
            </div>
            <p className="text-[14px] font-lora font-semibold text-neutral-500 dark:text-neutral-500">
              PNG, JPG up to 5MB each
            </p>
          </div>
        </div>
        {imagePreviews.length > 0 && (
          <div className="mt-4 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
            {imagePreviews.map((preview, index) => (
              <div key={index} className="relative group">
                <img
                  src={preview}
                  alt={`preview ${index}`}
                  className="h-28 w-full object-cover rounded-md shadow-sm border border-neutral-200 dark:border-neutral-700 transition-transform duration-300 ease-in-out group-hover:scale-[1.02]"
                />
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
        <label
          htmlFor="content"
          className="block text-[16px] font-libre-baskerville font-semibold text-neutral-700 dark:text-neutral-300 mb-2"
        >
          Journal Entry <span className="text-red-500">*</span>
        </label>
        <textarea
          id="content"
          name="content"
          value={entryData.content}
          onChange={handleInputChange}
          required
          className="font-lora font-light text-[16px] w-full px-4 py-2 border border-neutral-300 dark:border-neutral-700 rounded-lg 
      bg-neutral-50 dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100 
      placeholder-neutral-400 dark:placeholder-neutral-500 
      focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent 
      shadow-sm focus:shadow-primary-200/50 dark:focus:shadow-primary-900/30 
      min-h-[180px] resize-y transition-all duration-200"
          placeholder="Write your thoughts and experiences here..."
        />

        <div
          className="mt-4 p-3 border border-neutral-300 dark:border-neutral-700 rounded-md 
      bg-neutral-50 dark:bg-neutral-900 text-[14px] font-lora font-light prose dark:prose-invert max-w-none break-words"
        >
          <div
            dangerouslySetInnerHTML={{
              __html: DOMPurify.sanitize(marked(entryData.content || "")),
            }}
          />
        </div>
      </div>

      {/* Submit Button */}
      <div className="mt-6">
        <button
          type="submit"
          className="w-full flex items-center justify-center gap-2 px-6 py-3 text-base font-lora font-medium rounded-xl 
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
                {initialData.id ? "Saving..." : "Creating..."}
              </span>
            </>
          ) : initialData.id ? (
            "💾 Save Changes"
          ) : (
            "📝 Create Entry"
          )}
        </button>
      </div>
    </form>
  );
};

export default EntryForm;
