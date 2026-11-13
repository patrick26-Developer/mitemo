import type { ReactNode } from "react";
import { StyleSheet, View } from "react-native";

import { useAutoLock } from "../../session/hook.auto-lock";
import { useActivityStore } from "../../session/store.activity";

/** Props de la zone d'activité. */
export interface ActivityZoneProps {
  readonly children: ReactNode;
}

/**
 * Enveloppe l'application : chaque toucher repousse le verrouillage
 * automatique de la session.
 * @param props Contenu de l'application.
 * @returns La zone qui note les gestes du membre.
 */
export function ActivityZone(props: ActivityZoneProps) {
  useAutoLock();
  const touch = useActivityStore((state) => state.touch);

  return (
    <View style={styles.zone} onTouchStart={() => touch()}>
      {props.children}
    </View>
  );
}

const styles = StyleSheet.create({ zone: { flex: 1 } });
