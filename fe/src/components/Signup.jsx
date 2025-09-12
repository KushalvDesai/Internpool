import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Signup = () => {
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async e => {
    e.preventDefault();
    if (form.password.length < 8) {
      setError('Password must be at least 8 characters');
      return;
    }
    // Minimal: send to backend (replace URL as needed)
    await fetch('/api/signup', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form),
    });
    navigate('/dashboard');
  };

  return (
    <div style={{ maxWidth: 300, margin: '40px auto' }}>
      <h2>Signup</h2>
      <form onSubmit={handleSubmit}>
        <input name="name" placeholder="Name" value={form.name} onChange={handleChange} required style={{ width: '100%', margin: 4 }} />
        <input name="email" type="email" placeholder="Email" value={form.email} onChange={handleChange} required style={{ width: '100%', margin: 4 }} />
        <input name="password" type="password" placeholder="Password" value={form.password} onChange={handleChange} required style={{ width: '100%', margin: 4 }} />
        {error && <div style={{ color: 'red', fontSize: 12 }}>{error}</div>}
        <button type="submit" style={{ width: '100%', margin: 4 }}>Signup</button>
      </form>
      <button onClick={() => navigate('/login')} style={{ width: '100%', margin: 4 }}>Go to Login</button>
    </div>
  );
};

export default Signup;