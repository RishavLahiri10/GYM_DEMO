import React, { useEffect } from 'react';
import LeadForm from './LeadForm';
import { X } from 'lucide-react';

export default function BookingModal({ isOpen, onClose, initialContext, onLeadSubmitted }) {
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleKeyDown);
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="booking-modal-overlay" onClick={onClose}>
      <div 
        className="booking-modal-box" 
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-labelledby="booking-modal-heading"
      >
        <button 
          className="booking-modal-close" 
          onClick={onClose}
          aria-label="Close Booking Modal"
        >
          <X size={20} />
        </button>

        <div className="booking-modal-inner">
          {initialContext && (
            <div className="booking-context-line">
              <span>Selected Option: <strong>{initialContext}</strong></span>
            </div>
          )}

          <LeadForm 
            initialSubject={initialContext} 
            onLeadSubmitted={(lead) => {
              if (onLeadSubmitted) onLeadSubmitted(lead);
            }} 
          />
        </div>
      </div>
    </div>
  );
}
