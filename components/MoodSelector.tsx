"use client";
import type { Mood } from "@/lib/types";
import styles from "./MoodSelector.module.css";

const MOODS: { value: Mood; emoji: string; label: string }[] = [
  { value: "Hungry & Excited", emoji: "😋", label: "Hungry & Excited" },
  { value: "Stressed", emoji: "😤", label: "Stressed" },
  { value: "Lazy", emoji: "😴", label: "Lazy" },
  { value: "Celebrating", emoji: "🎉", label: "Celebrating" },
  { value: "Comfort-seeking", emoji: "🥺", label: "Comfort-seeking" },
  { value: "Adventurous", emoji: "🗺️", label: "Adventurous" },
  { value: "Hangry", emoji: "😡", label: "Hangry" },
  { value: "Healthy", emoji: "🥗", label: "Healthy" },
];

interface Props {
  selected: Mood | null;
  onChange: (mood: Mood) => void;
}

export default function MoodSelector({ selected, onChange }: Props) {
  return (
    <div className={styles.wrapper}>
      <p className={styles.heading}>How are you feeling right now?</p>
      <div className={styles.grid}>
        {MOODS.map((m) => (
          <button
            key={m.value}
            className={`${styles.btn} ${selected === m.value ? styles.active : ""}`}
            onClick={() => onChange(m.value)}
            type="button"
          >
            <span className={styles.emoji}>{m.emoji}</span>
            <span className={styles.label}>{m.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
