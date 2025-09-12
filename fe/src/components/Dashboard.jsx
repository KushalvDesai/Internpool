import React, { useState } from 'react';
import Profile from './Profile';

const Dashboard = () => {
  const [show, setShow] = useState('');
  const [msg, setMsg] = useState('');

  // Sample student data, this could be fetched from an API or context
  const studentData = {
    name: 'John Doe',
    email: 'john.doe@example.com',
    internshipRecords: [
      { id: 1, company: 'Tech Corp', position: 'Intern', duration: '3 months' },
      { id: 2, company: 'Web Solutions', position: 'Intern', duration: '6 months' },
    ],
  };

  // Dummy profile data
  const profile = { name: 'Student Name', email: 'student@email.com', batch: '2025' };

  // Minimal forms
  const forms = {
    internship: (
      <form onSubmit={async e => {
        e.preventDefault();
        await fetch('/api/student/internship', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ /* ... */ }) });
        setMsg('Internship added!');
        setShow('');
      }}>
        <input placeholder="Company Name" required style={{ width: '100%', margin: 4 }} />
        <button type="submit" style={{ width: '100%', margin: 4 }}>Add Internship</button>
      </form>
    ),
    report: (
      <form onSubmit={async e => {
        e.preventDefault();
        await fetch('/api/student/report', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ /* ... */ }) });
        setMsg('Report submitted!');
        setShow('');
      }}>
        <input placeholder="Report Title" required style={{ width: '100%', margin: 4 }} />
        <button type="submit" style={{ width: '100%', margin: 4 }}>Submit Report</button>
      </form>
    ),
    weekly: (
      <form onSubmit={async e => {
        e.preventDefault();
        await fetch('/api/student/report', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ /* ... */ }) });
        setMsg('Weekly report submitted!');
        setShow('');
      }}>
        <input placeholder="Week #" required style={{ width: '100%', margin: 4 }} />
        <button type="submit" style={{ width: '100%', margin: 4 }}>Submit Weekly Report</button>
      </form>
    ),
  };

  return (
    <div className="dashboard">
      <h1>Welcome, {studentData.name}</h1>
      <Profile student={studentData} />
      <h2>Internship Records</h2>
      <ul>
        {studentData.internshipRecords.map(record => (
          <li key={record.id}>
            {record.position} at {record.company} for {record.duration}
          </li>
        ))}
      </ul>
      <div style={{ maxWidth: 400, margin: '40px auto' }}>
        <h2>Student Dashboard</h2>
        <div style={{ border: '1px solid #ccc', padding: 10, marginBottom: 10 }}>
          <b>Name:</b> {profile.name}<br />
          <b>Email:</b> {profile.email}<br />
          <b>Batch:</b> {profile.batch}
        </div>
        <button onClick={() => setShow('internship')} style={{ width: '100%', margin: 4 }}>Add Internship</button>
        <button onClick={() => setShow('report')} style={{ width: '100%', margin: 4 }}>Add Report</button>
        <button onClick={() => setShow('weekly')} style={{ width: '100%', margin: 4 }}>Add Weekly Report</button>
        {show && <div style={{ marginTop: 10 }}>{forms[show]}</div>}
        {msg && <div style={{ color: 'green', marginTop: 10 }}>{msg}</div>}
      </div>
    </div>
  );
};

export default Dashboard;