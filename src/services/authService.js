import { supabase, isSupabaseConfigured } from '../lib/supabaseClient';

export const USER_ROLES = {
  OWNER: 'OWNER',
  ADMIN: 'ADMIN',
  MANAGER: 'MANAGER',
  RECEPTIONIST: 'RECEPTIONIST',
  TRAINER: 'TRAINER',
  MEMBER: 'MEMBER'
};

// Demo quick-access persona credentials for instant testing
export const DEMO_USERS = [
  {
    id: 'user-owner-1',
    name: 'Vikram Singhania',
    email: 'admin@01',
    role: USER_ROLES.OWNER,
    title: 'Gym Owner & Managing Director',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=200&auto=format&fit=crop'
  },
  {
    id: 'user-manager-1',
    name: 'Priya Sen',
    email: 'manager@kinetix.com',
    role: USER_ROLES.MANAGER,
    title: 'Operations & Club General Manager',
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=200&auto=format&fit=crop'
  },
  {
    id: 'user-trainer-1',
    name: 'Coach Arjun Sharma',
    email: 'trainer@kinetix.com',
    role: USER_ROLES.TRAINER,
    title: 'Head Strength & Conditioning Coach',
    avatar: 'https://images.unsplash.com/photo-1567013127542-490d757e51fc?q=80&w=200&auto=format&fit=crop'
  },
  {
    id: 'user-member-1',
    name: 'Vikram Sharma',
    email: 'vikram.s@example.com',
    role: USER_ROLES.MEMBER,
    title: 'Elite VIP Athlete Member',
    memberId: 'mem-1',
    plan: 'ELITE VIP',
    joinedDate: '2025-08-10',
    expiryDate: '2026-08-10',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=200&auto=format&fit=crop'
  }
];

export const getStoredUser = () => {
  try {
    const raw = localStorage.getItem('kinetix_active_user');
    if (raw) return JSON.parse(raw);
  } catch (e) {}
  return null;
};

export const setStoredUser = (user) => {
  if (user) {
    localStorage.setItem('kinetix_active_user', JSON.stringify(user));
  } else {
    localStorage.removeItem('kinetix_active_user');
  }
  window.dispatchEvent(new CustomEvent('kinetix_user_changed', { detail: user }));
};

export const hasPermission = (userRole, requiredRoles = []) => {
  if (!userRole) return false;
  const role = userRole.toUpperCase();
  if (role === USER_ROLES.OWNER || role === USER_ROLES.ADMIN) return true;
  return requiredRoles.includes(role);
};
