import React, { useState } from 'react';
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
import './App.css';

export default function App() {
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);
  const [bookingContext, setBookingContext] = useState('');
  const [isAdminOpen, setIsAdminOpen] = useState(false);

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
  };

  const handleCloseAdmin = () => {
    setIsAdminOpen(false);
  };

  return (
    <div className="app-root">
      {/* Sticky Navigation Bar */}
      <Navbar 
        onOpenBooking={handleOpenBooking} 
        onOpenAdmin={handleOpenAdmin}
        isAdminOpen={isAdminOpen}
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

        {/* Verified Member Testimonials Carousel */}
        <Testimonials />

        {/* 18,000 Sq.Ft Facilities Showcase */}
        <Facilities onOpenBooking={handleOpenBooking} />

        {/* Weekly Coached Class Schedule */}
        <Schedule onOpenBooking={handleOpenBooking} />

        {/* Photo Gallery & Lightbox Viewer */}
        <Gallery />

        {/* High-Converting Free Trial CTA Banner */}
        <FreeTrialCTA onOpenBooking={handleOpenBooking} />

        {/* Contact, Timings, Google Maps, Lead Form & FAQs */}
        <Contact onLeadSubmitted={() => {}} />
      </main>

      {/* Multi-Column Professional Footer */}
      <Footer onOpenBooking={handleOpenBooking} />

      {/* Floating Interactive WhatsApp Widget */}
      <WhatsAppWidget />

      {/* Mobile Bottom Quick Action Bar */}
      <MobileActionBar onOpenBooking={handleOpenBooking} />

      {/* Interactive Global Booking / Free Trial Modal */}
      <BookingModal
        isOpen={isBookingModalOpen}
        onClose={handleCloseBooking}
        initialContext={bookingContext}
      />

      {/* Admin / Manager Portal Modal */}
      <AdminDashboard
        isOpen={isAdminOpen}
        onClose={handleCloseAdmin}
      />
    </div>
  );
}
