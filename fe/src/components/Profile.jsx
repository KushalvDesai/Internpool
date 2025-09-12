import React from 'react';

const Profile = ({ student }) => {
  return (
    <div className="profile">
      <h1>{student.name}'s Profile</h1>
      <p><strong>Email:</strong> {student.email}</p>
      <p><strong>Batch:</strong> {student.batch}</p>
      <p><strong>Internship Records:</strong></p>
      <ul>
        {student.internshipRecords.map((record, index) => (
          <li key={index}>{record.title} at {record.company}</li>
        ))}
      </ul>
    </div>
  );
};

export default Profile;