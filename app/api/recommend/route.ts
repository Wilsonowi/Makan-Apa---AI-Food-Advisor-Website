import OpenAI from "openai";
import { NextRequest, NextResponse } from "next/server";
import { buildSystemPrompt, buildUserPrompt, parseRecommendation } from "@/lib/ai";
import type { WeatherData, Mood } from "@/lib/types";

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { city, time, day, weather, mood, extras } = body as {
      city: string;
      time: string;
      day: string;
      weather: WeatherData;
      mood: Mood;
      extras: string;
    };

    if (!mood) {
      return NextResponse.json({ error: "Mood is required" }, { status: 400 });
    }

    const message = await client.chat.completions.create({
      model: "gpt-4o",
      max_tokens: 1024,
      messages: [
        {
          role: "system",
          content: buildSystemPrompt(),
        },
        {
          role: "user",
          content: buildUserPrompt({ city, time, day, weather, mood, extras }),
        },
      ],
    });

    const text = message.choices[0]?.message?.content ?? "";

    const recommendation = parseRecommendation(text);
    return NextResponse.json({ recommendation });
  } catch (error) {
    console.error("Recommend API error:", error);
    return NextResponse.json(
      { error: "Failed to get recommendation. Please try again." },
      { status: 500 }
    );
  }
}
