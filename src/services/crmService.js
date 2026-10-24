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

const INITIAL_CRM_LEADS = [];

const INITIAL_FOLLOWUPS = [];

export const getLeads = async () => {
  try {
    if (isSupabaseConfigured) {
      const { data, error } = await supabase
        .from('leads')
        .select('*')
        .order('created_at', { ascending: false });
      if (!error && data) return data;
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
