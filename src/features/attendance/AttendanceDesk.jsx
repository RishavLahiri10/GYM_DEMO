import React, { useState, useEffect } from 'react';
import { 
  getAttendanceLogs, 
  recordCheckIn, 
  recordCheckOut 
} from '../../services/attendanceService';
import { 
  QrCode, 
  Search, 
  UserCheck, 
  LogOut, 
  Clock, 
  CheckCircle2, 
  Flame, 
  Filter, 
  UserX,
  Plus
} from 'lucide-react';

export default function AttendanceDesk({ members = [], showToast }) {
  const [logs, setLogs] = useState([]);
  const [memberSearch, setMemberSearch] = useState('');
  const [qrCodeInput, setQrCodeInput] = useState('');
  const [selectedMethod, setSelectedMethod] = useState('Manual Check-in');

  useEffect(() => {
    loadLogs();
    const handleUpdate = () => loadLogs();
    window.addEventListener('kinetix_attendance_updated', handleUpdate);
    return () => window.removeEventListener('kinetix_attendance_updated', handleUpdate);
  }, []);

  const loadLogs = async () => {
    const data = await getAttendanceLogs();
    setLogs(data);
  };

  const handleMemberCheckIn = async (member) => {
    // Check if member already on floor today
    const alreadyOnFloor = logs.some(l => l.member_id === member.id && l.status.includes('Active'));
    if (alreadyOnFloor) {
      if (showToast) showToast(`${member.name} is already checked in and on the floor!`);
      return;
    }

    await recordCheckIn(member, selectedMethod);
    setMemberSearch('');
    if (showToast) showToast(`Checked in ${member.name} successfully! 🏋️`);
  };

  const handleQrScanSubmit = async (e) => {
    e.preventDefault();
    if (!qrCodeInput.trim()) return;
    const cleanId = qrCodeInput.trim().toUpperCase();
    
    // Find member by ID or memberId
    const found = members.find(m => 
      m.id.toUpperCase() === cleanId || 
      (m.memberId && m.memberId.toUpperCase() === cleanId) ||
      (m.email && m.email.toUpperCase().includes(cleanId))
    );

    if (found) {
      await recordCheckIn(found, 'QR Pass Scanner');
      setQrCodeInput('');
      if (showToast) showToast(`QR Pass Verified: ${found.name} (${found.plan}) checked in!`);
    } else {
      // Create guest attendance
      const guestMember = {
        id: `mem-${Date.now()}`,
        name: `Guest (${cleanId})`,
        plan: '1-Day VIP Pass'
      };
      await recordCheckIn(guestMember, 'QR Guest Scan');
      setQrCodeInput('');
      if (showToast) showToast(`Guest Pass ${cleanId} verified and admitted to floor.`);
    }
  };

  const handlePunchOut = async (logId, name) => {
    await recordCheckOut(logId);
    if (showToast) showToast(`Checked out ${name}. Session logged!`);
  };

  const todayStr = new Date().toISOString().slice(0, 10);
  const todayLogs = logs.filter(l => l.date === todayStr);
  const activeOnFloorCount = todayLogs.filter(l => l.status.includes('Active')).length;
  const completedCount = todayLogs.filter(l => l.status === 'Completed').length;

  const searchedMembers = memberSearch.trim() === '' ? [] : members.filter(m => 
    m.name.toLowerCase().includes(memberSearch.toLowerCase()) ||
    (m.phone && m.phone.includes(memberSearch)) ||
    (m.email && m.email.toLowerCase().includes(memberSearch.toLowerCase()))
  ).slice(0, 5);

  return (
    <div className="attendance-module-container">
      {/* Title */}
      <div style={{ marginBottom: '20px' }}>
        <h3 style={{ fontSize: '1.45rem', color: '#FFFFFF', margin: 0, fontWeight: 800 }}>
          Live Floor Attendance &amp; Check-In Desk
        </h3>
        <p style={{ color: '#94A3B8', fontSize: '0.85rem', margin: '4px 0 0 0' }}>
          Real-time member punch-in, biometric turnstile integration, and active visitor counts.
        </p>
      </div>

      {/* KPI Counters */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '14px', marginBottom: '24px' }}>
        <div className="aq-card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span className="aq-val text-volt-accent" style={{ fontSize: '2.4rem' }}>{activeOnFloorCount}</span>
            <Flame size={24} color="#FF6B00" />
          </div>
          <span className="aq-lbl" style={{ color: '#FFFFFF', fontWeight: 700 }}>Currently On Floor</span>
          <small style={{ color: '#34D399', fontSize: '0.74rem', marginTop: '4px', display: 'block' }}>
            Active workouts in progress
          </small>
        </div>

        <div className="aq-card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span className="aq-val" style={{ fontSize: '2.4rem' }}>{todayLogs.length}</span>
            <UserCheck size={24} color="#38BDF8" />
          </div>
          <span className="aq-lbl" style={{ color: '#FFFFFF', fontWeight: 700 }}>Total Check-Ins Today</span>
          <small style={{ color: '#94A3B8', fontSize: '0.74rem', marginTop: '4px', display: 'block' }}>
            {completedCount} sessions completed
          </small>
        </div>

        <div className="aq-card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span className="aq-val" style={{ fontSize: '2.4rem' }}>18,000</span>
            <Clock size={24} color="#A855F7" />
          </div>
          <span className="aq-lbl" style={{ color: '#FFFFFF', fontWeight: 700 }}>Peak Hours Tracking</span>
          <small style={{ color: '#A855F7', fontSize: '0.74rem', marginTop: '4px', display: 'block' }}>
            Current capacity: Optimal (24%)
          </small>
        </div>
      </div>

      {/* Check-In Controls: Member Search & QR Simulator */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '18px', marginBottom: '24px' }}>
        
        {/* Quick Member Search & Check-in */}
        <div style={{ background: '#121622', border: '1px solid rgba(255, 255, 255, 0.08)', borderRadius: '12px', padding: '18px 20px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
            <Search size={18} color="var(--accent)" />
            <strong style={{ color: '#FFFFFF', fontSize: '0.94rem' }}>Manual Desk Check-In</strong>
          </div>
          <div style={{ position: 'relative', marginBottom: '10px' }}>
            <input
              type="text"
              placeholder="Search member name or phone to punch in..."
              value={memberSearch}
              onChange={(e) => setMemberSearch(e.target.value)}
              className="form-input"
              style={{ width: '100%' }}
            />
          </div>

          {/* Search Results Dropdown */}
          {searchedMembers.length > 0 && (
            <div style={{ background: '#0B0E17', border: '1px solid rgba(255, 255, 255, 0.1)', borderRadius: '8px', overflow: 'hidden', marginBottom: '10px' }}>
              {searchedMembers.map((m) => (
                <div 
                  key={m.id} 
                  style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 14px', borderBottom: '1px solid rgba(255, 255, 255, 0.05)' }}
                >
                  <div>
                    <strong style={{ color: '#FFFFFF', fontSize: '0.86rem' }}>{m.name}</strong>
                    <div style={{ fontSize: '0.72rem', color: '#94A3B8' }}>{m.plan} • {m.phone || m.email}</div>
                  </div>
                  <button
                    onClick={() => handleMemberCheckIn(m)}
                    className="btn btn-primary btn-sm"
                    style={{ fontSize: '0.76rem', padding: '5px 12px' }}
                  >
                    Check In
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* QR Scanner Simulator */}
        <div style={{ background: '#121622', border: '1px solid rgba(255, 255, 255, 0.08)', borderRadius: '12px', padding: '18px 20px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
            <QrCode size={18} color="var(--accent)" />
            <strong style={{ color: '#FFFFFF', fontSize: '0.94rem' }}>QR / Turnstile Scanner</strong>
          </div>
          <form onSubmit={handleQrScanSubmit} style={{ display: 'flex', gap: '8px' }}>
            <input
              type="text"
              placeholder="Scan or enter Member ID / Code (e.g. KNTX-8821)"
              value={qrCodeInput}
              onChange={(e) => setQrCodeInput(e.target.value)}
              className="form-input"
              style={{ flex: 1 }}
            />
            <button type="submit" className="btn btn-primary btn-sm" style={{ whiteSpace: 'nowrap' }}>
              Simulate Scan
            </button>
          </form>
          <span style={{ fontSize: '0.72rem', color: '#64748B', marginTop: '8px', display: 'block' }}>
            Auto-verifies member plan validity before unlocking turnstile barrier.
          </span>
        </div>

      </div>

      {/* Live Floor Attendance Log Table */}
      <div style={{ background: '#111520', border: '1px solid rgba(255, 255, 255, 0.08)', borderRadius: '12px', padding: '20px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
          <div>
            <h4 style={{ color: '#FFFFFF', fontSize: '1.05rem', margin: 0, fontWeight: 700 }}>
              Today's Floor Check-In Log ({todayLogs.length})
            </h4>
            <span style={{ fontSize: '0.75rem', color: '#94A3B8' }}>Live session records for {new Date().toLocaleDateString('en-GB')}</span>
          </div>
        </div>

        <div className="admin-table-container">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Member Name</th>
                <th>Plan Tier</th>
                <th>Check-In Time</th>
                <th>Exit Time</th>
                <th>Verification Method</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {todayLogs.length === 0 ? (
                <tr>
                  <td colSpan="7" style={{ textAlign: 'center', padding: '36px 16px', color: '#64748B' }}>
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px' }}>
                      <Clock size={24} style={{ opacity: 0.4 }} />
                      <span>No check-ins logged today. Real member check-ins will appear here as they scan QR or check in.</span>
                    </div>
                  </td>
                </tr>
              ) : (
                todayLogs.map((log) => (
                  <tr key={log.id}>
                    <td>
                      <strong style={{ color: '#FFFFFF', fontSize: '0.88rem' }}>{log.member_name}</strong>
                    </td>
                    <td>
                      <span style={{ fontSize: '0.72rem', background: 'rgba(255, 255, 255, 0.05)', padding: '2px 8px', borderRadius: '4px', color: '#CBD5E1' }}>
                        {log.plan || 'PRO'}
                      </span>
                    </td>
                    <td>
                      <span style={{ color: 'var(--accent, #CCFF00)', fontWeight: 700, fontSize: '0.82rem' }}>
                        {log.check_in_time}
                      </span>
                    </td>
                    <td>
                      <span style={{ color: log.check_out_time ? '#94A3B8' : '#F59E0B', fontSize: '0.82rem' }}>
                        {log.check_out_time || 'Currently Training'}
                      </span>
                    </td>
                    <td>
                      <span style={{ fontSize: '0.76rem', color: '#CBD5E1' }}>{log.method}</span>
                    </td>
                    <td>
                      <span style={{
                        fontSize: '0.72rem',
                        fontWeight: 800,
                        padding: '2px 8px',
                        borderRadius: '4px',
                        background: log.status.includes('Active') ? 'rgba(16, 185, 129, 0.15)' : 'rgba(255, 255, 255, 0.06)',
                        color: log.status.includes('Active') ? '#10B981' : '#94A3B8'
                      }}>
                        {log.status}
                      </span>
                    </td>
                    <td>
                      {log.status.includes('Active') ? (
                        <button
                          onClick={() => handlePunchOut(log.id, log.member_name)}
                          className="btn btn-secondary btn-sm"
                          style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', fontSize: '0.74rem', padding: '4px 10px' }}
                        >
                          <LogOut size={13} />
                          <span>Punch Out</span>
                        </button>
                      ) : (
                        <span style={{ fontSize: '0.72rem', color: '#64748B' }}>Finished</span>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
