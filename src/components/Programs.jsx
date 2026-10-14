import React, { useState } from 'react';
import { PROGRAMS_DATA } from '../data/gymData';
import ProgramModal from './ProgramModal';
import { ArrowRight } from 'lucide-react';

export default function Programs({ onOpenBooking }) {
  const [activeCategory, setActiveCategory] = useState('All');
  const [selectedProgram, setSelectedProgram] = useState(null);

  const categories = ['All', 'Strength', 'Fat Loss', 'Personal', 'Mobility', 'Group'];

  const filteredPrograms = activeCategory === 'All'
    ? PROGRAMS_DATA
    : PROGRAMS_DATA.filter(p => p.category.toLowerCase().includes(activeCategory.toLowerCase()));

  return (
    <section id="programs" className="programs-section section-padding" aria-label="Fitness Programs">
      <div className="container">
        {/* Section Header */}
        <div className="section-header-center">
          <span className="section-tag">
            DISCIPLINES &amp; TRAINING
          </span>
          <h2 className="section-title">
            TRAIN FOR <span className="text-volt-accent">YOUR GOAL.</span>
          </h2>
          <p className="section-subtitle">
            Structured training protocols built on progressive overload, metabolic conditioning, and tailored movement mechanics.
          </p>

          {/* Clean Segmented Category Tabs */}
          <div className="category-tabs-row">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`category-tab-item ${activeCategory === cat ? 'active' : ''}`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Clean Editorial Programs Grid */}
        <div className="programs-grid">
          {filteredPrograms.map((prog) => (
            <div key={prog.id} className="program-card">
              {/* Image */}
              <div className="program-card-media">
                <img 
                  src={prog.image} 
                  alt={prog.title} 
                  className="program-card-img"
                  loading="lazy" 
                />
              </div>

              {/* Card Body */}
              <div className="program-card-body">
                <div className="prog-meta-line">
                  <span>{prog.duration}</span>
                  <span className="dot-sep">•</span>
                  <span>{prog.difficulty}</span>
                </div>

                <h3 className="program-card-title">{prog.title}</h3>
                <p className="program-card-desc">{prog.description}</p>

                <div className="program-card-footer">
                  <button
                    onClick={() => setSelectedProgram(prog)}
                    className="program-explore-cta"
                    id={`explore-prog-${prog.id}`}
                  >
                    <span>EXPLORE PROGRAM</span>
                    <ArrowRight size={15} className="arrow-icon" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Program Detail Modal */}
      {selectedProgram && (
        <ProgramModal
          program={selectedProgram}
          onClose={() => setSelectedProgram(null)}
          onBookProgram={onOpenBooking}
        />
      )}
    </section>
  );
}
