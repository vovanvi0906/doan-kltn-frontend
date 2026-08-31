import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import LoginPage from '../../features/auth/pages/LoginPage';
import DashboardPage from '../../features/dashboard/pages/DashboardPage';
import WorkerDashboardPage from '../../features/workers/pages/WorkerDashboardPage';
import HomePage from '../../pages/HomePage';
import ProtectedRoute from './ProtectedRoute';

export default function AppRoutes() {
  return (
    <Routes>
      {/* Public Auth Route */}
      <Route path="/login" element={<LoginPage />} />

      {/* Admin Route */}
      <Route
        path="/admin/dashboard"
        element={
          <ProtectedRoute allowedRoles={['ADMIN']}>
            <DashboardPage />
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

      {/* Customer / Home Route */}
      <Route
        path="/"
        element={
          <ProtectedRoute allowedRoles={['CUSTOMER', 'ADMIN', 'WORKER']}>
            <HomePage />
          </ProtectedRoute>
        }
      />

      {/* Fallback Catch-all Route */}
      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  );
}
