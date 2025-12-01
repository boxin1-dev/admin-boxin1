import prisma from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

const cache: Record<string, { data: Record<string, string>; time: number }> =
  {};
const TTL = 3600000; // 1 hour

// Headers CORS réutilisables
const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization",
  "Access-Control-Max-Age": "86400", // 24h
};

// Handler pour les requêtes OPTIONS (preflight)
export async function OPTIONS() {
  return NextResponse.json(
    {},
    {
      status: 204,
      headers: corsHeaders,
    }
  );
}

// Handler GET
export async function GET(request: NextRequest) {
  try {
    const lang = request.nextUrl.searchParams.get("lang") || "fr";
    const now = Date.now();

    // Vérifier le cache
    if (cache[lang] && now - cache[lang].time < TTL) {
      return NextResponse.json(cache[lang].data, {
        headers: {
          ...corsHeaders,
          "Cache-Control": "public, max-age=3600",
        },
      });
    }

    // Récupérer depuis la DB
    const texts = await prisma.textEntry.findMany({
      where: { lang },
      select: { key: true, value: true },
    });

    const textMap = texts.reduce((acc, { key, value }) => {
      acc[key] = value;
      return acc;
    }, {} as Record<string, string>);

    // Mettre en cache
    cache[lang] = { data: textMap, time: now };

    return NextResponse.json(textMap, {
      headers: {
        ...corsHeaders,
        "Cache-Control": "public, max-age=3600",
      },
    });
  } catch (error) {
    console.error("Error fetching texts:", error);
    return NextResponse.json(
      { error: "Failed to fetch texts" },
      {
        status: 500,
        headers: corsHeaders,
      }
    );
  }
}
