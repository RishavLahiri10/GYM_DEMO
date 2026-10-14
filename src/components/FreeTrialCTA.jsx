import React from 'react';
import { GYM_CONFIG } from '../data/gymData';
import { ArrowRight, MessageSquare } from 'lucide-react';

export default function FreeTrialCTA({ onOpenBooking }) {
  const handleWhatsApp = () => {
    const url = `https://wa.me/${GYM_CONFIG.whatsappNumber}?text=${encodeURIComponent(GYM_CONFIG.whatsappDefaultMsg)}`;
    window.open(url, '_blank');
  };

  return (
    <section className="free-trial-cta-section" aria-label="Free Trial Call to Action">
      <div className="container">
        <div className="cta-banner-box">
          <div className="cta-content-wrapper">
            <span className="section-tag" style={{ color: 'var(--accent)', marginBottom: '14px' }}>
              JOIN THE CLUB
            </span>

            <h2 className="cta-main-heading">
              READY TO <span className="text-volt-accent">START?</span>
            </h2>

            <p className="cta-supporting-text">
              Your first step doesn't need to be complicated. Book a free trial session and experience the difference. Full floor access, movement assessment, and zero high-pressure sales tactics.
            </p>

            {/* Dual High-Contrast Buttons */}
            <div className="cta-buttons-row">
              <button
                onClick={() => onOpenBooking('Free Trial (CTA Banner)')}
                className="btn btn-primary btn-lg"
                id="cta-banner-trial-btn"
              >
                <span>BOOK FREE TRIAL</span>
                <ArrowRight size={18} />
              </button>

              <button
                onClick={handleWhatsApp}
                className="btn btn-secondary btn-lg"
                id="cta-banner-whatsapp-btn"
              >
                <MessageSquare size={16} />
                <span>WHATSAPP US</span>
              </button>
            </div>

            <div className="cta-guarantee-line">
              <span>No credit card required</span>
              <span className="dot-sep">•</span>
              <span>Complimentary InBody 570 Bio-Scan included</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
