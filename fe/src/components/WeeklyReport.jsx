import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const weeks = [1, 2, 3, 4];

const initialForm = {
  studentId: '',
  studentName: '',
  sem: '',
  div: '',
  internshipType: '',
  weekNo: '',
  from: '',
  to: '',
  hours: '',
  company: '',
  technology: '',
  assignments: '',
  rewarding: '',
  difficult: '',
  upcoming: '',
  learning: '',
};

const WeeklyReport = () => {
  const [currentWeek, setCurrentWeek] = useState(1);
  const [reports, setReports] = useState({ 1: { ...initialForm, weekNo: 1 }, 2: { ...initialForm, weekNo: 2 }, 3: { ...initialForm, weekNo: 3 }, 4: { ...initialForm, weekNo: 4 } });
  const [msg, setMsg] = useState('');
  const navigate = useNavigate();

  // Handle input changes for the current week
  const handleChange = e => {
    const { name, value } = e.target;
    setReports(prev => ({
      ...prev,
      [currentWeek]: { ...prev[currentWeek], [name]: value },
    }));
  };

  // Save draft for the current week
  const handleSave = () => {
    setMsg(`Week ${currentWeek} report saved!`);
    setTimeout(() => setMsg(''), 1500);
  };

  // Submit all 4 reports
  const handleSubmitAll = async () => {
    for (let w = 1; w <= 4; w++) {
      await fetch('/api/student/report', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(reports[w]),
      });
    }
    navigate('/dashboard');
  };

  // Switch to a week for editing
  const handleWeekSelect = w => {
    setCurrentWeek(w);
    setMsg('');
  };

  return (
    <div style={{ minHeight: '100vh', background: '#f7f6f3' }}>
      {/* Sticky Sidebar */}
      <aside
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          height: '100vh',
          width: 220,
          background: '#fff',
          borderRight: '1px solid #e3e3e3',
          padding: 24,
          display: 'flex',
          flexDirection: 'column',
          gap: 16,
          zIndex: 100,
        }}
      >
        <h2 style={{ fontSize: 20, margin: 0, marginBottom: 24 }}>Weekly Reports</h2>
        {weeks.map(w => (
          <button
            key={w}
            onClick={() => handleWeekSelect(w)}
            style={{
              width: '100%',
              background: currentWeek === w ? '#ececec' : '#fff',
              fontWeight: currentWeek === w ? 600 : 400,
              border: '1px solid #e3e3e3',
              marginBottom: 6,
              borderRadius: 8,
              cursor: 'pointer',
            }}
          >
            Week {w} {Object.values(reports[w]).some(val => val) ? '✓' : ''}
          </button>
        ))}
        <button
          onClick={handleSubmitAll}
          style={{ marginTop: 24, background: '#222', color: '#fff', borderRadius: 8, padding: '10px 0', fontWeight: 600 }}
        >
          Submit All Reports
        </button>
      </aside>
      {/* Main content with left margin */}
      <main
        style={{
          marginLeft: 220,
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <div className="card" style={{ maxWidth: 800, width: '100%' }}>
          <h2 style={{ textAlign: 'center', marginBottom: 16 }}>Weekly Internship Report - Week {currentWeek}</h2>
          <form style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            <div style={{ display: 'flex', gap: 8 }}>
              <div style={{ flex: 1 }}>
                <label>Student ID</label>
                <input name="studentId" value={reports[currentWeek].studentId} onChange={handleChange} required />
              </div>
              <div style={{ flex: 2 }}>
                <label>Student Name</label>
                <input name="studentName" value={reports[currentWeek].studentName} onChange={handleChange} required />
              </div>
            </div>
            <div style={{ display: 'flex', gap: 8 }}>
              <div style={{ flex: 1 }}>
                <label>Sem.</label>
                <input name="sem" value={reports[currentWeek].sem} onChange={handleChange} required />
              </div>
              <div style={{ flex: 1 }}>
                <label>Div.</label>
                <input name="div" value={reports[currentWeek].div} onChange={handleChange} required />
              </div>
              <div style={{ flex: 2 }}>
                <label>Type of Internship</label>
                <input name="internshipType" value={reports[currentWeek].internshipType} onChange={handleChange} required />
              </div>
            </div>
            <div style={{ display: 'flex', gap: 8 }}>
              <div style={{ flex: 1 }}>
                <label>Week No.</label>
                <input name="weekNo" value={currentWeek} readOnly />
              </div>
              <div style={{ flex: 2 }}>
                <label>From</label>
                <input name="from" type="date" value={reports[currentWeek].from} onChange={handleChange} required />
              </div>
              <div style={{ flex: 2 }}>
                <label>To</label>
                <input name="to" type="date" value={reports[currentWeek].to} onChange={handleChange} required />
              </div>
              <div style={{ flex: 2 }}>
                <label>Working Hours / week</label>
                <input name="hours" value={reports[currentWeek].hours} onChange={handleChange} required />
              </div>
            </div>
            <div style={{ display: 'flex', gap: 8 }}>
              <div style={{ flex: 2 }}>
                <label>Company Name</label>
                <input name="company" value={reports[currentWeek].company} onChange={handleChange} required />
              </div>
              <div style={{ flex: 2 }}>
                <label>Technology worked on</label>
                <input name="technology" value={reports[currentWeek].technology} onChange={handleChange} required />
              </div>
            </div>
            <label>Describe your principle assignments and responsibilities for this period.</label>
            <textarea name="assignments" value={reports[currentWeek].assignments} onChange={handleChange} required style={{ minHeight: 40 }} />
            <label>What experiences were particularly rewarding during this report period?</label>
            <textarea name="rewarding" value={reports[currentWeek].rewarding} onChange={handleChange} required style={{ minHeight: 40 }} />
            <label>What experiences were particularly difficult during this report period?</label>
            <textarea name="difficult" value={reports[currentWeek].difficult} onChange={handleChange} required style={{ minHeight: 40 }} />
            <label>Describe principal tasks and duties to be performed and accomplishments during the upcoming week.</label>
            <textarea name="upcoming" value={reports[currentWeek].upcoming} onChange={handleChange} required style={{ minHeight: 40 }} />
            <label>Learning Outcomes: (in brief)</label>
            <textarea name="learning" value={reports[currentWeek].learning} onChange={handleChange} required style={{ minHeight: 40 }} />
            <div style={{ display: 'flex', gap: 8, marginTop: 12 }}>
              <button type="button" onClick={handleSave} style={{ flex: 1 }}>Save</button>
              <button type="button" onClick={() => setReports(prev => ({ ...prev, [currentWeek]: { ...initialForm, weekNo: currentWeek } }))} style={{ flex: 1, background: '#f7f6f3' }}>Clear</button>
            </div>
          </form>
          {msg && <div style={{ color: 'green', marginTop: 10 }}>{msg}</div>}
        </div>
      </main>
    </div>
  );
};

export default WeeklyReport;
// This page provides a sidebar to navigate, view, edit, and save weekly reports before submitting all at once.
