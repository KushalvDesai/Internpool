import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { api } from '../lib/api';

const Dashboard = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [internships, setInternships] = useState([]);
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [msg, setMsg] = useState('');

  const fetchData = async () => {
    try {
      setLoading(true);
      setError('');
      const [internshipsData, reportsData] = await Promise.all([
        api.getStudentInternships(),
        api.getStudentReports(),
      ]);
      setInternships(internshipsData);
      setReports(reportsData);
    } catch (err) {
      setError(err.message || 'Failed to load data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  if (!user) {
    return null;
  }

  return (
    <div style={{ minHeight: '100vh', background: 'var(--background)', padding: 20 }}>
      <div style={{ maxWidth: 900, margin: '0 auto' }}>
        <div className="card" style={{ marginBottom: 20 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
            <h2 style={{ margin: 0 }}>Welcome, {user.fname} {user.lname}</h2>
            <div style={{ display: 'flex', gap: 8 }}>
              <Link to="/companies" style={{ textDecoration: 'none' }}>
                <button style={{ fontSize: 12, padding: '6px 12px' }}>Companies</button>
              </Link>
              <Link to="/profile" style={{ textDecoration: 'none' }}>
                <button style={{ fontSize: 12, padding: '6px 12px' }}>Profile</button>
              </Link>
              <button onClick={handleLogout} style={{ background: '#dc2626', color: 'white', fontSize: 12, padding: '6px 12px' }}>
                Logout
              </button>
            </div>
          </div>
          <div style={{ fontSize: 14, color: 'var(--text-muted)' }}>
            <b>Email:</b> {user.email}<br />
            {user.studentID && <><b>Student ID:</b> {user.studentID}<br /></>}
            {user.batch && <><b>Batch:</b> {user.batch}</>}
          </div>
        </div>

        {msg && (
          <div style={{ color: '#16a34a', marginBottom: 16, padding: 12, background: '#dcfce7', borderRadius: 8, textAlign: 'center' }}>
            {msg}
          </div>
        )}

        {error && (
          <div style={{ color: '#dc2626', marginBottom: 16, padding: 12, background: '#fee', borderRadius: 8, textAlign: 'center' }}>
            {error}
            <br />
            <button onClick={fetchData} style={{ marginTop: 8, fontSize: 12 }}>Try Again</button>
          </div>
        )}

        <div className="card" style={{ marginBottom: 20 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
            <h3 style={{ margin: 0 }}>My Internships</h3>
            <div style={{ display: 'flex', gap: 8 }}>
              <button onClick={fetchData} disabled={loading} style={{ fontSize: 12, padding: '6px 12px' }}>
                {loading ? 'Loading...' : 'Refresh'}
              </button>
              <button onClick={() => navigate('/add-internship')} style={{ fontSize: 12, padding: '6px 12px' }}>
                Add Internship
              </button>
            </div>
          </div>

          {loading && <div style={{ textAlign: 'center', padding: 20, color: 'var(--text-muted)' }}>Loading...</div>}

          {!loading && internships.length === 0 && (
            <div style={{ textAlign: 'center', padding: 20, color: 'var(--text-muted)', background: 'var(--surface-muted)', borderRadius: 8 }}>
              No internships found. Click "Add Internship" to create your first internship record.
            </div>
          )}

          {!loading && internships.length > 0 && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {internships.map(internship => (
                <div
                  key={internship._id}
                  style={{
                    background: 'var(--surface-muted)',
                    borderRadius: 8,
                    padding: 16,
                    border: `1px solid var(--border-color)`,
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                  }}
                >
                  <div style={{ flex: 1 }}>
                    <div style={{ fontWeight: 600, marginBottom: 8 }}>
                      {internship.company?.name || 'Unknown Company'}
                    </div>
                    <div style={{ fontSize: 13, color: 'var(--text-muted)' }}>
                      <b>Type:</b> {internship.internshipType} | <b>Semester:</b> {internship.semester}
                      {internship.stipend && <> | <b>Stipend:</b> ₹{internship.stipend}</>}
                    </div>
                  </div>
                  <button
                    onClick={() => navigate(`/internship/${internship._id}`)}
                    style={{ marginLeft: 16, fontSize: 12, padding: '6px 12px' }}
                  >
                    View
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="card">
          <h3 style={{ margin: 0, marginBottom: 16 }}>My Reports</h3>
          {!loading && reports.length === 0 && (
            <div style={{ textAlign: 'center', padding: 20, color: 'var(--text-muted)', background: 'var(--surface-muted)', borderRadius: 8 }}>
              No reports found. Create an internship first.
            </div>
          )}
          {!loading && reports.length > 0 && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {reports.map(report => (
                <div
                  key={report._id}
                  style={{
                    background: 'var(--surface-muted)',
                    borderRadius: 8,
                    padding: 16,
                    border: `1px solid var(--border-color)`,
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                  }}
                >
                  <div>
                    <div style={{ fontWeight: 600, marginBottom: 8 }}>
                      {report.company?.name || 'Unknown Company'} - {report.technology}
                    </div>
                    <div style={{ fontSize: 13, color: 'var(--text-muted)' }}>
                      Weekly Reports: {report.weeklyReports?.length || 0}/6
                    </div>
                  </div>
                  <button
                    onClick={() => navigate(`/report/${report._id}`)}
                    style={{ fontSize: 12, padding: '6px 12px' }}
                  >
                    View
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;