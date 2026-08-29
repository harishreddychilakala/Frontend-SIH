import { CheckCircle, AlertTriangle, Info, XCircle } from 'lucide-react';
import { useApp } from '../../context/AppContext.jsx';
import './Toast.css';

const icons = {
  success: <CheckCircle size={16} />,
  error: <XCircle size={16} />,
  warning: <AlertTriangle size={16} />,
  info: <Info size={16} />,
};

export default function Toast({ toast }) {
  const { removeToast } = useApp();
  return (
    <div className={`toast toast-${toast.type}`}>
      <span className={`toast-icon toast-icon--${toast.type}`}>{icons[toast.type]}</span>
      <span className="toast-message">{toast.message}</span>
      <button className="toast-close btn btn-ghost btn-icon-sm" onClick={() => removeToast(toast.id)} aria-label="Close">
        <XCircle size={14} />
      </button>
    </div>
  );
}

export function ToastContainer() {
  const { toasts } = useApp();
  if (toasts.length === 0) return null;
  return (
    <div className="toast-container" role="region" aria-label="Notifications">
      {toasts.map(t => <Toast key={t.id} toast={t} />)}
    </div>
  );
}
