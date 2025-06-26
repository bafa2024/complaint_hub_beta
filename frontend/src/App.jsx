import React from 'react';
import { HashRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';

// Public Pages
import HomePage from './components/public/HomePage';
import UserLogin from './components/auth/UserLogin';
import UserSignup from './components/auth/UserSignup';
export default function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          {/* Landing */}
          <Route path="/" element={<HomePage />} />

          {/* Login page */}
          <Route path="/user/login" element={<UserLogin />} />
       <Route path="/user/signup" element={<UserSignup />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}
