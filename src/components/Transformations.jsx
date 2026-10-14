import React, { useState } from 'react';
import { TRANSFORMATIONS_DATA } from '../data/gymData';
import { ArrowRight } from 'lucide-react';

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
          src={item.afterImg} 
          alt={`${item.name} After Transformation`} 
          className="comparison-img after-img" 
          loading="lazy"
        />
        <span className="img-tag tag-after">AFTER</span>

        {/* Before Image */}
        <div 
          className="comparison-clip"
          style={{ width: `${sliderPosition}%` }}
        >
          <img 
            src={item.beforeImg} 
            alt={`${item.name} Before Transformation`} 
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
            <h3 className="trans-member-name">{item.name}</h3>
            <span className="trans-member-role">{item.profession} • {item.age} yrs</span>
          </div>
          <span className="trans-duration-tag">{item.duration}</span>
        </div>

        {/* Bold Result Headline */}
        <div className="trans-result-headline">
          {item.result}
        </div>

        {/* Specific Metrics Grid */}
        <div className="trans-metrics-grid">
          <div className="tm-stat">
            <span className="tm-label">Starting</span>
            <span className="tm-val">{item.metrics.startWeight}</span>
          </div>
          <div className="tm-stat">
            <span className="tm-label">Current</span>
            <span className="tm-val text-volt">{item.metrics.endWeight}</span>
          </div>
          <div className="tm-stat">
            <span className="tm-label">Body Fat</span>
            <span className="tm-val">{item.metrics.bodyFatChange}</span>
          </div>
        </div>

        <p className="trans-quote">"{item.quote}"</p>

        <div className="trans-footer">
          <span className="trans-coach-name">
            Coach: <strong>{item.coach}</strong>
          </span>
          <button
            onClick={() => onOpenBooking(`Transformation Goal: ${item.goal}`)}
            className="trans-cta-link"
          >
            <span>Start Goal</span>
            <ArrowRight size={13} />
          </button>
        </div>
      </div>
    </div>
  );
}

export default function Transformations({ onOpenBooking }) {
  return (
    <section id="results" className="transformations-section section-padding" aria-label="Member Transformations">
      <div className="container">
        {/* Section Header */}
        <div className="section-header-center">
          <span className="section-tag">
            TRACK RECORD
          </span>
          <h2 className="section-title">
            REAL PEOPLE. <span className="text-volt-accent">REAL RESULTS.</span>
          </h2>
          <p className="section-subtitle">
            Structured periodization, sustainable nutrition, and coaching accountability.
          </p>
        </div>

        {/* Transformations Grid */}
        <div className="transformations-grid">
          {TRANSFORMATIONS_DATA.map((item) => (
            <TransformationCard 
              key={item.id} 
              item={item} 
              onOpenBooking={onOpenBooking} 
            />
          ))}
        </div>
      </div>
    </section>
  );
}
