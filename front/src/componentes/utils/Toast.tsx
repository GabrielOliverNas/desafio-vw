import React from 'react';
import './Toast.css'

interface ToastProps {
  message: string;
  type: 'success' | 'error';
  onClose: () => void;
}

export const Toast: React.FC<ToastProps> = ({ message, type, onClose }) => {
  return (
    <div className={`toast ${type}`}>
      {message}
      <button onClick={onClose} className="close-btn">×</button>
    </div>
  );
};