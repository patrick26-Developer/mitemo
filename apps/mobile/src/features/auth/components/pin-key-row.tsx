import { StyleSheet, View } from "react-native";

import { PinKey } from "./pin-key";

/** Props d'une rangée de chiffres du clavier PIN. */
export interface PinKeyRowProps {
  readonly row: readonly string[];
  readonly onPressDigit: (digit: string) => void;
}

/**
 * Affiche une rangée de trois chiffres du clavier.
 * @param props Chiffres de la rangée et saisie d'un chiffre.
 * @returns La rangée de touches.
 */
export function PinKeyRow(props: PinKeyRowProps) {
  const { row, onPressDigit } = props;

  return (
    <View style={styles.row}>
      {row.map((digit) => (
        <PinKey key={digit} label={digit} onPress={() => onPressDigit(digit)} />
      ))}
    </View>
  );
}

/** Espacement des touches d'une rangée. */
const styles = StyleSheet.create({
  row: { flexDirection: "row", gap: 6 },
});
