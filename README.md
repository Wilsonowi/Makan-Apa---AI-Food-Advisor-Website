# 🍜 Makan Apa

> Your AI-powered Malaysian food advisor — tells you exactly what to eat based on your location, weather, time, and mood.

## Features

- 🤖 **AI Recommendations** — Powered by Claude (Anthropic) with deep Malaysian food knowledge
- 📍 **Auto Location** — Detects your current location via browser geolocation
- 🌦️ **Live Weather** — Fetches real-time weather to match food to conditions
- 🗺️ **Nearby Places** — Finds actual restaurants/stalls near you via Google Places
- 😋 **Mood-aware** — 8 mood options that influence the recommendation style
- 🕐 **Time-aware** — Breakfast, Lunch, Hi-Tea, Dinner, and Supper recommendations

## Getting Started

### 1. Install dependencies

```bash
npm install
```

### 2. Set up environment variables

Copy `.env.local.example` to `.env.local` and fill in your API keys:

```bash
cp .env.local.example .env.local
```

Required keys:
| Variable | Where to get it |
|---|---|
| `ANTHROPIC_API_KEY` | [console.anthropic.com](https://console.anthropic.com) |
| `NEXT_PUBLIC_OPENWEATHER_API_KEY` | [openweathermap.org/api](https://openweathermap.org/api) (free tier works) |
| `NEXT_PUBLIC_GOOGLE_PLACES_API_KEY` | [console.cloud.google.com](https://console.cloud.google.com) — enable Places API |

> **Note:** Google Places is optional. The app falls back to OpenStreetMap (Nominatim) if no key is provided.

### 3. Run the development server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Project Structure

```
makan-apa-ai/
├── app/
│   ├── api/
│   │   ├── recommend/route.ts   # Claude AI recommendation endpoint
│   │   └── places/route.ts      # Google Places / Nominatim endpoint
│   ├── globals.css              # Design system & CSS variables
│   ├── layout.tsx               # Root layout with fonts
│   ├── page.tsx                 # Main app page
│   └── page.module.css
├── components/
│   ├── ContextBar.tsx           # Location / time / weather display
│   ├── MoodSelector.tsx         # 8-mood picker grid
│   ├── ResultCard.tsx           # AI recommendation display
│   └── LoadingState.tsx         # Step-by-step loading indicator
├── lib/
│   ├── ai.ts                    # System prompt, user prompt builders
│   ├── weather.ts               # Weather fetch utilities
│   └── types.ts                 # TypeScript interfaces
└── .env.local.example           # Environment variable template
```

## Deploying to Vercel

```bash
npm install -g vercel
vercel
```

Add your environment variables in the Vercel dashboard under **Settings → Environment Variables**.

## Future Ideas

- [ ] WhatsApp bot integration (Twilio)
- [ ] Save favourite dishes / history
- [ ] Share recommendation as image card
- [ ] Add dish photos from Unsplash
- [ ] Multi-language support (BM, Chinese)
- [ ] PWA for mobile install

## Built With

- [Next.js 14](https://nextjs.org/) — React framework
- [Claude API](https://anthropic.com) — AI recommendations
- [OpenWeatherMap](https://openweathermap.org/) — Weather data
- [Google Places API](https://developers.google.com/maps/documentation/places/web-service) — Nearby restaurants
- [Syne + DM Sans](https://fonts.google.com/) — Typography

---

Made with ❤️ for Malaysia 🇲🇾
