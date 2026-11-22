import { useState } from "react";
import { StyleSheet, Text, TextInput, View } from "react-native";

import { fieldChrome } from "../../../shared/theme/theme.field";
import { PHONE_COUNTRY_CODE, editPhoneDigits, formatPhoneInput } from "../model/model.auth-form";
import { AUTH_COLORS } from "../model/model.auth-theme";
import { FIELD_INPUT_RESET } from "../../../shared/theme/theme.field-input";

/** Props du champ de numéro de téléphone. */
export interface PhoneFieldProps {
  /** Chiffres du numéro local, sans indicatif. */
  readonly digits: string;
  /** Reçoit les chiffres saisis, nettoyés et limités à neuf. */
  readonly onChange: (digits: string) => void;
  /** Signale un numéro refusé : bordure et anneau rouges. */
  readonly invalid?: boolean;
}

/**
 * Affiche l'indicatif congolais et la saisie du numéro local.
 * @param props Chiffres courants, saisie et erreur.
 * @returns Le champ de téléphone.
 */
export function PhoneField(props: PhoneFieldProps) {
  const { digits, onChange, invalid = false } = props;
  const [focused, setFocused] = useState(false);

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Numéro de téléphone</Text>
      <View testID="phone-field" style={[styles.row, fieldChrome({ focused, invalid })]}>
        <View style={styles.codeBox}>
          <Text style={styles.code}>{PHONE_COUNTRY_CODE}</Text>
        </View>
        <TextInput
          value={formatPhoneInput(digits)}
          onChangeText={(value) => onChange(editPhoneDigits(digits, value))}
          placeholder="0X XXX XX XX"
          placeholderTextColor={AUTH_COLORS.placeholder}
          keyboardType="phone-pad"
          autoComplete="tel"
          textContentType="telephoneNumber"
          accessibilityLabel="Numéro de téléphone"
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          style={[FIELD_INPUT_RESET, styles.input]}
        />
      </View>
    </View>
  );
}

/** Styles de la maquette pour le champ téléphone. */
const styles = StyleSheet.create({
  container: { marginBottom: 12 },
  label: { marginBottom: 6, fontSize: 13, fontWeight: "600", color: AUTH_COLORS.body },
  row: {
    flexDirection: "row",
    alignItems: "center",
    height: 54,
    overflow: "hidden",
    borderRadius: 16,
    borderWidth: 1,
    marginTop: 8,
    marginBottom: 16,
  },
  codeBox: {
    height: "100%",
    justifyContent: "center",
    paddingHorizontal: 14,
    borderRightWidth: 1,
    borderRightColor: AUTH_COLORS.border,
  },
  code: { fontSize: 17, color: AUTH_COLORS.body },
  input: {
    flex: 1,
    height: "100%",
    paddingHorizontal: 14,
    fontSize: 18,
    color: AUTH_COLORS.body,
  },
});
