// app/api/texts/route.ts
import prisma from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

const cache: Record<string, { data: Record<string, string>; time: number }> =
  {};
const TTL = 3600000; // 1 hour

export async function GET(request: NextRequest) {
  try {
    const lang = request.nextUrl.searchParams.get("lang") || "fr";
    const now = Date.now();

    if (cache[lang] && now - cache[lang].time < TTL) {
      return NextResponse.json(cache[lang].data, {
        headers: {
          "Access-Control-Allow-Origin": "*",
          "Cache-Control": "public, max-age=3600",
        },
      });
    }

    const texts = await prisma.textEntry.findMany({
      where: { lang },
      select: { key: true, value: true },
    });

    const textMap = texts.reduce((acc, { key, value }) => {
      acc[key] = value;
      return acc;
    }, {} as Record<string, string>);

    cache[lang] = { data: textMap, time: now };

    return NextResponse.json(textMap, {
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Cache-Control": "public, max-age=3600",
      },
    });
  } catch (error) {
    console.error("Error fetching texts:", error);
    return NextResponse.json(
      { error: "Failed to fetch texts" },
      { status: 500, headers: { "Access-Control-Allow-Origin": "*" } }
    );
  }
}
