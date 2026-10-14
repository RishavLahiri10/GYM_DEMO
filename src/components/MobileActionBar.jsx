import React from 'react';
import { GYM_CONFIG } from '../data/gymData';
import { Phone, MessageSquare, Sparkles } from 'lucide-react';

export default function MobileActionBar({ onOpenBooking }) {
  const handleWhatsApp = () => {
    const url = `https://wa.me/${GYM_CONFIG.whatsappNumber}?text=${encodeURIComponent(GYM_CONFIG.whatsappDefaultMsg)}`;
    window.open(url, '_blank');
  };

  return (
    <div className="mobile-action-bar" aria-label="Quick Mobile Actions">
      <div className="mobile-action-inner">
        {/* Call Action */}
        <a 
          href={`tel:${GYM_CONFIG.phoneRaw}`} 
          className="mob-act-btn mob-btn-call"
          id="mobile-bottom-call-btn"
        >
          <Phone size={18} />
          <span>CALL</span>
        </a>

        {/* WhatsApp Action */}
        <button 
          onClick={handleWhatsApp}
          className="mob-act-btn mob-btn-whatsapp"
          id="mobile-bottom-wa-btn"
        >
          <MessageSquare size={18} />
          <span>WHATSAPP</span>
        </button>

        {/* Free Trial Action */}
        <button 
          onClick={() => onOpenBooking('Mobile Bottom Bar')}
          className="mob-act-btn mob-btn-trial"
          id="mobile-bottom-trial-btn"
        >
          <Sparkles size={18} />
          <span>FREE TRIAL</span>
        </button>
      </div>
    </div>
  );
}
