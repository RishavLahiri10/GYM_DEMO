import React, { useState } from 'react';
import { GALLERY_DATA } from '../data/gymData';
import Lightbox from './Lightbox';

export default function Gallery() {
  const [activeCategory, setActiveCategory] = useState('All');
  const [lightboxIndex, setLightboxIndex] = useState(null);

  const categories = ['All', 'Gym', 'Training', 'Trainers', 'Members', 'Events'];

  const filteredImages = activeCategory === 'All'
    ? GALLERY_DATA
    : GALLERY_DATA.filter((img) => img.category.toLowerCase() === activeCategory.toLowerCase());

  const openLightbox = (index) => {
    setLightboxIndex(index);
  };

  const closeLightbox = () => {
    setLightboxIndex(null);
  };

  const prevLightbox = () => {
    setLightboxIndex((prev) => (prev - 1 + filteredImages.length) % filteredImages.length);
  };

  const nextLightbox = () => {
    setLightboxIndex((prev) => (prev + 1) % filteredImages.length);
  };

  return (
    <section id="gallery" className="gallery-section section-padding" aria-label="Gym Photo Gallery">
      <div className="container">
        {/* Section Header */}
        <div className="section-header-center">
          <span className="section-tag">
            COMMUNITY &amp; FLOOR
          </span>
          <h2 className="section-title">
            FACILITY <span className="text-volt-accent">GALLERY.</span>
          </h2>
          <p className="section-subtitle">
            A visual overview of our training platforms, equipment, coaching staff, and community.
          </p>

          {/* Clean Category Tabs */}
          <div className="gallery-filter-tabs">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`g-filter-tab ${activeCategory === cat ? 'active' : ''}`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Gallery Grid */}
        <div className="gallery-grid">
          {filteredImages.map((item, idx) => (
            <div 
              key={item.id} 
              className="gallery-item-card"
              onClick={() => openLightbox(idx)}
            >
              <img 
                src={item.image} 
                alt={item.title} 
                className="gallery-img"
                loading="lazy" 
              />
              <div className="gallery-hover-overlay">
                <span className="gallery-cat-subtle">{item.category}</span>
                <h4 className="gallery-item-title">{item.title}</h4>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Lightbox Fullscreen Viewer */}
      {lightboxIndex !== null && (
        <Lightbox
          items={filteredImages}
          currentIndex={lightboxIndex}
          onClose={closeLightbox}
          onPrev={prevLightbox}
          onNext={nextLightbox}
        />
      )}
    </section>
  );
}
