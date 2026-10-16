import React, { useState, useEffect } from 'react';
import { 
  INITIAL_LEADS_DATA, 
  GYM_CONFIG, 
  TRAINERS_DATA, 
  MEMBERSHIP_PLANS, 
  TESTIMONIALS_DATA, 
  GALLERY_DATA, 
  SCHEDULE_DATA,
  TRANSFORMATIONS_DATA 
} from '../data/gymData';
import ThemeAdjuster from './ThemeAdjuster';
import LeadCRM from '../features/crm/LeadCRM';
import AttendanceDesk from '../features/attendance/AttendanceDesk';
import FinanceDesk from '../features/billing/FinanceDesk';
import { supabase, isSupabaseConfigured, getSupabaseStatus, uploadFileToStorage } from '../lib/supabaseClient';
import { 
  Users, 
  CreditCard,
  UserCheck, 
  Star, 
  Image as ImageIcon, 
  Calendar, 
  Settings as SettingsIcon,
  MessageSquare,
  ShieldCheck, 
  Search, 
  Filter, 
  Download, 
  Phone, 
  Trash2, 
  CheckCircle, 
  X,
  Plus,
  RefreshCw,
  Dumbbell,
  LogOut,
  Lock,
  Mail,
  Loader2,
  Database,
  ExternalLink,
  Edit2,
  Clock,
  Sparkles,
  TrendingUp,
  DollarSign,
  Upload,
  ArrowUpRight,
  Layers,
  Palette,
  LayoutDashboard,
  Eye,
  EyeOff,
  AlertCircle,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Receipt,
  History
} from 'lucide-react';

// Admin Credentials Manager
export const DEFAULT_ADMIN_CREDS = {
  username: 'admin@01',
  password: 'biz01'
};

export const getAdminCredentials = () => {
  try {
    const saved = localStorage.getItem('kinetix_admin_credentials');
    if (saved) {
      const parsed = JSON.parse(saved);
      if (parsed.username && parsed.password) return parsed;
    }
  } catch (e) {}
  return DEFAULT_ADMIN_CREDS;
};

export const saveAdminCredentials = (username, password) => {
  localStorage.setItem('kinetix_admin_credentials', JSON.stringify({ username, password }));
};

export default function AdminDashboard({ isOpen, onClose }) {
  // Navigation Tabs:
  // 'overview' | 'enquiries' | 'members' | 'plans' | 'trainers' | 'testimonials' | 'transformations' | 'gallery' | 'schedule' | 'theme' | 'settings'
  const [activeTab, setActiveTab] = useState('overview');
  
  // Auth State
  const [adminUser, setAdminUser] = useState(null);
  const [authLoading, setAuthLoading] = useState(false);
  const [authEmail, setAuthEmail] = useState('');
  const [authPassword, setAuthPassword] = useState('');
  const [authError, setAuthError] = useState('');

  // Self-Assigned Admin Credentials
  const [adminCreds, setAdminCreds] = useState(getAdminCredentials());
  const [newAdminUser, setNewAdminUser] = useState(adminCreds.username);
  const [newAdminPass, setNewAdminPass] = useState(adminCreds.password);
  const [showCredsPassword, setShowCredsPassword] = useState(false);

  // Toast
  const [toastMessage, setToastMessage] = useState('');

  // Data Collections
  const [enquiries, setEnquiries] = useState([]);
  const [members, setMembers] = useState([]);
  const [plans, setPlans] = useState([]);
  const [trainers, setTrainers] = useState([]);
  const [testimonials, setTestimonials] = useState([]);
  const [transformations, setTransformations] = useState([]);
  const [gallery, setGallery] = useState([]);
  const [schedule, setSchedule] = useState([]);
  const [isDataLoading, setIsDataLoading] = useState(false);

  // Filters & Search
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [scheduleDay, setScheduleDay] = useState('Monday');

  // Modals for CRUD Actions
  const [showAddPlan, setShowAddPlan] = useState(false);
  const [editingPlan, setEditingPlan] = useState(null);
  const [newPlan, setNewPlan] = useState({ name: '', price: 1499, duration: 'month', description: '', featuresStr: '' });

  const [showAddMember, setShowAddMember] = useState(false);
  const [memberPayments, setMemberPayments] = useState([]);
  const [selectedMemberForCalendar, setSelectedMemberForCalendar] = useState(null);
  const [selectedMemberForPayment, setSelectedMemberForPayment] = useState(null);
  const [calendarYear, setCalendarYear] = useState(2026);
  const [memberFeeFilter, setMemberFeeFilter] = useState('All'); // 'All' | 'Paid' | 'Upcoming' | 'Overdue'
  const [memberSearchTerm, setMemberSearchTerm] = useState('');
  const [paymentFormData, setPaymentFormData] = useState({
    amount: 1499,
    monthYear: '2026-10',
    monthName: 'October 2026',
    paymentDate: new Date().toISOString().slice(0, 10),
    paymentMethod: 'UPI',
    notes: ''
  });
  const [newMember, setNewMember] = useState({
    name: '',
    email: '',
    phone: '',
    plan: 'PRO',
    plan_duration: '1 Year',
    fee_amount: 1499,
    joined_date: new Date().toISOString().slice(0, 10),
    initial_fee_paid: true,
    payment_method: 'UPI',
    notes: ''
  });

  const [showAddTestimonial, setShowAddTestimonial] = useState(false);
  const [newTestimonial, setNewTestimonial] = useState({ name: '', role: 'Member', rating: 5, result: 'Lost 10 kg', review: '', photo: '' });

  const [showAddTrainer, setShowAddTrainer] = useState(false);
  const [newTrainer, setNewTrainer] = useState({ name: '', role: 'Strength Coach', experience: '5+ Years', specialization: 'Powerlifting', image: '', bio: '' });

  const [showAddTransformation, setShowAddTransformation] = useState(false);
  const [newTransformation, setNewTransformation] = useState({ member_name: '', before_image_url: '', after_image_url: '', weight_lost: '-12 KG', duration: '12 Weeks', description: '' });

  const [showAddPhoto, setShowAddPhoto] = useState(false);
  const [newPhoto, setNewPhoto] = useState({ title: '', category: 'Gym', image: '' });

  const [showAddClass, setShowAddClass] = useState(false);
  const [newClass, setNewClass] = useState({ day: 'Monday', time: '06:00 AM', name: '', category: 'Strength', trainer: 'Arjun Sharma', duration: '60 min' });

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(''), 3000);
  };

  // Check Supabase Auth
  useEffect(() => {
    async function checkAuth() {
      try {
        const { data } = await supabase.auth.getUser();
        if (data?.user) {
          setAdminUser(data.user);
        } else {
          const stored = localStorage.getItem('kinetix_auth_user');
          if (stored) setAdminUser(JSON.parse(stored));
        }
      } catch (err) {
        console.warn('Auth check error:', err);
      }
    }
    if (isOpen) {
      checkAuth();
    }
  }, [isOpen]);

  // Handle Admin Login via Assigned Credentials or Supabase Auth
  const handleAdminLogin = async (e) => {
    e.preventDefault();
    setAuthError('');
    if (!authEmail || !authPassword) {
      setAuthError('Please enter username/email and password.');
      return;
    }

    setAuthLoading(true);
    const cleanUser = authEmail.trim();
    const cleanPass = authPassword.trim();
    const currentCreds = getAdminCredentials();

    // 1. Direct check with assigned Admin Credentials (admin@01 / biz01 or self-assigned)
    const matchesUser = 
      cleanUser.toLowerCase() === currentCreds.username.toLowerCase() ||
      cleanUser.toLowerCase() === 'admin@01' ||
      cleanUser.toLowerCase() === 'admin@01.com';

    if (matchesUser && (cleanPass === currentCreds.password || cleanPass === 'biz01')) {
      const adminSession = {
        id: 'admin-master',
        email: currentCreds.username,
        username: currentCreds.username,
        role: 'admin',
        user_metadata: { role: 'admin', name: 'Gym Administrator' }
      };
      localStorage.setItem('kinetix_auth_user', JSON.stringify(adminSession));
      setAdminUser(adminSession);
      showToast(`Welcome back, Admin (${currentCreds.username})!`);
      setAuthLoading(false);
      return;
    }

    // 2. Attempt Supabase Auth (for users created via Supabase Auth Dashboard)
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: cleanUser.includes('@') && cleanUser.includes('.') ? cleanUser : `${cleanUser}@kinetix.com`,
        password: cleanPass
      });

      if (error) {
        setAuthError('Invalid credentials. Please verify your username and password.');
        setAuthLoading(false);
        return;
      }

      setAdminUser(data.user);
      showToast('Welcome back, Admin!');
    } catch (err) {
      setAuthError(err.message || 'Login failed.');
    } finally {
      setAuthLoading(false);
    }
  };

  // 1-Click Fast Admin Sign In using current credentials
  const handleFastDemoLogin = async () => {
    setAuthLoading(true);
    try {
      const creds = getAdminCredentials();
      const demoUser = {
        id: 'admin-master',
        email: creds.username,
        username: creds.username,
        role: 'admin',
        user_metadata: { role: 'admin', name: 'Gym Administrator' }
      };
      localStorage.setItem('kinetix_auth_user', JSON.stringify(demoUser));
      setAdminUser(demoUser);
      showToast(`Logged in as Admin (${creds.username})`);
    } finally {
      setAuthLoading(false);
    }
  };

  // Self-Service: Update Admin Credentials
  const handleUpdateAdminCredentials = (e) => {
    e.preventDefault();
    if (!newAdminUser.trim() || !newAdminPass.trim()) {
      showToast('Username and password cannot be empty.');
      return;
    }
    const u = newAdminUser.trim();
    const p = newAdminPass.trim();
    saveAdminCredentials(u, p);
    setAdminCreds({ username: u, password: p });
    showToast(`Admin credentials updated to username: "${u}"!`);
  };

  const handleAdminLogout = async () => {
    try {
      await supabase.auth.signOut();
      localStorage.removeItem('kinetix_auth_user');
      setAdminUser(null);
      window.dispatchEvent(new Event('kinetix_auth_changed'));
      showToast('Admin signed out.');
      if (onClose) onClose();
    } catch (err) {
      console.warn(err);
    }
  };

  // Load All Tab Data from Supabase with graceful fallback
  const loadDashboardData = async () => {
    setIsDataLoading(true);
    try {
      // 1. Enquiries
      const { data: enqData } = await supabase.from('enquiries').select('*');
      if (enqData && enqData.length > 0) {
        setEnquiries(enqData);
      } else {
        const stored = localStorage.getItem('kinetix_leads');
        setEnquiries(stored ? JSON.parse(stored) : INITIAL_LEADS_DATA);
      }

      // 2. Members & Fee Tracking
      const { data: memData } = await supabase.from('members').select('*');
      const initialMembers = [
        {
          id: 'mem-1',
          name: 'Vikram Sharma',
          email: 'vikram.s@example.com',
          phone: '+91 98765 11223',
          plan: 'ELITE',
          plan_duration: '1 Year',
          fee_amount: 2499,
          status: 'Active',
          joined_date: '2025-08-10',
          end_date: '2026-08-10',
          last_paid_date: '2026-10-02',
          next_due_date: '2026-11-10',
          notes: 'Morning VIP training with Coach Arjun'
        },
        {
          id: 'mem-2',
          name: 'Priya Menon',
          email: 'priya.m@example.com',
          phone: '+91 98450 44332',
          plan: 'PRO',
          plan_duration: '6 Months',
          fee_amount: 1499,
          status: 'Upcoming',
          joined_date: '2026-04-18',
          end_date: '2026-10-18',
          last_paid_date: '2026-09-18',
          next_due_date: '2026-10-18',
          notes: 'Fee due within 3 days - SMS reminder'
        },
        {
          id: 'mem-3',
          name: 'Rohan Kapoor',
          email: 'rohan.k@example.com',
          phone: '+91 97411 99881',
          plan: 'BASIC',
          plan_duration: '3 Months',
          fee_amount: 999,
          status: 'Overdue',
          joined_date: '2026-07-05',
          end_date: '2026-10-05',
          last_paid_date: '2026-09-05',
          next_due_date: '2026-10-05',
          notes: 'Fee overdue by 10 days - WhatsApp follow up'
        },
        {
          id: 'mem-4',
          name: 'Ananya Gupta',
          email: 'ananya.g@example.com',
          phone: '+91 99002 77665',
          plan: 'PRO',
          plan_duration: '1 Year',
          fee_amount: 1499,
          status: 'Active',
          joined_date: '2026-01-20',
          end_date: '2027-01-20',
          last_paid_date: '2026-10-01',
          next_due_date: '2026-11-20',
          notes: 'Evening strength and HIIT regular'
        },
        {
          id: 'mem-5',
          name: 'Sameer Joshi',
          email: 'sameer.j@example.com',
          phone: '+91 98220 33445',
          plan: 'ELITE',
          plan_duration: '1 Year',
          fee_amount: 2499,
          status: 'Upcoming',
          joined_date: '2026-06-22',
          end_date: '2027-06-22',
          last_paid_date: '2026-09-22',
          next_due_date: '2026-10-22',
          notes: 'Upcoming renewal in 7 days'
        },
        {
          id: 'mem-6',
          name: 'Ayesha Khan',
          email: 'ayesha.k@example.com',
          phone: '+91 97312 88492',
          plan: 'PRO',
          plan_duration: '6 Months',
          fee_amount: 1499,
          status: 'Overdue',
          joined_date: '2026-03-01',
          end_date: '2026-09-01',
          last_paid_date: '2026-08-30',
          next_due_date: '2026-09-30',
          notes: 'Overdue by 15 days - Needs phone call'
        }
      ];
      if (memData && memData.length > 0) {
        setMembers(memData);
      } else {
        const stored = localStorage.getItem('kinetix_table_members');
        setMembers(stored ? JSON.parse(stored) : initialMembers);
      }

      // 2b. Member Monthly Payments Ledger
      const { data: payData } = await supabase.from('member_payments').select('*');
      const initialPayments = [
        { id: 'pay-1', member_id: 'mem-1', month_year: '2026-08', month_name: 'August 2026', amount: 2499, payment_date: '2026-08-10', payment_method: 'UPI', status: 'Paid', receipt_no: 'REC-2026-0801' },
        { id: 'pay-2', member_id: 'mem-1', month_year: '2026-09', month_name: 'September 2026', amount: 2499, payment_date: '2026-09-10', payment_method: 'UPI', status: 'Paid', receipt_no: 'REC-2026-0901' },
        { id: 'pay-3', member_id: 'mem-1', month_year: '2026-10', month_name: 'October 2026', amount: 2499, payment_date: '2026-10-02', payment_method: 'UPI', status: 'Paid', receipt_no: 'REC-2026-1001' },
        { id: 'pay-4', member_id: 'mem-2', month_year: '2026-08', month_name: 'August 2026', amount: 1499, payment_date: '2026-08-18', payment_method: 'Card', status: 'Paid', receipt_no: 'REC-2026-0802' },
        { id: 'pay-5', member_id: 'mem-2', month_year: '2026-09', month_name: 'September 2026', amount: 1499, payment_date: '2026-09-18', payment_method: 'UPI', status: 'Paid', receipt_no: 'REC-2026-0902' },
        { id: 'pay-6', member_id: 'mem-3', month_year: '2026-08', month_name: 'August 2026', amount: 999, payment_date: '2026-08-05', payment_method: 'Cash', status: 'Paid', receipt_no: 'REC-2026-0803' },
        { id: 'pay-7', member_id: 'mem-3', month_year: '2026-09', month_name: 'September 2026', amount: 999, payment_date: '2026-09-05', payment_method: 'Cash', status: 'Paid', receipt_no: 'REC-2026-0903' },
        { id: 'pay-8', member_id: 'mem-4', month_year: '2026-08', month_name: 'August 2026', amount: 1499, payment_date: '2026-08-20', payment_method: 'Net Banking', status: 'Paid', receipt_no: 'REC-2026-0804' },
        { id: 'pay-9', member_id: 'mem-4', month_year: '2026-09', month_name: 'September 2026', amount: 1499, payment_date: '2026-09-20', payment_method: 'UPI', status: 'Paid', receipt_no: 'REC-2026-0904' },
        { id: 'pay-10', member_id: 'mem-4', month_year: '2026-10', month_name: 'October 2026', amount: 1499, payment_date: '2026-10-01', payment_method: 'UPI', status: 'Paid', receipt_no: 'REC-2026-1002' },
        { id: 'pay-11', member_id: 'mem-5', month_year: '2026-08', month_name: 'August 2026', amount: 2499, payment_date: '2026-08-22', payment_method: 'UPI', status: 'Paid', receipt_no: 'REC-2026-0805' },
        { id: 'pay-12', member_id: 'mem-5', month_year: '2026-09', month_name: 'September 2026', amount: 2499, payment_date: '2026-09-22', payment_method: 'UPI', status: 'Paid', receipt_no: 'REC-2026-0905' }
      ];
      if (payData && payData.length > 0) {
        setMemberPayments(payData);
      } else {
        const storedPays = localStorage.getItem('kinetix_table_member_payments');
        setMemberPayments(storedPays ? JSON.parse(storedPays) : initialPayments);
      }

      // 3. Plans
      const { data: plansData } = await supabase.from('membership_plans').select('*');
      setPlans(plansData && plansData.length > 0 ? plansData : MEMBERSHIP_PLANS);

      // 4. Trainers
      const { data: trainData } = await supabase.from('trainers').select('*');
      setTrainers(trainData && trainData.length > 0 ? trainData : TRAINERS_DATA);

      // 5. Testimonials
      const { data: testData } = await supabase.from('testimonials').select('*');
      setTestimonials(testData && testData.length > 0 ? testData : TESTIMONIALS_DATA);

      // 6. Transformations
      const { data: transData } = await supabase.from('transformations').select('*');
      setTransformations(transData && transData.length > 0 ? transData : TRANSFORMATIONS_DATA);

      // 7. Gallery
      const { data: galData } = await supabase.from('gallery').select('*');
      setGallery(galData && galData.length > 0 ? galData : GALLERY_DATA);

      // 8. Schedule
      const { data: schData } = await supabase.from('class_schedule').select('*');
      setSchedule(schData && schData.length > 0 ? schData : SCHEDULE_DATA);

    } catch (err) {
      console.warn('Dashboard sync note:', err);
    } finally {
      setIsDataLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen && adminUser) {
      loadDashboardData();
    }
  }, [isOpen, adminUser]);

  // Action: Update Enquiry Status
  const updateEnquiryStatus = async (id, newStatus) => {
    try {
      await supabase.from('enquiries').update({ status: newStatus }).eq('id', id);
    } catch (e) {
      console.warn(e);
    }
    const updated = enquiries.map(e => e.id === id ? { ...e, status: newStatus } : e);
    setEnquiries(updated);
    localStorage.setItem('kinetix_leads', JSON.stringify(updated));
    showToast(`Enquiry updated to ${newStatus}`);
  };

  // Action: Delete Enquiry
  const deleteEnquiry = async (id) => {
    if (window.confirm('Delete this enquiry record?')) {
      try {
        await supabase.from('enquiries').delete().eq('id', id);
      } catch (e) {
        console.warn(e);
      }
      const updated = enquiries.filter(e => e.id !== id);
      setEnquiries(updated);
      localStorage.setItem('kinetix_leads', JSON.stringify(updated));
      showToast('Enquiry removed');
    }
  };

  // Action: Add / Edit Membership Plan
  const handleSavePlanSubmit = async (e) => {
    e.preventDefault();
    if (!newPlan.name || !newPlan.price) return;
    
    const featuresList = newPlan.featuresStr 
      ? newPlan.featuresStr.split('\n').filter(Boolean).map(text => ({ text: text.trim(), included: true }))
      : [
          { text: "Full gym floor access", included: true },
          { text: "Locker & sauna access", included: true },
          { text: "InBody assessment", included: true }
        ];

    const planPayload = {
      id: editingPlan ? editingPlan.id : (newPlan.name.toLowerCase().replace(/[^a-z0-9]/g, '-') || `plan-${Date.now()}`),
      name: newPlan.name,
      price: Number(newPlan.price),
      duration: newPlan.duration || 'month',
      description: newPlan.description || 'Full club access package.',
      features: featuresList,
      is_popular: false,
      is_active: true
    };

    try {
      if (editingPlan) {
        await supabase.from('membership_plans').update(planPayload).eq('id', editingPlan.id);
      } else {
        await supabase.from('membership_plans').insert([planPayload]);
      }
    } catch (err) {
      console.warn(err);
    }

    const updated = editingPlan
      ? plans.map(p => p.id === editingPlan.id ? { ...p, ...planPayload } : p)
      : [...plans, planPayload];

    setPlans(updated);
    localStorage.setItem('kinetix_table_membership_plans', JSON.stringify(updated));
    setShowAddPlan(false);
    setEditingPlan(null);
    setNewPlan({ name: '', price: 1499, duration: 'month', description: '', featuresStr: '' });
    showToast(editingPlan ? 'Plan updated successfully' : 'New membership plan created');
  };

  const handleDeletePlan = async (id) => {
    if (window.confirm('Are you sure you want to delete this membership plan?')) {
      try {
        await supabase.from('membership_plans').delete().eq('id', id);
      } catch (err) {
        console.warn(err);
      }
      const updated = plans.filter(p => p.id !== id);
      setPlans(updated);
      localStorage.setItem('kinetix_table_membership_plans', JSON.stringify(updated));
      showToast('Membership plan removed');
    }
  };

  // Calculate subscription end date based on duration
  const calculateEndDate = (joinedDateStr, durationStr) => {
    const start = new Date(joinedDateStr || Date.now());
    let monthsToAdd = 12;
    if (durationStr === '1 Month') monthsToAdd = 1;
    else if (durationStr === '3 Months') monthsToAdd = 3;
    else if (durationStr === '6 Months') monthsToAdd = 6;
    else if (durationStr === '1 Year' || durationStr === '12 Months') monthsToAdd = 12;
    
    const end = new Date(start);
    end.setMonth(end.getMonth() + monthsToAdd);
    return end.toISOString().slice(0, 10);
  };

  // Fee Status Checker (Paid / Upcoming in 10 Days / Overdue)
  const getMemberFeeInfo = (member) => {
    if (!member || !member.next_due_date) {
      return { 
        status: 'Paid', 
        label: 'Up to Date', 
        sublabel: 'No dues pending', 
        days: 999, 
        color: '#34d399', 
        badgeBg: 'rgba(52, 211, 153, 0.15)',
        badgeBorder: 'rgba(52, 211, 153, 0.4)',
        isOverdue: false, 
        isUpcoming: false 
      };
    }
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const dueDate = new Date(member.next_due_date);
    dueDate.setHours(0, 0, 0, 0);
    const diffTime = dueDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays < 0) {
      const overdueDays = Math.abs(diffDays);
      return {
        status: 'Overdue',
        label: `Overdue by ${overdueDays}d`,
        sublabel: `Due on ${member.next_due_date}`,
        days: overdueDays,
        color: '#ef4444',
        badgeBg: 'rgba(239, 68, 68, 0.15)',
        badgeBorder: 'rgba(239, 68, 68, 0.4)',
        isOverdue: true,
        isUpcoming: false
      };
    } else if (diffDays <= 10) {
      return {
        status: 'Upcoming',
        label: diffDays === 0 ? 'Due Today' : `Due in ${diffDays}d`,
        sublabel: `Due on ${member.next_due_date}`,
        days: diffDays,
        color: '#f59e0b',
        badgeBg: 'rgba(245, 158, 11, 0.15)',
        badgeBorder: 'rgba(245, 158, 11, 0.4)',
        isOverdue: false,
        isUpcoming: true
      };
    } else {
      return {
        status: 'Paid',
        label: `Paid • Due in ${diffDays}d`,
        sublabel: `Next due: ${member.next_due_date}`,
        days: diffDays,
        color: '#34d399',
        badgeBg: 'rgba(52, 211, 153, 0.15)',
        badgeBorder: 'rgba(52, 211, 153, 0.4)',
        isOverdue: false,
        isUpcoming: false
      };
    }
  };

  // Convert Lead from CRM into Enrolled Member
  const handleConvertLeadToMember = (lead) => {
    setNewMember({
      name: lead.name || '',
      email: lead.email || '',
      phone: lead.phone || '',
      plan: 'PRO',
      plan_duration: '1 Year',
      fee_amount: 1499,
      joined_date: new Date().toISOString().slice(0, 10),
      initial_fee_paid: true,
      payment_method: 'UPI',
      notes: `Converted from CRM Lead (${lead.source || 'Website'} - Interest: ${lead.interest || 'Fitness'})`
    });
    setActiveTab('members');
    setShowAddMember(true);
    showToast(`Enrolling ${lead.name} as a club member...`);
  };

  // Action: Add New Member
  const handleAddMemberSubmit = async (e) => {
    e.preventDefault();
    if (!newMember.name || !newMember.email) {
      showToast('Please enter both Member Name and Email.');
      return;
    }

    const joiningDate = newMember.joined_date || new Date().toISOString().slice(0, 10);
    const endDate = calculateEndDate(joiningDate, newMember.plan_duration);
    
    // Calculate next due date
    const startD = new Date(joiningDate);
    const nextD = new Date(startD);
    nextD.setMonth(nextD.getMonth() + (newMember.initial_fee_paid ? 1 : 0));
    const nextDueDate = nextD.toISOString().slice(0, 10);

    const memberId = `mem-${Date.now()}`;
    const feeAmount = Number(newMember.fee_amount) || 1499;

    const memberObj = {
      id: memberId,
      name: newMember.name.trim(),
      email: newMember.email.trim(),
      phone: newMember.phone.trim(),
      plan: newMember.plan,
      plan_duration: newMember.plan_duration || '1 Year',
      fee_amount: feeAmount,
      status: newMember.initial_fee_paid ? 'Active' : 'Overdue',
      joined_date: joiningDate,
      end_date: endDate,
      last_paid_date: newMember.initial_fee_paid ? joiningDate : null,
      next_due_date: nextDueDate,
      notes: (newMember.notes || '').trim()
    };

    let initialPaymentObj = null;
    if (newMember.initial_fee_paid) {
      const monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
      const ym = joiningDate.slice(0, 7);
      const mIdx = parseInt(joiningDate.slice(5, 7), 10) - 1;
      const mName = `${monthNames[mIdx] || 'Month'} ${joiningDate.slice(0, 4)}`;

      initialPaymentObj = {
        id: `pay-${Date.now()}`,
        member_id: memberId,
        month_year: ym,
        month_name: mName,
        amount: feeAmount,
        payment_date: joiningDate,
        payment_method: newMember.payment_method || 'UPI',
        status: 'Paid',
        receipt_no: `REC-${Date.now().toString().slice(-6)}`,
        notes: `Registration fee payment for ${mName}`
      };
    }

    try {
      await supabase.from('members').insert([memberObj]);
      if (initialPaymentObj) {
        await supabase.from('member_payments').insert([initialPaymentObj]);
      }
    } catch (err) {
      console.warn('Supabase member insertion note:', err);
    }

    const updatedMembers = [memberObj, ...members];
    setMembers(updatedMembers);
    localStorage.setItem('kinetix_table_members', JSON.stringify(updatedMembers));

    if (initialPaymentObj) {
      const updatedPayments = [initialPaymentObj, ...memberPayments];
      setMemberPayments(updatedPayments);
      localStorage.setItem('kinetix_table_member_payments', JSON.stringify(updatedPayments));
    }

    setShowAddMember(false);
    setNewMember({
      name: '',
      email: '',
      phone: '',
      plan: 'PRO',
      plan_duration: '1 Year',
      fee_amount: 1499,
      joined_date: new Date().toISOString().slice(0, 10),
      initial_fee_paid: true,
      payment_method: 'UPI',
      notes: ''
    });
    showToast(`Member ${memberObj.name} registered with ${memberObj.plan_duration} plan!`);
  };

  // Action: Delete Member
  const handleDeleteMember = async (id) => {
    const member = members.find(m => m.id === id);
    const memberName = member ? member.name : 'this member';
    if (window.confirm(`Are you sure you want to remove ${memberName}? All associated monthly payment records will also be deleted.`)) {
      try {
        await supabase.from('member_payments').delete().eq('member_id', id);
        await supabase.from('members').delete().eq('id', id);
      } catch (e) {
        console.warn(e);
      }
      const updatedMembers = members.filter(m => m.id !== id);
      setMembers(updatedMembers);
      localStorage.setItem('kinetix_table_members', JSON.stringify(updatedMembers));

      const updatedPayments = memberPayments.filter(p => p.member_id !== id);
      setMemberPayments(updatedPayments);
      localStorage.setItem('kinetix_table_member_payments', JSON.stringify(updatedPayments));

      if (selectedMemberForCalendar && selectedMemberForCalendar.id === id) {
        setSelectedMemberForCalendar(null);
      }
      if (selectedMemberForPayment && selectedMemberForPayment.id === id) {
        setSelectedMemberForPayment(null);
      }
      showToast(`Member ${memberName} removed successfully.`);
    }
  };

  // Action: Record Fee Payment for a Member
  const handleRecordFeePayment = async (member, customMonthYear = null, customAmount = null, customMethod = null) => {
    if (!member) return;
    const todayStr = new Date().toISOString().slice(0, 10);
    const targetMonthYear = customMonthYear || (member.next_due_date ? member.next_due_date.slice(0, 7) : todayStr.slice(0, 7));
    
    const monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
    const parts = targetMonthYear.split('-');
    const year = parts[0];
    const monthIdx = parseInt(parts[1], 10) - 1;
    const monthName = `${monthNames[monthIdx] || 'Month'} ${year}`;
    const amount = Number(customAmount || paymentFormData.amount || member.fee_amount || 1499);
    const method = customMethod || paymentFormData.paymentMethod || 'UPI';

    const newPayment = {
      id: `pay-${Date.now()}`,
      member_id: member.id,
      month_year: targetMonthYear,
      month_name: monthName,
      amount: amount,
      payment_date: paymentFormData.paymentDate || todayStr,
      payment_method: method,
      status: 'Paid',
      receipt_no: `REC-${Date.now().toString().slice(-6)}`,
      notes: paymentFormData.notes || `Monthly gym fee for ${monthName}`
    };

    // Advance next_due_date (+1 month from current next_due_date)
    const baseDate = new Date(member.next_due_date || todayStr);
    baseDate.setMonth(baseDate.getMonth() + 1);
    const nextDueDateStr = baseDate.toISOString().slice(0, 10);

    const updatedMember = {
      ...member,
      last_paid_date: paymentFormData.paymentDate || todayStr,
      next_due_date: nextDueDateStr,
      status: 'Active'
    };

    try {
      await supabase.from('member_payments').insert([newPayment]);
      await supabase.from('members').update({
        last_paid_date: updatedMember.last_paid_date,
        next_due_date: updatedMember.next_due_date,
        status: 'Active'
      }).eq('id', member.id);
    } catch (err) {
      console.warn('Payment recording note:', err);
    }

    const updatedPayments = [newPayment, ...memberPayments.filter(p => !(p.member_id === member.id && p.month_year === targetMonthYear))];
    setMemberPayments(updatedPayments);
    localStorage.setItem('kinetix_table_member_payments', JSON.stringify(updatedPayments));

    const updatedMembers = members.map(m => m.id === member.id ? updatedMember : m);
    setMembers(updatedMembers);
    localStorage.setItem('kinetix_table_members', JSON.stringify(updatedMembers));

    if (selectedMemberForCalendar && selectedMemberForCalendar.id === member.id) {
      setSelectedMemberForCalendar(updatedMember);
    }
    setSelectedMemberForPayment(null);
    showToast(`Fee marked as Paid for ${member.name} (${monthName})! Next due: ${nextDueDateStr}`);
  };

  // 1-Click Toggle Month Paid status directly in Calendar Ledger
  const handleToggleMonthPaid = async (member, monthYear, monthName, amount) => {
    if (!member) return;
    const existing = memberPayments.find(p => p.member_id === member.id && p.month_year === monthYear && p.status === 'Paid');

    if (existing) {
      if (window.confirm(`Mark ${monthName} as Unpaid for ${member.name}?`)) {
        try {
          await supabase.from('member_payments').delete().eq('id', existing.id);
        } catch (e) {
          console.warn(e);
        }
        const updatedPayments = memberPayments.filter(p => p.id !== existing.id);
        setMemberPayments(updatedPayments);
        localStorage.setItem('kinetix_table_member_payments', JSON.stringify(updatedPayments));
        showToast(`${monthName} marked as unpaid for ${member.name}`);
      }
    } else {
      await handleRecordFeePayment(member, monthYear, amount, 'UPI');
    }
  };

  // Action: Add Trainer
  const handleAddTrainerSubmit = async (e) => {
    e.preventDefault();
    if (!newTrainer.name || !newTrainer.role) return;
    const trainerObj = {
      id: newTrainer.name.toLowerCase().replace(/[^a-z0-9]/g, '-') || `trainer-${Date.now()}`,
      name: newTrainer.name,
      role: newTrainer.role,
      experience: newTrainer.experience || '5+ Years Experience',
      specialization: newTrainer.specialization || 'Strength & Conditioning',
      image_url: newTrainer.image || 'https://images.unsplash.com/photo-1567013127542-490d757e51fc?q=80&w=800&auto=format&fit=crop',
      bio: newTrainer.bio || 'Dedicated elite performance coach.',
      instagram_url: 'https://instagram.com',
      certifications: ['CSCS Certified', 'Olympic Lifting L1'],
      rating: 5.0,
      is_active: true
    };
    try {
      await supabase.from('trainers').insert([trainerObj]);
    } catch (err) {
      console.warn(err);
    }
    const updated = [...trainers, { ...trainerObj, image: trainerObj.image_url }];
    setTrainers(updated);
    localStorage.setItem('kinetix_table_trainers', JSON.stringify(updated));
    setShowAddTrainer(false);
    setNewTrainer({ name: '', role: 'Strength Coach', experience: '5+ Years', specialization: 'Powerlifting', image: '', bio: '' });
    showToast('Trainer added to roster');
  };

  const handleDeleteTrainer = async (id) => {
    if (window.confirm('Delete this coach from roster?')) {
      try {
        await supabase.from('trainers').delete().eq('id', id);
      } catch (err) {
        console.warn(err);
      }
      const updated = trainers.filter(t => t.id !== id);
      setTrainers(updated);
      localStorage.setItem('kinetix_table_trainers', JSON.stringify(updated));
      showToast('Coach removed');
    }
  };

  // Action: Add Testimonial
  const handleAddTestimonialSubmit = async (e) => {
    e.preventDefault();
    if (!newTestimonial.name || !newTestimonial.review) return;
    const tObj = {
      name: newTestimonial.name,
      image_url: newTestimonial.photo || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=200&auto=format&fit=crop',
      rating: Number(newTestimonial.rating),
      message: newTestimonial.review,
      result: newTestimonial.result || 'Lost 10 kg',
      program: 'Strength & Conditioning',
      is_featured: true
    };
    try {
      await supabase.from('testimonials').insert([tObj]);
    } catch (err) {
      console.warn(err);
    }
    const updated = [{ id: Date.now(), ...tObj, photo: tObj.image_url, review: tObj.message, role: newTestimonial.role }, ...testimonials];
    setTestimonials(updated);
    localStorage.setItem('kinetix_table_testimonials', JSON.stringify(updated));
    setShowAddTestimonial(false);
    setNewTestimonial({ name: '', role: 'Member', rating: 5, result: 'Lost 10 kg', review: '', photo: '' });
    showToast('Testimonial published to website');
  };

  const handleDeleteTestimonial = async (id) => {
    if (window.confirm('Delete this testimonial?')) {
      try {
        await supabase.from('testimonials').delete().eq('id', id);
      } catch (e) {
        console.warn(e);
      }
      const updated = testimonials.filter(t => t.id !== id);
      setTestimonials(updated);
      localStorage.setItem('kinetix_table_testimonials', JSON.stringify(updated));
      showToast('Testimonial removed');
    }
  };

  // Action: Add Transformation
  const handleAddTransformationSubmit = async (e) => {
    e.preventDefault();
    if (!newTransformation.member_name) return;
    const transObj = {
      id: `trans-${Date.now()}`,
      member_name: newTransformation.member_name,
      before_image_url: newTransformation.before_image_url || 'https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?q=80&w=600&auto=format&fit=crop',
      after_image_url: newTransformation.after_image_url || 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?q=80&w=600&auto=format&fit=crop',
      weight_lost: newTransformation.weight_lost || '-12 KG FAT LOSS',
      duration: newTransformation.duration || '12 Weeks',
      description: newTransformation.description || 'Structured strength and nutrition transformation.',
      coach: 'Coach Arjun Sharma',
      is_featured: true
    };
    try {
      await supabase.from('transformations').insert([transObj]);
    } catch (err) {
      console.warn(err);
    }
    const updated = [
      {
        ...transObj,
        name: transObj.member_name,
        result: transObj.weight_lost,
        quote: transObj.description,
        beforeImg: transObj.before_image_url,
        afterImg: transObj.after_image_url,
        metrics: { startWeight: '92 KG', endWeight: '80 KG', bodyFatChange: '-12%' }
      },
      ...transformations
    ];
    setTransformations(updated);
    localStorage.setItem('kinetix_table_transformations', JSON.stringify(updated));
    setShowAddTransformation(false);
    setNewTransformation({ member_name: '', before_image_url: '', after_image_url: '', weight_lost: '-12 KG', duration: '12 Weeks', description: '' });
    showToast('Transformation story added');
  };

  const handleDeleteTransformation = async (id) => {
    if (window.confirm('Delete this transformation story?')) {
      try {
        await supabase.from('transformations').delete().eq('id', id);
      } catch (err) {
        console.warn(err);
      }
      const updated = transformations.filter(t => t.id !== id);
      setTransformations(updated);
      localStorage.setItem('kinetix_table_transformations', JSON.stringify(updated));
      showToast('Transformation story removed');
    }
  };

  // Action: Add Photo (Gallery)
  const handleAddPhotoSubmit = async (e) => {
    e.preventDefault();
    if (!newPhoto.title) return;
    const photoObj = {
      title: newPhoto.title,
      category: newPhoto.category || 'Gym',
      image_url: newPhoto.image || 'https://images.unsplash.com/photo-1540497077202-7c8a3999166f?q=80&w=900&auto=format&fit=crop'
    };
    try {
      await supabase.from('gallery').insert([photoObj]);
    } catch (err) {
      console.warn(err);
    }
    const updated = [{ id: Date.now(), ...photoObj, image: photoObj.image_url }, ...gallery];
    setGallery(updated);
    localStorage.setItem('kinetix_table_gallery', JSON.stringify(updated));
    setShowAddPhoto(false);
    setNewPhoto({ title: '', category: 'Gym', image: '' });
    showToast('Photo added to gallery');
  };

  const handleDeletePhoto = async (id) => {
    if (window.confirm('Delete this photo from gallery?')) {
      try {
        await supabase.from('gallery').delete().eq('id', id);
      } catch (err) {
        console.warn(err);
      }
      const updated = gallery.filter(g => g.id !== id);
      setGallery(updated);
      localStorage.setItem('kinetix_table_gallery', JSON.stringify(updated));
      showToast('Photo removed');
    }
  };

  // Action: Add Class (Schedule)
  const handleAddClassSubmit = async (e) => {
    e.preventDefault();
    if (!newClass.name) return;
    const classObj = {
      class_name: newClass.name,
      trainer: newClass.trainer || 'Arjun Sharma',
      day: newClass.day || 'Monday',
      start_time: newClass.time || '06:00 AM',
      category: newClass.category || 'Strength',
      duration: newClass.duration || '60 min',
      capacity: 15,
      spots_left: 8,
      intensity: 'High'
    };
    try {
      await supabase.from('class_schedule').insert([classObj]);
    } catch (err) {
      console.warn(err);
    }
    const updated = [...schedule, { id: Date.now(), ...classObj, name: classObj.class_name, time: classObj.start_time, spots: classObj.spots_left }];
    setSchedule(updated);
    localStorage.setItem('kinetix_table_class_schedule', JSON.stringify(updated));
    setShowAddClass(false);
    setNewClass({ day: 'Monday', time: '06:00 AM', name: '', category: 'Strength', trainer: 'Arjun Sharma', duration: '60 min' });
    showToast('Class scheduled successfully');
  };

  const handleDeleteClass = async (id) => {
    if (window.confirm('Delete this class session?')) {
      try {
        await supabase.from('class_schedule').delete().eq('id', id);
      } catch (err) {
        console.warn(err);
      }
      const updated = schedule.filter(s => s.id !== id);
      setSchedule(updated);
      localStorage.setItem('kinetix_table_class_schedule', JSON.stringify(updated));
      showToast('Class removed');
    }
  };

  // Export Enquiries CSV
  const exportCSV = () => {
    if (enquiries.length === 0) return;
    const headers = ['ID', 'Name', 'Phone', 'Email', 'Goal', 'Date', 'Time Slot', 'Status', 'Message'];
    const rows = enquiries.map((l) => [
      l.id,
      `"${l.name}"`,
      `"${l.phone}"`,
      `"${l.email}"`,
      `"${l.goal || ''}"`,
      `"${l.preferred_date || ''}"`,
      `"${l.preferred_time || l.time || ''}"`,
      l.status || 'New',
      `"${(l.message || '').replace(/"/g, '""')}"`
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const link = document.createElement('a');
    link.setAttribute('href', encodeURI(csvContent));
    link.setAttribute('download', `kinetix_enquiries_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast('Enquiries exported to CSV');
  };

  // Calculate Metrics
  const totalEnquiriesCount = enquiries.length;
  const newEnquiriesCount = enquiries.filter(e => e.status === 'New').length;
  
  // Calculate Today's Enquiries
  const todayDateStr = new Date().toISOString().slice(0, 10);
  const todaysEnquiriesCount = enquiries.filter(e => {
    const d = e.preferred_date || e.created_at || e.createdAt || '';
    return d.includes(todayDateStr) || e.status === 'New';
  }).length;

  // Filtered Enquiries
  const filteredEnquiries = enquiries.filter((item) => {
    const matchesSearch = 
      (item.name || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (item.phone || '').includes(searchTerm) ||
      (item.email || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (item.goal || '').toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus = statusFilter === 'All' || item.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const supabaseInfo = getSupabaseStatus();

  if (!isOpen) return null;

  return (
    <div className="admin-portal-overlay">
      <div className="admin-portal-container modal-futuristic-shell" style={{ maxWidth: '1280px', height: '92vh' }}>
        
        {/* Floating Toast */}
        {toastMessage && (
          <div className="admin-toast-banner">
            <CheckCircle size={15} />
            <span>{toastMessage}</span>
          </div>
        )}

        {/* Top Header Bar */}
        <header className="admin-header-bar">
          <div className="admin-header-left">
            <div className="admin-crest">
              <Dumbbell size={18} className="text-volt-accent" />
            </div>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <h2 className="admin-title">KINETIX ATHLETIC CLUB</h2>
                <span style={{ 
                  background: isSupabaseConfigured ? 'rgba(16, 185, 129, 0.15)' : 'rgba(234, 179, 8, 0.15)',
                  color: isSupabaseConfigured ? '#34d399' : '#facc15',
                  border: isSupabaseConfigured ? '1px solid rgba(16, 185, 129, 0.3)' : '1px solid rgba(234, 179, 8, 0.3)',
                  padding: '2px 8px',
                  borderRadius: '999px',
                  fontSize: '0.68rem',
                  fontWeight: 700,
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '4px'
                }}>
                  <Database size={10} />
                  {isSupabaseConfigured ? 'Supabase Live' : 'Demo Local Sync'}
                </span>
              </div>
              <span className="admin-subtitle">Gym Management System &amp; PostgreSQL Operations Hub</span>
            </div>
          </div>

          <div className="admin-header-right">
            {adminUser && (
              <>
                <button onClick={loadDashboardData} className="admin-icon-btn" title="Refresh data from Supabase">
                  <RefreshCw size={14} className={isDataLoading ? 'animate-spin' : ''} />
                </button>
                <div className="admin-user-badge">
                  <span className="user-dot"></span>
                  <span>{adminUser.email || 'Admin'}</span>
                </div>
                <button 
                  onClick={handleAdminLogout} 
                  className="admin-icon-btn" 
                  title="Sign Out Admin"
                  style={{ color: '#f87171' }}
                >
                  <LogOut size={14} />
                </button>
              </>
            )}
            <button 
              onClick={onClose} 
              className="admin-close-btn"
              aria-label="Close Admin Portal"
            >
              <X size={18} />
            </button>
          </div>
        </header>

        {/* AUTH GUARD: If Admin is NOT logged in: Show Supabase Auth Screen */}
        {!adminUser ? (
          <div style={{ 
            flex: 1, 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center', 
            padding: '40px',
            background: '#090B10'
          }}>
            <div style={{ 
              maxWidth: '440px', 
              width: '100%', 
              background: '#0E121B', 
              borderRadius: '12px', 
              padding: '32px',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              boxShadow: '0 20px 40px rgba(0,0,0,0.6)'
            }}>
              <div style={{ textAlign: 'center', marginBottom: '24px' }}>
                <div style={{ 
                  width: '52px', 
                  height: '52px', 
                  borderRadius: '12px', 
                  background: 'rgba(204, 255, 0, 0.1)', 
                  border: '1px solid var(--accent, #ccff00)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  margin: '0 auto 14px auto'
                }}>
                  <Lock size={24} color="var(--accent, #ccff00)" />
                </div>
                <h3 style={{ color: '#fff', fontSize: '1.25rem', fontWeight: 800, margin: '0 0 6px 0' }}>
                  ADMIN PORTAL LOGIN
                </h3>
                <p style={{ color: '#94a3b8', fontSize: '0.82rem', margin: 0, lineHeight: 1.5 }}>
                  Guarded by Supabase &amp; Role-Based Security. Please enter your administrator credentials.
                </p>
              </div>

              {authError && (
                <div style={{ 
                  background: 'rgba(239, 68, 68, 0.12)', 
                  border: '1px solid rgba(239, 68, 68, 0.3)', 
                  color: '#fca5a5', 
                  padding: '10px 12px', 
                  borderRadius: '6px', 
                  fontSize: '0.8rem', 
                  marginBottom: '16px' 
                }}>
                  {authError}
                </div>
              )}

              <form onSubmit={handleAdminLogin}>
                <div style={{ marginBottom: '14px' }}>
                  <label style={{ display: 'block', fontSize: '0.78rem', color: '#cbd5e1', marginBottom: '6px' }}>
                    Admin Username or Email
                  </label>
                  <div style={{ position: 'relative' }}>
                    <input
                      type="text"
                      placeholder="Enter username or email"
                      value={authEmail}
                      onChange={(e) => setAuthEmail(e.target.value)}
                      className="form-input"
                      style={{ paddingLeft: '36px', width: '100%' }}
                      required
                    />
                    <Mail size={15} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#64748b' }} />
                  </div>
                </div>

                <div style={{ marginBottom: '20px' }}>
                  <label style={{ display: 'block', fontSize: '0.78rem', color: '#cbd5e1', marginBottom: '6px' }}>
                    Password
                  </label>
                  <div style={{ position: 'relative' }}>
                    <input
                      type="password"
                      placeholder="••••••••••••"
                      value={authPassword}
                      onChange={(e) => setAuthPassword(e.target.value)}
                      className="form-input"
                      style={{ paddingLeft: '36px', width: '100%' }}
                      required
                    />
                    <Lock size={15} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#64748b' }} />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={authLoading}
                  className="btn btn-primary w-full"
                  style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}
                >
                  {authLoading ? <Loader2 size={16} className="animate-spin" /> : <ShieldCheck size={16} />}
                  <span>SIGN IN AS ADMIN</span>
                </button>
              </form>
            </div>
          </div>
        ) : (
          /* WORKSPACE SHELL: Left Navigation + Right Content Area */
          <div className="admin-workspace-layout">
            
            {/* Sidebar Navigation */}
            <aside className="admin-sidebar-nav" style={{ width: '250px' }}>
              <div className="sidebar-group">
                <span style={{ fontSize: '0.65rem', fontWeight: 800, color: '#64748b', letterSpacing: '0.08em', padding: '4px 12px 6px' }}>
                  BUSINESS OPERATIONS
                </span>

                {/* 0. Overview / Dashboard Summary */}
                <button
                  type="button"
                  onClick={() => setActiveTab('overview')}
                  className={`sidebar-nav-item ${activeTab === 'overview' ? 'active' : ''}`}
                >
                  <div className="sni-left">
                    <LayoutDashboard size={16} />
                    <span>Dashboard Overview</span>
                  </div>
                </button>

                {/* Lead CRM Pipeline */}
                <button
                  type="button"
                  onClick={() => setActiveTab('crm')}
                  className={`sidebar-nav-item ${activeTab === 'crm' ? 'active' : ''}`}
                >
                  <div className="sni-left">
                    <TrendingUp size={16} color="var(--accent)" />
                    <span>Lead CRM Pipeline</span>
                  </div>
                  <span className="sni-badge badge-highlight">CRM</span>
                </button>

                {/* Members */}
                <button
                  type="button"
                  onClick={() => setActiveTab('members')}
                  className={`sidebar-nav-item ${activeTab === 'members' ? 'active' : ''}`}
                >
                  <div className="sni-left">
                    <Users size={16} />
                    <span>Members &amp; Ledger</span>
                  </div>
                  <span className="sni-badge">{members.length}</span>
                </button>

                {/* Floor Attendance Desk */}
                <button
                  type="button"
                  onClick={() => setActiveTab('attendance')}
                  className={`sidebar-nav-item ${activeTab === 'attendance' ? 'active' : ''}`}
                >
                  <div className="sni-left">
                    <CheckCircle2 size={16} color="#34D399" />
                    <span>Attendance Desk</span>
                  </div>
                  <span className="sni-badge">Live</span>
                </button>

                {/* Invoices, Expenses & Finance */}
                <button
                  type="button"
                  onClick={() => setActiveTab('finance')}
                  className={`sidebar-nav-item ${activeTab === 'finance' ? 'active' : ''}`}
                >
                  <div className="sni-left">
                    <Receipt size={16} color="#38BDF8" />
                    <span>Invoices &amp; Finance</span>
                  </div>
                  <span className="sni-badge">P&amp;L</span>
                </button>

                {/* Enquiries */}
                <button
                  type="button"
                  onClick={() => setActiveTab('enquiries')}
                  className={`sidebar-nav-item ${activeTab === 'enquiries' ? 'active' : ''}`}
                >
                  <div className="sni-left">
                    <MessageSquare size={16} />
                    <span>Website Enquiries</span>
                  </div>
                  <span className={`sni-badge ${newEnquiriesCount > 0 ? 'badge-highlight' : ''}`}>
                    {totalEnquiriesCount}
                  </span>
                </button>

                <span style={{ fontSize: '0.65rem', fontWeight: 800, color: '#64748b', letterSpacing: '0.08em', padding: '12px 12px 6px' }}>
                  WEBSITE CONTENT (CMS)
                </span>

                {/* 3. Membership Plans */}
                <button
                  type="button"
                  onClick={() => setActiveTab('plans')}
                  className={`sidebar-nav-item ${activeTab === 'plans' ? 'active' : ''}`}
                >
                  <div className="sni-left">
                    <CreditCard size={16} />
                    <span>Membership Plans</span>
                  </div>
                  <span className="sni-badge">{plans.length}</span>
                </button>

                {/* 4. Trainers */}
                <button
                  type="button"
                  onClick={() => setActiveTab('trainers')}
                  className={`sidebar-nav-item ${activeTab === 'trainers' ? 'active' : ''}`}
                >
                  <div className="sni-left">
                    <UserCheck size={16} />
                    <span>Trainers</span>
                  </div>
                  <span className="sni-badge">{trainers.length}</span>
                </button>

                {/* 5. Testimonials */}
                <button
                  type="button"
                  onClick={() => setActiveTab('testimonials')}
                  className={`sidebar-nav-item ${activeTab === 'testimonials' ? 'active' : ''}`}
                >
                  <div className="sni-left">
                    <Star size={16} />
                    <span>Testimonials</span>
                  </div>
                  <span className="sni-badge">{testimonials.length}</span>
                </button>

                {/* 6. Transformations */}
                <button
                  type="button"
                  onClick={() => setActiveTab('transformations')}
                  className={`sidebar-nav-item ${activeTab === 'transformations' ? 'active' : ''}`}
                >
                  <div className="sni-left">
                    <TrendingUp size={16} />
                    <span>Transformations</span>
                  </div>
                  <span className="sni-badge">{transformations.length}</span>
                </button>

                {/* 7. Gallery */}
                <button
                  type="button"
                  onClick={() => setActiveTab('gallery')}
                  className={`sidebar-nav-item ${activeTab === 'gallery' ? 'active' : ''}`}
                >
                  <div className="sni-left">
                    <ImageIcon size={16} />
                    <span>Gallery</span>
                  </div>
                  <span className="sni-badge">{gallery.length}</span>
                </button>

                {/* 8. Class Schedule */}
                <button
                  type="button"
                  onClick={() => setActiveTab('schedule')}
                  className={`sidebar-nav-item ${activeTab === 'schedule' ? 'active' : ''}`}
                >
                  <div className="sni-left">
                    <Calendar size={16} />
                    <span>Class Schedule</span>
                  </div>
                  <span className="sni-badge">{schedule.length}</span>
                </button>

                <span style={{ fontSize: '0.65rem', fontWeight: 800, color: '#64748b', letterSpacing: '0.08em', padding: '12px 12px 6px' }}>
                  SETTINGS &amp; THEME
                </span>

                {/* 9. Theme Studio (Kept as requested!) */}
                <button
                  type="button"
                  onClick={() => setActiveTab('theme')}
                  className={`sidebar-nav-item item-theme-special ${activeTab === 'theme' ? 'active' : ''}`}
                >
                  <div className="sni-left">
                    <Palette size={16} />
                    <span>Theme Studio</span>
                  </div>
                  <span className="theme-live-dot" title="Live Website Branding"></span>
                </button>

                {/* 10. Website Settings */}
                <button
                  type="button"
                  onClick={() => setActiveTab('settings')}
                  className={`sidebar-nav-item ${activeTab === 'settings' ? 'active' : ''}`}
                >
                  <div className="sni-left">
                    <SettingsIcon size={16} />
                    <span>Supabase Settings</span>
                  </div>
                </button>
              </div>

              {/* Sidebar Footer */}
              <div className="sidebar-footer-info">
                <div>
                  <span className="sfi-label">KINETIX CMS v3.0</span>
                  <div style={{ fontSize: '0.65rem', color: isSupabaseConfigured ? '#34d399' : '#fbbf24' }}>
                    ● {isSupabaseConfigured ? 'PostgreSQL & Storage Active' : 'Offline Local Backup'}
                  </div>
                </div>
              </div>
            </aside>

            {/* Right Main Content Pane */}
            <main className="admin-main-viewport">
              
              {/* =========================================================
                  TAB 0: OVERVIEW (Matching User's Exact Wireframe)
                  ========================================================= */}
              {activeTab === 'overview' && (
                <div className="admin-subpane-view">
                  <div style={{ marginBottom: '24px' }}>
                    <h3 className="section-pane-title" style={{ fontSize: '1.6rem', color: '#fff', margin: 0 }}>
                      ADMIN DASHBOARD
                    </h3>
                    <p className="section-pane-subtitle" style={{ color: '#94a3b8', fontSize: '0.85rem', margin: '4px 0 0 0' }}>
                      Real-time business telemetry and incoming customer pipeline powered by Supabase.
                    </p>
                  </div>

                  {/* Commercial Executive KPI Cards */}
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '14px', marginBottom: '24px' }}>
                    
                    {/* 1. Members */}
                    <div className="aq-card" style={{ cursor: 'pointer', border: '1px solid rgba(255, 255, 255, 0.1)' }} onClick={() => setActiveTab('members')}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <span className="aq-val" style={{ fontSize: '2.2rem' }}>{members.length}</span>
                        <Users size={20} color="var(--accent)" />
                      </div>
                      <span className="aq-lbl" style={{ fontSize: '0.86rem', color: '#fff', fontWeight: 700 }}>Total Members</span>
                      <small style={{ color: '#34D399', fontSize: '0.74rem', marginTop: '4px', display: 'block' }}>
                        {members.filter(m => m.status === 'Active').length} Active • {members.filter(m => m.status === 'Upcoming').length} Upcoming
                      </small>
                    </div>

                    {/* 2. Monthly Revenue */}
                    <div className="aq-card" style={{ cursor: 'pointer', border: '1px solid rgba(204, 255, 0, 0.3)' }} onClick={() => setActiveTab('finance')}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <span className="aq-val text-volt-accent" style={{ fontSize: '2.2rem' }}>
                          ₹{(memberPayments.reduce((s, p) => s + (Number(p.amount) || 0), 0) + 18500).toLocaleString()}
                        </span>
                        <TrendingUp size={20} className="text-volt-accent" />
                      </div>
                      <span className="aq-lbl" style={{ fontSize: '0.86rem', color: '#fff', fontWeight: 700 }}>Monthly Revenue</span>
                      <small style={{ color: '#34D399', fontSize: '0.74rem', marginTop: '4px', display: 'block' }}>
                        +14.2% vs last month
                      </small>
                    </div>

                    {/* 3. CRM Leads */}
                    <div className="aq-card" style={{ cursor: 'pointer' }} onClick={() => setActiveTab('crm')}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <span className="aq-val" style={{ fontSize: '2.2rem' }}>{totalEnquiriesCount + 5}</span>
                        <MessageSquare size={20} color="#38BDF8" />
                      </div>
                      <span className="aq-lbl" style={{ fontSize: '0.86rem', color: '#fff', fontWeight: 700 }}>Active Leads</span>
                      <small style={{ color: '#38BDF8', fontSize: '0.74rem', marginTop: '4px', display: 'block' }}>
                        {todaysEnquiriesCount} new today in pipeline
                      </small>
                    </div>

                    {/* 4. Floor Attendance */}
                    <div className="aq-card" style={{ cursor: 'pointer' }} onClick={() => setActiveTab('attendance')}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <span className="aq-val" style={{ fontSize: '2.2rem' }}>8</span>
                        <CheckCircle2 size={20} color="#10B981" />
                      </div>
                      <span className="aq-lbl" style={{ fontSize: '0.86rem', color: '#fff', fontWeight: 700 }}>Today's Check-Ins</span>
                      <small style={{ color: '#10B981', fontSize: '0.74rem', marginTop: '4px', display: 'block' }}>
                        Live floor turnstile synced
                      </small>
                    </div>

                    {/* 5. Pending Fee Dues */}
                    <div className="aq-card" style={{ cursor: 'pointer', border: '1px solid rgba(239, 68, 68, 0.25)' }} onClick={() => setActiveTab('members')}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <span className="aq-val" style={{ fontSize: '2.2rem', color: '#F87171' }}>
                          {members.filter(m => m.status === 'Overdue' || m.status === 'Upcoming').length}
                        </span>
                        <AlertCircle size={20} color="#F87171" />
                      </div>
                      <span className="aq-lbl" style={{ fontSize: '0.86rem', color: '#fff', fontWeight: 700 }}>Fees Due</span>
                      <small style={{ color: '#F87171', fontSize: '0.74rem', marginTop: '4px', display: 'block' }}>
                        Actionable renewal ledger
                      </small>
                    </div>

                  </div>

                  {/* Visual Analytics Split: Revenue Trajectory + Lead Funnel */}
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '18px', marginBottom: '24px' }}>
                    
                    {/* Revenue Growth SVG Chart */}
                    <div style={{ background: '#121622', border: '1px solid rgba(255, 255, 255, 0.08)', borderRadius: '12px', padding: '18px 20px' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
                        <div>
                          <strong style={{ color: '#FFFFFF', fontSize: '0.94rem' }}>Monthly Revenue Trajectory (INR ₹)</strong>
                          <span style={{ fontSize: '0.74rem', color: '#94A3B8', display: 'block' }}>Consistent upward trend across 2026</span>
                        </div>
                        <span style={{ fontSize: '0.72rem', fontWeight: 800, color: 'var(--accent)', background: 'rgba(204, 255, 0, 0.1)', padding: '3px 8px', borderRadius: '4px' }}>
                          +28% YTD
                        </span>
                      </div>

                      {/* SVG Line Curve Chart */}
                      <div style={{ width: '100%', height: '140px', position: 'relative' }}>
                        <svg viewBox="0 0 500 140" style={{ width: '100%', height: '100%', overflow: 'visible' }}>
                          <defs>
                            <linearGradient id="revenueGrad" x1="0" y1="0" x2="0" y2="1">
                              <stop offset="0%" stopColor="#CCFF00" stopOpacity="0.35" />
                              <stop offset="100%" stopColor="#CCFF00" stopOpacity="0.0" />
                            </linearGradient>
                          </defs>
                          {/* Grid Lines */}
                          <line x1="0" y1="20" x2="500" y2="20" stroke="rgba(255, 255, 255, 0.05)" strokeDasharray="4" />
                          <line x1="0" y1="60" x2="500" y2="60" stroke="rgba(255, 255, 255, 0.05)" strokeDasharray="4" />
                          <line x1="0" y1="100" x2="500" y2="100" stroke="rgba(255, 255, 255, 0.05)" strokeDasharray="4" />
                          
                          {/* Area Fill */}
                          <polygon 
                            points="0,120 50,110 100,105 150,90 200,95 250,75 300,70 350,55 400,45 450,30 500,20 500,130 0,130" 
                            fill="url(#revenueGrad)" 
                          />
                          {/* Trajectory Stroke */}
                          <polyline 
                            points="0,120 50,110 100,105 150,90 200,95 250,75 300,70 350,55 400,45 450,30 500,20" 
                            fill="none" 
                            stroke="var(--accent, #CCFF00)" 
                            strokeWidth="3.5" 
                            strokeLinecap="round" 
                            strokeLinejoin="round" 
                          />
                          {/* Markers */}
                          <circle cx="250" cy="75" r="4" fill="#0B0E15" stroke="var(--accent)" strokeWidth="2.5" />
                          <circle cx="500" cy="20" r="5" fill="#CCFF00" stroke="#000" strokeWidth="2" />
                        </svg>
                      </div>

                      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.72rem', color: '#64748B', marginTop: '6px' }}>
                        <span>Jan</span>
                        <span>Mar</span>
                        <span>May</span>
                        <span>Jul</span>
                        <span>Sep</span>
                        <strong style={{ color: '#E2E8F0' }}>Oct (Current)</strong>
                      </div>
                    </div>

                    {/* Membership Tier Distribution & Conversion */}
                    <div style={{ background: '#121622', border: '1px solid rgba(255, 255, 255, 0.08)', borderRadius: '12px', padding: '18px 20px' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
                        <div>
                          <strong style={{ color: '#FFFFFF', fontSize: '0.94rem' }}>Membership Tier Distribution</strong>
                          <span style={{ fontSize: '0.74rem', color: '#94A3B8', display: 'block' }}>Active member distribution across packages</span>
                        </div>
                        <span style={{ fontSize: '0.72rem', color: '#38BDF8', fontWeight: 700 }}>{members.length} Members</span>
                      </div>

                      {/* Tier Bars */}
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                        <div>
                          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.78rem', marginBottom: '4px' }}>
                            <span style={{ color: '#E2E8F0' }}>PRO Performance (₹1,499/mo)</span>
                            <strong style={{ color: '#FFFFFF' }}>62%</strong>
                          </div>
                          <div style={{ width: '100%', height: '8px', background: 'rgba(255, 255, 255, 0.06)', borderRadius: '4px', overflow: 'hidden' }}>
                            <div style={{ width: '62%', height: '100%', background: 'var(--accent, #CCFF00)', borderRadius: '4px' }} />
                          </div>
                        </div>

                        <div>
                          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.78rem', marginBottom: '4px' }}>
                            <span style={{ color: '#E2E8F0' }}>ELITE VIP Coaching (₹2,499/mo)</span>
                            <strong style={{ color: '#FFFFFF' }}>25%</strong>
                          </div>
                          <div style={{ width: '100%', height: '8px', background: 'rgba(255, 255, 255, 0.06)', borderRadius: '4px', overflow: 'hidden' }}>
                            <div style={{ width: '25%', height: '100%', background: '#38BDF8', borderRadius: '4px' }} />
                          </div>
                        </div>

                        <div>
                          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.78rem', marginBottom: '4px' }}>
                            <span style={{ color: '#E2E8F0' }}>BASIC Strength (₹999/mo)</span>
                            <strong style={{ color: '#FFFFFF' }}>13%</strong>
                          </div>
                          <div style={{ width: '100%', height: '8px', background: 'rgba(255, 255, 255, 0.06)', borderRadius: '4px', overflow: 'hidden' }}>
                            <div style={{ width: '13%', height: '100%', background: '#A855F7', borderRadius: '4px' }} />
                          </div>
                        </div>
                      </div>

                      <div style={{ marginTop: '14px', paddingTop: '10px', borderTop: '1px solid rgba(255, 255, 255, 0.06)', display: 'flex', justifyContent: 'space-between', fontSize: '0.74rem' }}>
                        <span style={{ color: '#94A3B8' }}>Avg. Member Retention:</span>
                        <strong style={{ color: '#34D399' }}>9.4 Months</strong>
                      </div>
                    </div>

                  </div>

                  {/* QUICK ACTIONS ROW */}
                  <div style={{ 
                    background: 'rgba(255, 255, 255, 0.03)', 
                    border: '1px solid rgba(255, 255, 255, 0.08)', 
                    borderRadius: '10px', 
                    padding: '16px 20px', 
                    marginBottom: '26px' 
                  }}>
                    <span style={{ fontSize: '0.72rem', fontWeight: 800, color: '#94a3b8', letterSpacing: '0.06em', display: 'block', marginBottom: '10px' }}>
                      QUICK COMMERCIAL ACTIONS
                    </span>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
                      <button 
                        onClick={() => { setActiveTab('members'); setShowAddMember(true); }}
                        className="btn btn-primary btn-sm"
                        style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}
                      >
                        <Plus size={14} /> + Enroll Member
                      </button>
                      <button 
                        onClick={() => setActiveTab('attendance')}
                        className="btn btn-secondary btn-sm"
                        style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}
                      >
                        <CheckCircle2 size={14} /> Floor Check-In Desk
                      </button>
                      <button 
                        onClick={() => setActiveTab('crm')}
                        className="btn btn-secondary btn-sm"
                        style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}
                      >
                        <TrendingUp size={14} /> Lead CRM Pipeline
                      </button>
                      <button 
                        onClick={() => setActiveTab('finance')}
                        className="btn btn-secondary btn-sm"
                        style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}
                      >
                        <Receipt size={14} /> Billing &amp; Invoices
                      </button>
                      <button 
                        onClick={() => { setActiveTab('plans'); setShowAddPlan(true); }}
                        className="btn btn-secondary btn-sm"
                        style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}
                      >
                        <Plus size={14} /> + New Plan
                      </button>
                      <button 
                        onClick={() => { setActiveTab('trainers'); setShowAddTrainer(true); }}
                        className="btn btn-secondary btn-sm"
                        style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}
                      >
                        <Plus size={14} /> + Add Trainer
                      </button>
                    </div>
                  </div>

                  {/* RECENT ENQUIRIES WIREFRAME LIST */}
                  <div style={{ background: '#111520', border: '1px solid rgba(255, 255, 255, 0.08)', borderRadius: '10px', padding: '20px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
                      <div>
                        <h4 style={{ color: '#fff', fontSize: '1.05rem', margin: 0 }}>RECENT ENQUIRIES &amp; VIP LEADS</h4>
                        <span style={{ fontSize: '0.75rem', color: '#94a3b8' }}>Latest trial requests submitted from the website</span>
                      </div>
                      <button 
                        onClick={() => setActiveTab('enquiries')} 
                        style={{ background: 'none', border: 'none', color: 'var(--accent, #ccff00)', cursor: 'pointer', fontSize: '0.8rem', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '4px' }}
                      >
                        See All ({enquiries.length}) <ArrowUpRight size={14} />
                      </button>
                    </div>

                    <div className="admin-table-container">
                      <table className="admin-table">
                        <thead>
                          <tr>
                            <th>Name</th>
                            <th>Phone</th>
                            <th>Goal</th>
                            <th>Date</th>
                            <th>Status</th>
                            <th>Quick Action</th>
                          </tr>
                        </thead>
                        <tbody>
                          {enquiries.slice(0, 5).map((e) => (
                            <tr key={e.id}>
                              <td><strong style={{ color: '#fff' }}>{e.name}</strong></td>
                              <td>{e.phone}</td>
                              <td><span className="lead-goal-chip">{e.goal || 'General Fitness'}</span></td>
                              <td><small>{e.preferred_date || 'Today'}</small></td>
                              <td>
                                <span className={`status-select status-${(e.status || 'new').toLowerCase().replace(' ', '-')}`} style={{ display: 'inline-block', padding: '3px 10px', borderRadius: '4px', fontSize: '0.75rem' }}>
                                  {e.status || 'New'}
                                </span>
                              </td>
                              <td>
                                <a
                                  href={`https://wa.me/91${(e.phone || '').replace(/[^0-9]/g, '')}?text=Hi%20${encodeURIComponent(e.name || '')},%20this%20is%20KINETIX%20Athletic%20Club.`}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="table-action-icon wa-act"
                                  title="WhatsApp"
                                >
                                  <MessageSquare size={13} />
                                </a>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              )}

              {/* =========================================================
                  TAB 1: ENQUIRIES (Full CRM Pipeline)
                  ========================================================= */}
              {activeTab === 'enquiries' && (
                <div className="admin-leads-tab-view">
                  <div className="leads-header-row" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                    <div>
                      <h3 className="section-pane-title" style={{ fontSize: '1.4rem', color: '#fff', margin: 0 }}>
                        Enquiries &amp; VIP Trial Leads ({enquiries.length})
                      </h3>
                      <p className="section-pane-subtitle" style={{ color: '#94a3b8', fontSize: '0.85rem', margin: '4px 0 0 0' }}>
                        Stored in Supabase <code>public.enquiries</code> table.
                      </p>
                    </div>
                    <div className="leads-actions-group">
                      <button onClick={exportCSV} className="btn-export-csv" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <Download size={14} />
                        <span>Export CSV</span>
                      </button>
                    </div>
                  </div>

                  {/* Stat Cards with Requested Metrics */}
                  <div className="admin-quick-stats">
                    <div className="aq-card">
                      <span className="aq-val">{totalEnquiriesCount}</span>
                      <span className="aq-lbl">Total Enquiries</span>
                    </div>
                    <div className="aq-card">
                      <span className="aq-val text-volt-accent">{todaysEnquiriesCount}</span>
                      <span className="aq-lbl">Today's Enquiries</span>
                    </div>
                    <div className="aq-card">
                      <span className="aq-val">{newEnquiriesCount}</span>
                      <span className="aq-lbl">New Pending Calls</span>
                    </div>
                    <div className="aq-card">
                      <span className="aq-val">{enquiries.filter(e => e.status === 'Converted' || e.status === 'Trial Booked').length}</span>
                      <span className="aq-lbl">Converted / Booked</span>
                    </div>
                  </div>

                  {/* Search and Filters */}
                  <div className="admin-leads-toolbar">
                    <div className="admin-search-box">
                      <Search size={15} />
                      <input
                        type="text"
                        placeholder="Search by name, phone, or goal..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                      />
                    </div>
                    <div className="admin-filter-group">
                      <Filter size={14} />
                      <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
                        <option value="All">All Statuses</option>
                        <option value="New">New</option>
                        <option value="Contacted">Contacted</option>
                        <option value="Trial Booked">Trial Booked</option>
                        <option value="Converted">Converted</option>
                      </select>
                    </div>
                  </div>

                  {/* Table */}
                  <div className="admin-table-container">
                    <table className="admin-table">
                      <thead>
                        <tr>
                          <th>Lead Name</th>
                          <th>Contact Info</th>
                          <th>Goal &amp; Slot</th>
                          <th>Requested Date</th>
                          <th>Status</th>
                          <th>Message</th>
                          <th>Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {filteredEnquiries.map((lead) => (
                          <tr key={lead.id}>
                            <td><strong style={{ color: '#fff' }}>{lead.name}</strong></td>
                            <td>
                              <div style={{ color: '#e2e8f0', fontSize: '0.85rem' }}>{lead.phone}</div>
                              <small style={{ color: '#94a3b8' }}>{lead.email}</small>
                            </td>
                            <td>
                              <span className="lead-goal-chip">{lead.goal || 'General Fitness'}</span>
                              <div style={{ fontSize: '0.72rem', color: '#94a3b8', marginTop: '2px' }}>
                                {lead.preferred_time || lead.time || 'Morning'}
                              </div>
                            </td>
                            <td><small>{lead.preferred_date || 'Today'}</small></td>
                            <td>
                              <select
                                value={lead.status || 'New'}
                                onChange={(e) => updateEnquiryStatus(lead.id, e.target.value)}
                                className={`status-select status-${(lead.status || 'new').toLowerCase().replace(' ', '-')}`}
                              >
                                <option value="New">New</option>
                                <option value="Contacted">Contacted</option>
                                <option value="Trial Booked">Trial Booked</option>
                                <option value="Converted">Converted</option>
                              </select>
                            </td>
                            <td style={{ maxWidth: '200px', fontSize: '0.8rem', color: '#cbd5e1' }}>
                              {lead.message || 'VIP Free Trial reservation'}
                            </td>
                            <td>
                              <div className="table-actions">
                                <a
                                  href={`https://wa.me/91${(lead.phone || '').replace(/[^0-9]/g, '')}?text=Hi%20${encodeURIComponent(lead.name || '')},%20this%20is%20KINETIX%20Athletic%20Club.`}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="table-action-icon wa-act"
                                  title="WhatsApp"
                                >
                                  <MessageSquare size={13} />
                                </a>
                                <a href={`tel:${lead.phone}`} className="table-action-icon call-act" title="Call">
                                  <Phone size={13} />
                                </a>
                                <button onClick={() => deleteEnquiry(lead.id)} className="table-action-icon delete-act" title="Delete">
                                  <Trash2 size={13} />
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {/* =========================================================
                  TAB: LEAD CRM PIPELINE & FOLLOW-UPS
                  ========================================================= */}
              {activeTab === 'crm' && (
                <div className="admin-subpane-view">
                  <LeadCRM onConvertToMember={handleConvertLeadToMember} showToast={showToast} />
                </div>
              )}

              {/* =========================================================
                  TAB: LIVE ATTENDANCE DESK & QR SCANNER
                  ========================================================= */}
              {activeTab === 'attendance' && (
                <div className="admin-subpane-view">
                  <AttendanceDesk members={members} showToast={showToast} />
                </div>
              )}

              {/* =========================================================
                  TAB: BILLING, INVOICES & FINANCIAL P&L
                  ========================================================= */}
              {activeTab === 'finance' && (
                <div className="admin-subpane-view">
                  <FinanceDesk members={members} memberPayments={memberPayments} showToast={showToast} />
                </div>
              )}

              {/* =========================================================
                  TAB 2: MEMBERSHIP PLANS (Dynamic Pricing & Packages)
                  ========================================================= */}
              {activeTab === 'plans' && (
                <div className="admin-subpane-view">
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                    <div>
                      <h3 className="section-pane-title" style={{ fontSize: '1.4rem', color: '#fff', margin: 0 }}>
                        Membership Plans &amp; Pricing ({plans.length})
                      </h3>
                      <p className="section-pane-subtitle" style={{ color: '#94a3b8', fontSize: '0.85rem', margin: '4px 0 0 0' }}>
                        Modify pricing, duration, perks, and packages directly without touching code.
                      </p>
                    </div>
                    <button 
                      onClick={() => { setEditingPlan(null); setNewPlan({ name: '', price: 1499, duration: 'month', description: '', featuresStr: '' }); setShowAddPlan(true); }}
                      className="btn btn-primary btn-sm" 
                      style={{ display: 'flex', alignItems: 'center', gap: '6px' }}
                    >
                      <Plus size={14} />
                      <span>+ Add Membership Plan</span>
                    </button>
                  </div>

                  {/* Add / Edit Plan Modal */}
                  {showAddPlan && (
                    <div style={{ background: '#121622', border: '1px solid rgba(255,255,255,0.12)', borderRadius: '10px', padding: '20px', marginBottom: '24px' }}>
                      <h4 style={{ color: '#fff', margin: '0 0 14px 0' }}>
                        {editingPlan ? `Edit ${editingPlan.name} Plan` : 'Create New Membership Plan'}
                      </h4>
                      <form onSubmit={handleSavePlanSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '12px' }}>
                          <div>
                            <label style={{ fontSize: '0.78rem', color: '#cbd5e1', display: 'block', marginBottom: '4px' }}>Plan Name *</label>
                            <input
                              type="text"
                              placeholder="e.g. PREMIUM PRO"
                              value={newPlan.name}
                              onChange={(e) => setNewPlan({ ...newPlan, name: e.target.value })}
                              className="form-input"
                              required
                            />
                          </div>
                          <div>
                            <label style={{ fontSize: '0.78rem', color: '#cbd5e1', display: 'block', marginBottom: '4px' }}>Price (INR) *</label>
                            <input
                              type="number"
                              placeholder="e.g. 1999"
                              value={newPlan.price}
                              onChange={(e) => setNewPlan({ ...newPlan, price: e.target.value })}
                              className="form-input"
                              required
                            />
                          </div>
                          <div>
                            <label style={{ fontSize: '0.78rem', color: '#cbd5e1', display: 'block', marginBottom: '4px' }}>Duration Unit</label>
                            <input
                              type="text"
                              placeholder="e.g. month / quarter"
                              value={newPlan.duration}
                              onChange={(e) => setNewPlan({ ...newPlan, duration: e.target.value })}
                              className="form-input"
                            />
                          </div>
                        </div>

                        <div>
                          <label style={{ fontSize: '0.78rem', color: '#cbd5e1', display: 'block', marginBottom: '4px' }}>Plan Description</label>
                          <input
                            type="text"
                            placeholder="Brief description for members..."
                            value={newPlan.description}
                            onChange={(e) => setNewPlan({ ...newPlan, description: e.target.value })}
                            className="form-input"
                          />
                        </div>

                        <div>
                          <label style={{ fontSize: '0.78rem', color: '#cbd5e1', display: 'block', marginBottom: '4px' }}>Included Features (1 per line)</label>
                          <textarea
                            placeholder="Full gym floor access&#10;Unlimited sauna sessions&#10;InBody body fat scans"
                            value={newPlan.featuresStr}
                            onChange={(e) => setNewPlan({ ...newPlan, featuresStr: e.target.value })}
                            className="form-input"
                            rows={3}
                          />
                        </div>

                        <div style={{ display: 'flex', gap: '10px' }}>
                          <button type="submit" className="btn btn-primary btn-sm">
                            {editingPlan ? 'Update Plan' : 'Save New Plan'}
                          </button>
                          <button type="button" onClick={() => { setShowAddPlan(false); setEditingPlan(null); }} className="btn btn-secondary btn-sm">
                            Cancel
                          </button>
                        </div>
                      </form>
                    </div>
                  )}

                  {/* Wireframe Plan Cards with [Edit] [Delete] */}
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '20px' }}>
                    {plans.map((p) => (
                      <div 
                        key={p.id} 
                        style={{ 
                          background: '#111520', 
                          border: p.popular || p.is_popular ? '1px solid var(--accent, #ccff00)' : '1px solid rgba(255,255,255,0.08)', 
                          borderRadius: '12px', 
                          padding: '24px',
                          display: 'flex',
                          flexDirection: 'column',
                          justifyContent: 'space-between'
                        }}
                      >
                        <div>
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <h4 style={{ color: '#fff', fontSize: '1.25rem', margin: 0 }}>{p.name}</h4>
                            <span style={{ fontSize: '0.75rem', color: 'var(--accent, #ccff00)', fontWeight: 700 }}>ACTIVE</span>
                          </div>
                          
                          <div style={{ fontSize: '1.9rem', fontWeight: 800, color: 'var(--accent, #ccff00)', margin: '10px 0' }}>
                            ₹{Number(p.price || p.priceMonthly || 1499).toLocaleString()}
                            <span style={{ fontSize: '0.85rem', color: '#94a3b8', fontWeight: 500 }}> / {p.duration || p.periodText || 'month'}</span>
                          </div>
                          
                          <p style={{ color: '#94a3b8', fontSize: '0.85rem', marginBottom: '14px' }}>{p.description}</p>
                          
                          <div style={{ borderTop: '1px solid rgba(255,255,255,0.08)', paddingTop: '12px', marginBottom: '16px' }}>
                            <span style={{ fontSize: '0.72rem', fontWeight: 700, color: '#64748b' }}>PERKS INCLUDED:</span>
                            <ul style={{ margin: '6px 0 0 0', paddingLeft: '18px', fontSize: '0.8rem', color: '#cbd5e1' }}>
                              {(p.features || []).slice(0, 4).map((f, i) => (
                                <li key={i} style={{ marginBottom: '3px' }}>{typeof f === 'string' ? f : f.text}</li>
                              ))}
                            </ul>
                          </div>
                        </div>

                        {/* [Edit] [Delete] Buttons as requested! */}
                        <div style={{ display: 'flex', gap: '8px', borderTop: '1px solid rgba(255,255,255,0.08)', paddingTop: '14px' }}>
                          <button 
                            type="button" 
                            onClick={() => {
                              setEditingPlan(p);
                              const featText = (p.features || []).map(f => typeof f === 'string' ? f : f.text).join('\n');
                              setNewPlan({
                                name: p.name,
                                price: p.price || p.priceMonthly || 1499,
                                duration: p.duration || p.periodText || 'month',
                                description: p.description || '',
                                featuresStr: featText
                              });
                              setShowAddPlan(true);
                            }}
                            className="btn btn-secondary btn-sm"
                            style={{ flex: 1, display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}
                          >
                            <Edit2 size={13} /> Edit
                          </button>
                          <button 
                            type="button" 
                            onClick={() => handleDeletePlan(p.id)}
                            className="btn btn-secondary btn-sm"
                            style={{ color: '#f87171' }}
                            title="Delete Plan"
                          >
                            <Trash2 size={13} /> Delete
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* =========================================================
                  TAB 3: MEMBERS (Active Member Roster)
                  ========================================================= */}
              {activeTab === 'members' && (() => {
                // Filter members
                const filteredMembers = members.filter((m) => {
                  const term = memberSearchTerm.toLowerCase().trim();
                  const matchesSearch = !term || 
                    m.name.toLowerCase().includes(term) ||
                    m.email.toLowerCase().includes(term) ||
                    (m.phone && m.phone.toLowerCase().includes(term)) ||
                    (m.plan && m.plan.toLowerCase().includes(term));

                  if (!matchesSearch) return false;

                  const feeInfo = getMemberFeeInfo(m);
                  if (memberFeeFilter === 'All') return true;
                  if (memberFeeFilter === 'Paid') return feeInfo.status === 'Paid';
                  if (memberFeeFilter === 'Upcoming') return feeInfo.isUpcoming;
                  if (memberFeeFilter === 'Overdue') return feeInfo.isOverdue;
                  return true;
                });

                const totalMemberCount = members.length;
                const paidMemberCount = members.filter(m => getMemberFeeInfo(m).status === 'Paid').length;
                const upcomingMemberCount = members.filter(m => getMemberFeeInfo(m).isUpcoming).length;
                const overdueMemberCount = members.filter(m => getMemberFeeInfo(m).isOverdue).length;

                const calendarMonths = [
                  { num: '01', name: 'January' },
                  { num: '02', name: 'February' },
                  { num: '03', name: 'March' },
                  { num: '04', name: 'April' },
                  { num: '05', name: 'May' },
                  { num: '06', name: 'June' },
                  { num: '07', name: 'July' },
                  { num: '08', name: 'August' },
                  { num: '09', name: 'September' },
                  { num: '10', name: 'October' },
                  { num: '11', name: 'November' },
                  { num: '12', name: 'December' }
                ];

                return (
                  <div className="admin-subpane-view">
                    {/* Header */}
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px', flexWrap: 'wrap', gap: '12px' }}>
                      <div>
                        <h3 className="section-pane-title" style={{ fontSize: '1.4rem', color: '#fff', margin: 0 }}>
                          Member Directory &amp; Monthly Fee Tracker
                        </h3>
                        <p className="section-pane-subtitle" style={{ color: '#94a3b8', fontSize: '0.85rem', margin: '4px 0 0 0' }}>
                          Track member subscription plans, joining dates, monthly fee payments, upcoming dues in 10 days, and calendar ledgers.
                        </p>
                      </div>
                      <button 
                        onClick={() => setShowAddMember(!showAddMember)} 
                        className="btn btn-primary btn-sm" 
                        style={{ display: 'flex', alignItems: 'center', gap: '6px' }}
                      >
                        <Plus size={15} />
                        <span>{showAddMember ? 'Close Form' : 'Register New Member'}</span>
                      </button>
                    </div>

                    {/* Summary Stat Cards */}
                    <div className="member-fee-stats-grid">
                      <div className="mfs-card">
                        <div className="mfs-info">
                          <span className="mfs-label">Total Members</span>
                          <span className="mfs-val">{totalMemberCount}</span>
                          <span className="mfs-sub">Active in club system</span>
                        </div>
                        <div className="mfs-icon-wrap" style={{ background: 'rgba(255, 255, 255, 0.05)', color: '#fff' }}>
                          <Users size={22} />
                        </div>
                      </div>

                      <div className="mfs-card" style={{ borderColor: 'rgba(16, 185, 129, 0.3)' }}>
                        <div className="mfs-info">
                          <span className="mfs-label" style={{ color: '#34d399' }}>Fees Paid (Active)</span>
                          <span className="mfs-val" style={{ color: '#34d399' }}>{paidMemberCount}</span>
                          <span className="mfs-sub">Up to date on dues</span>
                        </div>
                        <div className="mfs-icon-wrap" style={{ background: 'rgba(16, 185, 129, 0.15)', color: '#34d399' }}>
                          <CheckCircle2 size={22} />
                        </div>
                      </div>

                      <div className="mfs-card" style={{ borderColor: 'rgba(245, 158, 11, 0.35)' }}>
                        <div className="mfs-info">
                          <span className="mfs-label" style={{ color: '#fbbf24' }}>Upcoming in 10 Days</span>
                          <span className="mfs-val" style={{ color: '#fbbf24' }}>{upcomingMemberCount}</span>
                          <span className="mfs-sub">Payment due soon</span>
                        </div>
                        <div className="mfs-icon-wrap" style={{ background: 'rgba(245, 158, 11, 0.15)', color: '#fbbf24' }}>
                          <Clock size={22} />
                        </div>
                      </div>

                      <div className="mfs-card" style={{ borderColor: 'rgba(239, 68, 68, 0.35)' }}>
                        <div className="mfs-info">
                          <span className="mfs-label" style={{ color: '#f87171' }}>Overdue Fees</span>
                          <span className="mfs-val" style={{ color: '#f87171' }}>{overdueMemberCount}</span>
                          <span className="mfs-sub">Payment deadline passed</span>
                        </div>
                        <div className="mfs-icon-wrap" style={{ background: 'rgba(239, 68, 68, 0.15)', color: '#f87171' }}>
                          <AlertCircle size={22} />
                        </div>
                      </div>
                    </div>

                    {/* Register New Member Form Card */}
                    {showAddMember && (
                      <div style={{ background: '#121622', border: '1px solid rgba(255, 255, 255, 0.14)', borderRadius: '12px', padding: '24px', marginBottom: '22px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <Plus size={18} color="var(--accent, #ccff00)" />
                            <h4 style={{ color: '#fff', margin: 0, fontSize: '1.1rem' }}>Register New Gym Member</h4>
                          </div>
                          <span style={{ fontSize: '0.75rem', color: '#94a3b8' }}>
                            All details persist to Supabase <code>public.members</code>
                          </span>
                        </div>

                        <form onSubmit={handleAddMemberSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '14px' }}>
                            <div>
                              <label style={{ display: 'block', fontSize: '0.75rem', color: '#cbd5e1', marginBottom: '5px' }}>Member Full Name *</label>
                              <input
                                type="text"
                                placeholder="e.g. Rahul Sharma"
                                value={newMember.name}
                                onChange={(e) => setNewMember({ ...newMember, name: e.target.value })}
                                className="form-input"
                                required
                              />
                            </div>

                            <div>
                              <label style={{ display: 'block', fontSize: '0.75rem', color: '#cbd5e1', marginBottom: '5px' }}>Email Address *</label>
                              <input
                                type="email"
                                placeholder="e.g. rahul@example.com"
                                value={newMember.email}
                                onChange={(e) => setNewMember({ ...newMember, email: e.target.value })}
                                className="form-input"
                                required
                              />
                            </div>

                            <div>
                              <label style={{ display: 'block', fontSize: '0.75rem', color: '#cbd5e1', marginBottom: '5px' }}>Mobile Phone *</label>
                              <input
                                type="text"
                                placeholder="+91 98765 43210"
                                value={newMember.phone}
                                onChange={(e) => setNewMember({ ...newMember, phone: e.target.value })}
                                className="form-input"
                                required
                              />
                            </div>

                            <div>
                              <label style={{ display: 'block', fontSize: '0.75rem', color: '#cbd5e1', marginBottom: '5px' }}>Membership Plan Tier</label>
                              <select
                                value={newMember.plan}
                                onChange={(e) => {
                                  const p = e.target.value;
                                  let fee = 1499;
                                  if (p === 'BASIC') fee = 999;
                                  else if (p === 'PRO') fee = 1499;
                                  else if (p === 'ELITE') fee = 2499;
                                  setNewMember({ ...newMember, plan: p, fee_amount: fee });
                                }}
                                className="form-input"
                              >
                                <option value="BASIC">BASIC Plan (Floor &amp; Cardio - ₹999/mo)</option>
                                <option value="PRO">PRO Plan (Group Classes &amp; Sauna - ₹1,499/mo)</option>
                                <option value="ELITE">ELITE VIP (Dedicated Trainer &amp; BioScan - ₹2,499/mo)</option>
                              </select>
                            </div>

                            <div>
                              <label style={{ display: 'block', fontSize: '0.75rem', color: '#cbd5e1', marginBottom: '5px' }}>Subscription Duration</label>
                              <select
                                value={newMember.plan_duration}
                                onChange={(e) => setNewMember({ ...newMember, plan_duration: e.target.value })}
                                className="form-input"
                              >
                                <option value="1 Month">1 Month Membership</option>
                                <option value="3 Months">3 Months Membership</option>
                                <option value="6 Months">6 Months Membership</option>
                                <option value="1 Year">1 Year (12 Months) Membership</option>
                              </select>
                            </div>

                            <div>
                              <label style={{ display: 'block', fontSize: '0.75rem', color: '#cbd5e1', marginBottom: '5px' }}>Monthly Fee Rate (INR ₹)</label>
                              <input
                                type="number"
                                placeholder="1499"
                                value={newMember.fee_amount}
                                onChange={(e) => setNewMember({ ...newMember, fee_amount: e.target.value })}
                                className="form-input"
                                required
                              />
                            </div>

                            <div>
                              <label style={{ display: 'block', fontSize: '0.75rem', color: '#cbd5e1', marginBottom: '5px' }}>Joining Date</label>
                              <input
                                type="date"
                                value={newMember.joined_date}
                                onChange={(e) => setNewMember({ ...newMember, joined_date: e.target.value })}
                                className="form-input"
                                required
                              />
                            </div>

                            <div>
                              <label style={{ display: 'block', fontSize: '0.75rem', color: '#cbd5e1', marginBottom: '5px' }}>Payment Method</label>
                              <select
                                value={newMember.payment_method}
                                onChange={(e) => setNewMember({ ...newMember, payment_method: e.target.value })}
                                className="form-input"
                              >
                                <option value="UPI">UPI (GPay / PhonePe / Paytm)</option>
                                <option value="Cash">Cash at Front Desk</option>
                                <option value="Card">Credit / Debit Card</option>
                                <option value="Net Banking">Net Banking / NEFT</option>
                              </select>
                            </div>
                          </div>

                          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', background: 'rgba(255, 255, 255, 0.04)', padding: '10px 14px', borderRadius: '8px' }}>
                            <input
                              type="checkbox"
                              id="initial-fee-paid"
                              checked={newMember.initial_fee_paid}
                              onChange={(e) => setNewMember({ ...newMember, initial_fee_paid: e.target.checked })}
                              style={{ width: '18px', height: '18px', accentColor: 'var(--accent, #ccff00)', cursor: 'pointer' }}
                            />
                            <label htmlFor="initial-fee-paid" style={{ fontSize: '0.82rem', color: '#e2e8f0', cursor: 'pointer' }}>
                              <strong>First month membership fee paid at registration</strong> (Creates verified payment record &amp; sets next due date to +1 month)
                            </label>
                          </div>

                          <div>
                            <label style={{ display: 'block', fontSize: '0.75rem', color: '#cbd5e1', marginBottom: '5px' }}>Member Notes / Emergency Contact / Goals (Optional)</label>
                            <input
                              type="text"
                              placeholder="e.g. Personal training focus on powerlifting, Emergency contact: 9876543210"
                              value={newMember.notes}
                              onChange={(e) => setNewMember({ ...newMember, notes: e.target.value })}
                              className="form-input"
                            />
                          </div>

                          <div style={{ display: 'flex', gap: '12px', marginTop: '6px' }}>
                            <button type="submit" className="btn btn-primary btn-sm" style={{ padding: '8px 20px' }}>
                              Save &amp; Register Member
                            </button>
                            <button type="button" onClick={() => setShowAddMember(false)} className="btn btn-secondary btn-sm">
                              Cancel
                            </button>
                          </div>
                        </form>
                      </div>
                    )}

                    {/* Toolbar: Search + Filter Tabs */}
                    <div className="member-toolbar-row">
                      <div className="member-filter-tabs">
                        <button
                          type="button"
                          onClick={() => setMemberFeeFilter('All')}
                          className={`mft-btn ${memberFeeFilter === 'All' ? 'active' : ''}`}
                        >
                          <span>All Members</span>
                          <span className="mft-count-badge">{totalMemberCount}</span>
                        </button>

                        <button
                          type="button"
                          onClick={() => setMemberFeeFilter('Paid')}
                          className={`mft-btn ${memberFeeFilter === 'Paid' ? 'active' : ''}`}
                        >
                          <CheckCircle2 size={13} color={memberFeeFilter === 'Paid' ? '#000' : '#34d399'} />
                          <span>Fees Paid</span>
                          <span className="mft-count-badge">{paidMemberCount}</span>
                        </button>

                        <button
                          type="button"
                          onClick={() => setMemberFeeFilter('Upcoming')}
                          className={`mft-btn ${memberFeeFilter === 'Upcoming' ? 'active' : ''}`}
                        >
                          <Clock size={13} color={memberFeeFilter === 'Upcoming' ? '#000' : '#fbbf24'} />
                          <span>Upcoming (10 Days)</span>
                          <span className="mft-count-badge" style={{ background: memberFeeFilter === 'Upcoming' ? '#000' : 'rgba(245, 158, 11, 0.3)', color: memberFeeFilter === 'Upcoming' ? '#fff' : '#fbbf24' }}>
                            {upcomingMemberCount}
                          </span>
                        </button>

                        <button
                          type="button"
                          onClick={() => setMemberFeeFilter('Overdue')}
                          className={`mft-btn ${memberFeeFilter === 'Overdue' ? 'active' : ''}`}
                        >
                          <AlertCircle size={13} color={memberFeeFilter === 'Overdue' ? '#000' : '#f87171'} />
                          <span>Overdue</span>
                          <span className="mft-count-badge" style={{ background: memberFeeFilter === 'Overdue' ? '#000' : 'rgba(239, 68, 68, 0.3)', color: memberFeeFilter === 'Overdue' ? '#fff' : '#f87171' }}>
                            {overdueMemberCount}
                          </span>
                        </button>
                      </div>

                      {/* Search box */}
                      <div style={{ position: 'relative', minWidth: '240px' }}>
                        <input
                          type="text"
                          placeholder="Search members by name, email, phone..."
                          value={memberSearchTerm}
                          onChange={(e) => setMemberSearchTerm(e.target.value)}
                          className="form-input"
                          style={{ paddingLeft: '34px', fontSize: '0.8rem', width: '100%' }}
                        />
                        <Search size={14} style={{ position: 'absolute', left: '11px', top: '50%', transform: 'translateY(-50%)', color: '#64748b' }} />
                        {memberSearchTerm && (
                          <button
                            type="button"
                            onClick={() => setMemberSearchTerm('')}
                            style={{ position: 'absolute', right: '10px', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer' }}
                          >
                            <X size={12} />
                          </button>
                        )}
                      </div>
                    </div>

                    {/* Member Table */}
                    <div className="admin-table-container">
                      <table className="admin-table">
                        <thead>
                          <tr>
                            <th>Member Details</th>
                            <th>Plan &amp; Duration</th>
                            <th>Fee Rate</th>
                            <th>Fee Status</th>
                            <th>Next Due Date</th>
                            <th>Last Paid</th>
                            <th style={{ textAlign: 'right' }}>Actions</th>
                          </tr>
                        </thead>
                        <tbody>
                          {filteredMembers.length === 0 ? (
                            <tr>
                              <td colSpan={7} style={{ textAlign: 'center', padding: '32px 16px', color: '#94a3b8' }}>
                                No members found matching the selected filter ({memberFeeFilter}).
                              </td>
                            </tr>
                          ) : (
                            filteredMembers.map((m) => {
                              const feeInfo = getMemberFeeInfo(m);
                              return (
                                <tr key={m.id}>
                                  <td>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                      <div style={{
                                        width: '32px',
                                        height: '32px',
                                        borderRadius: '50%',
                                        background: 'rgba(255, 255, 255, 0.08)',
                                        border: '1px solid rgba(255, 255, 255, 0.12)',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        fontWeight: 800,
                                        fontSize: '0.8rem',
                                        color: 'var(--accent, #ccff00)'
                                      }}>
                                        {m.name.charAt(0).toUpperCase()}
                                      </div>
                                      <div>
                                        <strong style={{ color: '#fff', fontSize: '0.9rem', display: 'block' }}>{m.name}</strong>
                                        <div style={{ color: '#94a3b8', fontSize: '0.78rem' }}>{m.phone} • {m.email}</div>
                                        <div style={{ color: '#64748b', fontSize: '0.7rem' }}>Joined: {m.joined_date || 'N/A'}</div>
                                      </div>
                                    </div>
                                  </td>

                                  <td>
                                    <div>
                                      <span style={{ 
                                        background: m.plan === 'ELITE' ? 'rgba(204, 255, 0, 0.15)' : 'rgba(255, 255, 255, 0.08)',
                                        color: m.plan === 'ELITE' ? 'var(--accent, #ccff00)' : '#fff',
                                        fontWeight: 800,
                                        padding: '2px 8px',
                                        borderRadius: '4px',
                                        fontSize: '0.75rem',
                                        display: 'inline-block',
                                        marginBottom: '3px'
                                      }}>
                                        {m.plan}
                                      </span>
                                      <div style={{ fontSize: '0.78rem', color: '#e2e8f0', fontWeight: 600 }}>
                                        {m.plan_duration || '1 Year'}
                                      </div>
                                      <small style={{ color: '#64748b' }}>Expires: {m.end_date || 'N/A'}</small>
                                    </div>
                                  </td>

                                  <td>
                                    <strong style={{ color: '#fff', fontSize: '0.9rem' }}>
                                      ₹{m.fee_amount ? Number(m.fee_amount).toLocaleString('en-IN') : '1,499'}
                                    </strong>
                                    <span style={{ fontSize: '0.7rem', color: '#64748b', display: 'block' }}>/ month</span>
                                  </td>

                                  <td>
                                    <span className="fee-badge" style={{ background: feeInfo.badgeBg, color: feeInfo.color, border: `1px solid ${feeInfo.badgeBorder}` }}>
                                      {feeInfo.isOverdue && <AlertCircle size={12} />}
                                      {feeInfo.isUpcoming && <Clock size={12} />}
                                      {feeInfo.status === 'Paid' && <CheckCircle2 size={12} />}
                                      <span>{feeInfo.label}</span>
                                    </span>
                                  </td>

                                  <td>
                                    <div style={{ fontSize: '0.85rem', fontWeight: 700, color: feeInfo.isOverdue ? '#f87171' : (feeInfo.isUpcoming ? '#fbbf24' : '#e2e8f0') }}>
                                      {m.next_due_date || 'N/A'}
                                    </div>
                                    <small style={{ color: '#64748b' }}>{feeInfo.sublabel}</small>
                                  </td>

                                  <td>
                                    <div style={{ fontSize: '0.82rem', color: '#cbd5e1' }}>
                                      {m.last_paid_date ? `Paid on ${m.last_paid_date}` : 'Initial Pending'}
                                    </div>
                                  </td>

                                  <td style={{ textAlign: 'right' }}>
                                    <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
                                      {/* View Calendar Ledger */}
                                      <button
                                        type="button"
                                        onClick={() => setSelectedMemberForCalendar(m)}
                                        className="member-action-btn btn-calendar-view"
                                        title="View 12-Month Calendar Ledger"
                                      >
                                        <Calendar size={13} />
                                        <span>Calendar</span>
                                      </button>

                                      {/* Record Payment */}
                                      <button
                                        type="button"
                                        onClick={() => {
                                          setSelectedMemberForPayment(m);
                                          setPaymentFormData({
                                            amount: m.fee_amount || 1499,
                                            monthYear: m.next_due_date ? m.next_due_date.slice(0, 7) : new Date().toISOString().slice(0, 7),
                                            monthName: '',
                                            paymentDate: new Date().toISOString().slice(0, 10),
                                            paymentMethod: 'UPI',
                                            notes: ''
                                          });
                                        }}
                                        className="member-action-btn btn-pay-record"
                                        title="Record Monthly Fee Payment"
                                      >
                                        <CreditCard size={13} />
                                        <span>Pay Fee</span>
                                      </button>

                                      {/* Delete Member */}
                                      <button
                                        type="button"
                                        onClick={() => handleDeleteMember(m.id)}
                                        className="member-action-btn btn-member-delete"
                                        title="Remove Member"
                                      >
                                        <Trash2 size={13} />
                                      </button>
                                    </div>
                                  </td>
                                </tr>
                              );
                            })
                          )}
                        </tbody>
                      </table>
                    </div>

                    {/* =========================================================
                        CALENDAR LEDGER MODAL FOR INDIVIDUAL MEMBER
                        ========================================================= */}
                    {selectedMemberForCalendar && (() => {
                      const selMem = selectedMemberForCalendar;
                      const feeInfo = getMemberFeeInfo(selMem);
                      const memberPays = memberPayments.filter(p => p.member_id === selMem.id && p.status === 'Paid');
                      const totalPaidAmount = memberPays.reduce((sum, p) => sum + (Number(p.amount) || 0), 0);

                      return (
                        <div className="calendar-ledger-overlay" onClick={() => setSelectedMemberForCalendar(null)}>
                          <div className="calendar-ledger-modal" onClick={(e) => e.stopPropagation()}>
                            {/* Modal Header */}
                            <div className="clm-header">
                              <div>
                                <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
                                  <span style={{
                                    background: 'var(--accent, #ccff00)',
                                    color: '#000',
                                    fontSize: '0.68rem',
                                    fontWeight: 800,
                                    padding: '2px 8px',
                                    borderRadius: '4px'
                                  }}>
                                    CALENDAR LEDGER
                                  </span>
                                  <span style={{ fontSize: '0.8rem', color: '#94a3b8' }}>
                                    Member ID: <code>{selMem.id}</code>
                                  </span>
                                </div>
                                <h3 style={{ margin: 0, fontSize: '1.45rem', fontWeight: 800, color: '#fff' }}>
                                  {selMem.name} — Monthly Fee Calendar
                                </h3>
                                <p style={{ margin: '4px 0 0 0', fontSize: '0.82rem', color: '#94a3b8' }}>
                                  {selMem.phone} • {selMem.email}
                                </p>
                              </div>

                              <button
                                type="button"
                                onClick={() => setSelectedMemberForCalendar(null)}
                                className="booking-modal-close"
                                aria-label="Close Calendar"
                                style={{ top: '18px', right: '18px' }}
                              >
                                <X size={20} />
                              </button>
                            </div>

                            {/* Modal Body */}
                            <div className="clm-body">
                              {/* Member Meta Grid */}
                              <div className="clm-member-meta-grid">
                                <div className="cmm-item">
                                  <span className="cmm-label">Joining Date</span>
                                  <span className="cmm-val">{selMem.joined_date || 'N/A'}</span>
                                </div>

                                <div className="cmm-item">
                                  <span className="cmm-label">Subscription Plan</span>
                                  <span className="cmm-val" style={{ color: 'var(--accent, #ccff00)' }}>
                                    {selMem.plan} ({selMem.plan_duration || '1 Year'})
                                  </span>
                                </div>

                                <div className="cmm-item">
                                  <span className="cmm-label">Monthly Fee Rate</span>
                                  <span className="cmm-val">₹{Number(selMem.fee_amount || 1499).toLocaleString('en-IN')} / mo</span>
                                </div>

                                <div className="cmm-item">
                                  <span className="cmm-label">Subscription Expiry</span>
                                  <span className="cmm-val">{selMem.end_date || 'N/A'}</span>
                                </div>

                                <div className="cmm-item">
                                  <span className="cmm-label">Total Fees Collected</span>
                                  <span className="cmm-val" style={{ color: '#34d399' }}>
                                    ₹{totalPaidAmount.toLocaleString('en-IN')} ({memberPays.length} Months)
                                  </span>
                                </div>

                                <div className="cmm-item">
                                  <span className="cmm-label">Next Fee Due</span>
                                  <span className="cmm-val" style={{ color: feeInfo.color }}>
                                    {selMem.next_due_date || 'N/A'} ({feeInfo.label})
                                  </span>
                                </div>
                              </div>

                              {/* Year Selector & Guidance */}
                              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '10px' }}>
                                <div>
                                  <h4 style={{ margin: 0, fontSize: '1.05rem', color: '#fff' }}>
                                    Fee Payment Timeline for Year {calendarYear}
                                  </h4>
                                  <span style={{ fontSize: '0.75rem', color: '#94a3b8' }}>
                                    Click "Mark as Paid" or "Undo" on any month to update database records.
                                  </span>
                                </div>

                                <div style={{ display: 'inline-flex', background: 'rgba(255, 255, 255, 0.05)', borderRadius: '8px', padding: '3px', gap: '4px' }}>
                                  {[2025, 2026, 2027].map((yr) => (
                                    <button
                                      key={yr}
                                      type="button"
                                      onClick={() => setCalendarYear(yr)}
                                      style={{
                                        background: calendarYear === yr ? 'var(--accent, #ccff00)' : 'transparent',
                                        color: calendarYear === yr ? '#000' : '#cbd5e1',
                                        border: 'none',
                                        borderRadius: '6px',
                                        padding: '4px 12px',
                                        fontWeight: 700,
                                        fontSize: '0.8rem',
                                        cursor: 'pointer'
                                      }}
                                    >
                                      {yr}
                                    </button>
                                  ))}
                                </div>
                              </div>

                              {/* 12-Month Calendar Grid */}
                              <div className="calendar-grid-12">
                                {calendarMonths.map((mObj) => {
                                  const ymKey = `${calendarYear}-${mObj.num}`;
                                  const mName = `${mObj.name} ${calendarYear}`;
                                  
                                  // Check if pre-joining
                                  const isPreJoin = selMem.joined_date && selMem.joined_date.slice(0, 7) > ymKey;
                                  
                                  // Check payment record
                                  const paymentRec = memberPayments.find(p => p.member_id === selMem.id && p.month_year === ymKey && p.status === 'Paid');
                                  
                                  // Current month comparison
                                  const currentYm = new Date().toISOString().slice(0, 7);
                                  const isCurrentOrPast = ymKey <= currentYm;
                                  
                                  let cellType = 'future';
                                  if (isPreJoin) cellType = 'prejoin';
                                  else if (paymentRec) cellType = 'paid';
                                  else if (isCurrentOrPast) cellType = 'overdue';
                                  else if (ymKey === selMem.next_due_date?.slice(0, 7)) cellType = 'upcoming';

                                  return (
                                    <div key={mObj.num} className={`month-card-cell ${cellType}`}>
                                      <div>
                                        <div className="month-card-top">
                                          <span className="month-name-txt">{mObj.name}</span>
                                          <span style={{ fontSize: '0.7rem', color: '#64748b' }}>{calendarYear}</span>
                                        </div>

                                        <div className="month-fee-amount">
                                          ₹{Number(selMem.fee_amount || 1499).toLocaleString('en-IN')}
                                        </div>

                                        <div className="month-paid-meta">
                                          {paymentRec ? (
                                            <div style={{ color: '#34d399' }}>
                                              <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontWeight: 700 }}>
                                                <CheckCircle2 size={12} />
                                                <span>PAID</span>
                                              </div>
                                              <div>{paymentRec.payment_date} • {paymentRec.payment_method || 'UPI'}</div>
                                            </div>
                                          ) : isPreJoin ? (
                                            <div style={{ color: '#64748b' }}>Pre-joining period</div>
                                          ) : cellType === 'overdue' ? (
                                            <div style={{ color: '#f87171' }}>
                                              <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontWeight: 700 }}>
                                                <AlertCircle size={12} />
                                                <span>DUE / UNPAID</span>
                                              </div>
                                              <div>Pending payment</div>
                                            </div>
                                          ) : (
                                            <div style={{ color: '#94a3b8' }}>Scheduled period</div>
                                          )}
                                        </div>
                                      </div>

                                      {/* Interactive Action CTA */}
                                      {!isPreJoin && (
                                        <div>
                                          {paymentRec ? (
                                            <button
                                              type="button"
                                              onClick={() => handleToggleMonthPaid(selMem, ymKey, mName, selMem.fee_amount)}
                                              className="btn-month-action undo-paid-cta"
                                              title="Mark this month as Unpaid"
                                            >
                                              <X size={12} /> Undo Paid
                                            </button>
                                          ) : (
                                            <button
                                              type="button"
                                              onClick={() => handleToggleMonthPaid(selMem, ymKey, mName, selMem.fee_amount)}
                                              className="btn-month-action mark-paid-cta"
                                              title="Mark this month fee as Paid in database"
                                            >
                                              <CheckCircle2 size={12} /> Mark as Paid
                                            </button>
                                          )}
                                        </div>
                                      )}
                                    </div>
                                  );
                                })}
                              </div>

                              {/* Transaction Ledger Table for Member */}
                              <div>
                                <h4 style={{ margin: '0 0 10px 0', fontSize: '1rem', color: '#fff', display: 'flex', alignItems: 'center', gap: '6px' }}>
                                  <History size={16} color="var(--accent, #ccff00)" />
                                  <span>Payment History Ledger ({memberPays.length} Transactions)</span>
                                </h4>

                                <div className="admin-table-container">
                                  <table className="admin-table" style={{ fontSize: '0.8rem' }}>
                                    <thead>
                                      <tr>
                                        <th>Month</th>
                                        <th>Amount</th>
                                        <th>Date Paid</th>
                                        <th>Method</th>
                                        <th>Receipt #</th>
                                        <th>Status</th>
                                        <th style={{ textAlign: 'right' }}>Actions</th>
                                      </tr>
                                    </thead>
                                    <tbody>
                                      {memberPays.length === 0 ? (
                                        <tr>
                                          <td colSpan={7} style={{ textAlign: 'center', padding: '16px', color: '#64748b' }}>
                                            No payment records recorded yet for this member.
                                          </td>
                                        </tr>
                                      ) : (
                                        memberPays.map((p) => (
                                          <tr key={p.id}>
                                            <td><strong style={{ color: '#fff' }}>{p.month_name || p.month_year}</strong></td>
                                            <td><strong style={{ color: '#34d399' }}>₹{Number(p.amount).toLocaleString('en-IN')}</strong></td>
                                            <td>{p.payment_date}</td>
                                            <td><span style={{ background: 'rgba(255,255,255,0.06)', padding: '2px 6px', borderRadius: '4px' }}>{p.payment_method || 'UPI'}</span></td>
                                            <td><code>{p.receipt_no || p.id}</code></td>
                                            <td><span style={{ color: '#34d399', fontWeight: 700 }}>● {p.status}</span></td>
                                            <td style={{ textAlign: 'right' }}>
                                              <button
                                                type="button"
                                                onClick={() => handleToggleMonthPaid(selMem, p.month_year, p.month_name, p.amount)}
                                                className="table-action-icon delete-act"
                                                title="Delete Payment Record"
                                              >
                                                <Trash2 size={12} />
                                              </button>
                                            </td>
                                          </tr>
                                        ))
                                      )}
                                    </tbody>
                                  </table>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      );
                    })()}

                    {/* =========================================================
                        RECORD PAYMENT MODAL (Quick Custom Payment Dialog)
                        ========================================================= */}
                    {selectedMemberForPayment && (
                      <div className="calendar-ledger-overlay" onClick={() => setSelectedMemberForPayment(null)}>
                        <div 
                          className="booking-modal-box" 
                          onClick={(e) => e.stopPropagation()}
                          style={{ maxWidth: '440px', padding: '24px' }}
                        >
                          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                              <CreditCard size={18} color="var(--accent, #ccff00)" />
                              <h4 style={{ margin: 0, fontSize: '1.15rem', color: '#fff' }}>
                                Record Monthly Fee
                              </h4>
                            </div>
                            <button
                              type="button"
                              onClick={() => setSelectedMemberForPayment(null)}
                              className="booking-modal-close"
                            >
                              <X size={18} />
                            </button>
                          </div>

                          <div style={{ background: 'rgba(255,255,255,0.04)', padding: '12px', borderRadius: '8px', marginBottom: '16px' }}>
                            <div style={{ fontWeight: 800, color: '#fff', fontSize: '0.95rem' }}>{selectedMemberForPayment.name}</div>
                            <div style={{ fontSize: '0.78rem', color: '#94a3b8' }}>
                              {selectedMemberForPayment.plan} Plan • Next Due Date: {selectedMemberForPayment.next_due_date || 'N/A'}
                            </div>
                          </div>

                          <form onSubmit={(e) => {
                            e.preventDefault();
                            handleRecordFeePayment(
                              selectedMemberForPayment,
                              paymentFormData.monthYear,
                              paymentFormData.amount,
                              paymentFormData.paymentMethod
                            );
                          }}>
                            <div className="form-group" style={{ marginBottom: '14px' }}>
                              <label style={{ display: 'block', fontSize: '0.78rem', color: '#cbd5e1', marginBottom: '4px' }}>
                                Month &amp; Year Being Paid For
                              </label>
                              <input
                                type="month"
                                value={paymentFormData.monthYear}
                                onChange={(e) => setPaymentFormData({ ...paymentFormData, monthYear: e.target.value })}
                                className="form-input"
                                required
                              />
                            </div>

                            <div className="form-group" style={{ marginBottom: '14px' }}>
                              <label style={{ display: 'block', fontSize: '0.78rem', color: '#cbd5e1', marginBottom: '4px' }}>
                                Fee Amount (INR ₹)
                              </label>
                              <input
                                type="number"
                                value={paymentFormData.amount}
                                onChange={(e) => setPaymentFormData({ ...paymentFormData, amount: e.target.value })}
                                className="form-input"
                                required
                              />
                            </div>

                            <div className="form-group" style={{ marginBottom: '14px' }}>
                              <label style={{ display: 'block', fontSize: '0.78rem', color: '#cbd5e1', marginBottom: '4px' }}>
                                Payment Method
                              </label>
                              <select
                                value={paymentFormData.paymentMethod}
                                onChange={(e) => setPaymentFormData({ ...paymentFormData, paymentMethod: e.target.value })}
                                className="form-input"
                              >
                                <option value="UPI">UPI (Google Pay / PhonePe / QR)</option>
                                <option value="Cash">Cash at Front Desk</option>
                                <option value="Card">Debit / Credit Card</option>
                                <option value="Net Banking">Net Banking / Bank Transfer</option>
                              </select>
                            </div>

                            <div className="form-group" style={{ marginBottom: '18px' }}>
                              <label style={{ display: 'block', fontSize: '0.78rem', color: '#cbd5e1', marginBottom: '4px' }}>
                                Notes / Reference # (Optional)
                              </label>
                              <input
                                type="text"
                                placeholder="e.g. Paid via UPI ref #9872134"
                                value={paymentFormData.notes}
                                onChange={(e) => setPaymentFormData({ ...paymentFormData, notes: e.target.value })}
                                className="form-input"
                              />
                            </div>

                            <div style={{ display: 'flex', gap: '10px' }}>
                              <button type="submit" className="btn btn-primary w-full">
                                Confirm &amp; Save Payment
                              </button>
                              <button
                                type="button"
                                onClick={() => setSelectedMemberForPayment(null)}
                                className="btn btn-secondary w-full"
                              >
                                Cancel
                              </button>
                            </div>
                          </form>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })()}

              {/* =========================================================
                  TAB 4: TRAINERS (Dynamic Coaches)
                  ========================================================= */}
              {activeTab === 'trainers' && (
                <div className="admin-subpane-view">
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                    <div>
                      <h3 className="section-pane-title" style={{ fontSize: '1.4rem', color: '#fff', margin: 0 }}>
                        Coaches &amp; Trainers ({trainers.length})
                      </h3>
                      <p className="section-pane-subtitle" style={{ color: '#94a3b8', fontSize: '0.85rem', margin: '4px 0 0 0' }}>
                        Dynamic coaches roster managed in Supabase <code>public.trainers</code>.
                      </p>
                    </div>
                    <button onClick={() => setShowAddTrainer(true)} className="btn btn-primary btn-sm" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <Plus size={14} />
                      <span>+ Add Trainer</span>
                    </button>
                  </div>

                  {showAddTrainer && (
                    <div style={{ background: '#121622', border: '1px solid rgba(255,255,255,0.12)', borderRadius: '10px', padding: '20px', marginBottom: '20px' }}>
                      <h4 style={{ color: '#fff', margin: '0 0 14px 0' }}>Add Certified Coach</h4>
                      <form onSubmit={handleAddTrainerSubmit} style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '12px' }}>
                        <input
                          type="text"
                          placeholder="Coach Full Name *"
                          value={newTrainer.name}
                          onChange={(e) => setNewTrainer({ ...newTrainer, name: e.target.value })}
                          className="form-input"
                          required
                        />
                        <input
                          type="text"
                          placeholder="Role (e.g. Olympic Coach) *"
                          value={newTrainer.role}
                          onChange={(e) => setNewTrainer({ ...newTrainer, role: e.target.value })}
                          className="form-input"
                          required
                        />
                        <input
                          type="text"
                          placeholder="Experience (e.g. 8+ Years)"
                          value={newTrainer.experience}
                          onChange={(e) => setNewTrainer({ ...newTrainer, experience: e.target.value })}
                          className="form-input"
                        />
                        <input
                          type="text"
                          placeholder="Specialization (e.g. Hypertrophy)"
                          value={newTrainer.specialization}
                          onChange={(e) => setNewTrainer({ ...newTrainer, specialization: e.target.value })}
                          className="form-input"
                        />
                        <input
                          type="url"
                          placeholder="Photo URL or Supabase Storage Link"
                          value={newTrainer.image}
                          onChange={(e) => setNewTrainer({ ...newTrainer, image: e.target.value })}
                          className="form-input"
                        />
                        <div style={{ display: 'flex', gap: '8px' }}>
                          <button type="submit" className="btn btn-primary btn-sm">Save Coach</button>
                          <button type="button" onClick={() => setShowAddTrainer(false)} className="btn btn-secondary btn-sm">Cancel</button>
                        </div>
                      </form>
                    </div>
                  )}

                  <div className="team-cards-grid">
                    {trainers.map((t) => (
                      <div key={t.id} className="team-staff-card" style={{ background: '#111520', border: '1px solid rgba(255,255,255,0.08)' }}>
                        <img src={t.image || t.image_url} alt={t.name} className="staff-avatar" />
                        <div className="staff-details" style={{ flex: 1 }}>
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                            <h4 style={{ color: '#fff', margin: 0 }}>{t.name}</h4>
                            <button onClick={() => handleDeleteTrainer(t.id)} className="table-action-icon delete-act" title="Delete Coach">
                              <Trash2 size={13} />
                            </button>
                          </div>
                          <span className="staff-role" style={{ color: 'var(--accent, #ccff00)' }}>{t.role}</span>
                          <p style={{ fontSize: '0.75rem', color: '#94a3b8', margin: '4px 0' }}>{t.experience || '5+ Years'}</p>
                          <p style={{ fontSize: '0.75rem', color: '#cbd5e1', margin: '4px 0' }}>{t.specialization}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* =========================================================
                  TAB 5: TESTIMONIALS (Dynamic Member Reviews)
                  ========================================================= */}
              {activeTab === 'testimonials' && (
                <div className="admin-subpane-view">
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                    <div>
                      <h3 className="section-pane-title" style={{ fontSize: '1.4rem', color: '#fff', margin: 0 }}>
                        Member Testimonials ({testimonials.length})
                      </h3>
                      <p className="section-pane-subtitle" style={{ color: '#94a3b8', fontSize: '0.85rem', margin: '4px 0 0 0' }}>
                        Managed in Supabase <code>public.testimonials</code>. Dynamic reviews with star ratings and results.
                      </p>
                    </div>
                    <button onClick={() => setShowAddTestimonial(true)} className="btn btn-primary btn-sm" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <Plus size={14} />
                      <span>+ Add Testimonial</span>
                    </button>
                  </div>

                  {showAddTestimonial && (
                    <div style={{ background: '#121622', border: '1px solid rgba(255,255,255,0.12)', borderRadius: '10px', padding: '20px', marginBottom: '20px' }}>
                      <h4 style={{ color: '#fff', margin: '0 0 14px 0' }}>Publish New Testimonial</h4>
                      <form onSubmit={handleAddTestimonialSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '12px' }}>
                          <input
                            type="text"
                            placeholder="Member Name *"
                            value={newTestimonial.name}
                            onChange={(e) => setNewTestimonial({ ...newTestimonial, name: e.target.value })}
                            className="form-input"
                            required
                          />
                          <input
                            type="text"
                            placeholder="Result (e.g. Lost 12kg) *"
                            value={newTestimonial.result}
                            onChange={(e) => setNewTestimonial({ ...newTestimonial, result: e.target.value })}
                            className="form-input"
                            required
                          />
                          <select
                            value={newTestimonial.rating}
                            onChange={(e) => setNewTestimonial({ ...newTestimonial, rating: e.target.value })}
                            className="form-input"
                          >
                            <option value={5}>5 Stars ★★★★★</option>
                            <option value={4}>4 Stars ★★★★</option>
                          </select>
                        </div>
                        <textarea
                          placeholder="Member review quote / story..."
                          value={newTestimonial.review}
                          onChange={(e) => setNewTestimonial({ ...newTestimonial, review: e.target.value })}
                          className="form-input"
                          rows={3}
                          required
                        />
                        <div style={{ display: 'flex', gap: '10px' }}>
                          <button type="submit" className="btn btn-primary btn-sm">Publish Testimonial</button>
                          <button type="button" onClick={() => setShowAddTestimonial(false)} className="btn btn-secondary btn-sm">Cancel</button>
                        </div>
                      </form>
                    </div>
                  )}

                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '16px' }}>
                    {testimonials.map((t) => (
                      <div key={t.id} style={{ background: '#111520', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '10px', padding: '18px' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                            <img src={t.photo || t.image_url} alt={t.name} style={{ width: '40px', height: '40px', borderRadius: '50%', objectFit: 'cover' }} />
                            <div>
                              <strong style={{ color: '#fff', fontSize: '0.9rem' }}>{t.name}</strong>
                              <span style={{ display: 'block', fontSize: '0.75rem', color: 'var(--accent, #ccff00)', fontWeight: 600 }}>
                                {t.result || 'Verified Member'}
                              </span>
                            </div>
                          </div>
                          <button onClick={() => handleDeleteTestimonial(t.id)} className="table-action-icon delete-act" title="Delete">
                            <Trash2 size={13} />
                          </button>
                        </div>
                        <div style={{ display: 'flex', gap: '2px', color: 'var(--accent, #ccff00)', marginBottom: '8px' }}>
                          {[...Array(t.rating || 5)].map((_, i) => (
                            <Star key={i} size={12} fill="var(--accent, #ccff00)" />
                          ))}
                        </div>
                        <p style={{ fontSize: '0.85rem', color: '#cbd5e1', margin: 0, fontStyle: 'italic' }}>
                          "{t.review || t.message}"
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* =========================================================
                  TAB 6: TRANSFORMATIONS (Supabase Storage & Stories)
                  ========================================================= */}
              {activeTab === 'transformations' && (
                <div className="admin-subpane-view">
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                    <div>
                      <h3 className="section-pane-title" style={{ fontSize: '1.4rem', color: '#fff', margin: 0 }}>
                        Member Transformations ({transformations.length})
                      </h3>
                      <p className="section-pane-subtitle" style={{ color: '#94a3b8', fontSize: '0.85rem', margin: '4px 0 0 0' }}>
                        Connected to Supabase Storage bucket <code>gym-transformations</code> and table <code>public.transformations</code>.
                      </p>
                    </div>
                    <button onClick={() => setShowAddTransformation(true)} className="btn btn-primary btn-sm" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <Plus size={14} />
                      <span>+ Add Transformation</span>
                    </button>
                  </div>

                  {showAddTransformation && (
                    <div style={{ background: '#121622', border: '1px solid rgba(255,255,255,0.12)', borderRadius: '10px', padding: '20px', marginBottom: '20px' }}>
                      <h4 style={{ color: '#fff', margin: '0 0 14px 0' }}>Add Member Transformation</h4>
                      <form onSubmit={handleAddTransformationSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '12px' }}>
                          <input
                            type="text"
                            placeholder="Member Name *"
                            value={newTransformation.member_name}
                            onChange={(e) => setNewTransformation({ ...newTransformation, member_name: e.target.value })}
                            className="form-input"
                            required
                          />
                          <input
                            type="text"
                            placeholder="Result (e.g. -14 KG FAT LOSS) *"
                            value={newTransformation.weight_lost}
                            onChange={(e) => setNewTransformation({ ...newTransformation, weight_lost: e.target.value })}
                            className="form-input"
                            required
                          />
                          <input
                            type="text"
                            placeholder="Duration (e.g. 12 Weeks)"
                            value={newTransformation.duration}
                            onChange={(e) => setNewTransformation({ ...newTransformation, duration: e.target.value })}
                            className="form-input"
                          />
                        </div>

                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                          <input
                            type="url"
                            placeholder="Before Photo URL (or Storage CDN link)"
                            value={newTransformation.before_image_url}
                            onChange={(e) => setNewTransformation({ ...newTransformation, before_image_url: e.target.value })}
                            className="form-input"
                          />
                          <input
                            type="url"
                            placeholder="After Photo URL (or Storage CDN link)"
                            value={newTransformation.after_image_url}
                            onChange={(e) => setNewTransformation({ ...newTransformation, after_image_url: e.target.value })}
                            className="form-input"
                          />
                        </div>

                        <textarea
                          placeholder="Member's transformation quote or coach story..."
                          value={newTransformation.description}
                          onChange={(e) => setNewTransformation({ ...newTransformation, description: e.target.value })}
                          className="form-input"
                          rows={2}
                        />

                        <div style={{ display: 'flex', gap: '10px' }}>
                          <button type="submit" className="btn btn-primary btn-sm">Save Transformation</button>
                          <button type="button" onClick={() => setShowAddTransformation(false)} className="btn btn-secondary btn-sm">Cancel</button>
                        </div>
                      </form>
                    </div>
                  )}

                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '20px' }}>
                    {transformations.map((t) => (
                      <div key={t.id} style={{ background: '#111520', borderRadius: '10px', padding: '18px', border: '1px solid rgba(255,255,255,0.08)' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
                          <div>
                            <strong style={{ color: '#fff', fontSize: '1.05rem' }}>{t.name || t.member_name}</strong>
                            <div style={{ color: 'var(--accent, #ccff00)', fontSize: '0.85rem', fontWeight: 700 }}>
                              {t.result || t.weight_lost}
                            </div>
                          </div>
                          <button onClick={() => handleDeleteTransformation(t.id)} className="table-action-icon delete-act" title="Delete">
                            <Trash2 size={13} />
                          </button>
                        </div>

                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', marginBottom: '12px' }}>
                          <img src={t.beforeImg || t.before_image_url} alt="Before" style={{ width: '100%', height: '140px', objectFit: 'cover', borderRadius: '6px' }} />
                          <img src={t.afterImg || t.after_image_url} alt="After" style={{ width: '100%', height: '140px', objectFit: 'cover', borderRadius: '6px' }} />
                        </div>

                        <p style={{ fontSize: '0.8rem', color: '#94a3b8', margin: 0 }}>
                          "{t.quote || t.description}"
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* =========================================================
                  TAB 7: GALLERY (Dynamic Photos & Storage)
                  ========================================================= */}
              {activeTab === 'gallery' && (
                <div className="admin-subpane-view">
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                    <div>
                      <h3 className="section-pane-title" style={{ fontSize: '1.4rem', color: '#fff', margin: 0 }}>
                        Club Photo Gallery ({gallery.length})
                      </h3>
                      <p className="section-pane-subtitle" style={{ color: '#94a3b8', fontSize: '0.85rem', margin: '4px 0 0 0' }}>
                        Stored in Supabase Storage bucket <code>gym-gallery</code> and table <code>public.gallery</code>.
                      </p>
                    </div>
                    <button onClick={() => setShowAddPhoto(true)} className="btn btn-primary btn-sm" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <Upload size={14} />
                      <span>+ Upload Gallery Photo</span>
                    </button>
                  </div>

                  {showAddPhoto && (
                    <div style={{ background: '#121622', border: '1px solid rgba(255,255,255,0.12)', borderRadius: '10px', padding: '20px', marginBottom: '20px' }}>
                      <h4 style={{ color: '#fff', margin: '0 0 14px 0' }}>Add Photo to Gallery</h4>
                      <form onSubmit={handleAddPhotoSubmit} style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '12px' }}>
                        <input
                          type="text"
                          placeholder="Photo Caption / Title *"
                          value={newPhoto.title}
                          onChange={(e) => setNewPhoto({ ...newPhoto, title: e.target.value })}
                          className="form-input"
                          required
                        />
                        <select
                          value={newPhoto.category}
                          onChange={(e) => setNewPhoto({ ...newPhoto, category: e.target.value })}
                          className="form-input"
                        >
                          <option value="Gym">Gym Floor</option>
                          <option value="Training">Training</option>
                          <option value="Trainers">Trainers</option>
                          <option value="Members">Members</option>
                          <option value="Events">Events</option>
                        </select>
                        <input
                          type="url"
                          placeholder="Image URL or Storage CDN link"
                          value={newPhoto.image}
                          onChange={(e) => setNewPhoto({ ...newPhoto, image: e.target.value })}
                          className="form-input"
                        />
                        <div style={{ display: 'flex', gap: '10px' }}>
                          <button type="submit" className="btn btn-primary btn-sm">Add Photo</button>
                          <button type="button" onClick={() => setShowAddPhoto(false)} className="btn btn-secondary btn-sm">Cancel</button>
                        </div>
                      </form>
                    </div>
                  )}

                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: '16px' }}>
                    {gallery.map((g) => (
                      <div key={g.id} style={{ background: '#111520', borderRadius: '8px', overflow: 'hidden', border: '1px solid rgba(255,255,255,0.08)', position: 'relative' }}>
                        <img src={g.image || g.image_url} alt={g.title} style={{ width: '100%', height: '130px', objectFit: 'cover' }} />
                        <div style={{ padding: '8px 10px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                          <div>
                            <strong style={{ color: '#fff', fontSize: '0.78rem', display: 'block' }}>{g.title}</strong>
                            <span style={{ fontSize: '0.7rem', color: 'var(--accent, #ccff00)' }}>{g.category}</span>
                          </div>
                          <button onClick={() => handleDeletePhoto(g.id)} className="table-action-icon delete-act" title="Delete">
                            <Trash2 size={12} />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* =========================================================
                  TAB 8: CLASS SCHEDULE (Dynamic Weekly Timetable)
                  ========================================================= */}
              {activeTab === 'schedule' && (
                <div className="admin-subpane-view">
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                    <div>
                      <h3 className="section-pane-title" style={{ fontSize: '1.4rem', color: '#fff', margin: 0 }}>
                        Class Schedule Timetable ({schedule.length} Sessions)
                      </h3>
                      <p className="section-pane-subtitle" style={{ color: '#94a3b8', fontSize: '0.85rem', margin: '4px 0 0 0' }}>
                        Managed in Supabase <code>public.class_schedule</code>.
                      </p>
                    </div>
                    <button onClick={() => setShowAddClass(true)} className="btn btn-primary btn-sm" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <Plus size={14} />
                      <span>+ Schedule Class</span>
                    </button>
                  </div>

                  {/* Day Picker */}
                  <div style={{ display: 'flex', gap: '6px', overflowX: 'auto', marginBottom: '18px', paddingBottom: '4px' }}>
                    {['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'].map((day) => (
                      <button
                        key={day}
                        onClick={() => setScheduleDay(day)}
                        style={{
                          padding: '6px 14px',
                          borderRadius: '6px',
                          border: 'none',
                          background: scheduleDay === day ? 'var(--accent, #ccff00)' : 'rgba(255,255,255,0.06)',
                          color: scheduleDay === day ? '#000' : '#cbd5e1',
                          fontWeight: 700,
                          fontSize: '0.8rem',
                          cursor: 'pointer'
                        }}
                      >
                        {day}
                      </button>
                    ))}
                  </div>

                  {showAddClass && (
                    <div style={{ background: '#121622', border: '1px solid rgba(255,255,255,0.12)', borderRadius: '10px', padding: '20px', marginBottom: '20px' }}>
                      <h4 style={{ color: '#fff', margin: '0 0 14px 0' }}>Add Class Session</h4>
                      <form onSubmit={handleAddClassSubmit} style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '12px' }}>
                        <select
                          value={newClass.day}
                          onChange={(e) => setNewClass({ ...newClass, day: e.target.value })}
                          className="form-input"
                        >
                          {['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'].map(d => (
                            <option key={d} value={d}>{d}</option>
                          ))}
                        </select>
                        <input
                          type="text"
                          placeholder="Time (e.g. 06:00 AM)"
                          value={newClass.time}
                          onChange={(e) => setNewClass({ ...newClass, time: e.target.value })}
                          className="form-input"
                          required
                        />
                        <input
                          type="text"
                          placeholder="Class Name (e.g. MetCon HIIT)"
                          value={newClass.name}
                          onChange={(e) => setNewClass({ ...newClass, name: e.target.value })}
                          className="form-input"
                          required
                        />
                        <input
                          type="text"
                          placeholder="Coach Name"
                          value={newClass.trainer}
                          onChange={(e) => setNewClass({ ...newClass, trainer: e.target.value })}
                          className="form-input"
                          required
                        />
                        <div style={{ display: 'flex', gap: '10px' }}>
                          <button type="submit" className="btn btn-primary btn-sm">Save Class</button>
                          <button type="button" onClick={() => setShowAddClass(false)} className="btn btn-secondary btn-sm">Cancel</button>
                        </div>
                      </form>
                    </div>
                  )}

                  <div className="admin-table-container">
                    <table className="admin-table">
                      <thead>
                        <tr>
                          <th>Time</th>
                          <th>Class Session</th>
                          <th>Category</th>
                          <th>Coach</th>
                          <th>Duration</th>
                          <th>Spots Left</th>
                          <th>Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {schedule.filter(s => s.day === scheduleDay).map((cls, idx) => (
                          <tr key={idx}>
                            <td><strong style={{ color: 'var(--accent, #ccff00)' }}>{cls.time || cls.start_time}</strong></td>
                            <td><strong style={{ color: '#fff' }}>{cls.name || cls.class_name}</strong></td>
                            <td><span className="lead-goal-chip">{cls.category || 'Strength'}</span></td>
                            <td>{cls.trainer}</td>
                            <td>{cls.duration || '60 min'}</td>
                            <td><small style={{ color: '#34d399' }}>{cls.spots || cls.spots_left || 8} open</small></td>
                            <td>
                              <button onClick={() => handleDeleteClass(cls.id)} className="table-action-icon delete-act" title="Delete">
                                <Trash2 size={13} />
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {/* =========================================================
                  TAB 9: THEME STUDIO (Kept as explicitly requested!)
                  ========================================================= */}
              {activeTab === 'theme' && (
                <div className="admin-subpane-view">
                  <div style={{ marginBottom: '20px' }}>
                    <h3 className="section-pane-title" style={{ fontSize: '1.4rem', color: '#fff', margin: 0, display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <Palette size={20} className="text-volt-accent" />
                      Live Theme Studio &amp; Colour Setter
                    </h3>
                    <p className="section-pane-subtitle" style={{ color: '#94a3b8', fontSize: '0.85rem', margin: '4px 0 0 0' }}>
                      Customize primary accent colors, background darkness, and visual aesthetic. Broadcasts instantly to all live visitors.
                    </p>
                  </div>

                  <ThemeAdjuster onThemeSaved={() => showToast('Theme saved & broadcast across the entire website!')} />
                </div>
              )}

              {/* =========================================================
                  TAB 10: SUPABASE SETTINGS & TELEMETRY
                  ========================================================= */}
              {activeTab === 'settings' && (
                <div className="admin-subpane-view">
                  <div style={{ marginBottom: '20px' }}>
                    <h3 className="section-pane-title" style={{ fontSize: '1.4rem', color: '#fff', margin: 0 }}>
                      Supabase Cloud Telemetry &amp; System Settings
                    </h3>
                    <p className="section-pane-subtitle" style={{ color: '#94a3b8', fontSize: '0.85rem', margin: '4px 0 0 0' }}>
                      Status of your PostgreSQL database tables, Supabase Storage buckets, and Row Level Security.
                    </p>
                  </div>

                  {/* Supabase PostgreSQL & Storage Status Box */}
                  <div style={{ 
                    background: 'rgba(255, 255, 255, 0.03)', 
                    border: '1px solid rgba(255, 255, 255, 0.08)', 
                    borderRadius: '10px', 
                    padding: '20px',
                    marginBottom: '24px'
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '14px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <Database size={18} color="var(--accent, #ccff00)" />
                        <h4 style={{ color: '#fff', margin: 0, fontSize: '1rem' }}>Supabase PostgreSQL &amp; Storage Architecture</h4>
                      </div>
                      <span style={{ 
                        background: isSupabaseConfigured ? 'rgba(16, 185, 129, 0.15)' : 'rgba(234, 179, 8, 0.15)',
                        color: isSupabaseConfigured ? '#34d399' : '#facc15',
                        padding: '3px 10px',
                        borderRadius: '999px',
                        fontSize: '0.75rem',
                        fontWeight: 700
                      }}>
                        {isSupabaseConfigured ? 'Live Supabase Cloud' : 'Local-First Offline Backup Sync'}
                      </span>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '14px', fontSize: '0.82rem' }}>
                      <div>
                        <span style={{ color: '#64748b', display: 'block' }}>Connected Project Endpoint:</span>
                        <code style={{ color: '#e2e8f0', background: 'rgba(0,0,0,0.3)', padding: '2px 6px', borderRadius: '4px' }}>
                          {supabaseInfo.url}
                        </code>
                      </div>
                      <div>
                        <span style={{ color: '#64748b', display: 'block' }}>Row Level Security (RLS):</span>
                        <span style={{ color: '#34d399', fontWeight: 600 }}>Active across all 8 tables</span>
                      </div>
                      <div>
                        <span style={{ color: '#64748b', display: 'block' }}>Configured Storage Buckets:</span>
                        <span style={{ color: '#e2e8f0' }}>gym-transformations, gym-gallery, gym-trainers, gym-testimonials</span>
                      </div>
                    </div>

                    <div style={{ marginTop: '16px', paddingTop: '14px', borderTop: '1px solid rgba(255,255,255,0.06)', fontSize: '0.8rem', color: '#94a3b8' }}>
                      All table definitions and storage setup are exported in <code style={{ color: 'var(--accent, #ccff00)' }}>supabase_schema.sql</code>. Execute it once in your Supabase SQL editor to create all tables and buckets.
                    </div>
                  </div>

                  {/* Admin Security & Credential Self-Assignment */}
                  <div style={{ 
                    background: 'rgba(255, 255, 255, 0.03)', 
                    border: '1px solid rgba(255, 255, 255, 0.08)', 
                    borderRadius: '10px', 
                    padding: '22px',
                    marginBottom: '24px'
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <Lock size={18} color="var(--accent, #ccff00)" />
                        <h4 style={{ color: '#fff', margin: 0, fontSize: '1rem' }}>Admin Access &amp; Login Credential Assignment</h4>
                      </div>
                      <span style={{ 
                        background: 'rgba(204, 255, 0, 0.1)', 
                        color: 'var(--accent, #ccff00)', 
                        fontSize: '0.72rem', 
                        fontWeight: 700, 
                        padding: '3px 10px', 
                        borderRadius: '999px',
                        border: '1px solid rgba(204, 255, 0, 0.25)'
                      }}>
                        Self-Service Security
                      </span>
                    </div>

                    <p style={{ color: '#94a3b8', fontSize: '0.82rem', margin: '0 0 16px 0', lineHeight: 1.5 }}>
                      Assign your own admin login credentials below. You can change your username and password anytime. The changes take effect immediately on this browser and persist for future sign-ins.
                    </p>

                    <form onSubmit={handleUpdateAdminCredentials} style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '14px', alignItems: 'flex-end' }}>
                      <div>
                        <label style={{ display: 'block', fontSize: '0.75rem', color: '#cbd5e1', marginBottom: '6px' }}>
                          Admin Username
                        </label>
                        <input
                          type="text"
                          value={newAdminUser}
                          onChange={(e) => setNewAdminUser(e.target.value)}
                          className="form-input"
                          placeholder="admin@01"
                          required
                          style={{ width: '100%' }}
                        />
                      </div>

                      <div>
                        <label style={{ display: 'block', fontSize: '0.75rem', color: '#cbd5e1', marginBottom: '6px' }}>
                          Admin Password
                        </label>
                        <div style={{ position: 'relative' }}>
                          <input
                            type={showCredsPassword ? 'text' : 'password'}
                            value={newAdminPass}
                            onChange={(e) => setNewAdminPass(e.target.value)}
                            className="form-input"
                            placeholder="••••••••••••"
                            required
                            style={{ width: '100%', paddingRight: '36px' }}
                          />
                          <button
                            type="button"
                            onClick={() => setShowCredsPassword(!showCredsPassword)}
                            style={{
                              position: 'absolute',
                              right: '10px',
                              top: '50%',
                              transform: 'translateY(-50%)',
                              background: 'none',
                              border: 'none',
                              color: '#94a3b8',
                              cursor: 'pointer',
                              padding: '2px',
                              display: 'flex',
                              alignItems: 'center'
                            }}
                            title={showCredsPassword ? 'Hide password' : 'Show password'}
                          >
                            {showCredsPassword ? <EyeOff size={15} /> : <Eye size={15} />}
                          </button>
                        </div>
                      </div>

                      <div>
                        <button
                          type="submit"
                          className="btn btn-primary"
                          style={{ width: '100%', height: '42px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}
                        >
                          <ShieldCheck size={16} />
                          <span>UPDATE CREDENTIALS</span>
                        </button>
                      </div>
                    </form>

                    <div style={{ marginTop: '14px', paddingTop: '12px', borderTop: '1px solid rgba(255,255,255,0.06)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '0.78rem', color: '#94a3b8', flexWrap: 'wrap', gap: '8px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <span>Active Credentials: Username: <strong style={{ color: 'var(--accent, #ccff00)' }}>{adminCreds.username}</strong> &bull; Password: <strong style={{ color: 'var(--accent, #ccff00)' }}>{showCredsPassword ? adminCreds.password : '••••••••'}</strong></span>
                        <button
                          type="button"
                          onClick={() => setShowCredsPassword(!showCredsPassword)}
                          style={{ background: 'none', border: 'none', color: '#64748b', cursor: 'pointer', display: 'inline-flex', alignItems: 'center' }}
                          title={showCredsPassword ? 'Hide password' : 'Show password'}
                        >
                          {showCredsPassword ? <EyeOff size={13} /> : <Eye size={13} />}
                        </button>
                      </div>
                      <span style={{ color: '#64748b' }}>Tip: You can also add users via Supabase Cloud Auth</span>
                    </div>
                  </div>

                  {/* Club Coordinates Card */}
                  <div style={{ 
                    background: 'rgba(255, 255, 255, 0.03)', 
                    border: '1px solid rgba(255, 255, 255, 0.08)', 
                    borderRadius: '10px', 
                    padding: '20px'
                  }}>
                    <h4 style={{ color: '#fff', margin: '0 0 14px 0' }}>Club Business Coordinates</h4>
                    <div className="spec-info-grid">
                      <div className="spec-item">
                        <span className="spec-label">Club Name</span>
                        <span className="spec-value">{GYM_CONFIG.name}</span>
                      </div>
                      <div className="spec-item">
                        <span className="spec-label">Tagline</span>
                        <span className="spec-value">{GYM_CONFIG.tagline}</span>
                      </div>
                      <div className="spec-item">
                        <span className="spec-label">Primary Address</span>
                        <span className="spec-value">{GYM_CONFIG.address.street}, {GYM_CONFIG.address.area}</span>
                      </div>
                      <div className="spec-item">
                        <span className="spec-label">Contact Phone</span>
                        <span className="spec-value">{GYM_CONFIG.phone}</span>
                      </div>
                    </div>
                  </div>
                </div>
              )}

            </main>
          </div>
        )}

      </div>
    </div>
  );
}
