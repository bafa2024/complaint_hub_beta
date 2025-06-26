import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import ProtectedRoute from './components/shared/ProtectedRoute';

// Public Pages
import HomePage from './components/public/HomePage';
import PublicComplaints from './components/public/PublicComplaints';
// Auth Pages
import UserLogin from './components/auth/UserLogin';
import UserSignup from './components/auth/UserSignup';
import BrandSignup from './components/brand/BrandSignup';
import BrandLogin from './components/auth/BrandLogin';

// User Pages
import UserDashboard from './components/user/UserDashboard';
import NewComplaint from './components/user/NewComplaint';
import TicketDetail from './components/user/TicketDetail';
import UserSettings from './components/user/UserSettings';

// Brand Pages
import BrandDashboard from './components/brand/BrandDashboard';
import BrandTickets from './components/brand/BrandTickets';
import BrandTicketDetail from './components/brand/BrandTicketDetail';
import BrandAnalytics from './components/brand/BrandAnalytics';
import BrandBilling from './components/brand/BrandBilling';
import BrandSettings from './components/brand/BrandSettings';

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
          {/* Public */}
          <Route path="/" element={<HomePage />} />
          <Route path="/complaints" element={<PublicComplaints />} />
          <Route path="/user/login" element={<UserLogin />} />
          <Route path="/user/signup" element={<UserSignup />} />
          <Route path="/brand/signup" element={<BrandSignup />} />
          <Route path="/brand/login" element={<BrandLogin />} />

          {/* User Protected */}
          <Route element={<ProtectedRoute role="user" />}>
            <Route path="/user/dashboard" element={<UserDashboard />} />
            <Route path="/user/complaint/new" element={<NewComplaint />} />
            <Route path="/user/ticket/:id" element={<TicketDetail />} />
            <Route path="/user/settings" element={<UserSettings />} />
          </Route>

          {/* Brand Protected */}
          <Route element={<ProtectedRoute role="brand" />}>
            <Route path="/brand/dashboard" element={<BrandDashboard />} />
            <Route path="/brand/tickets" element={<BrandTickets />} />
            <Route path="/brand/tickets/:id" element={<BrandTicketDetail />} />
            <Route path="/brand/analytics" element={<BrandAnalytics />} />
            <Route path="/brand/billing" element={<BrandBilling />} />
            <Route path="/brand/settings" element={<BrandSettings />} />
          </Route>

          {/* Admin Protected */}
          <Route element={<ProtectedRoute role="admin" />}>
            <Route path="/admin/dashboard" element={<AdminDashboard />} />
            <Route path="/admin/brands" element={<AdminBrands />} />
            <Route path="/admin/users" element={<AdminUsers />} />
            <Route path="/admin/settings" element={<AdminSettings />} />
            <Route path="/admin/reports" element={<AdminReports />} />
          </Route>

          {/* Fallback */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}
