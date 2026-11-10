import { ChevronLeft } from "lucide-react-native";
import { Pressable, View } from "react-native";

import { SearchField } from "../../../shared/components/macros/field.search";
import { PALETTE } from "../../../shared/theme/theme.palette";

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
      <SearchField
        value={value}
        onChangeText={onChangeText}
        placeholder="Rechercher une tontine, une carte…"
        accessibilityLabel="Recherche globale"
        clear={{ label: "Effacer la recherche", onPress: () => onChangeText("") }}
      />
    </View>
  );
}
