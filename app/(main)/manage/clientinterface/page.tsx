"use client";
import { useState } from "react";
import SectionFilter from "./SectionFilter";
import TextEntryList from "./TextEntryList";

export default function Page() {
  const [selectedSection, setSelectedSection] = useState<string>("");
  const [matchingKeys, setMatchingKeys] = useState<string[]>([]);

  return (
    <div className="flex flex-1 flex-col">
      <div className="@container/main flex flex-1 flex-col gap-2">
        <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
          {/* Filtre de section */}
          <div className="w-full flex items-center justify-center">
            <SectionFilter
              onSectionSelect={(section, keys) => {
                setSelectedSection(section);
                setMatchingKeys(keys);
              }}
            />
          </div>

          {/* Liste des entrées de texte */}
          <TextEntryList
            section={selectedSection}
            matchingKeys={matchingKeys}
          />
        </div>
      </div>
    </div>
  );
}
