import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function getWeeksBetween(start, end) {
  const startDate = new Date(start);
  const endDate = new Date(end);
  const msInWeek = 7 * 24 * 60 * 60 * 1000;
  return Math.max(1, Math.ceil((endDate - startDate + 1) / msInWeek));
}

const AddInternship = () => {
  const [form, setForm] = useState({
    company: '',
    position: '',
    startDate: '',
    endDate: '',
    technology: '',
    type: '',
    workingHours: '',
    sem: '',
    div: '',
  });
  const [msg, setMsg] = useState('');
  const [weeks, setWeeks] = useState(1);
  const navigate = useNavigate();

  const handleChange = e => {
    const { name, value } = e.target;
    setForm(f => {
      const updated = { ...f, [name]: value };
      if (name === 'startDate' || name === 'endDate') {
        if (updated.startDate && updated.endDate) {
          setWeeks(getWeeksBetween(updated.startDate, updated.endDate));
        }
      }
      return updated;
    });
  };

  const handleSubmit = async e => {
    e.preventDefault();
    // Simulate API call to add internship
    setMsg('Internship added!');
    setTimeout(() => {
      navigate('/dashboard', {
        state: {
          newInternship: {
            ...form,
            id: Date.now(),
            startDate: form.startDate,
            endDate: form.endDate,
            weeks,
          },
        },
      });
    }, 1000);
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#f7f6f3' }}>
      <div className="card" style={{ maxWidth: 400, width: '100%' }}>
        <h2 style={{ textAlign: 'center', marginBottom: 24 }}>Add Internship</h2>
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          <label>Company Name</label>
          <input name="company" value={form.company} onChange={handleChange} required />
          <label>Position</label>
          <input name="position" value={form.position} onChange={handleChange} required />
          <label>Start Date</label>
          <input name="startDate" type="date" value={form.startDate} onChange={handleChange} required />
          <label>End Date</label>
          <input name="endDate" type="date" value={form.endDate} onChange={handleChange} required />
          <label>Technology</label>
          <input name="technology" value={form.technology} onChange={handleChange} required />
          <label>Type</label>
          <input name="type" value={form.type} onChange={handleChange} required />
          <label>Working Hours / week</label>
          <input name="workingHours" value={form.workingHours} onChange={handleChange} required />
          <label>Semester</label>
          <input name="sem" value={form.sem} onChange={handleChange} required />
          <label>Division</label>
          <input name="div" value={form.div} onChange={handleChange} required />
          <div style={{ fontSize: 13, color: '#555', margin: '8px 0' }}>Weeks calculated: {weeks}</div>
          <button type="submit" style={{ marginTop: 12 }}>Add Internship</button>
        </form>
        {msg && <div style={{ color: 'green', marginTop: 10 }}>{msg}</div>}
        <button onClick={() => navigate('/dashboard')} style={{ marginTop: 12, background: '#f7f6f3' }}>Cancel</button>
      </div>
    </div>
  );
};

export default AddInternship;
// This page allows adding a new internship with all required details, including start/end dates and auto-calculated weeks.
