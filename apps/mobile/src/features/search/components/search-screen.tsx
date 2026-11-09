import { router } from "expo-router";
import { useState } from "react";
import { ScrollView, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { DottedBackground } from "../../../shared/components/dotted-background";
import { useDebouncedValue } from "../../../shared/hooks/use-debounced-value";
import { SearchInput } from "./search-input";
import { SearchResults } from "./search-results";

/** Délai de stabilisation de la saisie, en millisecondes. */
const SEARCH_DEBOUNCE = 220;

/**
 * Écran de recherche globale : tontines, cartes, pages et réglages du profil.
 * @returns L'écran de recherche.
 */
export function SearchScreen() {
  const insets = useSafeAreaInsets();
  const [query, setQuery] = useState("");
  const debouncedQuery = useDebouncedValue(query, SEARCH_DEBOUNCE);

  return (
    <View className="flex-1 bg-white" style={{ paddingTop: insets.top + 12 }}>
      <DottedBackground />
      <SearchInput value={query} onChangeText={setQuery} onBack={() => router.back()} />
      <ScrollView
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
        contentContainerClassName="gap-5 px-4 pb-10 pt-5"
      >
        <SearchResults query={query} debouncedQuery={debouncedQuery} onSuggestion={setQuery} />
      </ScrollView>
    </View>
  );
}
