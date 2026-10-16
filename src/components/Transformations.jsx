import React, { useState, useEffect } from 'react';
import { TRANSFORMATIONS_DATA } from '../data/gymData';
import { supabase } from '../lib/supabaseClient';
import { ArrowRight, Database } from 'lucide-react';

function TransformationCard({ item, onOpenBooking }) {
  const [sliderPosition, setSliderPosition] = useState(50);

  const handleSliderMove = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = Math.max(0, Math.min(e.clientX - rect.left, rect.width));
    const percentage = (x / rect.width) * 100;
    setSliderPosition(percentage);
  };

  const handleTouchMove = (e) => {
    if (e.touches[0]) {
      const rect = e.currentTarget.getBoundingClientRect();
      const x = Math.max(0, Math.min(e.touches[0].clientX - rect.left, rect.width));
      const percentage = (x / rect.width) * 100;
      setSliderPosition(percentage);
    }
  };

  const metrics = item.metrics || {
    startWeight: '90 KG',
    endWeight: '78 KG',
    bodyFatChange: '-12%'
  };

  return (
    <div className="transformation-card">
      {/* Interactive Before / After Image Slider */}
      <div 
        className="comparison-container"
        onMouseMove={handleSliderMove}
        onTouchMove={handleTouchMove}
      >
        {/* After Image */}
        <img 
          src={item.afterImg || item.after_image_url} 
          alt={`${item.name || item.member_name} After Transformation`} 
          className="comparison-img after-img" 
          loading="lazy"
        />
        <span className="img-tag tag-after">AFTER</span>

        {/* Before Image with responsive inset clipping */}
        <div 
          className="comparison-clip"
          style={{ 
            position: 'absolute', 
            inset: 0, 
            width: '100%', 
            height: '100%', 
            clipPath: `inset(0 ${100 - sliderPosition}% 0 0)` 
          }}
        >
          <img 
            src={item.beforeImg || item.before_image_url} 
            alt={`${item.name || item.member_name} Before Transformation`} 
            className="comparison-img before-img" 
            loading="lazy"
          />
          <span className="img-tag tag-before">BEFORE</span>
        </div>

        {/* Crisp White Divider Line */}
        <div 
          className="slider-divider"
          style={{ left: `${sliderPosition}%` }}
        >
          <div className="slider-handle">
            <span>‹ ›</span>
          </div>
        </div>
      </div>

      {/* Card Content & Measurable Metrics */}
      <div className="trans-card-body">
        <div className="trans-header-row">
          <div>
            <h3 className="trans-member-name">{item.name || item.member_name}</h3>
            <span className="trans-member-role">{item.profession || 'Athlete'} • {item.age || '28'} yrs</span>
          </div>
          <span className="trans-duration-tag">{item.duration || '12 Weeks'}</span>
        </div>

        {/* Bold Result Headline */}
        <div className="trans-result-headline">
          {item.result || item.weight_lost || '-12 KG FAT LOSS'}
        </div>

        {/* Specific Metrics Grid */}
        <div className="trans-metrics-grid">
          <div className="tm-stat">
            <span className="tm-label">Starting</span>
            <span className="tm-val">{metrics.startWeight || '92 KG'}</span>
          </div>
          <div className="tm-stat">
            <span className="tm-label">Current</span>
            <span className="tm-val text-volt">{metrics.endWeight || '78 KG'}</span>
          </div>
          <div className="tm-stat">
            <span className="tm-label">Body Fat</span>
            <span className="tm-val">{metrics.bodyFatChange || '-13%'}</span>
          </div>
        </div>

        <p className="trans-quote">"{item.quote || item.description}"</p>

        <div className="trans-footer">
          <span className="trans-coach-name">
            Mentored by: <strong>{item.coach || 'Head Coach Arjun'}</strong>
          </span>
          <button 
            onClick={() => onOpenBooking(`Start Transformation like ${item.name || item.member_name}`)}
            className="trans-card-btn"
          >
            <span>START YOUR STORY</span>
            <ArrowRight size={13} />
          </button>
        </div>
      </div>
    </div>
  );
}

export default function Transformations({ onOpenBooking }) {
  const [transformations, setTransformations] = useState(TRANSFORMATIONS_DATA);
  const [isLiveFromDb, setIsLiveFromDb] = useState(false);

  // 5. Dynamic Transformations from Supabase
  useEffect(() => {
    async function loadTransformations() {
      try {
        const { data, error } = await supabase
          .from('transformations')
          .select('*');

        if (!error && data && data.length > 0) {
          const formatted = data.map((t) => ({
            id: t.id,
            name: t.member_name,
            age: t.age || '29',
            profession: t.profession || 'Professional',
            result: t.weight_lost || '-12 KG TRANSFORMATION',
            duration: t.duration || '12 Weeks',
            quote: t.description || 'Consistency and proper periodization changed my life.',
            coach: t.coach || 'Head Coach Arjun',
            beforeImg: t.before_image_url,
            afterImg: t.after_image_url,
            metrics: t.metrics || {
              startWeight: '90 KG',
              endWeight: '78 KG',
              bodyFatChange: '-12%'
            }
          }));
          setTransformations(formatted);
          setIsLiveFromDb(true);
        }
      } catch (err) {
        console.info('Supabase transformations query handled:', err);
      }
    }
    loadTransformations();
  }, []);

  return (
    <section id="results" className="transformations-section section-padding" aria-label="Member Transformations">
      <div className="container">
        {/* Section Header */}
        <div className="section-header-center">
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
            <span className="section-tag">
              PROVEN RESULTS
            </span>
            {isLiveFromDb && (
              <span style={{ 
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
                <Database size={10} /> Dynamic Supabase Stories
              </span>
            )}
          </div>
          <h2 className="section-title">
            REAL MEMBERS. <span className="text-volt-accent">MEASURABLE IMPACT.</span>
          </h2>
          <p className="section-subtitle">
            Slide each before/after comparison to inspect verified physical progress achieved through structured lifting and sports nutrition.
          </p>
        </div>

        {/* 3-Cards Grid */}
        <div className="transformations-grid">
          {transformations.map((item) => (
            <TransformationCard 
              key={item.id} 
              item={item} 
              onOpenBooking={onOpenBooking} 
            />
          ))}
        </div>

        {/* Global CTA Strip */}
        <div className="trans-bottom-cta">
          <p className="tb-text">
            Ready to record your own transformation benchmark? 
            <strong> Claim a 1-day pass and movement assessment.</strong>
          </p>
          <button 
            onClick={() => onOpenBooking('Transformation Assessment')}
            className="btn btn-primary"
            id="trans-claim-trial-btn"
          >
            BOOK YOUR FREE TRIAL
          </button>
        </div>
      </div>
    </section>
  );
}
