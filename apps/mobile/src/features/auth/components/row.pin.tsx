import { StyleSheet, View } from "react-native";

import { AUTH_COLORS } from "../model/model.auth-theme";
import { PinBox } from "./box.pin";

/** Props de la rangée de cases du PIN. */
export interface PinRowProps {
  /** Chiffres saisis, de 0 à 4 caractères. */
  readonly pin: string;
}

/**
 * Affiche les quatre cases du PIN, séparées en deux groupes.
 * @param props Chiffres saisis.
 * @returns La rangée du code PIN.
 */
export function PinRow(props: PinRowProps) {
  const { pin } = props;

  return (
    <View style={styles.row}>
      <PinBox index={0} value={pin[0]} active={pin.length === 0} />
      <PinBox index={1} value={pin[1]} active={pin.length === 1} />
      <View style={styles.dash} />
      <PinBox index={2} value={pin[2]} active={pin.length === 2} />
      <PinBox index={3} value={pin[3]} active={pin.length === 3} />
    </View>
  );
}

/** Styles de la rangée et du tiret central. */
const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 12,
  },
  dash: { width: 12, height: 2, borderRadius: 1, backgroundColor: AUTH_COLORS.dash },
});
