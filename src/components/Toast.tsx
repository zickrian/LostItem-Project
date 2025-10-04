'use client';

import React, { useEffect } from 'react';

export type ToastType = 'success' | 'error';

export interface ToastProps {
  id: string;
  message: string;
  type: ToastType;
  duration?: number;
  onClose: (id: string) => void;
}

export const Toast: React.FC<ToastProps> = ({
  id,
  message,
  type,
  duration = 4000,
  onClose,
}) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose(id);
    }, duration);

    return () => clearTimeout(timer);
  }, [id, duration, onClose]);

  const bgColor = type === 'success' ? 'bg-green-500' : 'bg-red-500';
  const icon = type === 'success' ? '✓' : '✕';
  const iconColor = type === 'success' ? 'text-green-700' : 'text-red-700';

  return (
    <div
      className={`${bgColor} text-white px-4 py-3 rounded-lg shadow-lg mb-2 flex items-center gap-3 min-w-[300px] max-w-[500px] animate-slide-in`}
      role="alert"
    >
      <div className={`flex-shrink-0 w-6 h-6 rounded-full bg-white flex items-center justify-center font-bold ${iconColor}`}>
        {icon}
      </div>
      <p className="flex-1 text-sm font-medium">{message}</p>
      <button
        onClick={() => onClose(id)}
        className="flex-shrink-0 text-white hover:text-gray-200 transition-colors"
        aria-label="Tutup notifikasi"
      >
        <svg
          className="w-4 h-4"
          fill="currentColor"
          viewBox="0 0 20 20"
        >
          <path
            fillRule="evenodd"
            d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
            clipRule="evenodd"
          />
        </svg>
      </button>
    </div>
  );
};
