import React, { useState, useEffect } from 'react';
import { TRAINERS_DATA } from '../data/gymData';
import { supabase } from '../lib/supabaseClient';
import { InstagramIcon } from './SocialIcons';
import { Database } from 'lucide-react';

export default function Trainers({ onOpenBooking }) {
  const [trainers, setTrainers] = useState(TRAINERS_DATA);
  const [isLiveFromDb, setIsLiveFromDb] = useState(false);

  // 3. Dynamic Trainers retrieval from Supabase
  useEffect(() => {
    async function loadTrainers() {
      try {
        const { data, error } = await supabase
          .from('trainers')
          .select('*');

        if (!error && data && data.length > 0) {
          const formatted = data.map((t) => ({
            id: t.id,
            name: t.name,
            role: t.role,
            experience: t.experience || '5+ Years Experience',
            specialization: t.specialization || 'Strength & Conditioning',
            image: t.image_url || t.image || 'https://images.unsplash.com/photo-1567013127542-490d757e51fc?q=80&w=800&auto=format&fit=crop',
            bio: t.bio || 'Dedicated coach committed to your strength, mobility, and long-term athletic health.',
            instagram: t.instagram_url || t.instagram || 'https://instagram.com',
            certifications: Array.isArray(t.certifications) && t.certifications.length > 0
              ? t.certifications
              : ['Certified Fitness Coach', 'First Aid Certified']
          }));
          setTrainers(formatted);
          setIsLiveFromDb(true);
        }
      } catch (err) {
        console.info('Supabase trainers query handled:', err);
      }
    }
    loadTrainers();
  }, []);

  return (
    <section id="trainers" className="trainers-section section-padding" aria-label="Our Expert Coaches">
      <div className="container">
        {/* Section Header */}
        <div className="section-header-center">
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
            <span className="section-tag">
              COACHING STAFF
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
                <Database size={10} /> Dynamic Coaches Roster
              </span>
            )}
          </div>
          <h2 className="section-title">
            MEET YOUR <span className="text-volt-accent">COACHES.</span>
          </h2>
          <p className="section-subtitle">
            Certified biomechanists, national-level lifters, and conditioning specialists committed to your performance and injury-free progress.
          </p>
        </div>

        {/* Coaches Grid */}
        <div className="trainers-grid">
          {trainers.map((trainer) => (
            <div key={trainer.id} className="trainer-card">
              {/* Media Container with Image */}
              <div className="trainer-card-media">
                <img 
                  src={trainer.image} 
                  alt={`${trainer.name} - ${trainer.role}`} 
                  className="trainer-photo"
                  loading="lazy" 
                />
              </div>

              {/* Card Details */}
              <div className="trainer-card-info">
                <div className="trainer-header-line">
                  <h3 className="trainer-name">{trainer.name}</h3>
                  <a 
                    href={trainer.instagram} 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="trainer-insta-link"
                    aria-label={`Visit ${trainer.name}'s Instagram`}
                  >
                    <InstagramIcon size={16} />
                  </a>
                </div>

                <p className="trainer-role-meta">
                  {trainer.role} • <span>{trainer.experience}</span>
                </p>

                {/* Specialization */}
                <div className="trainer-spec-wrap">
                  <span className="spec-label">Focus</span>
                  <p className="spec-text">{trainer.specialization}</p>
                </div>

                {/* Certifications List */}
                <div className="trainer-certs-list">
                  {(trainer.certifications || []).map((cert, cIdx) => (
                    <span key={cIdx} className="cert-tag">
                      {cert}
                    </span>
                  ))}
                </div>

                <p className="trainer-bio">{trainer.bio}</p>

                {/* Direct Action */}
                <div className="trainer-card-footer">
                  <button
                    onClick={() => onOpenBooking(`Consultation with ${trainer.name}`)}
                    className="btn btn-secondary btn-sm w-full"
                    id={`book-trainer-${trainer.id}`}
                  >
                    BOOK FREE TRIAL WITH {trainer.name.split(' ')[0]}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
