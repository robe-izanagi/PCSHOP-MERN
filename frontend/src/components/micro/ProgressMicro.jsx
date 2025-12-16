import React from "react";
import styles from "../css/progress.module.css";

export default function ProgressMicro() {
  const percent = 98; // dito naka-set ang value (98%)

  return (
    <div className={styles.progress} style={{ ["--percent"]: percent }}>
      <svg viewBox="0 0 200 200" className={styles.svg} aria-hidden="true">
        <defs>
          <linearGradient id="grad" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#2fc6ff" />
            <stop offset="50%" stopColor="#2081ff" />
            <stop offset="100%" stopColor="#5b7bff" />
          </linearGradient>
        </defs>

        {/* background track */}
        <circle className={styles.track} cx="100" cy="100" r="90" />

        {/* dashed segmented ring for styling */}
        <circle
          className={styles.segments}
          cx="100"
          cy="100"
          r="90"
        />

        {/* actual progress stroke */}
        <circle
          className={styles.fill}
          cx="100"
          cy="100"
          r="90"
        />
      </svg>

      <div className={styles.inner}>
        <div className={styles.percent}>{percent}%</div>
        <div className={styles.label}>performance optimized</div>
      </div>
    </div>
  );
}
