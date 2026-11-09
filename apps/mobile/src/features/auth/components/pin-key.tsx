import type { ReactNode } from "react";
import { StyleSheet, Text, View } from "react-native";

import { PressableScale } from "../../../shared/components/pressable-scale";
import { AUTH_COLORS } from "../model/auth-theme";

/** Props d'une touche du clavier PIN. */
export interface PinKeyProps {
  /** Libellé affiché, pour une touche numérique. */
  readonly label?: string;
  readonly onPress: () => void;
  /** Fond transparent, pour les actions secondaires. */
  readonly plain?: boolean;
  /** Contenu personnalisé, prioritaire sur le libellé. */
  readonly children?: ReactNode;
  /** Libellé d'accessibilité, utile quand la touche affiche une icône. */
  readonly accessibilityLabel?: string;
}

/**
 * Affiche une touche du clavier, qui se rétracte légèrement à l'appui.
 * @param props Libellé, action, style et contenu de la touche.
 * @returns La touche du clavier.
 */
export function PinKey(props: PinKeyProps) {
  const { label, onPress, plain = false, children, accessibilityLabel } = props;

  return (
    <PressableScale
      accessibilityLabel={accessibilityLabel ?? label ?? "Touche"}
      onPress={onPress}
      scaleTo={0.93}
      className="flex-1"
    >
      <View style={[styles.key, plain && styles.plain]}>
        {children ?? <Text style={styles.text}>{label}</Text>}
      </View>
    </PressableScale>
  );
}

/** Styles d'une touche, repris de la maquette. */
const styles = StyleSheet.create({
  key: {
    height: 54,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 10,
    backgroundColor: AUTH_COLORS.key,
  },
  plain: { backgroundColor: "transparent" },
  text: { fontSize: 24, color: AUTH_COLORS.ink },
});
