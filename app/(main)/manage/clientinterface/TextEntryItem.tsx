"use client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Loader2 } from "lucide-react";
import { useForm } from "react-hook-form";
import { TextEntry, TextEntryFormData } from "./types";

interface TextEntryItemProps {
  entryKey: string;
}

export default function TextEntryItem({ entryKey }: TextEntryItemProps) {
  const queryClient = useQueryClient();

  // Récupérer les données de l'entrée
  const { data: entry, isLoading } = useQuery<TextEntry>({
    queryKey: ["/api/text", entryKey],
    queryFn: () => fetch(`/api/text/${entryKey}`).then((res) => res.json()),
  });

  // Initialiser le formulaire avec les valeurs par défaut
  const {
    register,
    handleSubmit,
    formState: { errors, isDirty },
    reset,
  } = useForm<TextEntryFormData>({
    defaultValues: {
      value: entry?.value || "",
      lang: entry?.lang || "fr",
    },
    values: entry ? { value: entry.value, lang: entry.lang } : undefined,
  });

  // Mutation pour mettre à jour
  const updateMutation = useMutation({
    mutationFn: async (data: TextEntryFormData) => {
      const response = await fetch(`/api/text/${entryKey}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          value: data.value,
          lang: data.lang || "fr",
        }),
      });
      if (!response.ok) throw new Error("Failed to update");
      return response.json();
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["/api/texts", entryKey] });
      queryClient.invalidateQueries({ queryKey: ["/api/texts"] });
      reset(data);
    },
  });

  const onSubmit = (data: TextEntryFormData) => {
    updateMutation.mutate(data);
  };

  if (isLoading) {
    return (
      <div className="p-3 rounded-lg border bg-card">
        <div className="flex items-center gap-2">
          <Loader2 className="h-4 w-4 animate-spin" />
          <span className="text-sm text-muted-foreground">Loading...</span>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div className="p-4 rounded-lg border bg-card space-y-3">
        {/* Clé en lecture seule */}
        <div>
          <Label className="font-mono text-xs text-muted-foreground">
            {entryKey}
          </Label>
        </div>

        {/* Input pour la valeur */}
        <div className="space-y-2">
          <Label htmlFor={`value-${entryKey}`}>Valeur</Label>
          <Input
            id={`value-${entryKey}`}
            {...register("value", { required: "La valeur est requise" })}
            placeholder="Entrez la valeur..."
          />
          {errors.value && (
            <p className="text-sm text-destructive">{errors.value.message}</p>
          )}
        </div>

        {/* Input pour la langue (optionnel) */}
        <div className="space-y-2">
          <Label htmlFor={`lang-${entryKey}`}>Langue</Label>
          <Input
            id={`lang-${entryKey}`}
            {...register("lang")}
            placeholder="fr"
            className="w-20"
          />
        </div>

        {/* Bouton Update */}
        <div className="flex justify-end">
          <Button
            type="submit"
            disabled={!isDirty || updateMutation.isPending}
            size="sm"
          >
            {updateMutation.isPending ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Mise à jour...
              </>
            ) : (
              "Mettre à jour"
            )}
          </Button>
        </div>

        {/* Message de succès */}
        {updateMutation.isSuccess && (
          <p className="text-sm text-green-600">✓ Mis à jour avec succès</p>
        )}

        {/* Message d'erreur */}
        {updateMutation.isError && (
          <p className="text-sm text-destructive">
            ✗ Erreur lors de la mise à jour
          </p>
        )}
      </div>
    </form>
  );
}
