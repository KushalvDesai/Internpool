import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

const initialInternships = [
  { id: 1, company: 'Tech Corp', position: 'Intern', duration: '4', technology: 'React', type: 'Offline', workingHours: '35' },
  { id: 2, company: 'Web Solutions', position: 'Intern', duration: '6', technology: 'Node.js', type: 'Online', workingHours: '30' },
];

const Dashboard = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const studentData = {
    name: 'John Doe',
    email: 'john.doe@example.com',
  };
  // Add new internship from AddInternship page if redirected with state
  const [internships, setInternships] = useState(() => {
    if (location.state && location.state.newInternship) {
      return [...initialInternships, location.state.newInternship];
    }
    return initialInternships;
  });
  const [msg, setMsg] = useState('');

  return (
    <div style={{ minHeight: '100vh', background: '#f7f6f3', padding: 0 }}>
      <div className="card" style={{ maxWidth: 600, width: '100%', margin: '40px auto' }}>
        <h2 style={{ textAlign: 'center', marginBottom: 24 }}>Welcome, {studentData.name}</h2>
        <div style={{ marginBottom: 16 }}>
          <b>Name:</b> {studentData.name}<br />
          <b>Email:</b> {studentData.email}
        </div>
        <h3 style={{ margin: '16px 0 8px' }}>Internships</h3>
        <button onClick={() => navigate('/add-internship')} style={{ marginBottom: 16 }}>Add Internship</button>
        <ul style={{ paddingLeft: 0, listStyle: 'none' }}>
          {internships.map(internship => (
            <li key={internship.id} style={{ marginBottom: 16, background: '#f7f6f3', borderRadius: 8, padding: 16, border: '1px solid #e3e3e3', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <b>{internship.position}</b> at <b>{internship.company}</b> for {internship.duration} weeks<br />
                <span style={{ fontSize: 13, color: '#555' }}>Tech: {internship.technology} | Type: {internship.type} | Hours: {internship.workingHours}</span>
              </div>
              <button onClick={() => navigate(`/internship/${internship.id}`, { state: { internship } })} style={{ marginLeft: 16 }}>Open</button>
            </li>
          ))}
        </ul>
        {msg && <div style={{ color: 'green', marginTop: 10 }}>{msg}</div>}
      </div>
    </div>
  );
};

export default Dashboard;
// Dashboard now redirects to AddInternship page for adding internships.