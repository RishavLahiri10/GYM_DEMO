import React, { useState, useEffect } from 'react';
import { GALLERY_DATA } from '../data/gymData';
import { supabase } from '../lib/supabaseClient';
import Lightbox from './Lightbox';
import { Database } from 'lucide-react';

export default function Gallery() {
  const [galleryImages, setGalleryImages] = useState(GALLERY_DATA);
  const [isLiveFromDb, setIsLiveFromDb] = useState(false);
  const [activeCategory, setActiveCategory] = useState('All');
  const [lightboxIndex, setLightboxIndex] = useState(null);

  const categories = ['All', 'Gym', 'Training', 'Trainers', 'Members', 'Events'];

  // 6. Dynamic Gallery retrieval from Supabase
  useEffect(() => {
    async function loadGallery() {
      try {
        const { data, error } = await supabase
          .from('gallery')
          .select('*');

        if (!error && data && data.length > 0) {
          const formatted = data.map((item, idx) => ({
            id: item.id || idx,
            title: item.title,
            category: item.category || 'Gym',
            image: item.image_url || item.image
          }));
          setGalleryImages(formatted);
          setIsLiveFromDb(true);
        }
      } catch (err) {
        console.info('Supabase gallery query handled:', err);
      }
    }
    loadGallery();
  }, []);

  const filteredImages = activeCategory === 'All'
    ? galleryImages
    : galleryImages.filter((img) => (img.category || '').toLowerCase() === activeCategory.toLowerCase());

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
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
            <span className="section-tag">
              COMMUNITY &amp; FLOOR
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
                <Database size={10} /> Dynamic Storage Gallery
              </span>
            )}
          </div>
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
          {filteredImages.map((img, idx) => (
            <div 
              key={img.id || idx} 
              className="gallery-item-card"
              onClick={() => openLightbox(idx)}
            >
              <img 
                src={img.image} 
                alt={img.title} 
                loading="lazy" 
                className="gallery-thumb-img" 
              />
              <div className="gallery-hover-overlay">
                <span className="gallery-img-category">{img.category}</span>
                <h4 className="gallery-img-title">{img.title}</h4>
                <span className="gallery-view-hint">Click to enlarge</span>
              </div>
            </div>
          ))}
        </div>

        {/* Global Lightbox Modal */}
        {lightboxIndex !== null && (
          <Lightbox 
            images={filteredImages}
            currentIndex={lightboxIndex}
            onClose={closeLightbox}
            onPrev={prevLightbox}
            onNext={nextLightbox}
          />
        )}
      </div>
    </section>
  );
}
