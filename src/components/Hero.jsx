import React from 'react';
import { HERO_DATA } from '../data/gymData';
import { ArrowRight, Star, ChevronDown } from 'lucide-react';

export default function Hero({ onOpenBooking }) {
  const scrollToExplore = () => {
    const statsSection = document.getElementById('stats');
    if (statsSection) {
      statsSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section id="home" className="hero-section" aria-label="Hero Introduction">
      {/* High-Impact Gym Photography with Dark Vignette */}
      <div className="hero-bg-media">
        <img 
          src="https://images.unsplash.com/photo-1534438327276-14e5300c3a48?q=80&w=1920&auto=format&fit=crop" 
          alt="High-performance athlete training with barbells at Kinetix Athletic Club" 
          className="hero-bg-img"
          loading="eager"
          fetchPriority="high"
        />
        <div className="hero-overlay-dark"></div>
      </div>

      <div className="container hero-container">
        <div className="hero-content">
          {/* Clean, Non-AI Category Kicker */}
          <span className="hero-kicker-label">
            {HERO_DATA.badge}
          </span>

          {/* Core Bold Headline */}
          <h1 className="hero-title">
            {HERO_DATA.headingLine1}{' '}
            <span className="text-volt-accent">{HERO_DATA.headingHighlight}</span>{' '}
            {HERO_DATA.headingLine2}
          </h1>

          {/* Supporting Text */}
          <p className="hero-subtext">
            {HERO_DATA.subtext}
          </p>

          {/* Dual Clear Action CTAs */}
          <div className="hero-cta-wrapper">
            <button
              onClick={() => onOpenBooking('Start Your Journey (Hero)')}
              className="btn btn-primary btn-lg"
              id="hero-primary-cta"
            >
              <span>{HERO_DATA.primaryCta}</span>
              <ArrowRight size={18} />
            </button>

            <button
              onClick={() => onOpenBooking('Book Free Trial (Hero)')}
              className="btn btn-secondary btn-lg"
              id="hero-secondary-cta"
            >
              <span>{HERO_DATA.secondaryCta}</span>
            </button>
          </div>

          {/* Clean, Understated Social Proof */}
          <div className="hero-social-proof-clean">
            <div className="stars-mini">
              {[...Array(5)].map((_, i) => (
                <Star key={i} size={14} fill="#CCFF00" color="#CCFF00" />
              ))}
            </div>
            <span className="proof-text-clean">
              Rated <strong>4.9/5</strong> by 1,280+ active members • Voted Best Athletic Club
            </span>
          </div>
        </div>
      </div>

      {/* Subtle Scroll Down Indicator */}
      <button 
        onClick={scrollToExplore}
        className="hero-scroll-indicator"
        aria-label="Scroll to discover facilities"
      >
        <span className="scroll-caption">EXPLORE</span>
        <ChevronDown size={18} className="scroll-arrow" />
      </button>
    </section>
  );
}
