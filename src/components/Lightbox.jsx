import React, { useEffect } from 'react';
import { X, ChevronLeft, ChevronRight, Maximize2 } from 'lucide-react';

export default function Lightbox({ items, currentIndex, onClose, onPrev, onNext }) {
  const current = items[currentIndex];

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowLeft') onPrev();
      if (e.key === 'ArrowRight') onNext();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose, onPrev, onNext]);

  if (!current) return null;

  return (
    <div className="lightbox-overlay" onClick={onClose}>
      <button 
        className="lightbox-close-btn"
        onClick={onClose}
        aria-label="Close Fullscreen View"
      >
        <X size={26} />
      </button>

      {/* Navigation Buttons */}
      <button 
        className="lightbox-nav-btn lb-prev"
        onClick={(e) => { e.stopPropagation(); onPrev(); }}
        aria-label="Previous Image"
      >
        <ChevronLeft size={32} />
      </button>

      <button 
        className="lightbox-nav-btn lb-next"
        onClick={(e) => { e.stopPropagation(); onNext(); }}
        aria-label="Next Image"
      >
        <ChevronRight size={32} />
      </button>

      {/* Main Image Stage */}
      <div className="lightbox-stage" onClick={(e) => e.stopPropagation()}>
        <img 
          src={current.image} 
          alt={current.title} 
          className="lightbox-img" 
        />
        <div className="lightbox-caption">
          <div className="caption-texts">
            <span className="caption-badge">{current.category}</span>
            <h4 className="caption-title">{current.title}</h4>
          </div>
          <span className="caption-counter">
            {currentIndex + 1} / {items.length}
          </span>
        </div>
      </div>
    </div>
  );
}
