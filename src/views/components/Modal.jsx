/**
 * Modal Component
 * Architectural high-contrast modal dialog with backdrop blur,
 * square borders (rounded-none), and clean header/body/footer structure.
 */

import React, { useEffect } from 'react';
import { X } from 'lucide-react';
import { Button } from './Button.jsx';

export const Modal = ({
  isOpen,
  onClose,
  title,
  subtitle,
  children,
  maxWidth = 'max-w-lg',
  showClose = true,
}) => {
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => {
      document.body.style.overflow = 'auto';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-[2px] animate-fadeIn">
      {/* Backdrop click dismiss */}
      <div className="absolute inset-0" onClick={onClose} />

      {/* Modal Card */}
      <div
        className={`relative z-10 w-full ${maxWidth} bg-canvas border border-hairline-strong shadow-2xl rounded-none flex flex-col max-h-[90vh] overflow-hidden`}
        role="dialog"
        aria-modal="true"
      >
        {/* Header */}
        <div className="flex items-start justify-between p-5 md:p-6 border-b border-hairline bg-canvas">
          <div>
            {title && <h3 className="text-[22px] font-bold text-ink leading-tight1">{title}</h3>}
            {subtitle && <p className="text-[14px] text-mute mt-1">{subtitle}</p>}
          </div>
          {showClose && (
            <button
              type="button"
              onClick={onClose}
              className="w-8 h-8 rounded-xs border border-hairline-strong flex items-center justify-center text-ink hover:bg-surface-soft cursor-pointer transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Content Body */}
        <div className="p-5 md:p-6 overflow-y-auto flex-1">{children}</div>
      </div>
    </div>
  );
};

export default Modal;
