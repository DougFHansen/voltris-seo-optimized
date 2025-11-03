import React from 'react';

interface ConfirmModalProps {
  open: boolean;
  message: string;
  confirmText?: string;
  cancelText?: string;
  onConfirm: () => void;
  onCancel: () => void;
}

const ConfirmModal: React.FC<ConfirmModalProps> = ({
  open,
  message,
  confirmText = 'Remover',
  cancelText = 'Cancelar',
  onConfirm,
  onCancel,
}) => {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70">
      <div className="bg-gradient-to-br from-[#1E1E1E] to-[#232323] border border-[#8B31FF]/30 rounded-2xl shadow-2xl p-8 min-w-[320px] max-w-[90vw] animate-fade-in">
        <h3 className="text-xl font-bold mb-4 text-transparent bg-clip-text bg-gradient-to-r from-[#FF4B6B] via-[#8B31FF] to-[#31A8FF] text-center">Confirmação</h3>
        <p className="text-white text-center mb-8 text-base">{message}</p>
        <div className="flex justify-center gap-4">
          <button
            className="px-6 py-2 rounded-lg font-semibold bg-[#232323] border border-[#8B31FF]/40 text-gray-200 hover:bg-[#8B31FF]/20 transition"
            onClick={onCancel}
            type="button"
          >
            {cancelText}
          </button>
          <button
            className="px-6 py-2 rounded-lg font-semibold bg-gradient-to-r from-[#FF4B6B] to-[#8B31FF] text-white shadow hover:brightness-110 transition"
            onClick={onConfirm}
            type="button"
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmModal; 