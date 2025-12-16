
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api.js";
import { saveAdminToken } from "../utils/auth.js";
import styles from "./css/login.module.css";
import BtnTheme from "../components/BtnTheme.jsx";
import liveBg from "../assets/asus.mp4";

export default function AdminLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const nav = useNavigate();

  async function handleLogin(e) {
    e.preventDefault();
    try {
      const res = await api.post("/auth/admin/login", { email, password });
      const token = res.data.token;
      if (!token) return alert("No token received");
      saveAdminToken(token);
      nav("/adminpage/dashboard");
    } catch (err) {
      alert(err?.response?.data?.message || "Login failed");
    }
  }

  const [passType, setPassType] = useState("password");

  const handlePass = () => {
    passType === "password" ? setPassType("text") : setPassType("password");
  };

  const adminEmail = "robeizagani@gmail.com";
  const subject = "Access Request";
  const body = `Hi Admin,\n\nI would like to request access to the system. Please let me know what info you need.\n\nThanks.`;
  const mailto = `mailto:${adminEmail}?subject=${encodeURIComponent(
    subject
  )}&body=${encodeURIComponent(body)}`;
  const gmailCompose = `https://mail.google.com/mail/?view=cm&fs=1&to=${encodeURIComponent(
    adminEmail
  )}&su=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;

  return (
    <div className={styles.container}>
      <video
        src={liveBg}
        autoPlay
        loop
        muted
        playsInline
        className={styles.bgVideo}
      ></video>
      <div className={styles.loginContainer}>
        {/* <BtnTheme /> */}
        <h2 className={styles.title}>Admin Login</h2>
        <form autoComplete={false} onSubmit={handleLogin}>
          <div className={styles.fieldContent}>
            <label>Email</label>
            <input type="text" style={{ display: "none" }} />
            <input type="password" style={{ display: "none" }} />
            <input
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="admin email"
              autoComplete={false}
            />
          </div>
          <div className={styles.fieldContent}>
            <label>Password</label>
            <input
              type={passType}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="admin password"
              autoComplete={false}
            />
          </div>
          <button
            type="button"
            onClick={handlePass}
            className={styles.showPassBtn}
          >
            {passType === "password" ? "Show Password" : "Hide Password"}
          </button>
          <button type="submit" className={styles.btnLogin}>
            Login
          </button>
        </form>

        <div className={styles.footer}>
          <p>
            Want to access? contact admin!
            <br />
            Send your access request to <br />
            <a href={mailto} target="_blank" rel="noopener noreferrer">
              {adminEmail}
            </a>{" "}
            or{" "}
            <a href={gmailCompose} target="_blank" rel="noopener noreferrer">
              compose in Gmail
            </a>
            .
          </p>
        </div>
      </div>
    </div>
  );
}
