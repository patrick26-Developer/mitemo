import { Text, View } from "react-native";

import type { SearchGroup as SearchGroupContent } from "../model/search-content";
import { SearchResultRow } from "./search-result-row";

/** Props d'un groupe de résultats. */
export interface SearchGroupProps {
  readonly group: SearchGroupContent;
}

/**
 * Affiche un groupe de résultats sous son titre.
 * @param props Groupe à afficher.
 * @returns La section de résultats.
 */
export function SearchGroup(props: SearchGroupProps) {
  const { group } = props;

  return (
    <View className="gap-2">
      <Text className="text-[12px] font-semibold uppercase text-muted">{group.title}</Text>
      {group.results.map((entry) => (
        <SearchResultRow key={entry.id} entry={entry} />
      ))}
    </View>
  );
}
