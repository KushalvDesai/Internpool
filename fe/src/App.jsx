import React, { Suspense, lazy } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import ThemeToggle from './components/ThemeToggle';

const Signup = lazy(() => import('./components/Signup'));
const Login = lazy(() => import('./components/Login'));
const Dashboard = lazy(() => import('./components/Dashboard'));
const FacultyDashboard = lazy(() => import('./components/FacultyDashboard'));
const AdminDashboard = lazy(() => import('./components/AdminDashboard'));
const WeeklyReport = lazy(() => import('./components/WeeklyReport'));
const InternshipDetail = lazy(() => import('./components/InternshipDetail'));
const AddInternship = lazy(() => import('./components/AddInternship'));
const Profile = lazy(() => import('./components/Profile'));
const CompanyList = lazy(() => import('./components/CompanyList'));

const LoadingSpinner = () => (
  <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--background)' }}>
    <div>Loading...</div>
  </div>
);

const App = () => (
  <AuthProvider>
    <Router>
      <Suspense fallback={<LoadingSpinner />}>
        <Routes>
          <Route path="/" element={<Navigate to="/login" replace />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/faculty"
            element={
              <ProtectedRoute allowedRoles={['faculty']}>
                <FacultyDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin"
            element={
              <ProtectedRoute allowedRoles={['admin']}>
                <AdminDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/profile"
            element={
              <ProtectedRoute>
                <Profile />
              </ProtectedRoute>
            }
          />
          <Route
            path="/companies"
            element={
              <ProtectedRoute>
                <CompanyList />
              </ProtectedRoute>
            }
          />
          <Route
            path="/add-internship"
            element={
              <ProtectedRoute allowedRoles={['student']}>
                <AddInternship />
              </ProtectedRoute>
            }
          />
          <Route
            path="/internship/:id"
            element={
              <ProtectedRoute allowedRoles={['student']}>
                <InternshipDetail />
              </ProtectedRoute>
            }
          />
          <Route
            path="/report/:reportId"
            element={
              <ProtectedRoute allowedRoles={['student']}>
                <WeeklyReport />
              </ProtectedRoute>
            }
          />
        </Routes>
      </Suspense>
    </Router>
    <ThemeToggle />
  </AuthProvider>
);

export default App;