import React from 'react';
import { AuthProvider } from '../../store/authStore';

export default function AppProvider({ children }) {
  return (
    <AuthProvider>
      {children}
    </AuthProvider>
  );
}
