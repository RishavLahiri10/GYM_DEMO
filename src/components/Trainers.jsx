import React from 'react';
import { TRAINERS_DATA } from '../data/gymData';
import { InstagramIcon } from './SocialIcons';

export default function Trainers({ onOpenBooking }) {
  return (
    <section id="trainers" className="trainers-section section-padding" aria-label="Our Expert Coaches">
      <div className="container">
        {/* Section Header */}
        <div className="section-header-center">
          <span className="section-tag">
            COACHING STAFF
          </span>
          <h2 className="section-title">
            MEET YOUR <span className="text-volt-accent">COACHES.</span>
          </h2>
          <p className="section-subtitle">
            Certified biomechanists, national-level lifters, and conditioning specialists committed to your performance and injury-free progress.
          </p>
        </div>

        {/* Coaches Grid */}
        <div className="trainers-grid">
          {TRAINERS_DATA.map((trainer) => (
            <div key={trainer.id} className="trainer-card">
              {/* Media Container with Image */}
              <div className="trainer-card-media">
                <img 
                  src={trainer.image} 
                  alt={`${trainer.name} - ${trainer.role}`} 
                  className="trainer-photo"
                  loading="lazy"
                />
              </div>

              {/* Card Details */}
              <div className="trainer-card-info">
                <div className="trainer-header-line">
                  <h3 className="trainer-name">{trainer.name}</h3>
                  <a 
                    href={trainer.instagram} 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="trainer-insta-link"
                    aria-label={`Visit ${trainer.name}'s Instagram`}
                  >
                    <InstagramIcon size={16} />
                  </a>
                </div>

                <p className="trainer-role-meta">
                  {trainer.role} • <span>{trainer.experience}</span>
                </p>

                {/* Specialization */}
                <div className="trainer-spec-wrap">
                  <span className="spec-label">Focus</span>
                  <p className="spec-text">{trainer.specialization}</p>
                </div>

                {/* Certifications List */}
                <div className="trainer-certs-list">
                  {trainer.certifications.map((cert, cIdx) => (
                    <span key={cIdx} className="cert-tag">
                      {cert}
                    </span>
                  ))}
                </div>

                <p className="trainer-bio">{trainer.bio}</p>

                {/* Direct Action */}
                <div className="trainer-card-footer">
                  <button
                    onClick={() => onOpenBooking(`Consultation with ${trainer.name}`)}
                    className="btn btn-secondary btn-sm w-full"
                    id={`book-trainer-${trainer.id}`}
                  >
                    BOOK CONSULTATION
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
