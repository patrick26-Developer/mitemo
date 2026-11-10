import { Pressable, Text, View } from "react-native";

import { SEARCH_SUGGESTIONS } from "../model/model.search-content";

/** Props des suggestions de recherche. */
export interface SearchSuggestionsProps {
  readonly onSelect: (suggestion: string) => void;
}

/**
 * Propose quelques recherches avant la première saisie.
 * @param props Sélection d'une suggestion.
 * @returns Les suggestions de recherche.
 */
export function SearchSuggestions(props: SearchSuggestionsProps) {
  const { onSelect } = props;

  return (
    <View className="gap-4">
      <Text className="text-[13px] font-semibold uppercase text-muted">Suggestions</Text>
      <View className="flex-row flex-wrap gap-2">
        {SEARCH_SUGGESTIONS.map((suggestion) => (
          <Pressable
            key={suggestion}
            accessibilityRole="button"
            accessibilityLabel={`Rechercher ${suggestion}`}
            onPress={() => onSelect(suggestion)}
            className="rounded-full border border-card-border bg-white px-4 py-2"
          >
            <Text className="text-[14px] text-ink">{suggestion}</Text>
          </Pressable>
        ))}
      </View>
      <Text className="text-[14px] leading-5 text-muted">
        Recherchez une tontine, une carte de pointage ou un réglage du profil.
      </Text>
    </View>
  );
}
