import React, { useState } from 'react';
import { MEMBERSHIP_PLANS } from '../data/gymData';
import { Check, X, Shield, ArrowRight } from 'lucide-react';

export default function Memberships({ onOpenBooking }) {
  const [billingCycle, setBillingCycle] = useState('monthly'); // 'monthly' | 'quarterly' | 'annual'

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
          <span className="section-tag">
            TRANSPARENT VALUE
          </span>
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
          {MEMBERSHIP_PLANS.map((plan) => {
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
                    <span>{plan.ctaText}</span>
                    <ArrowRight size={15} />
                  </button>
                </div>

                {/* Features List */}
                <div className="plan-features-block">
                  <span className="features-list-title">Included:</span>
                  <ul className="features-checklist">
                    {plan.features.map((feat, fIdx) => (
                      <li 
                        key={fIdx} 
                        className={`feature-item ${feat.included ? 'included' : 'not-included'}`}
                      >
                        <span className="feat-check">
                          {feat.included ? <Check size={14} className="text-volt" /> : <X size={14} className="text-muted" />}
                        </span>
                        <span className="feature-text">{feat.text}</span>
                      </li>
                    ))}
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
