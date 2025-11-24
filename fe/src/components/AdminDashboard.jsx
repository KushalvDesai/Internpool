import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { api } from '../lib/api';

const AdminDashboard = () => {
  const { user, logout } = useAuth();
  const [students, setStudents] = useState([]);
  const [faculty, setFaculty] = useState([]);
  const [companies, setCompanies] = useState([]);
  const [internships, setInternships] = useState([]);
  const [activeTab, setActiveTab] = useState('students');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [batchToAssign, setBatchToAssign] = useState(null);
  const [batchFacultySelection, setBatchFacultySelection] = useState('');
  const [assigningBatch, setAssigningBatch] = useState(false);

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

  const groupedStudents = students.reduce((acc, student) => {
    const key = student.batch || 'Unassigned';
    if (!acc[key]) acc[key] = [];
    acc[key].push(student);
    return acc;
  }, {});

  const sortedBatchEntries = Object.entries(groupedStudents).sort(([a], [b]) => a.localeCompare(b));

  const findFacultyForBatch = (batch) => faculty.find(f => f.assignedBatch === batch);

  const handleAssignFacultyToBatch = async () => {
    if (!batchToAssign || !batchFacultySelection) {
      alert('Please pick a batch and faculty');
      return;
    }
    try {
      setAssigningBatch(true);
      await api.assignFacultyBatch(batchFacultySelection, batchToAssign);
      setBatchToAssign(null);
      setBatchFacultySelection('');
      await fetchAll();
      alert('Batch assignment updated');
    } catch (err) {
      alert(err.message || 'Failed to assign');
    } finally {
      setAssigningBatch(false);
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
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              {students.length === 0 ? (
                <div style={{ textAlign: 'center', padding: 40, color: 'var(--text-muted)' }}>No students found</div>
              ) : (
                sortedBatchEntries.map(([batchName, batchStudents]) => {
                  const assignedFaculty = findFacultyForBatch(batchName);
                  return (
                    <div
                      key={batchName}
                      style={{
                        background: 'var(--surface-muted)',
                        borderRadius: 10,
                        padding: 20,
                        border: `1px solid var(--border-color)`,
                      }}
                    >
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
                        <div>
                          <h3 style={{ margin: 0 }}>Batch {batchName}</h3>
                          <div style={{ fontSize: 13, color: 'var(--text-muted)' }}>
                            {batchStudents.length} {batchStudents.length === 1 ? 'student' : 'students'}
                          </div>
                        </div>
                        <div style={{ textAlign: 'right' }}>
                          <div style={{ fontSize: 13, color: 'var(--text-muted)' }}>
                            Assigned Faculty:{' '}
                            {assignedFaculty ? `${assignedFaculty.fname} ${assignedFaculty.lname}` : 'None'}
                          </div>
                          {batchToAssign === batchName ? (
                            <div style={{ display: 'flex', gap: 8, marginTop: 8 }}>
                              <select
                                value={batchFacultySelection}
                                onChange={(e) => setBatchFacultySelection(e.target.value)}
                                style={{ minWidth: 200 }}
                              >
                                <option value="">Select faculty</option>
                                {faculty.map((f) => (
                                  <option key={f._id} value={f._id}>
                                    {f.fname} {f.lname} {f.assignedBatch && f.assignedBatch !== batchName ? `(Batch ${f.assignedBatch})` : ''}
                                  </option>
                                ))}
                              </select>
                              <button onClick={handleAssignFacultyToBatch} disabled={assigningBatch}>
                                {assigningBatch ? 'Assigning...' : 'Save'}
                              </button>
                              <button
                                type="button"
                                onClick={() => {
                                  setBatchToAssign(null);
                                  setBatchFacultySelection('');
                                }}
                                style={{ background: 'var(--surface)', color: 'var(--text-primary)' }}
                              >
                                Cancel
                              </button>
                            </div>
                          ) : (
                            <button
                              style={{ marginTop: 8, fontSize: 12, padding: '6px 12px' }}
                              onClick={() => {
                                setBatchToAssign(batchName);
                                setBatchFacultySelection(assignedFaculty?._id || '');
                              }}
                            >
                              {assignedFaculty ? 'Change Faculty' : 'Assign Faculty'}
                            </button>
                          )}
                        </div>
                      </div>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                        {batchStudents.map((student) => (
                          <div
                            key={student._id}
                            style={{
                              background: 'var(--surface)',
                              borderRadius: 8,
                              padding: 12,
                              border: `1px solid var(--border-color)`,
                              display: 'flex',
                              justifyContent: 'space-between',
                              alignItems: 'center',
                              fontSize: 13,
                              color: 'var(--text-muted)',
                            }}
                          >
                            <div>
                              <b>{student.fname} {student.lname}</b> — {student.studentID}
                            </div>
                            <div>{student.email}</div>
                          </div>
                        ))}
                      </div>
                    </div>
                  );
                })
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
                    <div style={{ fontSize: 13, color: 'var(--text-muted)', marginBottom: 8 }}>
                      <b>Email:</b> {f.email} | <b>Faculty ID:</b> {f.facultyID}
                    </div>
                    <div style={{ fontSize: 13, color: 'var(--text-muted)' }}>
                      Assigned Batch: {f.assignedBatch || 'None'}
                    </div>
                    <div style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 4 }}>
                      Last updated: {f.updatedAt ? new Date(f.updatedAt).toLocaleDateString() : 'N/A'}
                    </div>
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

