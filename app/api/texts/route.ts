// app/api/texts/route.ts
import prisma from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

const cache: Record<string, { data: Record<string, string>; time: number }> =
  {};
const TTL = 10000; // 1 hour

export async function GET(request: NextRequest) {
  try {
    const lang = request.nextUrl.searchParams.get("lang") || "fr";

    // Récupérer directement depuis la DB sans cache
    const texts = await prisma.textEntry.findMany({
      where: { lang },
      select: { key: true, value: true },
    });

    const textMap = texts.reduce((acc, { key, value }) => {
      acc[key] = value;
      return acc;
    }, {} as Record<string, string>);

    return NextResponse.json(textMap, {
      headers: {
        "Cache-Control": "no-store, no-cache, must-revalidate",
      },
    });
  } catch (error) {
    console.error("Error fetching texts:", error);
    return NextResponse.json(
      { error: "Failed to fetch texts" },
      {
        status: 500,
      }
    );
  }
}
