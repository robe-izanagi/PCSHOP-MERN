// src/components/RequireAdmin.jsx
import React from "react";
import { Navigate, useLocation } from "react-router-dom";
import { getAdminToken } from "../utils/auth";

export default function RequireAdmin({ children }) {
  const token = getAdminToken();
  const location = useLocation();

  // If no token -> redirect to admin login
  if (!token) {
    return <Navigate to="/login-admin" replace state={{ from: location }} />;
  }

  // token exists -> allow access
  return children;
}
