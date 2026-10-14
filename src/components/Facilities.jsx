import React from 'react';
import { FACILITIES_DATA } from '../data/gymData';

export default function Facilities({ onOpenBooking }) {
  return (
    <section id="facilities" className="facilities-section section-padding" aria-label="Gym Facilities">
      <div className="container">
        {/* Section Header */}
        <div className="section-header-center">
          <span className="section-tag">
            18,000 SQ.FT COMPLEX
          </span>
          <h2 className="section-title">
            WORLD-CLASS <span className="text-volt-accent">FACILITIES.</span>
          </h2>
          <p className="section-subtitle">
            Every training zone is acoustically engineered, meticulously sanitized, and equipped with Olympic-calibrated rigging.
          </p>
        </div>

        {/* Facilities Grid */}
        <div className="facilities-grid">
          {FACILITIES_DATA.map((facility) => (
            <div key={facility.id} className="facility-card">
              <div className="facility-img-wrap">
                <img 
                  src={facility.image} 
                  alt={facility.title} 
                  className="facility-img"
                  loading="lazy" 
                />
              </div>

              <div className="facility-card-content">
                <h3 className="facility-title">{facility.title}</h3>
                <p className="facility-desc">{facility.description}</p>

                <div className="facility-features-list">
                  {facility.features.map((feat, idx) => (
                    <span key={idx} className="facility-feat-text">
                      • {feat}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Facility Tour Banner */}
        <div className="facilities-cta-strip">
          <div className="f-cta-content">
            <h3>Want to see the equipment in person?</h3>
            <p>Schedule a guided walkthrough with a head coach and receive an InBody 570 body composition assessment.</p>
          </div>
          <button 
            onClick={() => onOpenBooking('Book In-Person Facility Tour')}
            className="btn btn-primary"
            id="facility-tour-cta"
          >
            BOOK FACILITY TOUR
          </button>
        </div>
      </div>
    </section>
  );
}
