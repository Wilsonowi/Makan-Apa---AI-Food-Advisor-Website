import type { WeatherData, Mood, Recommendation } from "./types";

export function buildSystemPrompt(): string {
  return `You are "Makan Apa AI", a warm, witty, and deeply knowledgeable Malaysian food expert assistant. Your job is to help users decide what to eat based on their location, time of day, weather, and emotional state.

You speak like a helpful local Malaysian friend — approachable, enthusiastic about food, and savvy about Malaysian culinary culture (mamak culture, kopitiams, cafe hopping, hawker stalls, restaurants).

Rules:
- Map time to Malaysian eating windows: Breakfast (6-10am), Brunch (10-11am), Lunch (11am-2pm), Tea/Hi-Tea (2-5pm), Dinner (6-9pm), Supper/Mamak hours (9pm-3am)
- Rainy weather → hot broths (Bak Kut Teh, Laksa, Tom Yum, Sup Kambing, Curry Mee)
- Scorching hot → cooling foods (Cendol, Ais Kacang) or air-conditioned spots
- Use local terms naturally: jom, tapau, best, lah, shiok, sedap — but don't overdo it
- Be mouth-watering and specific (not just "nasi lemak" but "fragrant coconut rice with sambal ikan bilis, half-boiled egg, and crispy anchovies")
- Always consider Malaysia's diverse cuisine: Malay, Chinese, Indian, Mamak, Nyonya, Sabahan/Sarawakian, Western cafe
- For Stressed mood: comfort foods that are rich and satisfying
- For Lazy mood: easy tapau or nearby hawker stalls
- For Celebrating: slightly premium, fun atmosphere
- For Adventurous: something less commonly known or a regional specialty
- Respond ONLY with valid JSON, no markdown, no extra text`;
}

export function buildUserPrompt(params: {
  city: string;
  time: string;
  day: string;
  weather: WeatherData;
  mood: Mood;
  extras: string;
}): string {
  const { city, time, day, weather, mood, extras } = params;
  return `User context:
- Location: ${city}, Malaysia
- Day & Time: ${day}, ${time}
- Weather: ${weather.description}, ${weather.temp}°C (feels like ${weather.feels_like}°C), humidity ${weather.humidity}%
- Weather condition: ${weather.condition}
- Mood: ${mood}
- Extra preferences/restrictions: ${extras || "None"}

Respond ONLY with this exact JSON structure:
{
  "vibe": "1-2 sentence empathy hook validating their mood + weather + time context. Warm and local.",
  "main_dish": "Specific dish name in full (e.g. 'Char Kuey Teow' or 'Nasi Lemak Ayam Goreng')",
  "main_reason": "2-3 sentences why this dish is perfect RIGHT NOW. Mention specific ingredients/flavors. Use local terms naturally.",
  "where_to_eat": "Specific type of place and what to look for (e.g. 'Find a proper char kuey teow hawker stall — look for the wok hei smoke')",
  "stall_type": "One of: Mamak | Kopitiam | Hawker Stall | Restaurant | Cafe | Food Court | Night Market",
  "price_range": "e.g. RM5-8 per person",
  "alt1_dish": "Alternative dish name (different cuisine from main)",
  "alt1_reason": "1-2 sentences why",
  "alt1_cuisine": "e.g. Chinese, Indian, Nyonya, Western, etc.",
  "alt2_dish": "Quick/budget-friendly alternative",
  "alt2_reason": "1-2 sentences why",
  "alt2_type": "e.g. 'Quick tapau', 'Budget hawker', 'Mamak staple'",
  "fun_fact": "One interesting fact about the main dish (history, region, or fun local tip)",
  "places_search_query": "5-7 word search query to find this food on Google Maps (include city name)"
}`;
}

export function parseRecommendation(text: string): Recommendation {
  const clean = text
    .replace(/```json\n?/g, "")
    .replace(/```\n?/g, "")
    .trim();
  return JSON.parse(clean) as Recommendation;
}

export function getTimeContext(date: Date): { time: string; day: string; mealPeriod: string } {
  const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
  const h = date.getHours();
  const m = date.getMinutes();
  const ampm = h >= 12 ? "PM" : "AM";
  const h12 = h % 12 || 12;
  const time = `${h12}:${m.toString().padStart(2, "0")} ${ampm}`;
  const day = days[date.getDay()];

  let mealPeriod: string;
  if (h >= 6 && h < 10) mealPeriod = "Breakfast";
  else if (h >= 10 && h < 11) mealPeriod = "Brunch";
  else if (h >= 11 && h < 15) mealPeriod = "Lunch";
  else if (h >= 15 && h < 18) mealPeriod = "Hi-Tea";
  else if (h >= 18 && h < 21) mealPeriod = "Dinner";
  else mealPeriod = "Supper/Late Night";

  return { time, day, mealPeriod };
}
