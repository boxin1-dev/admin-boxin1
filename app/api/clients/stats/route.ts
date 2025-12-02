import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    // Total des clients
    const totalClients = await prisma.boxClientInfo.count();

    // Nouveaux clients cette semaine
    const oneWeekAgo = new Date();
    oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);

    const newClientsThisWeek = await prisma.boxClientInfo.count({
      where: {
        createdAt: {
          gte: oneWeekAgo,
        },
      },
    });

    // Nouveaux clients ce mois
    const oneMonthAgo = new Date();
    oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1);

    const newClientsThisMonth = await prisma.boxClientInfo.count({
      where: {
        createdAt: {
          gte: oneMonthAgo,
        },
      },
    });

    // Répartition par pays (top 5)
    const byCountry = await prisma.boxClientInfo.groupBy({
      by: ["country"],
      _count: {
        country: true,
      },
      orderBy: {
        _count: {
          country: "desc",
        },
      },
      take: 5,
    });

    // Répartition par région (top 5)
    const byRegion = await prisma.boxClientInfo.groupBy({
      by: ["region"],
      _count: {
        region: true,
      },
      where: {
        region: {
          not: null,
        },
      },
      orderBy: {
        _count: {
          region: "desc",
        },
      },
      take: 5,
    });

    // Clients par jour sur les 30 derniers jours
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const clientsPerDay = await prisma.$queryRaw<
      Array<{ date: string; count: number }>
    >`
      SELECT 
        DATE("createdAt") as date, -- CORRECTION: Utilisation de "createdAt" entre guillemets doubles
        COUNT(*)::int as count
      FROM box_client_info
      WHERE "createdAt" >= ${thirtyDaysAgo} -- CORRECTION: Utilisation de "createdAt" entre guillemets doubles
      GROUP BY DATE("createdAt")
      ORDER BY date ASC
    `;

    // Calcul du taux de croissance
    const twoWeeksAgo = new Date();
    twoWeeksAgo.setDate(twoWeeksAgo.getDate() - 14);

    const clientsLastWeek = await prisma.boxClientInfo.count({
      where: {
        createdAt: {
          gte: twoWeeksAgo,
          lt: oneWeekAgo,
        },
      },
    });

    const growthRate =
      clientsLastWeek > 0
        ? ((newClientsThisWeek - clientsLastWeek) / clientsLastWeek) * 100
        : 0;

    return NextResponse.json({
      success: true,
      data: {
        total: totalClients,
        newThisWeek: newClientsThisWeek,
        newThisMonth: newClientsThisMonth,
        growthRate: Number(growthRate.toFixed(2)),
        byCountry: byCountry.map((item) => ({
          country: item.country || "Unknown",
          count: item._count.country,
        })),
        byRegion: byRegion.map((item) => ({
          region: item.region || "Unknown",
          count: item._count.region,
        })),
        timeline: clientsPerDay.map((item) => ({
          date: item.date,
          count: item.count,
        })),
      },
    });
  } catch (error) {
    console.error("Erreur lors de la récupération des statistiques:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Erreur lors de la récupération des statistiques",
        details: error instanceof Error ? error.message : "Erreur inconnue",
      },
      { status: 500 }
    );
  }
}
