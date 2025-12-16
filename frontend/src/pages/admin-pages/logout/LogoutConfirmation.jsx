import React, { useState } from "react";
import styles from "./logout.module.css";
import { useNavigate } from "react-router-dom";
import api from "../../../api.js"; 
import { removeAdminToken } from "../../../utils/auth.js";

export default function LogoutConfirmation({ setOpenLogout }) {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  async function handleLogout() {
    if (loading) return;
    setLoading(true);

    try {
      await api.post("/admin/logout").catch(() => {});
    } catch (err) {
    }

    try {
      removeAdminToken();
    } catch (err) {
      try {
        localStorage.removeItem("admin_token");
      } catch (e) {
        // ignore
      }
    }

    try {
      localStorage.removeItem("token");
    } catch (e) {}

    setLoading(false);
    setOpenLogout(false);

    // redirect to admin login page
    navigate("/login-admin", { replace: true });
  }

  return (
    <div className={styles.logoutContainer}>
      <h1>Logout Confirmation</h1>
      <p>Are you sure you want to logout?</p>

      <div className={styles.btnContent}>
        <button
          type="button"
          className={styles.btnClose}
          onClick={() => setOpenLogout(false)}
          disabled={loading}
        >
          Cancel
        </button>

        <button
          type="button"
          className={styles.btnLogout}
          onClick={handleLogout}
          disabled={loading}
        >
          {loading ? "Logging out..." : "Logout"}
        </button>
      </div>
    </div>
  );
}
