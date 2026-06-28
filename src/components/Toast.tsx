import React, { useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { X, CheckCircle, AlertTriangle, Info } from 'lucide-react';

export const Toast: React.FC = () => {
  const { toast, hideToast } = useApp();

  useEffect(() => {
    if (toast.visible) {
      const timer = setTimeout(() => {
        hideToast();
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [toast.visible, hideToast]);

  if (!toast.visible) return null;

  const styles = {
    success: 'bg-emerald-50 text-emerald-800 border-emerald-200 dark:bg-emerald-950/50 dark:text-emerald-300 dark:border-emerald-800/50',
    error: 'bg-rose-50 text-rose-800 border-rose-200 dark:bg-rose-950/50 dark:text-rose-300 dark:border-rose-800/50',
    info: 'bg-indigo-50 text-indigo-800 border-indigo-200 dark:bg-indigo-950/50 dark:text-indigo-300 dark:border-indigo-800/50',
  };

  const icons = {
    success: <CheckCircle className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />,
    error: <AlertTriangle className="w-5 h-5 text-rose-600 dark:text-rose-400" />,
    info: <Info className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />,
  };

  return (
    <div 
      id="toast-container"
      className="fixed bottom-6 right-6 z-50 flex items-center gap-3 p-4 rounded-xl border shadow-lg glass max-w-md animate-float transition-all duration-300"
    >
      {icons[toast.type]}
      <p className="text-sm font-medium pr-4">{toast.message}</p>
      <button 
        id="close-toast-btn"
        onClick={hideToast} 
        className="p-1 rounded-lg hover:bg-slate-200/50 dark:hover:bg-zinc-800/50 transition-colors"
      >
        <X className="w-4 h-4 text-slate-500" />
      </button>
    </div>
  );
};
