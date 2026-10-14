import React, { useState, useEffect } from 'react';
import { INITIAL_LEADS_DATA, GYM_CONFIG } from '../data/gymData';
import { 
  Users, 
  UserPlus, 
  TrendingUp, 
  DollarSign, 
  Calendar, 
  Search, 
  Filter, 
  Download, 
  Phone, 
  MessageSquare, 
  Trash2, 
  CheckCircle, 
  Clock, 
  ShieldCheck, 
  X,
  Plus,
  RefreshCw,
  Bell,
  Settings,
  Dumbbell
} from 'lucide-react';

export default function AdminDashboard({ isOpen, onClose }) {
  const [activeTab, setActiveTab] = useState('leads'); // 'dashboard' | 'leads' | 'memberships' | 'settings'
  const [leads, setLeads] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [toastMessage, setToastMessage] = useState('');

  // Load leads from localStorage or seed initial leads
  const loadLeads = () => {
    try {
      const stored = localStorage.getItem('kinetix_leads');
      if (stored) {
        setLeads(JSON.parse(stored));
      } else {
        setLeads(INITIAL_LEADS_DATA);
        localStorage.setItem('kinetix_leads', JSON.stringify(INITIAL_LEADS_DATA));
      }
    } catch (e) {
      setLeads(INITIAL_LEADS_DATA);
    }
  };

  useEffect(() => {
    loadLeads();
  }, [isOpen]);

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(''), 3000);
  };

  const updateLeadStatus = (id, newStatus) => {
    const updated = leads.map((l) => (l.id === id ? { ...l, status: newStatus } : l));
    setLeads(updated);
    localStorage.setItem('kinetix_leads', JSON.stringify(updated));
    showToast(`Lead status updated to ${newStatus}`);
  };

  const deleteLead = (id) => {
    if (window.confirm('Are you sure you want to remove this lead?')) {
      const updated = leads.filter((l) => l.id !== id);
      setLeads(updated);
      localStorage.setItem('kinetix_leads', JSON.stringify(updated));
      showToast('Lead deleted successfully');
    }
  };

  const exportCSV = () => {
    if (leads.length === 0) return;
    const headers = ['ID', 'Name', 'Phone', 'Email', 'Fitness Goal', 'Preferred Time', 'Status', 'Date Submitted', 'Notes'];
    const rows = leads.map((l) => [
      l.id,
      `"${l.name}"`,
      `"${l.phone}"`,
      `"${l.email}"`,
      `"${l.goal}"`,
      `"${l.time}"`,
      l.status,
      `"${l.createdAt}"`,
      `"${(l.message || '').replace(/"/g, '""')}"`
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `kinetix_leads_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast('Leads CSV exported successfully');
  };

  const filteredLeads = leads.filter((lead) => {
    const matchesSearch = 
      lead.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      lead.phone.includes(searchTerm) ||
      lead.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (lead.goal && lead.goal.toLowerCase().includes(searchTerm.toLowerCase()));

    const matchesStatus = statusFilter === 'All' || lead.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const totalLeadsCount = leads.length;
  const newLeadsCount = leads.filter((l) => l.status === 'New').length;
  const convertedLeadsCount = leads.filter((l) => l.status === 'Converted' || l.status === 'Trial Booked').length;

  if (!isOpen) return null;

  return (
    <div className="admin-portal-overlay">
      <div className="admin-portal-container">
        {/* Toast Notification */}
        {toastMessage && (
          <div className="admin-toast-banner">
            <CheckCircle size={16} />
            <span>{toastMessage}</span>
          </div>
        )}

        {/* Top Header Bar */}
        <header className="admin-header-bar">
          <div className="admin-header-left">
            <div className="admin-crest">
              <Dumbbell size={20} className="text-volt" />
            </div>
            <div>
              <h2 className="admin-title">KINETIX MANAGER PORTAL</h2>
              <span className="admin-subtitle">Live Gym Leads &amp; Operations Center</span>
            </div>
          </div>

          <div className="admin-header-right">
            <button onClick={loadLeads} className="admin-icon-btn" title="Refresh leads">
              <RefreshCw size={16} />
            </button>
            <div className="admin-user-badge">
              <span className="user-dot"></span>
              <span>General Manager (Indiranagar)</span>
            </div>
            <button 
              onClick={onClose} 
              className="admin-close-btn"
              aria-label="Close Admin Portal"
            >
              <X size={20} />
            </button>
          </div>
        </header>

        {/* Dashboard Navigation Tabs */}
        <div className="admin-nav-tabs">
          <button 
            onClick={() => setActiveTab('leads')}
            className={`admin-tab-btn ${activeTab === 'leads' ? 'active' : ''}`}
          >
            <UserPlus size={16} />
            <span>Leads &amp; Enquiries ({totalLeadsCount})</span>
          </button>

          <button 
            onClick={() => setActiveTab('dashboard')}
            className={`admin-tab-btn ${activeTab === 'dashboard' ? 'active' : ''}`}
          >
            <TrendingUp size={16} />
            <span>Metrics Overview</span>
          </button>

          <button 
            onClick={() => setActiveTab('settings')}
            className={`admin-tab-btn ${activeTab === 'settings' ? 'active' : ''}`}
          >
            <Settings size={16} />
            <span>Gym Configuration</span>
          </button>
        </div>

        {/* Main Content Area */}
        <div className="admin-content-area">
          
          {/* TAB 1: Leads & Enquiries */}
          {activeTab === 'leads' && (
            <div className="admin-leads-tab">
              {/* Stat Cards Row */}
              <div className="admin-quick-stats">
                <div className="aq-card">
                  <div className="aq-icon bg-yellow">
                    <UserPlus size={18} />
                  </div>
                  <div>
                    <span className="aq-val">{totalLeadsCount}</span>
                    <span className="aq-lbl">Total Enquiries</span>
                  </div>
                </div>

                <div className="aq-card">
                  <div className="aq-icon bg-green">
                    <Clock size={18} />
                  </div>
                  <div>
                    <span className="aq-val">{newLeadsCount}</span>
                    <span className="aq-lbl">New Pending Calls</span>
                  </div>
                </div>

                <div className="aq-card">
                  <div className="aq-icon bg-purple">
                    <CheckCircle size={18} />
                  </div>
                  <div>
                    <span className="aq-val">{convertedLeadsCount}</span>
                    <span className="aq-lbl">Trial Booked / Converted</span>
                  </div>
                </div>

                <div className="aq-card">
                  <div className="aq-icon bg-blue">
                    <TrendingUp size={18} />
                  </div>
                  <div>
                    <span className="aq-val">
                      {totalLeadsCount > 0 ? `${Math.round((convertedLeadsCount / totalLeadsCount) * 100)}%` : '0%'}
                    </span>
                    <span className="aq-lbl">Conversion Rate</span>
                  </div>
                </div>
              </div>

              {/* Action Toolbar */}
              <div className="admin-toolbar">
                <div className="admin-search-box">
                  <Search size={16} className="search-icon" />
                  <input
                    type="text"
                    placeholder="Search leads by name, phone, email, or goal..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="admin-search-input"
                  />
                  {searchTerm && (
                    <button onClick={() => setSearchTerm('')} className="search-clear">
                      <X size={14} />
                    </button>
                  )}
                </div>

                <div className="admin-filters-group">
                  <div className="status-filter-wrapper">
                    <Filter size={15} />
                    <select
                      value={statusFilter}
                      onChange={(e) => setStatusFilter(e.target.value)}
                      className="admin-select"
                    >
                      <option value="All">All Statuses</option>
                      <option value="New">New</option>
                      <option value="Contacted">Contacted</option>
                      <option value="Trial Booked">Trial Booked</option>
                      <option value="Converted">Converted</option>
                    </select>
                  </div>

                  <button 
                    onClick={exportCSV} 
                    className="btn btn-secondary btn-sm export-btn"
                    title="Export CSV for Excel / Google Sheets"
                  >
                    <Download size={14} />
                    <span>Export CSV</span>
                  </button>
                </div>
              </div>

              {/* Leads Table */}
              <div className="admin-table-wrapper">
                <table className="admin-table">
                  <thead>
                    <tr>
                      <th>Prospect Name</th>
                      <th>Contact Details</th>
                      <th>Fitness Goal</th>
                      <th>Preferred Slot</th>
                      <th>Date Received</th>
                      <th>Status</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredLeads.length > 0 ? (
                      filteredLeads.map((lead) => {
                        const cleanPhone = lead.phone.replace(/[^0-9]/g, '');
                        const waLink = `https://wa.me/${cleanPhone.length === 10 ? '91' + cleanPhone : cleanPhone}?text=${encodeURIComponent(
                          `Hi ${lead.name}, this is Arjun from KINETIX Athletic Club regarding your Free Trial reservation.`
                        )}`;

                        return (
                          <tr key={lead.id} className={`lead-row row-${lead.status.toLowerCase().replace(' ', '-')}`}>
                            <td className="lead-name-cell">
                              <strong>{lead.name}</strong>
                              {lead.message && (
                                <span className="lead-note-snippet" title={lead.message}>
                                  "{lead.message}"
                                </span>
                              )}
                            </td>

                            <td className="lead-contact-cell">
                              <a href={`tel:${lead.phone}`} className="table-phone-link">
                                <Phone size={12} /> {lead.phone}
                              </a>
                              <a href={`mailto:${lead.email}`} className="table-email-link">
                                {lead.email}
                              </a>
                            </td>

                            <td>
                              <span className="table-goal-badge">{lead.goal}</span>
                            </td>

                            <td className="text-secondary text-sm">
                              {lead.time}
                            </td>

                            <td className="text-muted text-sm">
                              {lead.createdAt}
                            </td>

                            <td>
                              <select
                                value={lead.status}
                                onChange={(e) => updateLeadStatus(lead.id, e.target.value)}
                                className={`status-pill-select status-${lead.status.toLowerCase().replace(' ', '-')}`}
                              >
                                <option value="New">New</option>
                                <option value="Contacted">Contacted</option>
                                <option value="Trial Booked">Trial Booked</option>
                                <option value="Converted">Converted</option>
                              </select>
                            </td>

                            <td>
                              <div className="table-actions-row">
                                <a
                                  href={waLink}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="table-action-icon wa-act"
                                  title="Chat with lead on WhatsApp"
                                >
                                  <MessageSquare size={15} />
                                </a>

                                <a
                                  href={`tel:${lead.phone}`}
                                  className="table-action-icon call-act"
                                  title="Call lead"
                                >
                                  <Phone size={15} />
                                </a>

                                <button
                                  onClick={() => deleteLead(lead.id)}
                                  className="table-action-icon delete-act"
                                  title="Delete lead record"
                                >
                                  <Trash2 size={15} />
                                </button>
                              </div>
                            </td>
                          </tr>
                        );
                      })
                    ) : (
                      <tr>
                        <td colSpan="7" className="table-empty-message">
                          No leads matching current search filter.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* TAB 2: Metrics Overview */}
          {activeTab === 'dashboard' && (
            <div className="admin-metrics-tab">
              <div className="metrics-summary-grid">
                <div className="metric-box">
                  <div className="mb-header">
                    <span className="mb-title">Active Memberships</span>
                    <Users size={18} className="text-volt" />
                  </div>
                  <div className="mb-val">2,548</div>
                  <span className="mb-sub text-volt">↑ 8.4% month-over-month</span>
                </div>

                <div className="metric-box">
                  <div className="mb-header">
                    <span className="mb-title">Projected Monthly Revenue</span>
                    <DollarSign size={18} className="text-volt" />
                  </div>
                  <div className="mb-val">₹38,20,000</div>
                  <span className="mb-sub text-volt">↑ ₹4.2L vs target</span>
                </div>

                <div className="metric-box">
                  <div className="mb-header">
                    <span className="mb-title">Today's Class Bookings</span>
                    <Calendar size={18} className="text-volt" />
                  </div>
                  <div className="mb-val">142 Lifters</div>
                  <span className="mb-sub">4 Sessions fully booked</span>
                </div>

                <div className="metric-box">
                  <div className="mb-header">
                    <span className="mb-title">Average Retention Rate</span>
                    <TrendingUp size={18} className="text-volt" />
                  </div>
                  <div className="mb-val">91.2%</div>
                  <span className="mb-sub">Top 5% in gym industry</span>
                </div>
              </div>

              <div className="facility-status-card">
                <h4>Facility Operational Status (Indiranagar)</h4>
                <div className="fac-checks-grid">
                  <div className="fc-item">
                    <span className="fc-dot online"></span>
                    <span>HVAC &amp; Air Filtration: Optimal (AQI 18)</span>
                  </div>
                  <div className="fc-item">
                    <span className="fc-dot online"></span>
                    <span>Thermal Sauna: 82°C (Online)</span>
                  </div>
                  <div className="fc-item">
                    <span className="fc-dot online"></span>
                    <span>Eleiko Platforms: All 6 Certified Safe</span>
                  </div>
                  <div className="fc-item">
                    <span className="fc-dot online"></span>
                    <span>InBody 570 Bio-Scanner: Calibrated</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: Settings */}
          {activeTab === 'settings' && (
            <div className="admin-settings-tab">
              <div className="settings-card">
                <h4>Backend &amp; Cloud Integration Architecture</h4>
                <p className="text-secondary text-sm">
                  This frontend is architected to plug straight into a <strong>FastAPI + Supabase / PostgreSQL</strong> backend. Environment variables configured for:
                </p>
                <div className="env-keys-preview">
                  <code>VITE_API_BASE_URL=https://api.kinetixathletic.com/v1</code>
                  <code>VITE_RAZORPAY_KEY_ID=rzp_live_xxxxxxxxxxxx</code>
                  <code>VITE_WHATSAPP_PHONE_ID=919876543210</code>
                </div>
                <div className="settings-action-row">
                  <button 
                    onClick={() => {
                      localStorage.setItem('kinetix_leads', JSON.stringify(INITIAL_LEADS_DATA));
                      loadLeads();
                      showToast('Reset sample demo leads to initial seed');
                    }}
                    className="btn btn-secondary btn-sm"
                  >
                    Reset Demo Leads Data
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
