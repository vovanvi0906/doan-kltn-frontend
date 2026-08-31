import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import AppRoutes from './routes';

export default function AppRouter() {
  return (
    <BrowserRouter>
      <AppRoutes />
    </BrowserRouter>
  );
}
