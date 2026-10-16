import React, { useState, useEffect } from 'react';
import { 
  getExpenses, 
  saveExpense, 
  getInvoices, 
  generateInvoice 
} from '../../services/billingService';
import { 
  DollarSign, 
  TrendingUp, 
  TrendingDown, 
  FileText, 
  Download, 
  Printer, 
  Plus, 
  X, 
  Filter, 
  CreditCard,
  Building,
  Calendar,
  CheckCircle2,
  Receipt
} from 'lucide-react';

export default function FinanceDesk({ members = [], memberPayments = [], showToast }) {
  const [invoices, setInvoices] = useState([]);
  const [expenses, setExpenses] = useState([]);
  const [activeSubTab, setActiveSubTab] = useState('summary'); // 'summary' | 'invoices' | 'expenses'
  const [showAddExpenseModal, setShowAddExpenseModal] = useState(false);
  const [selectedInvoiceForView, setSelectedInvoiceForView] = useState(null);

  const [expenseForm, setExpenseForm] = useState({
    category: 'Rent',
    amount: '',
    description: '',
    date: new Date().toISOString().slice(0, 10),
    method: 'Bank Transfer'
  });

  useEffect(() => {
    loadBillingData();
    const handleUpdate = () => loadBillingData();
    window.addEventListener('kinetix_finance_updated', handleUpdate);
    return () => window.removeEventListener('kinetix_finance_updated', handleUpdate);
  }, []);

  const loadBillingData = async () => {
    const invs = await getInvoices();
    setInvoices(invs);
    const exps = await getExpenses();
    setExpenses(exps);
  };

  const handleExpenseSubmit = async (e) => {
    e.preventDefault();
    if (!expenseForm.amount || !expenseForm.description) {
      if (showToast) showToast('Please enter both Amount and Description.');
      return;
    }

    await saveExpense({
      ...expenseForm,
      amount: parseFloat(expenseForm.amount)
    });

    setShowAddExpenseModal(false);
    setExpenseForm({
      category: 'Rent',
      amount: '',
      description: '',
      date: new Date().toISOString().slice(0, 10),
      method: 'Bank Transfer'
    });
    if (showToast) showToast('Expense logged successfully! 💰');
  };

  // Calculations
  const totalRevenue = memberPayments.reduce((sum, p) => sum + (Number(p.amount) || 0), 0) + 
                       invoices.reduce((sum, i) => sum + (Number(i.total_amount) || 0), 0);
  const totalExpenses = expenses.reduce((sum, e) => sum + (Number(e.amount) || 0), 0);
  const netProfit = totalRevenue - totalExpenses;

  const EXPENSE_CATEGORIES = [
    'Rent',
    'Salaries',
    'Electricity',
    'Maintenance',
    'Marketing',
    'Equipment',
    'Cleaning',
    'Other'
  ];

  return (
    <div className="finance-module-container">
      {/* Title */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', flexWrap: 'wrap', gap: '14px' }}>
        <div>
          <h3 style={{ fontSize: '1.45rem', color: '#FFFFFF', margin: 0, fontWeight: 800 }}>
            Billing, Invoices &amp; Financial P&amp;L
          </h3>
          <p style={{ color: '#94A3B8', fontSize: '0.85rem', margin: '4px 0 0 0' }}>
            Commercial tax invoices, operating overheads, revenue reports, and net margins.
          </p>
        </div>

        <div style={{ display: 'flex', gap: '10px' }}>
          <button 
            onClick={() => setShowAddExpenseModal(true)} 
            className="btn btn-secondary btn-sm"
            style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}
          >
            <Plus size={14} />
            <span>+ Log Expense</span>
          </button>
        </div>
      </div>

      {/* Financial Executive Summary Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(210px, 1fr))', gap: '14px', marginBottom: '24px' }}>
        <div className="aq-card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span className="aq-val text-volt-accent" style={{ fontSize: '2.2rem' }}>
              ₹{totalRevenue.toLocaleString()}
            </span>
            <TrendingUp size={22} className="text-volt-accent" />
          </div>
          <span className="aq-lbl" style={{ color: '#FFFFFF', fontWeight: 700 }}>Total Collected Revenue</span>
          <small style={{ color: '#34D399', fontSize: '0.74rem', marginTop: '4px', display: 'block' }}>
            Memberships + PT sessions
          </small>
        </div>

        <div className="aq-card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span className="aq-val text-danger" style={{ fontSize: '2.2rem', color: '#F87171' }}>
              ₹{totalExpenses.toLocaleString()}
            </span>
            <TrendingDown size={22} color="#F87171" />
          </div>
          <span className="aq-lbl" style={{ color: '#FFFFFF', fontWeight: 700 }}>Total Operating Expenses</span>
          <small style={{ color: '#F87171', fontSize: '0.74rem', marginTop: '4px', display: 'block' }}>
            Rent, utilities &amp; trainer payroll
          </small>
        </div>

        <div className="aq-card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span className="aq-val" style={{ fontSize: '2.2rem', color: netProfit >= 0 ? '#34D399' : '#F87171' }}>
              ₹{netProfit.toLocaleString()}
            </span>
            <DollarSign size={22} color={netProfit >= 0 ? '#34D399' : '#F87171'} />
          </div>
          <span className="aq-lbl" style={{ color: '#FFFFFF', fontWeight: 700 }}>Net Operational Margin</span>
          <small style={{ color: netProfit >= 0 ? '#34D399' : '#F87171', fontSize: '0.74rem', marginTop: '4px', display: 'block' }}>
            {netProfit >= 0 ? 'Profitable Facility Running' : 'Deficit this period'}
          </small>
        </div>
      </div>

      {/* Sub Tabs: Summary / Invoices / Expenses */}
      <div style={{ display: 'flex', gap: '8px', borderBottom: '1px solid rgba(255, 255, 255, 0.08)', paddingBottom: '12px', marginBottom: '20px' }}>
        <button 
          onClick={() => setActiveSubTab('summary')}
          className={`btn ${activeSubTab === 'summary' ? 'btn-primary' : 'btn-secondary'} btn-sm`}
        >
          Overview &amp; Breakdown
        </button>
        <button 
          onClick={() => setActiveSubTab('invoices')}
          className={`btn ${activeSubTab === 'invoices' ? 'btn-primary' : 'btn-secondary'} btn-sm`}
        >
          Commercial Invoices ({invoices.length})
        </button>
        <button 
          onClick={() => setActiveSubTab('expenses')}
          className={`btn ${activeSubTab === 'expenses' ? 'btn-primary' : 'btn-secondary'} btn-sm`}
        >
          Expenses Log ({expenses.length})
        </button>
      </div>

      {/* SUBTAB 1: INVOICES */}
      {activeSubTab === 'invoices' && (
        <div className="admin-table-container">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Invoice #</th>
                <th>Member Name</th>
                <th>Plan Tier</th>
                <th>Issue Date</th>
                <th>Tax (18% GST)</th>
                <th>Total Bill</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {invoices.map((inv) => (
                <tr key={inv.id}>
                  <td>
                    <strong style={{ color: '#FFFFFF', fontSize: '0.86rem' }}>{inv.invoice_number}</strong>
                  </td>
                  <td>
                    <div style={{ color: '#FFFFFF', fontWeight: 600 }}>{inv.member_name}</div>
                    <small style={{ color: '#94A3B8' }}>{inv.member_phone}</small>
                  </td>
                  <td>
                    <span style={{ fontSize: '0.72rem', background: 'rgba(255, 255, 255, 0.05)', padding: '2px 8px', borderRadius: '4px', color: '#CBD5E1' }}>
                      {inv.plan_name}
                    </span>
                  </td>
                  <td>
                    <span style={{ fontSize: '0.8rem', color: '#94A3B8' }}>{inv.issue_date}</span>
                  </td>
                  <td>
                    <span style={{ fontSize: '0.82rem', color: '#CBD5E1' }}>₹{inv.tax_amount}</span>
                  </td>
                  <td>
                    <strong style={{ color: 'var(--accent, #CCFF00)', fontSize: '0.9rem' }}>
                      ₹{inv.total_amount ? inv.total_amount.toLocaleString() : '1,769'}
                    </strong>
                  </td>
                  <td>
                    <span className="badge-paid" style={{ padding: '3px 8px', borderRadius: '4px', fontSize: '0.72rem', fontWeight: 800, background: 'rgba(16, 185, 129, 0.15)', color: '#34D399' }}>
                      {inv.status || 'Paid'}
                    </span>
                  </td>
                  <td>
                    <button
                      onClick={() => setSelectedInvoiceForView(inv)}
                      className="btn btn-secondary btn-sm"
                      style={{ display: 'inline-flex', alignItems: 'center', gap: '5px', fontSize: '0.74rem', padding: '4px 10px' }}
                    >
                      <FileText size={13} />
                      <span>View &amp; Print</span>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* SUBTAB 2: EXPENSES */}
      {activeSubTab === 'expenses' && (
        <div className="admin-table-container">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Category</th>
                <th>Description</th>
                <th>Date</th>
                <th>Payment Method</th>
                <th>Amount</th>
              </tr>
            </thead>
            <tbody>
              {expenses.map((exp) => (
                <tr key={exp.id}>
                  <td>
                    <span style={{ 
                      fontSize: '0.74rem', 
                      fontWeight: 800, 
                      padding: '3px 10px', 
                      borderRadius: '4px',
                      background: 'rgba(255, 255, 255, 0.06)',
                      color: '#E2E8F0'
                    }}>
                      {exp.category}
                    </span>
                  </td>
                  <td>
                    <div style={{ color: '#FFFFFF', fontSize: '0.86rem' }}>{exp.description}</div>
                  </td>
                  <td>
                    <span style={{ fontSize: '0.8rem', color: '#94A3B8' }}>{exp.date}</span>
                  </td>
                  <td>
                    <span style={{ fontSize: '0.8rem', color: '#CBD5E1' }}>{exp.method || 'Bank Transfer'}</span>
                  </td>
                  <td>
                    <strong style={{ color: '#F87171', fontSize: '0.9rem' }}>
                      -₹{exp.amount.toLocaleString()}
                    </strong>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* SUBTAB 3: SUMMARY */}
      {activeSubTab === 'summary' && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '18px' }}>
          {/* Expense Categories Breakdown */}
          <div style={{ background: '#121622', border: '1px solid rgba(255, 255, 255, 0.08)', borderRadius: '12px', padding: '20px' }}>
            <h4 style={{ color: '#FFFFFF', fontSize: '1rem', margin: '0 0 16px 0', fontWeight: 700 }}>
              Operating Expense Distribution
            </h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {EXPENSE_CATEGORIES.map((cat) => {
                const catTotal = expenses.filter(e => e.category === cat).reduce((s, e) => s + (e.amount || 0), 0);
                if (catTotal === 0) return null;
                const pct = totalExpenses > 0 ? Math.round((catTotal / totalExpenses) * 100) : 0;

                return (
                  <div key={cat} style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem' }}>
                      <span style={{ color: '#CBD5E1' }}>{cat}</span>
                      <strong style={{ color: '#FFFFFF' }}>₹{catTotal.toLocaleString()} ({pct}%)</strong>
                    </div>
                    <div style={{ width: '100%', height: '6px', background: 'rgba(255, 255, 255, 0.08)', borderRadius: '3px', overflow: 'hidden' }}>
                      <div style={{ width: `${pct}%`, height: '100%', background: 'var(--accent, #CCFF00)', borderRadius: '3px' }} />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Tax & GST Status */}
          <div style={{ background: '#121622', border: '1px solid rgba(255, 255, 255, 0.08)', borderRadius: '12px', padding: '20px' }}>
            <h4 style={{ color: '#FFFFFF', fontSize: '1rem', margin: '0 0 14px 0', fontWeight: 700 }}>
              Tax &amp; Regulatory Filings
            </h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '0.84rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', borderBottom: '1px solid rgba(255, 255, 255, 0.06)' }}>
                <span style={{ color: '#94A3B8' }}>Gym GSTIN Number:</span>
                <strong style={{ color: '#FFFFFF' }}>29AAAAA0000A1Z5</strong>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', borderBottom: '1px solid rgba(255, 255, 255, 0.06)' }}>
                <span style={{ color: '#94A3B8' }}>Standard Fitness GST:</span>
                <strong style={{ color: 'var(--accent)' }}>18% (9% CGST + 9% SGST)</strong>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', borderBottom: '1px solid rgba(255, 255, 255, 0.06)' }}>
                <span style={{ color: '#94A3B8' }}>Active Tax Invoices:</span>
                <strong style={{ color: '#FFFFFF' }}>{invoices.length} Invoices Issued</strong>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0' }}>
                <span style={{ color: '#94A3B8' }}>Quarterly Filing Status:</span>
                <span style={{ color: '#34D399', fontWeight: 700 }}>Compliant (Q3 2026)</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal: Add New Expense */}
      {showAddExpenseModal && (
        <div className="mp-modal-backdrop" onClick={() => setShowAddExpenseModal(false)}>
          <div className="mp-modal-box" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '460px' }}>
            <div className="mp-modal-header">
              <h3>Log Facility Expense</h3>
              <button onClick={() => setShowAddExpenseModal(false)} className="mp-close-btn">
                ✕
              </button>
            </div>
            <form onSubmit={handleExpenseSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <div>
                <label style={{ fontSize: '0.74rem', color: '#94A3B8', display: 'block', marginBottom: '4px' }}>Category *</label>
                <select
                  value={expenseForm.category}
                  onChange={(e) => setExpenseForm({ ...expenseForm, category: e.target.value })}
                  className="form-input"
                >
                  {EXPENSE_CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>

              <div>
                <label style={{ fontSize: '0.74rem', color: '#94A3B8', display: 'block', marginBottom: '4px' }}>Amount (INR ₹) *</label>
                <input
                  type="number"
                  value={expenseForm.amount}
                  onChange={(e) => setExpenseForm({ ...expenseForm, amount: e.target.value })}
                  placeholder="e.g. 15000"
                  className="form-input"
                  required
                />
              </div>

              <div>
                <label style={{ fontSize: '0.74rem', color: '#94A3B8', display: 'block', marginBottom: '4px' }}>Description / Vendor *</label>
                <input
                  type="text"
                  value={expenseForm.description}
                  onChange={(e) => setExpenseForm({ ...expenseForm, description: e.target.value })}
                  placeholder="e.g. Electricity BESCOM bill for October"
                  className="form-input"
                  required
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                <div>
                  <label style={{ fontSize: '0.74rem', color: '#94A3B8', display: 'block', marginBottom: '4px' }}>Date</label>
                  <input
                    type="date"
                    value={expenseForm.date}
                    onChange={(e) => setExpenseForm({ ...expenseForm, date: e.target.value })}
                    className="form-input"
                  />
                </div>
                <div>
                  <label style={{ fontSize: '0.74rem', color: '#94A3B8', display: 'block', marginBottom: '4px' }}>Payment Mode</label>
                  <select
                    value={expenseForm.method}
                    onChange={(e) => setExpenseForm({ ...expenseForm, method: e.target.value })}
                    className="form-input"
                  >
                    <option value="Bank Transfer">Bank Transfer</option>
                    <option value="UPI">UPI</option>
                    <option value="Corporate Card">Corporate Card</option>
                    <option value="Cash">Cash Voucher</option>
                  </select>
                </div>
              </div>

              <button type="submit" className="btn btn-primary" style={{ marginTop: '6px' }}>
                Record Expense
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Modal: View Printable Commercial Tax Invoice */}
      {selectedInvoiceForView && (
        <div className="mp-modal-backdrop" onClick={() => setSelectedInvoiceForView(null)}>
          <div className="mp-modal-box" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '580px', background: '#FFFFFF', color: '#0F172A', padding: '28px' }}>
            {/* Invoice Printable View */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', borderBottom: '2px solid #0F172A', paddingBottom: '16px', marginBottom: '18px' }}>
              <div>
                <h2 style={{ fontSize: '1.4rem', fontWeight: 900, margin: 0, color: '#0F172A' }}>KINETIX ATHLETIC CLUB</h2>
                <div style={{ fontSize: '0.76rem', color: '#475569', marginTop: '4px' }}>
                  Apex Pinnacle Towers, 100 Feet Road, Indiranagar, Bengaluru 560038<br />
                  GSTIN: <strong>29AAAAA0000A1Z5</strong> • Phone: +91 98765 43210
                </div>
              </div>
              <div style={{ textAlign: 'right' }}>
                <span style={{ fontSize: '0.74rem', fontWeight: 800, color: '#0284C7', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                  TAX INVOICE
                </span>
                <strong style={{ display: 'block', fontSize: '1rem', color: '#0F172A' }}>
                  {selectedInvoiceForView.invoice_number}
                </strong>
                <span style={{ fontSize: '0.74rem', color: '#64748B' }}>Date: {selectedInvoiceForView.issue_date}</span>
              </div>
            </div>

            {/* Billed to */}
            <div style={{ marginBottom: '18px', background: '#F8FAFC', padding: '12px 14px', borderRadius: '8px' }}>
              <span style={{ fontSize: '0.68rem', fontWeight: 800, color: '#64748B', textTransform: 'uppercase' }}>BILLED TO ATHLETE MEMBER</span>
              <strong style={{ display: 'block', fontSize: '1.05rem', color: '#0F172A', margin: '2px 0' }}>{selectedInvoiceForView.member_name}</strong>
              <div style={{ fontSize: '0.78rem', color: '#475569' }}>
                Email: {selectedInvoiceForView.member_email} • Phone: {selectedInvoiceForView.member_phone}
              </div>
            </div>

            {/* Line Items Table */}
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.84rem', marginBottom: '18px' }}>
              <thead>
                <tr style={{ background: '#F1F5F9', borderBottom: '1px solid #CBD5E1', textAlign: 'left' }}>
                  <th style={{ padding: '8px 10px' }}>Description</th>
                  <th style={{ padding: '8px 10px' }}>Period</th>
                  <th style={{ padding: '8px 10px', textAlign: 'right' }}>Amount</th>
                </tr>
              </thead>
              <tbody>
                <tr style={{ borderBottom: '1px solid #E2E8F0' }}>
                  <td style={{ padding: '10px' }}>
                    <strong>{selectedInvoiceForView.plan_name} Membership Package</strong>
                    <div style={{ fontSize: '0.72rem', color: '#64748B' }}>Full facility, Olympic lifting zones &amp; sauna access</div>
                  </td>
                  <td style={{ padding: '10px', color: '#475569' }}>{selectedInvoiceForView.plan_duration}</td>
                  <td style={{ padding: '10px', textAlign: 'right', fontWeight: 700 }}>₹{selectedInvoiceForView.subtotal}</td>
                </tr>
              </tbody>
            </table>

            {/* Summary Totals */}
            <div style={{ width: '240px', marginLeft: 'auto', display: 'flex', flexDirection: 'column', gap: '6px', fontSize: '0.84rem', marginBottom: '20px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', color: '#475569' }}>
                <span>Subtotal:</span>
                <span>₹{selectedInvoiceForView.subtotal}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', color: '#475569' }}>
                <span>GST (18%):</span>
                <span>₹{selectedInvoiceForView.tax_amount}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '1.1rem', fontWeight: 900, color: '#0F172A', borderTop: '2px solid #0F172A', paddingTop: '6px' }}>
                <span>Total Paid:</span>
                <span>₹{selectedInvoiceForView.total_amount}</span>
              </div>
            </div>

            {/* Actions */}
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', borderTop: '1px solid #E2E8F0', paddingTop: '14px' }}>
              <button
                onClick={() => {
                  window.print();
                }}
                className="btn btn-secondary btn-sm"
                style={{ background: '#F1F5F9', color: '#0F172A', border: '1px solid #CBD5E1', display: 'inline-flex', alignItems: 'center', gap: '6px' }}
              >
                <Printer size={15} />
                <span>Print Invoice</span>
              </button>
              <button
                onClick={() => setSelectedInvoiceForView(null)}
                className="btn btn-primary btn-sm"
                style={{ background: '#0F172A', color: '#FFFFFF' }}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
