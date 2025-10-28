// Types partagés entre les composants
export type SectionsType = Record<string, string>;

export interface TextEntry {
  key: string;
  value: string;
  lang: string;
}

export interface TextEntryFormData {
  value: string;
  lang?: string;
}

export interface SectionFilterProps {
  onSectionSelect?: (section: string, matchingKeys: string[]) => void;
}
