import React, { useState, useEffect } from 'react';
import { GYM_CONFIG } from '../data/gymData';
import { 
  Dumbbell, 
  Menu, 
  X, 
  Phone, 
  ChevronRight, 
  LayoutDashboard
} from 'lucide-react';

export default function Navbar({ onOpenBooking, onOpenAdmin, isAdminOpen }) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [showBanner, setShowBanner] = useState(true);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 30) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: 'About', href: '#about' },
    { name: 'Programs', href: '#programs' },
    { name: 'Trainers', href: '#trainers' },
    { name: 'Membership', href: '#membership' },
    { name: 'Results', href: '#results' },
    { name: 'Facilities', href: '#facilities' },
    { name: 'Schedule', href: '#schedule' },
    { name: 'Gallery', href: '#gallery' },
    { name: 'Contact', href: '#contact' }
  ];

  const handleNavClick = (e, href) => {
    e.preventDefault();
    setIsMobileMenuOpen(false);
    const element = document.querySelector(href);
    if (element) {
      const navOffset = showBanner ? 90 : 70;
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - navOffset;
      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
    }
  };

  return (
    <>
      {/* Top Clean Announcement Strip */}
      {showBanner && (
        <aside aria-label="Announcement banner" className="top-banner">
          <div className="container">
            <div className="banner-content">
              <p className="banner-text">
                <span className="banner-lead-tag">LIMITED PASSES</span>
                Complimentary <strong>1-Day VIP Trial Pass</strong> + InBody 570 Bio-Scan (Valued at ₹1,500)
              </p>
              <div className="banner-actions">
                <button 
                  onClick={() => onOpenBooking('Free VIP 1-Day Pass')}
                  className="banner-cta"
                  id="nav-banner-claim-btn"
                >
                  Claim Pass →
                </button>
                <button 
                  onClick={() => setShowBanner(false)}
                  className="banner-close"
                  aria-label="Close Announcement"
                >
                  <X size={14} />
                </button>
              </div>
            </div>
          </div>
        </aside>
      )}

      {/* Main Sticky Navbar */}
      <header className={`navbar-header ${isScrolled ? 'navbar-scrolled' : ''}`}>
        <div className="container">
          <nav className="navbar-inner" aria-label="Main Navigation">
            {/* Logo */}
            <a href="#home" className="brand-logo" onClick={(e) => handleNavClick(e, '#home')}>
              <div className="logo-icon-wrapper">
                <Dumbbell className="logo-icon" size={20} />
              </div>
              <div className="logo-text-block">
                <span className="brand-name">KINETIX</span>
                <span className="brand-sub">ATHLETIC CLUB</span>
              </div>
            </a>

            {/* Desktop Navigation Links */}
            <div className="nav-desktop-links">
              {navLinks.map((link) => (
                <a
                  key={link.name}
                  href={link.href}
                  onClick={(e) => handleNavClick(e, link.href)}
                  className="nav-link-item"
                >
                  {link.name}
                </a>
              ))}
            </div>

            {/* Desktop Right CTA Block */}
            <div className="nav-cta-group">
              {/* Admin Portal Toggle */}
              <button 
                onClick={onOpenAdmin}
                className={`admin-toggle-btn ${isAdminOpen ? 'admin-active' : ''}`}
                title="Open Gym Admin / Management Portal"
                id="navbar-admin-btn"
              >
                <LayoutDashboard size={14} />
                <span>Admin</span>
              </button>

              {/* Direct Phone link */}
              <a 
                href={`tel:${GYM_CONFIG.phoneRaw}`} 
                className="nav-phone-link"
                title={`Call ${GYM_CONFIG.phone}`}
              >
                <Phone size={14} />
                <span>Call Us</span>
              </a>

              {/* Book Free Trial Button */}
              <button
                onClick={() => onOpenBooking('Free Trial')}
                className="btn btn-primary btn-sm"
                id="navbar-book-free-trial-btn"
              >
                <span>BOOK FREE TRIAL</span>
              </button>

              {/* Mobile Hamburger Button */}
              <button
                type="button"
                className="mobile-hamburger-btn"
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                aria-label="Toggle Navigation Menu"
                aria-expanded={isMobileMenuOpen}
                id="mobile-nav-toggle-btn"
              >
                {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
              </button>
            </div>
          </nav>
        </div>
      </header>

      {/* Mobile Drawer Navigation */}
      <div className={`mobile-nav-drawer ${isMobileMenuOpen ? 'open' : ''}`}>
        <div className="mobile-drawer-header">
          <div className="brand-logo">
            <div className="logo-icon-wrapper">
              <Dumbbell className="logo-icon" size={18} />
            </div>
            <div className="logo-text-block">
              <span className="brand-name">KINETIX</span>
              <span className="brand-sub">ATHLETIC CLUB</span>
            </div>
          </div>
          <button 
            className="mobile-close-btn"
            onClick={() => setIsMobileMenuOpen(false)}
            aria-label="Close menu"
          >
            <X size={22} />
          </button>
        </div>

        <div className="mobile-links-list">
          {navLinks.map((link) => (
            <a
              key={link.name}
              href={link.href}
              onClick={(e) => handleNavClick(e, link.href)}
              className="mobile-nav-item"
            >
              <span>{link.name}</span>
              <ChevronRight size={16} className="chevron" />
            </a>
          ))}
        </div>

        <div className="mobile-drawer-footer">
          <button
            onClick={() => {
              setIsMobileMenuOpen(false);
              onOpenBooking('Free Trial Mobile');
            }}
            className="btn btn-primary w-full"
            id="mobile-drawer-book-trial-btn"
          >
            BOOK FREE TRIAL
          </button>

          <button
            onClick={() => {
              setIsMobileMenuOpen(false);
              onOpenAdmin();
            }}
            className="btn btn-secondary w-full"
            style={{ marginTop: '10px' }}
          >
            <LayoutDashboard size={15} /> Manager Portal
          </button>

          <div className="mobile-quick-contacts">
            <a href={`tel:${GYM_CONFIG.phoneRaw}`} className="mobile-contact-chip">
              <Phone size={14} /> {GYM_CONFIG.phone}
            </a>
          </div>
        </div>
      </div>

      {/* Backdrop overlay */}
      {isMobileMenuOpen && (
        <div 
          className="drawer-backdrop" 
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}
    </>
  );
}
