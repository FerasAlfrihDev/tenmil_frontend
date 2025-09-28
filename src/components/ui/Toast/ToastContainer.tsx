import React from 'react';
import { createPortal } from 'react-dom';
import Toast, { type ToastData } from './Toast';
import './ToastContainer.scss';

interface ToastContainerProps {
  toasts: ToastData[];
  onClose: (id: string) => void;
  position?: 'top-right' | 'top-left' | 'bottom-right' | 'bottom-left' | 'top-center' | 'bottom-center';
}

const ToastContainer: React.FC<ToastContainerProps> = ({ 
  toasts, 
  onClose, 
  position = 'top-right' 
}) => {
  if (toasts.length === 0) {
    return null;
  }

  const containerContent = (
    <div className={`toast-container toast-container-${position}`}>
      {toasts.map((toast) => (
        <Toast
          key={toast.id}
          toast={toast}
          onClose={onClose}
        />
      ))}
    </div>
  );

  // Render toasts in a portal to ensure they appear above everything
  return createPortal(containerContent, document.body);
};

export default ToastContainer;
