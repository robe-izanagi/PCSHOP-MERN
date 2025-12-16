// frontend/src/components/BtnTheme.jsx
import React, { useEffect, useId, useState } from "react";
import styles from "./BtnTheme.module.css";

export default function BtnTheme() {
  const uid = useId();
  const checkboxId = `themeToggle-${uid}`;
  const maskId = `moon-mask-${uid}`;

  const [theme, setTheme] = useState("light");

  useEffect(() => {
    try {
      const t = localStorage.getItem("pcshop_theme") || "light";
      setTheme(t);
      document.body.classList.remove("light", "dark");
      document.body.classList.add(t);
    } catch (e) {
      // ignore
    }
  }, []);

  // central update that sets body class + localStorage
  function applyTheme(next) {
    try {
      localStorage.setItem("pcshop_theme", next);
      document.body.classList.remove("light", "dark");
      document.body.classList.add(next);
    } catch (e) {
      // ignore
    }
    setTheme(next);
  }

  // input checked will represent "light" (checked => light, unchecked => dark)
  function onChangeChecked(e) {
    const checked = e.target.checked;
    const next = checked ? "light" : "dark";
    applyTheme(next);
  }

  return (
    <label
      htmlFor={checkboxId}
      className={`${styles.themeToggle} ${styles.stSunMoonThemeToggleBtn}`}
      title="Toggle theme"
      aria-label="Toggle theme"
      role="button"
    >
      <input
        type="checkbox"
        id={checkboxId}
        className={styles.themeToggleInput}
        // <-- IMPORTANT: checked === light (so when light, show sun; when dark, show moon)
        checked={theme === "light"}
        onChange={onChangeChecked}
      />

      <svg
        width="18"
        height="18"
        viewBox="0 0 20 20"
        fill="currentColor"
        stroke="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
      >
        <mask id={maskId}>
          <rect x="0" y="0" width="20" height="20" fill="white" />
          <circle cx="11" cy="3" r="8" fill="black" />
        </mask>

        <circle
          className={styles.sunMoon}
          cx="10"
          cy="10"
          r="8"
          mask={`url(#${maskId})`}
        />

        <g>
          <circle
            className={`${styles.sunRay} ${styles.sunRay1}`}
            cx="18"
            cy="10"
            r="1.5"
          />
          <circle
            className={`${styles.sunRay} ${styles.sunRay2}`}
            cx="14"
            cy="16.928"
            r="1.5"
          />
          <circle
            className={`${styles.sunRay} ${styles.sunRay3}`}
            cx="6"
            cy="16.928"
            r="1.5"
          />
          <circle
            className={`${styles.sunRay} ${styles.sunRay4}`}
            cx="2"
            cy="10"
            r="1.5"
          />
          <circle
            className={`${styles.sunRay} ${styles.sunRay5}`}
            cx="6"
            cy="3.1718"
            r="1.5"
          />
          <circle
            className={`${styles.sunRay} ${styles.sunRay6}`}
            cx="14"
            cy="3.1718"
            r="1.5"
          />
        </g>
      </svg>
    </label>
  );
}
