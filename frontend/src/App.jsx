import React from 'react';
import { HashRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import ProtectedRoute from './components/shared/ProtectedRoute';

// Public Pages
import HomePage from './components/public/HomePage';
import UserLogin from './components/auth/UserLogin';
import UserSignup from './components/auth/UserSignup';
import UserDashboard from './components/user/UserDashboard';

export default function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          {/* Landing */}
          <Route path="/" element={<HomePage />} />

          {/* Auth pages */}
          <Route path="/user/login" element={<UserLogin />} />
          <Route path="/user/signup" element={<UserSignup />} />
          
          {/* Protected User Routes */}
          <Route path="/user" element={<ProtectedRoute role="user" />}>
            <Route path="dashboard" element={<UserDashboard />} />
          </Route>
          
          {/* Redirect /user to /user/dashboard */}
          <Route path="/user" element={<Navigate to="/user/dashboard" replace />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}