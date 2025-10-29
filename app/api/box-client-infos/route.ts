// app/api/boxClientInfo/route.ts
import prisma from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

interface BoxClientInfoData {
  ip: string;
  hostname?: string;
  city?: string;
  region?: string;
  country?: string;
  loc?: string;
  org?: string;
  timezone?: string;
  readme?: string;
  macAddress?: string;
}

export async function POST(request: NextRequest) {
  try {
    const data: BoxClientInfoData = await request.json();

    if (!data.ip) {
      return NextResponse.json(
        { success: false, error: "L'adresse IP est requise" },
        { status: 400 }
      );
    }

    const record = await prisma.boxClientInfo.create({
      data: {
        ip: data.ip,
        hostname: data.hostname,
        city: data.city,
        region: data.region,
        country: data.country,
        loc: data.loc,
        org: data.org,
        timezone: data.timezone,
        readme: data.readme,
        macAddress: data.macAddress,
      },
    });

    return NextResponse.json(
      {
        success: true,
        message: "Données IP enregistrées avec succès",
        data: record,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Erreur lors du traitement:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Erreur lors du traitement des données",
        details: error instanceof Error ? error.message : "Erreur inconnue",
      },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const clientsNumber = await prisma.boxClientInfo.count();
    return NextResponse.json(clientsNumber);
  } catch (error) {
    console.error("Erreur lors du traitement:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Erreur lors du traitement des données",
        details: error instanceof Error ? error.message : "Erreur inconnue",
      },
      { status: 500 }
    );
  }
}
