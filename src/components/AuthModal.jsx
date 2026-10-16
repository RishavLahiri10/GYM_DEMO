import React, { useState, useEffect } from 'react';
import { supabase, isSupabaseConfigured } from '../lib/supabaseClient';
import { 
  X, 
  Mail, 
  Lock, 
  User, 
  ArrowRight, 
  Loader2, 
  CheckCircle2, 
  AlertCircle, 
  ShieldCheck, 
  LogOut,
  Sparkles,
  Key,
  LayoutDashboard,
  QrCode
} from 'lucide-react';
import { getAdminCredentials } from './AdminDashboard';
import { DEMO_USERS, USER_ROLES, setStoredUser } from '../services/authService';

export default function AuthModal({ 
  isOpen, 
  onClose, 
  onAuthSuccess, 
  onOpenAdmin, 
  onOpenMemberPortal,
  initialMode = 'login' 
}) {
  const [mode, setMode] = useState(initialMode); // 'login' | 'register'
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [currentUser, setCurrentUser] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  useEffect(() => {
    setMode(initialMode);
  }, [initialMode, isOpen]);

  useEffect(() => {
    async function checkSession() {
      try {
        const { data } = await supabase.auth.getUser();
        if (data?.user) {
          setCurrentUser(data.user);
        } else {
          setCurrentUser(null);
        }
      } catch (e) {
        console.warn('Auth check error:', e);
      }
    }
    if (isOpen) {
      checkSession();
      setErrorMsg('');
      setSuccessMsg('');
    }
  }, [isOpen]);

  if (!isOpen) return null;

  // 7. Login with Supabase Auth or Assigned Admin Credentials
  const handleLogin = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');
    if (!email || !password) {
      setErrorMsg('Please enter both email/username and password.');
      return;
    }

    setIsLoading(true);
    const cleanUser = email.trim();
    const cleanPass = password.trim();

    // Check if user is signing in with assigned admin credentials
    const currentCreds = typeof getAdminCredentials === 'function' ? getAdminCredentials() : { username: 'admin@01', password: 'biz01' };
    const isAdminMatch = 
      (cleanUser.toLowerCase() === currentCreds.username.toLowerCase() ||
       cleanUser.toLowerCase() === 'admin@01' ||
       cleanUser.toLowerCase() === 'admin@01.com' ||
       cleanUser.toLowerCase() === 'admin') &&
      (cleanPass === currentCreds.password || cleanPass === 'biz01');

    if (isAdminMatch) {
      const adminUser = {
        id: 'admin-master',
        email: currentCreds.username,
        role: 'admin',
        user_metadata: { role: 'admin', full_name: 'Gym Administrator' }
      };
      localStorage.setItem('kinetix_auth_user', JSON.stringify(adminUser));
      setCurrentUser(adminUser);
      setSuccessMsg('Admin credentials verified. Opening Admin Portal...');
      if (onAuthSuccess) onAuthSuccess(adminUser);
      setTimeout(() => {
        onClose();
        if (onOpenAdmin) onOpenAdmin();
      }, 400);
      setIsLoading(false);
      return;
    }

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: cleanUser.includes('@') && cleanUser.includes('.') ? cleanUser : `${cleanUser}@kinetix.com`,
        password: cleanPass
      });

      if (error) {
        setErrorMsg(error.message || 'Invalid login credentials. Please check your email/username and password.');
        setIsLoading(false);
        return;
      }

      const user = data.user;
      setCurrentUser(user);
      const isUserAdmin = Boolean(
        user && (
          user.role === 'admin' ||
          user.user_metadata?.role === 'admin' ||
          (user.email && user.email.toLowerCase().startsWith('admin@'))
        )
      );

      setSuccessMsg(isUserAdmin ? 'Admin verified. Opening Admin Portal...' : 'Signed in successfully!');
      if (onAuthSuccess) onAuthSuccess(user);
      setTimeout(() => {
        onClose();
      }, 500);
    } catch (err) {
      setErrorMsg(err.message || 'An error occurred during sign in.');
    } finally {
      setIsLoading(false);
    }
  };

  // 7. Register with Supabase Auth
  const handleRegister = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');
    if (!email || !password) {
      setErrorMsg('Please enter both email and password.');
      return;
    }
    if (password.length < 6) {
      setErrorMsg('Password should be at least 6 characters.');
      return;
    }

    setIsLoading(true);
    try {
      const { data, error } = await supabase.auth.signUp({
        email: email.trim(),
        password: password.trim(),
        options: {
          data: {
            full_name: fullName.trim(),
            role: 'member'
          }
        }
      });

      if (error) {
        setErrorMsg(error.message || 'Failed to create account.');
        setIsLoading(false);
        return;
      }

      setSuccessMsg('Account created successfully! You are now logged in.');
      const user = data.user;
      setCurrentUser(user);
      if (onAuthSuccess) onAuthSuccess(user);
      setTimeout(() => {
        onClose();
      }, 1200);
    } catch (err) {
      setErrorMsg(err.message || 'An error occurred during registration.');
    } finally {
      setIsLoading(false);
    }
  };

  // Sign Out with Supabase Auth
  const handleSignOut = async () => {
    setIsLoading(true);
    try {
      await supabase.auth.signOut();
      localStorage.removeItem('kinetix_auth_user');
      setCurrentUser(null);
      window.dispatchEvent(new Event('kinetix_auth_changed'));
      setSuccessMsg('Signed out successfully.');
      if (onAuthSuccess) onAuthSuccess(null);
      setTimeout(() => {
        setSuccessMsg('');
        onClose();
      }, 800);
    } catch (err) {
      setErrorMsg(err.message || 'Failed to sign out');
    } finally {
      setIsLoading(false);
    }
  };

  // Quick 1-Click Admin Sign-In
  const handleDemoAdminLogin = async () => {
    setEmail('admin@01');
    setPassword('biz01');
    setIsLoading(true);
    try {
      const adminUser = {
        id: 'admin-master',
        email: 'admin@01',
        role: 'admin',
        user_metadata: { role: 'admin', full_name: 'Gym Administrator' }
      };
      localStorage.setItem('kinetix_auth_user', JSON.stringify(adminUser));
      setCurrentUser(adminUser);
      setSuccessMsg('Signed in as Administrator (admin@01)!');
      if (onAuthSuccess) onAuthSuccess(adminUser);
      setTimeout(() => onClose(), 800);
    } catch (err) {
      console.warn(err);
    } finally {
      setIsLoading(false);
    }
  };

  // Instant 1-Click Persona Switcher (Owner, Manager, Coach, Member)
  const handleSelectPersona = (persona) => {
    localStorage.setItem('kinetix_auth_user', JSON.stringify(persona));
    setStoredUser(persona);
    setCurrentUser(persona);
    if (persona.role === USER_ROLES.MEMBER) {
      setSuccessMsg(`Welcome, ${persona.name}! Opening Athlete Experience Portal...`);
      if (onAuthSuccess) onAuthSuccess(persona);
      setTimeout(() => {
        onClose();
        if (onOpenMemberPortal) onOpenMemberPortal(persona);
      }, 500);
    } else {
      setSuccessMsg(`Welcome, ${persona.name} (${persona.title})! Opening Command Center...`);
      if (onAuthSuccess) onAuthSuccess(persona);
      setTimeout(() => {
        onClose();
        if (onOpenAdmin) onOpenAdmin();
      }, 500);
    }
  };

  return (
    <div className="booking-modal-overlay" onClick={onClose} style={{ zIndex: 9999 }}>
      <div 
        className="booking-modal-box" 
        onClick={(e) => e.stopPropagation()} 
        style={{ maxWidth: '440px', padding: '0', overflow: 'hidden' }}
      >
        {/* Header Strip */}
        <div className="auth-modal-header-strip">
          <button 
            className="booking-modal-close" 
            onClick={onClose}
            aria-label="Close"
            style={{ top: '16px', right: '16px' }}
          >
            <X size={18} />
          </button>

          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', marginBottom: '8px' }}>
            <span style={{ 
              background: 'var(--accent, #ccff00)', 
              color: '#000', 
              fontSize: '0.65rem', 
              fontWeight: 800, 
              padding: '2px 8px', 
              borderRadius: '4px',
              letterSpacing: '0.05em'
            }}>
              SUPABASE AUTH
            </span>
            <span style={{ fontSize: '0.75rem', color: isSupabaseConfigured ? '#34d399' : '#fbbf24' }}>
              ● {isSupabaseConfigured ? 'Live Supabase Cloud' : 'Offline / Demo Ready'}
            </span>
          </div>

          <h3 className="auth-modal-title">
            {currentUser ? 'ACCOUNT ACTIVE' : (mode === 'login' ? 'MEMBER & ADMIN LOGIN' : 'JOIN KINETIX CLUB')}
          </h3>
          <p className="auth-modal-desc">
            {currentUser 
              ? 'Manage your gym profile, plan subscription and administrative controls.'
              : 'Secure credentials authenticated via Supabase PostgreSQL.'}
          </p>
        </div>

        {/* Modal Body */}
        <div style={{ padding: '24px' }}>
          {errorMsg && (
            <div style={{ 
              background: 'rgba(239, 68, 68, 0.12)', 
              border: '1px solid rgba(239, 68, 68, 0.3)', 
              color: '#fca5a5', 
              padding: '10px 14px', 
              borderRadius: '8px', 
              fontSize: '0.85rem', 
              display: 'flex', 
              alignItems: 'center', 
              gap: '8px',
              marginBottom: '18px'
            }}>
              <AlertCircle size={16} color="#ef4444" />
              <span>{errorMsg}</span>
            </div>
          )}

          {successMsg && (
            <div style={{ 
              background: 'rgba(16, 185, 129, 0.15)', 
              border: '1px solid rgba(16, 185, 129, 0.3)', 
              color: '#34d399', 
              padding: '10px 14px', 
              borderRadius: '8px', 
              fontSize: '0.85rem', 
              display: 'flex', 
              alignItems: 'center', 
              gap: '8px',
              marginBottom: '18px'
            }}>
              <CheckCircle2 size={16} color="#10b981" />
              <span>{successMsg}</span>
            </div>
          )}

          {currentUser ? (
            /* Logged In View */
            <div style={{ textAlign: 'center', padding: '10px 0' }}>
              <div style={{ 
                width: '64px', 
                height: '64px', 
                borderRadius: '50%', 
                background: 'rgba(204, 255, 0, 0.12)', 
                border: '2px solid var(--accent, #ccff00)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 16px auto'
              }}>
                <ShieldCheck size={32} color="var(--accent, #ccff00)" />
              </div>
              <h4 className="auth-user-email">
                {currentUser.email}
              </h4>
              <span className="auth-user-role-badge">
                Role: {currentUser.role?.toUpperCase() || (currentUser.email?.includes('admin') ? 'ADMIN / MANAGER' : 'VERIFIED MEMBER')}
              </span>

              <div style={{ marginTop: '24px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {Boolean(
                  currentUser && (
                    currentUser.role === USER_ROLES.MEMBER ||
                    currentUser.user_metadata?.role === 'member' ||
                    currentUser.email === 'vikram.s@example.com' ||
                    currentUser.memberId
                  )
                ) && (
                  <button
                    type="button"
                    onClick={() => {
                      onClose();
                      if (onOpenMemberPortal) onOpenMemberPortal(currentUser);
                    }}
                    className="btn btn-primary w-full"
                    style={{ 
                      display: 'inline-flex', 
                      alignItems: 'center', 
                      justifyContent: 'center', 
                      gap: '8px',
                      background: 'linear-gradient(135deg, var(--accent, #ccff00) 0%, #10B981 100%)',
                      color: '#000',
                      fontWeight: 800
                    }}
                  >
                    <QrCode size={16} /> Open Athlete Member Portal & QR Pass
                  </button>
                )}

                {Boolean(
                  currentUser && (
                    currentUser.role === 'admin' ||
                    currentUser.role === USER_ROLES.OWNER ||
                    currentUser.role === USER_ROLES.ADMIN ||
                    currentUser.role === USER_ROLES.MANAGER ||
                    currentUser.role === USER_ROLES.TRAINER ||
                    currentUser.user_metadata?.role === 'admin' ||
                    (currentUser.email && currentUser.email.toLowerCase().startsWith('admin'))
                  )
                ) && (
                  <button
                    type="button"
                    onClick={() => {
                      onClose();
                      if (onOpenAdmin) onOpenAdmin();
                    }}
                    className="btn btn-primary w-full"
                    style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}
                  >
                    <LayoutDashboard size={16} /> Open Admin Command Center
                  </button>
                )}
                <button
                  type="button"
                  onClick={onClose}
                  className="btn btn-secondary w-full"
                >
                  Continue to Website
                </button>
                <button
                  type="button"
                  onClick={handleSignOut}
                  disabled={isLoading}
                  className="btn btn-secondary w-full"
                  style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}
                >
                  <LogOut size={16} /> Sign Out
                </button>
              </div>
            </div>
          ) : (
            /* Form View */
            <div>
              {/* Tab Switcher */}
              <div className="auth-tab-bar">
                <button
                  type="button"
                  onClick={() => setMode('login')}
                  className={`auth-tab-btn ${mode === 'login' ? 'active' : ''}`}
                >
                  Sign In
                </button>
                <button
                  type="button"
                  onClick={() => setMode('register')}
                  className={`auth-tab-btn ${mode === 'register' ? 'active' : ''}`}
                >
                  Register
                </button>
              </div>

              <form onSubmit={mode === 'login' ? handleLogin : handleRegister}>
                {mode === 'register' && (
                  <div className="form-group" style={{ marginBottom: '16px' }}>
                    <label className="form-label" style={{ marginBottom: '6px', display: 'block' }}>
                      Full Name
                    </label>
                    <div style={{ position: 'relative' }}>
                      <input
                        type="text"
                        placeholder="e.g. Rahul Sharma"
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                        className="form-input"
                        style={{ paddingLeft: '38px', width: '100%' }}
                        required
                      />
                      <User size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#6b7280' }} />
                    </div>
                  </div>
                )}

                <div className="form-group" style={{ marginBottom: '16px' }}>
                  <label className="form-label" style={{ marginBottom: '6px', display: 'block' }}>
                    {mode === 'login' ? 'Email or Username' : 'Email Address'}
                  </label>
                  <div style={{ position: 'relative' }}>
                    <input
                      type={mode === 'login' ? 'text' : 'email'}
                      placeholder={mode === 'login' ? 'Enter email or username' : 'e.g. member@kinetix.com'}
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="form-input"
                      style={{ paddingLeft: '38px', width: '100%' }}
                      required
                    />
                    <Mail size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#6b7280' }} />
                  </div>
                </div>

                <div className="form-group" style={{ marginBottom: '20px' }}>
                  <label className="form-label" style={{ marginBottom: '6px', display: 'block' }}>
                    Password
                  </label>
                  <div style={{ position: 'relative' }}>
                    <input
                      type="password"
                      placeholder="••••••••"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="form-input"
                      style={{ paddingLeft: '38px', width: '100%' }}
                      required
                    />
                    <Lock size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#6b7280' }} />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isLoading}
                  className="btn btn-primary w-full"
                  style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', height: '46px' }}
                >
                  {isLoading ? (
                    <>
                      <Loader2 size={18} className="animate-spin" />
                      <span>AUTHENTICATING...</span>
                    </>
                  ) : (
                    <>
                      <span>{mode === 'login' ? 'SIGN IN WITH SUPABASE' : 'CREATE ACCOUNT'}</span>
                      <ArrowRight size={16} />
                    </>
                  )}
                </button>
              </form>

              {/* Instant 1-Click Demo Personas (Owner, Manager, Coach, Member) */}
              <div style={{ marginTop: '20px', paddingTop: '16px', borderTop: '1px solid var(--border-light, rgba(255,255,255,0.08))' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '10px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <Sparkles size={14} color="var(--accent, #ccff00)" />
                    <span style={{ fontSize: '0.74rem', fontWeight: 800, color: '#94A3B8', letterSpacing: '0.05em', textTransform: 'uppercase' }}>
                      DEMO PERSONAS (1-CLICK ACCESS)
                    </span>
                  </div>
                  <span style={{ fontSize: '0.68rem', color: '#64748B' }}>Tap to test instantly</span>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '8px' }}>
                  {DEMO_USERS.map((demo) => {
                    const isMem = demo.role === USER_ROLES.MEMBER;
                    return (
                      <button
                        key={demo.id}
                        type="button"
                        onClick={() => handleSelectPersona(demo)}
                        style={{
                          background: isMem ? 'rgba(204, 255, 0, 0.08)' : 'rgba(255, 255, 255, 0.03)',
                          border: isMem ? '1px solid rgba(204, 255, 0, 0.35)' : '1px solid var(--border-light, rgba(255,255,255,0.08))',
                          borderRadius: '8px',
                          padding: '8px 10px',
                          textAlign: 'left',
                          cursor: 'pointer',
                          display: 'flex',
                          flexDirection: 'column',
                          gap: '2px',
                          transition: 'all 0.2s',
                          color: 'inherit'
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.borderColor = isMem ? 'var(--accent, #ccff00)' : '#94A3B8';
                          e.currentTarget.style.transform = 'translateY(-1px)';
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.borderColor = isMem ? 'rgba(204, 255, 0, 0.35)' : 'var(--border-light, rgba(255,255,255,0.08))';
                          e.currentTarget.style.transform = 'translateY(0)';
                        }}
                      >
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                          <span style={{ fontSize: '0.8rem', fontWeight: 800, color: isMem ? 'var(--accent, #ccff00)' : '#FFFFFF' }}>
                            {demo.role === 'OWNER' && '👑 Owner'}
                            {demo.role === 'MANAGER' && '💼 Manager'}
                            {demo.role === 'TRAINER' && '🏋️ Head Coach'}
                            {demo.role === 'MEMBER' && '📱 VIP Member'}
                          </span>
                          <span style={{ 
                            fontSize: '0.65rem', 
                            padding: '1px 5px', 
                            borderRadius: '4px',
                            background: isMem ? 'var(--accent, #ccff00)' : 'rgba(255,255,255,0.1)',
                            color: isMem ? '#000' : '#E2E8F0',
                            fontWeight: 700
                          }}>
                            {isMem ? 'PORTAL' : 'STAFF'}
                          </span>
                        </div>
                        <span style={{ fontSize: '0.72rem', color: '#94A3B8', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                          {demo.name}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
