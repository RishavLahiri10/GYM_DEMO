import React, { useState, useEffect } from 'react';
import { TESTIMONIALS_DATA } from '../data/gymData';
import { Star, ChevronLeft, ChevronRight } from 'lucide-react';

export default function Testimonials() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  useEffect(() => {
    if (isPaused) return;
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % TESTIMONIALS_DATA.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [isPaused]);

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev - 1 + TESTIMONIALS_DATA.length) % TESTIMONIALS_DATA.length);
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % TESTIMONIALS_DATA.length);
  };

  const current = TESTIMONIALS_DATA[currentIndex];

  return (
    <section className="testimonials-section section-padding" aria-label="Member Testimonials">
      <div className="container">
        {/* Section Header */}
        <div className="section-header-center">
          <span className="section-tag">
            MEMBER FEEDBACK
          </span>
          <h2 className="section-title">
            WHAT OUR <span className="text-volt-accent">MEMBERS SAY.</span>
          </h2>
          <p className="section-subtitle">
            Unfiltered feedback from the high performers, beginners, and athletes who train with us every week.
          </p>
        </div>

        {/* Carousel Container */}
        <div 
          className="testimonials-carousel-wrapper"
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
        >
          <div className="testimonial-card-main">
            {/* Stars Row */}
            <div className="testimonial-stars-row">
              <div className="stars-group">
                {[...Array(current.rating)].map((_, i) => (
                  <Star key={i} size={16} fill="#CCFF00" color="#CCFF00" />
                ))}
              </div>
              <span className="verified-member-text">Verified Member</span>
            </div>

            {/* Main Review Quote */}
            <blockquote className="testimonial-quote-text">
              "{current.review}"
            </blockquote>

            {/* Author Profile */}
            <div className="testimonial-author-block">
              <img 
                src={current.photo} 
                alt={current.name} 
                className="author-avatar"
                loading="lazy" 
              />
              <div className="author-details">
                <h4 className="author-name">{current.name}</h4>
                <p className="author-meta">
                  {current.role} • <span>{current.program}</span>
                </p>
              </div>
            </div>
          </div>

          {/* Controls */}
          <div className="carousel-controls-row">
            <button 
              onClick={handlePrev} 
              className="carousel-nav-btn prev-btn"
              aria-label="Previous Testimonial"
            >
              <ChevronLeft size={18} />
            </button>

            <div className="carousel-dots">
              {TESTIMONIALS_DATA.map((_, dotIdx) => (
                <button
                  key={dotIdx}
                  onClick={() => setCurrentIndex(dotIdx)}
                  className={`dot-btn ${currentIndex === dotIdx ? 'active' : ''}`}
                  aria-label={`Go to slide ${dotIdx + 1}`}
                />
              ))}
            </div>

            <button 
              onClick={handleNext} 
              className="carousel-nav-btn next-btn"
              aria-label="Next Testimonial"
            >
              <ChevronRight size={18} />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
