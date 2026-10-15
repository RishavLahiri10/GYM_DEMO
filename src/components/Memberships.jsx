import React, { useState, useEffect } from 'react';
import { MEMBERSHIP_PLANS } from '../data/gymData';
import { supabase } from '../lib/supabaseClient';
import { Check, X, Shield, ArrowRight, Database } from 'lucide-react';

export default function Memberships({ onOpenBooking }) {
  const [plans, setPlans] = useState(MEMBERSHIP_PLANS);
  const [isLiveFromDb, setIsLiveFromDb] = useState(false);
  const [billingCycle, setBillingCycle] = useState('monthly'); // 'monthly' | 'quarterly' | 'annual'

  // 2. Load dynamic membership plans from Supabase
  useEffect(() => {
    async function loadPlans() {
      try {
        const { data, error } = await supabase
          .from('membership_plans')
          .select('*');

        if (!error && data && data.length > 0) {
          const formatted = data.map((p) => {
            const basePrice = Number(p.price) || 1499;
            return {
              id: p.id,
              name: p.name,
              popular: Boolean(p.is_popular),
              priceMonthly: basePrice,
              priceQuarterly: Math.round(basePrice * 3 * 0.85),
              priceAnnual: Math.round(basePrice * 12 * 0.70),
              periodText: p.duration || 'MONTH',
              description: p.description || 'Full access to equipment and amenities.',
              ctaText: 'CHOOSE PLAN',
              features: Array.isArray(p.features) ? p.features : [
                { text: "Full gym floor access (5:30 AM – 10:30 PM)", included: true },
                { text: "Olympic lifting & cardio zones", included: true },
                { text: "Luxury locker & shower facility", included: true }
              ]
            };
          });
          setPlans(formatted);
          setIsLiveFromDb(true);
        }
      } catch (err) {
        console.info('Supabase membership_plans query handled:', err);
      }
    }
    loadPlans();
  }, []);

  const getPrice = (plan) => {
    if (billingCycle === 'quarterly') {
      return Math.round(plan.priceQuarterly / 3);
    }
    if (billingCycle === 'annual') {
      return Math.round(plan.priceAnnual / 12);
    }
    return plan.priceMonthly;
  };

  const getBilledText = (plan) => {
    if (billingCycle === 'quarterly') {
      return `Billed ₹${plan.priceQuarterly.toLocaleString()} every 3 months (Save 15%)`;
    }
    if (billingCycle === 'annual') {
      return `Billed ₹${plan.priceAnnual.toLocaleString()} annually (Save 30% + 2 Months Free)`;
    }
    return 'Billed on a monthly recurring basis • No lock-in';
  };

  return (
    <section id="membership" className="memberships-section section-padding" aria-label="Membership Pricing Plans">
      <div className="container">
        {/* Section Header */}
        <div className="section-header-center">
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
            <span className="section-tag">
              TRANSPARENT VALUE
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
                <Database size={10} /> Dynamic Database Pricing
              </span>
            )}
          </div>
          <h2 className="section-title">
            CHOOSE YOUR <span className="text-volt-accent">MEMBERSHIP.</span>
          </h2>
          <p className="section-subtitle">
            All memberships include full facility access, initial movement assessment, and luxury locker amenities.
          </p>

          {/* Clean Segmented Control */}
          <div className="billing-segmented-bar">
            <button
              type="button"
              className={`segmented-tab ${billingCycle === 'monthly' ? 'active' : ''}`}
              onClick={() => setBillingCycle('monthly')}
            >
              Monthly
            </button>

            <button
              type="button"
              className={`segmented-tab ${billingCycle === 'quarterly' ? 'active' : ''}`}
              onClick={() => setBillingCycle('quarterly')}
            >
              Quarterly (-15%)
            </button>

            <button
              type="button"
              className={`segmented-tab ${billingCycle === 'annual' ? 'active' : ''}`}
              onClick={() => setBillingCycle('annual')}
            >
              Annual (-30%)
            </button>
          </div>
        </div>

        {/* Pricing Cards Grid */}
        <div className="memberships-grid">
          {plans.map((plan) => {
            const price = getPrice(plan);
            const isPopular = plan.popular;

            return (
              <div 
                key={plan.id} 
                className={`membership-card ${isPopular ? 'popular-tier' : ''}`}
              >
                <div className="membership-card-header">
                  <div className="tier-header-row">
                    <span className="plan-tier-name">{plan.name}</span>
                    {isPopular && (
                      <span className="popular-tag">MOST POPULAR</span>
                    )}
                  </div>
                  <p className="plan-brief">{plan.description}</p>
                </div>

                {/* Price Display */}
                <div className="plan-price-block">
                  <div className="price-num-row">
                    <span className="currency-symbol">₹</span>
                    <span className="price-amount">{price.toLocaleString()}</span>
                    <span className="price-period">/ {plan.periodText.toLowerCase()}</span>
                  </div>
                  <span className="price-billed-info">{getBilledText(plan)}</span>
                </div>

                {/* CTA Button */}
                <div className="plan-cta-block">
                  <button
                    onClick={() => onOpenBooking(`Plan: ${plan.name} (${billingCycle.toUpperCase()})`)}
                    className={`btn w-full ${isPopular ? 'btn-primary' : 'btn-secondary'}`}
                    id={`membership-btn-${plan.id}`}
                  >
                    <span>BOOK FREE TRIAL / ENQUIRE</span>
                    <ArrowRight size={15} />
                  </button>
                </div>

                {/* Features List */}
                <div className="plan-features-block">
                  <span className="features-list-title">Included:</span>
                  <ul className="features-checklist">
                    {plan.features.map((feat, fIdx) => {
                      const isIncluded = typeof feat === 'string' ? true : feat.included;
                      const text = typeof feat === 'string' ? feat : feat.text;
                      return (
                        <li 
                          key={fIdx} 
                          className={`feature-item ${isIncluded ? 'included' : 'not-included'}`}
                        >
                          <span className="feat-check">
                            {isIncluded ? <Check size={14} className="text-volt" /> : <X size={14} className="text-muted" />}
                          </span>
                          <span className="feature-text">{text}</span>
                        </li>
                      );
                    })}
                  </ul>
                </div>

                {/* Guarantee */}
                <div className="plan-card-footer">
                  <Shield size={14} className="text-volt" />
                  <span>7-Day No-Questions Refund Guarantee</span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Corporate / Custom Consultation Callout */}
        <div className="membership-corporate-banner">
          <div className="corp-banner-text">
            <h4>Corporate Wellness or Private Coaching?</h4>
            <p>We provide enterprise wellness programs, executive InBody screenings, and private studio bookings.</p>
          </div>
          <button 
            onClick={() => onOpenBooking('Corporate / Private Inquiry')}
            className="btn btn-secondary btn-sm"
          >
            Inquire for Teams
          </button>
        </div>
      </div>
    </section>
  );
}
