import { useState } from "react";
import type { TextInputProps } from "react-native";
import { StyleSheet, Text, TextInput, View } from "react-native";

import { AUTH_COLORS } from "../model/auth-theme";

/** Champs texte de la première étape d'inscription. */
export const AUTH_TEXT_FIELD_KINDS = ["firstName", "lastName", "occupation"] as const;

/** Champ texte de la première étape d'inscription. */
export type AuthTextFieldKind = (typeof AUTH_TEXT_FIELD_KINDS)[number];

/** Contenu affiché pour un champ, libellé et aide compris. */
interface AuthTextFieldContent {
  readonly label: string;
  readonly placeholder: string;
  readonly helper?: string;
  readonly autoComplete: TextInputProps["autoComplete"];
  readonly textContentType: TextInputProps["textContentType"];
}

/** Contenu de chaque champ d'identité. */
const FIELD_CONTENT: Readonly<Record<AuthTextFieldKind, AuthTextFieldContent>> = {
  firstName: {
    label: "Prénom",
    placeholder: "Précieuse",
    autoComplete: "given-name",
    textContentType: "givenName",
  },
  lastName: {
    label: "Nom",
    placeholder: "Mavoungou",
    autoComplete: "family-name",
    textContentType: "familyName",
  },
  occupation: {
    label: "Profession ou formation",
    placeholder: "Commerçante, étudiante…",
    helper: "Sert à adapter vos tontines et votre suivi.",
    autoComplete: "organization-title",
    textContentType: "jobTitle",
  },
};

/** Props d'un champ texte de l'inscription. */
export interface AuthTextFieldProps {
  readonly kind: AuthTextFieldKind;
  readonly value: string;
  readonly onChangeText: (value: string) => void;
}

/**
 * Affiche un libellé visible, un champ de saisie et son aide éventuelle.
 * @param props Champ demandé, valeur et saisie.
 * @returns Le champ texte complet.
 */
export function AuthTextField(props: AuthTextFieldProps) {
  const { kind, value, onChangeText } = props;
  const content = FIELD_CONTENT[kind];
  const [focused, setFocused] = useState(false);

  return (
    <View style={styles.container}>
      <Text style={styles.label}>{content.label}</Text>
      <TextInput
        value={value}
        onChangeText={onChangeText}
        placeholder={content.placeholder}
        placeholderTextColor={AUTH_COLORS.placeholder}
        accessibilityLabel={content.label}
        autoCapitalize="words"
        autoComplete={content.autoComplete}
        textContentType={content.textContentType}
        autoCorrect={false}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        style={[styles.input, focused && styles.inputFocused]}
      />
      {content.helper === undefined ? null : <Text style={styles.helper}>{content.helper}</Text>}
    </View>
  );
}

/** Styles du libellé, du champ et de l'aide. */
const styles = StyleSheet.create({
  container: { marginBottom: 12 },
  label: { marginBottom: 6, fontSize: 13, fontWeight: "600", color: AUTH_COLORS.body },
  input: {
    height: 54,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: AUTH_COLORS.border,
    backgroundColor: AUTH_COLORS.field,
    paddingHorizontal: 16,
    fontSize: 18,
    color: AUTH_COLORS.body,
  },
  inputFocused: { borderColor: AUTH_COLORS.button, borderWidth: 1.5 },
  helper: { marginTop: 4, fontSize: 12, lineHeight: 17, color: AUTH_COLORS.muted },
});
