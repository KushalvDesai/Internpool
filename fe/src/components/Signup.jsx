import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Signup = () => {
  const [form, setForm] = useState({ name: '', email: '', password: '', file: null });
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleChange = e => {
    const { name, value, files } = e.target;
    setForm(f => ({
      ...f,
      [name]: files ? files[0] : value,
    }));
  };

  const handleSubmit = async e => {
    e.preventDefault();
    if (form.password.length < 8) {
      setError('Password must be at least 8 characters');
      return;
    }
    // Simulate file upload (replace with real API as needed)
    const data = new FormData();
    data.append('name', form.name);
    data.append('email', form.email);
    data.append('password', form.password);
    if (form.file) data.append('file', form.file);
    await fetch('/api/signup', {
      method: 'POST',
      body: data,
    });
    navigate('/dashboard');
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#f7f6f3' }}>
      <div style={{ background: '#fff', borderRadius: 8, boxShadow: '0 2px 8px #ececec', padding: 32, maxWidth: 350, width: '100%' }}>
        <h2 style={{ textAlign: 'center', marginBottom: 24 }}>Create your account</h2>
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          <label>Name</label>
          <input name="name" placeholder="Name" value={form.name} onChange={handleChange} required />
          <label>Email</label>
          <input name="email" type="email" placeholder="Email" value={form.email} onChange={handleChange} required />
          <label>Password</label>
          <input name="password" type="password" placeholder="Password (min 8 chars)" value={form.password} onChange={handleChange} required />
          <label>Profile Picture</label>
          <input name="file" type="file" accept="image/*" onChange={handleChange} style={{ padding: 0, border: 'none', background: 'none' }} />
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