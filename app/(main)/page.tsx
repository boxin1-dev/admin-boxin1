// app/(main)/page.tsx
import { ChartAreaInteractive } from "@/components/Dashboard/ChartAreaInteractive";
import { ClientsList } from "@/components/Dashboard/ClientsList";
import { SectionCards } from "@/components/Dashboard/SectionCards";

export default function Page() {
  return (
    <div className="flex flex-1 flex-col">
      <div className="@container/main flex flex-1 flex-col gap-2">
        <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
          {/* Cartes de statistiques */}
          <SectionCards />

          {/* Graphique d'évolution */}
          <div className="px-4 lg:px-6">
            <ChartAreaInteractive />
          </div>

          {/* Liste des clients */}
          <div className="px-4 lg:px-6">
            <ClientsList />
          </div>
        </div>
      </div>
    </div>
  );
}
