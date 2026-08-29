import { motion, AnimatePresence } from 'framer-motion';
import { AlertTriangle, Trash2, X } from 'lucide-react';
import './ConfirmDeleteModal.css';

export default function ConfirmDeleteModal({
  isOpen,
  title = 'Delete Conversation',
  message = 'Are you sure you want to delete this conversation? This action cannot be undone.',
  itemTitle = '',
  onConfirm,
  onCancel,
  confirmLabel = 'Delete Chat',
}) {
  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="modal-backdrop" onClick={onCancel} role="dialog" aria-modal="true">
        <motion.div
          className="confirm-modal card"
          initial={{ opacity: 0, scale: 0.94, y: 10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.94, y: 10 }}
          transition={{ duration: 0.18, ease: 'easeOut' }}
          onClick={(e) => e.stopPropagation()}
        >
          <div className="confirm-modal__header">
            <div className="confirm-modal__icon-wrap">
              <AlertTriangle size={20} className="confirm-modal__icon" />
            </div>
            <div className="confirm-modal__title-wrap">
              <h3 className="confirm-modal__title">{title}</h3>
              <p className="confirm-modal__desc">{message}</p>
            </div>
            <button
              className="confirm-modal__close-btn btn btn-ghost btn-icon"
              onClick={onCancel}
              aria-label="Close dialog"
            >
              <X size={16} />
            </button>
          </div>

          {itemTitle && (
            <div className="confirm-modal__preview">
              <span className="confirm-modal__preview-label">Chat:</span>
              <span className="confirm-modal__preview-text truncate">"{itemTitle}"</span>
            </div>
          )}

          <div className="confirm-modal__actions">
            <button
              type="button"
              className="btn btn-secondary btn-sm confirm-modal__cancel-btn"
              onClick={onCancel}
            >
              Cancel
            </button>
            <button
              type="button"
              className="btn btn-danger btn-sm confirm-modal__delete-btn"
              onClick={onConfirm}
              autoFocus
            >
              <Trash2 size={14} />
              <span>{confirmLabel}</span>
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
