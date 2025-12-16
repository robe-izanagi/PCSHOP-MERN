import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import Landing from "./Landing.jsx";
import OrderPage from "./OrderPage.jsx";
import AdminLogin from "./AdminLogin.jsx";
import AdminDashboard from "./admin-pages/main-content/AdminDashboard.jsx";
import AdminAnalytics from "./admin-pages/main-content/AdminAnalytics.jsx";
import AdminManagement from "./admin-pages/main-content/AdminManagement.jsx";
import { getAdminToken } from "../utils/auth.js";
import AdminPage from "./admin-pages/AdminPage.jsx";
import RequireAdmin from "../components/RequireAdmin.jsx";



// function RequireAdmin({ children }) {
//   const token = getAdminToken();
//   if (!token) return <Navigate to="/login-admin" replace />;
//   return children;
// }

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Landing />} />
      <Route path="/order-page" element={<OrderPage />} />
      <Route path="/login-admin" element={<AdminLogin />} />
      <Route
        path="/adminpage"
        element={
          <RequireAdmin >
            <AdminPage />
          </RequireAdmin>
        }
      >
        <Route index element={<AdminDashboard />} />
        <Route path="dashboard" element={<AdminDashboard />} />
        <Route path="management" element={<AdminManagement />} />
        <Route path="analytics" element={<AdminAnalytics />} />
      </Route>
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
