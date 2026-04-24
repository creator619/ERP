import React, { useEffect } from 'react';
import { CheckCircle, AlertCircle, Info, XCircle, X } from 'lucide-react';
import './Toast.css';

const Toast = ({ message, type = 'success', description, onClose }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, 4000);
    return () => clearTimeout(timer);
  }, [onClose]);

  const icons = {
    success: <CheckCircle className="text-success" size={20} color="#28a745" />,
    error: <XCircle className="text-error" size={20} color="#dc3545" />,
    warning: <AlertCircle className="text-warning" size={20} color="#ffc107" />,
    info: <Info className="text-info" size={20} color="#714B67" />,
  };

  return (
    <div className={`toast ${type}`}>
      <div className="toast-icon">
        {icons[type]}
      </div>
      <div className="toast-content">
        <h5>{message}</h5>
        {description && <p>{description}</p>}
      </div>
      <button className="text-muted" onClick={onClose}>
        <X size={16} />
      </button>
    </div>
  );
};

const ToastContainer = ({ toasts, removeToast }) => {
  return (
    <div className="toast-container">
      {toasts.map((toast) => (
        <Toast 
          key={toast.id} 
          {...toast} 
          onClose={() => removeToast(toast.id)} 
        />
      ))}
    </div>
  );
};

export { ToastContainer };
