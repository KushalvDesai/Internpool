import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { api } from '../lib/api';

const Profile = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setLoading(true);
        setError('');
        let data;
        if (user?.role === 'student') {
          data = await api.getStudentProfile();
        } else {
          data = user;
        }
        setProfile(data);
      } catch (err) {
        setError(err.message || 'Failed to load profile');
      } finally {
        setLoading(false);
      }
    };
    if (user) {
      fetchProfile();
    }
  }, [user]);

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

  const displayUser = profile || user;

  return (
    <div style={{ minHeight: '100vh', background: 'var(--background)', padding: 20 }}>
      <div style={{ maxWidth: 800, margin: '0 auto' }}>
        <div className="card" style={{ marginBottom: 20 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
            <h2 style={{ margin: 0 }}>Profile</h2>
            <div style={{ display: 'flex', gap: 8 }}>
              {user.role === 'student' && (
                <Link to="/dashboard" style={{ textDecoration: 'none' }}>
                  <button style={{ fontSize: 12, padding: '6px 12px' }}>Dashboard</button>
                </Link>
              )}
              {user.role === 'faculty' && (
                <Link to="/faculty" style={{ textDecoration: 'none' }}>
                  <button style={{ fontSize: 12, padding: '6px 12px' }}>Dashboard</button>
                </Link>
              )}
              {user.role === 'admin' && (
                <Link to="/admin" style={{ textDecoration: 'none' }}>
                  <button style={{ fontSize: 12, padding: '6px 12px' }}>Dashboard</button>
                </Link>
              )}
              <button onClick={logout} style={{ background: '#dc2626', color: 'white', fontSize: 12, padding: '6px 12px' }}>
                Logout
              </button>
            </div>
          </div>

          {error && (
            <div style={{ color: '#dc2626', fontSize: 13, padding: 8, background: '#fee', borderRadius: 6, marginBottom: 16 }}>
              {error}
            </div>
          )}

          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <div>
              <h3 style={{ marginBottom: 12 }}>Personal Information</h3>
              <div style={{ fontSize: 14, color: 'var(--text-muted)', display: 'flex', flexDirection: 'column', gap: 8 }}>
                <div><b>Name:</b> {displayUser.fname} {displayUser.lname}</div>
                <div><b>Email:</b> {displayUser.email}</div>
                <div><b>Role:</b> {displayUser.role}</div>
                {displayUser.studentID && <div><b>Student ID:</b> {displayUser.studentID}</div>}
                {displayUser.batch && <div><b>Batch:</b> {displayUser.batch}</div>}
                {displayUser.facultyID && <div><b>Faculty ID:</b> {displayUser.facultyID}</div>}
                {displayUser.assignedBatch && <div><b>Assigned Batch:</b> {displayUser.assignedBatch}</div>}
                {displayUser.adminID && <div><b>Admin ID:</b> {displayUser.adminID}</div>}
              </div>
            </div>

            {user.role === 'student' && (
              <div>
                <h3 style={{ marginBottom: 12 }}>Account Created</h3>
                <div style={{ fontSize: 14, color: 'var(--text-muted)' }}>
                  {displayUser.createdAt ? new Date(displayUser.createdAt).toLocaleDateString() : 'N/A'}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;