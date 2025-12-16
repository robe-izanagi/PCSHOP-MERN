import React from "react";
import { Navigate, useLocation } from "react-router-dom";
import { getAdminToken } from "../utils/auth";

export default function RequireAdmin({ children }) {
  const token = getAdminToken();
  const location = useLocation();

  // WALANG TOKEN → balik login
  if (!token) {
    return <Navigate to="/login-admin" replace state={{ from: location }} />;
  }

  // MAY TOKEN → pasok
  return children;
}
