import { Modal } from "./Modal";

interface InstructionModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function InstructionModal({ isOpen, onClose }: InstructionModalProps) {
  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <div className="p-6">
        <h2 className="text-xl font-bold text-gray-900 mb-4">連絡先への追加</h2>
        <div className="mb-4">
          <img
            src="./add-remove-contacts.png"
            alt="連絡先追加手順"
            className="w-full rounded-lg "
          />
        </div>
        <div className="mt-2 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
          >
            閉じる
          </button>
        </div>
      </div>
    </Modal>
  );
}
