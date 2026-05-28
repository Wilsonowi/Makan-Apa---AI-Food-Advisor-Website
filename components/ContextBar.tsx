"use client";
import { getWeatherEmoji } from "@/lib/weather";
import type { WeatherData } from "@/lib/types";
import styles from "./ContextBar.module.css";

interface Props {
  city: string | null;
  time: string;
  weather: WeatherData | null;
  step: string;
}

export default function ContextBar({ city, time, weather, step }: Props) {
  const isLoading = step === "locating" || step === "weather";

  return (
    <div className={styles.bar}>
      <div className={styles.chip}>
        <span className={styles.icon}>📍</span>
        <div>
          <div className={styles.label}>Location</div>
          <div className={styles.value}>
            {step === "locating" ? (
              <span className={styles.skeleton} />
            ) : (
              city ?? "Malaysia"
            )}
          </div>
        </div>
      </div>

      <div className={styles.chip}>
        <span className={styles.icon}>🕐</span>
        <div>
          <div className={styles.label}>Time</div>
          <div className={styles.value}>{time}</div>
        </div>
      </div>

      <div className={styles.chip}>
        <span className={styles.icon}>
          {weather ? getWeatherEmoji(weather.condition) : "🌤️"}
        </span>
        <div>
          <div className={styles.label}>Weather</div>
          <div className={styles.value}>
            {step === "locating" || step === "weather" ? (
              <span className={styles.skeleton} />
            ) : weather ? (
              `${weather.temp}°C · ${weather.condition === "rainy" ? "Rainy" : weather.condition === "scorching" ? "Scorching" : weather.condition === "hot" ? "Hot" : weather.condition === "cool" ? "Cool" : "Cloudy"}`
            ) : (
              "—"
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
