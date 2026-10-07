import React from 'react';
import { Modal } from './Modal';
import { AlertTriangle } from 'lucide-react';

interface ConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title?: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  isLoading?: boolean;
}

export const ConfirmModal: React.FC<ConfirmModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  title = 'Konfirmasi Hapus',
  message,
  confirmText = 'Hapus',
  cancelText = 'Batal',
  isLoading = false,
}) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose} title={title} maxWidth="sm">
      <div className="flex flex-col items-center text-center py-2">
        <div className="w-12 h-12 rounded-full bg-rose-500/10 border border-rose-500/20 flex items-center justify-center text-rose-500 mb-4">
          <AlertTriangle className="w-6 h-6" />
        </div>
        <p className="text-sm text-slate-300 mb-6">{message}</p>
        <div className="flex items-center gap-3 w-full">
          <button
            onClick={onClose}
            disabled={isLoading}
            className="flex-1 px-4 py-2.5 rounded-xl border border-slate-700 bg-slate-800 text-slate-300 font-medium text-sm hover:bg-slate-700 transition-colors disabled:opacity-50"
          >
            {cancelText}
          </button>
          <button
            onClick={onConfirm}
            disabled={isLoading}
            className="flex-1 px-4 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-medium text-sm transition-colors disabled:opacity-50 flex items-center justify-center gap-2 shadow-lg shadow-rose-600/20"
          >
            {isLoading ? 'Menghapus...' : confirmText}
          </button>
        </div>
      </div>
    </Modal>
  );
};
