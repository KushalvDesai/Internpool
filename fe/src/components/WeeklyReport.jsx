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
  const [week, setWeek] = useState(1);
  const [form, setForm] = useState(initialForm);
  const navigate = useNavigate();

  const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value });

  const handleWeekChange = e => {
    setWeek(Number(e.target.value));
    setForm({ ...form, weekNo: e.target.value });
  };

  const handleSubmit = async e => {
    e.preventDefault();
    // Submit form to backend (API call)
    await fetch('/api/student/report', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form),
    });
    navigate('/dashboard');
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#f7f6f3' }}>
      <div className="card" style={{ maxWidth: 600, width: '100%' }}>
        <h2 style={{ textAlign: 'center', marginBottom: 16 }}>Weekly Internship Report</h2>
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          <div style={{ display: 'flex', gap: 8 }}>
            <div style={{ flex: 1 }}>
              <label>Student ID</label>
              <input name="studentId" value={form.studentId} onChange={handleChange} required />
            </div>
            <div style={{ flex: 2 }}>
              <label>Student Name</label>
              <input name="studentName" value={form.studentName} onChange={handleChange} required />
            </div>
          </div>
          <div style={{ display: 'flex', gap: 8 }}>
            <div style={{ flex: 1 }}>
              <label>Sem.</label>
              <input name="sem" value={form.sem} onChange={handleChange} required />
            </div>
            <div style={{ flex: 1 }}>
              <label>Div.</label>
              <input name="div" value={form.div} onChange={handleChange} required />
            </div>
            <div style={{ flex: 2 }}>
              <label>Type of Internship</label>
              <input name="internshipType" value={form.internshipType} onChange={handleChange} required />
            </div>
          </div>
          <div style={{ display: 'flex', gap: 8 }}>
            <div style={{ flex: 1 }}>
              <label>Week No.</label>
              <select name="weekNo" value={week} onChange={handleWeekChange} required>
                {weeks.map(w => <option key={w} value={w}>{w}</option>)}
              </select>
            </div>
            <div style={{ flex: 2 }}>
              <label>From</label>
              <input name="from" type="date" value={form.from} onChange={handleChange} required />
            </div>
            <div style={{ flex: 2 }}>
              <label>To</label>
              <input name="to" type="date" value={form.to} onChange={handleChange} required />
            </div>
            <div style={{ flex: 2 }}>
              <label>Working Hours / week</label>
              <input name="hours" value={form.hours} onChange={handleChange} required />
            </div>
          </div>
          <div style={{ display: 'flex', gap: 8 }}>
            <div style={{ flex: 2 }}>
              <label>Company Name</label>
              <input name="company" value={form.company} onChange={handleChange} required />
            </div>
            <div style={{ flex: 2 }}>
              <label>Technology worked on</label>
              <input name="technology" value={form.technology} onChange={handleChange} required />
            </div>
          </div>
          <label>Describe your principle assignments and responsibilities for this period.</label>
          <textarea name="assignments" value={form.assignments} onChange={handleChange} required style={{ minHeight: 40 }} />
          <label>What experiences were particularly rewarding during this report period?</label>
          <textarea name="rewarding" value={form.rewarding} onChange={handleChange} required style={{ minHeight: 40 }} />
          <label>What experiences were particularly difficult during this report period?</label>
          <textarea name="difficult" value={form.difficult} onChange={handleChange} required style={{ minHeight: 40 }} />
          <label>Describe principal tasks and duties to be performed and accomplishments during the upcoming week.</label>
          <textarea name="upcoming" value={form.upcoming} onChange={handleChange} required style={{ minHeight: 40 }} />
          <label>Learning Outcomes: (in brief)</label>
          <textarea name="learning" value={form.learning} onChange={handleChange} required style={{ minHeight: 40 }} />
          <div style={{ display: 'flex', gap: 8, marginTop: 12 }}>
            <button type="submit" style={{ flex: 1 }}>Submit</button>
            <button type="button" onClick={() => navigate('/dashboard')} style={{ flex: 1, background: '#f7f6f3' }}>Cancel</button>
          </div>
        </form>
        <div style={{ marginTop: 24, fontSize: 13, color: '#888', textAlign: 'center' }}>
          Signature of Internal Guide &nbsp;&nbsp; Signature of External Guide
        </div>
      </div>
    </div>
  );
};

export default WeeklyReport;
// This page provides a weekly report form for 4 weeks, with all required questions and fields.
