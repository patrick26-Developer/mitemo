import { movementsApi } from "../../../shared/api/config.api";
import { useCursorResource } from "../../../shared/hooks/hook.cursor-resource";

/**
 * Raccorde l'historique à la pagination autorisée par le serveur.
 * @returns Mouvements, état réseau et navigation entre les pages.
 */
export function useServerMovements() {
  return useCursorResource(movementsApi.list);
}
