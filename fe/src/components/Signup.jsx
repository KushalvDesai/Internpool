import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Signup = () => {
  const [form, setForm] = useState({ fname: '', lname: '', email: '', password: '', studentID: '', batch: '' });
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleChange = e => {
    const { name, value } = e.target;
    setForm(f => ({
      ...f,
      [name]: value,
    }));
  };

  const handleSubmit = async e => {
    e.preventDefault();
    if (form.password.length < 8) {
      setError('Password must be at least 8 characters');
      return;
    }
    // Send JSON to backend as required
    const payload = {
      fname: form.fname,
      lname: form.lname,
      email: form.email,
      password: form.password,
      role: 'student',
      studentID: form.studentID,
      batch: form.batch,
    };
    try {
      const res = await fetch('http://localhost:3000/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      if (!res.ok) {
        const data = await res.json();
        setError(data.message || 'Signup failed');
        return;
      }
  // Save user info to localStorage for dashboard
  const userData = await res.json();
  localStorage.setItem('user', JSON.stringify(userData.user || {}));
  navigate('/dashboard');
    } catch (err) {
      setError('Network error');
    }
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#f7f6f3' }}>
      
      <div style={{ background: '#fff', borderRadius: 8, boxShadow: '0 2px 8px #ececec', padding: 32, maxWidth: 350, width: '100%' }}>
        <h2 style={{ textAlign: 'center', marginBottom: 24 }}>Create your account</h2>
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          <label>First Name</label>
          <input name="fname" placeholder="First Name" value={form.fname} onChange={handleChange} required />
          <label>Last Name</label>
          <input name="lname" placeholder="Last Name" value={form.lname} onChange={handleChange} required />
          <label>Email</label>
          <input name="email" type="email" placeholder="Email" value={form.email} onChange={handleChange} required />
          <label>Password</label>
          <input name="password" type="password" placeholder="Password (min 8 chars)" value={form.password} onChange={handleChange} required />
          <label>Student ID</label>
          <input name="studentID" placeholder="Student ID" value={form.studentID} onChange={handleChange} required />
          <label>Batch</label>
          <input name="batch" placeholder="Batch (e.g. A, B)" value={form.batch} onChange={handleChange} required />
          {error && <div style={{ color: 'red', fontSize: 13 }}>{error}</div>}
          <button type="submit" style={{ marginTop: 12 }}>Signup</button>
        </form>
        <button onClick={() => navigate('/login')} style={{ marginTop: 12, background: '#f7f6f3' }}>Go to Login</button>
      </div>
    </div>
  );
};

export default Signup;
// This component uses a Notion-like card, aceternity-style form, and file upload for profile picture.