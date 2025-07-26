import { useNavigate } from 'react-router-dom';
import { useJournal } from '../contexts/JournalContext.jsx'; // Explicitly use .jsx extension
import { useAuth } from '../contexts/AuthContext.jsx';     // Explicitly use .jsx extension
import EntryForm from '../components/journal/EntryForm.jsx'; // Explicitly use .jsx extension

const CreateEntry = () => {
  // Destructure addEntry from your JournalContext
  const { addEntry } = useJournal();
  // Destructure user and loading from your AuthContext
  const { user, loading: authLoading } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = (formData) => {
    // Ensure user is authenticated and email is available before proceeding
    if (!user || !user.email) {
      console.error("User not authenticated or email not available. Cannot submit entry.");
      navigate('/login'); // Redirect to login page if not authenticated
      return;
    }

    // Call addEntry from JournalContext
    const newEntry = addEntry(formData);
    navigate(`/journal/${newEntry.id}`);
  };

  // Show a loading indicator while the authentication state is being determined
  if (authLoading) {
    return (
      <div className="max-w-2xl mx-auto text-center py-10 text-neutral-500 dark:text-neutral-400">
        Loading user session...
      </div>
    );
  }

  // If authentication is complete but no user is found, redirect to login
  if (!user) {
    navigate('/login');
    return null; // Don't render the form while redirecting
  }

  return (
    <div className="max-w-2xl mx-auto animate-fadeIn">
      <h1 className="text-2xl font-bold text-neutral-900 dark:text-white mb-6">
        New Journal Entry
      </h1>

      <div className="card p-6">
        {/* Pass the authenticated user's email to the EntryForm component */}
        <EntryForm onSubmit={handleSubmit} userEmail={user.email} />
      </div>
    </div>
  );
};

export default CreateEntry;
