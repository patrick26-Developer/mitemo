import { StyleSheet, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { useConnectionStatus } from "../../hooks/hook.connection-status";
import { SHADOWS } from "../../theme/theme.shadow";
import { ConnectionBar } from "../atoms/bar.connection";

/** Écart entre la barre d'état et la pastille, en points. */
const HOST_TOP_GAP = 8;

/**
 * Annonce l'état du réseau sur toutes les pages : une pastille rouge
 * flottante sous la barre d'état tant que le réseau est coupé, verte quand il
 * revient. Elle ne décale aucun contenu et laisse passer les touchers. Posée
 * à la racine et dans chaque feuille, qui passe au-dessus de tout.
 * @returns La pastille, ou rien quand le réseau est là.
 */
export function ConnectionHost() {
  const status = useConnectionStatus();
  const insets = useSafeAreaInsets();
  if (status === "online") return null;

  return (
    <View
      testID="connection-host"
      pointerEvents="none"
      style={[styles.host, { top: insets.top + HOST_TOP_GAP }]}
    >
      <View style={SHADOWS.toast}>
        <ConnectionBar status={status} />
      </View>
    </View>
  );
}

/** Position de la pastille : en haut, centrée, au-dessus du contenu. */
const styles = StyleSheet.create({
  host: { position: "absolute", left: 0, right: 0, alignItems: "center", zIndex: 20 },
});
