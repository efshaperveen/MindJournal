import { useParams, useNavigate } from 'react-router-dom';
import { useJournal } from '../contexts/JournalContext.jsx'; // Explicitly use .jsx extension
import { useAuth } from '../contexts/AuthContext.jsx';     // Explicitly use .jsx extension
import EntryForm from '../components/journal/EntryForm.jsx'; // Explicitly use .jsx extension
import { FiArrowLeft } from 'react-icons/fi';

const EditEntry = () => {
  const { id } = useParams();
  const { getEntry, updateEntry } = useJournal();
  const { user, loading: authLoading } = useAuth(); // Destructure user and loading from AuthContext
  const navigate = useNavigate();

  // Show loading state while authentication is in progress
  if (authLoading) {
    return (
      <div className="max-w-2xl mx-auto text-center py-10 text-neutral-500 dark:text-neutral-400">
        Loading user session...
      </div>
    );
  }

  // Redirect to login if no user is found after loading
  if (!user) {
    navigate('/login');
    return null;
  }

  const entry = getEntry(id);

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
    );
  }

  const handleSubmit = (formData) => {
    // Ensure user is authenticated before submitting
    if (!user || !user.email) {
      console.error("User not authenticated or email not available. Cannot update entry.");
      navigate('/login');
      return;
    }

    updateEntry(id, formData);
    navigate(`/journal/${id}`);
  };

  return (
    <div className="max-w-2xl mx-auto animate-fadeIn">
      <div className="flex items-center mb-6">
        <button
          onClick={() => navigate(`/journal/${id}`)}
          className="mr-4 p-2 rounded-full bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-300 hover:bg-neutral-200 dark:hover:bg-neutral-700 transition-colors"
          aria-label="Back"
        >
          <FiArrowLeft size={18} />
        </button>
        <h1 className="text-2xl font-bold text-neutral-900 dark:text-white">
          Edit Entry
        </h1>
      </div>

      <div className="card p-6">
        {/* Pass the authenticated user's email to the EntryForm */}
        <EntryForm onSubmit={handleSubmit} initialData={entry} userEmail={user.email} />
      </div>
    </div>
  );
};

export default EditEntry;
