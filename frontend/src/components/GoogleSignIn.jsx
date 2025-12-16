// frontend/src/components/GoogleSignIn.jsx
import React, { useEffect } from "react";
import api from "../api.js";

/**
 * GoogleSignIn - uses Vite env (import.meta.env.VITE_GOOGLE_CLIENT_ID)
 * onSuccess receives user object returned by backend (/auth/google)
 */
export default function GoogleSignIn({ onSuccess, onError }) {
  useEffect(() => {
    const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID || null;
    if (!clientId) {
      console.warn("VITE_GOOGLE_CLIENT_ID not set (check frontend/.env)");
      return;
    }

    function initButton() {
      if (!window.google || !window.google.accounts || !window.google.accounts.id) {
        console.warn("Google Identity Services not available yet");
        return;
      }

      window.google.accounts.id.initialize({
        client_id: clientId,
        callback: async (response) => {
          try {
            const id_token = response.credential;
            const res = await api.post("/auth/google", { id_token });
            if (res?.data?.token) {
              try {
                localStorage.setItem("pcshop_token", res.data.token);
                localStorage.setItem("pcshop_email", res.data.user?.email || "");
              } catch (e) {}
            }
            if (onSuccess) onSuccess(res.data.user || {});
          } catch (err) {
            console.error("Google signin backend verify failed", err);
            if (onError) onError(err);
          }
        },
        ux_mode: "popup",
      });

      const btn = document.getElementById("google-signin-button");
      if (btn) {
        window.google.accounts.id.renderButton(btn, {
          theme: "outline",
          size: "large",
          type: "standard",
          text: "signin_with",
        });
      }
    }

    const existing = document.getElementById("gis-script");
    if (!existing) {
      const script = document.createElement("script");
      script.id = "gis-script";
      script.src = "https://accounts.google.com/gsi/client";
      script.async = true;
      script.defer = true;
      script.onload = initButton;
      document.body.appendChild(script);
      return () => {
        try { document.body.removeChild(script); } catch (e) {}
      };
    } else {
      initButton();
      return;
    }
  }, [onSuccess, onError]);

  return <div id="google-signin-button" style={{ display: "inline-block" }} />;
}
