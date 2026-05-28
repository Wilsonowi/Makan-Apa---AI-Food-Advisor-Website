"use client";
import styles from "./LoadingState.module.css";

const STEPS = [
  { key: "locating", label: "Getting your location...", icon: "📍" },
  { key: "weather", label: "Checking the weather...", icon: "🌤️" },
  { key: "thinking", label: "AI is thinking of the best makan...", icon: "🤔" },
  { key: "places", label: "Finding nearby spots...", icon: "🗺️" },
];

interface Props {
  step: string;
}

export default function LoadingState({ step }: Props) {
  const current = STEPS.findIndex((s) => s.key === step);

  return (
    <div className={styles.wrapper}>
      <div className={styles.spinner} />
      <div className={styles.steps}>
        {STEPS.map((s, i) => (
          <div
            key={s.key}
            className={`${styles.step} ${i === current ? styles.active : ""} ${
              i < current ? styles.done : ""
            }`}
          >
            <span className={styles.stepIcon}>{s.icon}</span>
            <span className={styles.stepLabel}>{s.label}</span>
            {i < current && <span className={styles.check}>✓</span>}
          </div>
        ))}
      </div>
    </div>
  );
}
