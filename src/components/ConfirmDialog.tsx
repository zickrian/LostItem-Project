'use client';

import React, { useEffect } from 'react';
import { 
  ExclamationTriangleIcon, 
  TrashIcon,
  InformationCircleIcon,
  XMarkIcon
} from '@heroicons/react/24/outline';

export interface ConfirmDialogProps {
  isOpen: boolean;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  onConfirm: () => void;
  onCancel: () => void;
  type?: 'danger' | 'warning' | 'info';
}

export const ConfirmDialog: React.FC<ConfirmDialogProps> = ({
  isOpen,
  title,
  message,
  confirmText = 'OK',
  cancelText = 'Batal',
  onConfirm,
  onCancel,
  type = 'warning',
}) => {
  // Prevent body scroll when dialog is open
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

  // Handle ESC key
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onCancel();
      }
    };
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, [isOpen, onCancel]);

  if (!isOpen) return null;

  const getStyles = () => {
    switch (type) {
      case 'danger':
        return {
          iconBg: 'from-red-500 to-red-600',
          iconColor: 'text-white',
          iconRing: 'ring-red-200',
          confirmBg: 'bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800',
          confirmText: 'text-white',
          titleColor: 'text-red-900',
          borderColor: 'border-red-200',
        };
      case 'warning':
        return {
          iconBg: 'from-yellow-400 to-yellow-500',
          iconColor: 'text-white',
          iconRing: 'ring-yellow-200',
          confirmBg: 'bg-gradient-to-r from-yellow-500 to-yellow-600 hover:from-yellow-600 hover:to-yellow-700',
          confirmText: 'text-white',
          titleColor: 'text-yellow-900',
          borderColor: 'border-yellow-200',
        };
      case 'info':
        return {
          iconBg: 'from-blue-500 to-blue-600',
          iconColor: 'text-white',
          iconRing: 'ring-blue-200',
          confirmBg: 'bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800',
          confirmText: 'text-white',
          titleColor: 'text-blue-900',
          borderColor: 'border-blue-200',
        };
      default:
        return {
          iconBg: 'from-yellow-400 to-yellow-500',
          iconColor: 'text-white',
          iconRing: 'ring-yellow-200',
          confirmBg: 'bg-gradient-to-r from-yellow-500 to-yellow-600 hover:from-yellow-600 hover:to-yellow-700',
          confirmText: 'text-white',
          titleColor: 'text-yellow-900',
          borderColor: 'border-yellow-200',
        };
    }
  };

  const styles = getStyles();

  const getIcon = () => {
    const iconClass = "w-8 h-8 sm:w-10 sm:h-10";
    switch (type) {
      case 'danger':
        return <TrashIcon className={iconClass} />;
      case 'warning':
        return <ExclamationTriangleIcon className={iconClass} />;
      case 'info':
        return <InformationCircleIcon className={iconClass} />;
      default:
        return <ExclamationTriangleIcon className={iconClass} />;
    }
  };

  return (
    <div 
      className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/70 backdrop-blur-md animate-fade-in"
      onClick={onCancel}
    >
      <div 
        className={`bg-white rounded-3xl shadow-2xl max-w-md w-full animate-scale-in border-4 ${styles.borderColor} overflow-hidden`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onCancel}
          className="absolute top-4 right-4 p-2 rounded-full bg-gray-100 hover:bg-gray-200 transition-all duration-200 group"
          aria-label="Close dialog"
        >
          <XMarkIcon className="w-5 h-5 text-gray-600 group-hover:text-gray-900 transition-colors" />
        </button>

        <div className="p-6 sm:p-8 relative">
          {/* Icon with animation */}
          <div className="flex items-center justify-center mb-6">
            <div className={`bg-gradient-to-br ${styles.iconBg} ${styles.iconColor} rounded-full p-5 shadow-2xl ${styles.iconRing} ring-8 animate-pulse-slow relative`}>
              {getIcon()}
              <div className={`absolute inset-0 rounded-full bg-gradient-to-br ${styles.iconBg} opacity-50 animate-ping`}></div>
            </div>
          </div>

          {/* Title */}
          <h3 className={`text-2xl sm:text-3xl font-black ${styles.titleColor} text-center mb-4 leading-tight`}>
            {title}
          </h3>

          {/* Message */}
          <p className="text-gray-700 text-center mb-8 text-sm sm:text-base leading-relaxed font-medium px-2">
            {message}
          </p>

          {/* Buttons */}
          <div className="flex flex-col sm:flex-row gap-3">
            <button
              onClick={onCancel}
              className="flex-1 px-5 py-3.5 bg-gray-100 hover:bg-gray-200 text-gray-800 font-bold rounded-xl transition-all duration-200 border-2 border-gray-300 hover:border-gray-400 transform hover:-translate-y-0.5 hover:shadow-lg active:translate-y-0 active:shadow-sm"
            >
              {cancelText}
            </button>
            <button
              onClick={onConfirm}
              className={`flex-1 px-5 py-3.5 ${styles.confirmBg} ${styles.confirmText} font-bold rounded-xl transition-all duration-200 shadow-lg hover:shadow-2xl transform hover:-translate-y-0.5 active:translate-y-0 active:shadow-md`}
            >
              {confirmText}
            </button>
          </div>
        </div>

        {/* Decorative bottom border */}
        <div className={`h-2 bg-gradient-to-r ${styles.iconBg}`}></div>
      </div>
    </div>
  );
};
