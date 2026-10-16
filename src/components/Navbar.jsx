import React, { useState, useEffect } from 'react';
import { GYM_CONFIG } from '../data/gymData';
import { 
  Dumbbell, 
  Menu, 
  X, 
  Phone, 
  ChevronRight, 
  LayoutDashboard,
  User,
  LogIn,
  Sun,
  Moon,
  QrCode
} from 'lucide-react';
import { getStoredTheme, saveTheme } from '../utils/themeManager';

export default function Navbar({ 
  onOpenBooking, 
  onOpenAdmin, 
  isAdminOpen, 
  onOpenMemberPortal,
  isMemberPortalOpen,
  onOpenAuth, 
  authUser 
}) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [showBanner, setShowBanner] = useState(true);
  const [isDarkMode, setIsDarkMode] = useState(() => {
    if (typeof document !== 'undefined') {
      return document.documentElement.getAttribute('data-theme') !== 'light';
    }
    return true;
  });

  useEffect(() => {
    const handleThemeSync = (e) => {
      const current = e?.detail || getStoredTheme();
      setIsDarkMode(current.mode !== 'light');
    };
    handleThemeSync();
    window.addEventListener('kinetix-theme-changed', handleThemeSync);
    window.addEventListener('storage', handleThemeSync);
    return () => {
      window.removeEventListener('kinetix-theme-changed', handleThemeSync);
      window.removeEventListener('storage', handleThemeSync);
    };
  }, []);

  const handleToggleTheme = () => {
    const current = getStoredTheme();
    const nextMode = current.mode === 'light' ? 'dark' : 'light';
    const updated = { ...current, mode: nextMode };
    saveTheme(updated);
    setIsDarkMode(nextMode === 'dark');
  };

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

  // Lock background scrolling when mobile menu drawer is open
  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isMobileMenuOpen]);

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

  // Get safe label for auth button (never exposes 'admin' on public navbar)
  const getAuthButtonLabel = () => {
    if (!authUser) return 'Login';
    const emailLower = (authUser.email || '').toLowerCase();
    if (
      authUser.role === 'admin' ||
      authUser.user_metadata?.role === 'admin' ||
      emailLower.startsWith('admin')
    ) {
      return 'Account';
    }
    if (authUser.user_metadata?.full_name) {
      return authUser.user_metadata.full_name.split(' ')[0];
    }
    const username = authUser.email ? authUser.email.split('@')[0] : 'Account';
    return username.toLowerCase() === 'admin' ? 'Account' : username;
  };

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
              {/* User Personal Theme Switcher (Light / Dark) */}
              <button
                type="button"
                onClick={handleToggleTheme}
                className="admin-toggle-btn theme-mode-nav-btn"
                title={isDarkMode ? "Switch to Light Theme" : "Switch to Dark Theme"}
                aria-label="Toggle Theme Mode"
                id="navbar-theme-toggle-btn"
              >
                {isDarkMode ? <Sun size={15} color="var(--accent, #ccff00)" /> : <Moon size={15} />}
                <span className="nav-btn-text">{isDarkMode ? 'Light' : 'Dark'}</span>
              </button>

              {/* Athlete Pass & Member Portal Button */}
              <button
                type="button"
                onClick={() => onOpenMemberPortal && onOpenMemberPortal(authUser)}
                className="admin-toggle-btn nav-athlete-pass-btn"
                title="Open Member Experience Portal, Digital QR Pass & Workouts"
                id="navbar-athlete-pass-btn"
                style={{
                  background: 'rgba(204, 255, 0, 0.12)',
                  borderColor: 'rgba(204, 255, 0, 0.4)',
                  color: 'var(--accent, #ccff00)'
                }}
              >
                <QrCode size={14} />
                <span className="nav-btn-text">Athlete Pass</span>
              </button>

              {/* Member / Account Login Button */}
              <button
                type="button"
                onClick={() => onOpenAuth && onOpenAuth('login')}
                className="admin-toggle-btn nav-auth-toggle-btn"
                title="Member Login & Account"
                id="navbar-auth-btn"
              >
                <User size={14} />
                <span className="nav-btn-text">{getAuthButtonLabel()}</span>
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
                className="btn btn-primary btn-sm nav-desktop-trial-btn"
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

          {/* Mobile Theme Switcher */}
          <button
            onClick={handleToggleTheme}
            className="btn btn-secondary w-full"
            style={{ marginTop: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}
            id="mobile-drawer-theme-toggle-btn"
          >
            {isDarkMode ? <Sun size={15} /> : <Moon size={15} />}
            <span>Switch to {isDarkMode ? 'Light Theme' : 'Dark Theme'}</span>
          </button>

          {/* Athlete Experience & Digital QR Pass */}
          <button
            onClick={() => {
              setIsMobileMenuOpen(false);
              if (onOpenMemberPortal) onOpenMemberPortal(authUser);
            }}
            className="btn btn-secondary w-full"
            style={{ 
              marginTop: '10px', 
              background: 'rgba(204, 255, 0, 0.1)', 
              borderColor: 'var(--accent, #ccff00)', 
              color: 'var(--accent, #ccff00)',
              fontWeight: 700,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px'
            }}
            id="mobile-drawer-member-portal-btn"
          >
            <QrCode size={16} />
            <span>⚡ ATHLETE PASS & WORKOUTS</span>
          </button>

          <button
            onClick={() => {
              setIsMobileMenuOpen(false);
              if (onOpenAuth) onOpenAuth('login');
            }}
            className="btn btn-secondary w-full"
            style={{ marginTop: '10px' }}
          >
            <User size={15} /> {getAuthButtonLabel() === 'Login' ? 'Member Login' : `Account (${getAuthButtonLabel()})`}
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
