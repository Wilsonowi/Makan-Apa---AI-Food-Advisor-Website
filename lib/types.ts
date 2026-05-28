export type Mood =
  | "Hungry & Excited"
  | "Stressed"
  | "Lazy"
  | "Celebrating"
  | "Comfort-seeking"
  | "Adventurous"
  | "Hangry"
  | "Healthy";

export interface WeatherData {
  description: string;
  temp: number;
  feels_like: number;
  humidity: number;
  icon: string;
  city: string;
  condition: "rainy" | "hot" | "scorching" | "cool" | "normal";
}

export interface Place {
  name: string;
  address: string;
  rating?: number;
  total_ratings?: number;
  open_now?: boolean;
  photo_url?: string;
  maps_url?: string;
  price_level?: number;
}

export interface Recommendation {
  vibe: string;
  main_dish: string;
  main_reason: string;
  where_to_eat: string;
  stall_type: string;
  price_range: string;
  alt1_dish: string;
  alt1_reason: string;
  alt1_cuisine: string;
  alt2_dish: string;
  alt2_reason: string;
  alt2_type: string;
  fun_fact: string;
  places_search_query: string;
}

export interface AppState {
  step: "idle" | "locating" | "weather" | "thinking" | "places" | "done" | "error";
  location: { lat: number; lon: number; city: string } | null;
  weather: WeatherData | null;
  mood: Mood | null;
  extras: string;
  recommendation: Recommendation | null;
  places: Place[];
  error: string | null;
}
