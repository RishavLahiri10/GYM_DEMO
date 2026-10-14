import React from 'react';
import { X, Check, ArrowRight } from 'lucide-react';

export default function ProgramModal({ program, onClose, onBookProgram }) {
  if (!program) return null;

  return (
    <div className="program-modal-overlay" onClick={onClose}>
      <div className="program-modal-box" onClick={(e) => e.stopPropagation()}>
        <button 
          className="program-modal-close" 
          onClick={onClose}
          aria-label="Close program details"
        >
          <X size={20} />
        </button>

        <div className="program-modal-hero">
          <img src={program.image} alt={program.title} className="program-modal-img" />
          <div className="program-modal-gradient"></div>
          <div className="program-modal-header-text">
            <span className="section-tag" style={{ marginBottom: '6px' }}>{program.category}</span>
            <h3 className="program-modal-title">{program.title}</h3>
            <p className="program-modal-tagline">{program.tagline}</p>
          </div>
        </div>

        <div className="program-modal-body">
          {/* Key Attributes Row */}
          <div className="program-metrics-row">
            <div className="prog-metric-card">
              <span className="metric-label">Duration</span>
              <span className="metric-val">{program.duration}</span>
            </div>

            <div className="prog-metric-card">
              <span className="metric-label">Level</span>
              <span className="metric-val">{program.difficulty}</span>
            </div>

            <div className="prog-metric-card">
              <span className="metric-label">Intensity</span>
              <span className="metric-val">{program.intensity}</span>
            </div>
          </div>

          {/* Program Overview */}
          <div className="program-section-block">
            <h4 className="prog-block-heading">Overview</h4>
            <p className="prog-block-p">{program.description}</p>
          </div>

          {/* What You Will Achieve */}
          <div className="program-section-block">
            <h4 className="prog-block-heading">Key Outcomes</h4>
            <ul className="prog-benefits-list">
              {program.benefits.map((benefit, idx) => (
                <li key={idx} className="prog-benefit-item">
                  <Check size={16} className="benefit-icon text-volt" />
                  <span>{benefit}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Modal Action CTA */}
          <div className="program-modal-footer">
            <button 
              onClick={() => {
                onClose();
                onBookProgram(`Program: ${program.title}`);
              }}
              className="btn btn-primary w-full"
              id="program-modal-book-cta"
            >
              <span>BOOK A FREE TRIAL FOR {program.title.toUpperCase()}</span>
              <ArrowRight size={16} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
