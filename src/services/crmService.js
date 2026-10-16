import { supabase, isSupabaseConfigured } from '../lib/supabaseClient';

export const LEAD_STATUSES = [
  'NEW',
  'CONTACTED',
  'TRIAL BOOKED',
  'TRIAL COMPLETED',
  'NEGOTIATION',
  'CONVERTED',
  'LOST'
];

export const LEAD_SOURCES = [
  'Website',
  'Instagram',
  'Facebook',
  'Google',
  'Referral',
  'Walk-in',
  'WhatsApp',
  'Advertisement',
  'Other'
];

const INITIAL_CRM_LEADS = [
  {
    id: 'crm-lead-1',
    name: 'Rahul Sharma',
    phone: '+91 98450 11223',
    email: 'rahul.s@techcorp.io',
    source: 'Website',
    interest: 'Weight Loss & Personal Training',
    status: 'TRIAL COMPLETED',
    assigned_staff: 'Priya Sen (Sales Manager)',
    follow_up_date: '2026-10-18',
    notes: 'Completed 1-day trial with coach Arjun. Very positive, negotiating quarterly fee.',
    conversion_value: 14999,
    created_at: '2026-10-14T08:30:00Z'
  },
  {
    id: 'crm-lead-2',
    name: 'Ayesha Khan',
    phone: '+91 97312 88492',
    email: 'ayesha.k@gmail.com',
    source: 'Instagram',
    interest: 'Rehab & Mobility Training',
    status: 'CONTACTED',
    assigned_staff: 'Arjun Sharma (Head Coach)',
    follow_up_date: '2026-10-19',
    notes: 'Knee sprain recovery. Needs movement screening slot this weekend.',
    conversion_value: 18000,
    created_at: '2026-10-15T11:15:00Z'
  },
  {
    id: 'crm-lead-3',
    name: 'Rohan Deshmukh',
    phone: '+91 99801 34567',
    email: 'rohan.d@fintech.co',
    source: 'Google',
    interest: 'Strength & Conditioning',
    status: 'TRIAL BOOKED',
    assigned_staff: 'Priya Sen (Sales Manager)',
    follow_up_date: '2026-10-17',
    notes: 'Trial scheduled for Saturday 7:30 AM.',
    conversion_value: 24999,
    created_at: '2026-10-16T16:45:00Z'
  },
  {
    id: 'crm-lead-4',
    name: 'Sneha Kapoor',
    phone: '+91 98112 55667',
    email: 'sneha.k@designhub.com',
    source: 'Referral',
    interest: 'HIIT & Group Classes',
    status: 'NEW',
    assigned_staff: 'Unassigned',
    follow_up_date: '2026-10-17',
    notes: 'Friend of Vikram Sharma. Submitted inquiry via Free Trial CTA.',
    conversion_value: 12000,
    created_at: '2026-10-16T19:20:00Z'
  },
  {
    id: 'crm-lead-5',
    name: 'Amitabh Nambiar',
    phone: '+91 98200 44321',
    email: 'amitabh.n@corp.in',
    source: 'Walk-in',
    interest: 'Corporate Annual Plan',
    status: 'NEGOTIATION',
    assigned_staff: 'Priya Sen (Sales Manager)',
    follow_up_date: '2026-10-20',
    notes: 'Looking for 10 employee passes discount.',
    conversion_value: 95000,
    created_at: '2026-10-13T14:10:00Z'
  }
];

const INITIAL_FOLLOWUPS = [
  {
    id: 'fu-1',
    lead_id: 'crm-lead-1',
    lead_name: 'Rahul Sharma',
    lead_phone: '+91 98450 11223',
    due_date: '2026-10-18',
    status: 'Pending',
    assigned_to: 'Priya Sen',
    notes: 'Call post-trial to review quarterly plan package.'
  },
  {
    id: 'fu-2',
    lead_id: 'crm-lead-2',
    lead_name: 'Ayesha Khan',
    lead_phone: '+91 97312 88492',
    due_date: '2026-10-19',
    status: 'Pending',
    assigned_to: 'Arjun Sharma',
    notes: 'Confirm assessment slot with mobility coach Ananya.'
  },
  {
    id: 'fu-3',
    lead_id: 'crm-lead-4',
    lead_name: 'Sneha Kapoor',
    lead_phone: '+91 98112 55667',
    due_date: '2026-10-17',
    status: 'Pending',
    assigned_to: 'Priya Sen',
    notes: 'Initial intro call to welcome referral.'
  }
];

export const getLeads = async () => {
  try {
    if (isSupabaseConfigured) {
      const { data, error } = await supabase
        .from('leads')
        .select('*')
        .order('created_at', { ascending: false });
      if (!error && data && data.length > 0) return data;
    }
  } catch (e) {
    console.warn('Supabase fetch leads failed, using local storage cache', e);
  }

  const stored = localStorage.getItem('kinetix_crm_leads');
  if (stored) {
    try { return JSON.parse(stored); } catch (e) {}
  }
  localStorage.setItem('kinetix_crm_leads', JSON.stringify(INITIAL_CRM_LEADS));
  return INITIAL_CRM_LEADS;
};

export const saveLead = async (lead) => {
  const currentLeads = await getLeads();
  let updated;
  if (lead.id) {
    updated = currentLeads.map(l => l.id === lead.id ? { ...l, ...lead, updated_at: new Date().toISOString() } : l);
  } else {
    const newLead = {
      ...lead,
      id: `crm-lead-${Date.now()}`,
      created_at: new Date().toISOString(),
      status: lead.status || 'NEW',
      source: lead.source || 'Website'
    };
    updated = [newLead, ...currentLeads];
  }

  localStorage.setItem('kinetix_crm_leads', JSON.stringify(updated));

  if (isSupabaseConfigured) {
    try {
      await supabase.from('leads').upsert(lead);
    } catch (e) {}
  }

  window.dispatchEvent(new Event('kinetix_crm_updated'));
  return updated;
};

export const deleteLead = async (id) => {
  const currentLeads = await getLeads();
  const updated = currentLeads.filter(l => l.id !== id);
  localStorage.setItem('kinetix_crm_leads', JSON.stringify(updated));

  if (isSupabaseConfigured) {
    try {
      await supabase.from('leads').delete().eq('id', id);
    } catch (e) {}
  }

  window.dispatchEvent(new Event('kinetix_crm_updated'));
  return updated;
};

export const getFollowups = async () => {
  const stored = localStorage.getItem('kinetix_crm_followups');
  if (stored) {
    try { return JSON.parse(stored); } catch (e) {}
  }
  localStorage.setItem('kinetix_crm_followups', JSON.stringify(INITIAL_FOLLOWUPS));
  return INITIAL_FOLLOWUPS;
};

export const saveFollowup = async (followup) => {
  const current = await getFollowups();
  let updated;
  if (followup.id) {
    updated = current.map(f => f.id === followup.id ? { ...f, ...followup } : f);
  } else {
    const newF = {
      ...followup,
      id: `fu-${Date.now()}`,
      created_at: new Date().toISOString(),
      status: followup.status || 'Pending'
    };
    updated = [newF, ...current];
  }
  localStorage.setItem('kinetix_crm_followups', JSON.stringify(updated));
  window.dispatchEvent(new Event('kinetix_crm_updated'));
  return updated;
};
