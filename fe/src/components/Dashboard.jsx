import React from 'react';
import { useNavigate } from 'react-router-dom';

const internships = [
  { id: 1, company: 'Tech Corp', position: 'Intern', duration: '3 months' },
  { id: 2, company: 'Web Solutions', position: 'Intern', duration: '6 months' },
];

const Dashboard = () => {
  const navigate = useNavigate();

  // Sample student data
  const studentData = {
    name: 'John Doe',
    email: 'john.doe@example.com',
  };

  return (
    <div style={{ display: 'flex', minHeight: '100vh', width: '100vw', background: '#f7f6f3' }}>
      {/* Sidebar */}
      <aside style={{ width: 220, background: '#fff', borderRight: '1px solid #e3e3e3', padding: 24, display: 'flex', flexDirection: 'column', gap: 16 }}>
        <h2 style={{ fontSize: 20, margin: 0, marginBottom: 24 }}>Menu</h2>
        <button onClick={() => navigate('/weekly-report')} style={{ width: '100%' }}>Add/Submit Report</button>
        {/* Add more sidebar actions here if needed */}
      </aside>
      {/* Main content */}
      <main style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'flex-start', padding: 32 }}>
        <div className="card" style={{ maxWidth: 600, width: '100%' }}>
          <h2 style={{ textAlign: 'center', marginBottom: 24 }}>Welcome, {studentData.name}</h2>
          <div style={{ marginBottom: 16 }}>
            <b>Name:</b> {studentData.name}<br />
            <b>Email:</b> {studentData.email}
          </div>
          <h3 style={{ margin: '16px 0 8px' }}>Internships</h3>
          <ul style={{ paddingLeft: 0, listStyle: 'none' }}>
            {internships.map(internship => (
              <li key={internship.id} style={{ marginBottom: 16, background: '#f7f6f3', borderRadius: 8, padding: 16, border: '1px solid #e3e3e3', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <b>{internship.position}</b> at <b>{internship.company}</b> for {internship.duration}
                </div>
                <button onClick={() => navigate(`/internship/${internship.id}`)} style={{ marginLeft: 16 }}>Open</button>
              </li>
            ))}
          </ul>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
// Dashboard now lists internships and links to InternshipDetail page for each.