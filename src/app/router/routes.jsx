import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import LoginPage from '../../features/auth/pages/LoginPage';
import DashboardPage from '../../features/dashboard/pages/DashboardPage';
import UsersPage from '../../features/users/pages/UsersPage';
import WorkersManagementPage from '../../features/workers/pages/WorkersManagementPage';
import ServicesManagementPage from '../../features/services/pages/ServicesManagementPage';
import OrdersManagementPage from '../../features/orders/pages/OrdersManagementPage';
import WorkerDashboardPage from '../../features/workers/pages/WorkerDashboardPage';
import HomePage from '../../pages/HomePage';
import ProtectedRoute from './ProtectedRoute';
import { useAuth } from '../../store/authStore';

// Root redirector based on authenticated user's role
function HomeOrDashboardRedirect() {
  const { role } = useAuth();
  const normalizedRole = String(role || '').toUpperCase();

  if (normalizedRole === 'ADMIN') {
    return <Navigate to="/admin/dashboard" replace />;
  }
  if (normalizedRole === 'WORKER') {
    return <Navigate to="/worker/dashboard" replace />;
  }
  return <HomePage />;
}

export default function AppRoutes() {
  return (
    <Routes>
      {/* Public Auth Route */}
      <Route path="/login" element={<LoginPage />} />

      {/* Admin Routes */}
      <Route
        path="/admin/dashboard"
        element={
          <ProtectedRoute allowedRoles={['ADMIN']}>
            <DashboardPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/users"
        element={
          <ProtectedRoute allowedRoles={['ADMIN']}>
            <UsersPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/workers"
        element={
          <ProtectedRoute allowedRoles={['ADMIN']}>
            <WorkersManagementPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/services"
        element={
          <ProtectedRoute allowedRoles={['ADMIN']}>
            <ServicesManagementPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/orders"
        element={
          <ProtectedRoute allowedRoles={['ADMIN']}>
            <OrdersManagementPage />
          </ProtectedRoute>
        }
      />
      <Route path="/admin" element={<Navigate to="/admin/dashboard" replace />} />

      {/* Worker Route */}
      <Route
        path="/worker/dashboard"
        element={
          <ProtectedRoute allowedRoles={['WORKER']}>
            <WorkerDashboardPage />
          </ProtectedRoute>
        }
      />
      <Route path="/worker" element={<Navigate to="/worker/dashboard" replace />} />

      {/* Customer / Home Route (Auto redirect ADMIN -> /admin/dashboard, WORKER -> /worker/dashboard) */}
      <Route
        path="/"
        element={
          <ProtectedRoute allowedRoles={['CUSTOMER', 'ADMIN', 'WORKER']}>
            <HomeOrDashboardRedirect />
          </ProtectedRoute>
        }
      />

      {/* Fallback Catch-all Route */}
      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  );
}
