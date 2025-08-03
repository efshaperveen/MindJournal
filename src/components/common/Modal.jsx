import { FiX } from 'react-icons/fi';

const Modal = ({ isOpen, onClose, title, children, position = 'center' }) => {
  if (!isOpen) return null;

  const positionClasses = {
    center: 'justify-center items-center',
    bottom: 'justify-center items-end',
  };

  return (
    <div 
      className={`fixed inset-0 bg-black bg-opacity-50 z-50 flex p-4 ${positionClasses[position]}`}
      onClick={onClose}
    >
      <div 
        className="bg-white dark:bg-neutral-800 rounded-lg shadow-xl w-full max-w-md animate-fadeIn"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-xl font-bold text-neutral-900 dark:text-white">
              {title}
            </h3>
            <button 
              onClick={onClose}
              className="p-2 rounded-full text-neutral-500 dark:text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-700"
              aria-label="Close modal"
            >
              <FiX size={24} />
            </button>
          </div>
          <div>{children}</div>
        </div>
      </div>
    </div>
  );
};

export default Modal;
