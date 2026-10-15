import React, { useState, useEffect } from 'react';
import { TESTIMONIALS_DATA } from '../data/gymData';
import { supabase } from '../lib/supabaseClient';
import { Star, ChevronLeft, ChevronRight, Database } from 'lucide-react';

export default function Testimonials() {
  const [testimonials, setTestimonials] = useState(TESTIMONIALS_DATA);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [isLiveFromSupabase, setIsLiveFromSupabase] = useState(false);

  // 6. Retrieve data from Supabase
  useEffect(() => {
    async function loadTestimonials() {
      try {
        const { data, error } = await supabase
          .from("testimonials")
          .select("*");

        if (!error && data && data.length > 0) {
          const formatted = data.map((t, idx) => ({
            id: t.id || idx,
            name: t.name,
            role: t.role || 'Member',
            photo: t.photo || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=200&auto=format&fit=crop',
            rating: t.rating || 5,
            review: t.review || t.message || 'Transformative training experience at KINETIX.',
            program: t.program || 'Strength & Conditioning'
          }));
          setTestimonials(formatted);
          setIsLiveFromSupabase(true);
        }
      } catch (err) {
        console.info('Supabase testimonials query handled, falling back to static dataset:', err);
      }
    }

    loadTestimonials();
  }, []);

  useEffect(() => {
    if (isPaused || testimonials.length === 0) return;
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % testimonials.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [isPaused, testimonials.length]);

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length);
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % testimonials.length);
  };

  const current = testimonials[currentIndex] || TESTIMONIALS_DATA[0];

  return (
    <section className="testimonials-section section-padding" aria-label="Member Testimonials">
      <div className="container">
        {/* Section Header */}
        <div className="section-header-center">
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
            <span className="section-tag">
              MEMBER FEEDBACK
            </span>
            {isLiveFromSupabase && (
              <span className="status-badge" style={{ 
                background: 'rgba(16, 185, 129, 0.15)', 
                color: '#34d399', 
                border: '1px solid rgba(16, 185, 129, 0.3)',
                padding: '2px 8px',
                borderRadius: '999px',
                fontSize: '0.7rem',
                fontWeight: 600,
                display: 'inline-flex',
                alignItems: 'center',
                gap: '4px'
              }}>
                <Database size={10} /> Live Supabase Feed
              </span>
            )}
          </div>
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
                {[...Array(current.rating || 5)].map((_, i) => (
                  <Star key={i} size={16} fill="var(--accent)" color="var(--accent)" />
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
              {testimonials.map((_, dotIdx) => (
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
