"use client";
import TextEntryItem from "./TextEntryItem";

interface TextEntryListProps {
  section: string;
  matchingKeys: string[];
}

export default function TextEntryList({
  section,
  matchingKeys,
}: TextEntryListProps) {
  if (!section || matchingKeys.length === 0) {
    return null;
  }

  return (
    <div className="w-full max-w-3xl mx-auto space-y-4">
      {/* En-tête */}
      <div className="border rounded-lg p-4 bg-muted/50">
        <h2 className="text-lg font-semibold">Section: {section}</h2>
        <p className="text-sm text-muted-foreground mt-1">
          {matchingKeys.length} {matchingKeys.length > 1 ? "entrées" : "entrée"}
        </p>
      </div>

      {/* Liste des entrées */}
      <div className="space-y-4">
        {matchingKeys.map((key) => (
          <TextEntryItem key={key} entryKey={key} />
        ))}
      </div>
    </div>
  );
}
