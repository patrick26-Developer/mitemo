import { Search, X } from "lucide-react-native";
import { Pressable, TextInput, View } from "react-native";

import { PALETTE } from "../../theme/theme.palette";

/** Action de la croix d'effacement d'un champ de recherche. */
export interface SearchFieldClear {
  /** Libellé annoncé aux lecteurs d'écran. */
  readonly label: string;
  readonly onPress: () => void;
  /** `true` garde la croix visible même quand le champ est vide. */
  readonly alwaysVisible?: boolean;
}

/** Props d'un champ de recherche. */
export interface SearchFieldProps {
  readonly value: string;
  readonly onChangeText: (value: string) => void;
  readonly placeholder: string;
  /** Libellé du champ pour les lecteurs d'écran. */
  readonly accessibilityLabel: string;
  readonly clear: SearchFieldClear;
  /** `false` pour ne pas ouvrir le clavier à l'affichage ; vrai par défaut. */
  readonly autoFocus?: boolean;
}

/**
 * Affiche un champ de recherche prêt à la saisie, avec sa croix d'effacement.
 * @param props Valeur, saisie, texte indicatif, libellé, effacement et prise de focus.
 * @returns Le champ de recherche.
 */
export function SearchField(props: SearchFieldProps) {
  const { value, onChangeText, placeholder, accessibilityLabel, clear, autoFocus = true } = props;
  const showClear = clear.alwaysVisible === true || value.length > 0;

  return (
    <View className="flex-1 flex-row items-center gap-2 rounded-[22px] border border-rule-border bg-white px-3 py-2.5">
      <Search size={18} color={PALETTE.muted} />
      <TextInput
        autoFocus={autoFocus}
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor={PALETTE.muted}
        accessibilityLabel={accessibilityLabel}
        returnKeyType="search"
        className="flex-1 text-[15px] text-ink"
      />
      {showClear ? (
        <Pressable
          accessibilityRole="button"
          accessibilityLabel={clear.label}
          hitSlop={8}
          onPress={clear.onPress}
        >
          <X size={18} color={PALETTE.muted} />
        </Pressable>
      ) : null}
    </View>
  );
}
