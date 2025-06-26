import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from "./contexts/AuthContext.jsx";
import ProtectedRoute from './components/shared/ProtectedRoute';

// Public Pages
import HomePage from './components/public/HomePage';
import UserLogin from './components/auth/UserLogin';
import UserSignup from './components/auth/UserSignup';
import BrandLogin from './components/auth/BrandLogin';
import PublicComplaints from './components/public/PublicComplaints';

// User Pages
import UserDashboard from './components/user/UserDashboard';
import TicketDetail from './components/user/TicketDetail';
import UserSettings from './components/user/UserSettings';

// Brand Pages
import BrandDashboard from './components/brand/BrandDashboard';
import BrandTickets from './components/brand/BrandTickets';
import BrandAnalytics from './components/brand/BrandAnalytics';
import BrandSettings from './components/brand/BrandSettings';
import BrandBilling from './components/brand/BrandBilling';

// Admin Pages
import AdminDashboard from './components/admin/AdminDashboard';
import AdminBrands from './components/admin/AdminBrands';
import AdminUsers from './components/admin/AdminUsers';
import AdminSettings from './components/admin/AdminSettings';
import AdminReports from './components/admin/AdminReports';

export default function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<HomePage />} />
          <Route path="/complaints" element={<PublicComplaints />} />
          <Route path="/user/login" element={<UserLogin />} />
          <Route path="/user/signup" element={<UserSignup />} />
          <Route path="/brand/login" element={<BrandLogin />} />
          
          {/* User Protected Routes */}
          <Route path="/user" element={<ProtectedRoute role="user" />}>
            <Route path="dashboard" element={<UserDashboard />} />
            <Route path="ticket/:id" element={<TicketDetail />} />
            <Route path="settings" element={<UserSettings />} />
          </Route>
          
          {/* Brand Protected Routes */}
          <Route path="/brand" element={<ProtectedRoute role="brand" />}>
            <Route path="dashboard" element={<BrandDashboard />} />
            <Route path="tickets" element={<BrandTickets />} />
            <Route path="analytics" element={<BrandAnalytics />} />
            <Route path="settings" element={<BrandSettings />} />
            <Route path="billing" element={<BrandBilling />} />
          </Route>
          
          {/* Admin Protected Routes */}
          <Route path="/admin" element={<ProtectedRoute role="admin" />}>
            <Route path="dashboard" element={<AdminDashboard />} />
            <Route path="brands" element={<AdminBrands />} />
            <Route path="users" element={<AdminUsers />} />
            <Route path="settings" element={<AdminSettings />} />
            <Route path="reports" element={<AdminReports />} />
          </Route>
          
          {/* Fallback */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}