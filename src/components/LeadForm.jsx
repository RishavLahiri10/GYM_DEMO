import React, { useState } from 'react';
import { GYM_CONFIG } from '../data/gymData';
import { supabase, isSupabaseConfigured } from '../lib/supabaseClient';
import { CheckCircle2, AlertCircle, Loader2, ArrowRight, Calendar, Clock, Sparkles } from 'lucide-react';

export default function LeadForm({ initialSubject = '', onLeadSubmitted }) {
  // Default date to tomorrow
  const tomorrowStr = new Date(Date.now() + 86400000).toISOString().split('T')[0];
  const todayStr = new Date().toISOString().split('T')[0];

  const [formData, setFormData] = useState({
    fullName: '',
    phone: '',
    email: '',
    fitnessGoal: 'Weight Loss',
    preferredDate: tomorrowStr,
    preferredTime: 'Morning (6:00 AM – 9:00 AM)',
    message: initialSubject ? `Inquiry regarding: ${initialSubject}` : ''
  });

  const [errors, setErrors] = useState({});
  const [submitError, setSubmitError] = useState('');
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
    if (submitError) {
      setSubmitError('');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setIsSubmitting(true);
    setSubmitError('');

    try {
      // 1. Send free-trial enquiry to Supabase
      const enquiryPayload = {
        name: formData.fullName.trim(),
        email: formData.email.trim(),
        phone: formData.phone.trim(),
        preferred_date: formData.preferredDate || tomorrowStr,
        preferred_time: formData.preferredTime,
        goal: formData.fitnessGoal,
        message: formData.message.trim() || `Requested ${initialSubject || 'VIP Free Trial Pass'}`,
        type: initialSubject && !initialSubject.includes('Trial') ? 'General Enquiry' : 'Free Trial',
        status: 'New'
      };

      const { data, error } = await supabase
        .from("enquiries")
        .insert([enquiryPayload]);

      if (error && isSupabaseConfigured) {
        console.error("Supabase insert error:", error);
        setSubmitError(error.message || "Failed to submit enquiry. Please try again.");
        setIsSubmitting(false);
        return;
      }

      // Also backup to localStorage
      const newLead = {
        id: `lead-${Date.now()}`,
        ...enquiryPayload,
        time: formData.preferredTime,
        createdAt: new Date().toLocaleString('en-IN', {
          dateStyle: 'medium',
          timeStyle: 'short'
        })
      };

      try {
        const stored = localStorage.getItem('kinetix_leads');
        const existingLeads = stored ? JSON.parse(stored) : [];
        localStorage.setItem('kinetix_leads', JSON.stringify([newLead, ...existingLeads]));
      } catch (err) {
        console.error('Error saving local lead backup', err);
      }

      if (onLeadSubmitted) {
        onLeadSubmitted(newLead);
      }

      setIsSubmitting(false);
      setIsSuccess(true);
    } catch (err) {
      console.error("Submission error:", err);
      alert("Something went wrong");
      setIsSubmitting(false);
    }
  };

  const handleReset = () => {
    setFormData({
      fullName: '',
      phone: '',
      email: '',
      fitnessGoal: 'Weight Loss',
      preferredDate: tomorrowStr,
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

          <h3 className="success-heading">YOU'RE ON THE VIP LIST</h3>
          <p className="success-message">
            Thank you, <strong>{formData.fullName}</strong>. Your 1-Day VIP Trial Pass has been recorded in our system.
          </p>

          <div className="success-meta-card">
            <div className="smc-row">
              <span className="smc-label">Date:</span>
              <span className="smc-val text-volt">{formData.preferredDate}</span>
            </div>
            <div className="smc-row">
              <span className="smc-label">Slot:</span>
              <span className="smc-val">{formData.preferredTime}</span>
            </div>
            <div className="smc-row">
              <span className="smc-label">Goal:</span>
              <span className="smc-val text-volt">{formData.fitnessGoal}</span>
            </div>
          </div>

          <p className="success-subtext">
            Our Senior Membership Advisor will contact you via WhatsApp/Phone at <strong>{formData.phone}</strong> to confirm arrival and prepare your VIP locker.
          </p>

          <div className="success-action-buttons">
            <a
              href={`https://wa.me/${GYM_CONFIG.whatsappNumber}?text=${encodeURIComponent(
                `Hi, I just booked my VIP Free Trial for ${formData.preferredDate} (${formData.preferredTime}). Name: ${formData.fullName} (${formData.phone}). Goal: ${formData.fitnessGoal}.`
              )}`}
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-primary w-full"
            >
              Confirm via WhatsApp
            </a>

            <button onClick={handleReset} className="btn btn-secondary w-full" style={{ marginTop: '10px' }}>
              Book Another Session
            </button>
          </div>
        </div>
      ) : (
        <form onSubmit={handleSubmit} noValidate className="form-inner">
          <div className="form-header">
            <span className="section-tag" style={{ marginBottom: '8px', display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
              <Sparkles size={12} /> COMPLIMENTARY 1-DAY PASS
            </span>
            <h3 className="form-title">BOOK YOUR FREE TRIAL</h3>
            <p className="form-desc">
              Experience our Olympic platforms, bio-sauna, and head coaches. Stored directly in our gym system.
            </p>
          </div>

          {submitError && (
            <div className="form-error-alert" style={{ background: 'rgba(239, 68, 68, 0.1)', border: '1px solid var(--danger, #ef4444)', padding: '10px 14px', borderRadius: '8px', color: '#fca5a5', marginBottom: '16px', fontSize: '0.875rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <AlertCircle size={16} color="#ef4444" />
              <span>{submitError}</span>
            </div>
          )}

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
              placeholder="e.g. Rahul Sharma"
              className={`form-input ${errors.fullName ? 'input-error' : ''}`}
              required
            />
            {errors.fullName && (
              <span className="field-error-text">
                <AlertCircle size={13} /> {errors.fullName}
              </span>
            )}
          </div>

          {/* 2-Columns: Phone & Email */}
          <div className="form-grid-2">
            <div className="form-group">
              <label htmlFor="lead-phone" className="form-label">
                Mobile Number <span className="req">*</span>
              </label>
              <input
                type="tel"
                id="lead-phone"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                placeholder="e.g. 98765 43210"
                className={`form-input ${errors.phone ? 'input-error' : ''}`}
                required
              />
              {errors.phone && (
                <span className="field-error-text">
                  <AlertCircle size={13} /> {errors.phone}
                </span>
              )}
            </div>

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
                placeholder="e.g. rahul@example.com"
                className={`form-input ${errors.email ? 'input-error' : ''}`}
                required
              />
              {errors.email && (
                <span className="field-error-text">
                  <AlertCircle size={13} /> {errors.email}
                </span>
              )}
            </div>
          </div>

          {/* 2-Columns: Preferred Date & Time */}
          <div className="form-grid-2">
            <div className="form-group">
              <label htmlFor="lead-date" className="form-label" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <Calendar size={13} /> Preferred Date
              </label>
              <input
                type="date"
                id="lead-date"
                name="preferredDate"
                value={formData.preferredDate}
                min={todayStr}
                onChange={handleChange}
                className="form-input"
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="lead-time" className="form-label" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <Clock size={13} /> Preferred Time Slot
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

          {/* Fitness Goal */}
          <div className="form-group">
            <label htmlFor="lead-goal" className="form-label">
              Primary Fitness Goal
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

          {/* Message */}
          <div className="form-group">
            <label htmlFor="lead-message" className="form-label">
              Special Requests or Health Goals <span className="opt">(Optional)</span>
            </label>
            <textarea
              id="lead-message"
              name="message"
              rows={2}
              value={formData.message}
              onChange={handleChange}
              placeholder="e.g. Want to try deadlifting or InBody body fat scan..."
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
                <span>CONFIRMING WITH SUPABASE...</span>
              </>
            ) : (
              <>
                <span>CONFIRM FREE TRIAL PASS</span>
                <ArrowRight size={16} />
              </>
            )}
          </button>
        </form>
      )}
    </div>
  );
}
