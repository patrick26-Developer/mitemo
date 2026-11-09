import { StyleSheet, TextInput } from "react-native";

import { AUTH_COLORS } from "../model/auth-theme";

/** Props d'un champ texte simple du parcours d'inscription. */
export interface AuthTextFieldProps {
  readonly placeholder: string;
  readonly value: string;
  readonly onChangeText: (value: string) => void;
  readonly accessibilityLabel: string;
}

/**
 * Affiche un champ de saisie arrondi, aligné sur les champs de la maquette.
 * @param props Texte indicatif, valeur, saisie et libellé d'accessibilité.
 * @returns Le champ texte.
 */
export function AuthTextField(props: AuthTextFieldProps) {
  const { placeholder, value, onChangeText, accessibilityLabel } = props;

  return (
    <TextInput
      value={value}
      onChangeText={onChangeText}
      placeholder={placeholder}
      placeholderTextColor={AUTH_COLORS.placeholder}
      accessibilityLabel={accessibilityLabel}
      autoCapitalize="words"
      autoCorrect={false}
      style={styles.input}
    />
  );
}

/** Style du champ, identique à celui du numéro de téléphone. */
const styles = StyleSheet.create({
  input: {
    height: 54,
    marginBottom: 12,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: AUTH_COLORS.border,
    backgroundColor: AUTH_COLORS.field,
    paddingHorizontal: 16,
    fontSize: 18,
    color: AUTH_COLORS.body,
  },
});
