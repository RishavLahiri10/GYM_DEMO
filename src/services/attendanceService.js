import { supabase, isSupabaseConfigured } from '../lib/supabaseClient';

const INITIAL_ATTENDANCE = [];

export const getAttendanceLogs = async () => {
  try {
    if (isSupabaseConfigured) {
      const { data, error } = await supabase
        .from('attendance')
        .select('*')
        .order('check_in_time', { ascending: false });
      if (!error && data) return data;
    }
  } catch (e) {}

  const stored = localStorage.getItem('kinetix_attendance_logs');
  if (stored) {
    try { return JSON.parse(stored); } catch (e) {}
  }
  localStorage.setItem('kinetix_attendance_logs', JSON.stringify(INITIAL_ATTENDANCE));
  return INITIAL_ATTENDANCE;
};

export const recordCheckIn = async (member, method = 'Manual Check-in') => {
  const current = await getAttendanceLogs();
  const now = new Date();
  const timeString = now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
  const dateString = now.toISOString().slice(0, 10);

  const newLog = {
    id: `att-${Date.now()}`,
    member_id: member.id,
    member_name: member.name,
    plan: member.plan || 'PRO',
    date: dateString,
    check_in_time: timeString,
    check_out_time: null,
    method,
    status: 'On Floor (Active)',
    created_at: now.toISOString()
  };

  const updated = [newLog, ...current];
  localStorage.setItem('kinetix_attendance_logs', JSON.stringify(updated));

  if (isSupabaseConfigured) {
    try {
      await supabase.from('attendance').insert([newLog]);
    } catch (e) {}
  }

  window.dispatchEvent(new Event('kinetix_attendance_updated'));
  return newLog;
};

export const recordCheckOut = async (logId) => {
  const current = await getAttendanceLogs();
  const now = new Date();
  const timeString = now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });

  const updated = current.map(item => {
    if (item.id === logId) {
      return {
        ...item,
        check_out_time: timeString,
        status: 'Completed'
      };
    }
    return item;
  });

  localStorage.setItem('kinetix_attendance_logs', JSON.stringify(updated));

  if (isSupabaseConfigured) {
    try {
      await supabase.from('attendance').update({ check_out_time: timeString, status: 'Completed' }).eq('id', logId);
    } catch (e) {}
  }

  window.dispatchEvent(new Event('kinetix_attendance_updated'));
  return updated;
};

export const getMemberAttendanceStats = async (memberId) => {
  const logs = await getAttendanceLogs();
  const memberLogs = logs.filter(l => l.member_id === memberId);
  const thisMonth = new Date().toISOString().slice(0, 7);
  const monthLogs = memberLogs.filter(l => l.date && l.date.startsWith(thisMonth));

  return {
    totalSessions: memberLogs.length,
    thisMonthSessions: monthLogs.length,
    streak: Math.min(memberLogs.length, 12),
    recentLogs: memberLogs.slice(0, 10)
  };
};
