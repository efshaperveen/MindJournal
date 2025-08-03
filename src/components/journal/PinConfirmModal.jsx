import { useJournal } from '../../contexts/JournalContext';
import Modal from '../common/Modal';
import PinEntry from './PinEntry';

const PinConfirmModal = () => {
  const { entryToMakePrivate, cancelPinToLock, confirmPinToLock } = useJournal();

  const handlePinVerified = (pin) => {
    return confirmPinToLock(pin);
  };

  return (
    <Modal
      isOpen={!!entryToMakePrivate}
      onClose={cancelPinToLock}
      title="Confirm Action"
    >
      <div className="p-4">
        <PinEntry onPinVerified={handlePinVerified} />
      </div>
    </Modal>
  );
};

export default PinConfirmModal;
