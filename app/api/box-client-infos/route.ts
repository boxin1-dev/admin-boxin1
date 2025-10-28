import { NextRequest, NextResponse } from "next/server";

// Interface pour typer les données reçues
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
    // Récupérer les données envoyées par le client
    const data: BoxClientInfoData = await request.json();

    // Validation des données requises
    if (!data.ip) {
      return NextResponse.json(
        {
          success: false,
          error: "L'adresse IP est requise",
        },
        { status: 400 }
      );
    }

    return NextResponse.json(
      {
        success: true,
        message: "Données IP enregistrées avec succès",
        data: data,
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
