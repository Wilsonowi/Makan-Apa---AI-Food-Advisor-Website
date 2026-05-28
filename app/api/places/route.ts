import { NextRequest, NextResponse } from "next/server";
import type { Place } from "@/lib/types";

export async function POST(req: NextRequest) {
  try {
    const { query, lat, lon } = await req.json();
    const apiKey = process.env.NEXT_PUBLIC_GOOGLE_PLACES_API_KEY;

    if (!apiKey || apiKey === "your_google_places_api_key_here") {
      // Fallback: use OpenStreetMap Nominatim (free, no key needed)
      return await fallbackNominatim(query, lat, lon);
    }

    // Google Places Text Search
    const searchUrl = `https://maps.googleapis.com/maps/api/place/textsearch/json?query=${encodeURIComponent(query)}&location=${lat},${lon}&radius=5000&key=${apiKey}`;
    const res = await fetch(searchUrl);
    const data = await res.json();

    if (data.status !== "OK" || !data.results?.length) {
      return await fallbackNominatim(query, lat, lon);
    }

    const places: Place[] = data.results.slice(0, 3).map((p: any) => ({
      name: p.name,
      address: p.formatted_address?.split(",").slice(0, 2).join(",").trim() ?? "",
      rating: p.rating,
      total_ratings: p.user_ratings_total,
      open_now: p.opening_hours?.open_now,
      price_level: p.price_level,
      maps_url: `https://www.google.com/maps/place/?q=place_id:${p.place_id}`,
      photo_url: p.photos?.[0]
        ? `https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photoreference=${p.photos[0].photo_reference}&key=${apiKey}`
        : undefined,
    }));

    return NextResponse.json({ places });
  } catch (error) {
    console.error("Places API error:", error);
    return NextResponse.json({ places: [] });
  }
}

async function fallbackNominatim(query: string, lat: number, lon: number) {
  try {
    const url = `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(query)}&lat=${lat}&lon=${lon}&format=json&limit=3&addressdetails=1`;
    const res = await fetch(url, {
      headers: { "User-Agent": "MakanApaAI/1.0" },
    });
    const data = await res.json();

    const places: Place[] = data.slice(0, 3).map((p: any) => ({
      name: p.name || p.display_name.split(",")[0],
      address: p.display_name.split(",").slice(1, 3).join(",").trim(),
      maps_url: `https://www.openstreetmap.org/${p.osm_type}/${p.osm_id}`,
    }));

    return NextResponse.json({ places });
  } catch {
    return NextResponse.json({ places: [] });
  }
}
