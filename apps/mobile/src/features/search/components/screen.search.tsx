import { router } from "expo-router";
import { useState } from "react";
import { ScrollView } from "react-native";

import { ScreenFrame } from "../../../shared/components/macros/frame.screen";
import { useDebouncedValue } from "../../../shared/hooks/hook.debounced-value";
import { SearchInput } from "./input.search";
import { SearchResults } from "./results.search";

/** Délai de stabilisation de la saisie, en millisecondes. */
const SEARCH_DEBOUNCE = 220;

/**
 * Écran de recherche globale : tontines, cartes, pages et réglages du profil.
 * @returns L'écran de recherche.
 */
export function SearchScreen() {
  const [query, setQuery] = useState("");
  const debouncedQuery = useDebouncedValue(query, SEARCH_DEBOUNCE);

  return (
    <ScreenFrame>
      <SearchInput value={query} onChangeText={setQuery} onBack={() => router.back()} />
      <ScrollView
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
        contentContainerClassName="gap-5 px-4 pb-10 pt-5"
      >
        <SearchResults query={query} debouncedQuery={debouncedQuery} onSuggestion={setQuery} />
      </ScrollView>
    </ScreenFrame>
  );
}
