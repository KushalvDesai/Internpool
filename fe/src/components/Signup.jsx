import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { api } from '../lib/api';

const Signup = () => {
  const [form, setForm] = useState({ 
    fname: '', 
    lname: '', 
    email: '', 
    password: '', 
    role: 'student',
    studentID: '', 
    batch: '',
    facultyID: '',
    assignedBatch: '',
    adminID: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleChange = e => {
    const { name, value } = e.target;
    setForm(f => ({ ...f, [name]: value }));
  };

  const handleRoleChange = (role) => {
    setForm(f => ({ ...f, role }));
  };

  const handleSubmit = async e => {
    e.preventDefault();
    setError('');
    
    if (form.password.length < 8) {
      setError('Password must be at least 8 characters');
      return;
    }

    setLoading(true);

    try {
      const payload = { ...form };
      
      // Remove fields not needed for the selected role
      if (form.role === 'student') {
        delete payload.facultyID;
        delete payload.assignedBatch;
        delete payload.adminID;
      } else if (form.role === 'faculty') {
        delete payload.studentID;
        delete payload.batch;
        delete payload.adminID;
      } else if (form.role === 'admin') {
        delete payload.studentID;
        delete payload.batch;
        delete payload.facultyID;
        delete payload.assignedBatch;
      }

      const data = await api.signup(payload);
      login(data.user, data.token);
      
      if (data.user.role === 'admin') {
        navigate('/admin');
      } else if (data.user.role === 'faculty') {
        navigate('/faculty');
      } else {
        navigate('/dashboard');
      }
    } catch (err) {
      setError(err.message || 'Signup failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#f7f6f3', padding: 20 }}>
      <div className="card" style={{ maxWidth: 450, width: '100%' }}>
        <h2 style={{ textAlign: 'center', marginBottom: 24 }}>Create Account</h2>
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          <label>Role</label>
          <select name="role" value={form.role} onChange={(e) => handleRoleChange(e.target.value)} disabled={loading} required>
            <option value="student">Student</option>
            <option value="faculty">Faculty</option>
            <option value="admin">Admin</option>
          </select>

          <label>First Name</label>
          <input name="fname" placeholder="First Name" value={form.fname} onChange={handleChange} required disabled={loading} />

          <label>Last Name</label>
          <input name="lname" placeholder="Last Name" value={form.lname} onChange={handleChange} required disabled={loading} />

          <label>Email</label>
          <input name="email" type="email" placeholder="Email" value={form.email} onChange={handleChange} required disabled={loading} />

          <label>Password</label>
          <input name="password" type="password" placeholder="Password (min 8 chars)" value={form.password} onChange={handleChange} required disabled={loading} />

          {form.role === 'student' && (
            <>
              <label>Student ID</label>
              <input name="studentID" placeholder="Student ID" value={form.studentID} onChange={handleChange} required disabled={loading} />
              <label>Batch</label>
              <input name="batch" placeholder="Batch" value={form.batch} onChange={handleChange} required disabled={loading} />
            </>
          )}

          {form.role === 'faculty' && (
            <>
              <label>Faculty ID</label>
              <input name="facultyID" placeholder="Faculty ID" value={form.facultyID} onChange={handleChange} required disabled={loading} />
              <label>Assigned Batch</label>
              <input name="assignedBatch" placeholder="Assigned Batch" value={form.assignedBatch} onChange={handleChange} required disabled={loading} />
            </>
          )}

          {form.role === 'admin' && (
            <>
              <label>Admin ID</label>
              <input name="adminID" placeholder="Admin ID" value={form.adminID} onChange={handleChange} required disabled={loading} />
            </>
          )}

          {error && <div style={{ color: '#dc2626', fontSize: 13, padding: 8, background: '#fee', borderRadius: 6 }}>{error}</div>}
          <button type="submit" disabled={loading} style={{ marginTop: 12 }}>
            {loading ? 'Creating account...' : 'Sign Up'}
          </button>
        </form>
        <button onClick={() => navigate('/login')} style={{ marginTop: 12, background: '#f7f6f3' }}>
          Already have an account? Login
        </button>
      </div>
    </div>
  );
};

export default Signup;