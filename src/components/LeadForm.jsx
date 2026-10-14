import React, { useState } from 'react';
import { GYM_CONFIG } from '../data/gymData';
import { CheckCircle2, AlertCircle, Loader2, ArrowRight } from 'lucide-react';

export default function LeadForm({ initialSubject = '', onLeadSubmitted }) {
  const [formData, setFormData] = useState({
    fullName: '',
    phone: '',
    email: '',
    fitnessGoal: 'Weight Loss',
    preferredTime: 'Morning (6:00 AM – 9:00 AM)',
    message: initialSubject ? `Inquiry regarding: ${initialSubject}` : ''
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const goalOptions = [
    'Weight Loss',
    'Muscle Building',
    'Strength',
    'Personal Training',
    'General Fitness',
    'Other'
  ];

  const timeOptions = [
    'Early Morning (5:30 AM – 8:00 AM)',
    'Morning (8:00 AM – 11:00 AM)',
    'Mid-Day (11:00 AM – 4:00 PM)',
    'Evening (4:00 PM – 7:30 PM)',
    'Night (7:30 PM – 10:30 PM)'
  ];

  const validate = () => {
    const errs = {};
    if (!formData.fullName.trim() || formData.fullName.trim().length < 2) {
      errs.fullName = 'Please enter your full name.';
    }

    const phoneClean = formData.phone.replace(/[\s\-\(\)]/g, '');
    if (!phoneClean) {
      errs.phone = 'Phone number is required.';
    } else if (!/^(?:\+91|91|0)?[6-9]\d{9}$/.test(phoneClean)) {
      errs.phone = 'Please enter a valid 10-digit mobile number.';
    }

    if (!formData.email.trim()) {
      errs.email = 'Email address is required.';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email.trim())) {
      errs.email = 'Please enter a valid email address.';
    }

    return errs;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setIsSubmitting(true);

    setTimeout(() => {
      const newLead = {
        id: `lead-${Date.now()}`,
        name: formData.fullName.trim(),
        phone: formData.phone.trim(),
        email: formData.email.trim(),
        goal: formData.fitnessGoal,
        time: formData.preferredTime,
        message: formData.message.trim(),
        status: 'New',
        createdAt: new Date().toLocaleString('en-IN', {
          dateStyle: 'medium',
          timeStyle: 'short'
        })
      };

      try {
        const stored = localStorage.getItem('kinetix_leads');
        const existingLeads = stored ? JSON.parse(stored) : [];
        const updatedLeads = [newLead, ...existingLeads];
        localStorage.setItem('kinetix_leads', JSON.stringify(updatedLeads));
      } catch (err) {
        console.error('Error saving lead', err);
      }

      if (onLeadSubmitted) {
        onLeadSubmitted(newLead);
      }

      setIsSubmitting(false);
      setIsSuccess(true);
    }, 700);
  };

  const handleReset = () => {
    setFormData({
      fullName: '',
      phone: '',
      email: '',
      fitnessGoal: 'Weight Loss',
      preferredTime: 'Morning (6:00 AM – 9:00 AM)',
      message: ''
    });
    setErrors({});
    setIsSuccess(false);
  };

  return (
    <div className="lead-form-card" id="lead-form-container">
      {isSuccess ? (
        <div className="form-success-box" role="alert">
          <CheckCircle2 size={40} className="text-volt" style={{ margin: '0 auto 16px auto', display: 'block' }} />

          <h3 className="success-heading">YOU'RE ON THE LIST</h3>
          <p className="success-message">
            Thank you, <strong>{formData.fullName}</strong>. Your 1-Day VIP Trial pass reservation has been recorded.
          </p>

          <div className="success-meta-card">
            <div className="smc-row">
              <span className="smc-label">Goal:</span>
              <span className="smc-val text-volt">{formData.fitnessGoal}</span>
            </div>
            <div className="smc-row">
              <span className="smc-label">Time:</span>
              <span className="smc-val">{formData.preferredTime}</span>
            </div>
          </div>

          <p className="success-subtext">
            Our Senior Membership Advisor will contact you shortly via WhatsApp/Phone to confirm your arrival time and prepare your locker pass.
          </p>

          <div className="success-action-buttons">
            <a
              href={`https://wa.me/${GYM_CONFIG.whatsappNumber}?text=${encodeURIComponent(
                `Hi, I submitted my VIP Trial on the website. My name is ${formData.fullName} (${formData.phone}). Goal: ${formData.fitnessGoal}.`
              )}`}
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-primary w-full"
            >
              Confirm on WhatsApp
            </a>

            <button onClick={handleReset} className="btn btn-secondary w-full" style={{ marginTop: '10px' }}>
              Book Another Session
            </button>
          </div>
        </div>
      ) : (
        <form onSubmit={handleSubmit} noValidate className="form-inner">
          <div className="form-header">
            <span className="section-tag" style={{ marginBottom: '8px' }}>
              COMPLIMENTARY PASS
            </span>
            <h3 className="form-title">CLAIM YOUR 1-DAY PASS</h3>
            <p className="form-desc">
              Experience the facility, coaches, and training floor firsthand. No credit card required.
            </p>
          </div>

          {/* Full Name */}
          <div className="form-group">
            <label htmlFor="lead-name" className="form-label">
              Full Name <span className="req">*</span>
            </label>
            <input
              type="text"
              id="lead-name"
              name="fullName"
              value={formData.fullName}
              onChange={handleChange}
              placeholder="e.g. Vikram Malhotra"
              className={`form-input ${errors.fullName ? 'input-error' : ''}`}
              required
            />
            {errors.fullName && (
              <span className="field-error-text">
                <AlertCircle size={13} /> {errors.fullName}
              </span>
            )}
          </div>

          {/* Phone */}
          <div className="form-group">
            <label htmlFor="lead-phone" className="form-label">
              Phone Number <span className="req">*</span>
            </label>
            <input
              type="tel"
              id="lead-phone"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              placeholder="e.g. +91 98765 43210"
              className={`form-input ${errors.phone ? 'input-error' : ''}`}
              required
            />
            {errors.phone && (
              <span className="field-error-text">
                <AlertCircle size={13} /> {errors.phone}
              </span>
            )}
          </div>

          {/* Email */}
          <div className="form-group">
            <label htmlFor="lead-email" className="form-label">
              Email Address <span className="req">*</span>
            </label>
            <input
              type="email"
              id="lead-email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="e.g. vikram@example.com"
              className={`form-input ${errors.email ? 'input-error' : ''}`}
              required
            />
            {errors.email && (
              <span className="field-error-text">
                <AlertCircle size={13} /> {errors.email}
              </span>
            )}
          </div>

          {/* 2-Columns: Goal & Time */}
          <div className="form-grid-2">
            <div className="form-group">
              <label htmlFor="lead-goal" className="form-label">
                Fitness Goal
              </label>
              <select
                id="lead-goal"
                name="fitnessGoal"
                value={formData.fitnessGoal}
                onChange={handleChange}
                className="form-select"
              >
                {goalOptions.map((goal) => (
                  <option key={goal} value={goal}>
                    {goal}
                  </option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="lead-time" className="form-label">
                Preferred Time
              </label>
              <select
                id="lead-time"
                name="preferredTime"
                value={formData.preferredTime}
                onChange={handleChange}
                className="form-select"
              >
                {timeOptions.map((t) => (
                  <option key={t} value={t}>
                    {t}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Message */}
          <div className="form-group">
            <label htmlFor="lead-message" className="form-label">
              Message or Specific Goals <span className="opt">(Optional)</span>
            </label>
            <textarea
              id="lead-message"
              name="message"
              rows={2}
              value={formData.message}
              onChange={handleChange}
              placeholder="Tell us about previous training experience or injuries..."
              className="form-textarea"
            />
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isSubmitting}
            className="btn btn-primary w-full form-submit-btn"
            id="lead-form-submit-btn"
          >
            {isSubmitting ? (
              <>
                <Loader2 size={16} className="animate-spin" />
                <span>RESERVING SPOT...</span>
              </>
            ) : (
              <>
                <span>BOOK MY FREE TRIAL</span>
                <ArrowRight size={16} />
              </>
            )}
          </button>
        </form>
      )}
    </div>
  );
}
