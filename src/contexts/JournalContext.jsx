import { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext';

const JournalContext = createContext();

export const useJournal = () => useContext(JournalContext);

export const JournalProvider = ({ children }) => {
  const { user } = useAuth();
  const [entries, setEntries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeEntry, setActiveEntry] = useState(null);
  const [pin, setPin] = useState(null);
  const [hasVaultPin, setHasVaultPin] = useState(false);
  const [privateEntryIds, setPrivateEntryIds] = useState([]);
  const [isVaultUnlocked, setIsVaultUnlocked] = useState(false);
  const [entryToMakePrivate, setEntryToMakePrivate] = useState(null);

  // This effect will reliably load entries from localStorage when the user is available
  // and will re-run if the user logs in or out.
  useEffect(() => {
    if (user) {
      try {
        const storedEntries = localStorage.getItem(`journal_entries_${user.id}`);
        if (storedEntries) {
          setEntries(JSON.parse(storedEntries));
        } else {
          setEntries([]); // Ensure entries are cleared if nothing is in storage for the user
        }
      } catch (error) {
        console.error("Failed to parse journal entries from localStorage", error);
        setEntries([]); // Reset to empty array on error
      }
     const storedPin = localStorage.getItem(`journal_pin_${user.id}`);
     if (storedPin) {
       setPin(JSON.parse(storedPin));
       setHasVaultPin(true);
     } else {
       setPin(null);
       setHasVaultPin(false);
     }

      const storedPrivateIds = localStorage.getItem(`journal_private_entries_${user.id}`);
      if (storedPrivateIds) setPrivateEntryIds(JSON.parse(storedPrivateIds));

      setLoading(false);
    } else {
      // If there is no user, clear entries and stop loading.
      setEntries([]);
      setPin(null);
      setPrivateEntryIds([]);
      setIsVaultUnlocked(false);
      setLoading(false);
    }
  }, [user]);

  // This effect saves entries to localStorage whenever they change.
  useEffect(() => {
    // We only save if there's a user and the initial loading is complete.
    if (user && !loading) {
      localStorage.setItem(`journal_entries_${user.id}`, JSON.stringify(entries));
      localStorage.setItem(`journal_pin_${user.id}`, JSON.stringify(pin));
      localStorage.setItem(`journal_private_entries_${user.id}`, JSON.stringify(privateEntryIds));
    }
  }, [entries, pin, privateEntryIds, user, loading]);

  const verifyPin = (enteredPin) => {
    if (pin === enteredPin) {
      setIsVaultUnlocked(true);
      return true;
    }
    return false;
  };

  const setVaultPin = (newPin) => {
    setPin(newPin);
        setHasVaultPin(true);
        localStorage.setItem(`journal_pin_${user.id}`, JSON.stringify(newPin));
  };

  const togglePrivacy = (entryId) => {
    setPrivateEntryIds(prev => {
      const isPrivate = prev.includes(entryId);
      if (isPrivate) {
        return prev.filter(id => id !== entryId);
      } else {
        return [...prev, entryId];
      }
    });
  };
  
  const logoutVault = () => {
    setIsVaultUnlocked(false);
  };

  const addEntry = (entry, quote = null) => {
    const newEntry = {
      id: Date.now().toString(),
      ...entry,
      quote,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    
    setEntries(prev => [newEntry, ...prev]);
    return newEntry;
  };

  const updateEntry = (id, updatedEntry) => {
    let entryToReturn = null;
    setEntries(prev => 
      prev.map(entry => {
        if (entry.id === id) {
          entryToReturn = { 
            ...entry, 
            ...updatedEntry, 
            updatedAt: new Date().toISOString() 
          };
          return entryToReturn;
        }
        return entry;
      })
    );
    return entryToReturn;
  };

  const deleteEntry = (id) => {
    setEntries(prev => prev.filter(entry => entry.id !== id));
  };

  const getEntry = (id) => {
    return entries.find(entry => entry.id === id);
  };

  const requestPinToLock = (entryId) => {
    setEntryToMakePrivate(entryId);
  };

  const cancelPinToLock = () => {
    setEntryToMakePrivate(null);
  };

  const confirmPinToLock = (enteredPin) => {
    if (pin === enteredPin) {
      if (entryToMakePrivate) {
        togglePrivacy(entryToMakePrivate);
        setEntryToMakePrivate(null);
        return true;
      }
    }
    return false;
  };

  return (
    <JournalContext.Provider value={{
      entries,
      loading,
      addEntry,
      updateEntry,
      deleteEntry,
      getEntry,
      activeEntry,
      setActiveEntry,
      pin,
      setPin,
      hasVaultPin,
      setVaultPin,
      privateEntryIds,
      togglePrivacy,
      isVaultUnlocked,
      verifyPin,
      logoutVault,
      entryToMakePrivate,
      requestPinToLock,
      cancelPinToLock,
      confirmPinToLock
    }}>
      {children}
    </JournalContext.Provider>
  );
};
