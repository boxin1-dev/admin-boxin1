// components/Dashboard/SectionCards.tsx
"use client";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardAction,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { IconTrendingDown, IconTrendingUp } from "@tabler/icons-react";
import { useQuery } from "@tanstack/react-query";

interface StatsResponse {
  success: boolean;
  data: {
    total: number;
    newThisWeek: number;
    newThisMonth: number;
    growthRate: number;
    byCountry: Array<{ country: string; count: number }>;
    byRegion: Array<{ region: string; count: number }>;
  };
}

export function SectionCards() {
  const {
    data: stats,
    isPending,
    error,
  } = useQuery<StatsResponse>({
    queryKey: ["/api/clients/stats"],
    queryFn: () => fetch("/api/clients/stats").then((res) => res.json()),
  });

  if (isPending) {
    return (
      <div className="grid grid-cols-1 gap-4 px-4 lg:px-6 @xl/main:grid-cols-2 @5xl/main:grid-cols-4">
        {[...Array(4)].map((_, i) => (
          <Card key={i} className="@container/card">
            <CardHeader>
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-8 w-32" />
            </CardHeader>
          </Card>
        ))}
      </div>
    );
  }

  if (error || !stats?.success) {
    return (
      <div className="px-4 lg:px-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-destructive">
              Erreur lors du chargement des statistiques
            </CardTitle>
          </CardHeader>
        </Card>
      </div>
    );
  }

  const { total, newThisWeek, newThisMonth, growthRate } = stats.data;
  const isPositiveGrowth = growthRate >= 0;

  return (
    <div className="*:data-[slot=card]:from-primary/5 *:data-[slot=card]:to-card dark:*:data-[slot=card]:bg-card grid grid-cols-1 gap-4 px-4 *:data-[slot=card]:bg-gradient-to-t *:data-[slot=card]:shadow-xs lg:px-6 @xl/main:grid-cols-2 @5xl/main:grid-cols-4">
      {/* Total Clients */}
      <Card className="@container/card">
        <CardHeader>
          <CardDescription>Total Clients</CardDescription>
          <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
            {total.toLocaleString()}
          </CardTitle>
          <CardAction>
            <Badge variant="outline">
              {isPositiveGrowth ? <IconTrendingUp /> : <IconTrendingDown />}
              {Math.abs(growthRate).toFixed(1)}%
            </Badge>
          </CardAction>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1.5 text-sm">
          <div className="line-clamp-1 flex gap-2 font-medium">
            {isPositiveGrowth ? "En croissance" : "En baisse"} cette semaine
            {isPositiveGrowth ? (
              <IconTrendingUp className="size-4" />
            ) : (
              <IconTrendingDown className="size-4" />
            )}
          </div>
          <div className="text-muted-foreground">
            Nombre total de clients enregistrés
          </div>
        </CardFooter>
      </Card>

      {/* Nouveaux Clients - Semaine */}
      <Card className="@container/card">
        <CardHeader>
          <CardDescription>Nouveaux cette semaine</CardDescription>
          <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
            {newThisWeek}
          </CardTitle>
          <CardAction>
            <Badge variant="outline">
              <IconTrendingUp />+{newThisWeek > 0 ? "100" : "0"}%
            </Badge>
          </CardAction>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1.5 text-sm">
          <div className="line-clamp-1 flex gap-2 font-medium">
            Clients ajoutés récemment <IconTrendingUp className="size-4" />
          </div>
          <div className="text-muted-foreground">7 derniers jours</div>
        </CardFooter>
      </Card>

      {/* Nouveaux Clients - Mois */}
      <Card className="@container/card">
        <CardHeader>
          <CardDescription>Nouveaux ce mois</CardDescription>
          <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
            {newThisMonth}
          </CardTitle>
          <CardAction>
            <Badge variant="outline">
              <IconTrendingUp />
              Mensuel
            </Badge>
          </CardAction>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1.5 text-sm">
          <div className="line-clamp-1 flex gap-2 font-medium">
            Forte activité ce mois <IconTrendingUp className="size-4" />
          </div>
          <div className="text-muted-foreground">30 derniers jours</div>
        </CardFooter>
      </Card>

      {/* Top Pays */}
      <Card className="@container/card">
        <CardHeader>
          <CardDescription>Pays principal</CardDescription>
          <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
            {stats.data.byCountry[0]?.country || "N/A"}
          </CardTitle>
          <CardAction>
            <Badge variant="outline">
              {stats.data.byCountry[0]?.count || 0} clients
            </Badge>
          </CardAction>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1.5 text-sm">
          <div className="line-clamp-1 flex gap-2 font-medium">
            Localisation dominante <IconTrendingUp className="size-4" />
          </div>
          <div className="text-muted-foreground">Répartition géographique</div>
        </CardFooter>
      </Card>
    </div>
  );
}
