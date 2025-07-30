import { useNavigate } from "react-router-dom";
import { useJournal } from "../contexts/JournalContext";
import EntryForm from "../components/journal/EntryForm";

const CreateEntry = () => {

  const { addEntry } = useJournal()
  const navigate = useNavigate()
  
  const handleSubmit = (formData, quote) => {
    const newEntry = addEntry(formData, quote);
    navigate(`/journal/${newEntry.id}`);
    return newEntry;
  }
 
  return (
    <div className="max-w-2xl mx-auto animate-fadeIn">
      <h1
        className="text-[23px] font-libre-baskerville
      font-medium text-neutral-900 dark:text-white mb-6"
      >
        New Journal Entry
      </h1>

      <div className="card p-6">
        <EntryForm onSubmit={handleSubmit} />
      </div>
    </div>
  );
};

export default CreateEntry;
