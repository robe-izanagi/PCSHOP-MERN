// src/components/RequireAdmin.jsx
import React from "react";
import { Navigate, useLocation } from "react-router-dom";
import { getAdminToken, removeAdminToken } from "../utils/auth";

// Check if token is valid & not expired
function isJwtValid(token) {
  if (!token) return false;

  try {
    const base64Url = token.split(".")[1];
    if (!base64Url) return false;

    const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split("")
        .map((c) => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
        .join("")
    );

    const payload = JSON.parse(jsonPayload);

    if (!payload.exp) return false;

    const now = Math.floor(Date.now() / 1000);
    return payload.exp > now; // not expired
  } catch (err) {
    return false;
  }
}

export default function RequireAdmin({ children }) {
  const token = getAdminToken();
  const location = useLocation();

  // No token or invalid/expired token → redirect to login
  if (!token || !isJwtValid(token)) {
    removeAdminToken();
    return <Navigate to="/login-admin" replace state={{ from: location }} />;
  }

  // Token valid → allow access
  return children;
}
