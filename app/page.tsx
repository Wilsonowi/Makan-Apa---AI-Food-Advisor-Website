"use client";

import { useState, useEffect, useCallback } from "react";
import type { AppState, Mood, WeatherData, Recommendation, Place } from "@/lib/types";
import { getTimeContext } from "@/lib/ai";
import ContextBar from "@/components/ContextBar";
import MoodSelector from "@/components/MoodSelector";
import ResultCard from "@/components/ResultCard";
import LoadingState from "@/components/LoadingState";
import styles from "./page.module.css";

export default function Home() {
  const [state, setState] = useState<AppState>({
    step: "idle",
    location: null,
    weather: null,
    mood: null,
    extras: "",
    recommendation: null,
    places: [],
    error: null,
  });

  const [currentTime, setCurrentTime] = useState("");
  const [history, setHistory] = useState<Array<{ recommendation: Recommendation; places: Place[]; time: string }>>([]);

  useEffect(() => {
    const update = () => setCurrentTime(getTimeContext(new Date()).time);
    update();
    const interval = setInterval(update, 30000);
    return () => clearInterval(interval);
  }, []);

  const handleGetRecommendation = useCallback(async () => {
    if (!state.mood) {
      alert("Jom, pick your mood first lah! 😄");
      return;
    }

    setState((s) => ({ ...s, step: "locating", error: null, recommendation: null, places: [] }));

    // 1. Get location
    let lat = 3.139, lon = 101.6869, city = "Kuala Lumpur";
    try {
      const pos = await new Promise<GeolocationPosition>((resolve, reject) =>
        navigator.geolocation.getCurrentPosition(resolve, reject, { timeout: 7000 })
      );
      lat = pos.coords.latitude;
      lon = pos.coords.longitude;
    } catch {
      // Use KL defaults
    }

    // 2. Fetch weather
    setState((s) => ({ ...s, step: "weather", location: { lat, lon, city } }));
    let weather: WeatherData;
    try {
      const weatherKey = process.env.NEXT_PUBLIC_OPENWEATHER_API_KEY;
      const res = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${weatherKey}&units=metric`
      );
      const d = await res.json();
      city = d.name ?? "Kuala Lumpur";
      const temp = Math.round(d.main?.temp ?? 31);
      const feels_like = Math.round(d.main?.feels_like ?? 31);
      const humidity = Math.round(d.main?.humidity ?? 80);
      const rawDesc: string = d.weather?.[0]?.description ?? "partly cloudy";
      const icon: string = d.weather?.[0]?.icon ?? "01d";
      let description: string, condition: WeatherData["condition"];
      if (rawDesc.includes("rain") || rawDesc.includes("drizzle") || rawDesc.includes("storm")) {
        description = `Rainy (${rawDesc})`; condition = "rainy";
      } else if (temp >= 36) {
        description = `Scorching Hot (${rawDesc})`; condition = "scorching";
      } else if (temp >= 32) {
        description = `Hot & Humid (${rawDesc})`; condition = "hot";
      } else if (temp <= 25) {
        description = `Cool & Breezy (${rawDesc})`; condition = "cool";
      } else {
        description = `${rawDesc.charAt(0).toUpperCase() + rawDesc.slice(1)}`; condition = "normal";
      }
      weather = { description, temp, feels_like, humidity, icon, city, condition };
    } catch {
      weather = { description: "Hot & Humid", temp: 32, feels_like: 35, humidity: 82, icon: "02d", city, condition: "hot" };
    }

    setState((s) => ({ ...s, weather, location: { lat, lon, city } }));

    // 3. Get AI recommendation
    setState((s) => ({ ...s, step: "thinking" }));
    const { time, day } = getTimeContext(new Date());
    let recommendation: Recommendation;
    try {
      const res = await fetch("/api/recommend", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ city, time, day, weather, mood: state.mood, extras: state.extras }),
      });
      if (!res.ok) throw new Error("API error");
      const data = await res.json();
      recommendation = data.recommendation;
    } catch (err) {
      setState((s) => ({ ...s, step: "error", error: "Aiyoh, something went wrong. Try again lah! 😅" }));
      return;
    }

    // 4. Get nearby places
    setState((s) => ({ ...s, step: "places" }));
    let places: Place[] = [];
    try {
      const res = await fetch("/api/places", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query: recommendation.places_search_query, lat, lon }),
      });
      const data = await res.json();
      places = data.places ?? [];
    } catch {
      places = [];
    }

    // Done!
    const entry = { recommendation, places, time };
    setHistory((h) => [entry, ...h.slice(0, 4)]);
    setState((s) => ({ ...s, step: "done", recommendation, places }));
  }, [state.mood, state.extras]);

  const isLoading = ["locating", "weather", "thinking", "places"].includes(state.step);

  return (
    <main className={styles.main}>
      {/* Header */}
      <header className={styles.header}>
        <div className={styles.logo}>
          <span className={styles.logoEmoji}>🍜</span>
          <div>
            <h1 className={styles.title}>Makan Apa AI</h1>
            <p className={styles.subtitle}>Your personal Malaysian food advisor</p>
          </div>
        </div>
      </header>

      <div className={styles.container}>
        {/* Context Bar */}
        <ContextBar
          city={state.location?.city ?? null}
          time={currentTime}
          weather={state.weather}
          step={state.step}
        />

        {/* Mood Selector */}
        <section className={styles.section}>
          <MoodSelector
            selected={state.mood}
            onChange={(mood: Mood) => setState((s) => ({ ...s, mood }))}
          />
        </section>

        {/* Extras input */}
        <section className={styles.section}>
          <label className={styles.inputLabel}>Any cravings or restrictions?</label>
          <input
            type="text"
            className={styles.input}
            placeholder="e.g. no pork, want something spicy, halal only, budget under RM10..."
            value={state.extras}
            onChange={(e) => setState((s) => ({ ...s, extras: e.target.value }))}
            disabled={isLoading}
          />
        </section>

        {/* CTA Button */}
        <button
          className={`${styles.ctaBtn} ${isLoading ? styles.loading : ""}`}
          onClick={handleGetRecommendation}
          disabled={isLoading}
        >
          {isLoading ? (
            <>
              <span className={styles.btnSpinner} />
              Finding your makan...
            </>
          ) : (
            <>
              <span>🍽️</span>
              Suggest Makan!
            </>
          )}
        </button>

        {/* Loading state */}
        {isLoading && (
          <div className={styles.section}>
            <LoadingState step={state.step} />
          </div>
        )}

        {/* Error */}
        {state.step === "error" && state.error && (
          <div className={styles.error}>{state.error}</div>
        )}

        {/* Result */}
        {state.step === "done" && state.recommendation && (
          <div className={styles.section}>
            <ResultCard recommendation={state.recommendation} places={state.places} />
          </div>
        )}

        {/* History */}
        {history.length > 1 && (
          <section className={styles.historySection}>
            <h3 className={styles.historyTitle}>Earlier suggestions this session</h3>
            <div className={styles.historyGrid}>
              {history.slice(1).map((entry, i) => (
                <div key={i} className={styles.historyCard}>
                  <div className={styles.historyDish}>{entry.recommendation.main_dish}</div>
                  <div className={styles.historyTime}>{entry.time}</div>
                </div>
              ))}
            </div>
          </section>
        )}
      </div>

      <footer className={styles.footer}>
        <p>Say No To CinCai 🥬 · We Decide What You Eat 🍽️</p>
      </footer>
    </main>
  );
}
