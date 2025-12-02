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
  macAddress: string;
}

export async function POST(request: NextRequest) {
  try {
    const data: BoxClientInfoData = await request.json();

    // Validation : On a besoin de l'IP et surtout de la Mac Address pour l'unicité
    if (!data.ip || !data.macAddress) {
      return NextResponse.json(
        { success: false, error: "L'adresse IP et l'adresse MAC sont requises" },
        { status: 400 }
      );
    }

    // Utilisation de upsert :
    // - where : cherche l'enregistrement par macAddress
    // - update : si trouvé, met à jour ces champs
    // - create : si non trouvé, crée ce nouvel enregistrement
    const record = await prisma.boxClientInfo.upsert({
      where: {
        macAddress: data.macAddress,
      },
      update: {
        ip: data.ip,
        hostname: data.hostname,
        city: data.city,
        region: data.region,
        country: data.country,
        loc: data.loc,
        org: data.org,
        timezone: data.timezone,
        readme: data.readme,
        // On ne met pas à jour macAddress car c'est la clé de recherche
      },
      create: {
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
        message: "Données enregistrées ou mises à jour avec succès",
        data: record,
      },
      { status: 200 } // 200 OK est souvent préférable à 201 pour une update potentielle
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

export async function GET() {
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