import React, { useState, useEffect } from 'react';
import { SCHEDULE_DATA } from '../data/gymData';
import { supabase } from '../lib/supabaseClient';
import { Database } from 'lucide-react';

export default function Schedule({ onOpenBooking }) {
  const [schedule, setSchedule] = useState(SCHEDULE_DATA);
  const [isLiveFromDb, setIsLiveFromDb] = useState(false);
  const [selectedDay, setSelectedDay] = useState('Monday');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedTimeFilter, setSelectedTimeFilter] = useState('All'); // 'All' | 'Morning' | 'Evening'

  const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
  const categories = ['All', 'Strength', 'HIIT', 'Boxing', 'Functional', 'CrossFit', 'Mobility'];

  // 7. Dynamic Class Schedule from Supabase
  useEffect(() => {
    async function loadSchedule() {
      try {
        const { data, error } = await supabase
          .from('class_schedule')
          .select('*');

        if (!error && data && data.length > 0) {
          const formatted = data.map((item) => ({
            id: item.id,
            day: item.day,
            time: item.start_time,
            name: item.class_name,
            category: item.category || 'Strength',
            trainer: item.trainer,
            duration: item.duration || '60 min',
            spots: item.spots_left !== undefined ? item.spots_left : 5,
            intensity: item.intensity || 'High'
          }));
          setSchedule(formatted);
          setIsLiveFromDb(true);
        }
      } catch (err) {
        console.info('Supabase class_schedule query handled:', err);
      }
    }
    loadSchedule();
  }, []);

  const filteredClasses = schedule.filter((item) => {
    const matchesDay = item.day === selectedDay;
    const matchesCategory = selectedCategory === 'All' || item.category === selectedCategory;
    
    let matchesTime = true;
    if (selectedTimeFilter === 'Morning') {
      matchesTime = (item.time || '').includes('AM');
    } else if (selectedTimeFilter === 'Evening') {
      matchesTime = (item.time || '').includes('PM');
    }

    return matchesDay && matchesCategory && matchesTime;
  });

  return (
    <section id="schedule" className="schedule-section section-padding" aria-label="Weekly Class Schedule">
      <div className="container">
        {/* Section Header */}
        <div className="section-header-center">
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
            <span className="section-tag">
              COACHED TIMETABLE
            </span>
            {isLiveFromDb && (
              <span style={{ 
                background: 'rgba(16, 185, 129, 0.15)', 
                color: '#34d399', 
                border: '1px solid rgba(16, 185, 129, 0.3)',
                padding: '2px 8px',
                borderRadius: '999px',
                fontSize: '0.7rem',
                fontWeight: 600,
                display: 'inline-flex',
                alignItems: 'center',
                gap: '4px'
              }}>
                <Database size={10} /> Dynamic Timetable
              </span>
            )}
          </div>
          <h2 className="section-title">
            CLASS <span className="text-volt-accent">SCHEDULE.</span>
          </h2>
          <p className="section-subtitle">
            50+ coached sessions each week led by certified masters. Small cohorts for direct form correction.
          </p>

          {/* Clean Day Selector */}
          <div className="schedule-days-nav">
            {days.map((day) => (
              <button
                key={day}
                onClick={() => setSelectedDay(day)}
                className={`day-tab-btn ${selectedDay === day ? 'active' : ''}`}
              >
                <span className="day-abbr">{day.slice(0, 3)}</span>
                <span className="day-full">{day}</span>
              </button>
            ))}
          </div>

          {/* Clean Category Filter Tabs */}
          <div className="schedule-subfilters">
            <div className="subfilter-row">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`subfilter-chip ${selectedCategory === cat ? 'active' : ''}`}
                >
                  {cat}
                </button>
              ))}
            </div>

            <div className="time-subfilters">
              {['All', 'Morning', 'Evening'].map((timeOption) => (
                <button
                  key={timeOption}
                  onClick={() => setSelectedTimeFilter(timeOption)}
                  className={`time-chip ${selectedTimeFilter === timeOption ? 'active' : ''}`}
                >
                  {timeOption}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Schedule Grid */}
        <div className="schedule-cards-grid">
          {filteredClasses.length === 0 ? (
            <div className="no-classes-box">
              <p>No classes scheduled for this category on {selectedDay}.</p>
              <button 
                onClick={() => { setSelectedCategory('All'); setSelectedTimeFilter('All'); }}
                className="btn btn-secondary btn-sm"
              >
                Show All {selectedDay} Sessions
              </button>
            </div>
          ) : (
            filteredClasses.map((item, idx) => (
              <div key={idx} className="class-schedule-card">
                <div className="class-card-top">
                  <span className="class-time-tag">{item.time}</span>
                  <span className="class-duration-tag">{item.duration}</span>
                </div>

                <div className="class-card-main">
                  <h3 className="class-title">{item.name}</h3>
                  <div className="class-meta-row">
                    <span className="class-category-pill">{item.category}</span>
                    <span className="class-intensity-pill">Intensity: {item.intensity}</span>
                  </div>
                </div>

                <div className="class-card-footer">
                  <div className="coach-block">
                    <span className="coach-label">Coach</span>
                    <span className="coach-name">{item.trainer}</span>
                  </div>

                  <div className="class-action-block">
                    <span className={`spots-badge ${item.spots <= 2 ? 'spots-low' : ''}`}>
                      {item.spots} {item.spots === 1 ? 'spot' : 'spots'} left
                    </span>
                    <button 
                      onClick={() => onOpenBooking(`Book Session: ${item.name} (${item.day} ${item.time})`)}
                      className="btn btn-primary btn-sm"
                    >
                      BOOK CLASS
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </section>
  );
}
