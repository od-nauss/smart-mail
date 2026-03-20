'use client';

import { useEffect, useCallback, useRef } from 'react';
import { cn } from '@/lib/utils';
import { ModalProps } from '@/lib/types';
import { Button } from './Button';

const sizeStyles = {
  sm: 'max-w-md',
  md: 'max-w-lg',
  lg: 'max-w-2xl',
  xl: 'max-w-4xl',
  full: 'max-w-[95vw]',
};

const CloseIcon = () => (
  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <line x1="18" y1="6" x2="6" y2="18" />
    <line x1="6" y1="6" x2="18" y2="18" />
  </svg>
);

export function Modal({
  isOpen,
  onClose,
  title,
  children,
  size = 'lg',
  showClose = true,
}: ModalProps) {
  const modalRef = useRef<HTMLDivElement>(null);
  
  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    },
    [onClose]
  );
  
  useEffect(() => {
    if (isOpen) {
      document.addEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'hidden';
    }
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = '';
    };
  }, [isOpen, handleKeyDown]);
  
  if (!isOpen) return null;
  
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" role="dialog" aria-modal="true">
      <div
        className="absolute inset-0 bg-naif-primary/20 backdrop-blur-sm"
        onClick={onClose}
      />
      
      <div
        ref={modalRef}
        className={cn(
          'relative w-full bg-naif-white rounded-xl shadow-xl',
          'max-h-[90vh] overflow-hidden flex flex-col',
          'animate-slide-up',
          sizeStyles[size]
        )}
      >
        <div className="flex items-center justify-between px-4 sm:px-5 py-3 border-b border-naif-gray bg-naif-white">
          <h2 className="text-sm sm:text-base font-semibold text-naif-primary">{title}</h2>
          {showClose && (
            <Button
              variant="ghost"
              size="sm"
              onClick={onClose}
              className="!p-1.5 rounded-md hover:bg-naif-gray text-naif-blueGray hover:text-naif-primary"
            >
              <CloseIcon />
            </Button>
          )}
        </div>
        
        <div className="flex-1 overflow-y-auto p-4 sm:p-5">
          {children}
        </div>
      </div>
    </div>
  );
}