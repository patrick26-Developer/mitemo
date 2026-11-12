import { savingsApi } from "../../../shared/api/config.api";
import { useCursorResource } from "../../../shared/hooks/hook.cursor-resource";

/**
 * Raccorde la liste aux objectifs appartenant au compte connecté.
 * @returns Objectifs, état réseau, relecture et page suivante.
 */
export function useServerGoals() {
  return useCursorResource(savingsApi.list);
}
