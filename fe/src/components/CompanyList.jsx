import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { api } from '../lib/api';

const initialForm = {
  name: '',
  address: '',
  website: '',
  hrName: '',
  hrEmail: '',
  hrContact: '',
};

const CompanyList = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [companies, setCompanies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState(initialForm);
  const [saving, setSaving] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');
  const [verifyingId, setVerifyingId] = useState('');

  const fetchCompanies = async () => {
    try {
      setLoading(true);
      setError('');
      const data = await api.getCompanies();
      setCompanies(data);
    } catch (err) {
      setError(err.message || 'Failed to load companies');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCompanies();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name.trim()) {
      setError('Company name is required');
      return;
    }
    setSaving(true);
    setError('');
    try {
      const payload = {
        name: form.name,
        address: form.address,
        website: form.website,
        hr: [{
          name: form.hrName,
          email: form.hrEmail,
          contact: form.hrContact,
        }].filter(hr => hr.name || hr.email || hr.contact),
      };
      const newCompany = await api.createCompany(payload);
      setCompanies((prev) => [newCompany, ...prev]);
      setForm(initialForm);
      setShowForm(false);
      setSuccessMsg('Company added successfully');
      setTimeout(() => setSuccessMsg(''), 2500);
    } catch (err) {
      setError(err.message || 'Failed to add company');
    } finally {
      setSaving(false);
    }
  };

  const handleVerification = async (company, nextState) => {
    setError('');
    setSuccessMsg('');
    setVerifyingId(company._id);
    try {
      const updated = await api.updateCompany(company._id, { verified: nextState });
      setCompanies((prev) => prev.map(c => (c._id === company._id ? updated : c)));
      setSuccessMsg(`Company ${nextState ? 'verified' : 'set to pending'}`);
      setTimeout(() => setSuccessMsg(''), 2000);
    } catch (err) {
      setError(err.message || 'Failed to update company');
    } finally {
      setVerifyingId('');
    }
  };

  if (!user) {
    return null;
  }

  return (
    <div style={{ minHeight: '100vh', background: 'var(--background)', padding: 24 }}>
      <div style={{ maxWidth: 900, margin: '0 auto' }}>
        <div className="card" style={{ marginBottom: 20 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <h2 style={{ marginBottom: 4 }}>Companies</h2>
              <div style={{ fontSize: 14, color: 'var(--text-muted)' }}>
                All users can explore and contribute to the verified list
              </div>
            </div>
            <div style={{ display: 'flex', gap: 8 }}>
              <button onClick={() => navigate(-1)} style={{ fontSize: 12, padding: '6px 12px', background: 'var(--surface-muted)', color: 'var(--text-primary)' }}>
                Back
              </button>
              <button onClick={() => setShowForm((prev) => !prev)}>
                {showForm ? 'Close Form' : 'Add Company'}
              </button>
            </div>
          </div>
        </div>

        {showForm && (
          <div className="card" style={{ marginBottom: 20 }}>
            <h3 style={{ marginTop: 0 }}>New Company</h3>
            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              <label>Company Name *</label>
              <input name="name" value={form.name} onChange={handleChange} placeholder="e.g. Tech Corp" required />

              <label>Address</label>
              <input name="address" value={form.address} onChange={handleChange} placeholder="City, Country" />

              <label>Website</label>
              <input name="website" value={form.website} onChange={handleChange} placeholder="https://company.com" />

              <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                <div style={{ flex: 1, minWidth: 180 }}>
                  <label>HR Name</label>
                  <input name="hrName" value={form.hrName} onChange={handleChange} placeholder="Optional" />
                </div>
                <div style={{ flex: 1, minWidth: 180 }}>
                  <label>HR Email</label>
                  <input name="hrEmail" value={form.hrEmail} onChange={handleChange} type="email" placeholder="Optional" />
                </div>
                <div style={{ flex: 1, minWidth: 180 }}>
                  <label>HR Contact</label>
                  <input name="hrContact" value={form.hrContact} onChange={handleChange} placeholder="Optional" />
                </div>
              </div>

              <div style={{ display: 'flex', gap: 8, marginTop: 8 }}>
                <button type="submit" disabled={saving}>
                  {saving ? 'Saving...' : 'Save Company'}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowForm(false);
                    setForm(initialForm);
                  }}
                  style={{ background: 'var(--surface-muted)', color: 'var(--text-primary)' }}
                >
                  Cancel
                </button>
              </div>
              {error && <div style={{ color: '#dc2626', fontSize: 13 }}>{error}</div>}
            </form>
          </div>
        )}

        {successMsg && (
          <div style={{ color: '#16a34a', background: '#dcfce7', padding: 12, borderRadius: 8, textAlign: 'center', marginBottom: 16 }}>
            {successMsg}
          </div>
        )}

        <div className="card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
            <h3 style={{ margin: 0 }}>Company Directory</h3>
            <button onClick={fetchCompanies} disabled={loading} style={{ fontSize: 12, padding: '6px 12px' }}>
              {loading ? 'Refreshing...' : 'Refresh'}
            </button>
          </div>

          {loading && <div style={{ textAlign: 'center', padding: 20, color: 'var(--text-muted)' }}>Loading companies...</div>}

          {!loading && companies.length === 0 && (
            <div style={{ textAlign: 'center', padding: 20, color: 'var(--text-muted)', background: 'var(--surface-muted)', borderRadius: 8 }}>
              No companies yet. Be the first to add one!
            </div>
          )}

          {!loading && companies.length > 0 && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {companies.map((company) => (
                <div
                  key={company._id}
                  style={{
                    background: 'var(--surface-muted)',
                    borderRadius: 8,
                    padding: 16,
                    border: `1px solid var(--border-color)`,
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div style={{ fontWeight: 600, fontSize: 16 }}>{company.name}</div>
                    <span
                      style={{
                        fontSize: 12,
                        padding: '4px 10px',
                        borderRadius: 999,
                        background: company.verified ? '#22c55e33' : '#f9731633',
                        color: company.verified ? '#16a34a' : '#d97706',
                        border: `1px solid ${company.verified ? '#16a34a44' : '#d9770644'}`,
                      }}
                    >
                      {company.verified ? 'Verified' : 'Pending'}
                    </span>
                  </div>
                  <div style={{ fontSize: 13, color: 'var(--text-muted)', marginTop: 6 }}>
                    {company.address || 'No address provided'}
                  </div>
                  <div style={{ fontSize: 13, color: 'var(--text-muted)', marginTop: 4 }}>
                    {company.website ? (
                      <a href={company.website} target="_blank" rel="noreferrer" style={{ color: 'inherit' }}>
                        {company.website}
                      </a>
                    ) : (
                      'No website provided'
                    )}
                  </div>
                  {company.hr?.length > 0 && (
                    <div style={{ fontSize: 13, color: 'var(--text-muted)', marginTop: 8 }}>
                      <b>HR:</b> {company.hr[0].name || 'N/A'} {company.hr[0].email && `| ${company.hr[0].email}`} {company.hr[0].contact && `| ${company.hr[0].contact}`}
                    </div>
                  )}
                  {user.role === 'admin' && (
                    <div style={{ marginTop: 12, display: 'flex', gap: 8 }}>
                      <button
                        style={{ fontSize: 12, padding: '6px 12px' }}
                        onClick={() => handleVerification(company, !company.verified)}
                        disabled={verifyingId === company._id}
                      >
                        {verifyingId === company._id
                          ? 'Updating...'
                          : company.verified
                            ? 'Mark as Pending'
                            : 'Verify Company'}
                      </button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CompanyList;

