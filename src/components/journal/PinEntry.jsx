import { useState } from 'react';
import { FiShield } from 'react-icons/fi';

const PinEntry = ({ onPinVerified }) => {
  const [pin, setPin] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');
    if (!onPinVerified(pin)) {
      setError('Invalid PIN. Please try again.');
      setPin('');
    }
  };

  return (
    <div className="flex flex-col items-center justify-center h-full p-4 text-center">
      <FiShield size={48} className="text-neutral-400 dark:text-neutral-500 mb-4" />
      <h2 className="text-xl font-bold text-neutral-800 dark:text-white mb-2">
        Enter PIN to Unlock Vault
      </h2>
      <p className="text-neutral-600 dark:text-neutral-400 mb-6">
        This area is protected. Please enter your 4-digit PIN to continue.
      </p>
      <form onSubmit={handleSubmit} className="w-full max-w-xs">
        <input
          type="password"
          value={pin}
          onChange={(e) => setPin(e.target.value)}
          maxLength="4"
          className="input text-center text-2xl tracking-[1rem] w-full"
          placeholder="••••"
        />
        {error && <p className="text-sm text-red-600 dark:text-red-400 mt-2">{error}</p>}
        <button type="submit" className="btn btn-primary w-full mt-4">
          Unlock
        </button>
      </form>
    </div>
  );
};

export default PinEntry;
