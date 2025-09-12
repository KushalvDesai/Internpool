import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Login = () => {
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async e => {
    e.preventDefault();
    if (form.password.length < 8) {
      setError('Password must be at least 8 characters');
      return;
    }
    await fetch('/api/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form),
    });
    navigate('/dashboard');
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#f7f6f3' }}>
      <div style={{ background: '#fff', borderRadius: 8, boxShadow: '0 2px 8px #ececec', padding: 32, maxWidth: 350, width: '100%' }}>
        <h2 style={{ textAlign: 'center', marginBottom: 24 }}>Login to your account</h2>
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          <label>Email</label>
          <input name="email" type="email" placeholder="Email" value={form.email} onChange={handleChange} required />
          <label>Password</label>
          <input name="password" type="password" placeholder="Password (min 8 chars)" value={form.password} onChange={handleChange} required />
          {error && <div style={{ color: 'red', fontSize: 13 }}>{error}</div>}
          <button type="submit" style={{ marginTop: 12 }}>Login</button>
        </form>
        <button onClick={() => navigate('/')} style={{ marginTop: 12, background: '#f7f6f3' }}>Go to Signup</button>
      </div>
    </div>
  );
};

export default Login;
// This component uses a Notion-like card and aceternity-style form for login.