import type { WeatherData } from "./types";

export async function fetchWeather(
  lat: number,
  lon: number,
  apiKey: string
): Promise<WeatherData> {
  const res = await fetch(
    `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`
  );
  if (!res.ok) throw new Error("Weather fetch failed");
  const d = await res.json();

  const temp = Math.round(d.main?.temp ?? 31);
  const feels_like = Math.round(d.main?.feels_like ?? 31);
  const humidity = Math.round(d.main?.humidity ?? 80);
  const rawDesc: string = d.weather?.[0]?.description ?? "partly cloudy";
  const icon: string = d.weather?.[0]?.icon ?? "01d";
  const city: string = d.name ?? "Malaysia";

  let description: string;
  let condition: WeatherData["condition"];

  if (rawDesc.includes("rain") || rawDesc.includes("drizzle") || rawDesc.includes("storm")) {
    description = `Rainy (${rawDesc})`;
    condition = "rainy";
  } else if (temp >= 36) {
    description = `Scorching Hot (${rawDesc})`;
    condition = "scorching";
  } else if (temp >= 32) {
    description = `Hot & Humid (${rawDesc})`;
    condition = "hot";
  } else if (temp <= 25) {
    description = `Cool & Breezy (${rawDesc})`;
    condition = "cool";
  } else {
    description = `${rawDesc.charAt(0).toUpperCase() + rawDesc.slice(1)}`;
    condition = "normal";
  }

  return { description, temp, feels_like, humidity, icon, city, condition };
}

export function getWeatherEmoji(condition: WeatherData["condition"]): string {
  switch (condition) {
    case "rainy": return "🌧️";
    case "scorching": return "☀️";
    case "hot": return "🌤️";
    case "cool": return "🌥️";
    default: return "⛅";
  }
}
