import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Signup from './components/Signup';
import Login from './components/Login';
import Dashboard from './components/Dashboard';
import WeeklyReport from './components/WeeklyReport';
import InternshipDetail from './components/InternshipDetail';
import AddInternship from './components/AddInternship';

const App = () => (
  <Router>
    <Routes>
      <Route path="/" element={<Signup />} />
      <Route path="/login" element={<Login />} />
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/weekly-report" element={<WeeklyReport />} />
      <Route path="/internship/:id" element={<InternshipDetail />} />
      <Route path="/add-internship" element={<AddInternship />} />
    </Routes>
  </Router>
);

export default App;