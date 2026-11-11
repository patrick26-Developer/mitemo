import { useState } from "react";
import { StyleSheet, Text, TextInput, View } from "react-native";

import { fieldChrome } from "../../../shared/theme/theme.field";
import { PHONE_COUNTRY_CODE, formatPhoneInput, keepPhoneDigits } from "../model/model.auth-form";
import { AUTH_COLORS } from "../model/model.auth-theme";
import { AuthFieldIcon } from "./icon.auth-field";

/** Props du champ de numéro de téléphone. */
export interface PhoneFieldProps {
  /** Chiffres du numéro local, sans indicatif. */
  readonly digits: string;
  /** Reçoit les chiffres saisis, nettoyés et limités à neuf. */
  readonly onChange: (digits: string) => void;
  /** Délai avant le dessin de l'icône, en millisecondes. */
  readonly iconDelay?: number;
  /** Signale un numéro refusé : bordure et anneau rouges. */
  readonly invalid?: boolean;
}

/**
 * Affiche l'indicatif congolais et la saisie du numéro local.
 * @param props Chiffres courants et saisie.
 * @returns Le champ de téléphone.
 */
export function PhoneField(props: PhoneFieldProps) {
  const { digits, onChange, iconDelay = 0, invalid = false } = props;
  const [focused, setFocused] = useState(false);

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Numéro de téléphone</Text>
      <View testID="phone-field" style={[styles.row, fieldChrome({ focused, invalid })]}>
        <View style={styles.icon}>
          <AuthFieldIcon
            kind="phone"
            color={focused ? AUTH_COLORS.button : AUTH_COLORS.muted}
            delay={iconDelay}
            testID="auth-icon-phone"
          />
        </View>
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
          textContentType="telephoneNumber"
          accessibilityLabel="Numéro de téléphone"
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          style={styles.input}
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
  icon: { paddingLeft: 14, paddingRight: 10 },
  codeBox: {
    height: "100%",
    justifyContent: "center",
    paddingRight: 14,
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
