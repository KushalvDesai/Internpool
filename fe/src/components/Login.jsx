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
    // Minimal: send to backend (replace URL as needed)
    await fetch('/api/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form),
    });
    navigate('/dashboard');
  };

  return (
    <div style={{ maxWidth: 300, margin: '40px auto' }}>
      <h2>Login</h2>
      <form onSubmit={handleSubmit}>
        <input name="email" type="email" placeholder="Email" value={form.email} onChange={handleChange} required style={{ width: '100%', margin: 4 }} />
        <input name="password" type="password" placeholder="Password" value={form.password} onChange={handleChange} required style={{ width: '100%', margin: 4 }} />
        {error && <div style={{ color: 'red', fontSize: 12 }}>{error}</div>}
        <button type="submit" style={{ width: '100%', margin: 4 }}>Login</button>
      </form>
      <button onClick={() => navigate('/')} style={{ width: '100%', margin: 4 }}>Go to Signup</button>
    </div>
  );
};

export default Login;