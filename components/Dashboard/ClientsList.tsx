"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  ChevronLeft,
  ChevronRight,
  Eye,
  MoreVertical,
  Search,
  Trash2,
} from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

interface Client {
  id: number;
  ip: string;
  hostname: string | null;
  city: string | null;
  region: string | null;
  country: string | null;
  loc: string | null;
  org: string | null;
  timezone: string | null;
  macAddress: string;
  createdAt: string;
  updatedAt: string;
}

interface ClientsResponse {
  success: boolean;
  data: {
    clients: Client[];
    pagination: {
      total: number;
      page: number;
      limit: number;
      totalPages: number;
    };
  };
}

export function ClientsList() {
  const queryClient = useQueryClient();

  // États pour les filtres
  const [page, setPage] = useState(1);
  const [limit] = useState(10);
  const [search, setSearch] = useState("");
  const [country, setCountry] = useState("");
  const [sortBy, setSortBy] = useState("createdAt");
  const [sortOrder, setSortOrder] = useState("desc");

  // Query pour récupérer les clients
  const { data, isLoading, error } = useQuery<ClientsResponse>({
    queryKey: [
      "/api/clients",
      { page, limit, search, country, sortBy, sortOrder },
    ],
    queryFn: () => {
      const params = new URLSearchParams({
        page: page.toString(),
        limit: limit.toString(),
        sortBy,
        sortOrder,
      });

      if (search) params.append("search", search);
      if (country) params.append("country", country);

      return fetch(`/api/clients?${params.toString()}`).then((res) =>
        res.json()
      );
    },
  });

  // Mutation pour supprimer un client
  const deleteMutation = useMutation({
    mutationFn: async (id: number) => {
      const response = await fetch(`/api/clients?id=${id}`, {
        method: "DELETE",
      });
      if (!response.ok) throw new Error("Erreur lors de la suppression");
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/clients"] });
      toast.success("Client supprimé avec succès");
    },
    onError: () => {
      toast.error("Erreur lors de la suppression");
    },
  });

  // Liste unique des pays pour le filtre
  // On filtre par Boolean pour s'assurer qu'il n'y a pas de null/undefined,
  // et on ne devrait donc pas se retrouver avec des valeurs "" dans ce tableau.
  const countries = Array.from(
    new Set(data?.data.clients.map((c) => c.country).filter(Boolean))
  );

  if (error) {
    return (
      <Card>
        <CardContent className="p-6">
          <p className="text-destructive">
            Erreur lors du chargement des clients
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Liste des Clients</CardTitle>
        <CardDescription>
          Gérez et visualisez tous vos clients connectés
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Filtres */}
        <div className="flex flex-col gap-4 md:flex-row md:items-center">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Rechercher par IP, MAC, hostname..."
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setPage(1);
              }}
              className="pl-9"
            />
          </div>
          {/*
                <Select
            value={country}
            onValueChange={(value) => {
              setCountry(value);
              setPage(1);
            }}
          >
            <SelectTrigger className="w-full md:w-[200px]">
              <Filter className="mr-2 h-4 w-4" />
              <SelectValue placeholder="Filtrer par pays" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">Tous les pays</SelectItem>
            </SelectContent>
          </Select>

          <Select value={sortBy} onValueChange={setSortBy}>
            <SelectTrigger className="w-full md:w-[180px]">
              <SelectValue placeholder="Trier par" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="createdAt">Date d'ajout</SelectItem>
              <SelectItem value="updatedAt">Dernière mise à jour</SelectItem>
              <SelectItem value="country">Pays</SelectItem>
              <SelectItem value="city">Ville</SelectItem>
            </SelectContent>
          </Select>
                
                
                
                */}
        </div>

        {/* Table */}
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>IP</TableHead>
                <TableHead>MAC Address</TableHead>
                <TableHead>Hostname</TableHead>
                <TableHead>Localisation</TableHead>
                <TableHead>Organisation</TableHead>
                <TableHead>Date d'ajout</TableHead>
                <TableHead className="w-[50px]"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <TableRow>
                  <TableCell colSpan={7} className="h-24 text-center">
                    Chargement...
                  </TableCell>
                </TableRow>
              ) : data?.data.clients.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="h-24 text-center">
                    Aucun client trouvé
                  </TableCell>
                </TableRow>
              ) : (
                data?.data.clients.map((client) => (
                  <TableRow key={client.id}>
                    <TableCell className="font-mono text-sm">
                      {client.ip}
                    </TableCell>
                    <TableCell className="font-mono text-sm">
                      {client.macAddress}
                    </TableCell>
                    <TableCell>
                      {client.hostname || (
                        <span className="text-muted-foreground">-</span>
                      )}
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-col gap-1">
                        {client.city && client.country ? (
                          <>
                            <span className="text-sm">{client.city}</span>
                            <Badge variant="outline" className="w-fit">
                              {client.country}
                            </Badge>
                          </>
                        ) : (
                          <span className="text-muted-foreground">-</span>
                        )}
                      </div>
                    </TableCell>
                    <TableCell className="max-w-[200px] truncate">
                      {client.org || (
                        <span className="text-muted-foreground">-</span>
                      )}
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground">
                      {new Date(client.createdAt).toLocaleDateString("fr-FR")}
                    </TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <MoreVertical className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem>
                            <Eye className="mr-2 h-4 w-4" />
                            Voir détails
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            variant="destructive"
                            onClick={() => deleteMutation.mutate(client.id)}
                          >
                            <Trash2 className="mr-2 h-4 w-4" />
                            Supprimer
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>

        {/* Pagination */}
        {data && data.data.pagination.totalPages > 1 && (
          <div className="flex items-center justify-between">
            <p className="text-sm text-muted-foreground">
              Page {data.data.pagination.page} sur{" "}
              {data.data.pagination.totalPages} ({data.data.pagination.total}{" "}
              clients au total)
            </p>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page === 1}
              >
                <ChevronLeft className="h-4 w-4" />
                Précédent
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setPage((p) => p + 1)}
                disabled={page === data.data.pagination.totalPages}
              >
                Suivant
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
