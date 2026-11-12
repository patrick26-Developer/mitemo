import { useNetworkState } from "expo-network";
import { useEffect, useState } from "react";

import type { ConnectionStatus } from "../model/model.connection-status";
import { isOnline, nextConnectionStatus } from "../model/model.connection-status";

/** Durée d'affichage de « Connexion rétablie », en millisecondes. */
export const CONNECTION_RESTORED_MS = 2500;

/** Dernier état du réseau vu et état affiché qui en découle. */
interface TrackedConnection {
  readonly online: boolean;
  readonly status: ConnectionStatus;
}

/**
 * Suit le réseau de l'appareil : annonce la coupure tant qu'elle dure, puis le
 * retour du réseau pendant quelques secondes avant de se taire.
 * @returns L'état de la connexion à afficher.
 */
export function useConnectionStatus(): ConnectionStatus {
  const online = isOnline(useNetworkState());
  const [tracked, setTracked] = useState<TrackedConnection>(() => ({
    online,
    status: online ? "online" : "offline",
  }));

  if (tracked.online !== online) {
    setTracked({ online, status: nextConnectionStatus(tracked.status, online) });
  }

  useEffect(() => {
    if (tracked.status !== "restored") return undefined;
    const timer = setTimeout(() => setTracked(silenced), CONNECTION_RESTORED_MS);
    return () => clearTimeout(timer);
  }, [tracked.status]);

  return tracked.status;
}

/**
 * Fait taire l'annonce du retour du réseau, sans oublier l'état vu.
 * @param current Connexion suivie.
 * @returns La même connexion, sans rien à afficher.
 */
function silenced(current: TrackedConnection): TrackedConnection {
  return { ...current, status: "online" };
}
