import { Text, TextInput, View } from "react-native";
import type { KeyboardTypeOptions } from "react-native";

/** Props d'un champ texte de feuille. */
export interface SheetTextFieldProps {
  readonly label: string;
  readonly value: string;
  readonly onChangeText: (value: string) => void;
  /** Clavier adapté à la saisie ; texte libre par défaut. */
  readonly keyboardType?: KeyboardTypeOptions;
  /** Exemple affiché tant que le champ est vide. */
  readonly placeholder?: string;
}

/**
 * Affiche un champ de saisie avec son libellé, dans une feuille.
 * @param props Libellé, valeur, saisie, clavier et exemple.
 * @returns Le champ de feuille.
 */
export function SheetTextField(props: SheetTextFieldProps) {
  const { label, value, onChangeText, keyboardType, placeholder } = props;

  return (
    <View className="gap-1.5">
      <Text className="text-[12px] font-semibold uppercase text-muted">{label}</Text>
      <TextInput
        value={value}
        onChangeText={onChangeText}
        accessibilityLabel={label}
        autoCapitalize="words"
        autoCorrect={false}
        keyboardType={keyboardType}
        placeholder={placeholder}
        placeholderTextColor="#8A90A2"
        className="h-12 rounded-[14px] border border-card-border bg-brand-veil px-4 text-[15px] text-ink"
      />
    </View>
  );
}
