import { Delete } from "lucide-react-native";
import { StyleSheet, Text, View } from "react-native";

import { AUTH_COLORS } from "../model/auth-theme";
import { PinKey } from "./pin-key";
import { PinKeyRow } from "./pin-key-row";

/** Rangées de chiffres du clavier. */
const PIN_ROWS = [
  ["1", "2", "3"],
  ["4", "5", "6"],
  ["7", "8", "9"],
] as const;

/** Props du clavier PIN. */
export interface PinKeypadProps {
  readonly onPressDigit: (digit: string) => void;
  readonly onErase: () => void;
  /** Ouvre l'aide au code oublié ; absent lors de la création du code. */
  readonly onForgot?: () => void;
}

/**
 * Affiche le clavier numérique du PIN, avec l'oubli et l'effacement.
 * @param props Saisie d'un chiffre, effacement et code oublié.
 * @returns Le clavier PIN.
 */
export function PinKeypad(props: PinKeypadProps) {
  const { onPressDigit, onErase, onForgot } = props;

  return (
    <View style={styles.keypad}>
      {PIN_ROWS.map((row) => (
        <PinKeyRow key={row.join("")} row={row} onPressDigit={onPressDigit} />
      ))}
      <View style={styles.row}>
        {onForgot === undefined ? (
          <View style={styles.placeholder} />
        ) : (
          <PinKey plain accessibilityLabel="Code PIN oublié" onPress={onForgot}>
            <Text style={styles.forgot}>Oublié ?</Text>
          </PinKey>
        )}
        <PinKey label="0" onPress={() => onPressDigit("0")} />
        <PinKey plain accessibilityLabel="Effacer" onPress={onErase}>
          <Delete size={28} color={AUTH_COLORS.keyIcon} strokeWidth={1.6} />
        </PinKey>
      </View>
    </View>
  );
}

/** Styles du clavier et de la touche d'oubli. */
const styles = StyleSheet.create({
  keypad: { marginTop: 28, gap: 6 },
  row: { flexDirection: "row", gap: 6 },
  placeholder: { flex: 1 },
  forgot: { fontSize: 17, color: AUTH_COLORS.ink },
});
