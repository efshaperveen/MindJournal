import { useJournal } from '../contexts/JournalContext';
import PinEntry from '../components/journal/PinEntry';
import EntryCard from '../components/journal/EntryCard';
import { FiLock, FiUnlock } from 'react-icons/fi';

const PrivateVault = () => {
  const {
    entries,
    privateEntryIds,
    isVaultUnlocked,
    verifyPin,
    logoutVault,
    deleteEntry,
  } = useJournal();

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this entry? This action cannot be undone.')) {
      deleteEntry(id);
    }
  };

  if (!isVaultUnlocked) {
    return <PinEntry onPinVerified={verifyPin} />;
  }

  const privateEntries = entries.filter(entry => privateEntryIds.includes(entry.id));

  return (
    <div className="animate-fadeIn">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl md:text-3xl font-bold text-neutral-900 dark:text-white">
          Private Vault
        </h1>
        <button
          onClick={logoutVault}
          className="btn btn-outline btn-sm flex items-center"
        >
          <FiLock className="mr-2" />
          Lock Vault
        </button>
      </div>

      {privateEntries.length > 0 ? (
        <div className="space-y-4">
          {privateEntries.map(entry => (
            <EntryCard key={entry.id} entry={entry} onDelete={handleDelete} />
          ))}
        </div>
      ) : (
        <div className="text-center py-16">
          <FiUnlock size={48} className="mx-auto text-neutral-400 dark:text-neutral-500 mb-4" />
          <h3 className="text-xl font-semibold text-neutral-800 dark:text-white">
            Your Vault is Empty
          </h3>
          <p className="text-neutral-600 dark:text-neutral-400 mt-2">
            You can move an entry to the vault from the main journal page.
          </p>
        </div>
      )}
    </div>
  );
};

export default PrivateVault;
