import { useNetworkState } from "expo-network";

import { isOnline } from "../model/model.connection-status";

/**
 * Indique si l'appareil a du réseau, pour bloquer les transactions sans lui.
 * @returns `true` quand l'appareil est connecté.
 */
export function useOnline(): boolean {
  return isOnline(useNetworkState());
}
