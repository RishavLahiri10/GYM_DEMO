import { supabase, isSupabaseConfigured } from '../lib/supabaseClient';

const INITIAL_EXPENSES = [
  { id: 'exp-1', category: 'Rent', amount: 125000, date: '2026-10-01', description: 'Facility lease (18,000 sq.ft Indiranagar building)', method: 'Bank Transfer' },
  { id: 'exp-2', category: 'Salaries', amount: 85000, date: '2026-10-05', description: 'Trainers & cleaning staff monthly stipend', method: 'Direct Deposit' },
  { id: 'exp-3', category: 'Electricity', amount: 18500, date: '2026-10-08', description: 'Commercial AC & lighting power utility', method: 'Auto Debit' },
  { id: 'exp-4', category: 'Maintenance', amount: 9200, date: '2026-10-10', description: 'Eleiko barbell re-greasing & sauna servicing', method: 'UPI' },
  { id: 'exp-5', category: 'Marketing', amount: 14000, date: '2026-10-12', description: 'Meta Ads & Indiranagar fitness campaign', method: 'Corporate Card' }
];

export const getExpenses = async () => {
  const stored = localStorage.getItem('kinetix_expenses');
  if (stored) {
    try { return JSON.parse(stored); } catch (e) {}
  }
  localStorage.setItem('kinetix_expenses', JSON.stringify(INITIAL_EXPENSES));
  return INITIAL_EXPENSES;
};

export const saveExpense = async (expense) => {
  const current = await getExpenses();
  const newExp = {
    ...expense,
    id: expense.id || `exp-${Date.now()}`,
    date: expense.date || new Date().toISOString().slice(0, 10)
  };
  const updated = [newExp, ...current];
  localStorage.setItem('kinetix_expenses', JSON.stringify(updated));
  window.dispatchEvent(new Event('kinetix_finance_updated'));
  return updated;
};

export const generateInvoice = (member, paymentData = {}) => {
  const invoiceNumber = `INV-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`;
  const planFee = Number(paymentData.amount || member.fee_amount || 1499);
  const discount = Number(paymentData.discount || 0);
  const subtotal = Math.max(0, planFee - discount);
  const taxRate = 0.18; // 18% GST standard fitness
  const taxAmount = Math.round(subtotal * taxRate);
  const total = subtotal + taxAmount;

  const invoice = {
    id: `inv-${Date.now()}`,
    invoice_number: invoiceNumber,
    member_id: member.id,
    member_name: member.name,
    member_email: member.email,
    member_phone: member.phone || '+91 98765 00000',
    plan_name: member.plan || 'PRO Athletic',
    plan_duration: member.plan_duration || '1 Year',
    issue_date: new Date().toLocaleDateString('en-GB'),
    due_date: member.next_due_date || new Date().toLocaleDateString('en-GB'),
    payment_method: paymentData.paymentMethod || 'UPI',
    status: paymentData.status || 'Paid',
    subtotal,
    discount,
    tax_amount: taxAmount,
    total_amount: total,
    transaction_id: `TXN-${Date.now().toString().slice(-8)}`
  };

  try {
    const existingRaw = localStorage.getItem('kinetix_invoices');
    const existing = existingRaw ? JSON.parse(existingRaw) : [];
    localStorage.setItem('kinetix_invoices', JSON.stringify([invoice, ...existing]));
  } catch (e) {}

  return invoice;
};

export const getInvoices = async (memberId = null) => {
  let list = [];
  try {
    const stored = localStorage.getItem('kinetix_invoices');
    if (stored) list = JSON.parse(stored);
  } catch (e) {}

  if (list.length === 0) {
    // Generate initial demo invoice
    list = [
      generateInvoice({
        id: 'mem-1',
        name: 'Vikram Sharma',
        email: 'vikram.s@example.com',
        phone: '+91 98765 11223',
        plan: 'ELITE VIP',
        fee_amount: 2499
      }, { status: 'Paid', paymentMethod: 'UPI' }),
      generateInvoice({
        id: 'mem-2',
        name: 'Priya Menon',
        email: 'priya.m@example.com',
        phone: '+91 98450 44332',
        plan: 'PRO',
        fee_amount: 1499
      }, { status: 'Paid', paymentMethod: 'Card' })
    ];
  }

  if (memberId) {
    return list.filter(i => i.member_id === memberId);
  }
  return list;
};
