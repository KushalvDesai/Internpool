import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { api } from '../lib/api';

const FacultyDashboard = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [students, setStudents] = useState([]);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchStudents = async () => {
    try {
      setLoading(true);
      setError('');
      const data = await api.getFacultyStudents();
      setStudents(data);
    } catch (err) {
      setError(err.message || 'Failed to load students');
    } finally {
      setLoading(false);
    }
  };

  const fetchStudentReports = async (studentId) => {
    try {
      setError('');
      const data = await api.getFacultyStudentReports(studentId);
      setReports(data);
    } catch (err) {
      setError(err.message || 'Failed to load reports');
    }
  };

  useEffect(() => {
    fetchStudents();
  }, []);

  const handleStudentClick = async (student) => {
    setSelectedStudent(student);
    await fetchStudentReports(student._id);
  };

  const handleGrade = async (reportId, weekNumber, grade, remarks = '') => {
    try {
      await api.gradeReport(reportId, weekNumber, grade, remarks);
      if (selectedStudent) {
        await fetchStudentReports(selectedStudent._id);
      }
      alert('Report graded successfully!');
    } catch (err) {
      alert(err.message || 'Failed to grade report');
    }
  };

  if (!user) {
    return null;
  }

  return (
    <div style={{ minHeight: '100vh', background: 'var(--background)', padding: 20 }}>
      <div style={{ maxWidth: 1200, margin: '0 auto' }}>
        <div className="card" style={{ marginBottom: 20 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
            <h2 style={{ margin: 0 }}>Faculty Dashboard - {user.fname} {user.lname}</h2>
            <div style={{ display: 'flex', gap: 8 }}>
              <Link to="/profile" style={{ textDecoration: 'none' }}>
                <button style={{ fontSize: 12, padding: '6px 12px' }}>Profile</button>
              </Link>
              <button onClick={logout} style={{ background: '#dc2626', color: 'white', fontSize: 12, padding: '6px 12px' }}>
                Logout
              </button>
            </div>
          </div>
          <div style={{ fontSize: 14, color: 'var(--text-muted)' }}>
            <b>Email:</b> {user.email}<br />
            {user.facultyID && <><b>Faculty ID:</b> {user.facultyID}<br /></>}
            {user.assignedBatch && <><b>Assigned Batch:</b> {user.assignedBatch}</>}
          </div>
        </div>

        {error && (
          <div style={{ color: '#dc2626', marginBottom: 16, padding: 12, background: '#fee', borderRadius: 8 }}>
            {error}
          </div>
        )}

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: 20 }}>
          <div className="card">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
              <h3 style={{ margin: 0 }}>Students</h3>
              <button onClick={fetchStudents} disabled={loading} style={{ fontSize: 12, padding: '6px 12px' }}>
                {loading ? 'Loading...' : 'Refresh'}
              </button>
            </div>

            {loading && <div style={{ textAlign: 'center', padding: 20 }}>Loading...</div>}

            {!loading && students.length === 0 && (
              <div style={{ textAlign: 'center', padding: 20, color: 'var(--text-muted)' }}>
                No students assigned to your batch.
              </div>
            )}

            {!loading && students.length > 0 && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                {students.map(student => (
                  <button
                    key={student._id}
                    onClick={() => handleStudentClick(student)}
                    style={{
                      padding: 12,
                      background: selectedStudent?._id === student._id ? 'var(--surface-muted)' : 'var(--surface)',
                      border: `1px solid var(--border-color)`,
                      borderRadius: 8,
                      textAlign: 'left',
                      cursor: 'pointer',
                    }}
                  >
                    <div style={{ fontWeight: 600 }}>{student.fname} {student.lname}</div>
                    <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>{student.studentID} | {student.batch}</div>
                  </button>
                ))}
              </div>
            )}
          </div>

          <div className="card">
            {selectedStudent ? (
              <>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
                  <h3 style={{ margin: 0 }}>
                    Reports - {selectedStudent.fname} {selectedStudent.lname}
                  </h3>
                  <button onClick={() => setSelectedStudent(null)} style={{ fontSize: 12, padding: '6px 12px' }}>
                    Back
                  </button>
                </div>

                {reports.length === 0 && (
                  <div style={{ textAlign: 'center', padding: 20, color: 'var(--text-muted)' }}>
                    No reports found for this student.
                  </div>
                )}

                {reports.length > 0 && (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                    {reports.map(report => (
                        <div
                          key={report._id}
                          style={{
                            background: 'var(--surface-muted)',
                            borderRadius: 8,
                            padding: 16,
                            border: `1px solid var(--border-color)`,
                          }}
                        >
                        <div style={{ fontWeight: 600, marginBottom: 12 }}>
                          {report.company?.name || 'Unknown Company'} - {report.technology}
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                          {report.weeklyReports?.map((week, idx) => (
                            <div
                              key={idx}
                              style={{
                                background: '#fff',
                                borderRadius: 6,
                                padding: 12,
                                border: '1px solid #e3e3e3',
                              }}
                            >
                              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                                <div>
                                  <b>Week {week.weekNumber}</b>
                                  {week.submittedAt && (
                                    <span style={{ fontSize: 12, color: '#16a34a', marginLeft: 8 }}>
                                      Submitted: {new Date(week.submittedAt).toLocaleDateString()}
                                    </span>
                                  )}
                                </div>
                                {week.grade !== undefined && (
                                  <div style={{ fontWeight: 600, color: '#16a34a' }}>Grade: {week.grade}/10</div>
                                )}
                              </div>
                              {week.submittedAt && !week.gradedAt && (
                                <div style={{ display: 'flex', gap: 8, marginTop: 8 }}>
                                  <input
                                    type="number"
                                    min="0"
                                    max="10"
                                    placeholder="Grade (0-10)"
                                    id={`grade-${report._id}-${week.weekNumber}`}
                                    style={{ flex: 1, padding: 6 }}
                                  />
                                  <button
                                    onClick={() => {
                                      const gradeInput = document.getElementById(`grade-${report._id}-${week.weekNumber}`);
                                      const grade = parseInt(gradeInput.value);
                                      if (grade >= 0 && grade <= 10) {
                                        handleGrade(report._id, week.weekNumber, grade);
                                      } else {
                                        alert('Grade must be between 0 and 10');
                                      }
                                    }}
                                    style={{ fontSize: 12, padding: '6px 12px' }}
                                  >
                                    Grade
                                  </button>
                                </div>
                              )}
                              {week.gradedAt && (
                        <div style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 8 }}>
                                  Graded: {new Date(week.gradedAt).toLocaleDateString()}
                                  {week.remarks && <div style={{ marginTop: 4 }}>Remarks: {week.remarks}</div>}
                                </div>
                              )}
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </>
            ) : (
              <div style={{ textAlign: 'center', padding: 40, color: 'var(--text-muted)' }}>
                Select a student to view their reports
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default FacultyDashboard;

