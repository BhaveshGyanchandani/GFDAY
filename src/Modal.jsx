import React, { useEffect } from "react";
import { createPortal } from "react-dom";

function Modal({ isOpen, onClose, children }) {
  // lock body scroll while open
  useEffect(() => {
    if (!isOpen) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = prev; };
  }, [isOpen]);

  // close on Escape
  useEffect(() => {
    if (!isOpen) return;
    const handler = (e) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return createPortal(
    <div
      className="modal-overlay"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
    >
      <div className="modal-box" onClick={(e) => e.stopPropagation()}>
        {/* close button rendered before inner so it floats above */}
        <button className="modal-close" onClick={onClose} aria-label="close">
          ✕
        </button>
        <div className="modal-inner">{children}</div>
      </div>
    </div>,
    document.body
  );
}

export default Modal;
