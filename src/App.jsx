import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import Stats from './components/Stats';
import About from './components/About';
import Programs from './components/Programs';
import Trainers from './components/Trainers';
import Memberships from './components/Memberships';
import Transformations from './components/Transformations';
import Testimonials from './components/Testimonials';
import Facilities from './components/Facilities';
import Schedule from './components/Schedule';
import Gallery from './components/Gallery';
import FreeTrialCTA from './components/FreeTrialCTA';
import Contact from './components/Contact';
import Footer from './components/Footer';
import WhatsAppWidget from './components/WhatsAppWidget';
import MobileActionBar from './components/MobileActionBar';
import BookingModal from './components/BookingModal';
import AdminDashboard from './components/AdminDashboard';
import AuthModal from './components/AuthModal';
import UserThemeWidget from './components/UserThemeWidget';
import MemberPortal from './features/memberPortal/MemberPortal';
import { DEMO_USERS, USER_ROLES } from './services/authService';
import { supabase } from './lib/supabaseClient';
import { getStoredTheme, applyTheme } from './utils/themeManager';
import './App.css';

export default function App() {
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);
  const [bookingContext, setBookingContext] = useState('');
  const [isAdminOpen, setIsAdminOpen] = useState(false);
  const [isMemberPortalOpen, setIsMemberPortalOpen] = useState(false);
  const [activeMemberUser, setActiveMemberUser] = useState(null);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authModalMode, setAuthModalMode] = useState('login');
  const [authUser, setAuthUser] = useState(null);

  // Theme Initializer and Listeners
  useEffect(() => {
    const t = getStoredTheme();
    applyTheme(t);

    const handleThemeUpdate = (e) => {
      if (e.detail) applyTheme(e.detail);
    };
    const handleStorage = () => {
      applyTheme(getStoredTheme());
    };
    window.addEventListener('kinetix-theme-changed', handleThemeUpdate);
    window.addEventListener('storage', handleStorage);
    return () => {
      window.removeEventListener('kinetix-theme-changed', handleThemeUpdate);
      window.removeEventListener('storage', handleStorage);
    };
  }, []);

  // 7. Supabase Auth Session Listener
  useEffect(() => {
    async function initAuth() {
      try {
        const { data } = await supabase.auth.getUser();
        if (data?.user) {
          setAuthUser(data.user);
        } else {
          const stored = localStorage.getItem('kinetix_auth_user');
          if (stored) setAuthUser(JSON.parse(stored));
        }
      } catch (e) {
        console.warn('Initial session check error', e);
      }
    }
    initAuth();

    try {
      const { data: authListener } = supabase.auth.onAuthStateChange((event, session) => {
        if (session?.user) {
          setAuthUser(session.user);
        } else {
          setAuthUser(null);
        }
      });
      return () => {
        authListener?.subscription?.unsubscribe?.();
      };
    } catch (e) {
      // Mock listener fallback
    }

    const handleAuthEvent = () => {
      try {
        const stored = localStorage.getItem('kinetix_auth_user');
        setAuthUser(stored ? JSON.parse(stored) : null);
      } catch (e) {}
    };
    window.addEventListener('kinetix_auth_changed', handleAuthEvent);
    return () => {
      window.removeEventListener('kinetix_auth_changed', handleAuthEvent);
    };
  }, []);

  // 8. Route check: Automatically open Admin Dashboard or Member Portal if URL matches
  useEffect(() => {
    const handleRouteChange = () => {
      const path = window.location.pathname;
      const hash = window.location.hash;
      const search = window.location.search;
      if (path === '/admin' || hash === '#admin' || search.includes('admin=true')) {
        setIsAdminOpen(true);
        setIsMemberPortalOpen(false);
      } else if (path === '/portal' || hash === '#portal' || hash === '#member' || search.includes('portal=true')) {
        setIsMemberPortalOpen(true);
        setIsAdminOpen(false);
      }
    };

    handleRouteChange();
    window.addEventListener('popstate', handleRouteChange);
    window.addEventListener('hashchange', handleRouteChange);
    return () => {
      window.removeEventListener('popstate', handleRouteChange);
      window.removeEventListener('hashchange', handleRouteChange);
    };
  }, []);

  const handleOpenBooking = (context = 'Free Trial') => {
    setBookingContext(context);
    setIsBookingModalOpen(true);
  };

  const handleCloseBooking = () => {
    setIsBookingModalOpen(false);
    setBookingContext('');
  };

  const handleOpenAdmin = () => {
    setIsAdminOpen(true);
    setIsMemberPortalOpen(false);
    if (window.location.hash !== '#admin' && window.location.pathname !== '/admin') {
      try {
        window.history.pushState(null, '', '#admin');
      } catch (e) {}
    }
  };

  const handleCloseAdmin = () => {
    setIsAdminOpen(false);
    if (window.location.hash === '#admin') {
      try {
        window.history.pushState(null, '', window.location.pathname);
      } catch (e) {}
    }
  };

  const handleOpenMemberPortal = (member = null) => {
    if (member) {
      setActiveMemberUser(member);
    } else if (authUser && (authUser.role === USER_ROLES.MEMBER || authUser.user_metadata?.role === 'member')) {
      setActiveMemberUser(authUser);
    } else {
      const demoMember = DEMO_USERS.find(u => u.role === USER_ROLES.MEMBER);
      setActiveMemberUser(demoMember);
    }
    setIsMemberPortalOpen(true);
    setIsAdminOpen(false);
    if (window.location.hash !== '#portal') {
      try {
        window.history.pushState(null, '', '#portal');
      } catch (e) {}
    }
  };

  const handleCloseMemberPortal = () => {
    setIsMemberPortalOpen(false);
    if (window.location.hash === '#portal' || window.location.hash === '#member') {
      try {
        window.history.pushState(null, '', window.location.pathname);
      } catch (e) {}
    }
  };

  const handleOpenAuth = (mode = 'login') => {
    setAuthModalMode(mode);
    setIsAuthModalOpen(true);
  };

  const handleCloseAuth = () => {
    setIsAuthModalOpen(false);
  };

  return (
    <div className="app-root">
      {/* Sticky Navigation Bar */}
      <Navbar 
        onOpenBooking={handleOpenBooking} 
        onOpenAdmin={handleOpenAdmin}
        isAdminOpen={isAdminOpen}
        onOpenMemberPortal={handleOpenMemberPortal}
        isMemberPortalOpen={isMemberPortalOpen}
        onOpenAuth={handleOpenAuth}
        authUser={authUser}
      />

      <main>
        {/* Full-Screen Hero Section */}
        <Hero onOpenBooking={handleOpenBooking} />

        {/* Live Animated Statistics & Trust Badges */}
        <Stats />

        {/* Editorial Asymmetric About Section */}
        <About onOpenBooking={handleOpenBooking} />

        {/* Specialized Programs Section */}
        <Programs onOpenBooking={handleOpenBooking} />

        {/* Certified Coaches & Trainers Showcase */}
        <Trainers onOpenBooking={handleOpenBooking} />

        {/* Memberships & Transparent Pricing */}
        <Memberships onOpenBooking={handleOpenBooking} />

        {/* Real Member Transformations (Before/After Slider) */}
        <Transformations onOpenBooking={handleOpenBooking} />

        {/* Verified Member Testimonials Carousel (Retrieved from Supabase) */}
        <Testimonials />

        {/* 18,000 Sq.Ft Facilities Showcase */}
        <Facilities onOpenBooking={handleOpenBooking} />

        {/* Weekly Coached Class Schedule */}
        <Schedule onOpenBooking={handleOpenBooking} />

        {/* Photo Gallery & Lightbox Viewer */}
        <Gallery />

        {/* High-Converting Free Trial CTA Banner */}
        <FreeTrialCTA onOpenBooking={handleOpenBooking} />

        {/* Contact, Timings, Google Maps, Lead Form & FAQs (Submits to Supabase enquiries) */}
        <Contact onLeadSubmitted={() => {}} />
      </main>

      {/* Multi-Column Professional Footer */}
      <Footer onOpenBooking={handleOpenBooking} />

      {/* Floating Interactive WhatsApp Widget */}
      <WhatsAppWidget />

      {/* Floating Personal User Theme Customizer (Light / Dark & Accents) */}
      <UserThemeWidget />

      {/* Mobile Bottom Quick Action Bar */}
      <MobileActionBar onOpenBooking={handleOpenBooking} />

      {/* Interactive Global Booking / Free Trial Modal */}
      <BookingModal
        isOpen={isBookingModalOpen}
        onClose={handleCloseBooking}
        initialContext={bookingContext}
      />

      {/* Supabase Member / Admin Auth Modal */}
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={handleCloseAuth}
        initialMode={authModalMode}
        onOpenAdmin={() => {
          setIsAdminOpen(true);
          setIsMemberPortalOpen(false);
        }}
        onOpenMemberPortal={(user) => {
          handleOpenMemberPortal(user);
        }}
        onAuthSuccess={(user) => {
          setAuthUser(user);
          const isMember = Boolean(
            user && (
              user.role === USER_ROLES.MEMBER ||
              user.user_metadata?.role === 'member' ||
              user.email === 'vikram.s@example.com' ||
              (typeof user.memberId === 'string')
            )
          );
          const isAdminOrStaff = Boolean(
            user && (
              user.role === 'admin' ||
              user.role === USER_ROLES.OWNER ||
              user.role === USER_ROLES.ADMIN ||
              user.role === USER_ROLES.MANAGER ||
              user.role === USER_ROLES.TRAINER ||
              user.role === USER_ROLES.RECEPTIONIST ||
              user.user_metadata?.role === 'admin' ||
              user.email === 'admin@01' ||
              user.email === 'admin@01.com' ||
              (typeof user.email === 'string' && user.email.toLowerCase().startsWith('admin@'))
            )
          );

          if (isMember) {
            handleOpenMemberPortal(user);
          } else if (isAdminOrStaff) {
            setIsAdminOpen(true);
            setIsMemberPortalOpen(false);
          } else {
            setIsAdminOpen(false);
            setIsMemberPortalOpen(false);
          }
        }}
      />

      {/* Admin / Manager / Staff Command Center (Operations & Finance) */}
      <AdminDashboard
        isOpen={isAdminOpen}
        onClose={handleCloseAdmin}
      />

      {/* Dedicated Mobile-First Member Experience & QR Pass Portal */}
      <MemberPortal
        isOpen={isMemberPortalOpen}
        onClose={handleCloseMemberPortal}
        memberUser={activeMemberUser}
      />
    </div>
  );
}
