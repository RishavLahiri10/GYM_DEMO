import React, { useState, useEffect } from 'react';
import { 
  DEFAULT_WORKOUT_PLAN, 
  DEFAULT_DIET_PLAN, 
  getMemberProgress, 
  saveProgressEntry 
} from '../../services/memberPortalService';
import { getMemberAttendanceStats, recordCheckIn } from '../../services/attendanceService';
import { getInvoices } from '../../services/billingService';
import { SCHEDULE_DATA } from '../../data/gymData';
import { 
  Dumbbell, 
  Calendar, 
  Clock, 
  Flame, 
  CheckCircle2, 
  QrCode, 
  Utensils, 
  TrendingUp, 
  FileText, 
  User, 
  ShieldCheck, 
  LogOut, 
  X, 
  ArrowLeft,
  ChevronRight,
  Sparkles,
  Award,
  AlertCircle,
  Plus,
  Download,
  Share2
} from 'lucide-react';
import './MemberPortal.css';

export default function MemberPortal({ isOpen, onClose, memberUser, onSwitchToPublic }) {
  const [activeTab, setActiveTab] = useState('home'); // 'home' | 'workout' | 'diet' | 'progress' | 'classes' | 'billing' | 'pass'
  const [workout, setWorkout] = useState(DEFAULT_WORKOUT_PLAN);
  const [progressData, setProgressData] = useState(getMemberProgress());
  const [attendanceStats, setAttendanceStats] = useState({ totalSessions: 18, thisMonthSessions: 8, streak: 12 });
  const [invoices, setInvoices] = useState([]);
  const [myBookedClasses, setMyBookedClasses] = useState(['Strength & Power (Monday 06:00 AM)']);
  const [showProgressModal, setShowProgressModal] = useState(false);
  const [newWeight, setNewWeight] = useState('');
  const [newBodyFat, setNewBodyFat] = useState('');
  const [qrCheckedIn, setQrCheckedIn] = useState(false);
  const [toastMsg, setToastMsg] = useState('');

  const currentMember = memberUser || {
    id: 'mem-1',
    name: 'Vikram Sharma',
    email: 'vikram.s@example.com',
    plan: 'ELITE VIP',
    plan_duration: '1 Year',
    memberId: 'KNTX-8821',
    expiryDate: '2026-08-10',
    trainer: 'Arjun Sharma'
  };

  useEffect(() => {
    async function loadStats() {
      const stats = await getMemberAttendanceStats(currentMember.id);
      if (stats) setAttendanceStats(stats);
      const invs = await getInvoices(currentMember.id);
      setInvoices(invs);
    }
    if (isOpen) {
      loadStats();
    }
  }, [isOpen, currentMember.id]);

  const showToast = (msg) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(''), 3000);
  };

  const toggleExerciseComplete = (id) => {
    setWorkout(prev => ({
      ...prev,
      exercises: prev.exercises.map(ex => ex.id === id ? { ...ex, completed: !ex.completed } : ex)
    }));
    showToast('Exercise status updated! Keep crushing it! 💪');
  };

  const handleSelfCheckIn = async () => {
    await recordCheckIn(currentMember, 'Digital QR Member Pass');
    setQrCheckedIn(true);
    setAttendanceStats(prev => ({
      ...prev,
      thisMonthSessions: prev.thisMonthSessions + 1,
      totalSessions: prev.totalSessions + 1
    }));
    showToast('Scan Successful! Welcome to KINETIX Gym Floor 🏋️‍♂️');
  };

  const handleBookClass = (classItem) => {
    const key = `${classItem.name} (${classItem.day} ${classItem.time})`;
    if (myBookedClasses.includes(key)) {
      setMyBookedClasses(prev => prev.filter(c => c !== key));
      showToast(`Canceled booking for ${classItem.name}`);
    } else {
      setMyBookedClasses(prev => [...prev, key]);
      showToast(`Spot Confirmed for ${classItem.name}! Added to your schedule.`);
    }
  };

  const handleAddProgress = (e) => {
    e.preventDefault();
    if (!newWeight) return;
    const updated = saveProgressEntry({
      weight: parseFloat(newWeight),
      bodyFat: newBodyFat ? parseFloat(newBodyFat) : 18.2,
      chest: 107,
      waist: 82,
      arms: 38.5
    });
    setProgressData(updated);
    setShowProgressModal(false);
    setNewWeight('');
    setNewBodyFat('');
    showToast('New body metric logged successfully! 📈');
  };

  if (!isOpen) return null;

  return (
    <div className="member-portal-overlay">
      <div className="member-portal-container">
        
        {/* Toast alert */}
        {toastMsg && (
          <div className="member-toast">
            <Sparkles size={16} />
            <span>{toastMsg}</span>
          </div>
        )}

        {/* Top Header Bar */}
        <header className="mp-header">
          <div className="mp-header-left">
            <button 
              onClick={onClose} 
              className="mp-back-btn" 
              title="Return to Public Website"
              aria-label="Return to website"
            >
              <ArrowLeft size={18} />
              <span className="mp-back-text">Public Website</span>
            </button>
            <div className="mp-brand-pill">
              <Dumbbell size={18} color="var(--accent)" />
              <span className="mp-brand-name">KINETIX ATHLETE PASS</span>
            </div>
          </div>

          <div className="mp-header-right">
            <div className="mp-user-chip">
              <img 
                src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=120&auto=format&fit=crop" 
                alt="Member Avatar" 
                className="mp-avatar"
              />
              <div className="mp-user-meta">
                <strong className="mp-member-name">{currentMember.name}</strong>
                <span className="mp-member-badge">{currentMember.plan || 'ELITE VIP'}</span>
              </div>
            </div>

            <button 
              onClick={onClose} 
              className="mp-close-btn"
              aria-label="Close portal"
            >
              <X size={20} />
            </button>
          </div>
        </header>

        {/* Portal Body with Navigation */}
        <div className="mp-content-layout">
          
          {/* Sidebar / Mobile Bottom Nav */}
          <nav className="mp-nav-panel">
            <div className="mp-nav-group">
              <button 
                className={`mp-nav-item ${activeTab === 'home' ? 'active' : ''}`}
                onClick={() => setActiveTab('home')}
              >
                <User size={18} />
                <span>My Dashboard</span>
              </button>

              <button 
                className={`mp-nav-item ${activeTab === 'pass' ? 'active' : ''}`}
                onClick={() => setActiveTab('pass')}
              >
                <QrCode size={18} />
                <span>QR Check-in Pass</span>
              </button>

              <button 
                className={`mp-nav-item ${activeTab === 'workout' ? 'active' : ''}`}
                onClick={() => setActiveTab('workout')}
              >
                <Dumbbell size={18} />
                <span>Today's Workout</span>
              </button>

              <button 
                className={`mp-nav-item ${activeTab === 'diet' ? 'active' : ''}`}
                onClick={() => setActiveTab('diet')}
              >
                <Utensils size={18} />
                <span>Assigned Diet</span>
              </button>

              <button 
                className={`mp-nav-item ${activeTab === 'progress' ? 'active' : ''}`}
                onClick={() => setActiveTab('progress')}
              >
                <TrendingUp size={18} />
                <span>Body Progress</span>
              </button>

              <button 
                className={`mp-nav-item ${activeTab === 'classes' ? 'active' : ''}`}
                onClick={() => setActiveTab('classes')}
              >
                <Calendar size={18} />
                <span>Book Classes</span>
              </button>

              <button 
                className={`mp-nav-item ${activeTab === 'billing' ? 'active' : ''}`}
                onClick={() => setActiveTab('billing')}
              >
                <FileText size={18} />
                <span>Invoices & Plans</span>
              </button>
            </div>

            <div className="mp-nav-footer">
              <div className="mp-coach-chip">
                <span className="mp-coach-lbl">Assigned Coach</span>
                <strong className="mp-coach-name">Arjun Sharma</strong>
              </div>
            </div>
          </nav>

          {/* Main Content Area */}
          <main className="mp-main-viewport">
            
            {/* TAB 1: HOME / DASHBOARD */}
            {activeTab === 'home' && (
              <div className="mp-tab-pane">
                
                {/* Welcome Hero Card */}
                <div className="mp-welcome-card">
                  <div className="mp-welcome-info">
                    <span className="mp-welcome-badge">ATHLETE PROFILE</span>
                    <h2>Good day, {currentMember.name.split(' ')[0]}! 🔥</h2>
                    <p>You have logged <strong>{attendanceStats.thisMonthSessions || 8} sessions</strong> this month. Your next workout is ready.</p>
                  </div>
                  <div className="mp-streak-pill">
                    <Flame size={24} color="#FF6B00" />
                    <div className="mp-streak-meta">
                      <span className="mp-streak-num">{attendanceStats.streak || 12} DAYS</span>
                      <span className="mp-streak-lbl">Active Streak</span>
                    </div>
                  </div>
                </div>

                {/* Key Metrics Grid */}
                <div className="mp-stats-grid">
                  <div className="mp-stat-card">
                    <div className="mps-header">
                      <span>MEMBERSHIP TIER</span>
                      <ShieldCheck size={16} color="var(--accent)" />
                    </div>
                    <strong>{currentMember.plan || 'ELITE VIP'}</strong>
                    <p className="mps-sub">Valid till {currentMember.expiryDate || 'August 2026'}</p>
                  </div>

                  <div className="mp-stat-card">
                    <div className="mps-header">
                      <span>TODAY'S WORKOUT</span>
                      <Dumbbell size={16} color="var(--accent)" />
                    </div>
                    <strong>Legs & Core Power</strong>
                    <p className="mps-sub">4 Exercises • 65 Mins Target</p>
                  </div>

                  <div className="mp-stat-card">
                    <div className="mps-header">
                      <span>DAILY NUTRITION</span>
                      <Utensils size={16} color="var(--accent)" />
                    </div>
                    <strong>2,450 kcal</strong>
                    <p className="mps-sub">175g Protein Target</p>
                  </div>

                  <div className="mp-stat-card">
                    <div className="mps-header">
                      <span>CURRENT WEIGHT</span>
                      <TrendingUp size={16} color="#10B981" />
                    </div>
                    <strong>81.2 KG</strong>
                    <p className="mps-sub text-success">-7.3 KG since joining</p>
                  </div>
                </div>

                {/* Quick Action Widgets */}
                <div className="mp-twins-grid">
                  
                  {/* Digital Check-in Pass Card */}
                  <div className="mp-card mp-pass-widget">
                    <div className="mp-card-header">
                      <div className="mp-ch-left">
                        <QrCode size={20} color="var(--accent)" />
                        <h3>Instant QR Check-in</h3>
                      </div>
                      <span className="mp-card-badge">LIVE PASS</span>
                    </div>
                    <div className="mp-qr-box">
                      <svg width="140" height="140" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className="qr-svg">
                        <rect width="100" height="100" fill="#FFFFFF" rx="6" />
                        <rect x="10" y="10" width="26" height="26" fill="#000000" />
                        <rect x="14" y="14" width="18" height="18" fill="#FFFFFF" />
                        <rect x="18" y="18" width="10" height="10" fill="#000000" />
                        
                        <rect x="64" y="10" width="26" height="26" fill="#000000" />
                        <rect x="68" y="14" width="18" height="18" fill="#FFFFFF" />
                        <rect x="72" y="18" width="10" height="10" fill="#000000" />
                        
                        <rect x="10" y="64" width="26" height="26" fill="#000000" />
                        <rect x="14" y="68" width="18" height="18" fill="#FFFFFF" />
                        <rect x="18" y="72" width="10" height="10" fill="#000000" />
                        
                        <rect x="42" y="12" width="8" height="16" fill="#000000" />
                        <rect x="44" y="38" width="16" height="8" fill="#000000" />
                        <rect x="12" y="42" width="16" height="8" fill="#000000" />
                        <rect x="42" y="64" width="14" height="14" fill="#000000" />
                        <rect x="64" y="42" width="22" height="12" fill="#000000" />
                        <rect x="64" y="64" width="10" height="18" fill="#000000" />
                        <rect x="80" y="72" width="10" height="14" fill="#000000" />
                      </svg>
                    </div>
                    <div className="mp-qr-details">
                      <strong>MEMBER ID: {currentMember.memberId || 'KNTX-8821'}</strong>
                      <p>Show this screen to front desk or scan at biometric turnstile.</p>
                      <button 
                        onClick={handleSelfCheckIn} 
                        className={`mp-action-btn ${qrCheckedIn ? 'btn-checked-in' : 'btn-checkin'}`}
                      >
                        {qrCheckedIn ? <CheckCircle2 size={16} /> : <QrCode size={16} />}
                        <span>{qrCheckedIn ? 'Logged On Floor Today' : 'Simulate Turnstile Check-In'}</span>
                      </button>
                    </div>
                  </div>

                  {/* Today's Workout Quick View */}
                  <div className="mp-card mp-workout-widget">
                    <div className="mp-card-header">
                      <div className="mp-ch-left">
                        <Dumbbell size={20} color="var(--accent)" />
                        <h3>{workout.dayTitle}</h3>
                      </div>
                      <button onClick={() => setActiveTab('workout')} className="mp-link-btn">
                        <span>Full Routine</span>
                        <ChevronRight size={14} />
                      </button>
                    </div>

                    <div className="mp-ex-mini-list">
                      {workout.exercises.map((ex) => (
                        <div 
                          key={ex.id} 
                          onClick={() => toggleExerciseComplete(ex.id)}
                          className={`mp-ex-mini-item ${ex.completed ? 'completed' : ''}`}
                        >
                          <div className="mp-ex-check">
                            <CheckCircle2 size={16} color={ex.completed ? '#10B981' : '#64748B'} />
                          </div>
                          <div className="mp-ex-txt">
                            <span className="ex-name">{ex.name}</span>
                            <span className="ex-meta">{ex.sets} Sets × {ex.reps} • {ex.targetWeight}</span>
                          </div>
                        </div>
                      ))}
                    </div>

                    <button onClick={() => setActiveTab('workout')} className="mp-full-cta">
                      Open Interactive Workout Mode
                    </button>
                  </div>

                </div>

              </div>
            )}

            {/* TAB 2: WORKOUT PLAN */}
            {activeTab === 'workout' && (
              <div className="mp-tab-pane">
                <div className="mp-section-header">
                  <div>
                    <h2>{workout.dayTitle}</h2>
                    <p className="mp-sub-lead">Assigned by {workout.trainerName} • Target: {workout.targetMuscle}</p>
                  </div>
                  <div className="mp-badge-tag">{workout.estimatedTime}</div>
                </div>

                <div className="mp-exercise-cards-stack">
                  {workout.exercises.map((ex, idx) => (
                    <div key={ex.id} className={`mp-exercise-full-card ${ex.completed ? 'done' : ''}`}>
                      <div className="mpe-top">
                        <div className="mpe-left">
                          <span className="mpe-num">0{idx + 1}</span>
                          <div>
                            <h3>{ex.name}</h3>
                            <span className="mpe-muscle">{ex.muscle} • {ex.equipment}</span>
                          </div>
                        </div>
                        <button 
                          onClick={() => toggleExerciseComplete(ex.id)} 
                          className={`mpe-status-toggle ${ex.completed ? 'completed' : ''}`}
                        >
                          <CheckCircle2 size={18} />
                          <span>{ex.completed ? 'Finished' : 'Mark Done'}</span>
                        </button>
                      </div>

                      <div className="mpe-params-grid">
                        <div className="mpe-param">
                          <span className="param-lbl">SETS</span>
                          <strong className="param-val">{ex.sets}</strong>
                        </div>
                        <div className="mpe-param">
                          <span className="param-lbl">TARGET REPS</span>
                          <strong className="param-val">{ex.reps}</strong>
                        </div>
                        <div className="mpe-param">
                          <span className="param-lbl">LOAD / WEIGHT</span>
                          <strong className="param-val">{ex.targetWeight}</strong>
                        </div>
                        <div className="mpe-param">
                          <span className="param-lbl">REST TIME</span>
                          <strong className="param-val">{ex.rest}</strong>
                        </div>
                      </div>

                      <div className="mpe-instructions">
                        <strong>Coaching Cue:</strong> {ex.instructions}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* TAB 3: DIET PROTOCOL */}
            {activeTab === 'diet' && (
              <div className="mp-tab-pane">
                <div className="mp-section-header">
                  <div>
                    <h2>{DEFAULT_DIET_PLAN.title}</h2>
                    <p className="mp-sub-lead">Personalized macronutrient distribution based on InBody 570 scan</p>
                  </div>
                  <div className="mp-badge-tag">{DEFAULT_DIET_PLAN.dailyCalorieTarget} kcal/day</div>
                </div>

                {/* Macro Target Bars */}
                <div className="mp-macro-row">
                  <div className="macro-card">
                    <span className="mc-lbl">DAILY CALORIES</span>
                    <strong className="mc-val">{DEFAULT_DIET_PLAN.dailyCalorieTarget} kcal</strong>
                  </div>
                  <div className="macro-card">
                    <span className="mc-lbl">PROTEIN</span>
                    <strong className="mc-val text-volt">{DEFAULT_DIET_PLAN.proteinTarget}</strong>
                  </div>
                  <div className="macro-card">
                    <span className="mc-lbl">CARBOHYDRATES</span>
                    <strong className="mc-val">{DEFAULT_DIET_PLAN.carbsTarget}</strong>
                  </div>
                  <div className="macro-card">
                    <span className="mc-lbl">HEALTHY FATS</span>
                    <strong className="mc-val">{DEFAULT_DIET_PLAN.fatsTarget}</strong>
                  </div>
                  <div className="macro-card">
                    <span className="mc-lbl">HYDRATION</span>
                    <strong className="mc-val">{DEFAULT_DIET_PLAN.waterTarget}</strong>
                  </div>
                </div>

                {/* Meal Timeline */}
                <div className="mp-meals-stack">
                  {DEFAULT_DIET_PLAN.meals.map((m, idx) => (
                    <div key={idx} className="mp-meal-card">
                      <div className="meal-header">
                        <div className="meal-title-block">
                          <Clock size={16} color="var(--accent)" />
                          <span className="meal-time">{m.time}</span>
                          <h4>{m.meal}</h4>
                        </div>
                        <span className="meal-cal-pill">{m.calories} kcal</span>
                      </div>
                      <p className="meal-items-text">{m.items}</p>
                      <div className="meal-macro-footer">
                        <span>Protein: <strong>{m.protein}</strong></span>
                        <span>Carbs: <strong>{m.carbs}</strong></span>
                        <span>Fats: <strong>{m.fats}</strong></span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* TAB 4: BODY PROGRESS */}
            {activeTab === 'progress' && (
              <div className="mp-tab-pane">
                <div className="mp-section-header">
                  <div>
                    <h2>Body Transformation & Measurements</h2>
                    <p className="mp-sub-lead">Track your body fat reduction, lean mass progression and weight logs</p>
                  </div>
                  <button onClick={() => setShowProgressModal(true)} className="mp-primary-cta">
                    <Plus size={16} />
                    <span>Log New Weigh-In</span>
                  </button>
                </div>

                {/* Metric Summary Cards */}
                <div className="mp-stats-grid">
                  <div className="mp-stat-card">
                    <span>STARTING WEIGHT</span>
                    <strong>88.5 KG</strong>
                    <p className="mps-sub">Aug 10, 2025</p>
                  </div>
                  <div className="mp-stat-card">
                    <span>LATEST WEIGHT</span>
                    <strong className="text-volt">81.2 KG</strong>
                    <p className="mps-sub text-success">-7.3 KG Net Loss</p>
                  </div>
                  <div className="mp-stat-card">
                    <span>BODY FAT %</span>
                    <strong>18.4%</strong>
                    <p className="mps-sub text-success">-5.8% drop</p>
                  </div>
                  <div className="mp-stat-card">
                    <span>WAIST REDUCTION</span>
                    <strong>83 CM</strong>
                    <p className="mps-sub text-success">-11 CM trimmed</p>
                  </div>
                </div>

                {/* History Table */}
                <div className="mp-card mp-table-card">
                  <div className="mp-card-header">
                    <h3>Measurement History</h3>
                  </div>
                  <div className="mp-table-scroll">
                    <table className="mp-table">
                      <thead>
                        <tr>
                          <th>Date</th>
                          <th>Weight (kg)</th>
                          <th>Body Fat %</th>
                          <th>Chest (cm)</th>
                          <th>Waist (cm)</th>
                          <th>Arms (cm)</th>
                        </tr>
                      </thead>
                      <tbody>
                        {progressData.map((row, idx) => (
                          <tr key={idx}>
                            <td><strong>{row.date}</strong></td>
                            <td className="text-volt font-bold">{row.weight} kg</td>
                            <td>{row.bodyFat}%</td>
                            <td>{row.chest} cm</td>
                            <td>{row.waist} cm</td>
                            <td>{row.arms} cm</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}

            {/* TAB 5: BOOK CLASSES */}
            {activeTab === 'classes' && (
              <div className="mp-tab-pane">
                <div className="mp-section-header">
                  <div>
                    <h2>Weekly Coached Class Booking</h2>
                    <p className="mp-sub-lead">Reserve your spot in high-demand strength, HIIT, and boxing sessions</p>
                  </div>
                </div>

                <div className="mp-classes-grid">
                  {SCHEDULE_DATA.slice(0, 10).map((cls, idx) => {
                    const classKey = `${cls.name} (${cls.day} ${cls.time})`;
                    const isBooked = myBookedClasses.includes(classKey);

                    return (
                      <div key={idx} className={`mp-class-card ${isBooked ? 'booked' : ''}`}>
                        <div className="cls-top">
                          <span className="cls-day-pill">{cls.day}</span>
                          <span className="cls-time-pill">{cls.time}</span>
                        </div>
                        <h3 className="cls-title">{cls.name}</h3>
                        <p className="cls-coach">Coach: <strong>{cls.trainer}</strong> • {cls.duration}</p>
                        <div className="cls-meta-strip">
                          <span className="cls-spots">{cls.spots} spots left</span>
                          <span className="cls-intensity">{cls.intensity}</span>
                        </div>
                        <button 
                          onClick={() => handleBookClass(cls)}
                          className={`cls-book-btn ${isBooked ? 'btn-cancel' : 'btn-reserve'}`}
                        >
                          {isBooked ? 'Cancel Booking' : 'Reserve Spot'}
                        </button>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* TAB 6: INVOICES & BILLING */}
            {activeTab === 'billing' && (
              <div className="mp-tab-pane">
                <div className="mp-section-header">
                  <div>
                    <h2>Membership Invoices & Receipts</h2>
                    <p className="mp-sub-lead">Download official GST tax invoices and verify renewal dates</p>
                  </div>
                </div>

                <div className="mp-card mp-table-card">
                  <div className="mp-card-header">
                    <h3>Billing History</h3>
                  </div>
                  <div className="mp-table-scroll">
                    <table className="mp-table">
                      <thead>
                        <tr>
                          <th>Invoice #</th>
                          <th>Plan</th>
                          <th>Date</th>
                          <th>Subtotal</th>
                          <th>Tax (GST)</th>
                          <th>Total Paid</th>
                          <th>Status</th>
                          <th>Action</th>
                        </tr>
                      </thead>
                      <tbody>
                        {invoices.map((inv, idx) => (
                          <tr key={idx}>
                            <td><strong>{inv.invoice_number}</strong></td>
                            <td>{inv.plan_name}</td>
                            <td>{inv.issue_date}</td>
                            <td>₹{inv.subtotal}</td>
                            <td>₹{inv.tax_amount}</td>
                            <td className="text-volt font-bold">₹{inv.total_amount}</td>
                            <td>
                              <span className="badge-paid">Paid</span>
                            </td>
                            <td>
                              <button 
                                onClick={() => showToast(`Invoice ${inv.invoice_number} downloaded.`)} 
                                className="mp-download-btn"
                                title="Download PDF"
                              >
                                <Download size={14} />
                                <span>Receipt</span>
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}

            {/* TAB 7: FULL QR PASS */}
            {activeTab === 'pass' && (
              <div className="mp-tab-pane mp-pass-fullscreen-tab">
                <div className="mp-gold-card">
                  <div className="mgc-header">
                    <div className="mgc-brand">
                      <Dumbbell size={22} color="#000" />
                      <strong>KINETIX ATHLETIC CLUB</strong>
                    </div>
                    <span className="mgc-tier-badge">VIP ACCESS</span>
                  </div>

                  <div className="mgc-qr-wrap">
                    <svg width="180" height="180" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <rect width="100" height="100" fill="#FFFFFF" rx="8" />
                      <rect x="10" y="10" width="26" height="26" fill="#000" />
                      <rect x="14" y="14" width="18" height="18" fill="#FFF" />
                      <rect x="18" y="18" width="10" height="10" fill="#000" />
                      <rect x="64" y="10" width="26" height="26" fill="#000" />
                      <rect x="68" y="14" width="18" height="18" fill="#FFF" />
                      <rect x="72" y="18" width="10" height="10" fill="#000" />
                      <rect x="10" y="64" width="26" height="26" fill="#000" />
                      <rect x="14" y="68" width="18" height="18" fill="#FFF" />
                      <rect x="18" y="72" width="10" height="10" fill="#000" />
                      <rect x="42" y="12" width="8" height="16" fill="#000" />
                      <rect x="44" y="38" width="16" height="8" fill="#000" />
                      <rect x="12" y="42" width="16" height="8" fill="#000" />
                      <rect x="42" y="64" width="14" height="14" fill="#000" />
                      <rect x="64" y="42" width="22" height="12" fill="#000" />
                      <rect x="64" y="64" width="10" height="18" fill="#000" />
                    </svg>
                  </div>

                  <div className="mgc-info">
                    <h3>{currentMember.name}</h3>
                    <p className="mgc-id">ID: {currentMember.memberId || 'KNTX-8821'}</p>
                    <p className="mgc-plan">Plan: {currentMember.plan || 'ELITE VIP'} • 1 Year</p>
                    <p className="mgc-status">Status: Active Member • Indiranagar Hub</p>
                  </div>

                  <button onClick={handleSelfCheckIn} className="mgc-scan-btn">
                    {qrCheckedIn ? 'Scan Confirmed (Active Today)' : 'Tap to Simulate Check-in Scan'}
                  </button>
                </div>
              </div>
            )}

          </main>
        </div>

        {/* Modal: Log New Progress Weigh-In */}
        {showProgressModal && (
          <div className="mp-modal-backdrop" onClick={() => setShowProgressModal(false)}>
            <div className="mp-modal-box" onClick={(e) => e.stopPropagation()}>
              <div className="mp-modal-header">
                <h3>Log New Weigh-In</h3>
                <button onClick={() => setShowProgressModal(false)} className="mp-close-btn">
                  <X size={18} />
                </button>
              </div>
              <form onSubmit={handleAddProgress} className="mp-modal-form">
                <div className="mp-input-group">
                  <label>Current Weight (kg) *</label>
                  <input 
                    type="number" 
                    step="0.1" 
                    value={newWeight} 
                    onChange={(e) => setNewWeight(e.target.value)} 
                    placeholder="e.g. 80.8" 
                    required 
                    autoFocus
                  />
                </div>
                <div className="mp-input-group">
                  <label>Estimated Body Fat % (Optional)</label>
                  <input 
                    type="number" 
                    step="0.1" 
                    value={newBodyFat} 
                    onChange={(e) => setNewBodyFat(e.target.value)} 
                    placeholder="e.g. 18.0" 
                  />
                </div>
                <button type="submit" className="mp-modal-submit-btn">
                  Save Measurement
                </button>
              </form>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
