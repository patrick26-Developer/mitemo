import { useState } from "react";
import { StyleSheet, Text, TextInput, View } from "react-native";

import { PHONE_COUNTRY_CODE, formatPhoneInput, keepPhoneDigits } from "../model/auth-form";
import { AUTH_COLORS } from "../model/auth-theme";

/** Props du champ de numéro de téléphone. */
export interface PhoneFieldProps {
  /** Chiffres du numéro local, sans indicatif. */
  readonly digits: string;
  /** Reçoit les chiffres saisis, nettoyés et limités à neuf. */
  readonly onChange: (digits: string) => void;
}

/**
 * Affiche l'indicatif congolais et la saisie du numéro local.
 * @param props Chiffres courants et saisie.
 * @returns Le champ de téléphone.
 */
export function PhoneField(props: PhoneFieldProps) {
  const { digits, onChange } = props;
  const [focused, setFocused] = useState(false);

  return (
    <View style={[styles.row, focused && styles.rowFocused]}>
      <View style={styles.codeBox}>
        <Text style={styles.code}>{PHONE_COUNTRY_CODE}</Text>
      </View>
      <TextInput
        value={formatPhoneInput(digits)}
        onChangeText={(value) => onChange(keepPhoneDigits(value))}
        placeholder="06 570 66 22"
        placeholderTextColor={AUTH_COLORS.placeholder}
        keyboardType="phone-pad"
        autoComplete="tel"
        accessibilityLabel="Numéro de téléphone"
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        style={styles.input}
      />
    </View>
  );
}

/** Styles de la maquette pour le champ téléphone. */
const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    alignItems: "center",
    height: 54,
    marginBottom: 12,
    overflow: "hidden",
    borderRadius: 16,
    borderWidth: 1,
    borderColor: AUTH_COLORS.border,
    backgroundColor: AUTH_COLORS.field,
  },
  rowFocused: { borderColor: AUTH_COLORS.button, borderWidth: 1.5 },
  codeBox: {
    height: "100%",
    justifyContent: "center",
    paddingHorizontal: 16,
    borderRightWidth: 1,
    borderRightColor: AUTH_COLORS.border,
  },
  code: { fontSize: 17, color: AUTH_COLORS.body },
  input: {
    flex: 1,
    height: "100%",
    paddingHorizontal: 16,
    fontSize: 18,
    color: AUTH_COLORS.body,
  },
});
