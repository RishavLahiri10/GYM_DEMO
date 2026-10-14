import React, { useState } from 'react';
import { GYM_CONFIG } from '../data/gymData';
import { MessageSquare, X, Send } from 'lucide-react';

export default function WhatsAppWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [customMsg, setCustomMsg] = useState(GYM_CONFIG.whatsappDefaultMsg);

  const handleSend = () => {
    const textToSend = customMsg.trim() || GYM_CONFIG.whatsappDefaultMsg;
    const url = `https://wa.me/${GYM_CONFIG.whatsappNumber}?text=${encodeURIComponent(textToSend)}`;
    window.open(url, '_blank');
    setIsOpen(false);
  };

  const quickPrompts = [
    "I'd like to book a Free VIP Trial for tomorrow.",
    "Can you share the pricing for Personal Training?",
    "What are your peak hours and parking facilities?"
  ];

  return (
    <div className="whatsapp-widget-container" aria-label="WhatsApp Chat Widget">
      {/* Popup Drawer */}
      {isOpen && (
        <div className="whatsapp-chat-card">
          <div className="wa-card-header">
            <div className="wa-advisor-info">
              <div className="wa-avatar-wrap">
                <img 
                  src="https://images.unsplash.com/photo-1567013127542-490d757e51fc?q=80&w=120&auto=format&fit=crop" 
                  alt="Coach Advisor" 
                  className="wa-avatar-img"
                />
              </div>
              <div className="wa-advisor-details">
                <h4 className="wa-advisor-name">Arjun Sharma</h4>
                <p className="wa-advisor-status">Senior Coach • Desk Active</p>
              </div>
            </div>
            <button 
              onClick={() => setIsOpen(false)}
              className="wa-close-btn"
              aria-label="Close WhatsApp chat"
            >
              <X size={18} />
            </button>
          </div>

          <div className="wa-chat-body">
            <div className="wa-msg-bubble incoming">
              <p>
                Hi! Welcome to <strong>KINETIX Athletic Club</strong>. How can I help you today?
              </p>
            </div>

            <div className="wa-quick-chips">
              <span className="chips-title">Frequent Inquiries:</span>
              {quickPrompts.map((q, idx) => (
                <button
                  key={idx}
                  onClick={() => setCustomMsg(q)}
                  className="wa-chip-btn"
                >
                  {q}
                </button>
              ))}
            </div>
          </div>

          <div className="wa-card-footer">
            <textarea
              rows={2}
              value={customMsg}
              onChange={(e) => setCustomMsg(e.target.value)}
              placeholder="Type your question..."
              className="wa-input"
            />
            <button 
              onClick={handleSend}
              className="wa-send-btn"
              id="wa-send-direct-btn"
            >
              <span>Chat on WhatsApp</span>
              <Send size={14} />
            </button>
          </div>
        </div>
      )}

      {/* Clean Floating Trigger Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="whatsapp-float-btn"
        aria-label="Open WhatsApp conversation"
        id="floating-whatsapp-btn"
      >
        <MessageSquare size={20} />
        <span className="wa-btn-label">WhatsApp</span>
      </button>
    </div>
  );
}
