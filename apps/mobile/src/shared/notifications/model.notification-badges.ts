import type { AppNotification, NotificationArea } from "./model.notification";

/** Nombre au-delà duquel la pastille affiche « 9+ ». */
const BADGE_MAX = 9;

/** Endroits qui marquent les notifications vues : la cloche et deux onglets. */
export const SEEN_SCOPES = ["bell", "tontines", "savings"] as const;

/** Endroit qui marque les notifications vues. Voir {@link SEEN_SCOPES}. */
export type SeenScope = (typeof SEEN_SCOPES)[number];

/** Notifications déjà vues à chaque endroit, par identifiant. */
export type SeenIds = Readonly<Record<SeenScope, readonly string[]>>;

/** Compteurs des pastilles : la cloche, puis Tontines et Cartes. */
export type BadgeCounts = Readonly<Record<SeenScope, number>>;

/**
 * Notifications qu'un endroit montre : toutes pour la cloche, celles de son
 * onglet sinon.
 * @param notifications Notifications du membre.
 * @param scope Endroit concerné.
 * @returns Les notifications de cet endroit.
 */
export function inScope(
  notifications: readonly AppNotification[],
  scope: SeenScope,
): readonly AppNotification[] {
  return scope === "bell" ? notifications : notifications.filter((item) => item.area === scope);
}

/**
 * Compte les tontines (ou cartes) qui ont reçu une notification depuis la
 * dernière visite de l'onglet, comme les discussions non lues d'une
 * messagerie : deux notifications d'une même tontine comptent pour une.
 * @param notifications Notifications du membre.
 * @param area Onglet concerné.
 * @param seen Notifications déjà vues dans cet onglet.
 * @returns Le nombre de sujets avec du nouveau.
 */
function areaCount(
  notifications: readonly AppNotification[],
  area: NotificationArea,
  seen: readonly string[],
): number {
  const fresh = inScope(notifications, area).filter((item) => !seen.includes(item.id));
  return new Set(fresh.map((item) => item.subject)).size;
}

/**
 * Calcule les pastilles : la cloche compte les notifications pas encore vues,
 * chaque onglet les tontines ou cartes qui en ont reçu de nouvelles.
 * @param notifications Notifications du membre.
 * @param seen Notifications déjà vues à chaque endroit.
 * @returns Les compteurs des pastilles.
 */
export function badgeCounts(notifications: readonly AppNotification[], seen: SeenIds): BadgeCounts {
  return {
    bell: notifications.filter((item) => !seen.bell.includes(item.id)).length,
    tontines: areaCount(notifications, "tontines", seen.tontines),
    savings: areaCount(notifications, "savings", seen.savings),
  };
}

/**
 * Texte de la pastille d'un compteur.
 * @param count Nombre à afficher.
 * @returns Le nombre, « 9+ » au-delà de 9, ou `null` quand il n'y a rien.
 */
export function badgeLabel(count: number): string | null {
  if (count <= 0) return null;
  return count > BADGE_MAX ? `${BADGE_MAX}+` : String(count);
}
