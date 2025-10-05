// src/components/AdminRoute.jsx
import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext.jsx';

// Updated to only include ADMIN
const ROLES = ['ADMIN'];

export default function AdminRoute({ children }) {
  const { user, loading } = useAuth();

  if (loading) {
    return null; // Or a loading spinner
  }

  if (!user || !ROLES.includes(user.role)) {
    // Redirect non-admins to the home page
    return <Navigate to="/" replace />;
  }

  return children;
}