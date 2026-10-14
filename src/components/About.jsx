import React, { useState } from 'react';
import { ABOUT_DATA } from '../data/gymData';
import { ArrowRight, X } from 'lucide-react';

export default function About({ onOpenBooking }) {
  const [isStoryModalOpen, setIsStoryModalOpen] = useState(false);

  return (
    <section id="about" className="about-section section-padding" aria-label="About Kinetix Athletic Club">
      <div className="container">
        {/* Asymmetrical Editorial Grid Layout */}
        <div className="about-editorial-grid">
          
          {/* Left Column: Architectural Imagery */}
          <div className="about-media-col">
            <div className="about-image-card-primary">
              <img 
                src={ABOUT_DATA.imageMain} 
                alt="Olympic lifting and strength training facility at Kinetix" 
                className="about-img-main"
                loading="lazy"
              />
            </div>

            <div className="about-image-card-secondary">
              <img 
                src={ABOUT_DATA.imageSecondary} 
                alt="Athlete performing barbell deadlift with coach" 
                className="about-img-secondary"
                loading="lazy"
              />
            </div>

            <div className="about-experience-strip">
              <span className="exp-number">10</span>
              <div className="exp-meta">
                <strong>YEARS</strong>
                <span>OF EXCELLENCE</span>
              </div>
            </div>
          </div>

          {/* Right Column: Editorial Copy, 3 Pillars, and CTA */}
          <div className="about-content-col">
            <span className="section-tag">
              OUR PHILOSOPHY
            </span>

            <h2 className="section-title">
              {ABOUT_DATA.title} <br />
              <span className="text-volt-accent">{ABOUT_DATA.highlight}</span>
            </h2>

            <p className="about-lead">
              {ABOUT_DATA.description}
            </p>

            <div className="about-paragraphs">
              {ABOUT_DATA.paragraphs.map((p, idx) => (
                <p key={idx} className="about-p">
                  {p}
                </p>
              ))}
            </div>

            {/* 3 Core Performance Pillars (Clean Editorial Hierarchy) */}
            <div className="pillars-grid">
              {ABOUT_DATA.pillars.map((pillar, idx) => (
                <div key={idx} className="pillar-item">
                  <span className="pillar-num">0{idx + 1}</span>
                  <div className="pillar-info">
                    <h4 className="pillar-title">{pillar.title}</h4>
                    <p className="pillar-desc">{pillar.description}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Story CTA Buttons */}
            <div className="about-cta-row">
              <button 
                onClick={() => setIsStoryModalOpen(true)}
                className="btn btn-primary"
                id="about-discover-story-btn"
              >
                <span>DISCOVER OUR STORY</span>
                <ArrowRight size={16} />
              </button>

              <button 
                onClick={() => onOpenBooking('Free Trial (About Section)')}
                className="btn btn-secondary"
                id="about-try-facility-btn"
              >
                <span>VISIT THE FACILITY</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Editorial Story Modal */}
      {isStoryModalOpen && (
        <div className="story-modal-overlay" onClick={() => setIsStoryModalOpen(false)}>
          <div className="story-modal-box" onClick={(e) => e.stopPropagation()}>
            <button 
              className="story-modal-close" 
              onClick={() => setIsStoryModalOpen(false)}
              aria-label="Close Story Modal"
            >
              <X size={20} />
            </button>

            <div className="story-modal-content">
              <span className="section-tag">
                THE FOUNDING STORY
              </span>

              <h3 className="story-modal-title">
                "We set out to build the gym we always wished existed."
              </h3>

              <div className="story-meta-quote">
                <p>
                  In 2016, our founders noticed a frustrating divide in the fitness industry: on one end, chaotic commercial budget gyms with broken cable machines and zero coaching; on the other, clinical health studios that lacked athletic intensity.
                </p>
                <p>
                  <strong>KINETIX Athletic Club</strong> was created to bridge that gap. We envisioned an environment where elite powerlifters, weekend runners, busy tech executives, and first-time gymgoers could train side-by-side with mutual respect and zero intimidation.
                </p>
              </div>

              <div className="story-pillars-summary">
                <div className="story-stat-card">
                  <span className="sc-num">18,000</span>
                  <span className="sc-lbl">Sq.Ft Training Floor</span>
                </div>
                <div className="story-stat-card">
                  <span className="sc-num">Eleiko</span>
                  <span className="sc-lbl">Competition Barbells</span>
                </div>
                <div className="story-stat-card">
                  <span className="sc-num">100%</span>
                  <span className="sc-lbl">Acoustic Dampening</span>
                </div>
              </div>

              <div className="story-modal-actions">
                <button 
                  onClick={() => {
                    setIsStoryModalOpen(false);
                    onOpenBooking('Free VIP Pass (Story Modal)');
                  }}
                  className="btn btn-primary w-full"
                >
                  CLAIM YOUR 1-DAY PASS
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
