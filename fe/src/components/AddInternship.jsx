import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const AddInternship = () => {
  const [form, setForm] = useState({
    company: '',
    position: '',
    duration: '', // in weeks
    technology: '',
    type: '',
    workingHours: '',
  });
  const [msg, setMsg] = useState('');
  const navigate = useNavigate();

  const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async e => {
    e.preventDefault();
    // Simulate API call to add internship
    // You can replace this with a real API call and redirect to dashboard or internship detail
    setMsg('Internship added!');
    setTimeout(() => {
      navigate('/dashboard', { state: { newInternship: { ...form, id: Date.now() } } });
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
          <label>Duration (weeks)</label>
          <input name="duration" type="number" min="1" value={form.duration} onChange={handleChange} required />
          <label>Technology</label>
          <input name="technology" value={form.technology} onChange={handleChange} required />
          <label>Type</label>
          <input name="type" value={form.type} onChange={handleChange} required />
          <label>Working Hours / week</label>
          <input name="workingHours" value={form.workingHours} onChange={handleChange} required />
          <button type="submit" style={{ marginTop: 12 }}>Add Internship</button>
        </form>
        {msg && <div style={{ color: 'green', marginTop: 10 }}>{msg}</div>}
        <button onClick={() => navigate('/dashboard')} style={{ marginTop: 12, background: '#f7f6f3' }}>Cancel</button>
      </div>
    </div>
  );
};

export default AddInternship;
// This page allows adding a new internship with all required details.
