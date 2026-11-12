import { useState } from "react";
import { Text, TextInput, View } from "react-native";
import type { KeyboardTypeOptions } from "react-native";

import { fieldChrome } from "../../theme/theme.field";

/** Props d'un champ texte de feuille. */
export interface SheetTextFieldProps {
  readonly label: string;
  readonly value: string;
  readonly onChangeText: (value: string) => void;
  /** Clavier adapté à la saisie ; texte libre par défaut. */
  readonly keyboardType?: KeyboardTypeOptions;
  /** Exemple affiché tant que le champ est vide. */
  readonly placeholder?: string;
  /** Explication affichée sous le champ, pour guider la saisie. */
  readonly hint?: string;
  /** Signale une saisie refusée : bordure et anneau rouges. */
  readonly invalid?: boolean;
  /** Nombre maximal de caractères saisissables ; illimité par défaut. */
  readonly maxLength?: number;
}

/**
 * Affiche un champ de saisie avec son libellé et son aide, dans une feuille.
 * Le focus dessine un anneau bleu, une saisie refusée un anneau rouge, comme
 * les champs de shadcn/ui.
 * @param props Libellé, valeur, saisie, clavier, exemple, aide, erreur et longueur maximale.
 * @returns Le champ de feuille.
 */
export function SheetTextField(props: SheetTextFieldProps) {
  const {
    label,
    value,
    onChangeText,
    keyboardType,
    placeholder,
    hint,
    invalid = false,
    maxLength,
  } = props;
  const [focused, setFocused] = useState(false);

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
        maxLength={maxLength}
        placeholder={placeholder}
        placeholderTextColor="#8A90A2"
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        className="h-12 rounded-[14px] border px-4 text-[15px] text-ink"
        style={fieldChrome({ focused, invalid })}
      />
      {hint === undefined ? null : <Text className="text-[12px] leading-4 text-muted">{hint}</Text>}
    </View>
  );
}
