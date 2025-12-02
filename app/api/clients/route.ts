// app/api/clients/route.ts
import prisma from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;

    // Paramètres de pagination
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "10");
    const skip = (page - 1) * limit;

    // Paramètres de filtrage
    const search = searchParams.get("search") || "";
    const country = searchParams.get("country") || "";
    const city = searchParams.get("city") || "";
    const region = searchParams.get("region") || "";

    // Paramètres de tri
    const sortBy = searchParams.get("sortBy") || "createdAt";
    const sortOrder = searchParams.get("sortOrder") || "desc";

    // Construction des filtres
    const where: any = {};

    if (search) {
      where.OR = [
        { ip: { contains: search, mode: "insensitive" } },
        { hostname: { contains: search, mode: "insensitive" } },
        { macAddress: { contains: search, mode: "insensitive" } },
        { org: { contains: search, mode: "insensitive" } },
      ];
    }

    if (country) {
      where.country = { contains: country, mode: "insensitive" };
    }

    if (city) {
      where.city = { contains: city, mode: "insensitive" };
    }

    if (region) {
      where.region = { contains: region, mode: "insensitive" };
    }

    // Récupération des données
    const [clients, total] = await Promise.all([
      prisma.boxClientInfo.findMany({
        where,
        skip,
        take: limit,
        orderBy: {
          [sortBy]: sortOrder,
        },
      }),
      prisma.boxClientInfo.count({ where }),
    ]);

    // Calcul des statistiques
    const stats = await prisma.boxClientInfo.groupBy({
      by: ["country"],
      _count: {
        country: true,
      },
      where,
    });

    return NextResponse.json({
      success: true,
      data: {
        clients,
        pagination: {
          total,
          page,
          limit,
          totalPages: Math.ceil(total / limit),
        },
        stats: {
          byCountry: stats,
          total,
        },
      },
    });
  } catch (error) {
    console.error("Erreur lors de la récupération des clients:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Erreur lors de la récupération des clients",
        details: error instanceof Error ? error.message : "Erreur inconnue",
      },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json(
        { success: false, error: "ID requis" },
        { status: 400 }
      );
    }

    await prisma.boxClientInfo.delete({
      where: { id: parseInt(id) },
    });

    return NextResponse.json({
      success: true,
      message: "Client supprimé avec succès",
    });
  } catch (error) {
    console.error("Erreur lors de la suppression:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Erreur lors de la suppression",
        details: error instanceof Error ? error.message : "Erreur inconnue",
      },
      { status: 500 }
    );
  }
}
