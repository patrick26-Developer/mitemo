import { StyleSheet, Text, View } from "react-native";

import { PALETTE } from "../../theme/theme.palette";

/** Props de la pastille de compteur. */
export interface CountBadgeProps {
  /** Texte de la pastille, par exemple « 3 » ou « 9+ ». */
  readonly label: string;
}

/**
 * Pastille rouge posée en haut à droite d'une icône : le nombre de
 * notifications non lues, « 9+ » au-delà de neuf. Son parent doit être
 * positionné pour la recevoir.
 * @param props Texte de la pastille.
 * @returns La pastille.
 */
export function CountBadge(props: CountBadgeProps) {
  return (
    <View testID="count-badge" pointerEvents="none" style={styles.badge}>
      <Text style={styles.label}>{props.label}</Text>
    </View>
  );
}

/** Position et cercle de la pastille, que Tailwind n'exprime pas côté natif. */
const styles = StyleSheet.create({
  badge: {
    position: "absolute",
    top: -7,
    right: -9,
    minWidth: 19,
    height: 19,
    paddingHorizontal: 4,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: PALETTE.white,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: PALETTE.danger,
  },
  label: { color: PALETTE.white, fontSize: 10, fontWeight: "700", lineHeight: 12 },
});
