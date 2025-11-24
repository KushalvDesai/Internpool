import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { api } from '../lib/api';

const AddInternship = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [form, setForm] = useState({
    company: '',
    internshipType: '',
    stipend: '',
    offerLetter: '',
  });
  const [companies, setCompanies] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [msg, setMsg] = useState('');

  useEffect(() => {
    const fetchCompanies = async () => {
      try {
        const data = await api.getCompanies();
        setCompanies(data);
      } catch (err) {
        setError(err.message || 'Failed to load companies');
      }
    };
    fetchCompanies();
  }, []);

  const handleChange = e => {
    const { name, value } = e.target;
    setForm(f => ({ ...f, [name]: value }));
  };

  const handleSubmit = async e => {
    e.preventDefault();
    setError('');
    setMsg('');
    setLoading(true);

    try {
      if (!form.company || !form.internshipType) {
        setError('Company and internship type are required');
        setLoading(false);
        return;
      }

      const payload = {
        batch: user.batch,
        company: form.company,
        internshipType: form.internshipType,
        stipend: form.stipend ? parseFloat(form.stipend) : undefined,
        offerLetter: form.offerLetter || undefined,
      };

      await api.createInternship(payload);
      setMsg('Internship added successfully!');
      setTimeout(() => {
        navigate('/dashboard');
      }, 1500);
    } catch (err) {
      setError(err.message || 'Failed to create internship');
    } finally {
      setLoading(false);
    }
  };

  if (!user) {
    return null;
  }

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--background)', padding: 20 }}>
      <div className="card" style={{ maxWidth: 500, width: '100%' }}>
        <h2 style={{ textAlign: 'center', marginBottom: 24 }}>Add Internship</h2>
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          <label>Company</label>
          <select name="company" value={form.company} onChange={handleChange} required disabled={loading}>
            <option value="">Select a company</option>
            {companies.map(company => (
              <option key={company._id} value={company._id}>
                {company.name}
              </option>
            ))}
          </select>

          <label>Internship Type</label>
          <select name="internshipType" value={form.internshipType} onChange={handleChange} required disabled={loading}>
            <option value="">Select type</option>
            <option value="Online">Online</option>
            <option value="Offline">Offline</option>
            <option value="Hybrid">Hybrid</option>
          </select>

          <label>Stipend (Optional)</label>
          <input
            name="stipend"
            type="number"
            placeholder="Stipend amount"
            value={form.stipend}
            onChange={handleChange}
            disabled={loading}
          />

          <label>Offer Letter Link (Optional)</label>
          <input
            name="offerLetter"
            type="url"
            placeholder="Google Drive link"
            value={form.offerLetter}
            onChange={handleChange}
            disabled={loading}
          />

          {error && <div style={{ color: '#dc2626', fontSize: 13, padding: 8, background: '#fee', borderRadius: 6 }}>{error}</div>}
          {msg && <div style={{ color: '#16a34a', fontSize: 13, padding: 8, background: '#dcfce7', borderRadius: 6 }}>{msg}</div>}

          <div style={{ display: 'flex', gap: 8, marginTop: 12 }}>
            <button type="submit" disabled={loading} style={{ flex: 1 }}>
              {loading ? 'Adding...' : 'Add Internship'}
            </button>
            <button
              type="button"
              onClick={() => navigate('/dashboard')}
              disabled={loading}
              style={{ flex: 1, background: 'var(--surface-muted)', color: 'var(--text-primary)' }}
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddInternship;
