import { Search, X } from "lucide-react-native";
import { Pressable, TextInput, View } from "react-native";

import { PALETTE } from "../theme/palette";

/** Props du champ de recherche d'une liste. */
export interface ListSearchFieldProps {
  readonly value: string;
  readonly onChangeText: (value: string) => void;
  readonly onCancel: () => void;
  readonly placeholder: string;
}

/**
 * Affiche le champ de recherche qui remplace les actions de la liste.
 * @param props Valeur, saisie, annulation et texte indicatif.
 * @returns Le champ de recherche.
 */
export function ListSearchField(props: ListSearchFieldProps) {
  const { value, onChangeText, onCancel, placeholder } = props;

  return (
    <View className="flex-1 flex-row items-center gap-2 rounded-[22px] border border-rule-border bg-white px-3 py-2.5">
      <Search size={18} color={PALETTE.muted} />
      <TextInput
        autoFocus
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor={PALETTE.muted}
        accessibilityLabel="Rechercher dans la liste"
        returnKeyType="search"
        className="flex-1 text-[14px] text-ink"
      />
      <Pressable
        accessibilityRole="button"
        accessibilityLabel="Annuler la recherche"
        hitSlop={8}
        onPress={onCancel}
      >
        <X size={18} color={PALETTE.muted} />
      </Pressable>
    </View>
  );
}
