import { useState, useEffect, useMemo } from "react";
import { FiPlus, FiTrash2, FiEdit2, FiSave, FiDownload, FiHeart } from "react-icons/fi";
import { AnimatePresence, motion } from "framer-motion";

const GratitudePage = () => {
  const [entries, setEntries] = useState(() => {
    try {
      const stored = JSON.parse(localStorage.getItem("gratitudeEntries"));
      return Array.isArray(stored) ? stored : [];
    } catch {
      return [];
    }
  });

  const [gratitudes, setGratitudes] = useState(["", "", ""]);
  const [editEntryId, setEditEntryId] = useState(null);
  const [editItems, setEditItems] = useState([]);

  useEffect(() => {
    localStorage.setItem("gratitudeEntries", JSON.stringify(entries));
  }, [entries]);

  const handleSubmit = () => {
    if (gratitudes.every((item) => item.trim() === "")) return;

    const newEntry = {
      id: Date.now(),
      date: new Date().toISOString().split("T")[0],
      items: [...gratitudes],
    };
    setEntries((prev) => [newEntry, ...prev]);
    setGratitudes(["", "", ""]);
  };

  const deleteEntry = (id) => {
    if (confirm("Are you sure you want to delete this gratitude entry?")) {
      setEntries((prev) => prev.filter((e) => e.id !== id));
    }
  };

  const startEditing = (entry) => {
    setEditEntryId(entry.id);
    setEditItems([...entry.items]);
  };

  const saveEdit = (id) => {
    const updated = entries.map((entry) =>
      entry.id === id ? { ...entry, items: editItems } : entry
    );
    setEntries(updated);
    setEditEntryId(null);
    setEditItems([]);
  };

  const downloadEntry = (entry) => {
    const content = `Date: ${entry.date}\n\n${entry.items
      .map((item) => `• ${item}`)
      .join("\n")}`;
    const blob = new Blob([content], { type: "text/plain;charset=utf-8" });
    const url = window.URL.createObjectURL(blob);

    const link = document.createElement("a");
    link.href = url;
    link.download = `gratitude_${entry.date}.txt`;
    link.click();

    window.URL.revokeObjectURL(url);
  };

  const filteredEntries = useMemo(() => entries, [entries]);

  return (
    <div className="min-h-screen space-y-6 animate-fade-in">
      {/* Header Section */}
      <div className="glass-card p-6 rounded-2xl border-gradient">
        <div className="flex items-center space-x-3 mb-4">
          <div className="w-10 h-10 bg-gradient-accent rounded-xl flex items-center justify-center">
            <FiHeart className="w-5 h-5 text-white" />
          </div>
          <h1 className="text-2xl md:text-3xl font-bold gradient-text">
            Gratitude Journal
          </h1>
        </div>
        <p className="text-neutral-600 dark:text-neutral-300">
          Reflect on the things you're grateful for today
        </p>
        <div className="mt-2 text-sm text-neutral-500 dark:text-neutral-400">
          {entries.length} {entries.length === 1 ? "entry" : "entries"}
        </div>
      </div>

      {/* Input Section */}
      <div className="glass-card p-6 rounded-2xl border-gradient">
        <div className="flex items-center space-x-3 mb-4">
          <div className="w-8 h-8 bg-gradient-primary rounded-lg flex items-center justify-center">
            <FiPlus className="w-4 h-4 text-white" />
          </div>
          <h2 className="text-xl font-bold gradient-text">
            Today I'm grateful for...
          </h2>
        </div>
        
        <div className="space-y-3">
          {gratitudes.map((value, index) => (
            <input
              key={index}
              type="text"
              className="input text-neutral-700 dark:text-neutral-200 placeholder-neutral-500 dark:placeholder-neutral-400"
              placeholder={`Grateful for... #${index + 1}`}
              value={value}
              onChange={(e) =>
                setGratitudes((prev) => {
                  const updated = [...prev];
                  updated[index] = e.target.value;
                  return updated;
                })
              }
            />
          ))}
        </div>
        
        <button
          onClick={handleSubmit}
          className="btn btn-primary mt-4 flex items-center space-x-2 hover:shadow-glow"
        >
          <FiPlus size={16} />
          <span>Save Gratitude</span>
        </button>
      </div>

      {/* Entry List */}
      <AnimatePresence>
        {filteredEntries.length > 0 ? (
          <div className="space-y-4">
            {filteredEntries.map((entry) => (
              <motion.div
                key={entry.id}
                className="glass-card p-6 rounded-xl border-gradient"
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.2 }}
              >
                <div className="flex justify-between items-center mb-4">
                  <h3 className="font-semibold text-neutral-700 dark:text-neutral-200">
                    {entry.date}
                  </h3>
                  <div className="flex space-x-2 items-center">
                    {editEntryId === entry.id ? (
                      <button
                        onClick={() => saveEdit(entry.id)}
                        className="p-2 rounded-lg text-success-600 hover:text-success-700 hover:bg-success-50 dark:hover:bg-success-900/20 transition-colors"
                        title="Save"
                      >
                        <FiSave size={16} />
                      </button>
                    ) : (
                      <button
                        onClick={() => startEditing(entry)}
                        className="p-2 rounded-lg text-primary-600 hover:text-primary-700 hover:bg-primary-50 dark:hover:bg-primary-900/20 transition-colors"
                        title="Edit"
                      >
                        <FiEdit2 size={16} />
                      </button>
                    )}
                    <button
                      onClick={() => downloadEntry(entry)}
                      className="p-2 rounded-lg text-secondary-600 hover:text-secondary-700 hover:bg-secondary-50 dark:hover:bg-secondary-900/20 transition-colors"
                      title="Download"
                    >
                      <FiDownload size={16} />
                    </button>
                    <button
                      onClick={() => deleteEntry(entry.id)}
                      className="p-2 rounded-lg text-error-600 hover:text-error-700 hover:bg-error-50 dark:hover:bg-error-900/20 transition-colors"
                      title="Delete"
                    >
                      <FiTrash2 size={16} />
                    </button>
                  </div>
                </div>

                {editEntryId === entry.id ? (
                  <div className="space-y-3">
                    {editItems.map((item, idx) => (
                      <input
                        key={idx}
                        type="text"
                        className="input text-neutral-700 dark:text-neutral-200 placeholder-neutral-500 dark:placeholder-neutral-400"
                        value={item}
                        onChange={(e) => {
                          const updated = [...editItems];
                          updated[idx] = e.target.value;
                          setEditItems(updated);
                        }}
                      />
                    ))}
                  </div>
                ) : (
                  <ul className="list-disc pl-5 text-neutral-700 dark:text-neutral-200 space-y-2">
                    {entry.items.map(
                      (item, idx) => item.trim() && <li key={idx}>{item}</li>
                    )}
                  </ul>
                )}
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="glass-card p-8 rounded-2xl border-gradient text-center">
            <div className="w-16 h-16 bg-neutral-200 dark:bg-neutral-700 rounded-full flex items-center justify-center mx-auto mb-4">
              <FiHeart className="w-8 h-8 text-neutral-400" />
            </div>
            <h3 className="text-lg font-semibold text-neutral-700 dark:text-neutral-200 mb-2">
              No entries yet!
            </h3>
            <p className="text-neutral-500 dark:text-neutral-400">
              Start by writing down three things you're grateful for today.
            </p>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default GratitudePage;
