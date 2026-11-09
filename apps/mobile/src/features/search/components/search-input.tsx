import { ChevronLeft, Search, X } from "lucide-react-native";
import { Pressable, TextInput, View } from "react-native";

import { PALETTE } from "../../../shared/theme/palette";

/** Props de l'en-tête de recherche globale. */
export interface SearchInputProps {
  readonly value: string;
  readonly onChangeText: (value: string) => void;
  readonly onBack: () => void;
}

/**
 * Affiche le champ de recherche globale, autofocus à l'ouverture.
 * @param props Valeur, saisie et retour à l'écran précédent.
 * @returns L'en-tête de recherche.
 */
export function SearchInput(props: SearchInputProps) {
  const { value, onChangeText, onBack } = props;

  return (
    <View className="flex-row items-center gap-2 px-4">
      <Pressable
        accessibilityRole="button"
        accessibilityLabel="Retour"
        hitSlop={8}
        onPress={onBack}
        className="h-10 w-10 items-center justify-center rounded-full bg-tab-active"
      >
        <ChevronLeft size={22} color={PALETTE.tabInk} strokeWidth={2.2} />
      </Pressable>
      <View className="flex-1 flex-row items-center gap-2 rounded-[22px] border border-rule-border bg-white px-3 py-2.5">
        <Search size={18} color={PALETTE.muted} />
        <TextInput
          autoFocus
          value={value}
          onChangeText={onChangeText}
          placeholder="Rechercher une tontine, une carte…"
          placeholderTextColor={PALETTE.muted}
          accessibilityLabel="Recherche globale"
          returnKeyType="search"
          className="flex-1 text-[15px] text-ink"
        />
        {value.length > 0 ? (
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Effacer la recherche"
            hitSlop={8}
            onPress={() => onChangeText("")}
          >
            <X size={18} color={PALETTE.muted} />
          </Pressable>
        ) : null}
      </View>
    </View>
  );
}
