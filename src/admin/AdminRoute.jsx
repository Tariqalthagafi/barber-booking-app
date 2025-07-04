// src/admin/AdminRoute.jsx
import React from 'react';
import { Navigate } from 'react-router-dom';

const AdminRoute = ({ children }) => {
  const isAdmin = localStorage.getItem('isAdmin') === 'true';

  return isAdmin ? children : <Navigate to="/admin-login" replace />;
};

export default AdminRoute;
