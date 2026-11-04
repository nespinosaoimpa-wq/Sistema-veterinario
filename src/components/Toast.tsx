import React from 'react';

interface ToastProps {
  show: boolean;
  title: string;
  subtitle: string;
  icon?: string;
  type?: 'call' | 'info' | 'success';
  onClose: () => void;
}

export const Toast: React.FC<ToastProps> = ({
  show,
  title,
  subtitle,
  icon = 'ring_volume',
  onClose,
}) => {
  if (!show) return null;

  return (
    <div className="fixed top-20 inset-x-margin z-50 max-w-md mx-auto bg-inverse-surface text-inverse-on-surface rounded-2xl p-space-md shadow-2xl flex items-center gap-space-sm animate-in slide-in-from-top-4 duration-300">
      <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center text-on-primary flex-shrink-0 shadow-md">
        <span className="material-symbols-outlined text-[20px]">{icon}</span>
      </div>
      <div className="flex flex-col flex-1 min-w-0 text-left">
        <span className="font-label-md text-label-md font-bold leading-tight">{title}</span>
        <span className="font-body-sm text-body-sm opacity-90 truncate mt-0.5">{subtitle}</span>
      </div>
      <button 
        onClick={onClose}
        className="text-inverse-on-surface opacity-70 hover:opacity-100 p-1 rounded-full transition-opacity"
      >
        <span className="material-symbols-outlined text-[18px]">close</span>
      </button>
    </div>
  );
};

