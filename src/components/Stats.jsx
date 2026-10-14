import React, { useState, useEffect, useRef } from 'react';
import { STATS_DATA } from '../data/gymData';
import { ShieldCheck, Award, Activity, Trophy } from 'lucide-react';

function CounterItem({ endValue, suffix, label, description, isVisible }) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!isVisible) return;
    
    let startTime = null;
    const duration = 1800; // 1.8 seconds smooth count
    
    const animateCount = (timestamp) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / duration, 1);
      const easeOut = 1 - Math.pow(1 - progress, 3);
      setCount(Math.floor(easeOut * endValue));

      if (progress < 1) {
        requestAnimationFrame(animateCount);
      } else {
        setCount(endValue);
      }
    };

    requestAnimationFrame(animateCount);
  }, [isVisible, endValue]);

  return (
    <div className="stat-card">
      <div className="stat-number-wrap">
        <span className="stat-counter">{count.toLocaleString()}</span>
        <span className="stat-suffix">{suffix}</span>
      </div>
      <h3 className="stat-label">{label}</h3>
      <p className="stat-desc">{description}</p>
    </div>
  );
}

export default function Stats() {
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.2 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  return (
    <section id="stats" ref={sectionRef} className="stats-section" aria-label="Key Gym Metrics">
      <div className="container">
        {/* Clean Architectural 4-column Metrics Grid */}
        <div className="stats-grid">
          {STATS_DATA.map((item, idx) => (
            <CounterItem
              key={idx}
              endValue={item.value}
              suffix={item.suffix}
              label={item.label}
              description={item.description}
              isVisible={isVisible}
            />
          ))}
        </div>

        {/* Clean Trust Indicators Strip */}
        <div className="trust-strip">
          <div className="trust-strip-inner">
            <span className="trust-item-clean">
              <ShieldCheck size={16} className="text-volt" /> 100% Certified CSCS Coaches
            </span>
            <span className="trust-item-clean">
              <Award size={16} className="text-volt" /> Official Eleiko Training Facility
            </span>
            <span className="trust-item-clean">
              <Activity size={16} className="text-volt" /> InBody 570 Bio-Composition Labs
            </span>
            <span className="trust-item-clean">
              <Trophy size={16} className="text-volt" /> Voted #1 Athletic Club 2025
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}
