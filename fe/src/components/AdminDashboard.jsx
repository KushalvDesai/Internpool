import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { api } from '../lib/api';

const AdminDashboard = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [students, setStudents] = useState([]);
  const [faculty, setFaculty] = useState([]);
  const [companies, setCompanies] = useState([]);
  const [internships, setInternships] = useState([]);
  const [activeTab, setActiveTab] = useState('students');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedFaculty, setSelectedFaculty] = useState(null);
  const [batchInput, setBatchInput] = useState('');

  const fetchAll = async () => {
    try {
      setLoading(true);
      setError('');
      const [studentsData, facultyData, companiesData, internshipsData] = await Promise.all([
        api.getAllStudents(),
        api.getAllFaculty(),
        api.getAdminCompanies(),
        api.getAllInternships(),
      ]);
      setStudents(studentsData);
      setFaculty(facultyData);
      setCompanies(companiesData);
      setInternships(internshipsData);
    } catch (err) {
      setError(err.message || 'Failed to load data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAll();
  }, []);

  const handleAssignBatch = async (facultyId) => {
    if (!batchInput.trim()) {
      alert('Please enter a batch');
      return;
    }
    try {
      await api.assignFacultyBatch(facultyId, batchInput);
      setBatchInput('');
      setSelectedFaculty(null);
      await fetchAll();
      alert('Batch assigned successfully!');
    } catch (err) {
      alert(err.message || 'Failed to assign batch');
    }
  };

  if (!user) {
    return null;
  }

  return (
    <div style={{ minHeight: '100vh', background: 'var(--background)', padding: 20 }}>
      <div style={{ maxWidth: 1400, margin: '0 auto' }}>
        <div className="card" style={{ marginBottom: 20 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
            <h2 style={{ margin: 0 }}>Admin Dashboard - {user.fname} {user.lname}</h2>
            <div style={{ display: 'flex', gap: 8 }}>
              <Link to="/companies" style={{ textDecoration: 'none' }}>
                <button style={{ fontSize: 12, padding: '6px 12px' }}>Companies</button>
              </Link>
              <Link to="/profile" style={{ textDecoration: 'none' }}>
                <button style={{ fontSize: 12, padding: '6px 12px' }}>Profile</button>
              </Link>
              <button onClick={logout} style={{ background: '#dc2626', color: 'white', fontSize: 12, padding: '6px 12px' }}>
                Logout
              </button>
            </div>
          </div>
          <div style={{ fontSize: 14, color: 'var(--text-muted)' }}>
            <b>Email:</b> {user.email}
            {user.adminID && <><br /><b>Admin ID:</b> {user.adminID}</>}
          </div>
        </div>

        {error && (
          <div style={{ color: '#dc2626', marginBottom: 16, padding: 12, background: '#fee', borderRadius: 8 }}>
            {error}
          </div>
        )}

        <div className="card" style={{ marginBottom: 20 }}>
          <div style={{ display: 'flex', gap: 8, marginBottom: 16 }}>
            <button
              onClick={() => setActiveTab('students')}
              style={{
                padding: '8px 16px',
                background: activeTab === 'students' ? 'var(--surface-muted)' : 'var(--surface)',
                border: `1px solid var(--border-color)`,
                borderRadius: 6,
                cursor: 'pointer',
              }}
            >
              Students ({students.length})
            </button>
            <button
              onClick={() => setActiveTab('faculty')}
              style={{
                padding: '8px 16px',
                background: activeTab === 'faculty' ? 'var(--surface-muted)' : 'var(--surface)',
                border: `1px solid var(--border-color)`,
                borderRadius: 6,
                cursor: 'pointer',
              }}
            >
              Faculty ({faculty.length})
            </button>
            <button
              onClick={() => setActiveTab('companies')}
              style={{
                padding: '8px 16px',
                background: activeTab === 'companies' ? 'var(--surface-muted)' : 'var(--surface)',
                border: `1px solid var(--border-color)`,
                borderRadius: 6,
                cursor: 'pointer',
              }}
            >
              Companies ({companies.length})
            </button>
            <button
              onClick={() => setActiveTab('internships')}
              style={{
                padding: '8px 16px',
                background: activeTab === 'internships' ? 'var(--surface-muted)' : 'var(--surface)',
                border: `1px solid var(--border-color)`,
                borderRadius: 6,
                cursor: 'pointer',
              }}
            >
              Internships ({internships.length})
            </button>
            <button onClick={fetchAll} disabled={loading} style={{ marginLeft: 'auto', fontSize: 12, padding: '6px 12px' }}>
              {loading ? 'Loading...' : 'Refresh'}
            </button>
          </div>

          {loading && <div style={{ textAlign: 'center', padding: 40 }}>Loading...</div>}

          {!loading && activeTab === 'students' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {students.length === 0 ? (
                <div style={{ textAlign: 'center', padding: 40, color: 'var(--text-muted)' }}>No students found</div>
              ) : (
                students.map(student => (
                  <div
                    key={student._id}
                    style={{
                      background: 'var(--surface-muted)',
                      borderRadius: 8,
                      padding: 16,
                      border: `1px solid var(--border-color)`,
                    }}
                  >
                    <div style={{ fontWeight: 600, marginBottom: 8 }}>
                      {student.fname} {student.lname}
                    </div>
                    <div style={{ fontSize: 13, color: 'var(--text-muted)' }}>
                      <b>Email:</b> {student.email} | <b>Student ID:</b> {student.studentID} | <b>Batch:</b> {student.batch}
                    </div>
                  </div>
                ))
              )}
            </div>
          )}

          {!loading && activeTab === 'faculty' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {faculty.length === 0 ? (
                <div style={{ textAlign: 'center', padding: 40, color: 'var(--text-muted)' }}>No faculty found</div>
              ) : (
                faculty.map(f => (
                  <div
                    key={f._id}
                    style={{
                      background: 'var(--surface-muted)',
                      borderRadius: 8,
                      padding: 16,
                      border: `1px solid var(--border-color)`,
                    }}
                  >
                    <div style={{ fontWeight: 600, marginBottom: 8 }}>
                      {f.fname} {f.lname}
                    </div>
                    <div style={{ fontSize: 13, color: 'var(--text-muted)', marginBottom: 12 }}>
                      <b>Email:</b> {f.email} | <b>Faculty ID:</b> {f.facultyID} | <b>Assigned Batch:</b> {f.assignedBatch || 'None'}
                    </div>
                    {selectedFaculty?._id === f._id ? (
                      <div style={{ display: 'flex', gap: 8 }}>
                        <input
                          type="text"
                          placeholder="Enter batch"
                          value={batchInput}
                          onChange={(e) => setBatchInput(e.target.value)}
                          style={{ flex: 1, padding: 6 }}
                        />
                        <button
                          onClick={() => handleAssignBatch(f._id)}
                          style={{ fontSize: 12, padding: '6px 12px' }}
                        >
                          Assign
                        </button>
                        <button
                          onClick={() => {
                            setSelectedFaculty(null);
                            setBatchInput('');
                          }}
                          style={{ fontSize: 12, padding: '6px 12px', background: 'var(--surface-muted)', color: 'var(--text-primary)' }}
                        >
                          Cancel
                        </button>
                      </div>
                    ) : (
                      <button
                        onClick={() => {
                          setSelectedFaculty(f);
                          setBatchInput(f.assignedBatch || '');
                        }}
                        style={{ fontSize: 12, padding: '6px 12px' }}
                      >
                        Assign Batch
                      </button>
                    )}
                  </div>
                ))
              )}
            </div>
          )}

          {!loading && activeTab === 'companies' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {companies.length === 0 ? (
                <div style={{ textAlign: 'center', padding: 40, color: 'var(--text-muted)' }}>No companies found</div>
              ) : (
                companies.map(company => (
                  <div
                    key={company._id}
                    style={{
                      background: 'var(--surface-muted)',
                      borderRadius: 8,
                      padding: 16,
                      border: `1px solid var(--border-color)`,
                    }}
                  >
                    <div style={{ fontWeight: 600, marginBottom: 8 }}>{company.name}</div>
                    <div style={{ fontSize: 13, color: 'var(--text-muted)' }}>
                      <b>Address:</b> {company.address || 'N/A'} | <b>Website:</b> {company.website || 'N/A'} | <b>Verified:</b> {company.verified ? 'Yes' : 'No'}
                    </div>
                  </div>
                ))
              )}
            </div>
          )}

          {!loading && activeTab === 'internships' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {internships.length === 0 ? (
                <div style={{ textAlign: 'center', padding: 40, color: 'var(--text-muted)' }}>No internships found</div>
              ) : (
                internships.map(internship => (
                  <div
                    key={internship._id}
                    style={{
                      background: 'var(--surface-muted)',
                      borderRadius: 8,
                      padding: 16,
                      border: `1px solid var(--border-color)`,
                    }}
                  >
                    <div style={{ fontWeight: 600, marginBottom: 8 }}>
                      {internship.student?.fname} {internship.student?.lname} - {internship.company?.name || 'Unknown Company'}
                    </div>
                    <div style={{ fontSize: 13, color: 'var(--text-muted)' }}>
                      <b>Type:</b> {internship.internshipType} | <b>Semester:</b> {internship.semester}
                      {internship.stipend && ` | <b>Stipend:</b> ₹${internship.stipend}`}
                    </div>
                  </div>
                ))
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;

