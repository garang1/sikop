import React, { useEffect } from 'react';
import { AlertTriangle, Info, ShieldAlert } from 'lucide-react';

interface ConfirmModalProps {
  isOpen: boolean;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  type?: 'info' | 'danger' | 'warning';
  onConfirm: () => void;
  onCancel: () => void;
}

export default function ConfirmModal({
  isOpen,
  title,
  message,
  confirmText = 'Ya, Lanjutkan',
  cancelText = 'Batal',
  type = 'info',
  onConfirm,
  onCancel
}: ConfirmModalProps) {
  // Prevent background scrolling when open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const getIcon = () => {
    switch (type) {
      case 'danger':
        return <ShieldAlert className="w-8 h-8 text-rose-600 animate-bounce" />;
      case 'warning':
        return <AlertTriangle className="w-8 h-8 text-amber-500" />;
      default:
        return <Info className="w-8 h-8 text-blue-600" />;
    }
  };

  const getConfirmBtnColor = () => {
    switch (type) {
      case 'danger':
        return 'bg-rose-600 hover:bg-rose-700 focus:ring-rose-500 text-white';
      case 'warning':
        return 'bg-amber-600 hover:bg-amber-700 focus:ring-amber-500 text-white';
      default:
        return 'bg-blue-600 hover:bg-blue-700 focus:ring-blue-500 text-white';
    }
  };

  const getHeaderBg = () => {
    switch (type) {
      case 'danger':
        return 'bg-rose-50 border-rose-100';
      case 'warning':
        return 'bg-amber-50 border-amber-100';
      default:
        return 'bg-blue-50 border-blue-100';
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 animate-fade-in" id="custom-confirm-modal">
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs transition-opacity" 
        onClick={onCancel}
      />

      {/* Modal Content */}
      <div className="bg-white border border-slate-200 shadow-2xl rounded-xl w-full max-w-md overflow-hidden relative z-10 transform transition-all scale-100">
        {/* Header decoration */}
        <div className={`p-5 border-b flex items-start gap-4 ${getHeaderBg()}`}>
          <div className="p-2.5 bg-white rounded-lg border border-slate-100 shadow-sm shrink-0">
            {getIcon()}
          </div>
          <div className="space-y-1">
            <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wide font-sans">{title}</h3>
            <span className="text-[10px] font-mono font-bold tracking-widest text-[#94a3b8] uppercase">Aksi Konfirmasi</span>
          </div>
        </div>

        {/* Body Text */}
        <div className="p-6">
          <p className="text-xs text-slate-500 leading-relaxed font-semibold col-span-2">
            {message}
          </p>
        </div>

        {/* Footer controls */}
        <div className="p-4 bg-slate-50 border-t border-slate-150 flex justify-end gap-2.5">
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2 bg-white border border-slate-200 hover:bg-slate-50 hover:border-slate-300 text-slate-700 rounded text-xs font-bold uppercase tracking-wide transition cursor-pointer"
          >
            {cancelText}
          </button>
          <button
            type="button"
            onClick={() => {
              onConfirm();
            }}
            className={`px-4.5 py-2 rounded text-xs font-bold uppercase tracking-wide transition shadow-sm cursor-pointer ${getConfirmBtnColor()}`}
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
}
