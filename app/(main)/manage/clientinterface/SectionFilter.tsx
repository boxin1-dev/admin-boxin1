"use client";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { useQuery } from "@tanstack/react-query";
import { Check, ChevronsUpDown } from "lucide-react";
import * as React from "react";

export type SectionsType = Record<string, string>;

interface SectionFilterProps {
  onSectionSelect?: (section: string, matchingKeys: string[]) => void;
}

export default function SectionFilter({ onSectionSelect }: SectionFilterProps) {
  const [open, setOpen] = React.useState(false);
  const [value, setValue] = React.useState("");

  const {
    isPending,
    error,
    data: sections,
  } = useQuery<SectionsType>({
    queryKey: ["/api/texts"],
    queryFn: () => fetch("/api/texts").then((res) => res.json()),
  });

  // Extraire les sections uniques (tout avant le premier point)
  const sectionNames = React.useMemo(() => {
    const keys = Object.keys(sections || {});
    const uniqueSections = new Set(keys.map((key) => key.split(".")[0]));
    return Array.from(uniqueSections).sort();
  }, [sections]);

  // Fonction pour trouver toutes les clés correspondant à une section
  const findMatchingKeys = React.useCallback(
    (sectionPrefix: string) => {
      const allKeys = Object.keys(sections || {});
      const filterKeys = allKeys.filter((key) =>
        key.startsWith(sectionPrefix + ".")
      );
      console.log(filterKeys);
      return filterKeys;
    },
    [sections]
  );

  if (isPending) return "Loading...";
  if (error) return "An error has occurred: " + error.message;

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-[200px] justify-between"
        >
          {value || "Select section..."}
          <ChevronsUpDown className="opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[300px] p-0">
        <Command>
          <CommandInput placeholder="Search section..." className="h-9" />
          <CommandList>
            <CommandEmpty>No section found.</CommandEmpty>
            <CommandGroup>
              {sectionNames.map((section) => (
                <CommandItem
                  key={section}
                  value={section}
                  onSelect={(currentValue) => {
                    const newValue = currentValue === value ? "" : currentValue;
                    setValue(newValue);
                    setOpen(false);

                    // Trouver toutes les clés correspondantes
                    if (newValue) {
                      const matchingKeys = findMatchingKeys(newValue);
                      onSectionSelect?.(newValue, matchingKeys);
                    }
                  }}
                >
                  {section}
                  <Check
                    className={cn(
                      "ml-auto",
                      value === section ? "opacity-100" : "opacity-0"
                    )}
                  />
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
