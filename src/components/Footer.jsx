import React, { useState } from 'react';
import { GYM_CONFIG } from '../data/gymData';
import { 
  Dumbbell, 
  Phone, 
  Mail, 
  MapPin, 
  ArrowUp,
  Shield, 
  Heart,
  X
} from 'lucide-react';
import { InstagramIcon, FacebookIcon, YoutubeIcon } from './SocialIcons';

export default function Footer({ onOpenBooking }) {
  const [activeModal, setActiveModal] = useState(null); // 'privacy' | 'terms' | null

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const navTo = (e, hash) => {
    e.preventDefault();
    const element = document.querySelector(hash);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <footer className="gym-footer" aria-label="Gym Footer">
      <div className="container">
        
        {/* Top Footer Main Grid */}
        <div className="footer-main-grid">
          
          {/* Brand Info Column */}
          <div className="footer-brand-col">
            <a href="#home" onClick={(e) => navTo(e, '#home')} className="footer-logo">
              <div className="logo-icon-wrapper">
                <Dumbbell size={24} className="logo-icon" />
              </div>
              <div className="logo-text-block">
                <span className="brand-name">KINETIX</span>
                <span className="brand-sub">ATHLETIC CLUB</span>
              </div>
            </a>

            <p className="footer-tagline">
              The premier athletic strength and performance facility. Calibrated Eleiko equipment, certified coaches, and an uncompromising standard of physical excellence.
            </p>

            <div className="footer-contact-snippets">
              <div className="f-snippet">
                <MapPin size={15} className="text-volt" />
                <span>100 Feet Road, Indiranagar, Bengaluru</span>
              </div>
              <div className="f-snippet">
                <Phone size={15} className="text-volt" />
                <a href={`tel:${GYM_CONFIG.phoneRaw}`}>{GYM_CONFIG.phone}</a>
              </div>
              <div className="f-snippet">
                <Mail size={15} className="text-volt" />
                <a href={`mailto:${GYM_CONFIG.email}`}>{GYM_CONFIG.email}</a>
              </div>
            </div>
          </div>

          {/* Column 1: Company */}
          <div className="footer-nav-col">
            <h4 className="footer-col-title">COMPANY</h4>
            <ul className="footer-links-list">
              <li><a href="#about" onClick={(e) => navTo(e, '#about')}>About the Club</a></li>
              <li><a href="#trainers" onClick={(e) => navTo(e, '#trainers')}>Elite Coaches</a></li>
              <li><a href="#programs" onClick={(e) => navTo(e, '#programs')}>Training Programs</a></li>
              <li><a href="#facilities" onClick={(e) => navTo(e, '#facilities')}>18,000 Sq.Ft Facilities</a></li>
              <li><a href="#gallery" onClick={(e) => navTo(e, '#gallery')}>Club Gallery</a></li>
            </ul>
          </div>

          {/* Column 2: Membership */}
          <div className="footer-nav-col">
            <h4 className="footer-col-title">MEMBERSHIP</h4>
            <ul className="footer-links-list">
              <li><a href="#membership" onClick={(e) => navTo(e, '#membership')}>Membership Plans</a></li>
              <li>
                <button 
                  onClick={() => onOpenBooking('Free Trial (Footer)')}
                  className="footer-link-btn"
                >
                  Book 1-Day Free Trial
                </button>
              </li>
              <li><a href="#schedule" onClick={(e) => navTo(e, '#schedule')}>Weekly Class Schedule</a></li>
              <li><a href="#results" onClick={(e) => navTo(e, '#results')}>Member Transformations</a></li>
              <li>
                <button 
                  onClick={() => onOpenBooking('Corporate Membership')}
                  className="footer-link-btn"
                >
                  Corporate Partnerships
                </button>
              </li>
            </ul>
          </div>

          {/* Column 3: Support & Legal */}
          <div className="footer-nav-col">
            <h4 className="footer-col-title">SUPPORT</h4>
            <ul className="footer-links-list">
              <li><a href="#contact" onClick={(e) => navTo(e, '#contact')}>Contact & Directions</a></li>
              <li><a href="#contact" onClick={(e) => navTo(e, '#contact')}>Member FAQs</a></li>
              <li>
                <button 
                  onClick={() => setActiveModal('privacy')}
                  className="footer-link-btn"
                >
                  Privacy Policy
                </button>
              </li>
              <li>
                <button 
                  onClick={() => setActiveModal('terms')}
                  className="footer-link-btn"
                >
                  Terms of Service
                </button>
              </li>
              <li>
                <button 
                  onClick={() => onOpenBooking('Facility Rules & Etiquette')}
                  className="footer-link-btn"
                >
                  Gym Etiquette
                </button>
              </li>
            </ul>
          </div>

          {/* Column 4: Follow Us */}
          <div className="footer-nav-col">
            <h4 className="footer-col-title">FOLLOW US</h4>
            <p className="footer-social-intro">
              Join 25,000+ athletes receiving daily technique breakdowns and event updates.
            </p>
            <div className="footer-social-icons">
              <a 
                href={GYM_CONFIG.socials.instagram} 
                target="_blank" 
                rel="noopener noreferrer" 
                className="social-circle-btn"
                aria-label="Instagram"
              >
                <InstagramIcon size={18} />
              </a>
              <a 
                href={GYM_CONFIG.socials.facebook} 
                target="_blank" 
                rel="noopener noreferrer" 
                className="social-circle-btn"
                aria-label="Facebook"
              >
                <FacebookIcon size={18} />
              </a>
              <a 
                href={GYM_CONFIG.socials.youtube} 
                target="_blank" 
                rel="noopener noreferrer" 
                className="social-circle-btn"
                aria-label="YouTube"
              >
                <YoutubeIcon size={18} />
              </a>
            </div>

            <div className="footer-hours-box">
              <span className="fh-title">MON – SAT: 5:30 AM – 10:30 PM</span>
              <span className="fh-sub">SUNDAY: 7:00 AM – 2:00 PM</span>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="footer-bottom-bar">
          <div className="fb-left">
            <p>© 2026 {GYM_CONFIG.name}. All Rights Reserved.</p>
          </div>

          <div className="fb-center">
            <a 
              href="https://biz1-ten.vercel.app/" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="bizelevate-product-badge"
              title="A Product Of BizElevate"
              id="footer-bizelevate-link"
            >
              <span className="bizelevate-prefix">A Product Of</span>
              <img 
                src="/bizelevate-logo.png" 
                alt="BizElevate Brand Logo" 
                className="bizelevate-badge-logo"
              />
              <span className="bizelevate-brand-title">BizElevate</span>
            </a>
          </div>

          <div className="fb-right">
            <button 
              onClick={scrollToTop} 
              className="back-to-top-btn"
              aria-label="Scroll to top of page"
            >
              <span>Back to Top</span>
              <ArrowUp size={16} />
            </button>
          </div>
        </div>
      </div>

      {/* Privacy Policy / Terms Modal */}
      {activeModal && (
        <div className="legal-modal-overlay" onClick={() => setActiveModal(null)}>
          <div className="legal-modal-box" onClick={(e) => e.stopPropagation()}>
            <button 
              className="legal-modal-close"
              onClick={() => setActiveModal(null)}
              aria-label="Close legal modal"
            >
              <X size={22} />
            </button>

            {activeModal === 'privacy' ? (
              <div className="legal-modal-body">
                <h3>Privacy Policy</h3>
                <p><strong>Effective Date: January 1, 2026</strong></p>
                <p>
                  At KINETIX Athletic Club, we take your privacy seriously. We collect contact information (such as your name, email, and phone number) exclusively to schedule your trial workouts, communicate gym schedule changes, and manage your membership account.
                </p>
                <h4>Data Protection</h4>
                <p>
                  We never sell, rent, or lease member data to third-party advertisers. All payment data is encrypted and processed via PCI-DSS compliant gateways (such as Razorpay).
                </p>
                <h4>Biometric Data</h4>
                <p>
                  Your InBody 570 body composition scans are strictly confidential and only accessible by your assigned coach and yourself via your member profile.
                </p>
              </div>
            ) : (
              <div className="legal-modal-body">
                <h3>Terms of Service</h3>
                <p><strong>Effective Date: January 1, 2026</strong></p>
                <h4>1. Membership & Access</h4>
                <p>
                  All members and trial guests must follow gym safety guidelines, return dumbbells and weight plates to their designated racks, and wipe down benches after use.
                </p>
                <h4>2. Free Trial Pass</h4>
                <p>
                  The complimentary 1-day VIP pass is valid for first-time visitors who are at least 18 years of age or accompanied by a legal guardian.
                </p>
                <h4>3. Refund Guarantee</h4>
                <p>
                  All new members are eligible for our 7-Day No-Questions Money-Back Guarantee if they are not 100% satisfied with our equipment, coaching, or facilities.
                </p>
              </div>
            )}
          </div>
        </div>
      )}
    </footer>
  );
}
