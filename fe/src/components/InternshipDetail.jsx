import React, { useState } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';

const initialForm = {
  assignments: '',
  rewarding: '',
  difficult: '',
  upcoming: '',
  learning: '',
};

const InternshipDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  // Get internship data from location.state or fallback to dummy
  const internship = location.state && location.state.internship ? location.state.internship : {
    id,
    company: id === '1' ? 'Tech Corp' : 'Web Solutions',
    position: 'Intern',
    startDate: '2025-06-01',
    endDate: '2025-06-28',
    weeks: 4,
    technology: 'React',
    type: 'Offline',
    workingHours: '35',
    sem: '5',
    div: '1',
  };
  const numWeeks = parseInt(internship.weeks) || 4;
  const weeks = Array.from({ length: numWeeks }, (_, i) => i + 1);
  // Store reports for each week
  const [reports, setReports] = useState(() => {
    const obj = {};
    weeks.forEach(w => { obj[w] = { ...initialForm }; });
    return obj;
  });
  const [submitted, setSubmitted] = useState(() => {
    const obj = {};
    weeks.forEach(w => { obj[w] = false; });
    return obj;
  });
  const [currentWeek, setCurrentWeek] = useState(1);
  const [msg, setMsg] = useState('');

  const handleChange = e => {
    const { name, value } = e.target;
    setReports(prev => ({
      ...prev,
      [currentWeek]: { ...prev[currentWeek], [name]: value },
    }));
  };

  const handleSave = () => {
    setMsg(`Week ${currentWeek} report saved!`);
    setTimeout(() => setMsg(''), 1500);
  };

  const handleSubmit = async () => {
    // Submit only the current week's report
    await fetch(`/api/internship/${id}/report`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ week: currentWeek, ...reports[currentWeek] }),
    });
    setSubmitted(prev => ({ ...prev, [currentWeek]: true }));
    setMsg(`Week ${currentWeek} report submitted!`);
    setTimeout(() => setMsg(''), 1500);
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
        <h2 style={{ fontSize: 20, margin: 0, marginBottom: 24 }}>Weeks</h2>
        {weeks.map(w => (
          <button
            key={w}
            onClick={() => setCurrentWeek(w)}
            style={{
              width: '100%',
              background: currentWeek === w ? '#ececec' : '#fff',
              fontWeight: currentWeek === w ? 600 : 400,
              border: '1px solid #e3e3e3',
              marginBottom: 6,
              borderRadius: 8,
              cursor: 'pointer',
              color: submitted[w] ? 'green' : '#222',
            }}
          >
            Week {w} {submitted[w] ? '✓' : ''}
          </button>
        ))}
        <button onClick={() => navigate('/dashboard')} style={{ marginTop: 24 }}>Back to Dashboard</button>
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
        <div className="card" style={{ maxWidth: 600, width: '100%' }}>
          <h2 style={{ textAlign: 'center', marginBottom: 16 }}>{internship.company} - {internship.position}</h2>
          <div style={{ marginBottom: 16 }}>
            <b>Duration:</b> {internship.startDate} to {internship.endDate} ({internship.weeks} weeks)<br />
            <b>Technology:</b> {internship.technology}<br />
            <b>Type:</b> {internship.type}<br />
            <b>Working Hours/week:</b> {internship.workingHours}<br />
            <b>Semester:</b> {internship.sem} <b>Div:</b> {internship.div}
          </div>
          <h3 style={{ textAlign: 'center', marginBottom: 16 }}>Weekly Report - Week {currentWeek}</h3>
          <form style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
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
              <button type="button" onClick={handleSubmit} style={{ flex: 1, background: '#222', color: '#fff' }}>Submit</button>
            </div>
          </form>
          {msg && <div style={{ color: 'green', marginTop: 10 }}>{msg}</div>}
        </div>
      </main>
    </div>
  );
};

export default InternshipDetail;
// InternshipDetail now displays start/end dates and uses weeks for weekly reports.
