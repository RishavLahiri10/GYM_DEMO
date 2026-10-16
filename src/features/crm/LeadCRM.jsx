import React, { useState, useEffect } from 'react';
import { 
  getLeads, 
  saveLead, 
  deleteLead, 
  getFollowups, 
  saveFollowup, 
  LEAD_STATUSES, 
  LEAD_SOURCES 
} from '../../services/crmService';
import { 
  MessageSquare, 
  Phone, 
  UserPlus, 
  CheckCircle2, 
  Clock, 
  AlertCircle, 
  Filter, 
  Search, 
  Plus, 
  Trash2, 
  Edit3, 
  ArrowRight,
  ExternalLink,
  Calendar,
  DollarSign
} from 'lucide-react';

export default function LeadCRM({ onConvertToMember, showToast }) {
  const [leads, setLeads] = useState([]);
  const [followups, setFollowups] = useState([]);
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [sourceFilter, setSourceFilter] = useState('ALL');
  const [searchTerm, setSearchTerm] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingLead, setEditingLead] = useState(null);

  const [leadForm, setLeadForm] = useState({
    name: '',
    phone: '',
    email: '',
    source: 'Website',
    interest: 'Weight Loss & Personal Training',
    status: 'NEW',
    assigned_staff: 'Priya Sen (Sales Manager)',
    follow_up_date: new Date().toISOString().slice(0, 10),
    notes: '',
    conversion_value: 14999
  });

  useEffect(() => {
    loadCRMData();
    const handleUpdate = () => loadCRMData();
    window.addEventListener('kinetix_crm_updated', handleUpdate);
    return () => window.removeEventListener('kinetix_crm_updated', handleUpdate);
  }, []);

  const loadCRMData = async () => {
    const l = await getLeads();
    setLeads(l);
    const fu = await getFollowups();
    setFollowups(fu);
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    if (!leadForm.name || !leadForm.phone) {
      if (showToast) showToast('Please enter both Name and Phone number.');
      return;
    }

    await saveLead(editingLead ? { ...leadForm, id: editingLead.id } : leadForm);
    setShowAddModal(false);
    setEditingLead(null);
    setLeadForm({
      name: '',
      phone: '',
      email: '',
      source: 'Website',
      interest: 'Weight Loss & Personal Training',
      status: 'NEW',
      assigned_staff: 'Priya Sen (Sales Manager)',
      follow_up_date: new Date().toISOString().slice(0, 10),
      notes: '',
      conversion_value: 14999
    });
    if (showToast) showToast('Lead saved to CRM pipeline successfully! 🎯');
  };

  const handleStatusChange = async (leadId, newStatus) => {
    const target = leads.find(l => l.id === leadId);
    if (!target) return;
    await saveLead({ ...target, status: newStatus });
    if (showToast) showToast(`Lead stage moved to "${newStatus}"`);
  };

  const handleDelete = async (id, name) => {
    if (window.confirm(`Delete lead ${name} from CRM?`)) {
      await deleteLead(id);
      if (showToast) showToast('Lead removed from CRM.');
    }
  };

  const handleCompleteFollowup = async (fu) => {
    await saveFollowup({ ...fu, status: 'Completed' });
    if (showToast) showToast(`Follow-up with ${fu.lead_name} marked completed! ✅`);
  };

  const filteredLeads = leads.filter(l => {
    const matchStatus = statusFilter === 'ALL' || l.status === statusFilter;
    const matchSource = sourceFilter === 'ALL' || l.source === sourceFilter;
    const matchSearch = 
      (l.name || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (l.phone || '').includes(searchTerm) ||
      (l.email || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (l.interest || '').toLowerCase().includes(searchTerm.toLowerCase());
    return matchStatus && matchSource && matchSearch;
  });

  return (
    <div className="crm-module-container">
      {/* Top Banner & Quick Actions */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', flexWrap: 'wrap', gap: '14px' }}>
        <div>
          <h3 style={{ fontSize: '1.45rem', color: '#FFFFFF', margin: 0, fontWeight: 800 }}>
            Lead CRM &amp; Sales Pipeline ({leads.length})
          </h3>
          <p style={{ color: '#94A3B8', fontSize: '0.85rem', margin: '4px 0 0 0' }}>
            Track client journeys from website enquiry to trial session and converted membership.
          </p>
        </div>

        <button 
          onClick={() => { setEditingLead(null); setShowAddModal(true); }}
          className="btn btn-primary btn-sm"
          style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}
        >
          <Plus size={15} />
          <span>+ Add New Lead</span>
        </button>
      </div>

      {/* KPI Pipeline Ribbon */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: '10px', marginBottom: '22px' }}>
        {['ALL', ...LEAD_STATUSES].map((st) => {
          const count = st === 'ALL' ? leads.length : leads.filter(l => l.status === st).length;
          const isActive = statusFilter === st;

          return (
            <button
              key={st}
              onClick={() => setStatusFilter(st)}
              style={{
                background: isActive ? 'var(--accent, #CCFF00)' : '#121622',
                color: isActive ? '#08090D' : '#CBD5E1',
                border: isActive ? '1px solid var(--accent)' : '1px solid rgba(255, 255, 255, 0.08)',
                borderRadius: '8px',
                padding: '10px 8px',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: '2px',
                cursor: 'pointer',
                transition: 'all 0.18s ease'
              }}
            >
              <strong style={{ fontSize: '1.15rem' }}>{count}</strong>
              <span style={{ fontSize: '0.68rem', fontWeight: 800, letterSpacing: '0.04em' }}>{st}</span>
            </button>
          );
        })}
      </div>

      {/* Follow-up Reminders Alert Banner */}
      {followups.filter(f => f.status === 'Pending').length > 0 && (
        <div style={{
          background: 'rgba(245, 158, 11, 0.08)',
          border: '1px solid rgba(245, 158, 11, 0.28)',
          borderRadius: '10px',
          padding: '14px 18px',
          marginBottom: '20px'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '10px' }}>
            <Clock size={16} color="#F59E0B" />
            <strong style={{ fontSize: '0.86rem', color: '#FBBF24' }}>
              Pending Follow-Up Tasks ({followups.filter(f => f.status === 'Pending').length})
            </strong>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '10px' }}>
            {followups.filter(f => f.status === 'Pending').map((fu) => (
              <div key={fu.id} style={{
                background: '#0E1119',
                border: '1px solid rgba(255, 255, 255, 0.08)',
                borderRadius: '8px',
                padding: '10px 14px',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center'
              }}>
                <div>
                  <strong style={{ color: '#FFFFFF', fontSize: '0.86rem' }}>{fu.lead_name}</strong>
                  <span style={{ fontSize: '0.72rem', color: '#94A3B8', display: 'block' }}>{fu.notes}</span>
                  <span style={{ fontSize: '0.7rem', color: '#F59E0B' }}>Due: {fu.due_date} • {fu.assigned_to}</span>
                </div>
                <div style={{ display: 'flex', gap: '6px' }}>
                  <a href={`tel:${fu.lead_phone}`} style={{ color: '#38BDF8', padding: '4px' }} title="Call Lead">
                    <Phone size={15} />
                  </a>
                  <button 
                    onClick={() => handleCompleteFollowup(fu)}
                    style={{ background: 'rgba(16, 185, 129, 0.15)', border: '1px solid rgba(16, 185, 129, 0.3)', color: '#34D399', borderRadius: '4px', padding: '4px 8px', fontSize: '0.7rem', fontWeight: 700, cursor: 'pointer' }}
                  >
                    Done
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Filter and Search Bar */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '12px', flexWrap: 'wrap', marginBottom: '16px' }}>
        <div style={{ position: 'relative', minWidth: '260px', flex: 1 }}>
          <input
            type="text"
            placeholder="Search leads by name, phone, email, goal..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="form-input"
            style={{ paddingLeft: '36px', width: '100%' }}
          />
          <Search size={15} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#64748B' }} />
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span style={{ fontSize: '0.76rem', color: '#94A3B8', fontWeight: 700 }}>Source:</span>
          <select 
            value={sourceFilter} 
            onChange={(e) => setSourceFilter(e.target.value)}
            className="form-input"
            style={{ width: 'auto', padding: '6px 10px', fontSize: '0.8rem' }}
          >
            <option value="ALL">All Sources</option>
            {LEAD_SOURCES.map(s => <option key={s} value={s}>{s}</option>)}
          </select>
        </div>
      </div>

      {/* Leads Table */}
      <div className="admin-table-container">
        <table className="admin-table">
          <thead>
            <tr>
              <th>Lead Name</th>
              <th>Contact</th>
              <th>Source &amp; Interest</th>
              <th>Pipeline Stage</th>
              <th>Assigned Staff</th>
              <th>Est. Value</th>
              <th>Next Follow-up</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredLeads.map((lead) => (
              <tr key={lead.id}>
                <td>
                  <strong style={{ color: '#FFFFFF', fontSize: '0.9rem' }}>{lead.name}</strong>
                  <div style={{ fontSize: '0.7rem', color: '#64748B' }}>Created: {new Date(lead.created_at).toLocaleDateString()}</div>
                </td>
                <td>
                  <div style={{ color: '#E2E8F0', fontSize: '0.82rem' }}>{lead.phone}</div>
                  <small style={{ color: '#94A3B8' }}>{lead.email}</small>
                </td>
                <td>
                  <span style={{ fontSize: '0.7rem', background: 'rgba(255, 255, 255, 0.05)', padding: '2px 6px', borderRadius: '4px', color: '#CBD5E1', display: 'inline-block', marginBottom: '3px' }}>
                    {lead.source || 'Website'}
                  </span>
                  <div style={{ fontSize: '0.76rem', color: '#E2E8F0' }}>{lead.interest}</div>
                </td>
                <td>
                  <select
                    value={lead.status || 'NEW'}
                    onChange={(e) => handleStatusChange(lead.id, e.target.value)}
                    className="status-select"
                    style={{
                      fontWeight: 800,
                      background: lead.status === 'CONVERTED' ? 'rgba(16, 185, 129, 0.2)' :
                                  lead.status === 'LOST' ? 'rgba(239, 68, 68, 0.2)' :
                                  lead.status === 'TRIAL COMPLETED' ? 'rgba(204, 255, 0, 0.2)' : '#1A1F2D',
                      color: lead.status === 'CONVERTED' ? '#34D399' :
                             lead.status === 'LOST' ? '#F87171' :
                             lead.status === 'TRIAL COMPLETED' ? '#CCFF00' : '#FFFFFF'
                    }}
                  >
                    {LEAD_STATUSES.map(s => <option key={s} value={s}>{s}</option>)}
                  </select>
                </td>
                <td>
                  <span style={{ fontSize: '0.78rem', color: '#CBD5E1' }}>{lead.assigned_staff || 'Priya Sen'}</span>
                </td>
                <td>
                  <strong style={{ color: 'var(--accent, #CCFF00)', fontSize: '0.86rem' }}>
                    ₹{lead.conversion_value ? lead.conversion_value.toLocaleString() : '14,999'}
                  </strong>
                </td>
                <td>
                  <span style={{ fontSize: '0.78rem', color: lead.follow_up_date <= new Date().toISOString().slice(0, 10) ? '#F59E0B' : '#94A3B8' }}>
                    {lead.follow_up_date || 'No follow-up set'}
                  </span>
                </td>
                <td>
                  <div className="table-actions">
                    <a
                      href={`https://wa.me/91${(lead.phone || '').replace(/[^0-9]/g, '')}?text=Hi%20${encodeURIComponent(lead.name || '')},%20this%20is%20KINETIX%20Athletic%20Club.`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="table-action-icon"
                      title="WhatsApp Chat"
                    >
                      <MessageSquare size={14} color="#25D366" />
                    </a>
                    <a href={`tel:${lead.phone}`} className="table-action-icon" title="Call">
                      <Phone size={14} color="#38BDF8" />
                    </a>
                    {onConvertToMember && (
                      <button
                        onClick={() => onConvertToMember(lead)}
                        className="table-action-icon"
                        title="Convert to Enrolled Member"
                        style={{ color: 'var(--accent)' }}
                      >
                        <UserPlus size={14} />
                      </button>
                    )}
                    <button 
                      onClick={() => { setEditingLead(lead); setLeadForm(lead); setShowAddModal(true); }}
                      className="table-action-icon" 
                      title="Edit Lead"
                    >
                      <Edit3 size={14} />
                    </button>
                    <button 
                      onClick={() => handleDelete(lead.id, lead.name)} 
                      className="table-action-icon" 
                      title="Delete Lead"
                    >
                      <Trash2 size={14} color="#EF4444" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Add / Edit Lead Modal */}
      {showAddModal && (
        <div className="mp-modal-backdrop" onClick={() => setShowAddModal(false)}>
          <div className="mp-modal-box" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '520px' }}>
            <div className="mp-modal-header">
              <h3>{editingLead ? 'Edit Lead' : 'Add New CRM Lead'}</h3>
              <button onClick={() => setShowAddModal(false)} className="mp-close-btn">
                ✕
              </button>
            </div>
            <form onSubmit={handleFormSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                <div>
                  <label style={{ fontSize: '0.74rem', color: '#94A3B8', display: 'block', marginBottom: '4px' }}>Lead Name *</label>
                  <input
                    type="text"
                    value={leadForm.name}
                    onChange={(e) => setLeadForm({ ...leadForm, name: e.target.value })}
                    className="form-input"
                    required
                  />
                </div>
                <div>
                  <label style={{ fontSize: '0.74rem', color: '#94A3B8', display: 'block', marginBottom: '4px' }}>Phone Number *</label>
                  <input
                    type="text"
                    value={leadForm.phone}
                    onChange={(e) => setLeadForm({ ...leadForm, phone: e.target.value })}
                    className="form-input"
                    required
                  />
                </div>
              </div>

              <div>
                <label style={{ fontSize: '0.74rem', color: '#94A3B8', display: 'block', marginBottom: '4px' }}>Email Address</label>
                <input
                  type="email"
                  value={leadForm.email}
                  onChange={(e) => setLeadForm({ ...leadForm, email: e.target.value })}
                  className="form-input"
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                <div>
                  <label style={{ fontSize: '0.74rem', color: '#94A3B8', display: 'block', marginBottom: '4px' }}>Lead Source</label>
                  <select
                    value={leadForm.source}
                    onChange={(e) => setLeadForm({ ...leadForm, source: e.target.value })}
                    className="form-input"
                  >
                    {LEAD_SOURCES.map(s => <option key={s} value={s}>{s}</option>)}
                  </select>
                </div>
                <div>
                  <label style={{ fontSize: '0.74rem', color: '#94A3B8', display: 'block', marginBottom: '4px' }}>Initial Stage</label>
                  <select
                    value={leadForm.status}
                    onChange={(e) => setLeadForm({ ...leadForm, status: e.target.value })}
                    className="form-input"
                  >
                    {LEAD_STATUSES.map(s => <option key={s} value={s}>{s}</option>)}
                  </select>
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                <div>
                  <label style={{ fontSize: '0.74rem', color: '#94A3B8', display: 'block', marginBottom: '4px' }}>Est. Deal Value (₹)</label>
                  <input
                    type="number"
                    value={leadForm.conversion_value}
                    onChange={(e) => setLeadForm({ ...leadForm, conversion_value: parseFloat(e.target.value) || 0 })}
                    className="form-input"
                  />
                </div>
                <div>
                  <label style={{ fontSize: '0.74rem', color: '#94A3B8', display: 'block', marginBottom: '4px' }}>Next Follow-up Date</label>
                  <input
                    type="date"
                    value={leadForm.follow_up_date}
                    onChange={(e) => setLeadForm({ ...leadForm, follow_up_date: e.target.value })}
                    className="form-input"
                  />
                </div>
              </div>

              <div>
                <label style={{ fontSize: '0.74rem', color: '#94A3B8', display: 'block', marginBottom: '4px' }}>Primary Interest / Fitness Goal</label>
                <input
                  type="text"
                  value={leadForm.interest}
                  onChange={(e) => setLeadForm({ ...leadForm, interest: e.target.value })}
                  placeholder="e.g. Weight Loss, Muscle Hypertrophy, Sauna Access"
                  className="form-input"
                />
              </div>

              <div>
                <label style={{ fontSize: '0.74rem', color: '#94A3B8', display: 'block', marginBottom: '4px' }}>Staff Notes</label>
                <textarea
                  rows={2}
                  value={leadForm.notes}
                  onChange={(e) => setLeadForm({ ...leadForm, notes: e.target.value })}
                  placeholder="Key background details, trial feedback..."
                  className="form-input"
                />
              </div>

              <button type="submit" className="btn btn-primary" style={{ marginTop: '6px' }}>
                {editingLead ? 'Update Lead' : 'Save Lead to Pipeline'}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
