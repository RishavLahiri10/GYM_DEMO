import React, { useState } from 'react';
import { GYM_CONFIG, FAQS_DATA } from '../data/gymData';
import LeadForm from './LeadForm';
import { 
  MapPin, 
  Phone, 
  Mail, 
  Clock, 
  Navigation, 
  ChevronDown
} from 'lucide-react';

export default function Contact({ onLeadSubmitted }) {
  const [openFaq, setOpenFaq] = useState(0);

  const toggleFaq = (index) => {
    setOpenFaq(openFaq === index ? -1 : index);
  };

  return (
    <section id="contact" className="contact-section section-padding" aria-label="Contact Information and Location">
      <div className="container">
        {/* Section Header */}
        <div className="section-header-center">
          <span className="section-tag">
            LOCATION &amp; CONTACT
          </span>
          <h2 className="section-title">
            VISIT THE <span className="text-volt-accent">FACILITY.</span>
          </h2>
          <p className="section-subtitle">
            Conveniently located on 100 Feet Road, Indiranagar with dedicated valet parking and direct metro connectivity.
          </p>
        </div>

        {/* Main 2-Column Contact & Form Grid */}
        <div className="contact-main-grid">
          
          {/* Left Column: Direct Info Cards & Timings */}
          <div className="contact-info-col">
            
            {/* Address Card */}
            <div className="contact-detail-card">
              <div className="detail-icon-box">
                <MapPin size={20} className="text-volt" />
              </div>
              <div className="detail-info-texts">
                <h4 className="detail-title">Facility Address</h4>
                <p className="detail-body">{GYM_CONFIG.address}</p>
                <span className="landmark-tag">Landmark: {GYM_CONFIG.landmark}</span>
                <div className="detail-action-link">
                  <a 
                    href={GYM_CONFIG.mapUrl} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="directions-btn"
                  >
                    <Navigation size={14} />
                    <span>GET DIRECTIONS</span>
                  </a>
                </div>
              </div>
            </div>

            {/* Operating Hours Card */}
            <div className="contact-detail-card">
              <div className="detail-icon-box">
                <Clock size={20} className="text-volt" />
              </div>
              <div className="detail-info-texts">
                <h4 className="detail-title">Training Hours</h4>
                <div className="hours-row">
                  <span className="day-name">MON – SAT</span>
                  <span className="time-val text-volt">{GYM_CONFIG.hours.weekdays}</span>
                </div>
                <div className="hours-row">
                  <span className="day-name">SUNDAY</span>
                  <span className="time-val">{GYM_CONFIG.hours.sunday}</span>
                </div>
              </div>
            </div>

            {/* Phone & Email Quick Contacts */}
            <div className="contact-twins-grid">
              <div className="mini-contact-card">
                <Phone size={16} className="text-volt" />
                <div>
                  <span className="mini-label">Direct Desk</span>
                  <a href={`tel:${GYM_CONFIG.phoneRaw}`} className="mini-val">
                    {GYM_CONFIG.phone}
                  </a>
                </div>
              </div>

              <div className="mini-contact-card">
                <Mail size={16} className="text-volt" />
                <div>
                  <span className="mini-label">Email</span>
                  <a href={`mailto:${GYM_CONFIG.email}`} className="mini-val">
                    {GYM_CONFIG.email}
                  </a>
                </div>
              </div>
            </div>

            {/* Google Map */}
            <div className="map-embed-wrapper">
              <div className="map-header-strip">
                <span className="map-title-clean">Indiranagar 100 Feet Road, Bengaluru</span>
                <a 
                  href={GYM_CONFIG.mapUrl} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="map-open-link"
                >
                  Open in Maps ↗
                </a>
              </div>
              <div className="map-frame-box">
                <iframe
                  title="KINETIX Athletic Club Location Map"
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3887.9855519803107!2d77.6406953153651!3d12.972740990855214!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3bae1681a5394017%3A0xb35a0937a0752538!2s100%20Feet%20Rd%2C%20Indiranagar%2C%20Bengaluru%2C%20Karnataka!5e0!3m2!1sen!2sin!4v1655000000000!5m2!1sen!2sin"
                  width="100%"
                  height="240"
                  style={{ border: 0, filter: 'invert(90%) hue-rotate(180deg) contrast(1.2)' }}
                  allowFullScreen=""
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                ></iframe>
              </div>
            </div>
          </div>

          {/* Right Column: Lead Generation Form */}
          <div className="contact-form-col">
            <LeadForm onLeadSubmitted={onLeadSubmitted} />
          </div>
        </div>

        {/* Frequently Asked Questions Accordion */}
        <div className="faqs-block-section">
          <div className="section-header-center" style={{ marginBottom: '32px' }}>
            <span className="section-tag">
              QUESTIONS &amp; POLICIES
            </span>
            <h3 className="section-title">
              FREQUENTLY ASKED <span className="text-volt-accent">QUESTIONS.</span>
            </h3>
          </div>

          <div className="faqs-accordion">
            {FAQS_DATA.map((faq, idx) => (
              <div 
                key={idx} 
                className={`faq-item-card ${openFaq === idx ? 'open' : ''}`}
              >
                <button
                  type="button"
                  className="faq-question-btn"
                  onClick={() => toggleFaq(idx)}
                  aria-expanded={openFaq === idx}
                >
                  <span className="faq-q-text">{faq.q}</span>
                  <ChevronDown size={18} className="faq-chevron" />
                </button>
                {openFaq === idx && (
                  <div className="faq-answer-box">
                    <p>{faq.a}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
