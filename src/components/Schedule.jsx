import React, { useState } from 'react';
import { SCHEDULE_DATA } from '../data/gymData';

export default function Schedule({ onOpenBooking }) {
  const [selectedDay, setSelectedDay] = useState('Monday');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedTimeFilter, setSelectedTimeFilter] = useState('All'); // 'All' | 'Morning' | 'Evening'

  const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
  const categories = ['All', 'Strength', 'HIIT', 'Boxing', 'Functional', 'CrossFit', 'Mobility'];

  const filteredClasses = SCHEDULE_DATA.filter((item) => {
    const matchesDay = item.day === selectedDay;
    const matchesCategory = selectedCategory === 'All' || item.category === selectedCategory;
    
    let matchesTime = true;
    if (selectedTimeFilter === 'Morning') {
      matchesTime = item.time.includes('AM');
    } else if (selectedTimeFilter === 'Evening') {
      matchesTime = item.time.includes('PM');
    }

    return matchesDay && matchesCategory && matchesTime;
  });

  return (
    <section id="schedule" className="schedule-section section-padding" aria-label="Weekly Class Schedule">
      <div className="container">
        {/* Section Header */}
        <div className="section-header-center">
          <span className="section-tag">
            COACHED TIMETABLE
          </span>
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
                  className={`subfilter-btn ${selectedCategory === cat ? 'active' : ''}`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Classes Clean Rows */}
        <div className="schedule-grid">
          {filteredClasses.length > 0 ? (
            filteredClasses.map((item, idx) => (
              <div key={idx} className="schedule-class-row">
                <div className="class-time-block">
                  <span className="class-time-text">{item.time}</span>
                  <span className="class-duration-tag">{item.duration}</span>
                </div>

                <div className="class-info-block">
                  <div className="class-title-row">
                    <h3 className="class-name">{item.name}</h3>
                    <span className="class-cat-tag">{item.category}</span>
                  </div>

                  <p className="class-coach-row">
                    Coach: <strong>{item.trainer}</strong> • Intensity: <span>{item.intensity}</span>
                  </p>
                </div>

                <div className="class-action-block">
                  <span className="spots-text">{item.spots} spots remaining</span>
                  <button
                    onClick={() => onOpenBooking(`Class Booking: ${item.name} (${item.day} ${item.time})`)}
                    className="btn btn-secondary btn-sm"
                    id={`book-class-${idx}`}
                  >
                    BOOK CLASS
                  </button>
                </div>
              </div>
            ))
          ) : (
            <div className="no-classes-found">
              <p>No sessions match the selected filter on {selectedDay}.</p>
              <button 
                onClick={() => { setSelectedCategory('All'); setSelectedTimeFilter('All'); }}
                className="btn btn-secondary btn-sm"
              >
                Reset Filters
              </button>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
