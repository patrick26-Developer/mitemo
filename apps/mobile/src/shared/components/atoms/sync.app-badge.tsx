import { useAppBadge } from "../../notifications/hook.app-badge";

/** Props de la synchronisation de la pastille de l'application. */
export interface AppBadgeSyncProps {
  readonly signedIn: boolean;
}

/**
 * Garde la pastille de l'icône de l'application à jour, sans rien afficher.
 * @param props Session ouverte ou non.
 * @returns Rien : le composant ne fait que synchroniser.
 */
export function AppBadgeSync(props: AppBadgeSyncProps) {
  useAppBadge(props.signedIn);
  return null;
}
