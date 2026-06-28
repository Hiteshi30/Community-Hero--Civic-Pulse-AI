import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Compass } from 'lucide-react';

export const NotFound: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#07070B] flex flex-col items-center justify-center p-6 text-center space-y-6">
      <div className="w-16 h-16 bg-indigo-50 text-indigo-600 dark:bg-indigo-950/40 dark:text-indigo-400 rounded-3xl flex items-center justify-center animate-bounce shadow-md">
        <Compass className="w-8 h-8" />
      </div>

      <div className="space-y-2">
        <h2 className="text-3xl font-black">404 - Page Not Found</h2>
        <p className="text-xs text-slate-400 max-w-sm mx-auto leading-relaxed">The coordinate you requested is outside of our municipal border, or does not exist.</p>
      </div>

      <button
        id="not-found-back-home"
        onClick={() => navigate('/')}
        className="px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl text-xs transition-all shadow-md shadow-indigo-100 dark:shadow-none"
      >
        Return to Pulse Central
      </button>
    </div>
  );
};
