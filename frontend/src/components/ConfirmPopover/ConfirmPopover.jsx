import React, { useEffect, useRef } from 'react';
import './ConfirmPopover.css';

export function ConfirmPopover({
  isOpen,
  onClose,
  onConfirm,
  title = 'Deseja excluir?',
  description = 'Esta ação é permanente e não poderá ser desfeita.',
  confirmText = 'Sim, excluir',
  cancelText = 'Cancelar',
  loading = false,
  align = 'right',
}) {
  const popoverRef = useRef(null);

  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    const handleClickOutside = (e) => {
      if (popoverRef.current && !popoverRef.current.contains(e.target)) {
        onClose();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    const timer = setTimeout(() => {
      document.addEventListener('mousedown', handleClickOutside);
    }, 50);

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.removeEventListener('mousedown', handleClickOutside);
      clearTimeout(timer);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      className={`confirm-popover align-${align}`}
      ref={popoverRef}
      onClick={(e) => e.stopPropagation()}
    >
      <div className="confirm-popover-header">
        <span className="confirm-popover-title">{title}</span>
        {description && <span className="confirm-popover-desc">{description}</span>}
      </div>

      <div className="confirm-popover-actions">
        <button
          type="button"
          className="btn-popover-cancel"
          onClick={(e) => {
            e.stopPropagation();
            onClose();
          }}
          disabled={loading}
        >
          {cancelText}
        </button>
        <button
          type="button"
          className="btn-popover-confirm"
          onClick={(e) => {
            e.stopPropagation();
            onConfirm();
          }}
          disabled={loading}
        >
          {loading ? 'Excluindo...' : confirmText}
        </button>
      </div>
    </div>
  );
}

