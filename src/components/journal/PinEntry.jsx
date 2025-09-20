import { useState } from 'react';
import { FiShield } from 'react-icons/fi';

const PinEntry = ({ onPinVerified, onPinSet, mode = "verify" }) => {
  const [pin, setPin] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    setError("");

    if (mode === "set") {
      if (pin.length < 4) {
        setError("PIN must be at least 4 digits long");
        return;
      }
      onPinSet(pin);
      setPin("");
    } else {
      if (!onPinVerified(pin)) {
        setError("Invalid PIN. Please try again.");
        setPin("");
      }
    }
  };

  return (
    <div className="flex flex-col items-center justify-center h-full p-4 text-center">
      <FiShield size={48} className="text-neutral-400 dark:text-neutral-500 mb-4" />
      <h2 className="text-xl font-bold text-neutral-800 dark:text-white mb-2">
        {mode === "set" ? "Set a Vault PIN" : "Enter Vault PIN"}
      </h2>
      <p className="text-neutral-600 dark:text-neutral-400 mb-6">
        {mode === "set"
          ? "Create a 4-digit PIN to secure your journal."
          : "This area is protected. Please enter your 4-digit PIN to continue."}
      </p>

      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSubmit();
        }}
        className="w-full max-w-xs">
        <input
          type="password"
          value={pin}
          onChange={(e) => setPin(e.target.value)}
          maxLength="4"
          className="input text-center text-2xl tracking-[1rem] w-full"
          placeholder="••••" />
        {error && (
          <p className="text-sm text-red-600 dark:text-red-400 mt-2">{error}</p>
        )}
        <button type="submit" className="btn btn-primary w-full mt-4">
          {mode === "set" ? "Save PIN" : "Unlock"}
        </button>
      </form>
    </div>
  );
};

export default PinEntry;
