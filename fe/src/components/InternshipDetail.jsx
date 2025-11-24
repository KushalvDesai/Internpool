import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { api } from '../lib/api';

const InternshipDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [internship, setInternship] = useState(null);
  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError('');
        const [internships, reports] = await Promise.all([
          api.getStudentInternships(),
          api.getStudentReports(),
        ]);
        const foundInternship = internships.find(i => i._id === id);
        if (!foundInternship) {
          setError('Internship not found');
          return;
        }
        setInternship(foundInternship);
        const foundReport = reports.find(r => r.record?._id === id || r.record === id);
        if (foundReport) {
          setReport(foundReport);
        }
      } catch (err) {
        setError(err.message || 'Failed to load internship');
      } finally {
        setLoading(false);
      }
    };
    if (id) {
      fetchData();
    }
  }, [id]);

  const handleCreateReport = async () => {
    try {
      setError('');
      const reports = await api.getStudentReports();
      const existingReport = reports.find(r => r.record?._id === id || r.record === id);
      if (existingReport) {
        navigate(`/report/${existingReport._id}`);
        return;
      }

      // Create a new report
      const technology = prompt('Enter technology used:');
      if (!technology) return;

      const newReport = await api.createReport({
        record: id,
        technology,
      });
      navigate(`/report/${newReport._id}`);
    } catch (err) {
      setError(err.message || 'Failed to create report');
    }
  };

  if (!user) {
    return null;
  }

  if (loading) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--background)' }}>
        <div>Loading...</div>
      </div>
    );
  }

  if (error && !internship) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--background)' }}>
        <div className="card" style={{ maxWidth: 500 }}>
          <div style={{ color: '#dc2626', marginBottom: 16 }}>{error}</div>
          <button onClick={() => navigate('/dashboard')}>Back to Dashboard</button>
        </div>
      </div>
    );
  }

  return (
    <div style={{ minHeight: '100vh', background: 'var(--background)', padding: 20 }}>
      <div style={{ maxWidth: 900, margin: '0 auto' }}>
        <div className="card" style={{ marginBottom: 20 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
            <h2 style={{ margin: 0 }}>
              {internship?.company?.name || 'Unknown Company'}
            </h2>
            <button onClick={() => navigate('/dashboard')} style={{ fontSize: 12, padding: '6px 12px' }}>
              Back to Dashboard
            </button>
          </div>

          {error && <div style={{ color: '#dc2626', fontSize: 13, padding: 8, background: '#fee', borderRadius: 6, marginBottom: 16 }}>{error}</div>}

          <div style={{ fontSize: 14, color: 'var(--text-muted)', marginBottom: 16 }}>
            <div><b>Internship Type:</b> {internship?.internshipType}</div>
            <div><b>Semester:</b> {internship?.semester}</div>
            {internship?.stipend && <div><b>Stipend:</b> ₹{internship.stipend}</div>}
            {internship?.offerLetter && (
              <div>
                <b>Offer Letter:</b>{' '}
                <a href={internship.offerLetter} target="_blank" rel="noopener noreferrer" style={{ color: '#646cff' }}>
                  View
                </a>
              </div>
            )}
            {internship?.completionCertificate && (
              <div>
                <b>Completion Certificate:</b>{' '}
                <a href={internship.completionCertificate} target="_blank" rel="noopener noreferrer" style={{ color: '#646cff' }}>
                  View
                </a>
              </div>
            )}
          </div>

          <div style={{ marginTop: 24 }}>
            {report ? (
              <div>
                <div style={{ marginBottom: 16 }}>
                  <b>Report Status:</b> {report.weeklyReports?.length || 0}/6 weekly reports submitted
                </div>
                <button
                  onClick={() => navigate(`/report/${report._id}`)}
                  style={{ background: '#222', color: '#fff', padding: '10px 20px', borderRadius: 8 }}
                >
                  View/Edit Report
                </button>
              </div>
            ) : (
              <div>
                <div style={{ marginBottom: 16, color: 'var(--text-muted)' }}>
                  No report created yet. Create a report to start submitting weekly reports.
                </div>
                <button
                  onClick={handleCreateReport}
                  style={{ background: '#222', color: '#fff', padding: '10px 20px', borderRadius: 8 }}
                >
                  Create Report
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default InternshipDetail;
