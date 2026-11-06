import React from 'react';
import { useStore } from '../context/StoreContext';
import { CheckCircle2, Info, AlertTriangle, X } from 'lucide-react';

export const ToastContainer: React.FC = () => {
  const { toasts, dismissToast } = useStore();

  if (toasts.length === 0) return null;

  return (
    <div className="fixed bottom-5 right-5 z-50 flex flex-col gap-2 max-w-sm w-full pointer-events-none">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className="pointer-events-auto p-3.5 bg-neutral-900 text-white rounded-xl shadow-xl flex items-center justify-between gap-3 border border-neutral-800 text-xs animate-in slide-in-from-bottom-2 duration-200"
        >
          <div className="flex items-center gap-2.5">
            {toast.type === 'error' ? (
              <AlertTriangle className="w-4 h-4 text-red-400 shrink-0" />
            ) : toast.type === 'info' ? (
              <Info className="w-4 h-4 text-blue-400 shrink-0" />
            ) : (
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            )}
            <span className="font-medium">{toast.message}</span>
          </div>
          <button
            onClick={() => dismissToast(toast.id)}
            className="text-neutral-400 hover:text-white p-1 cursor-pointer"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      ))}
    </div>
  );
};
