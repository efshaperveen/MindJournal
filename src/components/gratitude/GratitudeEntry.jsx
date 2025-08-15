import React, { useState } from 'react';
import { FiHeart, FiSave } from 'react-icons/fi';

export default function GratitudeEntry({ onSubmit }) {
  const [items, setItems] = useState(["", "", ""]);

  const handleChange = (index, value) => {
    const updated = [...items];
    updated[index] = value;
    setItems(updated);
  };

  const handleSave = () => {
    if (items.some(item => item.trim() !== "")) {
      onSubmit(items);
      setItems(["", "", ""]);
    }
  };

  return (
    <div className="glass-card p-6 rounded-2xl border-gradient">
      <div className="flex items-center space-x-3 mb-4">
        <div className="w-8 h-8 bg-gradient-accent rounded-lg flex items-center justify-center">
          <FiHeart className="w-4 h-4 text-white" />
        </div>
        <h2 className="text-xl font-bold gradient-text">What are you grateful for today?</h2>
      </div>
      
      <div className="space-y-3">
        {items.map((item, idx) => (
          <input
            key={idx}
            type="text"
            placeholder={`Grateful for... #${idx + 1}`}
            value={item}
            onChange={(e) => handleChange(idx, e.target.value)}
            className="input text-neutral-700 dark:text-neutral-200 placeholder-neutral-500 dark:placeholder-neutral-400"
          />
        ))}
      </div>
      
      <button
        onClick={handleSave}
        className="btn btn-primary mt-4 flex items-center space-x-2 hover:shadow-glow"
      >
        <FiSave size={16} />
        <span>Save Gratitude</span>
      </button>
    </div>
  );
}
